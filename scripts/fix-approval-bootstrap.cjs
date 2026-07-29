const fs = require('fs')
const usersPath = 'src/collections/Users.ts'
let t = fs.readFileSync(usersPath, 'utf8')

// Replace beforeChange create/update logic with fixed bootstrap-aware version
const newHooks = `hooks: {
    beforeLogin: [
      async ({ user }) => {
        if (!user) return
        if ((user as U)?.approvalStatus !== 'approved') {
          throw new Error(
            'Your account is pending Super Admin approval. Contact tech@prowinproperties.com.',
          )
        }
      },
    ],
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        const actor = req.user as U
        const isLocalBootstrap = !actor // seed / local API without logged-in user

        if (operation === 'create') {
          // Bootstrap Super Admin (seed) may be created already approved
          const bootstrappingSuper =
            isLocalBootstrap && data.role === 'superadmin' && data.approvalStatus === 'approved'

          if (bootstrappingSuper || (isSuper(actor) && data.approvalStatus === 'approved')) {
            // keep approved
          } else if (isLocalBootstrap) {
            data.approvalStatus = 'pending'
            data.role = data.role && data.role !== 'superadmin' ? data.role : 'editor'
          } else {
            // Team-created accounts always need Super Admin approval
            data.approvalStatus = 'pending'
            if (data.role === 'superadmin' && !isSuper(actor)) {
              data.role = 'editor'
            }
          }
        }

        if (operation === 'update') {
          // Logged-in non-super users cannot change approval / promote to superadmin
          if (actor && !isSuper(actor)) {
            if (data.approvalStatus && data.approvalStatus !== originalDoc?.approvalStatus) {
              delete data.approvalStatus
            }
            if (data.role === 'superadmin') {
              data.role = originalDoc?.role || 'editor'
            }
          } else if (
            data.approvalStatus === 'approved' &&
            originalDoc?.approvalStatus !== 'approved'
          ) {
            data.approvedAt = new Date().toISOString()
            data.approvedByEmail = actor?.email || 'system'
          }
        }

        return data
      },
    ],
  },`

if (!t.includes('bootstrappingSuper') && !t.includes('isLocalBootstrap')) {
  t = t.replace(/hooks: \{[\s\S]*?\n  \},/, newHooks)
  fs.writeFileSync(usersPath, t, 'utf8')
  console.log('hooks patched')
} else {
  console.log('hooks already patched?')
}

// Also loosen field access for approvalStatus to allow local override via updateAccess false when no user - use custom update access that allows !user for local
t = fs.readFileSync(usersPath, 'utf8')
t = t.replace(
  /name: 'approvalStatus',\n[\s\S]*?access: \{\n\s*update: \(\{ req: \{ user \} \}\) => isSuper\(user as U\),/,
  `name: 'approvalStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending approval', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      access: {
        update: ({ req: { user } }) => !user || isSuper(user as U),`,
)
fs.writeFileSync(usersPath, t, 'utf8')
t = fs.readFileSync(usersPath, 'utf8')
t = t.replace(
  /name: 'role',\n[\s\S]*?access: \{\n\s*update: \(\{ req: \{ user \} \}\) => isSuper\(user as U\),/,
  `name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        update: ({ req: { user } }) => !user || isSuper(user as U),`,
)
fs.writeFileSync(usersPath, t, 'utf8')
console.log('field access patched')

const fs = require('fs')
const crypto = require('crypto')

const tempPassword = 'ProWin!' + crypto.randomBytes(4).toString('hex') + '#A9'
fs.writeFileSync('src/.superadmin-temp-password.txt', tempPassword, 'utf8')
console.log('temp password generated (saved locally)')

const usersTs = `import type { CollectionConfig, Access } from 'payload'

type U = { role?: string; approvalStatus?: string } | null

const isSuper = (user: U) => user?.role === 'superadmin'
const isAdminLike = (user: U) => user?.role === 'superadmin' || user?.role === 'admin'
const isApproved = (user: U) => user?.approvalStatus === 'approved'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Team',
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'approvalStatus', 'updatedAt'],
    description: 'New accounts stay Pending until Super Admin approves them.',
  },
  auth: true,
  hooks: {
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
        if (operation === 'create') {
          const actor = req.user as U
          // Only an existing Super Admin can create a pre-approved account
          if (isSuper(actor) && data.approvalStatus === 'approved') {
            // keep approved if superadmin explicitly set it
          } else if (!actor) {
            // Public first-time create (should normally not happen once seeded)
            data.approvalStatus = 'pending'
            data.role = data.role || 'editor'
          } else {
            // Any team-created user needs Super Admin approval
            data.approvalStatus = 'pending'
            if (data.role === 'superadmin' && !isSuper(actor)) {
              data.role = 'editor'
            }
          }
        }

        if (operation === 'update') {
          const actor = req.user as U
          // Only Super Admin can change approval or promote to Super Admin
          if (!isSuper(actor)) {
            if (data.approvalStatus && data.approvalStatus !== originalDoc?.approvalStatus) {
              delete data.approvalStatus
            }
            if (data.role === 'superadmin') {
              data.role = originalDoc?.role || 'editor'
            }
          }
        }

        return data
      },
    ],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user) && isApproved(user as U),
    create: async ({ req }) => {
      const actor = req.user as U
      if (isAdminLike(actor) && isApproved(actor)) return true
      // Allow bootstrap only when zero users exist
      const existing = await req.payload.find({ collection: 'users', limit: 1 })
      return existing.totalDocs === 0
    },
    update: ({ req: { user } }) => isAdminLike(user as U) && isApproved(user as U),
    delete: ({ req: { user } }) => isSuper(user as U),
    admin: ({ req: { user } }) => Boolean(user) && isApproved(user as U),
    unlock: ({ req: { user } }) => isSuper(user as U),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Super Admin', value: 'superadmin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        update: ({ req: { user } }) => isSuper(user as U),
      },
      admin: {
        description:
          'Super Admin approves users and manages security. Admins manage content. Editors edit pages.',
      },
    },
    {
      name: 'approvalStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending approval', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      access: {
        update: ({ req: { user } }) => isSuper(user as U),
      },
      admin: {
        description: 'Only Super Admin can approve or reject new users. Pending users cannot log in.',
        components: {},
      },
    },
    {
      name: 'approvedAt',
      type: 'date',
      admin: {
        readOnly: true,
        condition: (_, sibling) => sibling?.approvalStatus === 'approved',
      },
    },
    {
      name: 'approvedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        readOnly: true,
        condition: (_, sibling) => sibling?.approvalStatus === 'approved',
      },
    },
  ],
}
`

fs.writeFileSync('src/collections/Users.ts', usersTs, 'utf8')

const seed = `import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../payload.config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const EMAIL = 'tech@prowinproperties.com'

async function run() {
  const payload = await getPayload({ config })
  const passwordPath = path.join(__dirname, '../.superadmin-temp-password.txt')
  const password = fs.readFileSync(passwordPath, 'utf8').trim()

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: EMAIL } },
    limit: 1,
  })

  if (existing.docs[0]) {
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: {
        role: 'superadmin',
        approvalStatus: 'approved',
        name: 'ProWin Super Admin',
        approvedAt: new Date().toISOString(),
      },
    })
    // Reset password via local API
    await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: { password },
    })
    console.log('Updated existing Super Admin:', EMAIL)
  } else {
    await payload.create({
      collection: 'users',
      data: {
        email: EMAIL,
        password,
        name: 'ProWin Super Admin',
        role: 'superadmin',
        approvalStatus: 'approved',
        approvedAt: new Date().toISOString(),
      },
    })
    console.log('Created Super Admin:', EMAIL)
  }

  // Downgrade any other accidental superadmins if needed ? skip
  // Mark any approved-less users pending (safety)
  const all = await payload.find({ collection: 'users', limit: 200 })
  for (const u of all.docs) {
    if (u.email === EMAIL) continue
    if (!u.approvalStatus) {
      await payload.update({
        collection: 'users',
        id: u.id,
        data: { approvalStatus: 'pending' },
      })
    }
  }

  console.log('SUPERADMIN_EMAIL=' + EMAIL)
  console.log('SUPERADMIN_TEMP_PASSWORD=' + password)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
`

fs.writeFileSync('src/seed/superadmin.ts', seed, 'utf8')

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
pkg.scripts['seed:superadmin'] = 'cross-env NODE_OPTIONS=--no-deprecation tsx src/seed/superadmin.ts'
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2))

// Ensure .gitignore has the password file
let gi = fs.readFileSync('.gitignore', 'utf8')
if (!gi.includes('.superadmin-temp-password.txt')) {
  gi += '\\nsrc/.superadmin-temp-password.txt\\n'
  fs.writeFileSync('.gitignore', gi, 'utf8')
}

console.log('Users security + seed written')

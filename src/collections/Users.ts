import type { CollectionConfig } from 'payload'

type U = { id?: string | number; email?: string; role?: string; approvalStatus?: string } | null

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
  auth: {
    cookies: {
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
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
  },
  access: {
    read: ({ req: { user } }) => Boolean(user) && isApproved(user as U),
    create: async ({ req }) => {
      const actor = req.user as U
      if (isAdminLike(actor) && isApproved(actor)) return true
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
        update: ({ req: { user } }) => !user || isSuper(user as U),
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
        update: ({ req: { user } }) => !user || isSuper(user as U),
      },
      admin: {
        description: 'Only Super Admin can approve or reject. Pending users cannot log in.',
      },
    },
    {
      name: 'approvedAt',
      type: 'date',
      admin: {
        readOnly: true,
        condition: (_: unknown, sibling: { approvalStatus?: string }) =>
          sibling?.approvalStatus === 'approved',
      },
    },
    {
      name: 'approvedByEmail',
      type: 'text',
      admin: {
        readOnly: true,
        condition: (_: unknown, sibling: { approvalStatus?: string }) =>
          sibling?.approvalStatus === 'approved',
      },
    },
  ],
}

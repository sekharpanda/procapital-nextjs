import type { CollectionConfig } from 'payload'

type U = { role?: string; approvalStatus?: string } | null
const isApproved = (user: U) => Boolean(user) && user?.approvalStatus === 'approved'
const isAdminLike = (user: U) =>
  isApproved(user) && (user?.role === 'admin' || user?.role === 'superadmin')
const canEditSite = (user: U) =>
  isApproved(user) &&
  (user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'editor')

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media & brand',
    description: 'Upload images here, then pick them inside page Section blocks (Image, Hero, Services…).',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => canEditSite(user as U),
    update: ({ req: { user } }) => canEditSite(user as U),
    delete: ({ req: { user } }) => isAdminLike(user as U),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}

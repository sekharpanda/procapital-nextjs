import type { GlobalConfig } from 'payload'

type U = { role?: string; approvalStatus?: string } | null
const canEditSite = (user: U) =>
  Boolean(user) &&
  user?.approvalStatus === 'approved' &&
  (user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'editor')

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Site structure',
    description: 'Footer columns, social links and legal copy.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => canEditSite(user as U),
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Layout',
          fields: [
            {
              name: 'style',
              type: 'select',
              defaultValue: 'columns',
              options: [
                { label: 'Multi-column', value: 'columns' },
                { label: 'Simple centered', value: 'simple' },
                { label: 'Compact', value: 'compact' },
              ],
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'aboutText', type: 'textarea' },
            {
              name: 'menu',
              type: 'relationship',
              relationTo: 'menus',
              admin: { description: 'Optional footer menu (flat links)' },
            },
          ],
        },
        {
          label: 'Columns',
          fields: [
            {
              name: 'columns',
              type: 'array',
              labels: { singular: 'Column', plural: 'Columns' },
              fields: [
                { name: 'title', type: 'text', required: true },
                {
                  name: 'links',
                  type: 'array',
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    { name: 'url', type: 'text', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Social & legal',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'LinkedIn', value: 'linkedin' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'X / Twitter', value: 'x' },
                    { label: 'YouTube', value: 'youtube' },
                  ],
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
            { name: 'copyrightText', type: 'text' },
            { name: 'disclaimer', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}

import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  admin: {
    group: 'Site structure',
    description: 'Logo, navigation style, CTAs and top bar.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
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
              defaultValue: 'classic',
              options: [
                { label: 'Classic (logo left, links right)', value: 'classic' },
                { label: 'Centered logo', value: 'centered' },
                { label: 'Minimal', value: 'minimal' },
              ],
            },
            { name: 'sticky', type: 'checkbox', defaultValue: true },
            { name: 'showTopBar', type: 'checkbox', defaultValue: false },
            {
              name: 'topBarText',
              type: 'text',
              admin: { condition: (_, s) => Boolean(s?.showTopBar) },
            },
            { name: 'showTicker', type: 'checkbox', defaultValue: true },
            { name: 'showPhone', type: 'checkbox', defaultValue: true },
            {
              name: 'menu',
              type: 'relationship',
              relationTo: 'menus',
              admin: { description: 'Primary header menu' },
            },
          ],
        },
        {
          label: 'Brand & CTA',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
            },
            { name: 'logoText', type: 'text', defaultValue: 'ProCapital' },
            { name: 'ctaLabel', type: 'text', defaultValue: 'Get pre-approved' },
            { name: 'ctaLink', type: 'text', defaultValue: '#contact' },
            {
              name: 'ctaStyle',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Outline', value: 'outline' },
                { label: 'Hidden', value: 'hidden' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

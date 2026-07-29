import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'General settings',
  admin: {
    group: 'Site structure',
    description: 'Brand identity, contact details and ticker rates.',
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
          label: 'Brand',
          fields: [
            { name: 'siteName', type: 'text', required: true, defaultValue: 'ProCapital' },
            { name: 'tagline', type: 'text', defaultValue: 'Independent mortgage advice in Dubai' },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Default site logo (header/footer can override).' },
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Social share image (1200?630)' },
            },
            {
              name: 'primaryColor',
              type: 'text',
              defaultValue: '#0E4D5C',
              admin: { description: 'Brand primary (hex)' },
            },
            {
              name: 'accentColor',
              type: 'text',
              defaultValue: '#3E9C6B',
              admin: { description: 'Accent / CTA green (hex)' },
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'phone', type: 'text', required: true, defaultValue: '+971 58 810 3755' },
            { name: 'phoneHref', type: 'text', required: true, defaultValue: '+971588103755' },
            { name: 'email', type: 'text', required: true, defaultValue: 'info@procapital.ae' },
            { name: 'whatsappNumber', type: 'text', required: true, defaultValue: '971588103755' },
            { name: 'whatsappMessage', type: 'text', defaultValue: "Hi ProCapital, I'd like mortgage advice." },
            { name: 'addressLine', type: 'text', defaultValue: 'Dubai, United Arab Emirates' },
          ],
        },
        {
          label: 'Ticker',
          fields: [
            {
              name: 'tickerItems',
              type: 'array',
              labels: { singular: 'Item', plural: 'Ticker items' },
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Legal',
          fields: [
            { name: 'footerDisclaimer', type: 'textarea', required: true },
            { name: 'guideDisclaimer', type: 'textarea' },
          ],
        },
      ],
    },
  ],
}

const fs = require('fs')
const path = require('path')
const root = 'C:/Users/PROWIN/Desktop/procapital-nextjs'

function w(rel, content) {
  const p = path.join(root, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content, 'utf8')
  console.log('wrote', rel)
}

w('src/collections/Menus.ts', `import type { CollectionConfig } from 'payload'

const isLoggedIn = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

const linkFields = [
  { name: 'label', type: 'text' as const, required: true },
  {
    name: 'linkType',
    type: 'select' as const,
    defaultValue: 'custom',
    options: [
      { label: 'Custom URL', value: 'custom' },
      { label: 'Internal page', value: 'page' },
      { label: 'Section anchor', value: 'anchor' },
    ],
  },
  {
    name: 'url',
    type: 'text' as const,
    admin: {
      condition: (_: unknown, sibling: { linkType?: string }) =>
        sibling?.linkType === 'custom' || sibling?.linkType === 'anchor',
      description: 'e.g. /off-plan-mortgage-dubai or #contact',
    },
  },
  {
    name: 'page',
    type: 'relationship' as const,
    relationTo: 'pages' as const,
    admin: {
      condition: (_: unknown, sibling: { linkType?: string }) => sibling?.linkType === 'page',
    },
  },
  {
    name: 'openInNewTab',
    type: 'checkbox' as const,
    defaultValue: false,
  },
]

export const Menus: CollectionConfig = {
  slug: 'menus',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'updatedAt'],
    group: 'Site structure',
    description: 'Build header, footer and extra navigation menus.',
  },
  access: {
    read: () => true,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: ({ req: { user } }) => (user as { role?: string } | null)?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'location',
      type: 'select',
      required: true,
      options: [
        { label: 'Header primary', value: 'header' },
        { label: 'Header utility', value: 'header-utility' },
        { label: 'Footer', value: 'footer' },
        { label: 'Mobile', value: 'mobile' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'Item', plural: 'Menu items' },
      admin: { initCollapsed: false },
      fields: [
        ...linkFields,
        {
          name: 'children',
          type: 'array',
          labels: { singular: 'Sub-item', plural: 'Dropdown items' },
          fields: linkFields,
        },
      ],
    },
  ],
}
`)

w('src/globals/Header.ts', `import type { GlobalConfig } from 'payload'

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
`)

w('src/globals/Footer.ts', `import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Site structure',
    description: 'Footer columns, social links and legal copy.',
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
`)

console.log('menus/header/footer done')

import type { CollectionConfig } from 'payload'

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
    delete: ({ req: { user } }) => ((user as { role?: string } | null)?.role === 'admin' || (user as { role?: string } | null)?.role === 'superadmin'),
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

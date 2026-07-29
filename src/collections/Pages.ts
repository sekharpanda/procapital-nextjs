import type { CollectionConfig } from 'payload'
import { pageSectionBlocks } from '../blocks/pageSections'

type U = { role?: string; approvalStatus?: string } | null
const isApproved = (user: U) => Boolean(user) && user?.approvalStatus === 'approved'
const isAdminLike = (user: U) =>
  isApproved(user) && (user?.role === 'admin' || user?.role === 'superadmin')
const canEditSite = (user: U) =>
  isApproved(user) &&
  (user?.role === 'admin' || user?.role === 'superadmin' || user?.role === 'editor')

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'template', 'status', 'updatedAt'],
    group: 'Content',
    description:
                  'Add: click "+ Add Section". Edit text/images inside. Remove: click the three-dots (⋮) on the right of a section → Remove, then Save.',
    livePreview: {
      url: ({ data }) => {
        const slug = data?.slug
        if (!slug || slug === 'home') return '/'
        return `/${slug}`
      },
    },
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => canEditSite(user as U),
    update: ({ req: { user } }) => canEditSite(user as U),
    delete: ({ req: { user } }) => isAdminLike(user as U),
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          admin: {
            width: '50%',
            description: 'URL path. Use "home" for homepage.',
          },
          hooks: {
            beforeValidate: [
              ({ value }) =>
                typeof value === 'string'
                  ? value
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9-/]/g, '-')
                      .replace(/-+/g, '-')
                  : value,
            ],
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'template',
          type: 'select',
          required: true,
          defaultValue: 'builder',
          options: [
            { label: 'Section builder (recommended)', value: 'builder' },
            { label: 'Homepage layout hint', value: 'home' },
            { label: 'Guide layout hint', value: 'guide' },
          ],
          admin: {
            width: '33%',
            description: 'Sections tab controls live page content (WordPress-style blocks).',
          },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'published',
          admin: { width: '33%' },
          options: [
            { label: 'Published', value: 'published' },
            { label: 'Draft', value: 'draft' },
          ],
        },
        {
          name: 'useSiteChrome',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            width: '33%',
            description: 'Use CMS header & footer on this page',
          },
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Sections',
          description:
            'WordPress-style blocks: Add Section → edit text/images → drag to reorder → Save. The live site updates immediately.',
          fields: [
            {
              name: 'sections',
              type: 'blocks',
              blocks: pageSectionBlocks,
              admin: {
                initCollapsed: false,
                description:
                  'Add: click "+ Add Section". Edit text/images inside. Remove: click the three-dots menu on the right of a section → Remove, then Save.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', type: 'text', required: true },
            { name: 'metaDescription', type: 'textarea', required: true },
            { name: 'metaKeywords', type: 'text' },
            { name: 'canonicalPath', type: 'text' },
          ],
        },
        {
          label: 'Legacy fields',
          description: 'Kept for seeded content / gradual migration.',
          fields: [
            { name: 'heroEyebrow', type: 'text' },
            { name: 'heroTitle', type: 'text' },
            { name: 'heroHighlight', type: 'text' },
            { name: 'heroLede', type: 'textarea' },
            { name: 'heroUpdated', type: 'text' },
            { name: 'bodyHtml', type: 'textarea', admin: { rows: 16 } },
            {
              name: 'faqs',
              type: 'array',
              fields: [
                { name: 'question', type: 'text' },
                { name: 'answer', type: 'textarea' },
              ],
            },
            {
              name: 'relatedLinks',
              type: 'array',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'slug', type: 'text' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

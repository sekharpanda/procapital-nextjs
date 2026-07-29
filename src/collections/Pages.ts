import type { CollectionConfig } from 'payload'
import { pageSectionBlocks } from '../blocks/pageSections'

const isLoggedIn = ({ req: { user } }: { req: { user: unknown } }) => Boolean(user)

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'template', 'status', 'updatedAt'],
    group: 'Content',
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
    create: isLoggedIn,
    update: isLoggedIn,
    delete: ({ req: { user } }) => ((user as { role?: string } | null)?.role === 'admin' || (user as { role?: string } | null)?.role === 'superadmin'),
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
          admin: { width: '33%' },
          options: [
            { label: 'Section builder', value: 'builder' },
            { label: 'Homepage (legacy exact)', value: 'home' },
            { label: 'Guide (legacy exact)', value: 'guide' },
          ],
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
          description: 'Add, remove and reorder page sections.',
          fields: [
            {
              name: 'sections',
              type: 'blocks',
              blocks: pageSectionBlocks,
              admin: {
                initCollapsed: true,
                description: 'Build the page visually ? hero, services, FAQ, custom HTML, and more.',
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

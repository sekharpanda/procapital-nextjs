const fs = require('fs')
const path = require('path')
const root = 'C:/Users/PROWIN/Desktop/procapital-nextjs'
function w(rel, content) {
  const p = path.join(root, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content, 'utf8')
  console.log('wrote', rel)
}

w('src/blocks/pageSections.ts', `import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'title', type: 'text', required: true },
    { name: 'highlight', type: 'text', admin: { description: 'Words inside the title to emphasize' } },
    { name: 'lede', type: 'textarea' },
    { name: 'primaryCtaLabel', type: 'text' },
    { name: 'primaryCtaLink', type: 'text' },
    { name: 'secondaryCtaLabel', type: 'text' },
    { name: 'secondaryCtaLink', type: 'text' },
    { name: 'showCalculator', type: 'checkbox', defaultValue: false },
    { name: 'showTrustPills', type: 'checkbox', defaultValue: true },
  ],
}

export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Stats bar', plural: 'Stats bars' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

export const ServicesBlock: Block = {
  slug: 'services',
  labels: { singular: 'Services grid', plural: 'Services grids' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'linkLabel', type: 'text' },
        { name: 'linkUrl', type: 'text' },
      ],
    },
  ],
}

export const StepsBlock: Block = {
  slug: 'steps',
  labels: { singular: 'Steps', plural: 'Steps sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}

export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  labels: { singular: 'Feature grid', plural: 'Feature grids' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
  ],
}

export const BanksBlock: Block = {
  slug: 'banks',
  labels: { singular: 'Banks / logos', plural: 'Banks sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [{ name: 'name', type: 'text', required: true }],
    },
  ],
}

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text' },
      ],
    },
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQ sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}

export const CtaFormBlock: Block = {
  slug: 'ctaForm',
  labels: { singular: 'CTA + lead form', plural: 'CTA forms' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'body', type: 'textarea' },
    { name: 'showLeadForm', type: 'checkbox', defaultValue: true },
  ],
}

export const RichContentBlock: Block = {
  slug: 'richContent',
  labels: { singular: 'Guide content (HTML)', plural: 'Guide content' },
  fields: [
    {
      name: 'html',
      type: 'textarea',
      required: true,
      admin: { rows: 20, description: 'HTML for long-form guide body (exact design markup supported).' },
    },
  ],
}

export const HtmlBlock: Block = {
  slug: 'customHtml',
  labels: { singular: 'Custom HTML', plural: 'Custom HTML blocks' },
  fields: [
    { name: 'html', type: 'textarea', required: true, admin: { rows: 12 } },
  ],
}

export const RelatedLinksBlock: Block = {
  slug: 'relatedLinks',
  labels: { singular: 'Related links', plural: 'Related links' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Related guides' },
    {
      name: 'links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}

export const pageSectionBlocks = [
  HeroBlock,
  StatsBlock,
  ServicesBlock,
  StepsBlock,
  FeatureGridBlock,
  BanksBlock,
  TestimonialsBlock,
  FaqBlock,
  CtaFormBlock,
  RichContentBlock,
  HtmlBlock,
  RelatedLinksBlock,
]
`)

w('src/collections/Pages.ts', `import type { CollectionConfig } from 'payload'
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
        return \`/\${slug}\`
      },
    },
  },
  access: {
    read: () => true,
    create: isLoggedIn,
    update: isLoggedIn,
    delete: ({ req: { user } }) => (user as { role?: string } | null)?.role === 'admin',
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
`)

console.log('blocks + pages done')

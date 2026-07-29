import type { Block } from 'payload'

const imageFields = [
  {
    type: 'collapsible' as const,
    label: 'Image',
    admin: {
      initCollapsed: false,
      description: 'Optional. Change the image for this item.',
    },
    fields: [
      {
        name: 'image',
        type: 'upload' as const,
        relationTo: 'media' as const,
        label: 'Change image',
        admin: {
          description: 'Choose from Media library (upload new there first if needed).',
        },
      },
      {
        name: 'imageUrl',
        type: 'text' as const,
        label: 'Or paste image URL',
        admin: {
          description: 'Use this if the image is already hosted online.',
        },
      },
    ],
  },
]


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
    ...imageFields,
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
      labels: { singular: 'Stat', plural: 'Stats' },
      admin: {
        initCollapsed: false,
        description: 'Click "Add Stat" to add another number.',
        components: { RowLabel: '/components/admin/ArrayRowLabel' },
      },
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
      labels: { singular: 'Service card', plural: 'Service cards' },
      admin: {
        initCollapsed: false,
        description: 'Click "Add Service card" below. Each card can have text + image.',
        components: { RowLabel: '/components/admin/ArrayRowLabel' },
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'linkLabel', type: 'text' },
        { name: 'linkUrl', type: 'text' },
        ...imageFields,
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
      labels: { singular: 'Step', plural: 'Steps' },
      admin: {
        initCollapsed: false,
        description: 'Click "Add Step" to add another step.',
        components: { RowLabel: '/components/admin/ArrayRowLabel' },
      },
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
      labels: { singular: 'Feature', plural: 'Features' },
      admin: {
        initCollapsed: false,
        description: 'Click "Add Feature". Each feature can include an image.',
        components: { RowLabel: '/components/admin/ArrayRowLabel' },
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        ...imageFields,
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
      labels: { singular: 'Bank', plural: 'Banks' },
      admin: {
        initCollapsed: false,
        description: 'Click "Add Bank". Add a logo image or leave as text name.',
        components: { RowLabel: '/components/admin/ArrayRowLabel' },
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        ...imageFields,
      ],
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
      labels: { singular: 'Testimonial', plural: 'Testimonials' },
      admin: {
        initCollapsed: false,
        description: 'Click "Add Testimonial". Optional photo via Change image.',
        components: { RowLabel: '/components/admin/ArrayRowLabel' },
      },
      fields: [
        { name: 'quote', type: 'textarea', required: true },
        { name: 'author', type: 'text', required: true },
        { name: 'role', type: 'text' },
        ...imageFields,
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
      labels: { singular: 'Question', plural: 'Questions' },
      admin: {
        initCollapsed: false,
        description: 'Click "Add Question" to add another FAQ.',
        components: { RowLabel: '/components/admin/ArrayRowLabel' },
      },
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

export const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: 'Image', plural: 'Images' },
  fields: [
    ...imageFields,
    { name: 'alt', type: 'text' },
    { name: 'caption', type: 'text' },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'wide',
      options: [
        { label: 'Full width', value: 'full' },
        { label: 'Wide', value: 'wide' },
        { label: 'Medium', value: 'medium' },
      ],
    },
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
      admin: { rows: 20, description: 'HTML for long-form guide body.' },
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
      labels: { singular: 'Link', plural: 'Links' },
      admin: {
        initCollapsed: false,
        description: 'Click "Add Link" to add another related guide.',
        components: { RowLabel: '/components/admin/ArrayRowLabel' },
      },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
      ],
    },
  ],
}

export const pageSectionBlocks = [
  HeroBlock,
  ImageBlock,
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

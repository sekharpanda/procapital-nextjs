const fs = require('fs')
const path = require('path')

const root = path.join(__dirname, '..')

function write(rel, content) {
  const full = path.join(root, rel)
  fs.mkdirSync(path.dirname(full), { recursive: true })
  fs.writeFileSync(full, content.replace(/\r\n/g, '\n'), 'utf8')
  console.log('wrote', rel)
}

write(
  'src/components/admin/ArrayRowLabel.tsx',
  `'use client'

import type { RowLabelProps } from '@payloadcms/ui'
import { useRowLabel } from '@payloadcms/ui'

/** Shows the item title instead of Payload's default "Toggle block". */
export default function ArrayRowLabel(_props: RowLabelProps) {
  const { data, rowNumber } = useRowLabel<{
    title?: string
    name?: string
    question?: string
    label?: string
    author?: string
    value?: string
  }>()

  const text =
    data?.title ||
    data?.name ||
    data?.question ||
    data?.label ||
    data?.author ||
    (data?.value ? String(data.value) : '') ||
    \`Item \${String(rowNumber ?? 1).padStart(2, '0')}\`

  return <span>{text}</span>
}
`,
)

const blocksPath = path.join(root, 'src/blocks/pageSections.ts')
let blocks = fs.readFileSync(blocksPath, 'utf8')

const imageFieldsNew = `const imageFields = [
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
`

if (blocks.includes('const imageFields = [')) {
  blocks = blocks.replace(/const imageFields = \[[\s\S]*?^\]/m, imageFieldsNew)
} else {
  throw new Error('imageFields not found')
}

const rowLabelAdmin = `admin: {
        initCollapsed: false,
        components: {
          RowLabel: '/components/admin/ArrayRowLabel',
        },
      },`

function patchArray(slugLabel, singular, plural, description) {
  // Soft approach: replace each items array that currently has bare fields
}

// Manual patches for each items array labels + RowLabel
const replacements = [
  {
    find: `export const StatsBlock: Block = {
  slug: 'stats',
  labels: { singular: 'Stats bar', plural: 'Stats bars' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [`,
    replace: `export const StatsBlock: Block = {
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
      fields: [`,
  },
  {
    find: `export const ServicesBlock: Block = {
  slug: 'services',
  labels: { singular: 'Services grid', plural: 'Services grids' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      fields: [`,
    replace: `export const ServicesBlock: Block = {
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
      fields: [`,
  },
  {
    find: `export const StepsBlock: Block = {
  slug: 'steps',
  labels: { singular: 'Steps', plural: 'Steps sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'items',
      type: 'array',
      fields: [`,
    replace: `export const StepsBlock: Block = {
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
      fields: [`,
  },
  {
    find: `export const FeatureGridBlock: Block = {
  slug: 'featureGrid',
  labels: { singular: 'Feature grid', plural: 'Feature grids' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [`,
    replace: `export const FeatureGridBlock: Block = {
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
      fields: [`,
  },
  {
    find: `export const BanksBlock: Block = {
  slug: 'banks',
  labels: { singular: 'Banks / logos', plural: 'Banks sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [`,
    replace: `export const BanksBlock: Block = {
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
      fields: [`,
  },
  {
    find: `export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [`,
    replace: `export const TestimonialsBlock: Block = {
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
      fields: [`,
  },
  {
    find: `export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQ sections' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'array',
      fields: [`,
    replace: `export const FaqBlock: Block = {
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
      fields: [`,
  },
  {
    find: `export const RelatedLinksBlock: Block = {
  slug: 'relatedLinks',
  labels: { singular: 'Related links', plural: 'Related links' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Related guides' },
    {
      name: 'links',
      type: 'array',
      fields: [`,
    replace: `export const RelatedLinksBlock: Block = {
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
      fields: [`,
  },
]

for (const { find, replace } of replacements) {
  if (!blocks.includes(find)) {
    console.warn('SKIP missing fragment')
    continue
  }
  blocks = blocks.replace(find, replace)
}

write('src/blocks/pageSections.ts', blocks)

// Pages.ts sections admin text
const pagesPath = path.join(root, 'src/collections/Pages.ts')
let pages = fs.readFileSync(pagesPath, 'utf8')
pages = pages.replace(
  /admin: \{\s*initCollapsed: true,\s*description:\s*'[^']*',\s*\},/,
  `admin: {
                initCollapsed: false,
                description:
                  'Click "+ Add Section" at the bottom to add Hero, Image, Services, FAQ, Form, etc. Open a section to edit text and Change image.',
              },`,
)
write('src/collections/Pages.ts', pages)

// Clean CSS for collapsible / avoid overlapping Toggle block chrome
const scssPath = path.join(root, 'src/app/(payload)/custom.scss')
let scss = fs.readFileSync(scssPath, 'utf8')
if (!scss.includes('Clean section / array rows')) {
  scss += `

/* ---------------------------------------------------------
   Clean section / array rows (no overlapping "Toggle block")
   --------------------------------------------------------- */
.blocks-field__drawer-toggler,
.array-field__add-row {
  margin-top: 12px !important;
}

.blocks-field__block,
.array-field__row {
  position: relative !important;
  overflow: visible !important;
}

.blocks-field__block-header,
.array-field__row .collapsible__toggle-wrap,
.collapsible__toggle-wrap {
  position: relative !important;
  z-index: 2 !important;
  min-height: 44px !important;
  padding: 10px 12px !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
}

.row-label,
.blocks-field__block-pill,
.collapsible__toggle {
  position: relative !important;
  z-index: 3 !important;
  line-height: 1.35 !important;
  white-space: normal !important;
}

/* Upload field: make "Change image" obvious */
.field-type.upload .file-details,
.field-type.upload .upload__wrap {
  border-radius: 12px !important;
  border: 1px dashed #cfc7b6 !important;
  background: #fbfaf6 !important;
  padding: 10px !important;
}

.field-type.collapsible > .collapsible {
  margin-top: 8px !important;
}
`
  write('src/app/(payload)/custom.scss', scss)
}

console.log('done')

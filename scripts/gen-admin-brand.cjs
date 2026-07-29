const fs = require('fs')
const path = require('path')
const root = 'C:/Users/PROWIN/Desktop/procapital-nextjs'
function w(rel, content) {
  const p = path.join(root, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content, 'utf8')
  console.log('wrote', rel)
}

// Update Media group
let media = fs.readFileSync(path.join(root, 'src/collections/Media.ts'), 'utf8')
if (!media.includes("group: 'Media & brand'")) {
  media = media.replace(
    'admin: {\n    useAsTitle',
    "admin: {\n    group: 'Media & brand',\n    useAsTitle",
  )
  // Media might not have useAsTitle
  if (!media.includes("group:")) {
    media = media.replace(
      'export const Media: CollectionConfig = {\n  slug: \'media\',',
      "export const Media: CollectionConfig = {\n  slug: 'media',\n  admin: {\n    group: 'Media & brand',\n  },",
    )
  }
  fs.writeFileSync(path.join(root, 'src/collections/Media.ts'), media, 'utf8')
}

w('src/collections/Media.ts', `import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Media & brand',
    description: 'Logos, OG images, icons and uploads.',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => (user as { role?: string } | null)?.role === 'admin',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
`)

w('src/globals/SiteSettings.ts', `import type { GlobalConfig } from 'payload'

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
`)

w('src/app/(payload)/custom.scss', `/* ProCapital admin branding */
:root {
  --procapital-teal: #0e4d5c;
  --procapital-teal-deep: #0a3a46;
  --procapital-green: #3e9c6b;
  --procapital-cream: #f5f1e8;
}

/* Stronger nav grouping feel */
.nav-group__toggle {
  font-weight: 650 !important;
  letter-spacing: 0.02em;
}

/* Dashboard welcome card accents */
.procapital-dash {
  background: linear-gradient(135deg, #0e4d5c, #0a3a46 55%, #146077);
  color: #f8faf8;
  border-radius: 16px;
  padding: 28px 30px;
  margin-bottom: 22px;
  box-shadow: 0 18px 40px -24px rgba(10, 40, 50, 0.55);
}

.procapital-dash h1 {
  margin: 0 0 8px;
  font-size: 1.55rem;
  font-weight: 700;
}

.procapital-dash p {
  margin: 0;
  opacity: 0.9;
  max-width: 62ch;
  line-height: 1.5;
}

.procapital-dash__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 20px;
}

.procapital-dash a.card {
  display: block;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  padding: 14px 16px;
  color: #fff !important;
  text-decoration: none !important;
  transition: background 0.18s ease, transform 0.18s ease;
}

.procapital-dash a.card:hover {
  background: rgba(255, 255, 255, 0.16);
  transform: translateY(-1px);
}

.procapital-dash a.card strong {
  display: block;
  margin-bottom: 4px;
}

.procapital-dash a.card span {
  font-size: 0.86rem;
  opacity: 0.85;
}
`)

w('src/components/admin/Dashboard.tsx', `'use client'

import React from 'react'

export default function Dashboard() {
  return (
    <div className="procapital-dash">
      <h1>ProCapital website control center</h1>
      <p>
        Manage menus, redesign the header and footer, build pages with sections, and update brand
        assets ? all from one place.
      </p>
      <div className="procapital-dash__grid">
        <a className="card" href="/admin/collections/pages">
          <strong>Pages & sections</strong>
          <span>Add pages, reorder blocks, edit SEO</span>
        </a>
        <a className="card" href="/admin/collections/menus">
          <strong>Menus</strong>
          <span>Header, footer and dropdown links</span>
        </a>
        <a className="card" href="/admin/globals/header">
          <strong>Header design</strong>
          <span>Logo, CTA, layout style, ticker</span>
        </a>
        <a className="card" href="/admin/globals/footer">
          <strong>Footer design</strong>
          <span>Columns, social, disclaimers</span>
        </a>
        <a className="card" href="/admin/collections/media">
          <strong>Media</strong>
          <span>Logos and images</span>
        </a>
        <a className="card" href="/admin/globals/site-settings">
          <strong>General settings</strong>
          <span>Phone, email, brand colors</span>
        </a>
      </div>
    </div>
  )
}
`)

w('src/components/admin/Logo.tsx', `import React from 'react'

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, letterSpacing: '-0.02em' }}>
      <span style={{ color: '#0E4D5C' }}>PRO</span>
      <span style={{ color: '#17242A' }}>Capital</span>
      <span style={{ fontWeight: 600, fontSize: 12, opacity: 0.55, marginLeft: 4 }}>CMS</span>
    </div>
  )
}
`)

w('src/components/admin/Icon.tsx', `import React from 'react'

export default function Icon() {
  return (
    <div
      style={{
        width: 18,
        height: 18,
        borderRadius: 4,
        background: 'linear-gradient(135deg,#0E4D5C,#3E9C6B)',
      }}
    />
  )
}
`)

w('src/payload.config.ts', `import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Menus } from './collections/Menus'
import { SiteSettings } from './globals/SiteSettings'
import { Header } from './globals/Header'
import { Footer } from './globals/Footer'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' ? ProCapital CMS',
      description: 'ProCapital website content management',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
      beforeDashboard: ['/components/admin/Dashboard'],
    },
  },
  collections: [Pages, Menus, Media, Users],
  globals: [Header, Footer, SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
`)

console.log('admin + config done')

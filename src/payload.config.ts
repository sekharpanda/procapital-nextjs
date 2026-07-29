import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
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

const siteURL =
  process.env.PAYLOAD_SERVER_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : undefined) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  'http://localhost:3000'

const trustedOrigins = Array.from(
  new Set(
    [
      siteURL,
      'https://procapital-nextjs.vercel.app',
      'http://localhost:3000',
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
      process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : '',
    ].filter(Boolean),
  ),
)

const databaseUrl = process.env.DATABASE_URL || 'file:./procapital-nextjs.db'
const isPostgres =
  databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')

const db = isPostgres
  ? postgresAdapter({
      pool: {
        connectionString: databaseUrl,
      },
      // Safer for serverless/free Neon: push schema in non-production only
      push: process.env.PAYLOAD_DATABASE_PUSH !== 'false',
    })
  : sqliteAdapter({
      client: {
        url: databaseUrl,
      },
    })

const plugins = []
if (process.env.BLOB_READ_WRITE_TOKEN) {
  plugins.push(
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  )
}

export default buildConfig({
  serverURL: siteURL,
  // Required on Vercel: without this, cookie auth is rejected and every Save returns 403
  csrf: trustedOrigins,
  cors: trustedOrigins,
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — ProCapital CMS',
      description: 'ProCapital website content management',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      actions: ['/components/admin/ViewSiteButton'],
      beforeNavLinks: ['/components/admin/ViewSiteButton'],
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
  secret: process.env.PAYLOAD_SECRET || 'dev-only-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  sharp,
  plugins,
})

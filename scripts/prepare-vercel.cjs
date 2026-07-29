const fs = require('fs')

const config = `import { postgresAdapter } from '@payloadcms/db-postgres'
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

const databaseUrl = process.env.DATABASE_URL || 'file:./procapital-nextjs.db'
const isPostgres =
  databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://')

const db = isPostgres
  ? postgresAdapter({
      pool: {
        connectionString: databaseUrl,
      },
      // Safer for serverless/free Neon: push schema in non-production only
      push: process.env.NODE_ENV !== 'production',
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
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
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
  secret: process.env.PAYLOAD_SECRET || 'dev-only-change-me',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db,
  sharp,
  plugins,
})
`

fs.writeFileSync('src/payload.config.ts', config, 'utf8')
console.log('payload.config.ts written, postgres mode detect ready')

fs.writeFileSync(
  '.env.example',
  `# Local (SQLite) ? keep this for development
DATABASE_URL=file:./procapital-nextjs.db

# Production (Neon Postgres) ? use this on Vercel
# DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require

PAYLOAD_SECRET=CHANGE_ME_TO_A_LONG_RANDOM_STRING
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# On Vercel set this to your live domain, e.g. https://procapital.ae
# NEXT_PUBLIC_SITE_URL=https://procapital.ae

LEADRAT_API_KEY=
LEADRAT_BACKUP_URL=

# Optional ? Vercel Blob for admin media uploads (required for lasting uploads on Vercel)
# Create in Vercel project ? Storage ? Blob
# BLOB_READ_WRITE_TOKEN=
`,
  'utf8',
)

fs.writeFileSync(
  'vercel.json',
  JSON.stringify(
    {
      framework: 'nextjs',
      regions: ['iad1'],
    },
    null,
    2,
  ) + '\\n',
  'utf8',
)

// Fix vercel.json newline
fs.writeFileSync(
  'vercel.json',
  `{
  "framework": "nextjs"
}
`,
  'utf8',
)

fs.writeFileSync(
  'DEPLOY-VERCEL.md',
  `# Deploy ProCapital to Vercel (free tier)

This app uses **SQLite locally** and **Postgres on Vercel**. Do not point production at SQLite.

## 1) Neon Postgres (free)

1. Go to https://neon.tech and create a free project
2. Copy the connection string (\`postgresql://...\`)
3. Keep it for Vercel as \`DATABASE_URL\`

## 2) GitHub

1. Create a GitHub repo
2. Push this project (\`.env\` stays private ? it is gitignored)

\`\`\`bash
git init
git add .
git commit --trailer "Co-authored-by: Cursor <cursoragent@cursor.com>" -m "Prepare ProCapital for Vercel"
git branch -M main
git remote add origin YOUR_REPO_URL
git push -u origin main
\`\`\`

## 3) Vercel project

1. https://vercel.com ? **Add New Project** ? Import the GitHub repo
2. Framework: Next.js (auto)
3. Environment variables:

| Name | Value |
|------|--------|
| \`DATABASE_URL\` | Neon \`postgresql://...\` string |
| \`PAYLOAD_SECRET\` | Long random string (32+ chars) |
| \`NEXT_PUBLIC_SITE_URL\` | \`https://YOUR-PROJECT.vercel.app\` first, then custom domain |
| \`LEADRAT_API_KEY\` | Your LeadRat key |
| \`BLOB_READ_WRITE_TOKEN\` | Optional; from Vercel Storage ? Blob |

4. Deploy

## 4) First production data

After first deploy opens:

1. Visit \`https://YOUR-PROJECT.vercel.app/admin\`
2. If no user exists, create Super Admin **or** run seeds against Neon locally:

\`\`\`bash
# Temporarily set Neon URL in a local shell (do not commit)
$env:DATABASE_URL="postgresql://..."
$env:PAYLOAD_SECRET="same-as-vercel"
$env:NEXT_PUBLIC_SITE_URL="https://YOUR-PROJECT.vercel.app"
npm run seed
npm run seed:structure
npm run seed:superadmin
\`\`\`

## 5) Custom domain (procapital.ae)

1. Vercel ? Project ? **Settings ? Domains**
2. Add \`procapital.ae\` and \`www.procapital.ae\`
3. At your domain DNS provider, add the records Vercel shows (usually A/CNAME)
4. Wait for SSL to become **Valid**
5. Update Vercel env \`NEXT_PUBLIC_SITE_URL=https://procapital.ae\` and redeploy

## Local development (unchanged)

Keep \`.env\` as:

\`\`\`
DATABASE_URL=file:./procapital-nextjs.db
\`\`\`

\`npm run dev\` continues to use SQLite ? production Postgres does not affect local.
`,
  'utf8',
)

// Fix gitignore corrupted lines
let gi = fs.readFileSync('.gitignore', 'utf8')
gi = gi.replace(/\\nsrc\/\.superadmin-temp-password\.txt\\n/g, '\n')
if (!gi.includes('src/.superadmin-temp-password.txt')) {
  gi += '\n# local secrets\nsrc/.superadmin-temp-password.txt\n*.db\n*.db-*\n'
}
if (!gi.includes('.env')) {
  gi += '\n.env\n'
}
fs.writeFileSync('.gitignore', gi, 'utf8')

// Ensure local .env still sqlite
const envPath = '.env'
if (fs.existsSync(envPath)) {
  let env = fs.readFileSync(envPath, 'utf8')
  if (!/DATABASE_URL=file:/.test(env) && !/DATABASE_URL=postgresql/.test(env)) {
    // leave as is
  }
  if (!env.includes('DATABASE_URL=')) {
    env = 'DATABASE_URL=file:./procapital-nextjs.db\n' + env
  }
  // force local sqlite if somehow emptied
  if (/DATABASE_URL=\s*$/m.test(env)) {
    env = env.replace(/DATABASE_URL=\s*$/m, 'DATABASE_URL=file:./procapital-nextjs.db')
  }
  fs.writeFileSync(envPath, env, 'utf8')
}

console.log('deploy files ready')

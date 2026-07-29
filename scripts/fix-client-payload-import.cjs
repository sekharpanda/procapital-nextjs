const fs = require('fs')

fs.writeFileSync('src/lib/menu.ts', `export function resolveMenuHref(item: {
  linkType?: string | null
  url?: string | null
  page?: unknown
}): string {
  if (item.linkType === 'page' && item.page && typeof item.page === 'object') {
    const slug = (item.page as { slug?: string }).slug
    if (!slug || slug === 'home') return '/'
    return '/' + slug
  }
  return item.url || '#'
}

export function mediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as { url?: string | null }
  return m.url || null
}

/** Remove embedded header/footer so CMS chrome can replace them. */
export function stripExactChrome(html: string): string {
  return html
    .replace(/<div class="ticker"[\\s\\S]*?<div class="ticker-track"[\\s\\S]*?<\\/div>\\s*<\\/div>\\s*/i, '')
    .replace(/<header[\\s\\S]*?<\\/header>\\s*/i, '')
    .replace(/<footer[\\s\\S]*?<\\/footer>\\s*/i, '')
}
`, 'utf8')

fs.writeFileSync('src/lib/cms.ts', `import { getPayload } from 'payload'
import config from '@payload-config'

export async function getPayloadClient() {
  return getPayload({ config })
}

export async function getSiteChrome() {
  const payload = await getPayloadClient()
  const [settings, header, footer] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 2 }),
    payload.findGlobal({ slug: 'header', depth: 3 }),
    payload.findGlobal({ slug: 'footer', depth: 3 }),
  ])
  return { settings, header, footer }
}

export { mediaUrl, resolveMenuHref, stripExactChrome } from './menu'
`, 'utf8')

for (const p of ['src/components/cms/CmsHeader.tsx', 'src/components/cms/CmsFooter.tsx']) {
  let t = fs.readFileSync(p, 'utf8')
  t = t.replace("from '@/lib/cms'", "from '@/lib/menu'")
  fs.writeFileSync(p, t, 'utf8')
  console.log('fixed', p)
}

let pageHome = fs.readFileSync('src/app/(frontend)/page.tsx', 'utf8')
pageHome = pageHome.replace("from '@/lib/cms'", "from '@/lib/menu'")
fs.writeFileSync('src/app/(frontend)/page.tsx', pageHome, 'utf8')

let pageSlug = fs.readFileSync('src/app/(frontend)/[slug]/page.tsx', 'utf8')
pageSlug = pageSlug.replace("from '@/lib/cms'", "from '@/lib/menu'")
fs.writeFileSync('src/app/(frontend)/[slug]/page.tsx', pageSlug, 'utf8')

console.log('done')

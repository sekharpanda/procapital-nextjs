import type { MetadataRoute } from 'next'

function siteUrl() {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
  if (fromEnv && !/localhost|127\.0\.0\.1/i.test(fromEnv)) return fromEnv
  return 'https://procapital.ae'
}

const routes: Array<{
  path: string
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']>
  priority: number
}> = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/mortgage-for-residents-dubai', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/equity-release-dubai', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/off-plan-mortgage-dubai', changeFrequency: 'monthly', priority: 0.9 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl()
  const lastModified = new Date()
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: path === '/' ? `${base}/` : `${base}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}

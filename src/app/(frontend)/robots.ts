import type { MetadataRoute } from 'next'

function siteUrl() {
  const fromEnv = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '')
  if (fromEnv && !/localhost|127\.0\.0\.1/i.test(fromEnv)) return fromEnv
  return 'https://procapital.ae'
}

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}

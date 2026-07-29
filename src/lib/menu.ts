export function resolveMenuHref(item: {
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
    .replace(/<div class="ticker"[\s\S]*?<div class="ticker-track"[\s\S]*?<\/div>\s*<\/div>\s*/i, '')
    .replace(/<header[\s\S]*?<\/header>\s*/i, '')
    .replace(/<footer[\s\S]*?<\/footer>\s*/i, '')
}

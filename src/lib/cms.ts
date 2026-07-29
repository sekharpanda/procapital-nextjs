import { getPayload } from 'payload'
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

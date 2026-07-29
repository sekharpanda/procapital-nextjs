import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function run() {
  const payload = await getPayload({ config })
  const menus = await payload.find({
    collection: 'menus',
    where: { location: { equals: 'header' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const menu = menus.docs[0]
  console.log('ITEMS', JSON.stringify((menu.items || []).map((i: any) => ({ label: i.label, kids: (i.children || []).map((c: any) => c.label) })), null, 2))
  const items = (menu.items || []).map((it: any) => {
    if (/guides/i.test(it.label) || it.url === '#') {
      return { ...it, label: 'Guides & Insights' }
    }
    return it
  })
  await payload.update({ collection: 'menus', id: menu.id, data: { items }, overrideAccess: true })
  console.log('RENAMED')
  process.exit(0)
}
run().catch((e)=>{console.error(e); process.exit(1)})

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

const MARK = 'Get pre-approved NOW'
const FOOTER_MARK = 'CMS footer sync test — independent advisors in Dubai.'
const MENU_MARK = 'Guides & Insights'

async function run() {
  const payload = await getPayload({ config })

  // 1) Update header CTA
  await payload.updateGlobal({
    slug: 'header',
    data: {
      ctaLabel: MARK,
      showTopBar: true,
      topBarText: 'Trusted by 1000+ homebuyers across Dubai',
    },
    overrideAccess: true,
  })
  console.log('UPDATED_HEADER')

  // 2) Update footer about
  await payload.updateGlobal({
    slug: 'footer',
    data: { aboutText: FOOTER_MARK },
    overrideAccess: true,
  })
  console.log('UPDATED_FOOTER')

  // 3) Rename Guides menu item
  const menus = await payload.find({
    collection: 'menus',
    where: { location: { equals: 'header' } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const menu = menus.docs[0]
  if (menu) {
    const items = (menu.items || []).map((it: any) =>
      it.label === 'Guides' || it.label === MENU_MARK ? { ...it, label: MENU_MARK } : it,
    )
    // if Guides missing, still try replace by custom url #
    const next = items.some((it: any) => it.label === MENU_MARK)
      ? items
      : (menu.items || []).map((it: any, idx: number) =>
          idx === (menu.items?.length || 1) - 1 ? { ...it, label: MENU_MARK } : it,
        )
    await payload.update({
      collection: 'menus',
      id: menu.id,
      data: { items: next },
      overrideAccess: true,
    })
    console.log('UPDATED_MENU')
  } else {
    console.log('MENU_MISSING')
  }

  process.exit(0)
}
run().catch((e) => {
  console.error(e)
  process.exit(1)
})

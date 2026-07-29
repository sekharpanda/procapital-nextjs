import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function run() {
  const payload = await getPayload({ config })

  let headerMenu = await payload.find({
    collection: 'menus',
    where: { location: { equals: 'header' } },
    limit: 1,
  })
  let headerMenuId = headerMenu.docs[0]?.id
  if (!headerMenuId) {
    const created = await payload.create({
      collection: 'menus',
      data: {
        name: 'Main header menu',
        location: 'header',
        items: [
          { label: 'Services', linkType: 'anchor', url: '#services' },
          { label: 'How it works', linkType: 'anchor', url: '#how' },
          { label: 'Why us', linkType: 'anchor', url: '#why' },
          { label: 'FAQ', linkType: 'anchor', url: '#faq' },
          { label: 'Contact', linkType: 'anchor', url: '#contact' },
          {
            label: 'Guides',
            linkType: 'custom',
            url: '#',
            children: [
              { label: 'Resident mortgages', linkType: 'custom', url: '/mortgage-for-residents-dubai' },
              { label: 'Off-plan mortgages', linkType: 'custom', url: '/off-plan-mortgage-dubai' },
              { label: 'Equity release', linkType: 'custom', url: '/equity-release-dubai' },
            ],
          },
        ],
      },
    })
    headerMenuId = created.id
    console.log('Created header menu')
  }

  await payload.updateGlobal({
    slug: 'header',
    data: {
      style: 'classic',
      sticky: true,
      showTopBar: false,
      showTicker: true,
      showPhone: true,
      logoText: 'ProCapital',
      ctaLabel: 'Get pre-approved',
      ctaLink: '#contact',
      ctaStyle: 'primary',
      menu: headerMenuId,
    },
  })
  console.log('Header updated')

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      style: 'columns',
      aboutText: 'Independent mortgage advisors in Dubai — whole-of-market advice for residents and investors.',
      columns: [
        {
          title: 'Services',
          links: [
            { label: 'Resident mortgages', url: '/mortgage-for-residents-dubai' },
            { label: 'Off-plan mortgages', url: '/off-plan-mortgage-dubai' },
            { label: 'Equity release', url: '/equity-release-dubai' },
          ],
        },
        {
          title: 'Company',
          links: [
            { label: 'Home', url: '/' },
            { label: 'Contact', url: '/#contact' },
            { label: 'FAQ', url: '/#faq' },
          ],
        },
      ],
      socialLinks: [{ platform: 'whatsapp', url: 'https://wa.me/971588103755' }],
      copyrightText: '',
    },
  })
  console.log('Footer updated')
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})

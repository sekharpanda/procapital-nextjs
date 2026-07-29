import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../payload.config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const articles = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'content.json'), 'utf8'),
) as { equity: string; residents: string; offplan: string }

async function upsertPage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  data: Record<string, unknown>,
) {
  const existing = await payload.find({
    collection: 'pages',
    where: { slug: { equals: data.slug as string } },
    limit: 1,
  })
  if (existing.docs[0]) {
    await payload.update({ collection: 'pages', id: existing.docs[0].id, data: data as any })
    console.log('Updated page', data.slug)
  } else {
    await payload.create({ collection: 'pages', data: data as any })
    console.log('Created page', data.slug)
  }
}

async function run() {
  const payload = await getPayload({ config })

  const logoPath = path.resolve(__dirname, '../../public/logo.png')
  let logoId: number | string | undefined
  const existingMedia = await payload.find({
    collection: 'media',
    where: { alt: { equals: 'ProCapital logo' } },
    limit: 1,
  })
  if (existingMedia.docs[0]) {
    logoId = existingMedia.docs[0].id
  } else if (fs.existsSync(logoPath)) {
    const logo = await payload.create({
      collection: 'media',
      data: { alt: 'ProCapital logo' },
      filePath: logoPath,
    })
    logoId = logo.id
    console.log('Uploaded logo')
  }

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'ProCapital',
      tagline: 'Independent mortgage advisory in Dubai',
      logo: logoId,
      phone: '+971 58 810 3755',
      phoneHref: '+971588103755',
      email: 'info@procapital.ae',
      whatsappNumber: '971588103755',
      whatsappMessage: "Hi ProCapital, I'd like mortgage advice.",
      addressLine: 'Dubai, United Arab Emirates',
      tickerItems: [
        { label: 'EIBOR 1M', value: '3.65%' },
        { label: 'EIBOR 3M', value: '3.66%' },
        { label: 'EIBOR 6M', value: '3.71%' },
        { label: 'EIBOR 1Y', value: '3.91%' },
        { label: 'Best 3-yr fixed from', value: '3.95% p.a.' },
        { label: 'Non-resident from', value: '5.49% p.a.' },
      ],
      footerDisclaimer:
        'ProCapital provides mortgage advisory and brokerage services in the UAE. We are not a bank. Rates, LTVs and eligibility are indicative and subject to lender approval. Your property may be at risk if you do not keep up repayments on your mortgage.',
      guideDisclaimer:
        "This guide is general information about Dubai's published mortgage rules and current market practice as of July 2026 — not legal or financial advice. LTV caps, rates, fees and lender criteria change and vary by bank.",
    },
  })
  console.log('Updated site settings')

  await upsertPage(payload, {
    title: 'Home',
    slug: 'home',
    template: 'builder',
    status: 'published',
    useSiteChrome: true,
    metaTitle: 'Mortgage Broker in Dubai | Home Loans & Equity Release',
    metaDescription:
      'Independent mortgage broker in Dubai. Compare home loan & equity release rates from 25+ UAE banks and get pre-approved in days. Free, unbiased advice.',
    metaKeywords: 'mortgage broker Dubai, home loan UAE, equity release Dubai, ProCapital',
    canonicalPath: '/',
    sections: [
      {
        blockType: 'hero',
        eyebrow: 'Independent mortgage advisory · Dubai',
        title: 'The right mortgage, without the guesswork.',
        highlight: 'right mortgage',
        lede: 'We compare rates across 25+ UAE banks, handle the paperwork end-to-end, and get you pre-approved fast — so you buy your Dubai home with confidence.',
        primaryCtaLabel: 'Get pre-approved free',
        primaryCtaLink: '#contact',
        secondaryCtaLabel: 'Try the calculator',
        secondaryCtaLink: '#calc',
        showCalculator: true,
        showTrustPills: true,
      },
      {
        blockType: 'services',
        eyebrow: 'What we do',
        heading: 'Mortgage solutions for every buyer',
        intro:
          'Whether you live in Dubai or invest from overseas, we package the right bank for you.',
        items: [
          {
            title: 'Resident mortgages',
            description:
              'Buying your home in Dubai? We secure the best home-loan rate for UAE residents and package a clean application.',
            linkLabel: 'Read our resident mortgage guide →',
            linkUrl: '/mortgage-for-residents-dubai',
          },
          {
            title: 'Off-plan & handover',
            description:
              'Buying off-plan? We arrange staged financing for under-construction projects and bridge you to handover.',
            linkLabel: 'Read our off-plan mortgage guide →',
            linkUrl: '/off-plan-mortgage-dubai',
          },
          {
            title: 'Refinance & equity release',
            description:
              'Paying too much, or want to unlock cash? We move your mortgage to a better rate — or release equity without selling.',
            linkLabel: 'Read our equity release guide →',
            linkUrl: '/equity-release-dubai',
          },
        ],
      },
      {
        blockType: 'steps',
        eyebrow: 'How it works',
        heading: 'From enquiry to approval, handled for you',
        items: [
          {
            title: 'Tell us your plan',
            description: 'Share income, residency and property goals on a free call.',
          },
          {
            title: 'We compare banks',
            description:
              'We shortlist lenders that match your profile — residents, non-residents and self-employed.',
          },
          {
            title: 'We handle the file',
            description: 'Documents, packaging and follow-ups — so approvals happen first time.',
          },
          {
            title: 'You get approved',
            description: 'Pre-approval in days, then we stay with you through offer and drawdown.',
          },
        ],
      },
      {
        blockType: 'featureGrid',
        eyebrow: 'Why ProCapital',
        heading: 'Independent advice. Whole-of-market reach.',
        items: [
          {
            title: 'Whole-of-market',
            description: 'We are not tied to one bank — your rate comes from comparing 25+ lenders.',
          },
          {
            title: 'Free to you',
            description: 'Advice and comparison are free. We are paid by the bank on completion.',
          },
          {
            title: 'Residents & non-residents',
            description: 'We know which banks favour each profile — including self-employed.',
          },
          {
            title: 'End-to-end',
            description: 'From pre-approval to DLD transfer, one advisor owns your file.',
          },
        ],
      },
      {
        blockType: 'banks',
        eyebrow: 'Banks',
        heading: 'We work across the UAE lending market',
        items: [
          { name: 'Emirates NBD' },
          { name: 'Mashreq' },
          { name: 'FAB' },
          { name: 'ADCB' },
          { name: 'DIB' },
          { name: 'HSBC' },
          { name: 'RAKBANK' },
          { name: 'CBD' },
        ],
      },
      {
        blockType: 'testimonials',
        eyebrow: 'Clients',
        heading: 'What buyers say',
        items: [
          {
            quote: 'They compared multiple banks and got us a better rate than our bank offered directly.',
            author: 'Sara M.',
            role: 'Resident buyer, Dubai Marina',
          },
          {
            quote: 'As non-residents we expected it to be hard. ProCapital made the process clear and fast.',
            author: 'James & Priya',
            role: 'Investors, UK',
          },
          {
            quote: 'We released equity for a second property — transparent advice and no pressure.',
            author: 'Omar K.',
            role: 'Refinance client',
          },
        ],
      },
      {
        blockType: 'faq',
        eyebrow: 'FAQ',
        heading: 'Common questions',
        items: [
          {
            question: 'Can non-residents get a mortgage in the UAE?',
            answer:
              'Yes. Non-residents can secure a mortgage in Dubai. Most banks require six months of bank statements, proof of income and a passport copy.',
          },
          {
            question: 'How much deposit do I need for a mortgage in Dubai?',
            answer:
              'UAE residents typically need a 20% down payment for a first property under AED 5 million. Non-residents usually need 20 to 25%.',
          },
          {
            question: 'Does ProCapital charge for its service?',
            answer:
              'Your initial consultation and mortgage comparison are free. We are paid by the bank on completion.',
          },
          {
            question: 'How long does mortgage pre-approval take?',
            answer: 'With complete documents, pre-approval typically takes 3 to 5 working days.',
          },
        ],
      },
      {
        blockType: 'ctaForm',
        eyebrow: 'Free consultation',
        heading: 'Get your free mortgage callback',
        body: 'Tell us what you need — a ProCapital advisor will call you, usually within one business day.',
        showLeadForm: true,
      },
    ],
  })

  const guidePages = [
    {
      title: 'Equity Release in Dubai',
      slug: 'equity-release-dubai',
      metaTitle: 'Equity Release in Dubai 2026 | Cash Out of Your Property',
      metaDescription:
        'How equity release works in Dubai in 2026: release cash from your property without selling. LTV limits, process, timelines and costs.',
      heroTitle: 'Equity Release in Dubai: The 2026 Guide',
      heroLede:
        'If your Dubai property has grown in value, that gain is real money you can access — without selling.',
      bodyHtml: articles.equity,
      related: [
        { label: 'Off-plan mortgage guide', url: '/off-plan-mortgage-dubai' },
        { label: 'Resident mortgage guide', url: '/mortgage-for-residents-dubai' },
      ],
      faqs: [
        {
          question: 'Can I release equity from my property in Dubai?',
          answer:
            'Yes. Equity release in Dubai is usually done by refinancing into a larger mortgage and taking the difference in cash.',
        },
        {
          question: 'How much equity can I release in Dubai?',
          answer: 'Residents typically up to 70–75% LTV; non-residents around 50–60% LTV.',
        },
      ],
    },
    {
      title: 'Mortgage for Residents in Dubai',
      slug: 'mortgage-for-residents-dubai',
      metaTitle: 'Mortgage for Residents in Dubai 2026 | Salary, LTV & Rates',
      metaDescription:
        'How much salary you need, deposit, LTV and rates for a resident mortgage in Dubai in 2026.',
      heroTitle: 'Mortgage for Residents in Dubai: The 2026 Guide',
      heroLede:
        'Salary requirements, deposit, LTV caps and the step-by-step process for UAE residents buying in Dubai.',
      bodyHtml: articles.residents,
      related: [
        { label: 'Off-plan mortgage guide', url: '/off-plan-mortgage-dubai' },
        { label: 'Equity release guide', url: '/equity-release-dubai' },
      ],
      faqs: [
        {
          question: 'How much salary do I need for a mortgage in Dubai?',
          answer: 'Most banks require around AED 10,000–15,000 monthly. DBR (50%) often matters more.',
        },
      ],
    },
    {
      title: 'Off-Plan Mortgage in Dubai',
      slug: 'off-plan-mortgage-dubai',
      metaTitle: 'Off-Plan Mortgage in Dubai 2026 | Rules, LTV & Rates',
      metaDescription:
        'How off-plan mortgages work in Dubai in 2026: 50% LTV cap, milestones, rates and approved developers.',
      heroTitle: 'Off-Plan Mortgage in Dubai: The 2026 Guide',
      heroLede:
        'The 50% LTV rule, when the bank pays, current rates and which developers are approved — plain English for 2026.',
      bodyHtml: articles.offplan,
      related: [
        { label: 'Resident mortgage guide', url: '/mortgage-for-residents-dubai' },
        { label: 'Equity release guide', url: '/equity-release-dubai' },
      ],
      faqs: [
        {
          question: 'Can I get a mortgage on off-plan property in Dubai?',
          answer: 'Yes, on approved projects, capped at 50% LTV with staged bank releases.',
        },
      ],
    },
  ]

  for (const g of guidePages) {
    await upsertPage(payload, {
      title: g.title,
      slug: g.slug,
      template: 'guide',
      status: 'published',
      useSiteChrome: true,
      metaTitle: g.metaTitle,
      metaDescription: g.metaDescription,
      canonicalPath: '/' + g.slug,
      sections: [
        {
          blockType: 'hero',
          title: g.heroTitle,
          lede: g.heroLede,
          primaryCtaLabel: 'Request a free callback',
          primaryCtaLink: '/#contact',
          showCalculator: false,
          showTrustPills: false,
        },
        { blockType: 'richContent', html: g.bodyHtml },
        {
          blockType: 'faq',
          eyebrow: 'FAQ',
          heading: 'Frequently asked questions',
          items: g.faqs,
        },
        {
          blockType: 'relatedLinks',
          heading: 'Related guides',
          links: g.related,
        },
      ],
    })
  }

  console.log('Seed complete (section builder)')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

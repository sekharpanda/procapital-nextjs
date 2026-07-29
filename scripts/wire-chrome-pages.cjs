const fs = require('fs')

const homePage = `import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import ExactHomeClient from '@/components/ExactHomeClient'
import { SiteChrome } from '@/components/cms/SiteChrome'
import { stripExactChrome } from '@/lib/cms'
import '@/css/home.css'

export const metadata: Metadata = {
  title: 'Mortgage Broker in Dubai | Home Loans & Equity Release',
  description:
    'Independent mortgage broker in Dubai. Compare home loan & equity release rates from 25+ UAE banks and get pre-approved in days. Free, unbiased advice.',
  alternates: { canonical: 'https://procapital.ae/' },
}

export default async function HomePage() {
  const dir = path.join(process.cwd(), 'src', 'content')
  const raw = fs.readFileSync(path.join(dir, 'homeExact.html'), 'utf8')
  const html = stripExactChrome(raw)
  const script = fs.readFileSync(path.join(dir, 'homeExact.js'), 'utf8')
  return (
    <SiteChrome variant="home">
      <ExactHomeClient html={html} script={script} />
    </SiteChrome>
  )
}
`
fs.writeFileSync('src/app/(frontend)/page.tsx', homePage, 'utf8')

const slugPage = `import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ExactPageClient from '@/components/ExactPageClient'
import { SiteChrome } from '@/components/cms/SiteChrome'
import { stripExactChrome } from '@/lib/cms'
import '@/css/guide.css'

type Props = { params: Promise<{ slug: string }> }

const GUIDE_META: Record<string, { title: string; description: string; canonical: string }> = {
  'equity-release-dubai': {
    title: 'Equity Release in Dubai 2026 | Cash Out of Your Property',
    description:
      'How equity release works in Dubai in 2026: release cash from your property without selling. LTV limits, refinancing process, timelines and costs. Free advice.',
    canonical: 'https://procapital.ae/equity-release-dubai',
  },
  'mortgage-for-residents-dubai': {
    title: 'Mortgage for Residents in Dubai 2026 | Salary, LTV & Rates',
    description:
      'How much salary you need, deposit, LTV and rates for a resident mortgage in Dubai in 2026. Eligibility, costs and the step-by-step process. Free broker advice.',
    canonical: 'https://procapital.ae/mortgage-for-residents-dubai',
  },
  'off-plan-mortgage-dubai': {
    title: 'Off-Plan Mortgage in Dubai 2026 | Rules, LTV & Rates',
    description:
      'How off-plan mortgages work in Dubai in 2026: the 50% LTV cap, construction milestones, rates from 4.49%, eligibility and approved developers. Free advice.',
    canonical: 'https://procapital.ae/off-plan-mortgage-dubai',
  },
}

function loadGuide(slug: string) {
  const dir = path.join(process.cwd(), 'src', 'content')
  const htmlPath = path.join(dir, slug + '.html')
  const jsPath = path.join(dir, slug + '.js')
  if (!fs.existsSync(htmlPath)) return null
  return {
    html: stripExactChrome(fs.readFileSync(htmlPath, 'utf8')),
    script: fs.existsSync(jsPath) ? fs.readFileSync(jsPath, 'utf8') : '',
  }
}

export function generateStaticParams() {
  return Object.keys(GUIDE_META).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = GUIDE_META[slug]
  if (!meta) return { title: 'Page not found' }
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
  }
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params
  if (!GUIDE_META[slug]) notFound()
  const content = loadGuide(slug)
  if (!content) notFound()
  return (
    <SiteChrome variant="guide">
      <ExactPageClient html={content.html} script={content.script} />
    </SiteChrome>
  )
}
`
fs.writeFileSync('src/app/(frontend)/[slug]/page.tsx', slugPage, 'utf8')

// Fix Users admin group
let users = fs.readFileSync('src/collections/Users.ts', 'utf8')
if (!users.includes("group:")) {
  users = users.replace(
    'admin: {\n    useAsTitle: \'email\',',
    "admin: {\n    group: 'Team',\n    useAsTitle: 'email',",
  )
  fs.writeFileSync('src/collections/Users.ts', users, 'utf8')
}

console.log('pages wired to SiteChrome')

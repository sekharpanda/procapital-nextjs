export const dynamic = 'force-dynamic'
export const revalidate = 0
import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import ExactHomeClient from '@/components/ExactHomeClient'
import { SiteChrome } from '@/components/cms/SiteChrome'
import { stripExactChrome } from '@/lib/menu'
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

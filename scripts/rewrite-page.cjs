const fs = require('fs')
const page = `import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import ExactHomeClient from '@/components/ExactHomeClient'

export const metadata: Metadata = {
  title: 'Mortgage Broker in Dubai | Home Loans & Equity Release',
  description:
    'Independent mortgage broker in Dubai. Compare home loan & equity release rates from 25+ UAE banks and get pre-approved in days. Free, unbiased advice.',
  keywords:
    'mortgage broker Dubai, mortgage Dubai, home loan UAE, equity release Dubai, ProCapital',
  alternates: { canonical: 'https://procapital.ae/' },
  openGraph: {
    title: 'Mortgage Broker in Dubai | Home Loans & Equity Release ? ProCapital',
    description:
      'Independent mortgage and equity-release advice in Dubai. Compare rates from 25+ UAE banks and get pre-approved fast ? free and unbiased.',
    url: 'https://procapital.ae/',
    siteName: 'ProCapital',
    locale: 'en_AE',
    type: 'website',
  },
}

export default function HomePage() {
  const dir = path.join(process.cwd(), 'src', 'content')
  const html = fs.readFileSync(path.join(dir, 'homeExact.html'), 'utf8')
  const script = fs.readFileSync(path.join(dir, 'homeExact.js'), 'utf8')
  return <ExactHomeClient html={html} script={script} />
}
`
fs.writeFileSync('src/app/(frontend)/page.tsx', page, 'utf8')
console.log('page rewritten utf8')

const fs = require('fs')
fs.writeFileSync('src/app/(frontend)/page.tsx', `export const dynamic = 'force-dynamic'
export const revalidate = 0
import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'
import ExactHomeClient from '@/components/ExactHomeClient'
import '@/css/home.css'

export const metadata: Metadata = {
  title: 'Mortgage Broker in Dubai | Home Loans & Equity Release',
  description:
    'Independent mortgage broker in Dubai. Compare home loan & equity release rates from 25+ UAE banks and get pre-approved in days. Free, unbiased advice.',
  alternates: { canonical: 'https://procapital.ae/' },
}

export default async function HomePage() {
  const dir = path.join(process.cwd(), 'src', 'content')
  const html = fs.readFileSync(path.join(dir, 'homeExact.html'), 'utf8')
  const script = fs.readFileSync(path.join(dir, 'homeExact.js'), 'utf8')
  return <ExactHomeClient html={html} script={script} />
}
`, 'utf8')

// keep slug page exact but ensure force-dynamic
let slug = fs.readFileSync('src/app/(frontend)/[slug]/page.tsx', 'utf8')
if (!slug.includes('force-dynamic')) {
  slug = `export const dynamic = 'force-dynamic'\nexport const revalidate = 0\n` + slug
  fs.writeFileSync('src/app/(frontend)/[slug]/page.tsx', slug, 'utf8')
}
console.log('pages updated')

// Verify JS API + key markers in content
const home = fs.readFileSync('src/content/homeExact.html','utf8')
const js = fs.readFileSync('src/content/homeExact.js','utf8')
const markers = [
  'ticker','header','footer','hero','Mortgage calculator','svc-grid','steps','why','banks','testi','faq','leadForm','fab','Get pre-approved','Non-resident','Refinance','Commercial'
]
for (const m of markers) console.log(m, home.includes(m) || js.includes(m))
console.log('leadrat api', js.includes("/api/leadrat"))
console.log('sizes', {
  home: home.length,
  homeJs: js.length,
  homeCss: fs.readFileSync('src/css/home.css','utf8').length,
  guideCss: fs.readFileSync('src/css/guide.css','utf8').length,
  equity: fs.readFileSync('src/content/equity-release-dubai.html','utf8').length,
  residents: fs.readFileSync('src/content/mortgage-for-residents-dubai.html','utf8').length,
  offplan: fs.readFileSync('src/content/off-plan-mortgage-dubai.html','utf8').length,
})

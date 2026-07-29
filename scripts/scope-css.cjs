const fs = require('fs')

// Layout without home.css ? each page loads its own CSS
const layout = `import React from 'react'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://procapital.ae'),
  title: {
    default: 'Mortgage Broker in Dubai | Home Loans & Equity Release',
    template: '%s | ProCapital',
  },
  description:
    'Independent mortgage broker in Dubai. Compare rates from 25+ UAE banks.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AE">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
`
fs.writeFileSync('src/app/(frontend)/layout.tsx', layout, 'utf8')

// Ensure home page imports home.css
let home = fs.readFileSync('src/app/(frontend)/page.tsx', 'utf8')
if (!home.includes("import '@/css/home.css'")) {
  home = home.replace(
    "import ExactHomeClient from '@/components/ExactHomeClient'",
    "import ExactHomeClient from '@/components/ExactHomeClient'\nimport '@/css/home.css'",
  )
  fs.writeFileSync('src/app/(frontend)/page.tsx', home, 'utf8')
}
console.log('layout/home css scoped')

// Verify content files
for (const slug of ['equity-release-dubai','mortgage-for-residents-dubai','off-plan-mortgage-dubai']) {
  const html = fs.readFileSync('src/content/' + slug + '.html', 'utf8')
  console.log(slug, {
    header: html.includes('<header'),
    article: html.includes('<article'),
    faq: html.includes('faq-item'),
    arrow: html.includes('?'),
    homeLink: html.includes('href="/"'),
    len: html.length,
  })
}

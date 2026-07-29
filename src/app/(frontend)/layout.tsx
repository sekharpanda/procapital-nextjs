import React from 'react'

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

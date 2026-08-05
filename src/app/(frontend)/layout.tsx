import React from 'react'
import type { Metadata } from 'next'
import LeadModal from '@/components/LeadModal'

const FALLBACK_SITE_URL = 'https://procapital.ae'

function metadataBase() {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE_URL)
  } catch {
    return new URL(FALLBACK_SITE_URL)
  }
}

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION

export const metadata: Metadata = {
  metadataBase: metadataBase(),
  title: {
    default: 'Mortgage Broker in Dubai | Home Loans & Equity Release',
    template: '%s | ProCapital',
  },
  description:
    'Independent mortgage broker in Dubai. Compare rates from 25+ UAE banks.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: 'https://procapital.ae/',
    siteName: 'ProCapital',
    title: 'Mortgage Broker in Dubai | Home Loans & Equity Release',
    description:
      'Independent mortgage broker in Dubai. Compare rates from 25+ UAE banks.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mortgage Broker in Dubai | Home Loans & Equity Release',
    description:
      'Independent mortgage broker in Dubai. Compare rates from 25+ UAE banks.',
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AE">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <LeadModal />
      </body>
    </html>
  )
}

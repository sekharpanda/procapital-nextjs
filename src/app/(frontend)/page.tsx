export const dynamic = 'force-dynamic'
export const revalidate = 0
import type { Metadata } from 'next'
import { SiteChrome } from '@/components/cms/SiteChrome'
import { PageSections } from '@/components/cms/PageSections'
import { getPageBySlug } from '@/lib/payload'
import '@/css/home.css'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug('home')
  return {
    title: page?.metaTitle || 'Mortgage Broker in Dubai | Home Loans & Equity Release',
    description:
      page?.metaDescription ||
      'Independent mortgage broker in Dubai. Compare home loan & equity release rates from 25+ UAE banks and get pre-approved in days. Free, unbiased advice.',
    alternates: { canonical: page?.canonicalPath || 'https://procapital.ae/' },
  }
}

export default async function HomePage() {
  const page = await getPageBySlug('home')
  const sections = (page?.sections as { blockType: string }[] | null) || []

  return (
    <SiteChrome variant="home">
      <PageSections sections={sections} variant="home" />
    </SiteChrome>
  )
}

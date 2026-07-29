import Link from 'next/link'
import { FaqAccordion } from '@/components/FaqAccordion'
import { SiteHeader } from '@/components/SiteHeader'
import { mediaUrl } from '@/lib/payload'

type Settings = {
  siteName?: string | null
  logo?: unknown
  phone?: string | null
  phoneHref?: string | null
  email?: string | null
  whatsappNumber?: string | null
  whatsappMessage?: string | null
  guideDisclaimer?: string | null
}

type Page = {
  title?: string | null
  slug?: string | null
  heroTitle?: string | null
  heroLede?: string | null
  heroUpdated?: string | null
  bodyHtml?: string | null
  faqs?: { question: string; answer: string; id?: string | null }[] | null
  relatedLinks?: { label: string; slug: string; id?: string | null }[] | null
}

export function GuideView({ settings, page }: { settings: Settings; page: Page }) {
  const logo = mediaUrl(settings.logo)
  const phone = settings.phone || '+971 58 810 3755'
  const phoneHref = settings.phoneHref || '+971588103755'
  const wa = settings.whatsappNumber || '971588103755'
  const waMsg = encodeURIComponent(
    settings.whatsappMessage || `Hi ProCapital, I'd like advice about ${page.title || 'mortgages'}.`,
  )

  return (
    <>
      <SiteHeader
        siteName={settings.siteName || 'ProCapital'}
        logoUrl={logo}
        phone={phone}
        phoneHref={phoneHref}
        variant="guide"
      />

      <section className="hero">
        <div className="wrap">
          <nav className="crumb">
            <Link href="/">Home</Link> › {page.title}
          </nav>
          <h1>{page.heroTitle || page.title}</h1>
          <p className="lede">{page.heroLede}</p>
          {page.heroUpdated && (
            <p className="updated">
              <span dangerouslySetInnerHTML={{ __html: page.heroUpdated.replace(/July 2026/g, '<b>July 2026</b>') }} />
            </p>
          )}
        </div>
      </section>

      <article>
        <div className="wrap">
          {page.bodyHtml ? (
            <div dangerouslySetInnerHTML={{ __html: page.bodyHtml }} />
          ) : null}

          {(page.faqs?.length || 0) > 0 && (
            <>
              <h2>Frequently asked questions</h2>
              <FaqAccordion faqs={page.faqs || []} />
            </>
          )}

          <div className="cta">
            <h2>Want a free callback on your options?</h2>
            <p>We’ll compare banks for your situation and explain what you can realistically release or borrow.</p>
            <div className="btns">
              <Link href="/#contact" className="btn btn-primary">
                Request a free callback
              </Link>
              <a
                href={`https://wa.me/${wa}?text=${waMsg}`}
                className="btn btn-wa"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {(page.relatedLinks?.length || 0) > 0 && (
            <div className="related">
              <h3>Related guides</h3>
              {page.relatedLinks!.map((r) => (
                <Link key={r.id || r.slug} href={`/${r.slug}`}>
                  {r.label}
                </Link>
              ))}
            </div>
          )}

          {settings.guideDisclaimer && <p className="disclaimer">{settings.guideDisclaimer}</p>}
        </div>
      </article>

      <footer>
        <p>
          <Link href="/">{settings.siteName || 'ProCapital'}</Link>
        </p>
        <p style={{ marginTop: 8 }}>
          <a href={`tel:${phoneHref}`}>{phone}</a> ·{' '}
          <a href={`mailto:${settings.email || 'info@procapital.ae'}`}>
            {settings.email || 'info@procapital.ae'}
          </a>{' '}
          · <Link href="/">procapital.ae</Link>
        </p>
      </footer>
    </>
  )
}

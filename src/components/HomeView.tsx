import Link from 'next/link'
import { FaqAccordion } from '@/components/FaqAccordion'
import { LeadForm } from '@/components/LeadForm'
import { MortgageCalculator } from '@/components/MortgageCalculator'
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
  tickerItems?: { label?: string | null; value?: string | null; id?: string | null }[] | null
  footerDisclaimer?: string | null
}

type Page = {
  heroEyebrow?: string | null
  heroTitle?: string | null
  heroHighlight?: string | null
  heroLede?: string | null
  services?:
    | {
        title: string
        description: string
        linkLabel?: string | null
        linkSlug?: string | null
        id?: string | null
      }[]
    | null
  howSteps?: { title: string; description: string; id?: string | null }[] | null
  whyPoints?: { title: string; description: string; id?: string | null }[] | null
  banks?: { name: string; id?: string | null }[] | null
  testimonials?:
    | { quote: string; author: string; role?: string | null; id?: string | null }[]
    | null
  faqs?: { question: string; answer: string; id?: string | null }[] | null
}

export function HomeView({ settings, page }: { settings: Settings; page: Page }) {
  const logo = mediaUrl(settings.logo)
  const phone = settings.phone || '+971 58 810 3755'
  const phoneHref = settings.phoneHref || '+971588103755'
  const wa = settings.whatsappNumber || '971588103755'
  const waMsg = encodeURIComponent(
    settings.whatsappMessage || "Hi ProCapital, I'd like mortgage advice.",
  )
  const ticker = settings.tickerItems?.length
    ? settings.tickerItems
    : [
        { label: 'EIBOR 1M', value: '3.65%' },
        { label: 'EIBOR 3M', value: '3.66%' },
        { label: 'Best 3-yr fixed from', value: '3.95% p.a.' },
      ]

  const titleParts = (() => {
    const full = page.heroTitle || 'The right mortgage, without the guesswork.'
    const hi = page.heroHighlight
    if (!hi || !full.includes(hi)) return { before: full, highlight: '', after: '' }
    const i = full.indexOf(hi)
    return { before: full.slice(0, i), highlight: hi, after: full.slice(i + hi.length) }
  })()

  return (
    <>
      <div className="ticker" aria-label="Current rates">
        <div className="ticker-track">
          {[...ticker, ...ticker].map((t, i) => (
            <span key={i}>
              <span className="dot"></span>
              <span>
                {t.label} &nbsp;<b>{t.value}</b>
              </span>
            </span>
          ))}
        </div>
      </div>

      <SiteHeader
        siteName={settings.siteName || 'ProCapital'}
        logoUrl={logo}
        phone={phone}
        phoneHref={phoneHref}
      />
      <span id="top"></span>

      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy reveal in">
            {page.heroEyebrow && <span className="eyebrow">{page.heroEyebrow}</span>}
            <h1>
              {titleParts.before}
              {titleParts.highlight && <span className="accent">{titleParts.highlight}</span>}
              {titleParts.after}
            </h1>
            <p className="lede">{page.heroLede}</p>
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">
                Get pre-approved free
              </a>
              <a href="#calc" className="btn btn-ghost">
                Try the calculator
              </a>
            </div>
            <div className="rating">
              <span className="stars">★★★★★</span>
              <span className="score">4.9/5</span>
              <span className="txt">from clients across Dubai · independent &amp; unbiased</span>
            </div>
          </div>
          <MortgageCalculator />
        </div>
      </section>

      <section className="section services" id="services">
        <div className="wrap">
          <div className="section-head reveal in">
            <span className="eyebrow">What we do</span>
            <h2>Mortgage solutions for every buyer</h2>
            <p>Whether you live in Dubai or invest from overseas, we package the right bank for you.</p>
          </div>
          <div className="svc-grid">
            {(page.services || []).map((s) => (
              <article className="svc-card" key={s.id || s.title}>
                <h3>{s.title}</h3>
                <p>{s.description}</p>
                {s.linkSlug && (
                  <Link href={`/${s.linkSlug}`} className="svc-link">
                    {s.linkLabel || 'Read the guide →'}
                  </Link>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section how" id="how">
        <div className="wrap">
          <div className="section-head reveal in">
            <span className="eyebrow">How it works</span>
            <h2>From enquiry to approval, handled for you</h2>
          </div>
          <div className="steps">
            {(page.howSteps || []).map((step, i) => (
              <div className="step" key={step.id || i}>
                <div className="n">{i + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section why" id="why">
        <div className="wrap">
          <div className="section-head reveal in">
            <span className="eyebrow">Why ProCapital</span>
            <h2>Independent advice. Whole-of-market reach.</h2>
          </div>
          <div className="why-grid">
            {(page.whyPoints || []).map((p) => (
              <div className="why-card" key={p.id || p.title}>
                <h3>{p.title}</h3>
                <p>{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {(page.banks?.length || 0) > 0 && (
        <section className="section banks">
          <div className="wrap">
            <div className="section-head reveal in">
              <span className="eyebrow">Banks</span>
              <h2>We work across the UAE lending market</h2>
            </div>
            <div className="bank-row">
              {page.banks!.map((b) => (
                <span className="bank-chip" key={b.id || b.name}>
                  {b.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {(page.testimonials?.length || 0) > 0 && (
        <section className="section testi">
          <div className="wrap">
            <div className="section-head reveal in">
              <span className="eyebrow">Clients</span>
              <h2>What buyers say</h2>
            </div>
            <div className="testi-grid">
              {page.testimonials!.map((t) => (
                <blockquote className="testi-card" key={t.id || t.author}>
                  <p>“{t.quote}”</p>
                  <footer>
                    <strong>{t.author}</strong>
                    {t.role ? ` · ${t.role}` : ''}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section faq" id="faq">
        <div className="wrap">
          <div className="section-head reveal in">
            <span className="eyebrow">FAQ</span>
            <h2>Common questions</h2>
          </div>
          <FaqAccordion faqs={page.faqs || []} />
        </div>
      </section>

      <section className="section cta" id="contact">
        <div className="wrap cta-grid">
          <div className="cta-copy">
            <span className="eyebrow" style={{ color: 'var(--gold-soft)' }}>
              Free consultation
            </span>
            <h2>Get your free mortgage callback</h2>
            <p>
              Tell us what you need — a ProCapital advisor will call you, usually within one business
              day.
            </p>
            <p>
              Or WhatsApp us now:{' '}
              <a href={`https://wa.me/${wa}?text=${waMsg}`} target="_blank" rel="noopener noreferrer">
                Chat on WhatsApp
              </a>
            </p>
          </div>
          <div className="lead-card">
            <LeadForm />
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="brand">{settings.siteName || 'ProCapital'}</div>
          <p style={{ marginTop: 12 }}>{settings.footerDisclaimer}</p>
          <p style={{ marginTop: 8 }}>
            <a href={`tel:${phoneHref}`}>{phone}</a> ·{' '}
            <a href={`mailto:${settings.email || 'info@procapital.ae'}`}>
              {settings.email || 'info@procapital.ae'}
            </a>
          </p>
          <p style={{ marginTop: 16, opacity: 0.7 }}>
            © {new Date().getFullYear()} {settings.siteName || 'ProCapital'}. All rights reserved.
          </p>
        </div>
      </footer>

      <a
        className="fab"
        href={`https://wa.me/${wa}?text=${waMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff">
          <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.2l-.9 1.1c-.1.2-.3.2-.5.1-1.1-.5-2.3-1.4-3.2-2.6-.2-.3 0-.4.2-.6l.8-.9c.2-.2.2-.4.1-.6l-1-2.1c-.1-.3-.4-.4-.6-.3-.5.1-1.1.6-1.2 1.4-.2 1.3.2 2.8 1.5 4.3 1.5 1.8 3.4 2.9 5.3 3.3.7.2 1.5.1 2-.2.6-.4 1-1.1 1.1-1.6.1-.3 0-.5-.3-.7zM12.1 21.5c-1.7 0-3.3-.4-4.8-1.3l-.3-.2-3.4.9.9-3.3-.2-.3A8.8 8.8 0 0 1 3.2 12c0-4.9 4-8.8 8.9-8.8 2.4 0 4.6.9 6.3 2.6a8.8 8.8 0 0 1-6.3 15.7zm0-19.4C6.6 2.1 2.1 6.6 2.1 12c0 1.7.4 3.3 1.3 4.7L2 22l5.4-1.4a9.9 9.9 0 0 0 4.7 1.2c5.4 0 9.9-4.5 9.9-9.9S17.5 2.1 12.1 2.1z" />
        </svg>
      </a>
    </>
  )
}

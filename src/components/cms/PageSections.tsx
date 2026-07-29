import Link from 'next/link'
import { FaqAccordion } from '@/components/FaqAccordion'
import { LeadForm } from '@/components/LeadForm'
import { MortgageCalculator } from '@/components/MortgageCalculator'
import { mediaUrl } from '@/lib/menu'

type AnyBlock = {
  id?: string | null
  blockType: string
  [key: string]: unknown
}

function resolveImage(block: {
  image?: unknown
  imageUrl?: string | null
}): string | null {
  return mediaUrl(block.image) || (block.imageUrl ? String(block.imageUrl) : null)
}

function SectionHead({
  eyebrow,
  heading,
  intro,
}: {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
}) {
  if (!eyebrow && !heading && !intro) return null
  return (
    <div className="section-head reveal in">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      {heading ? <h2>{heading}</h2> : null}
      {intro ? <p>{intro}</p> : null}
    </div>
  )
}

function HeroSection({ block }: { block: AnyBlock }) {
  const title = String(block.title || '')
  const highlight = block.highlight ? String(block.highlight) : ''
  const parts = (() => {
    if (!highlight || !title.includes(highlight)) return { before: title, highlight: '', after: '' }
    const i = title.indexOf(highlight)
    return { before: title.slice(0, i), highlight, after: title.slice(i + highlight.length) }
  })()
  const img = resolveImage(block)
  const primaryHref = String(block.primaryCtaLink || '#contact')
  const secondaryHref = String(block.secondaryCtaLink || '#calc')

  return (
    <section className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy reveal in">
          {block.eyebrow ? <span className="eyebrow">{String(block.eyebrow)}</span> : null}
          <h1>
            {parts.before}
            {parts.highlight ? <span className="accent">{parts.highlight}</span> : null}
            {parts.after}
          </h1>
          {block.lede ? <p className="lede">{String(block.lede)}</p> : null}
          <div className="hero-actions">
            {block.primaryCtaLabel ? (
              <a href={primaryHref} className="btn btn-primary">
                {String(block.primaryCtaLabel)}
              </a>
            ) : null}
            {block.secondaryCtaLabel ? (
              <a href={secondaryHref} className="btn btn-ghost">
                {String(block.secondaryCtaLabel)}
              </a>
            ) : null}
          </div>
          {block.showTrustPills !== false ? (
            <div className="rating">
              <span className="stars">★★★★★</span>
              <span className="score">4.9/5</span>
              <span className="txt">from clients across Dubai · independent &amp; unbiased</span>
            </div>
          ) : null}
        </div>
        {block.showCalculator ? (
          <div id="calc">
            <MortgageCalculator />
          </div>
        ) : img ? (
          <div className="hero-media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt={String(block.title || 'Hero')} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

function ImageSection({ block }: { block: AnyBlock }) {
  const src = resolveImage(block)
  if (!src) return null
  const size = String(block.size || 'wide')
  return (
    <section className={`section image-block size-${size}`}>
      <div className="wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={String(block.alt || block.caption || '')} />
        {block.caption ? <p className="image-caption">{String(block.caption)}</p> : null}
      </div>
    </section>
  )
}

function ServicesSection({ block }: { block: AnyBlock }) {
  const items = (block.items as AnyBlock[] | null) || []
  return (
    <section className="section services" id="services">
      <div className="wrap">
        <SectionHead
          eyebrow={block.eyebrow as string}
          heading={block.heading as string}
          intro={block.intro as string}
        />
        <div className="svc-grid">
          {items.map((s, i) => {
            const img = resolveImage(s)
            return (
              <article className="svc-card" key={String(s.id || i)}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="svc-img" src={img} alt={String(s.title || '')} />
                ) : null}
                <h3>{String(s.title)}</h3>
                <p>{String(s.description)}</p>
                {s.linkUrl ? (
                  <Link href={String(s.linkUrl)} className="svc-link">
                    {String(s.linkLabel || 'Learn more →')}
                  </Link>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StepsSection({ block }: { block: AnyBlock }) {
  const items = (block.items as AnyBlock[] | null) || []
  return (
    <section className="section how" id="how">
      <div className="wrap">
        <SectionHead
          eyebrow={block.eyebrow as string}
          heading={block.heading as string}
          intro={block.intro as string}
        />
        <div className="steps">
          {items.map((step, i) => (
            <div className="step" key={String(step.id || i)}>
              <div className="n">{i + 1}</div>
              <h3>{String(step.title)}</h3>
              <p>{String(step.description)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureGridSection({ block }: { block: AnyBlock }) {
  const items = (block.items as AnyBlock[] | null) || []
  return (
    <section className="section why" id="why">
      <div className="wrap">
        <SectionHead eyebrow={block.eyebrow as string} heading={block.heading as string} />
        <div className="why-grid">
          {items.map((p, i) => {
            const img = resolveImage(p)
            return (
              <div className="why-card" key={String(p.id || i)}>
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="why-img" src={img} alt={String(p.title || '')} />
                ) : null}
                <h3>{String(p.title)}</h3>
                <p>{String(p.description)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function BanksSection({ block }: { block: AnyBlock }) {
  const items = (block.items as AnyBlock[] | null) || []
  return (
    <section className="section banks">
      <div className="wrap">
        <SectionHead eyebrow={block.eyebrow as string} heading={block.heading as string} />
        <div className="bank-row">
          {items.map((b, i) => {
            const img = resolveImage(b)
            return img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="bank-logo" key={String(b.id || i)} src={img} alt={String(b.name)} />
            ) : (
              <span className="bank-chip" key={String(b.id || i)}>
                {String(b.name)}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection({ block }: { block: AnyBlock }) {
  const items = (block.items as AnyBlock[] | null) || []
  return (
    <section className="section testi">
      <div className="wrap">
        <SectionHead eyebrow={block.eyebrow as string} heading={block.heading as string} />
        <div className="testi-grid">
          {items.map((t, i) => (
            <blockquote className="testi-card" key={String(t.id || i)}>
              <p>“{String(t.quote)}”</p>
              <footer>
                <strong>{String(t.author)}</strong>
                {t.role ? ` · ${String(t.role)}` : ''}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqSection({ block }: { block: AnyBlock }) {
  const items = ((block.items as { question: string; answer: string; id?: string }[]) || []).map(
    (f) => ({ question: f.question, answer: f.answer, id: f.id }),
  )
  return (
    <section className="section faq" id="faq">
      <div className="wrap">
        <SectionHead eyebrow={block.eyebrow as string} heading={block.heading as string} />
        <FaqAccordion faqs={items} />
      </div>
    </section>
  )
}

function CtaFormSection({ block }: { block: AnyBlock }) {
  return (
    <section className="section cta" id="contact">
      <div className="wrap cta-grid">
        <div className="cta-copy">
          {block.eyebrow ? (
            <span className="eyebrow" style={{ color: 'var(--gold-soft)' }}>
              {String(block.eyebrow)}
            </span>
          ) : null}
          {block.heading ? <h2>{String(block.heading)}</h2> : null}
          {block.body ? <p>{String(block.body)}</p> : null}
        </div>
        {block.showLeadForm !== false ? (
          <div className="lead-card">
            <LeadForm />
          </div>
        ) : null}
      </div>
    </section>
  )
}

function RichHtmlSection({ block, article }: { block: AnyBlock; article?: boolean }) {
  const html = String(block.html || '')
  if (!html) return null
  if (article) {
    return (
      <article>
        <div className="wrap" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
    )
  }
  return (
    <section className="section">
      <div className="wrap" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  )
}

function RelatedLinksSection({ block }: { block: AnyBlock }) {
  const links = (block.links as { label: string; url: string; id?: string }[]) || []
  return (
    <section className="section">
      <div className="wrap related">
        <h3>{String(block.heading || 'Related guides')}</h3>
        {links.map((r, i) => (
          <Link key={String(r.id || i)} href={r.url}>
            {r.label}
          </Link>
        ))}
      </div>
    </section>
  )
}

function StatsSection({ block }: { block: AnyBlock }) {
  const items = (block.items as { value: string; label: string; id?: string }[]) || []
  return (
    <section className="section stats-bar">
      <div className="wrap bank-row">
        {items.map((s, i) => (
          <span className="bank-chip" key={String(s.id || i)}>
            <b>{s.value}</b> {s.label}
          </span>
        ))}
      </div>
    </section>
  )
}

export function PageSections({
  sections,
  variant = 'home',
}: {
  sections: AnyBlock[] | null | undefined
  variant?: 'home' | 'guide'
}) {
  if (!sections?.length) {
    return (
      <section className="section">
        <div className="wrap">
          <p>This page has no sections yet. Open Admin → Pages → Sections and click “Add Section”.</p>
        </div>
      </section>
    )
  }

  return (
    <div className={`cms-page cms-page--${variant}`}>
      {sections.map((block, index) => {
        const key = String(block.id || `${block.blockType}-${index}`)
        switch (block.blockType) {
          case 'hero':
            return <HeroSection key={key} block={block} />
          case 'image':
            return <ImageSection key={key} block={block} />
          case 'stats':
            return <StatsSection key={key} block={block} />
          case 'services':
            return <ServicesSection key={key} block={block} />
          case 'steps':
            return <StepsSection key={key} block={block} />
          case 'featureGrid':
            return <FeatureGridSection key={key} block={block} />
          case 'banks':
            return <BanksSection key={key} block={block} />
          case 'testimonials':
            return <TestimonialsSection key={key} block={block} />
          case 'faq':
            return <FaqSection key={key} block={block} />
          case 'ctaForm':
            return <CtaFormSection key={key} block={block} />
          case 'richContent':
            return <RichHtmlSection key={key} block={block} article={variant === 'guide'} />
          case 'customHtml':
            return <RichHtmlSection key={key} block={block} />
          case 'relatedLinks':
            return <RelatedLinksSection key={key} block={block} />
          default:
            return null
        }
      })}
    </div>
  )
}

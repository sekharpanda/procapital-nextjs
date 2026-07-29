const fs = require('fs')
const path = require('path')
const root = 'C:/Users/PROWIN/Desktop/procapital-nextjs'
function w(rel, content) {
  const p = path.join(root, rel)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, content, 'utf8')
  console.log('wrote', rel)
}

w('src/lib/cms.ts', `import { getPayload } from 'payload'
import config from '@payload-config'

export async function getPayloadClient() {
  return getPayload({ config })
}

export async function getSiteChrome() {
  const payload = await getPayloadClient()
  const [settings, header, footer] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 2 }),
    payload.findGlobal({ slug: 'header', depth: 3 }),
    payload.findGlobal({ slug: 'footer', depth: 3 }),
  ])
  return { settings, header, footer }
}

export function mediaUrl(media: unknown): string | null {
  if (!media || typeof media !== 'object') return null
  const m = media as { url?: string | null }
  return m.url || null
}

export function resolveMenuHref(item: {
  linkType?: string | null
  url?: string | null
  page?: unknown
}): string {
  if (item.linkType === 'page' && item.page && typeof item.page === 'object') {
    const slug = (item.page as { slug?: string }).slug
    if (!slug || slug === 'home') return '/'
    return '/' + slug
  }
  return item.url || '#'
}

/** Remove embedded header/footer so CMS chrome can replace them. */
export function stripExactChrome(html: string): string {
  return html
    .replace(/<div class="ticker"[\\s\\S]*?<\\/div>\\s*/i, '')
    .replace(/<header[\\s\\S]*?<\\/header>\\s*/i, '')
    .replace(/<footer[\\s\\S]*?<\\/footer>\\s*/i, '')
}
`)

w('src/components/cms/CmsHeader.tsx', `'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { resolveMenuHref } from '@/lib/cms'

type MenuItem = {
  id?: string | null
  label: string
  linkType?: string | null
  url?: string | null
  page?: unknown
  openInNewTab?: boolean | null
  children?: MenuItem[] | null
}

type Props = {
  siteName: string
  phone?: string | null
  phoneHref?: string | null
  tickerItems?: { label?: string | null; value?: string | null }[] | null
  header: {
    style?: string | null
    sticky?: boolean | null
    showTopBar?: boolean | null
    topBarText?: string | null
    showTicker?: boolean | null
    showPhone?: boolean | null
    logo?: unknown
    logoText?: string | null
    ctaLabel?: string | null
    ctaLink?: string | null
    ctaStyle?: string | null
    menu?: { items?: MenuItem[] | null } | number | null
  }
}

function logoSrc(logo: unknown) {
  if (logo && typeof logo === 'object' && 'url' in logo) return (logo as { url?: string }).url || null
  return null
}

export function CmsHeader({ siteName, phone, phoneHref, tickerItems, header }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const logo = logoSrc(header.logo)
  const items = header.menu && typeof header.menu === 'object' ? header.menu.items || [] : []
  const sticky = header.sticky !== false

  useEffect(() => {
    if (!sticky) return
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [sticky])

  return (
    <>
      {header.showTopBar && header.topBarText ? (
        <div
          style={{
            background: 'var(--maroon-deep, #0A3A46)',
            color: '#fff',
            fontSize: 13,
            textAlign: 'center',
            padding: '8px 16px',
          }}
        >
          {header.topBarText}
        </div>
      ) : null}

      {header.showTicker !== false && tickerItems && tickerItems.length > 0 ? (
        <div className="ticker" aria-label="Rates ticker">
          <div className="ticker-track">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i}>
                <span className="dot"></span>
                <span>
                  {t.label} &nbsp;<b>{t.value}</b>
                </span>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <header id="hdr" className={scrolled ? 'scrolled' : undefined}>
        <div className="wrap nav">
          <Link href="/" className="brand">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt={siteName} style={{ height: 40, width: 'auto' }} />
            ) : (
              header.logoText || siteName
            )}
          </Link>

          <nav className={\`nav-links\${open ? ' open' : ''}\`}>
            {items.map((item) => {
              const href = resolveMenuHref(item)
              return (
                <a
                  key={item.id || item.label}
                  href={href}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="nav-cta">
            {header.showPhone !== false && phone ? (
              <a href={\`tel:\${phoneHref || phone}\`} className="nav-phone">
                {phone}
              </a>
            ) : null}
            {header.ctaStyle !== 'hidden' && header.ctaLabel ? (
              <a href={header.ctaLink || '#contact'} className="btn btn-primary">
                {header.ctaLabel}
              </a>
            ) : null}
            <button className="burger" aria-label="Menu" type="button" onClick={() => setOpen((v) => !v)}>
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
`)

w('src/components/cms/CmsFooter.tsx', `import Link from 'next/link'
import { resolveMenuHref } from '@/lib/cms'

type Props = {
  siteName: string
  phone?: string | null
  email?: string | null
  phoneHref?: string | null
  footer: {
    style?: string | null
    aboutText?: string | null
    copyrightText?: string | null
    disclaimer?: string | null
    columns?:
      | {
          id?: string | null
          title: string
          links?: { id?: string | null; label: string; url: string }[] | null
        }[]
      | null
    socialLinks?: { id?: string | null; platform?: string | null; url: string }[] | null
    menu?: { items?: { label: string; linkType?: string | null; url?: string | null; page?: unknown }[] | null } | number | null
    logo?: unknown
  }
}

export function CmsFooter({ siteName, phone, email, phoneHref, footer }: Props) {
  const year = new Date().getFullYear()
  const columns = footer.columns || []
  const menuItems =
    footer.menu && typeof footer.menu === 'object' ? footer.menu.items || [] : []

  return (
    <footer>
      <div className="wrap">
        {footer.style !== 'simple' && columns.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
              gap: 28,
              textAlign: 'left',
              marginBottom: 28,
            }}
          >
            <div>
              <div className="brand" style={{ marginBottom: 10 }}>
                {siteName}
              </div>
              {footer.aboutText ? <p style={{ opacity: 0.85 }}>{footer.aboutText}</p> : null}
            </div>
            {columns.map((col) => (
              <div key={col.id || col.title}>
                <h4 style={{ marginBottom: 12, color: 'var(--gold-soft, #8FC7A6)' }}>{col.title}</h4>
                {(col.links || []).map((l) => (
                  <div key={l.id || l.label} style={{ marginBottom: 8 }}>
                    <Link href={l.url}>{l.label}</Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : null}

        {menuItems.length > 0 ? (
          <p style={{ marginBottom: 12 }}>
            {menuItems.map((item, i) => (
              <span key={item.label}>
                {i > 0 ? ' ? ' : ''}
                <a href={resolveMenuHref(item)}>{item.label}</a>
              </span>
            ))}
          </p>
        ) : null}

        <p style={{ marginTop: 8 }}>
          {phone ? <a href={\`tel:\${phoneHref || phone}\`}>{phone}</a> : null}
          {phone && email ? ' ? ' : ''}
          {email ? <a href={\`mailto:\${email}\`}>{email}</a> : null}
        </p>

        {footer.disclaimer ? <p style={{ marginTop: 12, opacity: 0.75 }}>{footer.disclaimer}</p> : null}

        {(footer.socialLinks || []).length > 0 ? (
          <p style={{ marginTop: 12 }}>
            {footer.socialLinks!.map((s) => (
              <a
                key={s.id || s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginRight: 14 }}
              >
                {s.platform || 'Link'}
              </a>
            ))}
          </p>
        ) : null}

        <p style={{ marginTop: 16, opacity: 0.7 }}>
          {footer.copyrightText || \`? \${year} \${siteName}. All rights reserved.\`}
        </p>
      </div>
    </footer>
  )
}
`)

w('src/components/cms/SiteChrome.tsx', `import { CmsFooter } from '@/components/cms/CmsFooter'
import { CmsHeader } from '@/components/cms/CmsHeader'
import { getSiteChrome } from '@/lib/cms'

export async function SiteChrome({
  children,
  variant = 'home',
}: {
  children: React.ReactNode
  variant?: 'home' | 'guide'
}) {
  const { settings, header, footer } = await getSiteChrome()
  const css = variant === 'guide' ? 'guide' : 'home'

  return (
    <>
      {/* css imported by page */}
      <CmsHeader
        siteName={settings.siteName || 'ProCapital'}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        tickerItems={variant === 'home' ? settings.tickerItems : []}
        header={header as never}
      />
      {children}
      <CmsFooter
        siteName={settings.siteName || 'ProCapital'}
        phone={settings.phone}
        phoneHref={settings.phoneHref}
        email={settings.email}
        footer={{
          ...(footer as object),
          disclaimer: footer.disclaimer || settings.footerDisclaimer,
        } as never}
      />
    </>
  )
}
`)

console.log('cms chrome components done')

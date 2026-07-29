const fs = require('fs')

const header = String.raw`'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { resolveMenuHref } from '@/lib/menu'

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
        <div className="cms-topbar">{header.topBarText}</div>
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

          <nav className={'nav-links' + (open ? ' open' : '')}>
            {items.map((item) => {
              const href = resolveMenuHref(item)
              const kids = item.children || []
              if (kids.length > 0) {
                return (
                  <div className="nav-dd" key={item.id || item.label}>
                    <button type="button" className="nav-dd__btn" aria-haspopup="true">
                      {item.label} <span aria-hidden>?</span>
                    </button>
                    <div className="nav-dd__menu">
                      {kids.map((child) => (
                        <a
                          key={child.id || child.label}
                          href={resolveMenuHref(child)}
                          target={child.openInNewTab ? '_blank' : undefined}
                          rel={child.openInNewTab ? 'noopener noreferrer' : undefined}
                          onClick={() => setOpen(false)}
                        >
                          {child.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )
              }
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
              <a href={'tel:' + (phoneHref || phone)} className="nav-phone">
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
`

fs.writeFileSync('src/components/cms/CmsHeader.tsx', header, 'utf8')
console.log('header ok')

const chromeCss = `
/* CMS chrome extras */
.cms-topbar{background:var(--maroon-deep,#0A3A46);color:#fff;font-size:13px;text-align:center;padding:8px 16px}
.nav-dd{position:relative;display:inline-flex;align-items:center}
.nav-dd__btn{background:none;border:0;font:inherit;color:inherit;cursor:pointer;padding:0;display:inline-flex;align-items:center;gap:4px}
.nav-dd__menu{display:none;position:absolute;top:calc(100% + 10px);left:0;min-width:220px;background:#fff;border:1px solid var(--line,#E3DED0);border-radius:12px;box-shadow:var(--shadow,0 18px 50px -24px rgba(14,45,55,.28));padding:8px;z-index:40}
.nav-dd:hover .nav-dd__menu,.nav-dd:focus-within .nav-dd__menu{display:block}
.nav-dd__menu a{display:block;padding:10px 12px;border-radius:8px;color:var(--ink,#17242A)!important;font-weight:500}
.nav-dd__menu a:hover{background:var(--cream,#F5F1E8);text-decoration:none}
@media(max-width:900px){
  .nav-dd{display:block;width:100%}
  .nav-dd__btn{padding:10px 0}
  .nav-dd__menu{position:static;box-shadow:none;border:0;padding:0 0 0 12px;display:block}
}
`
for (const f of ['src/css/home.css', 'src/css/guide.css']) {
  let t = fs.readFileSync(f, 'utf8')
  if (!t.includes('.nav-dd{')) {
    fs.writeFileSync(f, t + chromeCss, 'utf8')
    console.log('css', f)
  }
}

for (const f of ['src/app/(frontend)/page.tsx', 'src/app/(frontend)/[slug]/page.tsx']) {
  let t = fs.readFileSync(f, 'utf8')
  if (!t.includes("export const dynamic")) {
    t = "export const dynamic = 'force-dynamic'\nexport const revalidate = 0\n" + t
    fs.writeFileSync(f, t, 'utf8')
    console.log('dynamic', f)
  }
}

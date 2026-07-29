'use client'

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
                      {item.label} <span aria-hidden="true">v</span>
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

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Props = {
  siteName: string
  logoUrl?: string | null
  phone: string
  phoneHref: string
  variant?: 'home' | 'guide'
}

export function SiteHeader({ siteName, logoUrl, phone, phoneHref, variant = 'home' }: Props) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (variant === 'guide') {
    return (
      <header>
        <div className="nav">
          <Link href="/" className="brand">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={siteName} style={{ height: 36, width: 'auto' }} />
            ) : (
              <>
                <span className="pro">PRO</span>
                <span className="cap">capital</span>
              </>
            )}
          </Link>
          <Link href="/" className="nav-back">
            ← Back to home
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header id="hdr" className={scrolled ? 'scrolled' : undefined}>
      <div className="wrap nav">
        <Link href="/#top" className="brand">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} style={{ height: 40, width: 'auto' }} />
          ) : (
            siteName
          )}
        </Link>
        <nav className={`nav-links${open ? ' open' : ''}`} id="navLinks">
          <a href="#services" onClick={() => setOpen(false)}>
            Services
          </a>
          <a href="#how" onClick={() => setOpen(false)}>
            How it works
          </a>
          <a href="#why" onClick={() => setOpen(false)}>
            Why us
          </a>
          <a href="#faq" onClick={() => setOpen(false)}>
            FAQ
          </a>
          <a href="#contact" onClick={() => setOpen(false)}>
            Contact
          </a>
          <a href="#contact" className="nav-mobile-cta" onClick={() => setOpen(false)}>
            Get pre-approved →
          </a>
        </nav>
        <div className="nav-cta">
          <a href={`tel:${phoneHref}`} className="nav-phone">
            {phone}
          </a>
          <a href="#contact" className="btn btn-primary">
            Get pre-approved
          </a>
          <button
            className="burger"
            aria-label="Menu"
            type="button"
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}

import Link from 'next/link'
import { resolveMenuHref } from '@/lib/menu'

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
          {phone ? <a href={`tel:${phoneHref || phone}`}>{phone}</a> : null}
          {phone && email ? ' ? ' : ''}
          {email ? <a href={`mailto:${email}`}>{email}</a> : null}
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
          {footer.copyrightText || `? ${year} ${siteName}. All rights reserved.`}
        </p>
      </div>
    </footer>
  )
}

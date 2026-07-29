import { CmsFooter } from '@/components/cms/CmsFooter'
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

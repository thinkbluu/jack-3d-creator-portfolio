/* eslint-disable @next/next/no-head-element, @next/next/no-before-interactive-script-outside-document -- this component is the <html> shell for both root layouts */
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import ConsentBanner from '@/components/ConsentBanner'
import GoogleTag from '@/components/GoogleTag'
import JsonLd from '@/components/JsonLd'
import ScrollProgress from '@/components/ScrollProgress'
import VercelInsights from '@/components/VercelInsights'
import { LocaleProvider } from '@/lib/i18n/context'
import { htmlLang, ogLocale, type Locale } from '@/lib/i18n/locale'
import { ui } from '@/lib/i18n/ui'
import { CONSENT_STORAGE_KEY } from '@/lib/consent'
import { fontClassName } from '@/lib/fonts'
import { businessNode, graph, websiteNode } from '@/lib/schema'
import { defaultOgImage } from '@/lib/seo'
import { LEGAL_NAME, SITE_NAME, SITE_URL } from '@/lib/site'

const gtagId = process.env.NEXT_PUBLIC_GTAG_ID ?? 'G-WT5MMP4M9D'
const consentGrantedUpdate = "{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'}"

export const localeViewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
}

export function localeMetadata(locale: Locale): Metadata {
  const copy = ui[locale].meta
  const image = defaultOgImage(locale)
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: copy.defaultTitle,
      template: `%s | ${SITE_NAME}`,
    },
    description: copy.defaultDescription,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: LEGAL_NAME,
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      alternateLocale: locale === 'en' ? 'ro_RO' : 'en_US',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      images: [{ url: image.url, alt: image.alt }],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
  }
}

export default function LocaleDocument({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return (
    <html lang={htmlLang(locale)} className={`${fontClassName} bg-[var(--shell)]`}>
      <head>
        {gtagId ? (
          <Script id="gtag-consent-default" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied',
                wait_for_update: 500,
              });
              try {
                if (localStorage.getItem('${CONSENT_STORAGE_KEY}') === 'granted') {
                  gtag('consent', 'update', ${consentGrantedUpdate});
                }
              } catch (e) {}
            `}
          </Script>
        ) : null}
        <link rel="alternate" type="application/rss+xml" title={ui[locale].meta.rss} href={`${SITE_URL}/feed.xml`} />
        <noscript>
          <style>{'[data-fade]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body className="bg-[var(--shell)] font-sans antialiased">
        <LocaleProvider locale={locale}>
          <ScrollProgress />
          {children}
          <ConsentBanner />
          <JsonLd data={graph(websiteNode(locale), businessNode(locale))} />
          {gtagId ? <GoogleTag id={gtagId} /> : null}
          <VercelInsights />
        </LocaleProvider>
      </body>
    </html>
  )
}

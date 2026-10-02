import type { Metadata, Viewport } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import Script from 'next/script'
import ConsentBanner from '@/components/ConsentBanner'
import GoogleTag from '@/components/GoogleTag'
import JsonLd from '@/components/JsonLd'
import ScrollProgress from '@/components/ScrollProgress'
import VercelInsights from '@/components/VercelInsights'
import { CONSENT_STORAGE_KEY } from '@/lib/consent'
import { businessNode, graph, websiteNode } from '@/lib/schema'
import { DEFAULT_OG_IMAGE } from '@/lib/seo'
import { LEGAL_NAME, SITE_LOCALE, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const gtagId = process.env.NEXT_PUBLIC_GTAG_ID ?? 'G-WT5MMP4M9D'

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-dm-sans',
})

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-fraunces',
})

// Defaults only. Every page sets its own title, description, canonical URL and
// social tags through `pageMetadata()` in lib/seo.ts, so nothing page-specific
// (like the canonical URL) is ever inherited from here.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Web design Timișoara · Creare site în 48h | MAST Studio',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Studio de web design din Timișoara: creare site de prezentare de la 300 EUR, live în 48 de ore, și magazine online de la 900 EUR. Avans 50 EUR, restul doar dacă ești mulțumit.',
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: LEGAL_NAME,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
}

const consentGrantedUpdate = "{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'}"

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${dmSans.variable} ${fraunces.variable} bg-[var(--shell)]`}>
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
        <link rel="alternate" type="application/rss+xml" title="MAST Studio – Ghid" href={`${SITE_URL}/feed.xml`} />
        {/* Without JavaScript the scroll reveals never run, so show their content as-is. */}
        <noscript>
          <style>{'[data-fade]{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body className="bg-[var(--shell)] font-sans antialiased">
        <ScrollProgress />
        {children}
        <ConsentBanner />
        <JsonLd data={graph(websiteNode(), businessNode())} />
        {/* Google Tag loads only after the visitor accepts the consent banner. */}
        {gtagId ? <GoogleTag id={gtagId} /> : null}
        <VercelInsights />
      </body>
    </html>
  )
}

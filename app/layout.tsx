import type { Metadata, Viewport } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ConsentBanner from '@/components/ConsentBanner'
import ScrollProgress from '@/components/ScrollProgress'
import './globals.css'

const gtagId = process.env.NEXT_PUBLIC_GTAG_ID ?? 'G-WT5MMP4M9D'

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
})

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-fraunces',
})

const title = 'MAST Studio | Site-uri care aduc clienți, în 48 de ore'
const description = 'Studio de web design din Timișoara. Site-uri de prezentare de la 300 EUR livrate în 48 de ore, magazine online de la 900 EUR și platforme personalizate. Avans 50 EUR, restul doar dacă ești mulțumit.'

export const metadata: Metadata = {
  metadataBase: new URL('https://maststudio.ro'),
  title: {
    default: title,
    template: '%s | MAST Studio',
  },
  description,
  applicationName: 'MAST Studio',
  keywords: ['web design Timișoara', 'site de prezentare', 'magazin online', 'aplicații web', 'platforme SaaS', 'automatizări AI'],
  authors: [{ name: 'MAST Studio', url: 'https://maststudio.ro' }],
  creator: 'MAST Studio',
  publisher: 'MAST Consult S.R.L.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: '/',
    siteName: 'MAST Studio',
    title,
    description,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'MAST Studio — site-ul potrivit începe cu întrebarea potrivită' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/twitter-image'],
  },
  icons: {
    icon: [{ url: '/icons/mast-mark-badge.svg', type: 'image/svg+xml' }],
    apple: '/icons/mast-mark-badge.svg',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  other: {
    'ai-content-declaration': 'human-authored',
  },
}

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
}

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
            `}
          </Script>
        ) : null}
        <link rel="preload" as="image" href="/images/harbor-final-mobile.webp" media="(max-width: 767px)" fetchPriority="high" />
        <link rel="alternate" type="application/rss+xml" title="MAST Studio Blog" href="https://maststudio.ro/feed.xml" />
      </head>
      <body className="bg-[var(--shell)] font-sans antialiased">
        <ScrollProgress />
        {children}
        <ConsentBanner />
        {gtagId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
            <Script id="gtag-config" strategy="afterInteractive">
              {`
                gtag('js', new Date());
                gtag('config', '${gtagId}');
              `}
            </Script>
          </>
        ) : null}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-dm-sans',
})

const title = 'MAST Studio | Web design Timișoara'
const description = 'Studio de web design. Site-uri de prezentare de la 300 EUR livrate în 48 de ore și magazine online de la 900 EUR. Platforme și aplicații premium pentru afaceri în creștere.'

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
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'MAST Studio — produse digitale construite cu direcție' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/twitter-image'],
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }, { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' }, { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' }],
    apple: '/apple-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
}

export const viewport: Viewport = {
  themeColor: '#050A14',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${dmSans.variable} bg-[var(--bg)]`}>
      <body className="bg-[var(--bg)] font-sans antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

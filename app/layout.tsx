import type { Metadata, Viewport } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import ScrollProgress from '@/components/ScrollProgress'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
})

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
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
}

export const viewport: Viewport = {
  themeColor: '#FAF7F2',
  colorScheme: 'light',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ro" className={`${dmSans.variable} ${fraunces.variable} bg-[var(--shell)]`}>
      <body className="bg-[var(--shell)] font-sans antialiased">
        <ScrollProgress />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

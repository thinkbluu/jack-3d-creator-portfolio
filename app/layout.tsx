import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-dm-sans',
})

export const metadata: Metadata = {
  title: 'MAST Studio | Web design Timisoara',
  description: 'Studio de web design. Site-uri de prezentare de la 300 EUR livrate în 48 de ore și magazine online de la 900 EUR. Platforme și aplicații premium pentru afaceri în creștere.',
}

export const viewport: Viewport = {
  themeColor: '#050A14',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro" className={`${dmSans.variable} bg-[var(--bg)]`}>
      <body className="bg-[var(--bg)] font-sans antialiased">
        {children}
      </body>
    </html>
  )
}

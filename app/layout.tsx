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
  description: 'Studio de web design din Timișoara pentru site-uri memorabile, rapide și orientate spre rezultate.',
}

export const viewport: Viewport = {
  themeColor: '#0C0C0C',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ro" className={`${dmSans.variable} bg-[#0C0C0C]`}>
      <body className="antialiased font-sans" style={{ margin: 0, padding: 0, boxSizing: 'border-box', background: '#0C0C0C' }}>
        {children}
      </body>
    </html>
  )
}

import type { Metadata, Viewport } from 'next'
import { Kanit } from 'next/font/google'
import './globals.css'

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-kanit',
})

export const metadata: Metadata = {
  title: 'Jack -- 3D Creator',
  description: 'Jack is a 3D creator driven by crafting striking and unforgettable projects.',
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
    <html lang="en" className={`${kanit.variable} bg-[#0C0C0C]`}>
      <body className="antialiased font-sans" style={{ margin: 0, padding: 0, boxSizing: 'border-box', background: '#0C0C0C' }}>
        {children}
      </body>
    </html>
  )
}

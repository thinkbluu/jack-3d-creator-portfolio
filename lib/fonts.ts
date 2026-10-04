import { DM_Sans, Fraunces } from 'next/font/google'

export const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-dm-sans',
})

export const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600'],
  display: 'swap',
  variable: '--font-fraunces',
})

export const fontClassName = `${dmSans.variable} ${fraunces.variable}`

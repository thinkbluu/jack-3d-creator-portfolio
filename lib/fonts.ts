import { DM_Mono, DM_Sans, Fraunces } from 'next/font/google'

export const dmSans = DM_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-dm-sans',
})

// Variable weight with italics: the display face carries the brand voice in
// both upright headlines and the italic accent words of the studio redesign.
export const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  style: ['normal', 'italic'],
  axes: ['opsz', 'SOFT'],
  display: 'swap',
  variable: '--font-fraunces',
})

// Small uppercase labels, counters and coordinates.
export const dmMono = DM_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-dm-mono',
})

export const fontClassName = `${dmSans.variable} ${fraunces.variable} ${dmMono.variable}`

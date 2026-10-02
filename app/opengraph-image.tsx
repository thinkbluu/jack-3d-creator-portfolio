import { OG_SIZE, renderOgImage } from '@/lib/og'
import { DEFAULT_OG_IMAGE } from '@/lib/seo'

export const alt = DEFAULT_OG_IMAGE.alt
export const size = OG_SIZE
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return renderOgImage({
    kicker: 'Timișoara · România',
    title: 'Site-ul tău, live în 48 de ore.',
    subtitle: 'Studio de web design · site de prezentare de la 300 EUR · magazine online de la 900 EUR · avans 50 EUR',
  })
}

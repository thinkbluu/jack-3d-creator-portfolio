import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MAST Studio',
    short_name: 'MAST',
    description: 'Studio de web design și produse digitale din Timișoara.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050A14',
    theme_color: '#050A14',
    lang: 'ro',
    icons: [
      { src: '/icons/mast-mark-badge.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}

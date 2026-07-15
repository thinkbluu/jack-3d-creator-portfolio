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
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}

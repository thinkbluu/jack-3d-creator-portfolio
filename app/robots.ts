import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://maststudio.ro/sitemap.xml',
    host: 'https://maststudio.ro',
  }
}

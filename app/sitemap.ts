import type { MetadataRoute } from 'next'

const routes = ['', '/confidentialitate', '/cookies', '/termeni']

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://maststudio.ro${route}`,
    lastModified: new Date(),
    changeFrequency: route ? 'yearly' : 'monthly',
    priority: route ? 0.4 : 1,
  }))
}

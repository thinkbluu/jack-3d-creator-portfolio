import type { MetadataRoute } from 'next'

const staticRoutes = ['', '/confidentialitate', '/cookies', '/termeni']

// Blog routes can be appended here from lib/blog.ts when articles are added,
// without changing the sitemap mapping below.
const blogRoutes: string[] = []
const routes = [...staticRoutes, ...blogRoutes]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://maststudio.ro${route}`,
    lastModified: new Date(),
    changeFrequency: route ? 'yearly' : 'monthly',
    priority: route ? 0.4 : 1,
  }))
}

import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

const staticRoutes = ['', '/blog', '/confidentialitate', '/cookies', '/termeni']
const blogRoutes = getAllPosts().map((post) => `/blog/${post.slug}`)
const routes = [...staticRoutes, ...blogRoutes]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://maststudio.ro${route}`,
    lastModified: new Date(),
    changeFrequency: route ? 'yearly' : 'monthly',
    priority: route ? 0.4 : 1,
  }))
}

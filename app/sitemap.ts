import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { getAllProjects } from '@/lib/projects'
import { getAllServicePages } from '@/lib/services'

const siteUrl = 'https://maststudio.ro'
const staticRoutes = ['', '/despre', '/blog', '/portofoliu', '/glosar', '/comparatie', '/confidentialitate', '/cookies', '/termeni']
const legalRoutes = new Set(['/confidentialitate', '/cookies', '/termeni'])

function priorityFor(route: string) {
  if (route === '') return 1
  if (route.startsWith('/servicii/')) return 0.8
  if (route === '/blog' || route === '/portofoliu' || route.startsWith('/blog/')) return 0.6
  if (route.startsWith('/portofoliu/') || route === '/despre' || route === '/glosar' || route === '/comparatie') return 0.5
  if (legalRoutes.has(route)) return 0.2
  return 0.5
}

function changeFrequencyFor(route: string): NonNullable<MetadataRoute.Sitemap[number]['changeFrequency']> {
  if (route === '' || route === '/blog' || route.startsWith('/blog/') || route.startsWith('/servicii/')) return 'monthly'
  return 'yearly'
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const lastModifiedByRoute = new Map(posts.map((post) => [`/blog/${post.slug}`, post.updatedAt ?? post.publishedAt]))
  const routes = [
    ...staticRoutes,
    ...posts.map((post) => `/blog/${post.slug}`),
    ...getAllProjects().map((project) => `/portofoliu/${project.slug}`),
    ...getAllServicePages().map((service) => `/servicii/${service.slug}`),
  ]

  return routes.map((route) => {
    const lastModified = lastModifiedByRoute.get(route)

    return {
      url: `${siteUrl}${route}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: changeFrequencyFor(route),
      priority: priorityFor(route),
    }
  })
}

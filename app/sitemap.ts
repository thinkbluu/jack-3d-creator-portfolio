import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { getAllProjects } from '@/lib/projects'
import { getAllServicePages } from '@/lib/services'

const staticRoutes = ['', '/despre', '/blog', '/portofoliu', '/glosar', '/confidentialitate', '/cookies', '/termeni']
const blogRoutes = getAllPosts().map((post) => `/blog/${post.slug}`)
const projectRoutes = getAllProjects().map((project) => `/portofoliu/${project.slug}`)
const serviceRoutes = getAllServicePages().map((service) => `/servicii/${service.slug}`)
const routes = [...staticRoutes, ...blogRoutes, ...projectRoutes, ...serviceRoutes]

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://maststudio.ro${route}`,
    lastModified: new Date(),
    changeFrequency: route ? 'yearly' : 'monthly',
    priority: route ? 0.4 : 1,
  }))
}

import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { getAllProjects } from '@/lib/projects'
import { getAllServicePages } from '@/lib/services'
import { absoluteUrl } from '@/lib/site'

type Entry = MetadataRoute.Sitemap[number]

// Date of the last meaningful content change for each static page. Update the
// date when you edit that page, so search engines can trust `lastmod`.
const staticPages: Array<{ path: string; lastModified: string; changeFrequency: Entry['changeFrequency']; priority: number }> = [
  { path: '/', lastModified: '2026-10-02', changeFrequency: 'monthly', priority: 1 },
  { path: '/servicii', lastModified: '2026-10-02', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/portofoliu', lastModified: '2026-10-02', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/despre', lastModified: '2026-10-02', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/contact', lastModified: '2026-10-02', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/cerere-oferta', lastModified: '2026-10-02', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/comparatie', lastModified: '2026-10-02', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/glosar', lastModified: '2026-10-02', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/confidentialitate', lastModified: '2026-10-02', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/cookies', lastModified: '2026-10-02', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/termeni', lastModified: '2026-07-14', changeFrequency: 'yearly', priority: 0.2 },
]

const PORTFOLIO_UPDATED = '2026-10-02'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts()
  const latestPost = posts.reduce((latest, post) => {
    const date = post.updatedAt ?? post.publishedAt
    return date > latest ? date : latest
  }, '2026-01-01')

  return [
    ...staticPages.map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: page.lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    {
      url: absoluteUrl('/blog'),
      lastModified: latestPost,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    ...getAllServicePages().map((service) => ({
      url: absoluteUrl(`/servicii/${service.slug}`),
      lastModified: service.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...posts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.updatedAt ?? post.publishedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // Design concepts are noindex, so they stay out of the sitemap.
    ...getAllProjects()
      .filter((project) => project.type === 'client')
      .map((project) => ({
        url: absoluteUrl(`/portofoliu/${project.slug}`),
        lastModified: PORTFOLIO_UPDATED,
        changeFrequency: 'yearly' as const,
        priority: 0.6,
      })),
  ]
}

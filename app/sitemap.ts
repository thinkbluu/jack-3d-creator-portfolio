import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'
import { getJobOpenings } from '@/lib/careers'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { getAllProjects } from '@/lib/projects'
import { getAllServicePages } from '@/lib/services'
import { absoluteUrl } from '@/lib/site'

type Entry = MetadataRoute.Sitemap[number]

// Date of the last meaningful content change for each static page. Update the
// date when you edit that page, so search engines can trust `lastmod`.
const staticPages: Array<{ path: string; lastModified: string; changeFrequency: Entry['changeFrequency']; priority: number }> = [
  { path: '/', lastModified: '2026-10-04', changeFrequency: 'monthly', priority: 1 },
  { path: '/servicii', lastModified: '2026-10-04', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/portofoliu', lastModified: '2026-10-04', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/despre', lastModified: '2026-10-04', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/contact', lastModified: '2026-10-04', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/cerere-oferta', lastModified: '2026-10-04', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/comparatie', lastModified: '2026-10-04', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/glosar', lastModified: '2026-10-04', changeFrequency: 'yearly', priority: 0.5 },
  { path: '/site-gratuit', lastModified: '2026-10-04', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/site-gratuit/regulament', lastModified: '2026-10-04', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cariere', lastModified: '2026-10-03', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/confidentialitate', lastModified: '2026-10-04', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/cookies', lastModified: '2026-10-04', changeFrequency: 'yearly', priority: 0.2 },
  { path: '/termeni', lastModified: '2026-07-14', changeFrequency: 'yearly', priority: 0.2 },
]

const PORTFOLIO_UPDATED = '2026-10-04'

function languagesFor(canonicalPath: string, locales: Locale[] = ['ro', 'en']) {
  const languages: Record<string, string> = {}
  for (const locale of locales) languages[locale] = absoluteUrl(localizePath(canonicalPath, locale))
  languages['x-default'] = languages.ro ?? languages.en
  return languages
}

function entry(
  canonicalPath: string,
  lastModified: string,
  changeFrequency: Entry['changeFrequency'],
  priority: number,
  locales?: Locale[],
): Entry {
  return {
    url: absoluteUrl(localizePath(canonicalPath, 'ro')),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages: languagesFor(canonicalPath, locales) },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts('ro')
  const englishPosts = getAllPosts('en')
  const latestPost = posts.reduce((latest, post) => {
    const date = post.updatedAt ?? post.publishedAt
    return date > latest ? date : latest
  }, '2026-01-01')

  const mirrorPages: Entry[] = [
    ...staticPages.map((page) => entry(page.path, page.lastModified, page.changeFrequency, page.priority)),
    // Romanian-only campaign landing page — no English alternate.
    entry('/mockup', '2026-10-09', 'weekly', 0.8, ['ro']),
    entry('/blog', latestPost, 'weekly', 0.7),
    ...getAllServicePages('ro').map((service) => entry(`/servicii/${service.slug}`, service.updatedAt, 'monthly', 0.9)),
    ...getJobOpenings('ro').map((job) => entry(`/cariere/${job.id}`, '2026-10-03', 'monthly', 0.5)),
    ...getAllProjects('ro')
      .filter((project) => project.type === 'client')
      .map((project) => entry(`/portofoliu/${project.slug}`, PORTFOLIO_UPDATED, 'yearly', 0.6)),
  ]

  // English URLs are listed as their own sitemap rows as well as hreflang alternates.
  // Romanian-only entries (no `en` alternate) are not mirrored.
  const englishMirrors: Entry[] = mirrorPages.flatMap((page) => {
    const enUrl = page.alternates?.languages?.en
    return enUrl ? [{ ...page, url: enUrl }] : []
  })

  return [
    ...mirrorPages,
    ...englishMirrors,
    ...posts.map((post) => entry(`/blog/${post.slug}`, post.updatedAt ?? post.publishedAt, 'monthly', 0.7, ['ro'])),
    ...englishPosts.map((post) => entry(`/blog/${post.slug}`, post.updatedAt ?? post.publishedAt, 'monthly', 0.7, ['en'])),
  ]
}

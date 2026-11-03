import Link from 'next/link'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import IdeasIndex, { type IdeaCard } from '@/components/studio/IdeasIndex'
import PageOpen from '@/components/studio/PageOpen'
import { formatBlogDate, getAllPosts } from '@/lib/blog'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { PAGE_WORDS } from '@/lib/page-words'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

export function researchMetadata(locale: Locale) {
  const copy = ui[locale].blog
  return pageMetadata({
    title: copy.researchMetaTitle,
    description: copy.researchMetaDescription,
    path: localizePath('/blog/cercetare', locale),
    locale,
  })
}

export function ResearchView({ locale }: { locale: Locale }) {
  const copy = ui[locale].blog
  const path = localizePath('/blog/cercetare', locale)
  const posts = getAllPosts(locale, { section: 'cercetare' })
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: copy.crumb, path: localizePath('/blog', locale) },
    { name: copy.researchCrumb, path },
  ]

  const jsonLd = graph(
    webPageNode({
      path,
      name: copy.researchTitle,
      description: copy.researchMetaDescription,
      type: 'CollectionPage',
      breadcrumb: true,
      locale,
    }),
    breadcrumbNode(crumbs),
    posts.length
      ? {
          '@type': 'ItemList',
          '@id': `${absoluteUrl(path)}#studii`,
          itemListElement: posts.map((post, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: absoluteUrl(localizePath(`/blog/${post.slug}`, locale)),
            name: post.title,
          })),
        }
      : null,
  )

  const ideas: IdeaCard[] = posts.map((post) => ({
    slug: post.slug,
    href: localizePath(`/blog/${post.slug}`, locale),
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    categoryLabel: post.categoryLabel,
    readMin: post.readMin,
    date: post.publishedAt,
    dateLabel: formatBlogDate(post.publishedAt, locale),
    cover: post.cover,
    coverAlt: post.coverAlt,
    badge: copy.researchBadge,
  }))

  return (
    <>
      <SiteHeader current="cercetare" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageOpen
          crumbs={crumbs}
          title={copy.researchTitle}
          word={PAGE_WORDS['/blog/cercetare'][locale]}
          lead={copy.researchLead}
          short
        >
          <p className="max-w-sm leading-relaxed text-[var(--fg-2)]">{copy.researchIntro}</p>
        </PageOpen>
        <section aria-label={copy.researchCrumb} className="tone-cream page-section">
          <div className="studio-container">
            {ideas.length > 0 ? (
              <IdeasIndex posts={ideas} allLabel={copy.all} readLabel={copy.readMin} filtersLabel={copy.filters} />
            ) : (
              <div className="research-empty">
                <p className="mono-label text-[var(--brass-ink)]">{copy.researchEmptyKicker}</p>
                <p className="research-empty-title display-xl">{copy.researchEmptyTitle}</p>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--ink-2)]">{copy.researchEmpty}</p>
                <ul className="research-includes">
                  {copy.researchIncludes.map((item) => (
                    <li key={item.title}>
                      <span className="mono-label text-[var(--brass-ink)]">{item.title}</span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
                <Link href={localizePath('/blog', locale)} className="big-row">
                  <span className="mono-label text-[var(--fg-3)]">{copy.crumb}</span>
                  <span className="big-row-name">{copy.researchBack}</span>
                  <span aria-hidden="true" className="big-row-arrow">
                    →
                  </span>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

import Link from 'next/link'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import IdeasIndex, { type IdeaCard } from '@/components/studio/IdeasIndex'
import PageOpen from '@/components/studio/PageOpen'
import TrackedLink from '@/components/TrackedLink'
import { formatBlogDate, getAllPosts } from '@/lib/blog'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl, whatsappUrl } from '@/lib/site'

export function blogMetadata(locale: Locale) {
  const copy = ui[locale].blog
  return pageMetadata({
    title: locale === 'en' ? copy.metaTitleEn : copy.metaTitle,
    description: locale === 'en' ? copy.metaDescriptionEn : copy.metaDescription,
    path: localizePath('/blog', locale),
    locale,
  })
}

export function BlogView({ locale }: { locale: Locale }) {
  const copy = ui[locale].blog
  const path = localizePath('/blog', locale)
  const posts = getAllPosts(locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: copy.crumb, path },
  ]

  const jsonLd = graph(
    webPageNode({
      path,
      name: copy.indexTitle,
      description: locale === 'en' ? copy.metaDescriptionEn : copy.metaDescription,
      type: 'CollectionPage',
      breadcrumb: true,
      locale,
    }),
    breadcrumbNode(crumbs),
    {
      '@type': 'ItemList',
      '@id': `${absoluteUrl(path)}#articole`,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: absoluteUrl(localizePath(`/blog/${post.slug}`, locale)),
        name: post.title,
      })),
    },
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
  }))

  return (
    <>
      <SiteHeader current="blog" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageOpen crumbs={crumbs} index="05" title={copy.indexTitle} word={copy.word} lead={copy.lead} short>
          <p className="max-w-sm leading-relaxed text-[var(--fg-2)]">
            {copy.indexIntro}{' '}
            <Link href={localizePath('/servicii', locale)} className="inline min-h-0 text-[var(--fg)] underline underline-offset-4">
              {copy.servicesLink}
            </Link>
            .
          </p>
        </PageOpen>
        <section aria-label={copy.articles} className="tone-cream page-section">
          <div className="studio-container">
            {ideas.length > 0 ? (
              <IdeasIndex posts={ideas} allLabel={copy.all} readLabel={copy.readMin} filtersLabel={copy.filters} />
            ) : locale === 'en' ? (
              <div className="border-t border-[var(--hairline)] pt-6">
                <p className="text-lg text-[var(--ink-2)]">{copy.emptyEn}</p>
                <Link href="/blog" className="big-row mt-8">
                  <span className="mono-label text-[var(--fg-3)]">RO</span>
                  <span className="big-row-name">{copy.readRomanian.replace(' →', '')}</span>
                  <span aria-hidden="true" className="big-row-arrow">→</span>
                </Link>
              </div>
            ) : (
              <p className="border-t border-[var(--hairline)] pt-6 text-lg text-[var(--ink-2)]">{copy.empty}</p>
            )}

            <div className="mt-24 grid gap-6 border-t border-[var(--hairline)] pt-10 md:grid-cols-2 md:items-end">
              <p className="display-xl text-[clamp(2rem,3.6vw,3.4rem)] leading-[1]">{copy.question}</p>
              <TrackedLink
                href={whatsappUrl(locale === 'en' ? copy.askMessageEn : copy.askMessage)}
                target="_blank"
                rel="noopener noreferrer"
                eventProperties={{ placement: 'blog_index' }}
                className="mono-label justify-self-start text-[var(--brass-ink)] underline-offset-4 hover:underline md:justify-self-end"
              >
                {copy.ask}
              </TrackedLink>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

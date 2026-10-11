import Link from 'next/link'
import BlogCard from '@/components/BlogCard'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import PageHero from '@/components/studio/PageHero'
import TrackedLink from '@/components/TrackedLink'
import { getAllPosts } from '@/lib/blog'
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

  return (
    <>
      <SiteHeader current="blog" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageHero
          crumbs={crumbs}
          kicker={copy.indexKicker}
          title={copy.indexTitle}
          intro={
            <>
              {copy.indexIntro}{' '}
              <Link href={localizePath('/servicii', locale)} className="inline min-h-0 text-[var(--fg)] underline underline-offset-4">
                {copy.servicesLink}
              </Link>
              .
            </>
          }
        />
        <div className="site-container py-20 md:py-28">
          <section aria-label={copy.articles}>
            {posts.length > 0 ? (
              <div className="grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} locale={locale} />
                ))}
              </div>
            ) : locale === 'en' ? (
              <div className="border-t border-[var(--hairline)] pt-6">
                <p className="font-sans text-sm text-[var(--ink-2)]">{copy.emptyEn}</p>
                <Link href="/blog" className="mt-3 inline-block font-semibold text-[var(--brass-ink)] underline-offset-4 hover:underline">
                  {copy.readRomanian}
                </Link>
              </div>
            ) : (
              <p className="border-t border-[var(--hairline)] pt-6 font-sans text-sm text-[var(--ink-2)]">{copy.empty}</p>
            )}
          </section>

          <section className="mt-20 border-t border-[var(--hairline)] pt-8">
            <p className="type-body text-[var(--ink-2)]">{copy.question}</p>
            <TrackedLink
              href={whatsappUrl(locale === 'en' ? copy.askMessageEn : copy.askMessage)}
              target="_blank"
              rel="noopener noreferrer"
              eventProperties={{ placement: 'blog_index' }}
              className="mt-3 font-semibold text-[var(--brass-ink)] underline-offset-4 hover:underline"
            >
              {copy.ask}
            </TrackedLink>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

export const metadata = blogMetadata('ro')

export default function Page() {
  return <BlogView locale="ro" />
}

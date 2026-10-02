import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BlogCard from '@/components/BlogCard'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import MdxContent from '@/components/MdxContent'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
import { formatBlogDate, getAllPosts, getPostBySlug, getRelatedPosts, type BlogPost } from '@/lib/blog'
import { breadcrumbNode, faqNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata, stripBrandSuffix } from '@/lib/seo'
import { LOGO_URL, SITE_LANGUAGE, SITE_NAME, WEBSITE_ID, absoluteUrl } from '@/lib/site'

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

function ogImage(post: BlogPost) {
  return { url: `/blog/${post.slug}/og.png`, alt: post.title, width: 1200, height: 630 }
}

/** Dates are stored as YYYY-MM-DD; schema.org prefers a full timestamp. */
function isoDate(date: string) {
  return `${date}T08:00:00+00:00`
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return pageMetadata({
    title: stripBrandSuffix(post.seoTitle ?? post.title),
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    socialTitle: post.title,
    image: ogImage(post),
    type: 'article',
    publishedTime: isoDate(post.publishedAt),
    modifiedTime: isoDate(post.updatedAt ?? post.publishedAt),
  })
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const path = `/blog/${post.slug}`
  const url = absoluteUrl(path)
  const related = getRelatedPosts(post, 3)
  const dateModified = post.updatedAt ?? post.publishedAt
  const crumbs: BreadcrumbItem[] = [
    { name: 'Acasă', path: '/' },
    { name: 'Ghid', path: '/blog' },
    { name: post.title, path },
  ]

  const jsonLd = graph(
    webPageNode({ path, name: post.title, description: post.seoDescription ?? post.excerpt, breadcrumb: true }),
    breadcrumbNode(crumbs),
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.excerpt,
      image: [absoluteUrl(ogImage(post).url)],
      datePublished: isoDate(post.publishedAt),
      dateModified: isoDate(dateModified),
      inLanguage: SITE_LANGUAGE,
      articleSection: post.categoryLabel,
      wordCount: post.body.split(/\s+/).filter(Boolean).length,
      timeRequired: `PT${post.readMin}M`,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      isPartOf: { '@id': WEBSITE_ID },
      author: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/despre') },
      publisher: {
        '@type': 'Organization',
        name: SITE_NAME,
        url: absoluteUrl('/'),
        logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 },
      },
    },
    post.howToSteps?.length
      ? {
          '@type': 'HowTo',
          '@id': `${url}#howto`,
          name: post.title,
          step: post.howToSteps.map((step, index) => ({
            '@type': 'HowToStep',
            position: index + 1,
            name: step.name,
            text: step.text,
          })),
        }
      : null,
    post.faqItems?.length ? faqNode(post.faqItems, path) : null,
  )

  return (
    <>
      <SiteHeader current="blog" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <article className="site-container py-12 md:py-20">
          <header className="mx-auto max-w-2xl">
            <Breadcrumbs items={crumbs} />
            <span className="kicker mt-6 inline-block rounded-full border border-[var(--glass-edge)] px-3 py-1 text-[10px]">{post.categoryLabel}</span>
            <h1 className="type-h2 mt-6 text-balance">{post.title}</h1>
            <p className="type-body mt-6 text-[var(--ink-2)]">{post.excerpt}</p>
            <div className="mt-6 flex flex-col gap-1 font-sans text-xs text-[var(--ink-2)] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
              <span>
                de{' '}
                <Link href="/despre" rel="author" className="underline-offset-4 hover:text-[var(--ink)] hover:underline">
                  echipa MAST Studio
                </Link>
              </span>
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>
                Publicat <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
              </span>
              {post.updatedAt && post.updatedAt !== post.publishedAt ? (
                <>
                  <span aria-hidden="true" className="hidden sm:inline">·</span>
                  <span>
                    Actualizat <time dateTime={post.updatedAt}>{formatBlogDate(post.updatedAt)}</time>
                  </span>
                </>
              ) : null}
              <span aria-hidden="true" className="hidden sm:inline">·</span>
              <span>{post.readMin} min citire</span>
            </div>
            <div className="mt-8 border-t border-[var(--hairline)]" />
          </header>

          <div className="mx-auto mt-10 max-w-2xl">
            <p className="kicker">Pe scurt</p>
            <div
              className="type-body mt-3 text-[17px] font-medium text-[var(--ink)]"
              style={{
                background: 'var(--shell-warm)',
                borderLeft: '3px solid var(--brass)',
                borderRadius: 'var(--radius-card)',
                padding: '20px 24px',
                marginBottom: '32px',
              }}
            >
              {post.answerCapsule}
            </div>
          </div>

          <div className="prose mx-auto mt-12 max-w-2xl">
            <MdxContent source={post.body} />
          </div>

          {post.faqItems?.length ? (
            <section className="mx-auto mt-16 max-w-2xl">
              <h2 className="type-h3">Întrebări frecvente</h2>
              <div className="mt-6 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
                {post.faqItems.map((item) => (
                  <details key={item.question} className="faq-item group py-5">
                    <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 font-sans font-semibold [&::-webkit-details-marker]:hidden">
                      <span>{item.question}</span>
                      <span className="faq-icon flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink)]" aria-hidden="true">
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M5.5 0V11M0 5.5H11" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-3 font-sans text-[15px] leading-relaxed text-[var(--ink-2)]">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ) : null}

          <section className="porthole mx-auto mt-16 flex max-w-2xl flex-col items-start gap-5 border-[var(--glass-edge)] p-7">
            <h2 className="type-h3">Vrei să aplicăm asta pentru afacerea ta?</h2>
            <SegmentProvider>
              <ContactButton hero label="Cere ofertă pe WhatsApp" />
            </SegmentProvider>
            <p className="font-sans text-sm text-[var(--ink-2)]">
              Vezi și{' '}
              <Link href="/servicii" className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                serviciile și prețurile MAST Studio
              </Link>{' '}
              sau participă la{' '}
              <Link href="/site-gratuit" className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                concursul lunar pentru un site gratuit
              </Link>
              .
            </p>
          </section>

          {related.length > 0 ? (
            <section className="mx-auto mt-20 max-w-5xl">
              <h2 className="type-h3">Citește și</h2>
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                {related.map((item) => (
                  <BlogCard key={item.slug} post={item} headingLevel="h3" />
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

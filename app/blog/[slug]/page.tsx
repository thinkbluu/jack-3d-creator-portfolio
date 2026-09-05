import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import BlogCard from '@/components/BlogCard'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import { SegmentProvider } from '@/components/SegmentContext'
import { formatBlogDate, getAllPosts, getPostBySlug } from '@/lib/blog'

const siteUrl = 'https://maststudio.ro'

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  const canonical = `${siteUrl}/blog/${post.slug}`
  return {
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
    },
  }
}

export default async function BlogArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getAllPosts().filter((item) => item.slug !== post.slug).slice(0, 2)
  const dateModified = post.updatedAt ?? post.publishedAt
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified,
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
    author: { '@type': 'Organization', name: 'MAST Studio', url: siteUrl },
    publisher: { '@type': 'Organization', name: 'MAST Studio', url: siteUrl },
  }
  const howToJsonLd = post.howToSteps?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        name: post.title,
        step: post.howToSteps.map((step) => ({
          '@type': 'HowToStep',
          name: step.name,
          text: step.text,
        })),
      }
    : null

  return (
    <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <header className="border-b border-[var(--hairline)]">
        <nav className="site-container flex h-20 items-center justify-between">
          <Link href="/blog" className="font-sans text-sm text-[var(--ink-2)] hover:text-[var(--ink)]">← Înapoi la ghid</Link>
          <Link href="/" className="font-serif text-xl font-semibold">MAST</Link>
        </nav>
      </header>

      <article className="site-container py-16 md:py-24">
        <header className="mx-auto max-w-2xl">
          <span className="kicker rounded-full border border-[var(--glass-edge)] px-3 py-1 text-[10px]">{post.categoryLabel}</span>
          <h1 className="type-h2 mt-6 text-balance">{post.title}</h1>
          <p className="type-body mt-6 text-[var(--ink-2)]">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 font-sans text-xs text-[var(--ink-3)]">
            <Link href="/despre" className="hover:text-[var(--ink)]">de MAST Studio</Link>
            <span>·</span>
            <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
            <span>·</span>
            <span>{post.readMin} min citire</span>
          </div>
          {post.updatedAt && post.updatedAt !== post.publishedAt ? (
            <p className="mt-2 font-sans text-[13px] text-[var(--ink-3)]">
              Actualizat: {formatBlogDate(post.updatedAt)}
            </p>
          ) : null}
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
          <MDXRemote source={post.body} />
        </div>

        {post.faqItems?.length ? (
          <section className="mx-auto mt-16 max-w-2xl">
            <h2 className="type-h3">Întrebări pe acest subiect</h2>
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
                  <p className="mt-3 font-sans text-sm leading-relaxed text-[var(--ink-2)]">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}

        <section className="porthole mx-auto mt-16 flex max-w-2xl flex-col items-start gap-5 border-[var(--glass-edge)] p-7">
          <p className="type-h3">Vrei să aplicăm asta pentru afacerea ta?</p>
          <SegmentProvider>
            <ContactButton hero label="Cere ofertă pe WhatsApp" />
          </SegmentProvider>
        </section>

        {related.length > 0 ? (
          <section className="mx-auto mt-20 max-w-5xl">
            <h2 className="type-h3">Citește și</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">{related.map((item) => <BlogCard key={item.slug} post={item} />)}</div>
          </section>
        ) : null}
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      {howToJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} /> : null}
      {post.faqItems?.length ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: post.faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }) }} /> : null}
      <Footer />
    </main>
  )
}

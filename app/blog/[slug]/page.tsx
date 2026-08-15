import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
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

  return (
    <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <header className="border-b border-[var(--hairline)]">
        <nav className="site-container flex h-20 items-center justify-between">
          <Link href="/blog" className="font-sans text-sm text-[var(--ink-2)] hover:text-[var(--ink)]">← Înapoi la ghid</Link>
          <Link href="/" className="font-serif text-xl font-semibold">MAST</Link>
        </nav>
      </header>

      <article className="site-container py-16 md:py-24">
        <header className="mx-auto max-w-4xl">
          <span className="kicker rounded-full border border-[var(--glass-edge)] px-3 py-1 text-[10px]">{post.categoryLabel}</span>
          <h1 className="type-h2 mt-6 max-w-[20ch] text-balance">{post.title}</h1>
          <p className="type-body mt-6 max-w-2xl text-[var(--ink-2)]">{post.excerpt}</p>
          <div className="mt-6 flex gap-4 font-sans text-xs text-[var(--ink-3)]">
            <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
            <span>·</span>
            <span>{post.readMin} min citire</span>
          </div>
          <div className="mt-8 border-t border-[var(--hairline)]" />
        </header>

        <div className="prose mx-auto mt-12 max-w-2xl" dangerouslySetInnerHTML={{ __html: post.body }} />

        {post.faqItems?.length ? (
          <section className="mx-auto mt-16 max-w-2xl">
            <h2 className="type-h3">Întrebări pe acest subiect</h2>
            <div className="mt-6 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              {post.faqItems.map((item) => (
                <details key={item.question} className="py-5">
                  <summary className="cursor-pointer font-sans font-semibold">{item.question}</summary>
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
      {post.faqItems?.length ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: post.faqItems.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }) }} /> : null}
      <Footer />
    </main>
  )
}

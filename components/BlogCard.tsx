import Link from 'next/link'
import { formatBlogDate, type BlogPost } from '@/lib/blog'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'

type BlogCardProps = {
  post: BlogPost
  locale?: Locale
  /** Use h3 when the card sits under a section h2. */
  headingLevel?: 'h2' | 'h3'
}

export default function BlogCard({ post, locale = 'ro', headingLevel = 'h2' }: BlogCardProps) {
  const Heading = headingLevel
  return (
    <Link
      href={localizePath(`/blog/${post.slug}`, locale)}
      className="group flex min-h-[260px] flex-col items-stretch justify-start gap-5 border-t border-[var(--ink)] pt-6 pb-8 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
    >
      <span className="mono-label flex items-center justify-between gap-3 text-[var(--ink-3)]">
        <span className="text-[var(--brass-ink)]">{post.categoryLabel}</span>
        <span>
          {post.readMin} {ui[locale].blog.readMin}
        </span>
      </span>
      <Heading className="type-h3 text-pretty transition-colors duration-300 group-hover:text-[var(--brass-ink)]">{post.title}</Heading>
      <span className="line-clamp-3 text-[15px] leading-relaxed text-[var(--ink-2)]">{post.excerpt}</span>
      <time dateTime={post.publishedAt} className="mono-label mt-auto text-[var(--ink-3)]">
        {formatBlogDate(post.publishedAt, locale)}
      </time>
    </Link>
  )
}

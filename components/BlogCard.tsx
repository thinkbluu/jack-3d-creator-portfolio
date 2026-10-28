import Image from 'next/image'
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
      {post.cover ? (
        <span className="relative block aspect-[16/10] overflow-hidden rounded-[14px] bg-[var(--shell-warm)]">
          <Image
            src={post.cover}
            alt={post.coverAlt ?? ''}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
            className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04]"
          />
        </span>
      ) : null}
      <span className="mono-label flex items-center justify-between gap-3 text-[var(--ink-3)]">
        <span className="flex items-center gap-2 text-[var(--brass-ink)]">
          {post.section === 'cercetare' ? <span className="section-badge">{ui[locale].blog.researchBadge}</span> : null}
          {post.categoryLabel}
        </span>
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

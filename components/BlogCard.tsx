import Link from 'next/link'
import { formatBlogDate, type BlogPost } from '@/lib/blog'

type BlogCardProps = {
  post: BlogPost
  /** Use h3 when the card sits under a section h2. */
  headingLevel?: 'h2' | 'h3'
}

export default function BlogCard({ post, headingLevel = 'h2' }: BlogCardProps) {
  const Heading = headingLevel
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="porthole group flex min-h-[260px] flex-col gap-5 p-6 transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-[var(--brass)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="kicker rounded-full border border-[var(--glass-edge)] px-3 py-1 text-[10px] text-[var(--ink-2)]">
          {post.categoryLabel}
        </span>
        <span className="font-sans text-xs text-[var(--ink-2)]">{post.readMin} min citire</span>
      </span>
      <Heading className="type-h3 text-pretty">{post.title}</Heading>
      <span className="type-body line-clamp-3 text-[14px] text-[var(--ink-2)]">{post.excerpt}</span>
      <time dateTime={post.publishedAt} className="mt-auto font-sans text-xs text-[var(--ink-2)]">
        {formatBlogDate(post.publishedAt)}
      </time>
    </Link>
  )
}

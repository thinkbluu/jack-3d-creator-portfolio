import Link from 'next/link'
import { formatBlogDate, type BlogPost } from '@/lib/blog'

type BlogCardProps = {
  post: BlogPost
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="porthole group flex min-h-[260px] flex-col gap-5 p-6 transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-[var(--brass)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="kicker rounded-full border border-[var(--glass-edge)] px-3 py-1 text-[10px] text-[var(--ink-2)]">
          {post.categoryLabel}
        </span>
        <span className="font-sans text-xs text-[var(--ink-3)]">{post.readMin} min citire</span>
      </div>
      <h2 className="type-h3 text-pretty">{post.title}</h2>
      <p className="type-body line-clamp-3 text-[14px] text-[var(--ink-2)]">{post.excerpt}</p>
      <time dateTime={post.publishedAt} className="mt-auto font-sans text-xs text-[var(--ink-3)]">
        {formatBlogDate(post.publishedAt)}
      </time>
    </Link>
  )
}

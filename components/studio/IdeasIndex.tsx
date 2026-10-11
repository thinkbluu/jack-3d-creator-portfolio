'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'

export type IdeaCard = {
  slug: string
  href: string
  title: string
  excerpt: string
  category: string
  categoryLabel: string
  readMin: number
  date: string
  dateLabel: string
  cover?: string
  coverAlt?: string
}

/** Cover image, or a quiet navy plate with the compass when a post has none yet. */
function Cover({ post, sizes, priority }: { post: IdeaCard; sizes: string; priority?: boolean }) {
  return (
    <span className="idea-cover">
      {post.cover ? (
        <Image src={post.cover} alt={post.coverAlt ?? ''} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        <span className="idea-cover-blank" aria-hidden="true">
          <span className="idea-cover-mark" />
          <span className="mono-label">{post.categoryLabel}</span>
        </span>
      )}
    </span>
  )
}

/**
 * The ideas index: the newest piece large on top, then the rest in a grid,
 * with category filters. Everything is in the server HTML; filters only hide.
 */
export default function IdeasIndex({
  posts,
  allLabel,
  readLabel,
  filtersLabel,
}: {
  posts: IdeaCard[]
  allLabel: string
  readLabel: string
  filtersLabel: string
}) {
  const [active, setActive] = useState('all')
  const categories = useMemo(() => {
    const seen = new Map<string, string>()
    posts.forEach((post) => seen.set(post.category, post.categoryLabel))
    return Array.from(seen, ([id, label]) => ({ id, label }))
  }, [posts])
  const [featured, ...rest] = posts
  const shown = active === 'all' ? rest : posts.filter((post) => post.category === active)

  if (!featured) return null

  return (
    <div>
      {active === 'all' ? (
        <Link href={featured.href} className="idea-featured link-block">
          <Cover post={featured} sizes="(min-width: 768px) 58vw, 100vw" priority />
          <span className="idea-featured-text">
            <span className="mono-label idea-meta">
              <span className="text-[var(--accent)]">{featured.categoryLabel}</span>
              <span>
                {featured.readMin} {readLabel}
              </span>
            </span>
            <h2 className="idea-featured-title display-xl">{featured.title}</h2>
            <span className="idea-excerpt">{featured.excerpt}</span>
            <time dateTime={featured.date} className="mono-label text-[var(--fg-3)]">
              {featured.dateLabel}
            </time>
          </span>
        </Link>
      ) : null}

      <div className="work-filters mt-[clamp(3rem,6vw,5rem)]" role="group" aria-label={filtersLabel}>
        {[{ id: 'all', label: allLabel }, ...categories].map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={active === category.id}
            onClick={() => setActive(category.id)}
            className="work-filter mono-label"
          >
            {category.label}
            <sup>{category.id === 'all' ? posts.length : posts.filter((post) => post.category === category.id).length}</sup>
          </button>
        ))}
      </div>

      <ul className="idea-grid">
        {shown.map((post) => (
          <li key={post.slug}>
            <Link href={post.href} className="idea-card link-block">
              <Cover post={post} sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw" />
              <span className="mono-label idea-meta">
                <span className="text-[var(--accent)]">{post.categoryLabel}</span>
                <span>
                  {post.readMin} {readLabel}
                </span>
              </span>
              <h2 className="idea-card-title display-xl">{post.title}</h2>
              <span className="idea-excerpt line-clamp-3">{post.excerpt}</span>
              <time dateTime={post.date} className="mono-label mt-auto text-[var(--fg-3)]">
                {post.dateLabel}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

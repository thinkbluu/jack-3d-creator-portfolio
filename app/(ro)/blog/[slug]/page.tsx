import type { Metadata } from 'next'
import { researchMetadata, ResearchView } from '@/app/(ro)/blog/cercetare/view'
import { getAllPosts } from '@/lib/blog'
import { articleMetadata, ArticleView } from './view'

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

/**
 * The listing lives on this route, not in `blog/cercetare/page.tsx`.
 * The client matches `/blog/[slug]` first, and with `dynamicParams: false`
 * an unknown segment becomes the root 404 during soft navigation. That 404
 * renders its own `<html>`, which crashes the current page. `cercetare` is
 * therefore a known param and renders the listing.
 */
export const RESEARCH_LISTING_SLUG = 'cercetare'

export const dynamicParams = false

export function generateStaticParams() {
  const posts = getAllPosts('ro', { includeDrafts: process.env.NODE_ENV !== 'production' }).map((post) => ({ slug: post.slug }))
  return [...posts, { slug: RESEARCH_LISTING_SLUG }]
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  if (slug === RESEARCH_LISTING_SLUG) return researchMetadata('ro')
  return articleMetadata('ro', slug)
}

export default async function Page({ params }: ArticlePageProps) {
  const { slug } = await params
  if (slug === RESEARCH_LISTING_SLUG) return <ResearchView locale="ro" />
  return <ArticleView locale="ro" slug={slug} />
}

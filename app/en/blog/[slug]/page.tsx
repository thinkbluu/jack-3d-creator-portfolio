import type { Metadata } from 'next'
import { articleMetadata, ArticleView } from '@/app/(ro)/blog/[slug]/view'
import { researchMetadata, ResearchView } from '@/app/(ro)/blog/cercetare/view'
import { getAllPosts } from '@/lib/blog'

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

/** Same reason as the Romanian article route: `research` must be a known param so soft navigation does not hit the root 404. */
export const RESEARCH_LISTING_SLUG = 'research'

export const dynamicParams = false

export function generateStaticParams() {
  const posts = getAllPosts('en', { includeDrafts: process.env.NODE_ENV !== 'production' }).map((post) => ({ slug: post.slug }))
  return [...posts, { slug: RESEARCH_LISTING_SLUG }]
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  if (slug === RESEARCH_LISTING_SLUG) return researchMetadata('en')
  return articleMetadata('en', slug)
}

export default async function Page({ params }: ArticlePageProps) {
  const { slug } = await params
  if (slug === RESEARCH_LISTING_SLUG) return <ResearchView locale="en" />
  return <ArticleView locale="en" slug={slug} />
}

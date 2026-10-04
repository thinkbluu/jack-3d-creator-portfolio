import type { Metadata } from 'next'
import { articleMetadata, ArticleView } from '@/app/(ro)/blog/[slug]/page'
import { getAllPosts } from '@/lib/blog'

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts('en').map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  return articleMetadata('en', slug)
}

export default async function Page({ params }: ArticlePageProps) {
  const { slug } = await params
  return <ArticleView locale="en" slug={slug} />
}

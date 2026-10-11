import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'
import { articleMetadata, ArticleView } from './view'

type ArticlePageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts('ro').map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  return articleMetadata('ro', slug)
}

export default async function Page({ params }: ArticlePageProps) {
  const { slug } = await params
  return <ArticleView locale="ro" slug={slug} />
}

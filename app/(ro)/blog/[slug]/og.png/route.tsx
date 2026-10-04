import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { renderOgImage } from '@/lib/og'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts('ro').map((post) => ({ slug: post.slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug, 'ro')
  if (!post) return new Response('Not found', { status: 404 })
  return renderOgImage({
    kicker: `Ghid · ${post.readMin} min`,
    title: post.title,
    subtitle: post.excerpt.length > 150 ? `${post.excerpt.slice(0, 147).replace(/\s+\S*$/, '')}…` : post.excerpt,
  })
}

import { renderOgImage } from '@/lib/og'
import { getAllProjects, getProjectBySlug } from '@/lib/projects'

export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return getAllProjects('ro').map((project) => ({ slug: project.slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug, 'ro')
  if (!project) return new Response('Not found', { status: 404 })
  return renderOgImage({
    kicker: `Portofoliu · ${project.year}`,
    title: project.name,
    subtitle: `${project.categoryLabel} · ${project.summary}`,
  })
}

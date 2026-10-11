import type { Metadata } from 'next'
import { getAllProjects } from '@/lib/projects'
import { projectMetadata, ProjectView } from './view'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllProjects('ro').map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  return projectMetadata('ro', slug)
}

export default async function Page({ params }: ProjectPageProps) {
  const { slug } = await params
  return <ProjectView locale="ro" slug={slug} />
}

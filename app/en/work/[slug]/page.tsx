import type { Metadata } from 'next'
import { projectMetadata, ProjectView } from '@/app/(ro)/portofoliu/[slug]/page'
import { getAllProjects } from '@/lib/projects'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllProjects('en').map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  return projectMetadata('en', slug)
}

export default async function Page({ params }: ProjectPageProps) {
  const { slug } = await params
  return <ProjectView locale="en" slug={slug} />
}

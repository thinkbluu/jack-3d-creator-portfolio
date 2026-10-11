import { JOB_OPENINGS } from '@/lib/careers'
import { jobMetadata, JobView } from './view'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return JOB_OPENINGS.map((job) => ({ slug: job.id }))
}

export async function generateMetadata({ params }: Props) {
  return jobMetadata('ro', (await params).slug)
}

export default async function JobPage({ params }: Props) {
  return <JobView locale="ro" slug={(await params).slug} />
}

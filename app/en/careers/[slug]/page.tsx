import { jobMetadata, JobView } from '@/app/(ro)/cariere/[slug]/page'
import { JOB_OPENINGS } from '@/lib/careers'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return JOB_OPENINGS.map((job) => ({ slug: job.id }))
}

export async function generateMetadata({ params }: Props) {
  return jobMetadata('en', (await params).slug)
}

export default async function Page({ params }: Props) {
  return <JobView locale="en" slug={(await params).slug} />
}

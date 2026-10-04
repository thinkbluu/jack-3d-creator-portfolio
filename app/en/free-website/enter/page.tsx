import { ParticipationView, participationMetadata } from '@/app/(ro)/site-gratuit/participare/page'

export const dynamic = 'force-dynamic'
export const metadata = participationMetadata('en')

export default function Page({ searchParams }: { searchParams: Promise<{ t?: string; stare?: string }> }) {
  return <ParticipationView locale="en" searchParams={searchParams} />
}

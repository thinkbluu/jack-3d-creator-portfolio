import { ClaimView, claimMetadata } from '@/app/(ro)/site-gratuit/castig/page'

export const dynamic = 'force-dynamic'
export const metadata = claimMetadata('en')

export default function Page({ searchParams }: { searchParams: Promise<{ t?: string; stare?: string }> }) {
  return <ClaimView locale="en" searchParams={searchParams} />
}

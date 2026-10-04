import { ConfirmView, confirmMetadata } from '@/app/(ro)/site-gratuit/confirmare/page'

export const dynamic = 'force-dynamic'
export const metadata = confirmMetadata('en')

export default function Page({ searchParams }: { searchParams: Promise<{ t?: string; eroare?: string }> }) {
  return <ConfirmView locale="en" searchParams={searchParams} />
}

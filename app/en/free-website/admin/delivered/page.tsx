import { AdminDeliveredView, adminDeliveredMetadata } from '@/app/(ro)/site-gratuit/admin/livrat/page'

export const dynamic = 'force-dynamic'
export const metadata = adminDeliveredMetadata('en')

export default function Page({ searchParams }: { searchParams: Promise<{ t?: string; stare?: string }> }) {
  return <AdminDeliveredView locale="en" searchParams={searchParams} />
}
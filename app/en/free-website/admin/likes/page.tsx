import { AdminLikesView, adminLikesMetadata } from '@/app/(ro)/site-gratuit/admin/like-uri/page'

export const dynamic = 'force-dynamic'
export const metadata = adminLikesMetadata('en')

export default function Page({ searchParams }: { searchParams: Promise<{ t?: string; stare?: string }> }) {
  return <AdminLikesView locale="en" searchParams={searchParams} />
}

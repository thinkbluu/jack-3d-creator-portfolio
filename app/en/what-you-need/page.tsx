import { guideMetadata, GuideView } from '@/app/(ro)/ce-iti-trebuie/view'

export const metadata = guideMetadata('en')

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <GuideView locale="en" searchParams={await searchParams} />
}

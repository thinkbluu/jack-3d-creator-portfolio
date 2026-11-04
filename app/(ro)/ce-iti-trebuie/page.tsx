import { guideMetadata, GuideView } from './view'

export const metadata = guideMetadata('ro')

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return <GuideView locale="ro" searchParams={await searchParams} />
}

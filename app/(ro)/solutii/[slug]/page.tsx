// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import type { Metadata } from 'next'
import { industryMetadata, IndustryDetail } from './view'
import { getAllIndustries } from '@/lib/industries'

type IndustryPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllIndustries('ro').map((industry) => ({ slug: industry.slug }))
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params
  return industryMetadata('ro', slug)
}

export default async function Page({ params }: IndustryPageProps) {
  const { slug } = await params
  return <IndustryDetail locale="ro" slug={slug} />
}

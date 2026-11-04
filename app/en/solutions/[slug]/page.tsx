// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import type { Metadata } from 'next'
import { industryMetadata, IndustryDetail } from '@/app/(ro)/solutii/[slug]/view'
import { getAllIndustries } from '@/lib/industries'
import { publicIndustrySlug } from '@/lib/i18n/paths'

type IndustryPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllIndustries().map((industry) => ({ slug: publicIndustrySlug(industry.slug, 'en') }))
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params
  return industryMetadata('en', slug)
}

export default async function Page({ params }: IndustryPageProps) {
  const { slug } = await params
  return <IndustryDetail locale="en" slug={slug} />
}

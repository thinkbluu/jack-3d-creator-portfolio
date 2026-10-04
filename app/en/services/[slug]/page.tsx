import type { Metadata } from 'next'
import { ServiceDetail, serviceMetadata } from '@/app/(ro)/servicii/[slug]/page'
import { publicServiceSlug } from '@/lib/i18n/paths'
import { getAllServicePages } from '@/lib/services'

type ServicePageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllServicePages().map((service) => ({ slug: publicServiceSlug(service.slug, 'en') }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  return serviceMetadata('en', slug)
}

export default async function Page({ params }: ServicePageProps) {
  const { slug } = await params
  return <ServiceDetail locale="en" slug={slug} />
}

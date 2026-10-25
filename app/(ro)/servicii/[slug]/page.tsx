// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import type { Metadata } from 'next'
import { getAllServicePages } from '@/lib/services'
import { serviceMetadata, ServiceDetail } from './view'

type ServicePageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllServicePages('ro').map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  return serviceMetadata('ro', slug)
}

export default async function Page({ params }: ServicePageProps) {
  const { slug } = await params
  return <ServiceDetail locale="ro" slug={slug} />
}

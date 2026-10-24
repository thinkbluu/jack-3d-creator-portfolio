import type { Metadata } from 'next'
import { PricingView, pricingMetadata } from '@/app/(ro)/preturi/view'

export const metadata: Metadata = pricingMetadata('en')

export default function Page() {
  return <PricingView locale="en" />
}

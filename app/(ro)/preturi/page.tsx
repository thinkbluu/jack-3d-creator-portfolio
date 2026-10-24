import type { Metadata } from 'next'
import { PricingView, pricingMetadata } from './view'

export const metadata: Metadata = pricingMetadata('ro')

export default function Page() {
  return <PricingView locale="ro" />
}

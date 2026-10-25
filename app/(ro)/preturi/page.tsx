// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import type { Metadata } from 'next'
import { PricingView, pricingMetadata } from './view'

export const metadata: Metadata = pricingMetadata('ro')

export default function Page() {
  return <PricingView locale="ro" />
}

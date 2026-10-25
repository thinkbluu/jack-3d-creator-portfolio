// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { comparisonMetadata, ComparisonView } from '@/app/(ro)/comparatie/view'

export const metadata = comparisonMetadata('en')

export default function Page() {
  return <ComparisonView locale="en" />
}

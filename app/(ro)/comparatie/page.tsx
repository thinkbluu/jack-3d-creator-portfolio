// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { comparisonMetadata, ComparisonView } from './view'

export const metadata = comparisonMetadata('ro')

export default function Page() {
  return <ComparisonView locale="ro" />
}

// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { solutionsMetadata, SolutionsView } from '@/app/(ro)/solutii/view'

export const metadata = solutionsMetadata('en')

export default function Page() {
  return <SolutionsView locale="en" />
}

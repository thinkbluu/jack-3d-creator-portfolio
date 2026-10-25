// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { aboutMetadata, AboutView } from '@/app/(ro)/despre/view'

export const metadata = aboutMetadata('en')

export default function Page() {
  return <AboutView locale="en" />
}

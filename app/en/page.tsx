// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { homeMetadata, HomeView } from '@/app/(ro)/view'

export const metadata = homeMetadata('en')

export default function Page() {
  return <HomeView locale="en" />
}

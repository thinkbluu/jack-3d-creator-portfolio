// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { homeMetadata, HomeView } from './view'

export const metadata = homeMetadata('ro')

export default function Page() {
  return <HomeView locale="ro" />
}

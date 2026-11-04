// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { checkerMetadata, CheckerView } from './view'

export const metadata = checkerMetadata('ro')

export default function Page() {
  return <CheckerView locale="ro" />
}

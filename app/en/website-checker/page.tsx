// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { checkerMetadata, CheckerView } from '@/app/(ro)/verifica-site/view'

export const metadata = checkerMetadata('en')

export default function Page() {
  return <CheckerView locale="en" />
}

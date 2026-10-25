// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { offerMetadata, OfferView } from '@/app/(ro)/cere-oferta/view'

export const metadata = offerMetadata('en')

export default function Page() {
  return <OfferView locale="en" />
}

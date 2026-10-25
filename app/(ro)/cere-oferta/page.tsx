// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { offerMetadata, OfferView } from './view'

export const metadata = offerMetadata('ro')

export default function CereOfertaPage() {
  return <OfferView locale="ro" />
}

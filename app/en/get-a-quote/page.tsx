import { offerMetadata, OfferView } from '@/app/(ro)/cere-oferta/view'

export const metadata = offerMetadata('en')

export default function Page() {
  return <OfferView locale="en" />
}

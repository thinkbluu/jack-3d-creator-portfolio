// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { servicesMetadata, ServicesView } from '@/app/(ro)/servicii/view'

export const metadata = servicesMetadata('en')

export default function Page() {
  return <ServicesView locale="en" />
}

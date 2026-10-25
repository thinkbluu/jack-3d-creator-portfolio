// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { servicesMetadata, ServicesView } from './view'

export const metadata = servicesMetadata('ro')

export default function Page() {
  return <ServicesView locale="ro" />
}

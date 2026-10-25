// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import { aboutMetadata, AboutView } from './view'

export const metadata = aboutMetadata('ro')

export default function AboutPage() {
  return <AboutView locale="ro" />
}

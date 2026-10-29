import type { Metadata } from 'next'
import OfferLanding from './view'

// Campaign landing page for Google Ads traffic only: kept out of search
// results and out of the sitemap on purpose.
export const metadata: Metadata = {
  title: 'Site gratuit, plătești doar dacă îți place',
  description:
    'Site de prezentare de la 300 EUR, gata în 48 de ore după ce primim materialele. Fără avans până la 30 noiembrie: plătești doar dacă îți place.',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <OfferLanding />
}

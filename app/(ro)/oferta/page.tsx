import type { Metadata } from 'next'
import OfferLanding from './view'

// Campaign landing page for Google Ads traffic only: kept out of search
// results and out of the sitemap on purpose.
export const metadata: Metadata = {
  title: 'Site de prezentare de la 300 EUR, în 48 de ore',
  description:
    'Site de prezentare pentru firma ta, de la 300 EUR, gata în 48 de ore. Textele le scriem noi. Fără avans în noiembrie: plătești doar dacă îți place.',
  robots: { index: false, follow: false },
}

export default function Page() {
  return <OfferLanding />
}

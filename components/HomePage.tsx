'use client'

import MobileWhatsAppBar from '@/components/MobileWhatsAppBar'
import { SegmentProvider } from '@/components/SegmentContext'
import SiteHeader from '@/components/SiteHeader'
import HomeFaq from '@/components/studio/HomeFaq'
import IntroLoader from '@/components/studio/IntroLoader'
import SalutBye from '@/components/studio/SalutBye'
import SalutHero from '@/components/studio/SalutHero'
import SalutPip from '@/components/studio/SalutPip'
import { ProjectOrbit, ReviewsBlock } from '@/components/studio/SalutRings'
import SalutServices from '@/components/studio/SalutServices'
import SalutStatement from '@/components/studio/SalutStatement'
import SalutWork from '@/components/studio/SalutWork'

/**
 * The homepage, type first: a greeting that knows what time it is, one
 * confident sentence, the work shown big, services as a stacking deck, proof,
 * questions and a sign-off. The server page around it adds metadata and
 * structured data; the footer is passed in.
 */
export default function HomePage({ afterScenes, footer }: { afterScenes?: React.ReactNode; footer: React.ReactNode }) {
  return (
    <SegmentProvider>
      <IntroLoader />
      <SiteHeader tone="dark" overlay />
      <main className="relative bg-[var(--night)]" style={{ overflowX: 'clip' }}>
        <SalutHero />
        <SalutStatement />
        <SalutWork />
        <ProjectOrbit />
        <SalutServices />
        <ReviewsBlock />
        <HomeFaq />
        <SalutBye />
        {afterScenes}
      </main>
      {footer}
      <SalutPip />
      <MobileWhatsAppBar />
    </SegmentProvider>
  )
}

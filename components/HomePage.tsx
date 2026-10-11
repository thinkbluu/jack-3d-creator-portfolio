'use client'

import GoogleReviews from '@/components/GoogleReviews'
import MobileWhatsAppBar from '@/components/MobileWhatsAppBar'
import { SegmentProvider } from '@/components/SegmentContext'
import SiteHeader from '@/components/SiteHeader'
import HomeFaq from '@/components/studio/HomeFaq'
import InkHero from '@/components/studio/InkHero'
import IntroLoader from '@/components/studio/IntroLoader'
import Manifest from '@/components/studio/Manifest'
import NameCta from '@/components/studio/NameCta'
import ServicesIndex from '@/components/studio/ServicesIndex'
import StudioProcess from '@/components/studio/StudioProcess'
import WorkShow from '@/components/studio/WorkShow'

/**
 * The homepage, told as one story: an opening of ink moving through water, the work, what we
 * build, what we stand for, how we work, proof, questions, and a closing
 * scene where the visitor's own business name takes shape. The server page
 * around it adds metadata and structured data; the footer is passed in.
 */
export default function HomePage({ afterScenes, footer }: { afterScenes?: React.ReactNode; footer: React.ReactNode }) {
  return (
    <SegmentProvider>
      <IntroLoader />
      <SiteHeader tone="dark" overlay />
      <main className="relative bg-[var(--night)]" style={{ overflowX: 'clip' }}>
        <InkHero />
        <WorkShow />
        <ServicesIndex />
        <Manifest />
        <StudioProcess />
        <div className="tone-cream relative py-24 md:py-32">
          <div className="studio-container">
            <GoogleReviews bare />
          </div>
        </div>
        <HomeFaq />
        <NameCta />
        {afterScenes}
      </main>
      {footer}
      <MobileWhatsAppBar />
    </SegmentProvider>
  )
}

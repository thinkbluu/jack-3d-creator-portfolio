'use client'

import GoogleReviews from '@/components/GoogleReviews'
import MobileWhatsAppBar from '@/components/MobileWhatsAppBar'
import { SegmentProvider } from '@/components/SegmentContext'
import SiteHeader from '@/components/SiteHeader'
import LuminaHero from '@/components/studio/LuminaHero'
import Dawn from '@/components/studio/Dawn'
import HomeFaq from '@/components/studio/HomeFaq'
import IntroLoader from '@/components/studio/IntroLoader'
import Manifest from '@/components/studio/Manifest'
import NameCta from '@/components/studio/NameCta'
import ServicesIndex from '@/components/studio/ServicesIndex'
import StudioProcess from '@/components/studio/StudioProcess'
import WorkBook from '@/components/studio/WorkBook'

/**
 * The homepage, told as one night turning into day: an opening lit by the
 * visitor's lamp, the work as a book on a dark desk, what we stand for and how
 * we work, then sunrise, and everything practical (services and prices,
 * reviews, questions) in daylight before the closing scene. The server page
 * around it adds metadata and structured data; the footer is passed in.
 */
export default function HomePage({ afterScenes, footer }: { afterScenes?: React.ReactNode; footer: React.ReactNode }) {
  return (
    <SegmentProvider>
      <IntroLoader />
      <SiteHeader tone="dark" overlay />
      <main className="relative bg-[var(--night)]" style={{ overflowX: 'clip' }}>
        <LuminaHero />
        <WorkBook />
        <Manifest />
        <StudioProcess />
        <Dawn />
        <ServicesIndex />
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

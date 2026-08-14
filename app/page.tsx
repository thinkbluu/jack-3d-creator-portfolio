'use client'

import { useRef } from 'react'
import { useScroll, useSpring, useTransform } from 'framer-motion'
import CinematicHero from '@/components/CinematicHero'
import SceneLayer from '@/components/SceneLayer'
import ComparisonSection from '@/components/ComparisonSection'
import ManifestSection from '@/components/ManifestSection'
import StudioSection from '@/components/StudioSection'
import ServicesSection from '@/components/ServicesSection'
import ProcessSection from '@/components/ProcessSection'
import FAQSection from '@/components/FAQSection'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import MobileWhatsAppBar from '@/components/MobileWhatsAppBar'
import { SegmentProvider } from '@/components/SegmentContext'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'MAST Studio',
  legalName: 'MAST Consult S.R.L.',
  url: 'https://maststudio.ro',
  email: 'contact@maststudio.ro',
  telephone: '+40755928029',
  areaServed: 'RO',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Timișoara',
    addressCountry: 'RO',
  },
}

const businessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': 'https://maststudio.ro/#business',
  name: 'MAST Studio',
  image: 'https://maststudio.ro/opengraph-image',
  url: 'https://maststudio.ro',
  telephone: '+40755928029',
  email: 'contact@maststudio.ro',
  priceRange: '€€',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Timișoara',
    addressRegion: 'Timiș',
    addressCountry: 'RO',
  },
  areaServed: [
    { '@type': 'City', name: 'Timișoara' },
    { '@type': 'Country', name: 'România' },
  ],
  knowsLanguage: ['ro', 'en'],
  sameAs: [],
}

const SPRING = { stiffness: 80, damping: 26 } as const
// Ramp in over the first 20% of the rig's travel, hold, then ramp out over the last 20%.
const FADE_STOPS = [0, 0.2, 0.8, 1]
const FADE_VALUES = [0, 1, 1, 0]

export default function Page() {
  const tableRigRef = useRef<HTMLDivElement>(null)
  const compassRigRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: tableProgress } = useScroll({
    target: tableRigRef,
    offset: ['start end', 'end start'],
  })
  const tableFade = useSpring(useTransform(tableProgress, FADE_STOPS, FADE_VALUES), SPRING)

  const { scrollYProgress: compassProgress } = useScroll({
    target: compassRigRef,
    offset: ['start end', 'end start'],
  })
  const compassFade = useSpring(useTransform(compassProgress, FADE_STOPS, FADE_VALUES), SPRING)

  return (
    <SegmentProvider>
      <main className="relative bg-[var(--shell)]" style={{ overflowX: 'clip' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd).replace(/</g, '\\u003c') }} />
        <CinematicHero />

        <div ref={tableRigRef} className="scene-rig">
          <div className="scene-sticky">
            <SceneLayer
              poster="/images/scene-table-poster.jpg"
              video="/images/scene-table.mp4"
              overlay={0.5}
              blurPx={3}
              fade={tableFade}
            />
          </div>
          <div className="scene-content">
            <ServicesSection />
            {/* Future proof evidence: replace demos with the first real named client project, an authentic before/after screenshot, and a testimonial. */}
            <ComparisonSection />
            <ManifestSection />
            <ProcessSection />
            <StudioSection />
            <FAQSection />
          </div>
        </div>

        <div ref={compassRigRef} className="scene-rig">
          <div className="scene-sticky">
            <SceneLayer
              poster="/images/scene-compass-poster.jpg"
              video="/images/scene-compass.mp4"
              overlay={0.22}
              blurPx={2}
              fade={compassFade}
            />
          </div>
          <div className="scene-content">
            <FinalCTA />
          </div>
        </div>

        <Footer />
        <MobileWhatsAppBar />
      </main>
    </SegmentProvider>
  )
}

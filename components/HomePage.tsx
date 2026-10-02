'use client'

import { useRef } from 'react'
import { useScroll, useSpring, useTransform } from 'framer-motion'
import CinematicHero from '@/components/CinematicHero'
import SceneLayer from '@/components/SceneLayer'
import ProofSection from '@/components/ProofSection'
import ManifestSection from '@/components/ManifestSection'
import StudioSection from '@/components/StudioSection'
import ServicesSection from '@/components/ServicesSection'
import ProcessSection from '@/components/ProcessSection'
import FAQSection from '@/components/FAQSection'
import FinalCTA from '@/components/FinalCTA'
import MobileWhatsAppBar from '@/components/MobileWhatsAppBar'
import { SegmentProvider } from '@/components/SegmentContext'

const SPRING = { stiffness: 80, damping: 26 } as const
// Ramp in over the first 20% of the rig's travel, hold, then ramp out over the last 20%.
const FADE_STOPS = [0, 0.2, 0.8, 1]
const FADE_VALUES = [0, 1, 1, 0]

/**
 * The scroll-driven homepage. Kept as one client component so the scene rigs,
 * their fades and the cinematic hero behave exactly as before; the server page
 * around it only adds metadata and structured data. The footer is passed in as
 * a server-rendered node.
 */
export default function HomePage({ footer }: { footer: React.ReactNode }) {
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
      {/* Hero image of the server-rendered (mobile/tablet) layout, the LCP element on
          phones. Rendered from this client component so React hoists it into <head>
          for homepage visits only, not when other pages prefetch "/". */}
      <link rel="preload" as="image" href="/images/harbor-final-mobile.webp" media="(max-width: 767px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/images/harbor-final-tablet.webp" media="(min-width: 768px) and (max-width: 1023px)" fetchPriority="high" />
      <main className="relative bg-[var(--shell)]" style={{ overflowX: 'clip' }}>
        <CinematicHero />

        <div ref={tableRigRef} className="scene-rig">
          <div className="scene-sticky">
            <SceneLayer
              poster="/images/scene-table-poster.webp"
              video="/images/scene-table.mp4"
              overlay={0.5}
              blurPx={3}
              fade={tableFade}
            />
          </div>
          <div className="scene-content">
            <ServicesSection />
            <ProofSection />
            <ManifestSection />
            <ProcessSection />
            <StudioSection />
            <FAQSection />
          </div>
        </div>

        <div ref={compassRigRef} className="scene-rig">
          <div className="scene-sticky">
            <SceneLayer
              poster="/images/scene-compass-poster.webp"
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

      </main>
      {footer}
      <MobileWhatsAppBar />
    </SegmentProvider>
  )
}

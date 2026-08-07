import CinematicHero from '@/components/CinematicHero'
import SceneLayer from '@/components/SceneLayer'
import ComparisonSection from '@/components/ComparisonSection'
import ManifestSection from '@/components/ManifestSection'
import AboutSection from '@/components/AboutSection'
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

export default function Page() {
  return (
    <SegmentProvider>
      <main className="relative bg-[var(--shell)]" style={{ overflowX: 'clip' }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }} />
        <CinematicHero />

        <div className="scene-rig">
          <div className="scene-sticky">
            <SceneLayer poster="/scenes/scene-table-poster.png" video="/scenes/scene-table.mp4" overlay={0.32} />
          </div>
          <div className="scene-content">
            <ComparisonSection />
            <ManifestSection />
            <AboutSection />
            <ServicesSection />
            <ProcessSection />
            <FAQSection />
          </div>
        </div>

        <div className="scene-rig">
          <div className="scene-sticky">
            <SceneLayer poster="/scenes/scene-compass-poster.png" video="/scenes/scene-compass.mp4" overlay={0.18} />
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

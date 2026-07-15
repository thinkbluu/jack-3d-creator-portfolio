import HeroSection from '@/components/HeroSection'
import RouteTransition from '@/components/RouteTransition'
import ManifestSection from '@/components/ManifestSection'
import AboutSection from '@/components/AboutSection'
import ServicesSection from '@/components/ServicesSection'
import ProjectsSection from '@/components/ProjectsSection'
import ProcessSection from '@/components/ProcessSection'
import FAQSection from '@/components/FAQSection'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
import MobileWhatsAppBar from '@/components/MobileWhatsAppBar'
import CompassHUD from '@/components/CompassHUD'
import PlottedRoute from '@/components/PlottedRoute'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'MAST Studio',
  legalName: 'MAST Consult S.R.L.',
  url: 'https://maststudio.ro',
  email: 'contact@maststudio.ro',
  areaServed: 'RO',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Timișoara',
    addressCountry: 'RO',
  },
}

export default function Page() {
  return (
    <main className="relative bg-[var(--bg)]" style={{ overflowX: 'clip' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }}
      />
      <HeroSection />
      <RouteTransition />
      <ManifestSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <ProjectsSection />
      <FAQSection />
      <FinalCTA />
      <Footer />
      <MobileWhatsAppBar />
      <CompassHUD />
      <PlottedRoute />
    </main>
  )
}

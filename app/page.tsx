import HeroSection from '@/components/HeroSection'
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

export default function Page() {
  return (
    <main className="relative bg-[var(--bg)]" style={{ overflowX: 'clip' }}>
      <HeroSection />
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

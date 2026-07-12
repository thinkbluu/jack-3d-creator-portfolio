import HeroSection from '@/components/HeroSection'
import MarqueeSection from '@/components/MarqueeSection'
import AboutSection from '@/components/AboutSection'
import ServicesSection from '@/components/ServicesSection'
import ProjectsSection from '@/components/ProjectsSection'
import ComparisonSection from '@/components/ComparisonSection'
import ProcessSection from '@/components/ProcessSection'
import FAQSection from '@/components/FAQSection'
import FinalCTA from '@/components/FinalCTA'
import MobileWhatsAppBar from '@/components/MobileWhatsAppBar'
import CompassHUD from '@/components/CompassHUD'

export default function Page() {
  return (
    <main className="bg-[var(--bg)]" style={{ overflowX: 'clip' }}>
      <HeroSection />
      <MarqueeSection />
      <ComparisonSection />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <ProjectsSection />
      <FAQSection />
      <FinalCTA />
      <MobileWhatsAppBar />
      <CompassHUD />
    </main>
  )
}

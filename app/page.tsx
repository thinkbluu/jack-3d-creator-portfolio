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

export default function Page() {
  return (
    <main style={{ background: '#0C0C0C', overflowX: 'clip' }}>
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
    </main>
  )
}

'use client'

import FadeIn from './FadeIn'
import Magnet from './Magnet'
import ContactButton from './ContactButton'
import ChartKicker from './ChartKicker'

const navLinks = [
  { label: 'Despre', href: '#about' },
  { label: 'Servicii', href: '#services' },
  { label: 'Proiecte', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function HeroSection() {
  return (
    <section id="home" className="hero-chart-grid relative flex min-h-screen flex-col overflow-x-clip bg-[var(--bg)]">
      <FadeIn delay={0}>
        <nav className="site-container flex items-center justify-between pt-6 md:pt-8" aria-label="Navigație principală">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group relative text-sm font-medium text-[var(--text)] md:text-base"
            >
              {link.label}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[var(--gold)] transition-transform group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
      </FadeIn>

      <FadeIn delay={0.04} className="site-container mt-8">
        <ChartKicker bearing="01" label="Acasă" />
      </FadeIn>

      <div className="mt-2 w-full max-w-[100vw] overflow-hidden px-2">
        <h1 className="hero-heading text-center font-black uppercase leading-[0.9] tracking-[-0.03em]" style={{ fontSize: 'clamp(4rem, 17vw, 15rem)' }}>
          <span className="block overflow-hidden"><FadeIn delay={0.08}>MAST</FadeIn></span>
          <span className="block overflow-hidden"><FadeIn delay={0.16}>STUDIO</FadeIn></span>
        </h1>
      </div>

      <FadeIn delay={0.24} className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:translate-y-0">
        <Magnet padding={150} strength={3} activeTransition="transform 0.25s ease-out" inactiveTransition="transform 0.25s ease-out">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mast-hero.png" alt="Busolă aurie MAST Studio" width={3000} height={3000} loading="eager" decoding="async" fetchPriority="high" className="h-auto w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]" />
        </Magnet>
      </FadeIn>

      <div className="site-container mt-auto flex flex-col items-start gap-5 pb-8 sm:flex-row sm:items-end sm:justify-between md:pb-10">
        <FadeIn delay={0.24}>
          <p className="type-body max-w-sm text-sm">
            Studio de web design. Site-uri livrate in 48 de ore si platforme premium pentru afaceri care stiu incotro merg.
          </p>
        </FadeIn>
        <FadeIn delay={0.32}>
          <ContactButton hero />
        </FadeIn>
      </div>
    </section>
  )
}

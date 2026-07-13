'use client'

import FadeIn from './FadeIn'
import Magnet from './Magnet'
import ContactButton from './ContactButton'
import ChartKicker from './ChartKicker'
import { motion, useReducedMotion } from 'framer-motion'

const navLinks = [
  { label: 'Despre', href: '#about' },
  { label: 'Servicii', href: '#services' },
  { label: 'Proiecte', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function HeroSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="home" className="hero-chart-grid relative flex min-h-screen flex-col overflow-x-clip bg-[var(--bg)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(2,5,10,0.5)_100%)]"
      />
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
        <ChartKicker bearing="01" label="Acasă" coords />
      </FadeIn>

      <div className="relative z-0 mt-2 w-full max-w-[100vw] overflow-hidden px-2">
        <h1 className="text-center font-black uppercase leading-[0.9] tracking-[-0.03em]" style={{ fontSize: 'clamp(4rem, 17vw, 15rem)' }}>
          <span className="block overflow-hidden"><FadeIn delay={0.08}><span className="hero-heading-line block">MAST</span></FadeIn></span>
          <span className="block overflow-hidden"><FadeIn delay={0.16}><span className="hero-heading-line block">STUDIO</span></FadeIn></span>
        </h1>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 z-10 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(201,162,39,0.09)_0%,transparent_65%)] blur-2xl sm:top-auto sm:bottom-16 sm:translate-y-1/2"
      />

      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-16 sm:translate-y-0">
        <Magnet padding={150} strength={3} activeTransition="transform 0.25s ease-out" inactiveTransition="transform 0.25s ease-out">
          <motion.div
            className="relative"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -25, scale: 0.96 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
            transition={
              reduceMotion
                ? { duration: 0.5 }
                : {
                    opacity: { duration: 0.5, delay: 0.24 },
                    rotate: { type: 'spring', stiffness: 60, damping: 9, mass: 1.1, delay: 0.24 },
                    scale: { type: 'spring', stiffness: 60, damping: 9, mass: 1.1, delay: 0.24 },
                  }
            }
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-1 left-1/2 -z-10 h-6 w-[60%] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(0,0,0,0.45),transparent_70%)]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/mast-hero.png" alt="Busolă aurie MAST Studio" width={3000} height={3000} loading="eager" decoding="async" fetchPriority="high" className="relative h-auto w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]" />
          </motion.div>
        </Magnet>
      </div>

      <div className="site-container mt-auto flex flex-col items-start gap-5 pb-8 sm:flex-row sm:items-end sm:justify-between md:pb-10">
        <FadeIn delay={0.24}>
          <p className="type-body max-w-sm text-sm">
            Studio de web design. Site-uri livrate în 48 de ore și platforme premium pentru afaceri care știu încotro merg.
          </p>
        </FadeIn>
        <FadeIn delay={0.32}>
          <ContactButton hero />
        </FadeIn>
      </div>
    </section>
  )
}

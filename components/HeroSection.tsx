'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import FadeIn from './FadeIn'
import ContactButton from './ContactButton'
import ChartKicker from './ChartKicker'

const navLinks = [
  { label: 'Despre', href: '#about' },
  { label: 'Servicii', href: '#services' },
  { label: 'Proiecte', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function HeroSection() {
  const reduceMotion = useReducedMotion()
  const sceneX = useMotionValue(0)
  const sceneY = useMotionValue(0)
  const springX = useSpring(sceneX, { stiffness: 50, damping: 20 })
  const springY = useSpring(sceneY, { stiffness: 50, damping: 20 })

  useEffect(() => {
    if (reduceMotion) return

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!finePointer.matches) return

    const handlePointerMove = (event: PointerEvent) => {
      sceneX.set(((window.innerWidth / 2 - event.clientX) / (window.innerWidth / 2)) * 8)
      sceneY.set(((window.innerHeight / 2 - event.clientY) / (window.innerHeight / 2)) * 8)
    }

    const resetScene = () => {
      sceneX.set(0)
      sceneY.set(0)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerleave', resetScene)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerleave', resetScene)
    }
  }, [reduceMotion, sceneX, sceneY])

  return (
    <section id="home" className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--bg)]">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-10px] z-0"
        initial={reduceMotion ? false : { scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        style={reduceMotion ? undefined : { x: springX, y: springY }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero-scene.png"
          alt=""
          aria-hidden="true"
          width={4096}
          height={4096}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover object-[center_60%]"
        />
      </motion.div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[30%] bg-[linear-gradient(transparent,var(--bg))]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(2,5,10,0.55)_100%)]" />
      <div aria-hidden="true" className="hero-chart-grid pointer-events-none absolute inset-0 z-[3] opacity-40" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <FadeIn delay={0}>
          <nav className="site-container flex items-center justify-between pt-6 md:pt-8" aria-label="Navigație principală">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="group relative text-sm font-medium text-[var(--text)] md:text-base">
                {link.label}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[var(--gold)] transition-transform group-hover:scale-x-100" />
              </a>
            ))}
          </nav>
        </FadeIn>

        <FadeIn delay={0.04} className="site-container mt-8">
          <ChartKicker bearing="01" label="Acasă" coords />
        </FadeIn>

        <div className="mt-2 w-full max-w-[100vw] overflow-hidden px-2">
          <h1 className="text-center font-black uppercase leading-[0.9] tracking-[-0.03em]" style={{ fontSize: 'clamp(4rem, 17vw, 15rem)' }}>
            <span className="block overflow-hidden"><FadeIn delay={0.08}><span className="hero-heading-line block">MAST</span></FadeIn></span>
            <span className="block overflow-hidden"><FadeIn delay={0.16}><span className="hero-heading-line block">STUDIO</span></FadeIn></span>
          </h1>
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
      </div>
    </section>
  )
}

'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import AmbientVideo from './AmbientVideo'
import ChartKicker from './ChartKicker'
import ContactButton from './ContactButton'

const navLinks = [
  { label: 'Despre', href: '#about' },
  { label: 'Servicii', href: '#services' },
  { label: 'Escale', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] })

  const veilScale = useTransform(scrollYProgress, [0, 0.1], [1, 1.01])
  const leftX = useTransform(scrollYProgress, [0, 0.1, 0.4], ['0%', '-0.5%', '-108%'])
  const rightX = useTransform(scrollYProgress, [0, 0.1, 0.4], ['0%', '0.5%', '108%'])
  const leftRotate = useTransform(scrollYProgress, [0.1, 0.4], [0, -2.5])
  const rightRotate = useTransform(scrollYProgress, [0.1, 0.4], [0, 2.5])
  const panelScale = useTransform(scrollYProgress, [0.1, 0.4], [1, 1.05])
  const panelOpacity = useTransform(scrollYProgress, [0, 0.34, 0.4], [1, 1, 0])

  const seaScale = useTransform(scrollYProgress, [0, 0.1, 0.4, 0.62], [1.12, 1.12, 1.08, 1.24])
  const seaY = useTransform(scrollYProgress, [0.4, 0.62], ['0%', '3%'])
  const beaconOpacity = useTransform(scrollYProgress, [0, 0.14, 0.26], [0, 0, 1])
  const beaconScale = useTransform(scrollYProgress, [0, 0.4, 0.62], [1, 1, 5])
  const haloOpacity = useTransform(scrollYProgress, [0.4, 0.62], [0.1, 0.13])
  const approachVignetteOpacity = useTransform(scrollYProgress, [0.4, 0.62], [0, 0.45])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06, 0.1], [1, 1, 0])

  const panelMaskLeft = 'linear-gradient(to right, black 0%, black 92%, transparent 100%)'
  const panelMaskRight = 'linear-gradient(to left, black 0%, black 92%, transparent 100%)'

  return (
    <section ref={heroRef} id="home" className="relative h-[320vh] bg-[var(--bg)]">
      <div className="sticky top-0 h-screen min-h-[100dvh] overflow-hidden bg-[var(--bg)]">
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 will-change-transform"
          style={reduceMotion ? { scale: 1.08 } : { scale: seaScale, y: seaY }}
        >
          <AmbientVideo src="/images/sea-loop.mp4" poster="/images/sea-backdrop.jpg" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[56%] z-[2] h-0 w-0 -translate-x-1/2 -translate-y-1/2 mix-blend-screen will-change-transform"
          style={reduceMotion ? { opacity: 1, scale: 1 } : { opacity: beaconOpacity, scale: beaconScale }}
        >
          <motion.div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,217,166,0.10),transparent_70%)] blur-3xl" style={reduceMotion ? { opacity: 0.13 } : { opacity: haloOpacity }} />
          <div className="absolute left-1/2 top-1/2 h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,217,166,0.35),transparent_70%)] blur-lg" />
          <div className="absolute left-1/2 top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,235,200,0.95),transparent_72%)] blur-[2px]" />
        </motion.div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[58vh] z-[2] h-[34vh] w-[26vw] min-w-28 -translate-x-1/2 bg-[linear-gradient(180deg,rgba(232,217,166,0.14),rgba(232,217,166,0.03)_70%,transparent)] opacity-0 blur-[10px] [clip-path:polygon(0_0,100%_0,82%_100%,18%_100%)] mix-blend-screen"
          data-reflection-path="true"
        />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[4] will-change-transform"
          style={reduceMotion ? { scale: 1 } : { scale: veilScale }}
        >
          <motion.div
            className="absolute left-0 top-0 h-full w-[58vw] overflow-visible will-change-transform"
            style={reduceMotion ? { x: '-108%', opacity: 0 } : { x: leftX, rotate: leftRotate, scale: panelScale, opacity: panelOpacity, maskImage: panelMaskLeft, WebkitMaskImage: panelMaskLeft }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/kasumi-left.png" alt="" width={1782} height={2304} loading="eager" decoding="async" fetchPriority="high" className="h-full w-full object-cover" />
          </motion.div>
          <motion.div
            className="absolute right-0 top-0 h-full w-[58vw] overflow-visible will-change-transform"
            style={reduceMotion ? { x: '108%', opacity: 0 } : { x: rightX, rotate: rightRotate, scale: panelScale, opacity: panelOpacity, maskImage: panelMaskRight, WebkitMaskImage: panelMaskRight }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/kasumi-right.png" alt="" width={1782} height={2304} loading="eager" decoding="async" fetchPriority="high" className="h-full w-full object-cover" />
          </motion.div>
        </motion.div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[30%] bg-[linear-gradient(transparent,var(--bg))]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[7] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(2,5,10,0.55)_100%)]" />
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[7] bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(2,5,10,0.28)_100%)]" style={{ opacity: reduceMotion ? 0.45 : approachVignetteOpacity }} />
        <div aria-hidden="true" className="hero-chart-grid pointer-events-none absolute inset-0 z-[8] opacity-40" />

        <nav className="site-container fixed inset-x-0 top-0 z-20 flex items-center justify-between pt-6 md:pt-8" aria-label="Navigație principală">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="group relative text-sm font-medium text-[var(--text)] md:text-base">
              {link.label}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[var(--gold)] transition-transform group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="relative z-10 flex min-h-screen min-h-[100dvh] flex-col pt-16 md:pt-20">
          <div className="site-container mt-8 overflow-hidden">
            <div><ChartKicker bearing="01" label="Acasă" coords /></div>
          </div>

          <div className="relative mt-2 flex w-full max-w-[100vw] justify-center overflow-hidden px-4">
            <h1 className="sr-only">MAST Studio</h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/mast-studio-title.png" alt="MAST Studio" width={5120} height={5120} loading="eager" decoding="async" fetchPriority="high" className="h-auto max-h-[52vh] w-auto max-w-full object-contain mix-blend-screen" />
          </div>

          <div className="site-container mt-auto flex flex-col items-start gap-5 pb-8 sm:flex-row sm:items-end sm:justify-between md:pb-10">
            <div className="overflow-hidden">
              <p className="type-body max-w-sm text-sm">
                Studio de web design. Site-uri livrate în 48 de ore și platforme premium pentru afaceri care știu încotro merg.
              </p>
            </div>
            <div className="overflow-hidden"><ContactButton hero /></div>
          </div>
        </div>

        {!reduceMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-center text-[10px] uppercase tracking-[0.24em] text-[var(--text)]"
            style={{ opacity: cueOpacity }}
          >
            <span>urmează lumina</span>
            <motion.span className="text-base leading-none text-[var(--gold)]" animate={{ y: [0, 5, 0] }} transition={{ duration: 2.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}>⌄</motion.span>
          </motion.div>
        )}
      </div>
    </section>
  )
}

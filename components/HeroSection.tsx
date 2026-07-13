'use client'

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
} from 'framer-motion'
import { useRef } from 'react'
import ContactButton from './ContactButton'
import ChartKicker from './ChartKicker'

const navLinks = [
  { label: 'Despre', href: '#about' },
  { label: 'Servicii', href: '#services' },
  { label: 'Proiecte', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30 })

  const seaX = useTransform(progress, [0, 1], ['0%', '-2%'])
  const portalRadius = useTransform(progress, [0, 0.12, 0.55, 1], [0, 0, 90, 90])
  const portalMask = useMotionTemplate`radial-gradient(circle at 50% 44%, transparent ${portalRadius}vw, black calc(${portalRadius}vw + 28vw))`

  const veilAScale = useTransform(progress, [0, 0.06, 0.12, 0.55], [1.15, 1.18, 1.15, 1.15])
  const veilAX = useTransform(progress, [0.12, 0.55], ['0%', '-4%'])
  const veilAY = useTransform(progress, [0.12, 0.55], ['0%', '-2%'])
  const veilBX = useTransform(progress, [0.12, 0.55], ['0%', '5%'])
  const veilBY = useTransform(progress, [0.12, 0.55], ['0%', '2%'])
  const fogOpacity = useTransform(progress, [0.55, 0.75], [1, 0])
  const veilBOpacity = useTransform(fogOpacity, (value) => value * 0.8)

  const lockupScale = useTransform(progress, [0, 0.12, 0.55], [0.92, 0.92, 1])
  const lockupOpacity = useTransform(progress, [0, 0.12, 0.55], [0.9, 0.9, 1])
  const lockupBlur = useTransform(progress, [0.12, 0.55], [8, 0])
  const lockupFilter = useMotionTemplate`blur(${lockupBlur}px)`
  const glowOpacity = useTransform(progress, (value) => {
    if (value <= 0.12) return 0.7 + Math.sin((value / 0.12) * Math.PI * 2) * 0.2
    if (value <= 0.42) return 0.9 + ((value - 0.12) / 0.3) * 0.1
    if (value <= 0.55) return 1 - ((value - 0.42) / 0.13) * 0.72
    return 0.28
  })
  const glowScale = useTransform(progress, [0.12, 0.42, 0.55], [1, 1.16, 1.06])

  const kickerOpacity = useTransform(progress, [0.75, 0.82], [0, 1])
  const kickerY = useTransform(progress, [0.75, 0.82], [24, 0])
  const paragraphOpacity = useTransform(progress, [0.82, 0.9], [0, 1])
  const paragraphY = useTransform(progress, [0.82, 0.9], [24, 0])
  const ctaOpacity = useTransform(progress, [0.9, 0.98], [0, 1])
  const ctaY = useTransform(progress, [0.9, 0.98], [24, 0])
  const cueOpacity = useTransform(progress, [0, 0.1], [1, 0])

  return (
    <section ref={heroRef} id="home" className="relative h-screen bg-[var(--bg)] lg:h-[300vh] [@media(pointer:coarse)]:h-screen">
      <div className="relative flex h-screen min-h-[100dvh] flex-col overflow-hidden bg-[var(--bg)] lg:sticky lg:top-0 [@media(pointer:coarse)]:relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[var(--bg)]" />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[102%] will-change-transform"
          style={reduceMotion ? undefined : { x: seaX }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/sea-backdrop.jpg" alt="" width={1360} height={768} loading="eager" decoding="async" fetchPriority="high" className="h-full w-full object-cover" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[44%] z-[2] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,217,166,0.10)_0%,transparent_60%)] blur-[40px] mix-blend-screen"
          style={reduceMotion ? undefined : { opacity: glowOpacity, scale: glowScale }}
        />

        <nav className="site-container absolute inset-x-0 top-0 z-20 flex items-center justify-between pt-6 md:pt-8" aria-label="Navigație principală">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="group relative text-sm font-medium text-[var(--text)] md:text-base">
              {link.label}
              <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[var(--gold)] transition-transform group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <motion.div
          className="relative z-[3] flex min-h-screen flex-col pt-16 opacity-100 lg:opacity-[var(--lockup-opacity)] lg:[filter:var(--lockup-filter)] [@media(pointer:coarse)]:opacity-100 [@media(pointer:coarse)]:[filter:none] md:pt-20"
          style={
            reduceMotion
              ? undefined
              : ({ '--lockup-opacity': lockupOpacity, '--lockup-filter': lockupFilter, scale: lockupScale } as MotionStyle)
          }
        >
          <motion.div
            className="site-container mt-8 opacity-100 lg:opacity-[var(--kicker-opacity)] [@media(pointer:coarse)]:opacity-100"
            style={reduceMotion ? undefined : ({ '--kicker-opacity': kickerOpacity, y: kickerY } as MotionStyle)}
          >
            <ChartKicker bearing="01" label="Acasă" coords />
          </motion.div>

          <div className="mt-2 flex w-full max-w-[100vw] justify-center overflow-hidden px-4">
            <h1 className="sr-only">MAST Studio</h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/mast-studio-title.png" alt="MAST Studio" width={5120} height={5120} loading="eager" decoding="async" fetchPriority="high" className="h-auto max-h-[52vh] w-auto max-w-full object-contain mix-blend-screen" />
          </div>

          <div className="site-container mt-auto flex flex-col items-start gap-5 pb-8 sm:flex-row sm:items-end sm:justify-between md:pb-10">
            <motion.p
              className="type-body max-w-sm text-sm opacity-100 lg:opacity-[var(--paragraph-opacity)] [@media(pointer:coarse)]:opacity-100"
              style={reduceMotion ? undefined : ({ '--paragraph-opacity': paragraphOpacity, y: paragraphY } as MotionStyle)}
            >
              Studio de web design. Site-uri livrate în 48 de ore și platforme premium pentru afaceri care știu încotro merg.
            </motion.p>
            <motion.div
              className="opacity-100 lg:opacity-[var(--cta-opacity)] [@media(pointer:coarse)]:opacity-100"
              style={reduceMotion ? undefined : ({ '--cta-opacity': ctaOpacity, y: ctaY } as MotionStyle)}
            >
              <ContactButton hero />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[4] hidden origin-center will-change-transform lg:block [@media(pointer:coarse)]:hidden"
          style={{ x: veilAX, y: veilAY, scale: veilAScale, opacity: fogOpacity, maskImage: portalMask, WebkitMaskImage: portalMask }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mist-veil-1.png" alt="" width={1360} height={768} loading="eager" decoding="async" className="h-full w-full object-cover mix-blend-screen" />
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[5] hidden scale-[1.3] will-change-transform lg:block [@media(pointer:coarse)]:hidden"
          style={{ x: veilBX, y: veilBY, opacity: veilBOpacity, maskImage: portalMask, WebkitMaskImage: portalMask }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mist-veil-2.png" alt="" width={1360} height={768} loading="eager" decoding="async" className="h-full w-full object-cover mix-blend-screen" />
        </motion.div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[30%] bg-[linear-gradient(transparent,var(--bg))]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[7] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(2,5,10,0.55)_100%)]" />
        <div aria-hidden="true" className="hero-chart-grid pointer-events-none absolute inset-0 z-[8] opacity-40" />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[var(--text)] lg:flex [@media(pointer:coarse)]:hidden"
          style={{ opacity: cueOpacity }}
        >
          <span>urmează lumina</span>
          <span className="h-8 w-px bg-[var(--gold)]" />
        </motion.div>
      </div>
    </section>
  )
}

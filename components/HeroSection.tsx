'use client'

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useEffect, useRef, type CSSProperties } from 'react'
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
  const sceneX = useMotionValue(0)
  const sceneY = useMotionValue(0)
  const pointerX = useSpring(sceneX, { stiffness: 50, damping: 20 })
  const pointerY = useSpring(sceneY, { stiffness: 50, damping: 20 })
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30 })

  const seaScale = useTransform(progress, [0, 0.72, 1], [1.08, 1.02, 1])
  const seaY = useTransform(progress, [0, 1], ['0%', '-2%'])
  const mistOneX = useTransform(progress, [0, 0.68, 1], ['-18%', '3%', '8%'])
  const mistTwoX = useTransform(progress, [0, 0.68, 1], ['18%', '-3%', '-8%'])
  const mistOpacity = useTransform(progress, [0, 0.12, 0.58, 0.82], [0, 0.82, 0.48, 0])
  const beamX = useTransform(progress, [0.05, 0.58], ['-125%', '130%'])
  const beamOpacity = useTransform(progress, [0, 0.08, 0.5, 0.65], [0, 0.42, 0.32, 0])
  const sceneOpacity = useTransform(progress, [0.55, 0.78, 1], [0, 0.94, 1])
  const sceneCoverOpacity = useTransform(sceneOpacity, (value) => 1 - value)
  const titleOpacity = useTransform(progress, [0.66, 0.86], [0, 1])
  const kickerOpacity = useTransform(progress, [0.62, 0.78], [0, 1])
  const bodyOpacity = useTransform(progress, [0.76, 0.92], [0, 1])
  const cueOpacity = useTransform(progress, [0, 0.16, 0.48], [0.75, 0.75, 0])
  const glintX = useTransform(progress, [0.42, 0.7], ['-80%', '145%'])
  const glintOpacity = useTransform(progress, [0.38, 0.48, 0.65, 0.74], [0, 0.9, 0.65, 0])

  useEffect(() => {
    if (reduceMotion) return
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
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
    <section ref={heroRef} id="home" className="relative h-screen bg-[var(--bg)] lg:h-[300vh] [@media(pointer:coarse)]:h-screen">
      <div className="relative flex h-screen min-h-[100dvh] flex-col overflow-hidden bg-[var(--bg)] lg:sticky lg:top-0 [@media(pointer:coarse)]:relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[var(--bg)]" />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-10px] z-[1] will-change-transform lg:block [@media(pointer:coarse)]:hidden"
          style={reduceMotion ? undefined : { scale: seaScale, y: seaY }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/sea-backdrop.jpg" alt="" aria-hidden="true" width={1360} height={768} loading="eager" decoding="async" fetchPriority="high" className="h-full w-full object-cover" />
        </motion.div>

        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-[-10px] z-[2] will-change-transform lg:block [@media(pointer:coarse)]:hidden" style={{ x: mistOneX, opacity: mistOpacity }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mist-1.png" alt="" aria-hidden="true" width={1360} height={768} loading="eager" decoding="async" className="h-full w-full object-cover opacity-70 mix-blend-screen" />
        </motion.div>
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-[-10px] z-[3] will-change-transform lg:block [@media(pointer:coarse)]:hidden" style={{ x: mistTwoX, opacity: mistOpacity }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mist-2.png" alt="" aria-hidden="true" width={1360} height={768} loading="eager" decoding="async" className="h-full w-full object-cover opacity-55 mix-blend-screen" />
        </motion.div>
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-y-[-20%] z-[4] hidden w-[32%] -skew-x-12 bg-[linear-gradient(90deg,transparent,rgba(232,217,166,0.22),transparent)] blur-2xl will-change-transform lg:block [@media(pointer:coarse)]:hidden" style={{ x: beamX, opacity: beamOpacity }} />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-10px] z-[5] will-change-transform"
          initial={reduceMotion ? false : { scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          style={reduceMotion ? undefined : { x: pointerX, y: pointerY }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero-scene.png" alt="" aria-hidden="true" width={4096} height={4096} loading="eager" decoding="async" fetchPriority="high" className="h-full w-full object-cover object-[center_60%]" />
        </motion.div>
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[6] hidden bg-[var(--bg)] lg:block [@media(pointer:coarse)]:hidden" style={{ opacity: sceneCoverOpacity }} />
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-y-0 z-[7] hidden w-[24%] bg-[linear-gradient(90deg,transparent,rgba(255,238,181,0.52),transparent)] blur-xl will-change-transform lg:block [@media(pointer:coarse)]:hidden" style={{ x: glintX, opacity: glintOpacity }} />

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-[30%] bg-[linear-gradient(transparent,var(--bg))]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[9] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(2,5,10,0.55)_100%)]" />
        <div aria-hidden="true" className="hero-chart-grid pointer-events-none absolute inset-0 z-10 opacity-40" />

        <div className="relative z-20 flex min-h-screen flex-col">
          <nav className="site-container flex items-center justify-between pt-6 md:pt-8" aria-label="Navigație principală">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="group relative text-sm font-medium text-[var(--text)] md:text-base">
                {link.label}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-[var(--gold)] transition-transform group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <motion.div className="site-container mt-8 opacity-100 lg:opacity-[var(--kicker-opacity)] [@media(pointer:coarse)]:opacity-100" style={{ '--kicker-opacity': kickerOpacity } as CSSProperties}>
            <ChartKicker bearing="01" label="Acasă" coords />
          </motion.div>

          <motion.div className="mt-2 flex w-full max-w-[100vw] justify-center overflow-hidden px-4 opacity-100 lg:opacity-[var(--title-opacity)] [@media(pointer:coarse)]:opacity-100" style={{ '--title-opacity': titleOpacity } as CSSProperties}>
            <h1 className="sr-only">MAST Studio</h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/mast-studio-title.png" alt="MAST Studio" width={5120} height={5120} loading="eager" decoding="async" fetchPriority="high" className="h-auto max-h-[52vh] w-auto max-w-full object-contain mix-blend-screen" />
          </motion.div>

          <motion.div className="site-container mt-auto flex flex-col items-start gap-5 pb-8 opacity-100 sm:flex-row sm:items-end sm:justify-between md:pb-10 lg:opacity-[var(--body-opacity)] [@media(pointer:coarse)]:opacity-100" style={{ '--body-opacity': bodyOpacity } as CSSProperties}>
            <p className="type-body max-w-sm text-sm">Studio de web design. Site-uri livrate în 48 de ore și platforme premium pentru afaceri care știu încotro merg.</p>
            <ContactButton hero />
          </motion.div>
        </div>

        <motion.div aria-hidden="true" className="pointer-events-none absolute bottom-8 left-1/2 z-30 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[var(--text-3)] lg:flex [@media(pointer:coarse)]:hidden" style={{ opacity: cueOpacity }}>
          <span>Derulează</span>
          <span className="h-8 w-px bg-[var(--gold)]" />
        </motion.div>
      </div>
    </section>
  )
}

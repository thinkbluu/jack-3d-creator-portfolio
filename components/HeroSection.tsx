'use client'

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type TargetAndTransition,
} from 'framer-motion'
import { useRef, type CSSProperties } from 'react'
import ContactButton from './ContactButton'
import ChartKicker from './ChartKicker'

type HeroMotionValues = MotionStyle & TargetAndTransition

const navLinks = [
  { label: 'Despre', href: '#about' },
  { label: 'Servicii', href: '#services' },
  { label: 'Escale', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const motes = [
  { left: '24%', top: '34%', size: 3, duration: '8s', delay: '-2s', drift: '6px' },
  { left: '32%', top: '62%', size: 4, duration: '11s', delay: '-7s', drift: '-5px' },
  { left: '41%', top: '27%', size: 3, duration: '9s', delay: '-4s', drift: '4px' },
  { left: '47%', top: '71%', size: 3, duration: '12s', delay: '-9s', drift: '-6px' },
  { left: '55%', top: '38%', size: 4, duration: '7s', delay: '-3s', drift: '5px' },
  { left: '61%', top: '58%', size: 3, duration: '10s', delay: '-6s', drift: '-4px' },
  { left: '68%', top: '30%', size: 3, duration: '9.5s', delay: '-8s', drift: '6px' },
  { left: '75%', top: '67%', size: 4, duration: '11.5s', delay: '-5s', drift: '-5px' },
]

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30 })

  const seaX = useTransform(progress, [0, 1], ['0%', '-2%'])
  const portalRadius = useTransform(progress, [0, 0.14, 0.24, 0.45, 0.55, 1], [0, 0, 8, 70, 90, 90])
  const portalRadiusB = useTransform(progress, [0, 0.24, 0.34, 0.55, 0.65, 1], [0, 0, 8, 70, 90, 90])
  const portalMask = useMotionTemplate`radial-gradient(circle at 50% 44%, transparent ${portalRadius}vw, black calc(${portalRadius}vw + 28vw))`
  const portalMaskB = useMotionTemplate`radial-gradient(circle at 50% 44%, transparent ${portalRadiusB}vw, black calc(${portalRadiusB}vw + 28vw))`
  const rimBackground = useMotionTemplate`radial-gradient(circle at 50% 44%, transparent calc(${portalRadius}vw - 6vw), rgba(232,217,166,0.22) ${portalRadius}vw, transparent calc(${portalRadius}vw + 10vw))`
  const rimOpacity = useTransform(progress, [0, 0.139, 0.14, 0.55, 0.68], [0, 0, 0.9, 0.9, 0])

  const veilAScale = useTransform(progress, [0, 0.08, 0.14, 0.55], [1.15, 1.18, 1.15, 1.15])
  const veilAX = useTransform(progress, [0.14, 0.55], ['0%', '-4%'])
  const veilAY = useTransform(progress, [0.14, 0.55], ['0%', '-2%'])
  const veilBX = useTransform(progress, [0.24, 0.65], ['0%', '5%'])
  const veilBY = useTransform(progress, [0.24, 0.65], ['0%', '2%'])
  const fogOpacity = useTransform(progress, [0.55, 0.75], [1, 0])
  const veilBOpacity = useTransform(progress, [0, 0.65, 0.8], [0.8, 0.8, 0])

  const lockupScale = useTransform(progress, [0, 0.14, 0.55], [0.92, 0.92, 1])
  const lockupOpacity = useTransform(progress, [0, 0.14, 0.55], [0.9, 0.9, 1])
  const lockupBlur = useTransform(progress, [0.14, 0.55], [8, 0])
  const lockupFilter = useMotionTemplate`blur(${lockupBlur}px)`
  const glowOpacity = useTransform(progress, [0, 0.08, 0.105, 0.14, 0.2], [0, 0.35, 0.75, 0.5, 0.4])
  const glowScale = useTransform(progress, [0, 0.14, 0.55], [1, 1, 1.6])

  const shinePosition = useTransform(progress, [0.5, 0.72], [-30, 130])
  const shineOpacity = useTransform(progress, [0, 0.499, 0.5, 0.72, 0.721, 1], [0, 0, 1, 1, 0, 0])
  const shineMask = useMotionTemplate`linear-gradient(115deg, transparent calc(${shinePosition}% - 10%), black ${shinePosition}%, transparent calc(${shinePosition}% + 10%))`
  const reflectionOpacity = useTransform(progress, [0, 0.55, 0.75], [0, 0, 1])
  const dustOpacity = useTransform(progress, [0, 0.58, 0.75], [0, 0, 1])

  const kickerOpacity = useTransform(progress, [0.75, 0.83], [0, 1])
  const kickerY = useTransform(progress, [0.75, 0.83], ['110%', '0%'])
  const paragraphOpacity = useTransform(progress, [0.8, 0.9], [0, 1])
  const paragraphY = useTransform(progress, [0.8, 0.9], ['110%', '0%'])
  const ctaOpacity = useTransform(progress, [0.86, 0.96], [0, 1])
  const ctaY = useTransform(progress, [0.86, 0.96], ['110%', '0%'])
  const cueOpacity = useTransform(progress, [0, 0.1], [1, 0])

  const staticFrame = reduceMotion
  const mobileEase = [0.22, 1, 0.36, 1] as const

  return (
    <section ref={heroRef} id="home" className="relative h-screen bg-[var(--bg)] lg:h-[300vh] [@media(pointer:coarse)]:h-screen">
      <div className="relative flex h-screen min-h-[100dvh] flex-col overflow-hidden bg-[var(--bg)] lg:sticky lg:top-0 [@media(pointer:coarse)]:relative">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-[var(--bg)]" />

        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[102%] will-change-transform" style={staticFrame ? undefined : { x: seaX }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/sea-backdrop.jpg" alt="" width={1360} height={768} loading="eager" decoding="async" fetchPriority="high" className="h-full w-full object-cover" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[44%] z-[2] h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,217,166,0.10)_0%,transparent_60%)] blur-[40px] mix-blend-screen opacity-[var(--mobile-glow-opacity)] lg:opacity-[var(--glow-opacity)] lg:scale-[var(--glow-scale)] [@media(pointer:coarse)]:opacity-[var(--mobile-glow-opacity)] [@media(pointer:coarse)]:scale-100"
          initial={staticFrame ? false : { '--mobile-glow-opacity': 0 } as unknown as HeroMotionValues}
          animate={staticFrame ? undefined : { '--mobile-glow-opacity': [0, 0.6, 0.6] } as unknown as HeroMotionValues}
          transition={{ duration: 1.6, times: [0, 0.375, 1], ease: 'easeOut' }}
          style={staticFrame ? undefined : ({ '--glow-opacity': glowOpacity, '--glow-scale': glowScale } as unknown as HeroMotionValues)}
        />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-[58%] z-[2] mx-auto h-[34vh] w-[26vw] min-w-28 bg-[linear-gradient(180deg,rgba(232,217,166,0.14),rgba(232,217,166,0.03)_70%,transparent)] blur-[10px] [clip-path:polygon(0_0,100%_0,91%_100%,9%_100%)] mix-blend-screen opacity-[var(--mobile-reflection-opacity)] lg:opacity-[var(--reflection-opacity)] [@media(pointer:coarse)]:opacity-[var(--mobile-reflection-opacity)]"
          initial={staticFrame ? false : { '--mobile-reflection-opacity': 0 } as unknown as HeroMotionValues}
          animate={staticFrame ? undefined : { '--mobile-reflection-opacity': 1 } as unknown as HeroMotionValues}
          transition={{ delay: 1.6, duration: 0.8, ease: 'easeOut' }}
          style={staticFrame ? { opacity: 1 } : ({ '--reflection-opacity': reflectionOpacity } as unknown as HeroMotionValues)}
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
          className="relative z-[3] flex min-h-screen flex-col pt-16 opacity-[var(--mobile-lockup-opacity)] scale-[var(--mobile-lockup-scale)] [filter:blur(var(--mobile-lockup-blur))] lg:opacity-[var(--lockup-opacity)] lg:scale-[var(--lockup-scale)] lg:[filter:var(--lockup-filter)] [@media(pointer:coarse)]:opacity-[var(--mobile-lockup-opacity)] [@media(pointer:coarse)]:scale-[var(--mobile-lockup-scale)] [@media(pointer:coarse)]:[filter:blur(var(--mobile-lockup-blur))] md:pt-20"
          initial={staticFrame ? false : { '--mobile-lockup-opacity': 0, '--mobile-lockup-scale': 0.94, '--mobile-lockup-blur': '6px' } as unknown as HeroMotionValues}
          animate={staticFrame ? undefined : { '--mobile-lockup-opacity': 1, '--mobile-lockup-scale': 1, '--mobile-lockup-blur': '0px' } as unknown as HeroMotionValues}
          transition={{ delay: 1, duration: 0.9, ease: mobileEase }}
          style={staticFrame ? undefined : ({ '--lockup-opacity': lockupOpacity, '--lockup-filter': lockupFilter, '--lockup-scale': lockupScale } as unknown as HeroMotionValues)}
        >
          <div className="site-container mt-8 overflow-hidden">
            <motion.div
              className="translate-y-[var(--mobile-kicker-y)] opacity-[var(--mobile-kicker-opacity)] lg:translate-y-[var(--kicker-y)] lg:opacity-[var(--kicker-opacity)] [@media(pointer:coarse)]:translate-y-[var(--mobile-kicker-y)] [@media(pointer:coarse)]:opacity-[var(--mobile-kicker-opacity)]"
              initial={staticFrame ? false : { '--mobile-kicker-opacity': 0, '--mobile-kicker-y': '110%' } as unknown as HeroMotionValues}
              animate={staticFrame ? undefined : { '--mobile-kicker-opacity': 1, '--mobile-kicker-y': '0%' } as unknown as HeroMotionValues}
              transition={{ delay: 1.6, duration: 0.35, ease: mobileEase }}
              style={staticFrame ? undefined : ({ '--kicker-opacity': kickerOpacity, '--kicker-y': kickerY } as unknown as HeroMotionValues)}
            >
              <ChartKicker bearing="01" label="Acasă" coords />
            </motion.div>
          </div>

          <div className="relative mt-2 flex w-full max-w-[100vw] justify-center overflow-hidden px-4">
            <h1 className="sr-only">MAST Studio</h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/mast-studio-title.png" alt="MAST Studio" width={5120} height={5120} loading="eager" decoding="async" fetchPriority="high" className="h-auto max-h-[52vh] w-auto max-w-full object-contain mix-blend-screen" />
            <motion.img
              aria-hidden="true"
              src="/images/mast-studio-title.png"
              alt=""
              width={5120}
              height={5120}
              className="pointer-events-none absolute inset-0 m-auto h-auto max-h-[52vh] w-auto max-w-[calc(100%-2rem)] object-contain mix-blend-screen [filter:brightness(1.9)_saturate(1.15)]"
              style={staticFrame ? { opacity: 0 } : { opacity: shineOpacity, maskImage: shineMask, WebkitMaskImage: shineMask }}
            />
          </div>

          <div className="site-container mt-auto flex flex-col items-start gap-5 pb-8 sm:flex-row sm:items-end sm:justify-between md:pb-10">
            <div className="overflow-hidden">
              <motion.p
                className="type-body max-w-sm translate-y-[var(--mobile-paragraph-y)] text-sm opacity-[var(--mobile-paragraph-opacity)] lg:translate-y-[var(--paragraph-y)] lg:opacity-[var(--paragraph-opacity)] [@media(pointer:coarse)]:translate-y-[var(--mobile-paragraph-y)] [@media(pointer:coarse)]:opacity-[var(--mobile-paragraph-opacity)]"
                initial={staticFrame ? false : { '--mobile-paragraph-opacity': 0, '--mobile-paragraph-y': '110%' } as unknown as HeroMotionValues}
                animate={staticFrame ? undefined : { '--mobile-paragraph-opacity': 1, '--mobile-paragraph-y': '0%' } as unknown as HeroMotionValues}
                transition={{ delay: 1.85, duration: 0.35, ease: mobileEase }}
                style={staticFrame ? undefined : ({ '--paragraph-opacity': paragraphOpacity, '--paragraph-y': paragraphY } as unknown as HeroMotionValues)}
              >
                Studio de web design. Site-uri livrate în 48 de ore și platforme premium pentru afaceri care știu încotro merg.
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.div
                className="translate-y-[var(--mobile-cta-y)] opacity-[var(--mobile-cta-opacity)] lg:translate-y-[var(--cta-y)] lg:opacity-[var(--cta-opacity)] [@media(pointer:coarse)]:translate-y-[var(--mobile-cta-y)] [@media(pointer:coarse)]:opacity-[var(--mobile-cta-opacity)]"
                initial={staticFrame ? false : { '--mobile-cta-opacity': 0, '--mobile-cta-y': '110%' } as unknown as HeroMotionValues}
                animate={staticFrame ? undefined : { '--mobile-cta-opacity': 1, '--mobile-cta-y': '0%' } as unknown as HeroMotionValues}
                transition={{ delay: 2.05, duration: 0.35, ease: mobileEase }}
                style={staticFrame ? undefined : ({ '--cta-opacity': ctaOpacity, '--cta-y': ctaY } as unknown as HeroMotionValues)}
              >
                <ContactButton hero />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[4] hidden origin-center will-change-transform lg:block [@media(pointer:coarse)]:hidden" style={{ x: veilAX, y: veilAY, scale: veilAScale, opacity: fogOpacity, maskImage: portalMask, WebkitMaskImage: portalMask }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mist-veil-1.png" alt="" width={1360} height={768} loading="eager" decoding="async" className="h-full w-full object-cover mix-blend-screen" />
        </motion.div>
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] hidden scale-[1.3] will-change-transform lg:block [@media(pointer:coarse)]:hidden" style={{ x: veilBX, y: veilBY, opacity: veilBOpacity, maskImage: portalMaskB, WebkitMaskImage: portalMaskB }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mist-veil-2.png" alt="" width={1360} height={768} loading="eager" decoding="async" className="h-full w-full object-cover mix-blend-screen" />
        </motion.div>

        {!staticFrame && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] lg:hidden [@media(pointer:coarse)]:block">
            <motion.img src="/images/mist-veil-1.png" alt="" className="absolute inset-0 h-full w-full object-cover mix-blend-screen" initial={{ opacity: 1, scale: 1.15 }} animate={{ opacity: [1, 1, 0], scale: [1.15, 1.15, 1.3] }} transition={{ duration: 1.6, times: [0, 0.375, 1], ease: 'easeOut' }} />
            <motion.img src="/images/mist-veil-2.png" alt="" className="absolute inset-0 h-full w-full object-cover mix-blend-screen" initial={{ opacity: 1, scale: 1.15 }} animate={{ opacity: [1, 1, 0], scale: [1.15, 1.15, 1.3] }} transition={{ duration: 1.6, times: [0, 0.375, 1], ease: 'easeOut' }} />
          </div>
        )}

        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[6] hidden blur-[14px] mix-blend-screen lg:block [@media(pointer:coarse)]:hidden" style={{ background: rimBackground, opacity: rimOpacity }} />

        {!staticFrame && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[6] opacity-[var(--mobile-dust-opacity)] lg:opacity-[var(--dust-opacity)] [@media(pointer:coarse)]:opacity-[var(--mobile-dust-opacity)]"
            initial={{ '--mobile-dust-opacity': 0 } as unknown as HeroMotionValues}
            animate={{ '--mobile-dust-opacity': 1 } as unknown as HeroMotionValues}
            transition={{ delay: 1.6, duration: 0.8, ease: 'easeOut' }}
            style={{ '--dust-opacity': dustOpacity } as unknown as HeroMotionValues}
          >
            {motes.map((mote, index) => (
              <span
                key={index}
                className="hero-gold-mote absolute rounded-full bg-[rgba(232,217,166,0.7)] blur-[1px]"
                style={{ left: mote.left, top: mote.top, width: mote.size, height: mote.size, animationDuration: mote.duration, animationDelay: mote.delay, '--mote-drift': mote.drift } as CSSProperties}
              />
            ))}
          </motion.div>
        )}

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[30%] bg-[linear-gradient(transparent,var(--bg))]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[7] bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(2,5,10,0.55)_100%)]" />
        <div aria-hidden="true" className="hero-chart-grid pointer-events-none absolute inset-0 z-[8] opacity-40" />

        <motion.div aria-hidden="true" className="pointer-events-none absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[var(--text)] lg:flex [@media(pointer:coarse)]:hidden" style={{ opacity: cueOpacity }}>
          <span>urmează lumina</span>
          <span className="h-8 w-px bg-[var(--gold)]" />
        </motion.div>
      </div>
    </section>
  )
}

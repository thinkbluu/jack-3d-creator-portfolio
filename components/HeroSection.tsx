'use client'

import { motion, useInView, useMotionTemplate, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import AmbientVideo from './AmbientVideo'
import ChartKicker from './ChartKicker'
import ContactButton from './ContactButton'

const navLinks = [
  { label: 'Despre', href: '#about' },
  { label: 'Servicii', href: '#services' },
  { label: 'Escale', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

const goldMotes = [
  { left: '28%', top: '34%', size: 3, duration: '8s', delay: '-2s', drift: '-6px' },
  { left: '38%', top: '62%', size: 4, duration: '11s', delay: '-7s', drift: '5px' },
  { left: '46%', top: '29%', size: 3, duration: '9s', delay: '-4s', drift: '-4px' },
  { left: '53%', top: '56%', size: 4, duration: '12s', delay: '-9s', drift: '6px' },
  { left: '61%', top: '38%', size: 3, duration: '7s', delay: '-3s', drift: '4px' },
  { left: '67%', top: '66%', size: 4, duration: '10s', delay: '-6s', drift: '-5px' },
  { left: '34%', top: '47%', size: 3, duration: '12s', delay: '-10s', drift: '6px' },
  { left: '58%', top: '73%', size: 3, duration: '9s', delay: '-5s', drift: '-6px' },
]

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const heroInView = useInView(heroRef, { amount: 0.05 })
  const [arrivalComplete, setArrivalComplete] = useState(false)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setArrivalComplete((current) => {
      const next = progress > 0.98
      return current === next ? current : next
    })
  })

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
  const haloOpacity = useTransform(scrollYProgress, [0.4, 0.62, 0.66, 0.72], [0.1, 0.13, 0.13, 0])
  const beaconFade = useTransform(scrollYProgress, [0.66, 0.72], [1, 0])
  const beaconResolvedOpacity = useTransform([beaconOpacity, beaconFade], ([visible, fading]) => Number(visible) * Number(fading))
  const bloomOpacity = useTransform(scrollYProgress, [0, 0.62, 0.7, 0.8], [0, 0, 0.85, 0.3])
  const lockupOpacity = useTransform(scrollYProgress, [0.66, 0.8], [0, 1])
  const lockupScale = useTransform(scrollYProgress, [0.66, 0.8], [0.94, 1])
  const lockupBlur = useTransform(scrollYProgress, [0.66, 0.8], [8, 0])
  const lockupFilter = useMotionTemplate`blur(${lockupBlur}px)`
  const sweepOpacity = useTransform(scrollYProgress, [0.7, 0.72, 0.84, 0.88], [0, 1, 1, 0])
  const sweepPosition = useTransform(scrollYProgress, [0.72, 0.88], [-30, 130])
  const sweepMaskPosition = useMotionTemplate`${sweepPosition}% 0%`
  const reflectionOpacity = useTransform(scrollYProgress, [0.78, 0.9], [0, 1])
  const dustOpacity = useTransform(scrollYProgress, [0, 0.72, 0.85], [0, 0, 1])
  const kickerOpacity = useTransform(scrollYProgress, [0.82, 0.88], [0, 1])
  const kickerY = useTransform(scrollYProgress, [0.82, 0.88], ['110%', '0%'])
  const paragraphOpacity = useTransform(scrollYProgress, [0.86, 0.93], [0, 1])
  const paragraphY = useTransform(scrollYProgress, [0.86, 0.93], ['110%', '0%'])
  const ctaOpacity = useTransform(scrollYProgress, [0.9, 0.98], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.9, 0.98], ['110%', '0%'])
  const approachVignetteOpacity = useTransform(scrollYProgress, [0.4, 0.62], [0, 0.45])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06, 0.1], [1, 1, 0])
  const bowOpacity = useTransform(scrollYProgress, [0, 0.15, 0.35, 0.62, 1], [0, 0, 1, 1, 0.85])
  const bowScale = useTransform(scrollYProgress, [0.4, 0.62], [1, 1.06])
  const bowY = useTransform(scrollYProgress, [0.4, 0.62], [0, -8])
  const bowRollTarget = useMotionValue(0)
  const bowRoll = useSpring(bowRollTarget, { stiffness: 40, damping: 14 })
  const idleLife = !reduceMotion && heroInView && arrivalComplete
  const bowIdleLife = !reduceMotion && heroInView

  function handleStagePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    bowRollTarget.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1)
  }

  function handleStagePointerLeave() {
    bowRollTarget.set(0)
  }

  const panelMaskLeft = 'linear-gradient(to right, black 0%, black 92%, transparent 100%)'
  const panelMaskRight = 'linear-gradient(to left, black 0%, black 92%, transparent 100%)'

  return (
    <section ref={heroRef} id="home" className="relative h-[320vh] bg-[var(--bg)]">
      <div
        className="sticky top-0 h-screen min-h-[100dvh] overflow-hidden bg-[var(--bg)]"
        onPointerMove={handleStagePointerMove}
        onPointerLeave={handleStagePointerLeave}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 will-change-transform"
          style={reduceMotion ? { scale: 1.08 } : { scale: seaScale, y: seaY }}
        >
          <AmbientVideo src="/images/sea-loop.mp4" poster="/images/sea-backdrop.jpg" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[56%] z-[2] h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[30px] mix-blend-screen"
          style={{ opacity: reduceMotion ? 0.3 : bloomOpacity }}
        >
          <div className={`${idleLife ? 'hero-bloom-idle ' : ''}h-full w-full rounded-full bg-[radial-gradient(circle,rgba(245,235,200,0.9)_0%,rgba(232,217,166,0.35)_35%,transparent_70%)]`} />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[56%] z-[2] h-0 w-0 -translate-x-1/2 -translate-y-1/2 mix-blend-screen will-change-transform"
          style={reduceMotion ? { opacity: 0, scale: 1 } : { opacity: beaconResolvedOpacity, scale: beaconScale }}
        >
          <motion.div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,217,166,0.10),transparent_70%)] blur-3xl" style={reduceMotion ? { opacity: 0.13 } : { opacity: haloOpacity }} />
          <div className="absolute left-1/2 top-1/2 h-[60px] w-[60px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,217,166,0.35),transparent_70%)] blur-lg" />
          <div className="absolute left-1/2 top-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,235,200,0.95),transparent_72%)] blur-[2px]" />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[58vh] z-[2] h-[34vh] w-[26vw] min-w-28 -translate-x-1/2 blur-[10px] [clip-path:polygon(0_0,100%_0,82%_100%,18%_100%)] mix-blend-screen"
          data-reflection-path="true"
          style={{ opacity: reduceMotion ? 1 : reflectionOpacity }}
        >
          <div className={`${idleLife ? 'hero-reflection-idle ' : ''}h-full w-full bg-[linear-gradient(180deg,rgba(232,217,166,0.14),rgba(232,217,166,0.03)_70%,transparent)]`} />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-1/2 z-[3] w-[clamp(320px,44vw,780px)] origin-bottom will-change-transform"
          style={reduceMotion ? { x: '-50%', opacity: 0.85, scale: 1, y: 0 } : { x: '-50%', opacity: bowOpacity, scale: bowScale, y: bowY }}
        >
          <motion.div style={reduceMotion ? { rotate: 0 } : { rotate: bowRoll }}>
            <motion.div
              animate={bowIdleLife ? { rotate: [-0.6, 0.6], y: [0, 6] } : { rotate: 0, y: 0 }}
              transition={bowIdleLife ? { duration: 7, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY, repeatType: 'mirror' } : { duration: 0.35, ease: 'easeOut' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/bow.png" alt="" width={1600} height={659} className="h-auto w-full" />
            </motion.div>
          </motion.div>
        </motion.div>

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
        {!reduceMotion && (
          <motion.div aria-hidden="true" data-gold-dust="true" className="pointer-events-none absolute inset-0 z-[9]" style={{ opacity: dustOpacity }}>
            {goldMotes.map((mote, index) => (
              <span
                key={index}
                className="hero-gold-mote absolute rounded-full bg-[rgba(232,217,166,0.7)] blur-[1px]"
                style={{ left: mote.left, top: mote.top, width: mote.size, height: mote.size, animationDuration: mote.duration, animationDelay: mote.delay, '--mote-drift': mote.drift } as CSSProperties}
              />
            ))}
          </motion.div>
        )}

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
            <motion.div style={reduceMotion ? { opacity: 1, y: '0%' } : { opacity: kickerOpacity, y: kickerY }}>
              <ChartKicker bearing="01" label="Acasă" coords />
            </motion.div>
          </div>

          <motion.div
            className="relative mt-2 flex w-full max-w-[100vw] justify-center overflow-hidden px-4"
            style={reduceMotion ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: lockupOpacity, scale: lockupScale, filter: lockupFilter }}
          >
            <h1 className="sr-only">MAST Studio</h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/mast-studio-title.png" alt="MAST Studio" width={5120} height={5120} loading="eager" decoding="async" fetchPriority="high" className="h-auto max-h-[52vh] w-auto max-w-full object-contain mix-blend-screen" />
            {!reduceMotion && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex justify-center px-4"
                style={{ opacity: sweepOpacity, maskImage: 'linear-gradient(115deg, transparent 40%, black 50%, transparent 60%)', WebkitMaskImage: 'linear-gradient(115deg, transparent 40%, black 50%, transparent 60%)', maskSize: '40% 100%', WebkitMaskSize: '40% 100%', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: sweepMaskPosition, WebkitMaskPosition: sweepMaskPosition }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/mast-studio-title.png" alt="" width={5120} height={5120} className="h-auto max-h-[52vh] w-auto max-w-full object-contain mix-blend-screen brightness-[1.9] saturate-[1.15]" />
              </motion.div>
            )}
          </motion.div>

          <div className="site-container mt-auto flex flex-col items-start gap-5 pb-8 sm:flex-row sm:items-end sm:justify-between md:pb-10">
            <div className="overflow-hidden">
              <motion.p className="type-body max-w-sm text-sm" style={reduceMotion ? { opacity: 1, y: '0%' } : { opacity: paragraphOpacity, y: paragraphY }}>
                Studio de web design. Site-uri livrate în 48 de ore și platforme premium pentru afaceri care știu încotro merg.
              </motion.p>
            </div>
            <div className="overflow-hidden">
              <motion.div style={reduceMotion ? { opacity: 1, y: '0%' } : { opacity: ctaOpacity, y: ctaY }}><ContactButton hero /></motion.div>
            </div>
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

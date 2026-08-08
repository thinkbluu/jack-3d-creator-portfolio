'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { Building2, Check, Layers3, Scissors, ShoppingCart } from 'lucide-react'
import ContactButton from './ContactButton'
import ScrubStage from './ScrubStage'
import { useSegment, type Segment } from './SegmentContext'

const clips = [
  { src: '/images/hero-01-exit.mp4', poster: '/images/hero-poster.jpg' },
  { src: '/images/hero-02-arrival.mp4', poster: '/images/harbor-final.jpg' },
]

const options: Array<{ id: Segment; eyebrow: string; title: string; icon: typeof Scissors }> = [
  { id: 'salon', eyebrow: 'Programări', title: 'Am un salon', icon: Scissors },
  { id: 'servicii', eyebrow: 'Cereri', title: 'Ofer servicii', icon: Building2 },
  { id: 'ecommerce', eyebrow: 'Vânzări', title: 'Vând produse', icon: ShoppingCart },
  { id: 'platforma', eyebrow: 'Produs digital', title: 'Construiesc o platformă', icon: Layers3 },
]

const subheads: Record<Segment | 'default', string> = {
  default: 'Spune-ne ce construiești. Îți arătăm drumul cel mai scurt spre un site care produce rezultate.',
  salon: 'Transformăm atenția în programări, cu o experiență clară și rapidă pentru clienții salonului tău.',
  servicii: 'Punem valoarea serviciilor tale în cuvinte și pagini care inspiră încredere și generează cereri.',
  ecommerce: 'Un magazin online care convertește: catalog, plăți, comenzi și facturare, fără abandon de coș.',
  platforma: 'Clarificăm produsul, fluxurile și tehnologia pentru o platformă pregătită să crească.',
}

const stats: Array<{ value: string; label: string }> = [
  { value: '48h', label: 'de la conținut la site live' },
  { value: '300€', label: 'site de prezentare de la' },
]

const EASE = [0.22, 1, 0.36, 1] as const

// Three depth tiers of dust. Parallax lives on the tier wrapper, the slow upward
// drift lives on each dot, so the two transforms never fight each other.
const dustTiers: Array<{
  shift: number
  size: number
  opacity: number
  blur: number
  dots: Array<{ left: string; top: string; duration: string; delay: string }>
}> = [
  {
    shift: 20,
    size: 4,
    opacity: 0.55,
    blur: 0,
    dots: [
      { left: '18%', top: '68%', duration: '9s', delay: '0s' },
      { left: '63%', top: '38%', duration: '11s', delay: '1.4s' },
      { left: '81%', top: '74%', duration: '10s', delay: '2.8s' },
      { left: '41%', top: '86%', duration: '12s', delay: '4.1s' },
    ],
  },
  {
    shift: 12,
    size: 3,
    opacity: 0.35,
    blur: 0,
    dots: [
      { left: '29%', top: '24%', duration: '13s', delay: '0.6s' },
      { left: '72%', top: '57%', duration: '14s', delay: '2.2s' },
      { left: '54%', top: '17%', duration: '12s', delay: '3.5s' },
      { left: '88%', top: '46%', duration: '15s', delay: '5s' },
    ],
  },
  {
    shift: 4,
    size: 2,
    opacity: 0.2,
    blur: 1,
    dots: [
      { left: '11%', top: '41%', duration: '15s', delay: '1s' },
      { left: '47%', top: '61%', duration: '16s', delay: '2.6s' },
      { left: '68%', top: '86%', duration: '14s', delay: '4.4s' },
      { left: '93%', top: '29%', duration: '16s', delay: '6s' },
    ],
  },
]

// Minimal line-art mast glyph — mast, yard arm, and a single sail — drawn
// inline so the title card has no dependency on a separate SVG asset file.
function MastMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="50" y1="8" x2="50" y2="92" />
      <line x1="30" y1="92" x2="70" y2="92" />
      <line x1="50" y1="18" x2="80" y2="24" />
      <path d="M50 18 L50 46 L21 46 Z" />
    </svg>
  )
}

function MirrorCard({ option, selected, onSelect }: { option: (typeof options)[number]; selected: boolean; onSelect: () => void }) {
  const Icon = option.icon
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex min-h-24 flex-col justify-between gap-2 rounded-[12px] border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] ${selected ? 'border-[var(--brass)] bg-[var(--brass)] text-[var(--shell)]' : 'border-[var(--glass-edge)] bg-[rgba(245,241,232,0.05)] text-[var(--ink)] hover:border-[var(--glass-edge)]'}`}
    >
      <span className={`flex size-8 items-center justify-center rounded-[8px] border ${selected ? 'border-[var(--shell)]/30' : 'border-[var(--glass-edge)] text-[var(--brass)]'}`}>
        {selected ? <Check aria-hidden="true" size={16} /> : <Icon aria-hidden="true" size={16} />}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className={`text-[9px] uppercase tracking-[0.2em] ${selected ? 'text-[var(--shell)]/70' : 'text-[var(--brass)]'}`}>{option.eyebrow}</span>
        <span className="text-sm font-semibold leading-tight">{option.title}</span>
      </span>
    </button>
  )
}

export default function CinematicHero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { segment, setSegment } = useSegment()
  const [cinematic, setCinematic] = useState(false)
  const [depth, setDepth] = useState(false)

  // SSR-safe: render the static variant first, upgrade only when the device allows it.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
    const narrow = window.innerWidth < 1024
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (!reduceMotion && !touch && !narrow && !connection?.saveData) setCinematic(true)
  }, [])

  // Depth interaction is desktop-with-a-real-cursor only, and never under reduced motion.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const capable = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine)').matches
    if (!reduceMotion && capable) setDepth(true)
  }, [])

  // Raw pointer position, normalized to -0.5..0.5. Written imperatively so the
  // pointer path never touches React state.
  const pointerXRaw = useMotionValue(0)
  const pointerYRaw = useMotionValue(0)
  const pointerX = useSpring(pointerXRaw, { stiffness: 50, damping: 20 })
  const pointerY = useSpring(pointerYRaw, { stiffness: 50, damping: 20 })

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      pointerXRaw.set((event.clientX - rect.left) / rect.width - 0.5)
      pointerYRaw.set((event.clientY - rect.top) / rect.height - 0.5)
    },
    [pointerXRaw, pointerYRaw],
  )

  const handlePointerLeave = useCallback(() => {
    pointerXRaw.set(0)
    pointerYRaw.set(0)
  }, [pointerXRaw, pointerYRaw])

  // Panel tilt, with a shadow that swings opposite to the tilt.
  const panelRotateY = useTransform(pointerX, [-0.5, 0.5], [-8, 8])
  const panelRotateX = useTransform(pointerY, [-0.5, 0.5], [8, -8])
  const shadowX = useTransform(pointerX, [-0.5, 0.5], [26, -26])
  const shadowY = useTransform(pointerY, [-0.5, 0.5], [26, -26])
  const panelShadow = useMotionTemplate`${shadowX}px ${shadowY}px 64px rgba(2, 5, 10, 0.42), inset 0 1px 0 rgba(245, 241, 232, 0.08)`

  // Layered parallax inside the panel: nearer copy travels further.
  const headingX = useTransform(pointerX, [-0.5, 0.5], [-10, 10])
  const headingY = useTransform(pointerY, [-0.5, 0.5], [-10, 10])
  const subheadX = useTransform(pointerX, [-0.5, 0.5], [-6, 6])
  const subheadY = useTransform(pointerY, [-0.5, 0.5], [-6, 6])
  const cardsX = useTransform(pointerX, [-0.5, 0.5], [-4, 4])
  const cardsY = useTransform(pointerY, [-0.5, 0.5], [-4, 4])
  const statsX = useTransform(pointerX, [-0.5, 0.5], [-2, 2])
  const statsY = useTransform(pointerY, [-0.5, 0.5], [-2, 2])

  // One parallax pair per dust tier, near to far.
  const nearDustX = useTransform(pointerX, [-0.5, 0.5], [-20, 20])
  const nearDustY = useTransform(pointerY, [-0.5, 0.5], [-20, 20])
  const midDustX = useTransform(pointerX, [-0.5, 0.5], [-12, 12])
  const midDustY = useTransform(pointerY, [-0.5, 0.5], [-12, 12])
  const farDustX = useTransform(pointerX, [-0.5, 0.5], [-4, 4])
  const farDustY = useTransform(pointerY, [-0.5, 0.5], [-4, 4])
  const dustMotion = [
    { x: nearDustX, y: nearDustY },
    { x: midDustX, y: midDustY },
    { x: farDustX, y: farDustY },
  ]

  // Vignette hotspot follows the cursor at ±6%.
  const vignetteX = useTransform(pointerX, [-0.5, 0.5], ['-6%', '6%'])
  const vignetteY = useTransform(pointerY, [-0.5, 0.5], ['-6%', '6%'])
  const vignette =
    useMotionTemplate`radial-gradient(circle at calc(50% + ${vignetteX}) calc(50% + ${vignetteY}), transparent 45%, rgba(26, 23, 20, 0.18) 100%)`

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.0005 })

  const tint = useTransform(progress, [0, 0.35, 0.5, 0.75, 1], [0.1, 0.1, 0, 0.18, 0.18])
  const tintBackground = useMotionTemplate`rgba(250, 247, 242, ${tint})`
  // Panel stays hidden and non-interactive through the title-card beat, then
  // lifts in once for the rest of the scrub — no more early show/mid-hide.
  const panelOpacity = useTransform(progress, [0, 0.72, 0.85, 1], [0, 0, 1, 1])
  const panelY = useTransform(progress, [0, 0.72, 0.85, 1], [28, 28, 0, 0])
  const panelPointerEvents = useTransform(progress, (value) => (value < 0.72 ? 'none' : 'auto'))
  const cueOpacity = useTransform(progress, [0, 0.06], [1, 0])
  // Title card: in fast, holds, then clears well before the panel begins its reveal.
  const titleOpacity = useTransform(progress, [0, 0.04, 0.14, 0.24], [0, 1, 1, 0])

  const enter = (index: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: index * 0.09, ease: EASE },
  })

  return (
    <section ref={sectionRef} id="home" className={`relative ${cinematic ? 'h-[320vh]' : 'h-screen'}`}>
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          height: '100dvh',
          ...(depth ? { perspective: '1200px', transformStyle: 'preserve-3d' as const } : null),
        }}
        onPointerMove={depth ? handlePointerMove : undefined}
        onPointerLeave={depth ? handlePointerLeave : undefined}
      >
        {cinematic ? (
          <ScrubStage clips={clips} progress={progress} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/images/harbor-final.jpg" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
        )}

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={cinematic ? { background: tintBackground } : { background: 'rgba(250, 247, 242, 0.18)' }}
        />

        {depth && (
          <>
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5]">
              {dustTiers.map((tier, tierIndex) => (
                <motion.div
                  key={tier.shift}
                  className="absolute inset-0"
                  style={{ x: dustMotion[tierIndex].x, y: dustMotion[tierIndex].y }}
                >
                  {tier.dots.map((dot) => (
                    <span
                      key={`${dot.left}-${dot.top}`}
                      className="hero-dust absolute rounded-full bg-[var(--ink)]"
                      style={{
                        left: dot.left,
                        top: dot.top,
                        width: tier.size,
                        height: tier.size,
                        opacity: tier.opacity,
                        ...(tier.blur ? { filter: `blur(${tier.blur}px)` } : null),
                        animationDuration: dot.duration,
                        animationDelay: dot.delay,
                      }}
                    />
                  ))}
                </motion.div>
              ))}
            </div>

            <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[6]" style={{ background: vignette }} />
          </>
        )}

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-[linear-gradient(180deg,rgba(250,247,242,0.82)_0%,transparent_100%)]" />

        <header className="absolute inset-x-0 top-0 z-20">
          <nav aria-label="Navigație principală" className="site-container flex h-20 items-center justify-between">
            <a href="#home" className="flex items-baseline gap-2 text-xl font-extrabold tracking-[0.16em] text-[var(--ink)]">
              MAST <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--brass)]">Studio</span>
            </a>
            <div className="flex items-center gap-5 text-xs uppercase tracking-[0.16em] md:gap-8">
              <a href="#dovada" className="hidden text-[var(--ink-2)] transition-colors hover:text-[var(--ink)] sm:block">Dovada</a>
              <a href="#servicii" className="hidden text-[var(--ink-2)] transition-colors hover:text-[var(--ink)] sm:block">Servicii</a>
              <ContactButton label="Vorbește cu noi" />
            </div>
          </nav>
        </header>

        {cinematic && (
          // Fades in first over the establishing shot, clears well before the
          // panel starts its own reveal — never rendered on the static fallback,
          // where the nav wordmark already carries the brand.
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3"
            style={{ opacity: titleOpacity, textShadow: '0 2px 24px rgba(250, 247, 242, 0.7)' }}
          >
            <span className="text-[var(--brass)]">
              <MastMark size={88} />
            </span>
            <div className="flex flex-col items-center gap-1">
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '34px', color: 'var(--ink)' }}>
                MAST
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: 500,
                  fontSize: '12px',
                  letterSpacing: '.3em',
                  color: 'var(--ink-2)',
                }}
              >
                STUDIO
              </span>
            </div>
          </motion.div>
        )}

        <motion.div
          className="porthole absolute z-10 w-[min(680px,calc(100%-2rem))]"
          style={{
            left: 'clamp(24px, 5vw, 72px)',
            bottom: 'clamp(28px, 6vh, 72px)',
            padding: 'clamp(22px, 2.6vw, 34px)',
            // Extra floor clearance so the stats row never sits on the panel edge.
            paddingBottom: 'clamp(32px, 4vw, 44px)',
            maxHeight: 'calc(100dvh - 7rem)',
            background: 'rgba(250, 247, 242, 0.90)',
            // Column flow lets the stats row claim the leftover height with margin-top:auto.
            display: 'flex',
            flexDirection: 'column',
            opacity: cinematic ? panelOpacity : 1,
            y: cinematic ? panelY : 0,
            // Under the static/reduced-motion fallback there is no scrub progress
            // to gate on, so the panel is simply interactive from the first paint.
            pointerEvents: cinematic ? panelPointerEvents : 'auto',
            ...(depth
              ? {
                  rotateY: panelRotateY,
                  rotateX: panelRotateX,
                  boxShadow: panelShadow,
                  transformStyle: 'preserve-3d' as const,
                }
              : null),
          }}
        >
          <motion.p {...enter(0)} className="kicker">Studio de web design · Timișoara</motion.p>

          <motion.div style={depth ? { x: headingX, y: headingY } : undefined}>
            <motion.h1 {...enter(1)} className="type-display mt-4">
              Site-ul care îți aduce<br />
              <span className="text-[var(--brass)]">clienți.</span>
            </motion.h1>
          </motion.div>

          <motion.div style={depth ? { x: subheadX, y: subheadY } : undefined}>
            <motion.p {...enter(2)} key={segment ?? 'default'} className="type-body mt-4">
              {subheads[segment ?? 'default']}
            </motion.p>
          </motion.div>

          <motion.div style={depth ? { x: cardsX, y: cardsY } : undefined}>
          <motion.div
            {...enter(3)}
            role="group"
            aria-label="Alege tipul afacerii"
            className="mt-5 grid"
            style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}
          >
            {options.map((option) => (
              <MirrorCard
                key={option.id}
                option={option}
                selected={segment === option.id}
                onSelect={() => setSegment(segment === option.id ? null : option.id)}
              />
            ))}
          </motion.div>
          </motion.div>

          <motion.div {...enter(4)} className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <ContactButton hero label={segment ? 'Discută ruta potrivită' : 'Spune-ne ce construiești'} />
            <p className="text-xs leading-relaxed text-[var(--ink-2)]">Răspundem direct pe WhatsApp. Fără formular, fără prezentare de vânzări.</p>
          </motion.div>

          <motion.div style={{ marginTop: 'auto', ...(depth ? { x: statsX, y: statsY } : null) }}>
          <motion.dl {...enter(5)} className="mt-5 flex items-stretch gap-6">
            {stats.map((stat, index) => (
              <div key={stat.value} className={`flex flex-col gap-1 ${index > 0 ? 'border-l border-[var(--glass-edge)] pl-6' : ''}`}>
                <dt className="porthole-stat">{stat.value}</dt>
                <dd className="max-w-36 text-[11px] leading-relaxed text-[var(--ink-2)]">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
          </motion.div>
        </motion.div>

        {cinematic && (
          <motion.div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3" style={{ opacity: cueOpacity }}>
            <span className="scrub-cue-line h-10 w-px" />
            <span className="kicker">Descoperă</span>
          </motion.div>
        )}
      </div>
    </section>
  )
}

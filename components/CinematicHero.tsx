'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionTemplate, useScroll, useSpring, useTransform } from 'framer-motion'
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

function MirrorCard({ option, selected, onSelect }: { option: (typeof options)[number]; selected: boolean; onSelect: () => void }) {
  const Icon = option.icon
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={`flex min-h-24 flex-col justify-between gap-2 rounded-[12px] border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] ${selected ? 'border-[var(--brass)] bg-[var(--brass)] text-[var(--bg)]' : 'border-[var(--glass-edge)] bg-[rgba(245,241,232,0.05)] text-[var(--text)] hover:border-[var(--brass-soft)]'}`}
    >
      <span className={`flex size-8 items-center justify-center rounded-[8px] border ${selected ? 'border-[var(--bg)]/30' : 'border-[var(--glass-edge)] text-[var(--brass)]'}`}>
        {selected ? <Check aria-hidden="true" size={16} /> : <Icon aria-hidden="true" size={16} />}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className={`text-[9px] uppercase tracking-[0.2em] ${selected ? 'text-[var(--bg)]/70' : 'text-[var(--brass)]'}`}>{option.eyebrow}</span>
        <span className="text-sm font-semibold leading-tight">{option.title}</span>
      </span>
    </button>
  )
}

export default function CinematicHero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const { segment, setSegment } = useSegment()
  const [cinematic, setCinematic] = useState(false)

  // SSR-safe: render the static variant first, upgrade only when the device allows it.
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
    const narrow = window.innerWidth < 1024
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (!reduceMotion && !touch && !narrow && !connection?.saveData) setCinematic(true)
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.0005 })

  const tint = useTransform(progress, [0, 0.35, 0.5, 0.75, 1], [0.1, 0.1, 0, 0.18, 0.18])
  const tintBackground = useMotionTemplate`rgba(250, 247, 242, ${tint})`
  const panelOpacity = useTransform(progress, [0, 0.42, 0.55, 0.62, 0.78], [1, 1, 0, 0, 1])
  const panelY = useTransform(progress, [0, 0.42, 0.55, 0.62, 0.78], [0, 0, 40, 40, 0])
  const cueOpacity = useTransform(progress, [0, 0.06], [1, 0])

  const enter = (index: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: index * 0.09, ease: EASE },
  })

  return (
    <section ref={sectionRef} id="home" className={`relative ${cinematic ? 'h-[320vh]' : 'h-screen'}`}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ height: '100dvh' }}>
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

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-[linear-gradient(180deg,rgba(5,10,20,0.62)_0%,transparent_100%)]" />

        <header className="absolute inset-x-0 top-0 z-20">
          <nav aria-label="Navigație principală" className="site-container flex h-20 items-center justify-between">
            <a href="#home" className="flex items-baseline gap-2 text-xl font-extrabold tracking-[0.16em] text-[var(--text)]">
              MAST <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--brass)]">Studio</span>
            </a>
            <div className="flex items-center gap-5 text-xs uppercase tracking-[0.16em] md:gap-8">
              <a href="#dovada" className="hidden text-[var(--text-2)] transition-colors hover:text-[var(--text)] sm:block">Dovada</a>
              <a href="#servicii" className="hidden text-[var(--text-2)] transition-colors hover:text-[var(--text)] sm:block">Servicii</a>
              <ContactButton label="Vorbește cu noi" />
            </div>
          </nav>
        </header>

        <motion.div
          className="porthole absolute z-10 w-[min(680px,calc(100%-2rem))]"
          style={{
            left: 'clamp(24px, 5vw, 72px)',
            bottom: 'clamp(28px, 6vh, 72px)',
            padding: 'clamp(22px, 2.6vw, 34px)',
            maxHeight: 'calc(100dvh - 7rem)',
            opacity: cinematic ? panelOpacity : 1,
            y: cinematic ? panelY : 0,
          }}
        >
          <motion.p {...enter(0)} className="kicker">Studio de web design · Timișoara</motion.p>

          <motion.h1 {...enter(1)} className="type-display mt-4">
            Site-ul care îți aduce<br />
            <span className="text-[var(--brass)]">clienți.</span>
          </motion.h1>

          <motion.p {...enter(2)} key={segment ?? 'default'} className="type-body mt-4">
            {subheads[segment ?? 'default']}
          </motion.p>

          <motion.div
            {...enter(3)}
            role="group"
            aria-label="Alege tipul afacerii"
            className="mt-5 grid gap-2.5"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}
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

          <motion.div {...enter(4)} className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <ContactButton hero label={segment ? 'Discută ruta potrivită' : 'Spune-ne ce construiești'} />
            <p className="text-xs leading-relaxed text-[var(--text-2)]">Răspundem direct pe WhatsApp. Fără formular, fără prezentare de vânzări.</p>
          </motion.div>

          <motion.dl {...enter(5)} className="mt-5 flex items-stretch gap-6">
            {stats.map((stat, index) => (
              <div key={stat.value} className={`flex flex-col gap-1 ${index > 0 ? 'border-l border-[var(--glass-edge)] pl-6' : ''}`}>
                <dt className="porthole-stat">{stat.value}</dt>
                <dd className="max-w-36 text-[11px] leading-relaxed text-[var(--text-2)]">{stat.label}</dd>
              </div>
            ))}
          </motion.dl>
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

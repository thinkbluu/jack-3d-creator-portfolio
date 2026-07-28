'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Building2, Check, Layers3, Scissors, ShoppingCart } from 'lucide-react'
import AmbientVideo from './AmbientVideo'
import ContactButton from './ContactButton'
import { useSegment, type Segment } from './SegmentContext'

const options: Array<{ id: Segment; eyebrow: string; title: string; detail: string; icon: typeof Scissors }> = [
  { id: 'salon', eyebrow: 'Programări', title: 'Am un salon', detail: 'Frizerie, beauty, wellness', icon: Scissors },
  { id: 'servicii', eyebrow: 'Cereri', title: 'Ofer servicii', detail: 'Consultanță, construcții, profesii', icon: Building2 },
  { id: 'ecommerce', eyebrow: 'Vânzări', title: 'Vând produse', detail: 'magazin online, plăți, comenzi', icon: ShoppingCart },
  { id: 'platforma', eyebrow: 'Produs digital', title: 'Construiesc o platformă', detail: 'Portal, marketplace, SaaS', icon: Layers3 },
]

const subheads: Record<Segment | 'default', string> = {
  default: 'Spune-ne ce construiești. Îți arătăm drumul cel mai scurt spre un site care produce rezultate.',
  salon: 'Transformăm atenția în programări, cu o experiență clară și rapidă pentru clienții salonului tău.',
  servicii: 'Punem valoarea serviciilor tale în cuvinte și pagini care inspiră încredere și generează cereri.',
  ecommerce: 'Un magazin online care convertește: catalog, plăți, comenzi și facturare, fără abandon de coș.',
  platforma: 'Clarificăm produsul, fluxurile și tehnologia pentru o platformă pregătită să crească.',
}

export default function HeroSection() {
  const reduceMotion = useReducedMotion()
  const { segment, setSegment } = useSegment()
  const enter = (delay: number) => reduceMotion ? {} : {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as const },
  }

  return (
    <section id="home" className="relative flex min-h-screen min-h-[100dvh] overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div aria-hidden="true" className="absolute inset-0 opacity-30">
        <AmbientVideo src="/images/sea-loop.mp4" poster="/images/sea-backdrop.jpg" forcePoster={Boolean(reduceMotion)} />
      </div>
      <div aria-hidden="true" className="hero-chart-grid pointer-events-none absolute inset-0 z-[1] opacity-30" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_36%,rgba(2,5,10,0.72)_100%)]" />

      <header className="absolute inset-x-0 top-0 z-20">
        <nav aria-label="Navigație principală" className="site-container flex h-20 items-center justify-between">
          <a href="#home" className="flex items-baseline gap-2 font-serif text-xl tracking-[0.16em] text-[var(--text)]">
            MAST <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-[var(--gold)]">Studio</span>
          </a>
          <div className="flex items-center gap-5 text-xs uppercase tracking-[0.16em] md:gap-8">
            <a href="#dovada" className="hidden text-[var(--muted)] transition-colors hover:text-[var(--text)] sm:block">Dovada</a>
            <a href="#servicii" className="hidden text-[var(--muted)] transition-colors hover:text-[var(--text)] sm:block">Servicii</a>
            <ContactButton label="Vorbește cu noi" />
          </div>
        </nav>
      </header>

      <div className="site-container relative z-10 flex w-full flex-col justify-center pb-14 pt-28 md:pb-16 md:pt-32">
        <motion.div {...enter(0)} className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[var(--gold)]">
          <span className="h-px w-10 bg-[var(--gold)]" /> Alegerea ta schimbă ruta
        </motion.div>
        <motion.h1 {...enter(0.08)} className="max-w-5xl font-sans text-[clamp(2.6rem,6.5vw,5.5rem)] font-extrabold leading-[1.04] tracking-[-0.02em] text-balance">
          Site-ul care îți aduce clienți.<br />
          <span className="text-[var(--gold)]">În 48 de ore.</span>
        </motion.h1>
        <motion.div {...enter(0.16)} className="mt-6 min-h-16 max-w-2xl">
          <p key={segment ?? 'default'} className="type-body text-base leading-relaxed text-[var(--muted)] md:text-lg">{subheads[segment ?? 'default']}</p>
        </motion.div>

        <motion.div {...enter(0.24)} role="group" aria-label="Alege tipul afacerii" className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {options.map((option) => {
            const selected = segment === option.id
            const Icon = option.icon
            return (
              <button key={option.id} type="button" aria-pressed={selected} onClick={() => setSegment(selected ? null : option.id)} className={`group flex min-h-28 items-center gap-4 border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)] ${selected ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--bg)]' : 'border-[var(--line)] bg-[var(--surface)]/80 text-[var(--text)] hover:border-[var(--gold)]'}`}>
                <span className={`flex size-11 shrink-0 items-center justify-center border ${selected ? 'border-[var(--bg)]/30' : 'border-[var(--line)] text-[var(--gold)]'}`}>
                  {selected ? <Check aria-hidden="true" size={20} /> : <Icon aria-hidden="true" size={20} />}
                </span>
                <span className="flex flex-col gap-1">
                  <span className={`text-[9px] uppercase tracking-[0.24em] ${selected ? 'text-[var(--bg)]/70' : 'text-[var(--gold)]'}`}>{option.eyebrow}</span>
                  <span className="font-serif text-xl leading-tight">{option.title}</span>
                  <span className={`text-xs ${selected ? 'text-[var(--bg)]/70' : 'text-[var(--muted)]'}`}>{option.detail}</span>
                </span>
              </button>
            )
          })}
        </motion.div>

        <motion.div {...enter(0.34)} className="mt-7 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <ContactButton hero label={segment ? 'Discută ruta potrivită' : 'Spune-ne ce construiești'} />
          <p className="text-xs leading-relaxed text-[var(--muted)]">Răspundem direct pe WhatsApp. Fără formular, fără prezentare de vânzări.</p>
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { useUi } from '@/lib/i18n/context'
import { Kicker, Reveal } from './Reveal'

type Pair = { other: string; before: string; highlight: string; after: string }

/** One statement: what others do gets struck through, then our line rises. */
function Statement({ pair, index }: { pair: Pair; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'center 45%'] })
  const strike = useTransform(scrollYProgress, [0.05, 0.45], [0, 1])
  const fade = useTransform(scrollYProgress, [0.3, 0.6], [1, 0.38])
  const rise = useTransform(scrollYProgress, [0.35, 1], [reduced ? 0 : 60, 0])
  const show = useTransform(scrollYProgress, [0.35, 0.9], [0, 1])

  return (
    <div ref={ref} className="grid gap-6 border-t border-[var(--line)] py-16 md:grid-cols-[5rem_1fr] md:py-24">
      <span className="mono-label text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
      <div>
        <motion.p style={{ opacity: reduced ? 0.5 : fade }} className="relative inline-block text-lg text-[var(--fg-2)] md:text-2xl">
          {pair.other}
          <motion.span
            aria-hidden="true"
            style={{ scaleX: reduced ? 1 : strike }}
            className="absolute left-0 top-1/2 h-[2px] w-full origin-left bg-[var(--brass-lite)]"
          />
        </motion.p>
        <motion.p
          style={reduced ? undefined : { y: rise, opacity: show }}
          className="display-xl mt-6 text-balance text-[clamp(2.6rem,7vw,7rem)]"
        >
          {pair.before}
          <span className="display-italic text-[var(--brass-lite)]">{pair.highlight}</span>
          {pair.after}
        </motion.p>
      </div>
    </div>
  )
}

export default function Manifest() {
  const { manifest } = useUi()
  return (
    <section id="manifest" aria-label={manifest.kicker} className="tone-navy grain relative overflow-hidden py-28 md:py-40">
      <div className="studio-container relative">
        <Kicker index="03" label={manifest.kicker} className="mb-12 text-[var(--fg-3)]" />
        {manifest.pairs.map((pair, index) => (
          <Statement key={pair.highlight} pair={pair} index={index} />
        ))}
        <Reveal>
          <p className="mono-label border-t border-[var(--line)] pt-10 text-[var(--fg-2)]">{manifest.closing}</p>
        </Reveal>
      </div>
    </section>
  )
}

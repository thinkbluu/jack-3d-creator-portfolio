'use client'

import { motion, useReducedMotion } from 'framer-motion'
import ChartKicker from './ChartKicker'
import ChartMarks from './ChartMarks'

const pairs = [
  { other: 'Alții: teme cumpărate, recolorate.', statement: <><span className="text-[var(--gold)]">Zero șabloane.</span> Niciodată.</> },
  { other: 'Alții: cod generic, umflat, lent.', statement: <>Cod <span className="text-[var(--gold)]">propriu</span>, scris pentru afacerea ta.</> },
  { other: 'Alții: luni de așteptare.', statement: <>Live în <span className="text-[var(--gold)]">48 de ore.</span></> },
  { other: 'Alții: avans mare, promisiuni vagi.', statement: <>Restul plătești doar când ești <span className="text-[var(--gold)]">mulțumit.</span></> },
  { other: 'Alții: „merge și așa".', statement: <>PageSpeed 90+, <span className="text-[var(--gold)]">garantat</span> la predare.</> },
]

export default function ManifestSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="manifest" className="section-shell relative bg-[var(--bg)] pt-16 md:pt-24">
      <ChartMarks variant="b" />
      <div className="site-container relative">
        <ChartKicker bearing="03" label="Manifest" />

        <div>
          {pairs.map((pair) => (
            <div
              key={pair.other}
              data-manifest-pair
              className="flex min-h-[24vh] flex-col justify-center py-10 md:py-12"
            >
              <div className="relative mb-5 w-fit max-w-full">
                <p className="text-[clamp(1.05rem,1.9vw,1.5rem)] font-medium leading-relaxed text-[var(--text-2)]">{pair.other}</p>
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute left-0 top-1/2 h-0.5 w-full origin-left bg-[rgba(245,241,232,0.5)]"
                  initial={reduceMotion ? false : { scaleX: 0 }}
                  whileInView={reduceMotion ? undefined : { scaleX: 1 }}
                  viewport={{ once: true, amount: 0.8 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                />
              </div>
              <div className="overflow-visible px-1 py-2 md:px-2">
                <motion.p
                  className="max-w-6xl hyphens-none text-balance text-[clamp(2rem,5.5vw,4.25rem)] font-extrabold uppercase leading-[1.08] text-[var(--text)]"
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  {pair.statement}
                </motion.p>
              </div>
            </div>
          ))}
        </div>

        <p className="type-body max-w-3xl text-[var(--text-2)]">
          Astea nu sunt promisiuni de marketing. Sunt clauze de contract.
        </p>
      </div>
    </section>
  )
}

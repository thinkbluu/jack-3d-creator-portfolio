'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import ChartKicker from './ChartKicker'

const pairs: Array<{ other: string; statement: ReactNode }> = [
  { other: 'Alții: site-uri la fel ca alte mii.', statement: <>Al tău nu seamănă cu <span className="text-[var(--brass)]">nimeni</span>.</> },
  { other: 'Alții: site pe care nu-l controlezi.', statement: <>Site-ul e al tău. <span className="text-[var(--brass)]">Cu totul</span>.</> },
  { other: 'Alții: gata în câteva luni.', statement: <>Live în <span className="text-[var(--brass)]">48 de ore</span>.</> },
  { other: 'Alții: plătești tot înainte să vezi ceva.', statement: <>Vezi site-ul gata. <span className="text-[var(--brass)]">Apoi</span> plătești.</> },
  { other: 'Alții: frumos, dar lent. Clienții pleacă.', statement: <>Instant. Clienții <span className="text-[var(--brass)]">rămân</span>.</> },
]

function ManifestPair({ other, statement }: { other: string; statement: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const [landed, setLanded] = useState(false)

  return (
    <div className="manifest-pair flex flex-col justify-center gap-4 border-t border-[var(--hairline)] py-9 first:border-t-0 md:py-11">
      <p
        className="manifest-other-text font-sans text-[clamp(0.95rem,1.5vw,1.15rem)] leading-relaxed text-[var(--ink-2)] transition-[opacity,filter] duration-500 ease-out"
        style={landed && !reduceMotion ? { opacity: 0.32, filter: 'blur(1.5px)' } : undefined}
      >
        {other}
      </p>
      <motion.p
        className="manifest-statement-text type-h2 max-w-4xl text-balance"
        initial={reduceMotion ? false : { opacity: 0, y: 16, filter: 'blur(4px)' }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        onViewportEnter={() => setLanded(true)}
      >
        {statement}
      </motion.p>
    </div>
  )
}

export default function ManifestSection() {
  return (
    <>
      <section id="manifest" className="scene-section">
        {/* No glass panel here: the manifesto reads straight off the scene,
            carried by text-shadow instead of a backing plate. */}
        <div className="scene-panel">
          <ChartKicker label="Manifest" />
          {pairs.map((pair) => (
            <ManifestPair key={pair.other} other={pair.other} statement={pair.statement} />
          ))}
          <p
            className="type-body mt-8 border-t border-[var(--hairline)] pt-8"
            style={{ textShadow: '0 1px 12px rgba(250,247,242,0.9)' }}
          >
            Astea nu sunt promisiuni de marketing. Sunt clauze scrise în contract.
          </p>
        </div>
      </section>
      {/* Breathing room before the next panel. */}
      <div aria-hidden="true" style={{ height: '40vh' }} />
    </>
  )
}

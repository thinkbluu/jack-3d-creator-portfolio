'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import ChartKicker from './ChartKicker'

const pairs: Array<{ other: string; statement: ReactNode }> = [
  { other: 'Alții: site-uri la fel ca alte mii.', statement: <>Al tău e făcut <span className="text-[var(--brass)]">doar pentru tine</span>.</> },
  { other: 'Alții: gata în câteva luni.', statement: <>Live în <span className="text-[var(--brass)]">48 de ore</span>.</> },
  { other: 'Alții: plătești tot înainte să vezi ceva.', statement: <>Vezi site-ul gata. <span className="text-[var(--brass)]">Apoi</span> plătești.</> },
]

function ManifestPair({ other, statement }: { other: string; statement: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const [landed, setLanded] = useState(false)
  const [faded, setFaded] = useState(false)

  useEffect(() => {
    if (!landed || reduceMotion) return
    const timeout = window.setTimeout(() => setFaded(true), 600)
    return () => window.clearTimeout(timeout)
  }, [landed, reduceMotion])

  return (
    <div className="manifest-pair">
      <motion.p
        className="manifest-other-text"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        onViewportEnter={() => setLanded(true)}
      >
        {other}
      </motion.p>
      <motion.p
        className="manifest-statement-text type-display max-w-[900px] text-balance"
        initial={reduceMotion ? false : { opacity: 0, y: 20, filter: 'blur(5px)' }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
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
        <div className="scene-panel">
          <ChartKicker label="Manifest" />
          <div className="manifest-pairs">
            {pairs.map((pair) => (
              <ManifestPair key={pair.other} other={pair.other} statement={pair.statement} />
            ))}
            <p className="manifest-closing type-body">
              Astea nu sunt promisiuni de marketing. Sunt clauze scrise în contract.
            </p>
          </div>
        </div>
      </section>
      {/* Breathing room before the next panel. */}
      <div aria-hidden="true" style={{ height: '40vh' }} />
    </>
  )
}

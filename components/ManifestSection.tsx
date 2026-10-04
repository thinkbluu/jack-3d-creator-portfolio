'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'

import ChartKicker from './ChartKicker'
import { useUi } from '@/lib/i18n/context'

function ManifestPair({ other, statement }: { other: string; statement: ReactNode }) {
  const reduceMotion = useReducedMotion()
  const [landed, setLanded] = useState(false)
  const [faded, setFaded] = useState(false)

  useEffect(() => {
    if (!landed || reduceMotion) return
    // Statement finishes landing at delay (250ms) + duration (800ms) = 1050ms
    // after the "Alții" row enters view; the row then dims 600ms after that.
    const timeout = window.setTimeout(() => setFaded(true), 1050 + 600)
    return () => window.clearTimeout(timeout)
  }, [landed, reduceMotion])

  return (
    <div className="manifest-pair">
      <div className="manifest-pair-inner">
        <motion.p
          className="manifest-other-text type-body"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          animate={faded ? { opacity: 0.4, filter: 'blur(1px)' } : undefined}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onViewportEnter={() => setLanded(true)}
        >
          {other}
        </motion.p>
        <motion.p
          className="manifest-statement-text type-h2 text-balance"
          initial={reduceMotion ? false : { opacity: 0, y: 20, filter: 'blur(5px)' }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          {statement}
        </motion.p>
      </div>
    </div>
  )
}

export default function ManifestSection() {
  const copy = useUi().manifest
  return (
    <section id="manifest" className="scene-section">
      <div className="porthole manifest-porthole">
        <ChartKicker label={copy.kicker} />
        <div className="manifest-pairs mt-8">
          {copy.pairs.map((pair) => (
            <ManifestPair
              key={pair.highlight}
              other={pair.other}
              statement={
                <>
                  {pair.before}
                  <span className="text-[var(--brass)]">{pair.highlight}</span>
                  {pair.after}
                </>
              }
            />
          ))}
        </div>
        <p className="manifest-closing type-body">{copy.closing}</p>
      </div>
    </section>
  )
}

'use client'

import { motion, useReducedMotion } from 'framer-motion'
import ChartKicker from './ChartKicker'

const statements = [
  <><span className="text-[var(--gold)]">Zero template-uri.</span> Niciodată.</>,
  <>Cod <span className="text-[var(--gold)]">propriu</span>, scris pentru afacerea ta.</>,
  <>Live în <span className="text-[var(--gold)]">48 de ore.</span></>,
  <>Plătești doar când ești <span className="text-[var(--gold)]">mulțumit.</span></>,
  <>PageSpeed 90+, <span className="text-[var(--gold)]">garantat</span> la predare.</>,
]

export default function ManifestSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="manifest" className="section-shell bg-[var(--bg)]">
      <div className="site-container">
        <ChartKicker bearing="02" label="Manifest" />

        <div>
          {statements.map((statement, index) => (
            <motion.div
              key={index}
              className="flex min-h-[28vh] items-center py-12 md:min-h-[40vh] md:py-16"
              initial={reduceMotion ? false : { opacity: 0, letterSpacing: '0.08em', filter: 'blur(6px)', y: 20 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, letterSpacing: '0em', filter: 'blur(0px)', y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="max-w-6xl text-balance text-[clamp(2rem,5.5vw,4.25rem)] font-extrabold uppercase leading-[1.08] text-[var(--text)]">
                {statement}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="type-body max-w-3xl text-[var(--text-2)]">
          Astea nu sunt promisiuni de marketing. Sunt clauze de contract.
        </p>
      </div>
    </section>
  )
}

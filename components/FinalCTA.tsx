'use client'

import { motion, useReducedMotion } from 'framer-motion'
import ContactButton from './ContactButton'
import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'

function SonarPing() {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return null

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 z-0 h-11 rounded-[12px] border-[1.5px] border-[var(--gold)]"
      initial={{ scale: 1, opacity: 0.08 }}
      animate={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 1.6, ease: 'easeOut', repeat: Number.POSITIVE_INFINITY, repeatDelay: 4.4 }}
    />
  )
}

export default function FinalCTA() {
  return (
    <section id="contact" className="hero-chart-grid section-shell border-t border-[var(--line)] bg-[var(--bg)]">
      <div className="site-container">
        <FadeIn>
          <header className="section-header">
            <ChartKicker bearing="06" label="Contact" />
            <h2 className="type-h2">Setează <span className="text-[var(--gold)]">direcția.</span></h2>
            <p className="type-body mt-5">Lucrăm cu maximum 4 proiecte noi pe lună. Rezervă-ți locul.</p>
          </header>
          <div className="relative z-0 inline-flex justify-start">
            <SonarPing />
            <div className="relative z-10"><ContactButton /></div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

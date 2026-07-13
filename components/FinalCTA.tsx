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
    <section id="contact" className="section-shell relative overflow-hidden border-t border-[var(--line)] bg-[var(--bg)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/output-image4.png"
        alt=""
        aria-hidden="true"
        width={1536}
        height={864}
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-[rgba(5,10,20,0.62)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(var(--bg),transparent_30%,transparent_70%,var(--bg))]" />

      <div className="site-container relative z-10">
        <FadeIn>
          <header className="section-header">
            <ChartKicker bearing="07" label="Contact" />
            <h2 className="type-h2 text-shadow-sm">Setează <span className="text-[var(--gold)]">direcția.</span></h2>
            <p className="type-body mt-5 text-[var(--text)] [text-shadow:0_1px_12px_rgba(0,0,0,0.8)]">Lucrăm cu maximum 4 proiecte noi pe lună. Rezervă-ți locul.</p>
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

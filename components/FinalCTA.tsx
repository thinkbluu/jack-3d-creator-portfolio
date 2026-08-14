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
      className="pointer-events-none absolute inset-0 z-0 rounded-[var(--radius-pill)] border-[1.5px] border-[var(--brass)]"
      initial={{ scale: 1, opacity: 0.1 }}
      animate={{ scale: 1.5, opacity: 0 }}
      transition={{ duration: 1.6, ease: 'easeOut', repeat: Number.POSITIVE_INFINITY, repeatDelay: 4.4 }}
    />
  )
}

export default function FinalCTA() {
  return (
    <section id="contact" className="scene-section relative flex min-h-[100dvh] items-center justify-center">
      {/* Soft radial wash so the copy stays readable over the detailed compass plate. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(58% 46% at 50% 48%, rgba(250,247,242,0.94) 0%, rgba(250,247,242,0.82) 45%, rgba(250,247,242,0) 100%)',
        }}
      />
      <div
        className="relative z-10 mx-auto flex max-w-[52ch] flex-col items-center text-center"
        style={{ textShadow: '0 2px 24px rgba(250,247,242,.6)' }}
      >
        <FadeIn className="flex flex-col items-center">
          <ChartKicker label="Contact" />
          <h2 className="type-h2 text-balance">
            Setează <span className="text-[var(--brass)]">direcția</span>.
          </h2>
          <p className="type-body mt-5 text-[var(--ink)]">
            Ne spui în două fraze ce faci. Primești azi oferta și lista de materiale. Poimâine ești live.
          </p>
          <p className="type-body mt-3 font-semibold text-[var(--ink)]">
            Răspundem în aceeași zi. Începem în 48 de ore de la avans.
          </p>
        </FadeIn>

        <FadeIn delay={0.1} className="mt-9 flex flex-col items-center">
          <span className="relative inline-flex">
            <SonarPing />
            <span className="relative z-10">
              <ContactButton hero note={false} />
            </span>
          </span>
          <p className="mt-5 font-sans text-xs font-medium text-[var(--ink-2)]">
            50 EUR avans · restul la livrare, dacă ești mulțumit
          </p>
          <p className="mt-3 font-sans text-[13px] text-[var(--ink-3)]">
            sau scrie-ne la{' '}
            <a href="mailto:contact@maststudio.ro" className="underline decoration-[var(--brass)] underline-offset-4 transition-colors hover:text-[var(--ink)]">
              contact@maststudio.ro
            </a>
          </p>
          <p className="mt-8 font-sans text-sm text-[var(--ink-2)]">Ai ajuns unde trebuia.</p>
        </FadeIn>
      </div>
    </section>
  )
}

'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ChartKicker from './ChartKicker'
import { getWaUrl, useSegment, type Segment } from './SegmentContext'
import TrackedLink from './TrackedLink'

const pairs: Partial<Record<Segment, { before: string; after: string; label: string }>> = {
  salon: { before: '/images/transform-before.png', after: '/images/transform-after.png', label: 'Salon' },
  servicii: { before: '/images/before-instal.png', after: '/images/after-instal.png', label: 'Servicii' },
  platforma: { before: '/images/before-nextvision.png', after: '/images/after-nextvision.png', label: 'Platformă' },
}

function imageExists(src: string) {
  return new Promise<boolean>((resolve) => {
    const image = new Image()
    image.onload = () => resolve(true)
    image.onerror = () => resolve(false)
    image.src = src
  })
}

function Frame({ src, alt, tag }: { src: string; alt: string; tag: string }) {
  return (
    <figure className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--shell-warm)] shadow-[0_14px_40px_rgba(26,23,20,0.10)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src || '/placeholder.svg'} alt={alt} className="block aspect-[16/10] w-full object-cover" loading="lazy" decoding="async" />
      <figcaption className="absolute left-3 top-3 rounded-[var(--radius-pill)] bg-[var(--shell)]/85 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-2)]">
        {tag}
      </figcaption>
    </figure>
  )
}

export default function ComparisonSection() {
  const { segment, setSegment } = useSegment()
  const reduceMotion = useReducedMotion()
  const [available, setAvailable] = useState<Segment[]>([])
  const [ready, setReady] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const active = segment && available.includes(segment) ? segment : available[0]

  useEffect(() => {
    let live = true
    Promise.all(
      (Object.keys(pairs) as Segment[]).map(async (key) => {
        const pair = pairs[key]
        if (!pair) return null
        return (await Promise.all([imageExists(pair.before), imageExists(pair.after)])).every(Boolean) ? key : null
      }),
    ).then((results) => {
      if (!live) return
      setAvailable(results.filter((item): item is Segment => Boolean(item)))
      setReady(true)
    })
    return () => {
      live = false
    }
  }, [])

  if (!ready || !active) return null
  const pair = pairs[active]!

  return (
    <section id="dovada" className="scene-section">
      <div className="porthole scene-panel">
        <ChartKicker label="Dovada" />
        <h2 className="type-h2 text-balance">Vezi diferența cu ochii tăi.</h2>
        <p className="type-body mt-4">Exemple tipice din patru domenii. Alege-l pe al tău.</p>

        {available.length > 1 && (
          <div role="tablist" aria-label="Exemple pe tip de afacere" className="mt-6 flex flex-wrap gap-2">
            {available.map((key) => (
              <button
                key={key}
                role="tab"
                type="button"
                aria-selected={active === key}
                onClick={() => setSegment(key)}
                className={`cursor-pointer rounded-[var(--radius-pill)] border px-4 py-2 font-sans text-xs font-semibold transition-colors ${
                  active === key
                    ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--shell)]'
                    : 'border-[var(--hairline)] text-[var(--ink-2)] hover:border-[var(--brass)] hover:text-[var(--ink)]'
                }`}
              >
                {pairs[key]!.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-7 max-w-3xl">
          <AnimatePresence initial={false} mode="wait">
            {expanded ? (
              <motion.div
                key="side"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="grid gap-4 sm:grid-cols-2"
              >
                <Frame src={pair.before} alt={`Versiunea înainte pentru ${pair.label}`} tag="Înainte" />
                <Frame src={pair.after} alt={`Versiunea după pentru ${pair.label}`} tag="După" />
              </motion.div>
            ) : (
              <motion.div
                key="stack"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="relative pr-6 pt-6 sm:pr-10 sm:pt-10"
              >
                <div aria-hidden="true" className="absolute right-0 top-0 w-[72%] rotate-[1.6deg] opacity-70">
                  <Frame src={pair.before} alt="" tag="Înainte" />
                </div>
                <div className="relative">
                  <Frame src={pair.after} alt={`Versiunea după pentru ${pair.label}`} tag="După" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="cursor-pointer rounded-[var(--radius-pill)] border-[1.5px] border-[var(--brass)] px-6 py-3 font-sans text-sm font-bold text-[var(--brass)] transition-colors duration-[250ms] ease-out hover:bg-[var(--brass)] hover:text-[var(--shell)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
          >
            {expanded ? 'Suprapune-le la loc' : 'Desfă-le una lângă alta'}
          </button>
          <TrackedLink
            href={getWaUrl(segment)}
            target="_blank"
            rel="noopener noreferrer"
            eventName="whatsapp_cta_click"
            eventProperties={{ placement: 'comparison', segment: segment ?? 'general' }}
            className="font-sans text-sm font-semibold text-[var(--brass)] underline decoration-[var(--glass-edge)] underline-offset-4 transition-colors hover:text-[var(--ink)]"
          >
            Vreau varianta de după →
          </TrackedLink>
        </div>

        <p className="mt-5 font-sans text-xs leading-relaxed text-[var(--ink-3)]">
          Exemple demonstrative, nu proiecte ale clienților. Al tău poate arăta așa în 48 de ore.
        </p>
      </div>
    </section>
  )
}

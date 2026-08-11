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

// Stacked-state placement. The hover nudge pushes each card 10px further along
// its own translation axis, so the unit vectors are derived from these values.
const BACK = { x: -8, y: -6, rotate: -4, scale: 0.94 }
const FRONT = { x: 6, y: 5, rotate: 2.5, scale: 1 }

function axisNudge(x: number, y: number, distance: number) {
  const length = Math.hypot(x, y) || 1
  return { x: (x / length) * distance, y: (y / length) * distance }
}

const BACK_NUDGE = axisNudge(BACK.x, BACK.y, 10)
const FRONT_NUDGE = axisNudge(FRONT.x, FRONT.y, 10)

const NUDGE_SPRING = { type: 'spring' as const, stiffness: 120, damping: 16 }

function imageExists(src: string) {
  return new Promise<boolean>((resolve) => {
    const image = new Image()
    image.onload = () => resolve(true)
    image.onerror = () => resolve(false)
    image.src = src
  })
}

function Pill({ tone, children }: { tone: 'before' | 'after'; children: string }) {
  return (
    <figcaption
      className="absolute left-3 top-3 rounded-[var(--radius-pill)] font-sans"
      style={{
        background: tone === 'before' ? 'rgba(180,60,40,0.92)' : 'var(--brass)',
        color: tone === 'before' ? 'var(--shell)' : 'var(--ink)',
        fontSize: '10.5px',
        fontWeight: 700,
        letterSpacing: '0.16em',
        padding: '6px 14px',
      }}
    >
      {children}
    </figcaption>
  )
}

function Frame({
  src,
  alt,
  tone,
  dimmed = false,
}: {
  src: string
  alt: string
  tone: 'before' | 'after'
  dimmed?: boolean
}) {
  return (
    <figure className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--shell-warm)] shadow-[0_10px_30px_rgba(26,23,20,0.10)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || '/placeholder.svg'}
        alt={alt}
        className="block aspect-[16/10] w-full object-cover"
        loading="lazy"
        decoding="async"
        // Muting only the artwork keeps the label pill at full contrast.
        style={dimmed ? { filter: 'grayscale(0.85) brightness(0.82)' } : undefined}
      />
      <Pill tone={tone}>{tone === 'before' ? 'ÎNAINTE' : 'DUPĂ'}</Pill>
    </figure>
  )
}

export default function ComparisonSection() {
  const { segment, setSegment } = useSegment()
  const reduceMotion = useReducedMotion()
  const [available, setAvailable] = useState<Segment[]>([])
  const [ready, setReady] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [canHover, setCanHover] = useState(false)
  const active = segment && available.includes(segment) ? segment : available[0]

  useEffect(() => {
    setCanHover(window.matchMedia('(min-width: 768px) and (hover: hover)').matches)
  }, [])

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
  const nudging = canHover && hovered && !reduceMotion

  return (
    <section id="dovada" className="scene-section">
      <div className="porthole scene-panel">
        <ChartKicker label="Dovada" />
        <h2 className="type-h2 text-balance">Vezi diferența cu ochii tăi.</h2>
        <p className="type-body mt-4">Exemple tipice din patru domenii. Alege-l pe al tău.</p>

        {available.length > 1 && (
          <div role="tablist" aria-label="Exemple pe tip de afacere" className="chart-tabs-scroll mt-6 flex flex-nowrap gap-2 md:flex-wrap">
            {available.map((key) => (
              <button
                key={key}
                role="tab"
                type="button"
                aria-selected={active === key}
                onClick={() => setSegment(key)}
                className={`flex min-h-11 shrink-0 cursor-pointer items-center rounded-[var(--radius-pill)] border px-4 py-2 font-sans text-xs font-semibold transition-colors ${
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

        {/* Toggle sits above the stack so the affordance is visible before the cards. */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="group flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap border-[1.5px] border-[var(--brass)] bg-transparent font-sans font-bold text-[var(--brass)] transition-[background-color,transform,color] duration-[250ms] ease-out hover:bg-[var(--brass)] hover:text-[var(--shell)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] md:inline-flex md:w-auto"
            style={{ borderRadius: 'var(--radius-pill)', padding: '15px 32px', fontSize: '14.5px' }}
          >
            {expanded ? 'Suprapune-le la loc' : 'Compară-le una lângă alta'}
          </button>
        </div>

        <p className="type-body mt-4" style={{ color: 'var(--ink-2)' }}>
          {expanded
            ? 'Cele două versiuni, una lângă alta.'
            : 'Apasă butonul ca să vezi ambele versiuni una lângă alta.'}
        </p>

        <div className="mt-6 max-w-3xl">
          <AnimatePresence initial={false} mode="wait">
            {expanded ? (
              <motion.div
                key="side"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="grid grid-cols-1 gap-[14px] md:grid-cols-2 md:gap-5"
              >
                {/* Expanded: no rotation, no scale, and the "before" card drops its desaturation. */}
                <Frame src={pair.before} alt={`Versiunea înainte pentru ${pair.label}`} tone="before" />
                <Frame src={pair.after} alt={`Versiunea după pentru ${pair.label}`} tone="after" />
              </motion.div>
            ) : (
              <motion.div
                key="stack"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                onHoverStart={() => setHovered(true)}
                onHoverEnd={() => setHovered(false)}
                className="comparison-stack relative mx-auto w-[86%]"
              >
                {/* Back card: offset, rotated, desaturated so the front one clearly reads as "after". */}
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-0"
                  animate={nudging ? { x: BACK_NUDGE.x, y: BACK_NUDGE.y } : { x: 0, y: 0 }}
                  transition={NUDGE_SPRING}
                  style={{
                    transformOrigin: 'center',
                    translate: `${BACK.x}% ${BACK.y}%`,
                    rotate: `${BACK.rotate}deg`,
                    scale: BACK.scale,
                    boxShadow: '0 20px 50px rgba(26,23,20,0.28)',
                    borderRadius: 'var(--radius-card)',
                  }}
                >
                  <Frame src={pair.before} alt="" tone="before" dimmed />
                </motion.div>

                {/* Front card stays in flow so it defines the stack height. */}
                <motion.div
                  className="relative"
                  animate={nudging ? { x: FRONT_NUDGE.x, y: FRONT_NUDGE.y } : { x: 0, y: 0 }}
                  transition={NUDGE_SPRING}
                  style={{
                    transformOrigin: 'center',
                    translate: `${FRONT.x}% ${FRONT.y}%`,
                    rotate: `${FRONT.rotate}deg`,
                    boxShadow: '0 28px 70px rgba(26,23,20,0.22)',
                    borderRadius: 'var(--radius-card)',
                  }}
                >
                  <Frame src={pair.after} alt={`Versiunea după pentru ${pair.label}`} tone="after" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
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

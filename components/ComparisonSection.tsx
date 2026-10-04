'use client'

import { useEffect, useMemo, useState } from 'react'
import ChartKicker from './ChartKicker'
import { getWaUrl, useSegment, type Segment } from './SegmentContext'
import { useLocale, useUi } from '@/lib/i18n/context'
import TrackedLink from './TrackedLink'

const pairImages: Partial<Record<Segment, { before: string; after: string }>> = {
  salon: { before: '/images/transform-before.webp', after: '/images/transform-after.webp' },
  servicii: { before: '/images/before-instal.webp', after: '/images/after-instal.webp' },
  platforma: { before: '/images/before-nextvision.webp', after: '/images/after-nextvision.webp' },
}

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
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.16em',
        padding: '6px 14px',
      }}
    >
      {children}
    </figcaption>
  )
}

function Frame({ src, alt, tone, before, after }: { src: string; alt: string; tone: 'before' | 'after'; before: string; after: string }) {
  return (
    <figure
      className="relative overflow-hidden rounded-[var(--radius-card)] bg-[var(--shell-warm)]"
      style={
        tone === 'before'
          ? { border: '1px solid rgba(180,60,40,0.25)' }
          : { border: '1px solid var(--glass-edge)', boxShadow: '0 20px 50px rgba(26,23,20,0.14)' }
      }
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src || '/placeholder.svg'}
        alt={alt}
        className="block aspect-[16/10] w-full object-cover"
        loading="lazy"
        decoding="async"
        style={tone === 'before' ? { filter: 'grayscale(0.7) brightness(0.9)' } : undefined}
      />
      <Pill tone={tone}>{tone === 'before' ? before : after}</Pill>
    </figure>
  )
}

export default function ComparisonSection() {
  const { segment, setSegment } = useSegment()
  const locale = useLocale()
  const copy = useUi().comparison
  const pairs = useMemo<Partial<Record<Segment, { before: string; after: string; label: string }>>>(
    () => ({
      salon: { ...pairImages.salon!, label: copy.labels.salon },
      servicii: { ...pairImages.servicii!, label: copy.labels.servicii },
      platforma: { ...pairImages.platforma!, label: copy.labels.platforma },
    }),
    [copy.labels.salon, copy.labels.servicii, copy.labels.platforma],
  )
  const [available, setAvailable] = useState<Segment[]>([])
  const [ready, setReady] = useState(false)
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
  }, [pairs])

  if (!ready || !active) return null
  const pair = pairs[active]!

  return (
    <section id="dovada" className="scene-section">
      <div className="porthole scene-panel">
        <ChartKicker label={copy.kicker} />
        <h2 className="type-h2 text-balance">{copy.title}</h2>
        <p className="type-body mt-4">{copy.intro}</p>

        {available.length > 1 && (
          <div role="tablist" aria-label={copy.tabs} className="chart-tabs-scroll mt-6 flex flex-nowrap gap-2 md:flex-wrap">
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

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          <div>
            <Frame src={pair.before} alt={`${pair.label} ${copy.beforeAlt}`} tone="before" before={copy.before} after={copy.after} />
            <p className="mt-3 font-sans text-[13px] text-[var(--ink-2)]">{copy.now}</p>
          </div>
          <div>
            <Frame src={pair.after} alt={`${copy.afterAlt} ${pair.label}`} tone="after" before={copy.before} after={copy.after} />
            <p className="mt-3 font-sans text-[13px] text-[var(--ink-2)]">{copy.afterHours}</p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <TrackedLink
            href={getWaUrl(segment, undefined, locale)}
            target="_blank"
            rel="noopener noreferrer"
            eventName="whatsapp_cta_click"
            eventProperties={{ placement: 'comparison', segment: segment ?? 'general' }}
            className="font-sans text-sm font-semibold text-[var(--brass)] underline decoration-[var(--glass-edge)] underline-offset-4 transition-colors hover:text-[var(--ink)]"
          >
            {copy.cta}
          </TrackedLink>
        </div>

        <p className="mt-5 font-sans text-xs leading-relaxed text-[var(--ink-3)]">
          {copy.note}
        </p>
      </div>
    </section>
  )
}

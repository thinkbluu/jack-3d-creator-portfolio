'use client'

import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { getWaUrl, useSegment, type Segment } from './SegmentContext'
import TrackedLink from './TrackedLink'

const pairs: Partial<Record<Segment, { before: string; after: string; label: string }>> = {
  salon: { before: '/images/transform-before.png', after: '/images/transform-after.png', label: 'Salon' },
  servicii: { before: '/images/before-instal.png', after: '/images/after-instal.png', label: 'Servicii' },
  platforma: { before: '/images/before-nextvision.png', after: '/images/after-nextvision.png', label: 'Platformă' },
  // ecommerce has no pair yet; imageExists will gate it out until assets are added
}

function imageExists(src: string) {
  return new Promise<boolean>((resolve) => {
    const image = new Image()
    image.onload = () => resolve(true)
    image.onerror = () => resolve(false)
    image.src = src
  })
}

export default function ComparisonSection() {
  const { segment, setSegment } = useSegment()
  const reduceMotion = useReducedMotion()
  const frameRef = useRef<HTMLDivElement>(null)
  const position = useMotionValue(50)
  const clipPath = useTransform(position, (current) => `inset(0 ${100 - current}% 0 0)`)
  const dividerLeft = useTransform(position, (current) => `${current}%`)
  const [value, setValue] = useState(50)
  const [available, setAvailable] = useState<Segment[]>([])
  const [ready, setReady] = useState(false)
  const active = segment && available.includes(segment) ? segment : available[0]

  useEffect(() => {
    let live = true
    Promise.all((Object.keys(pairs) as Segment[]).map(async (key) => {
      const pair = pairs[key]
      if (!pair) return null
      return (await Promise.all([imageExists(pair.before), imageExists(pair.after)])).every(Boolean) ? key : null
    })).then((results) => {
      if (!live) return
      setAvailable(results.filter((item): item is Segment => Boolean(item)))
      setReady(true)
    })
    return () => { live = false }
  }, [])

  const update = useCallback((clientX: number) => {
    const bounds = frameRef.current?.getBoundingClientRect()
    if (!bounds) return
    const next = Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100))
    position.set(next); setValue(Math.round(next))
  }, [position])

  function handlePointer(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId)
    update(event.clientX)
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 100 : Math.min(100, Math.max(0, value + (event.key === 'ArrowLeft' ? -5 : 5)))
    position.set(next); setValue(next)
  }

  if (!ready || !active) return null
  // active is always in available, which only contains keys whose images loaded
  const pair = pairs[active]!


  return (
    <section id="dovada" className="section-shell bg-[var(--surface)]">
      <div className="site-container grid items-end gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow">Dovada înaintea promisiunii</p>
          <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight text-balance md:text-6xl">Trage linia. Vezi diferența.</h2>
          <p className="type-body mt-5 max-w-lg">Aceeași afacere, prezentată înainte și după intervenția MAST.</p>
          {available.length > 1 && <div role="tablist" aria-label="Exemple pe tip de afacere" className="mt-7 flex flex-wrap gap-2">{available.map((key) => <button key={key} role="tab" aria-selected={active === key} onClick={() => { position.set(50); setValue(50); setSegment(key) }} className={`border px-4 py-2 text-xs uppercase tracking-[0.16em] ${active === key ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--bg)]' : 'border-[var(--line)] text-[var(--muted)]'}`}>{pairs[key]!.label}</button>)}</div>}
        </div>
        <motion.div key={active} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
          <div ref={frameRef} className="relative aspect-[16/10] cursor-ew-resize touch-none overflow-hidden border border-[var(--line)] bg-[var(--bg)]" onPointerDown={handlePointer} onPointerMove={(event) => event.currentTarget.hasPointerCapture(event.pointerId) && update(event.clientX)} role="slider" tabIndex={0} aria-label="Compară versiunea înainte și după" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} onKeyDown={handleKey}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pair.before} alt={`Versiunea înainte pentru ${pair.label}`} className="absolute inset-0 h-full w-full object-cover" />
            <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pair.after} alt={`Versiunea după pentru ${pair.label}`} className="absolute inset-0 h-full w-full object-cover" />
            </motion.div>
            <span className="absolute left-4 top-4 bg-[var(--bg)]/85 px-3 py-2 text-[10px] uppercase tracking-[0.2em]">După</span><span className="absolute right-4 top-4 bg-[var(--bg)]/85 px-3 py-2 text-[10px] uppercase tracking-[0.2em]">Înainte</span>
            <motion.div className="absolute inset-y-0 w-px bg-[var(--gold)]" style={{ left: dividerLeft }}><span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--bg)]"><ChevronLeft size={15} /><ChevronRight size={15} /></span></motion.div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]">Exemple demonstrative. Rezultatele și soluția finală diferă în funcție de obiective, conținut și context.</p>
          <TrackedLink href={getWaUrl(segment)} target="_blank" rel="noopener noreferrer" eventName="whatsapp_cta_click" eventProperties={{ placement: 'comparison', segment: segment ?? 'general' }} className="mt-5 inline-block text-xs uppercase tracking-[0.16em] text-[var(--gold)] underline underline-offset-4">Vreau o transformare similară</TrackedLink>
        </motion.div>
      </div>
    </section>
  )
}

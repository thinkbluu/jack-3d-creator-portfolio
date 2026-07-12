'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, useMotionTemplate, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'
import FadeIn from './FadeIn'

const clamp = (value: number) => Math.min(95, Math.max(5, value))

export default function ComparisonSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sliderRef = useRef<HTMLButtonElement>(null)
  const activePointerRef = useRef<number | null>(null)
  const frameRef = useRef<number | null>(null)
  const hasNudged = useRef(false)
  const position = useMotionValue(50)
  const left = useMotionTemplate`${position}%`
  const clipPath = useMotionTemplate`inset(0 calc(100% - ${position}%) 0 0)`

  useMotionValueEvent(position, 'change', (latest) => {
    sliderRef.current?.setAttribute('aria-valuenow', String(Math.round(latest)))
  })

  const updateFromPointer = useCallback((clientX: number) => {
    const bounds = containerRef.current?.getBoundingClientRect()
    if (!bounds) return
    const next = clamp(((clientX - bounds.left) / bounds.width) * 100)
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => position.set(next))
  }, [position])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (activePointerRef.current !== event.pointerId) return
      updateFromPointer(event.clientX)
    }
    const stopDragging = (event: PointerEvent) => {
      if (activePointerRef.current === event.pointerId) activePointerRef.current = null
    }
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopDragging)
    window.addEventListener('pointercancel', stopDragging)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopDragging)
      window.removeEventListener('pointercancel', stopDragging)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [updateFromPointer])

  useEffect(() => {
    const element = containerRef.current
    if (!element || hasNudged.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timers: number[] = []
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasNudged.current) return
      hasNudged.current = true
      timers.push(window.setTimeout(() => {
        ;[42, 58, 50].forEach((value, index) => {
          timers.push(window.setTimeout(() => position.set(value), index * 600))
        })
      }, 1500))
      observer.disconnect()
    }, { threshold: 0.35 })
    observer.observe(element)
    return () => {
      observer.disconnect()
      timers.forEach(window.clearTimeout)
    }
  }, [position])

  const startDragging = (event: React.PointerEvent<HTMLElement>) => {
    activePointerRef.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    updateFromPointer(event.clientX)
  }

  return (
    <section className="section-shell bg-[var(--bg)]">
      <div className="site-container">
      <FadeIn>
        <header className="section-header">
          <p className="type-kicker mb-4">Transformare</p>
          <h2 className="type-h2">Înainte și după</h2>
          <p className="type-body mt-5">Același business. Trage de mâner și vezi diferența.</p>
        </header>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div ref={containerRef} className="relative aspect-[16/10] w-full cursor-ew-resize touch-none overflow-hidden rounded-[28px] border border-[var(--gold-soft)]" onPointerDown={startDragging}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/comparison-new.png" alt="Versiunea nouă a site-ului" width={1600} height={1000} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.src = '/placeholder.svg?height=1000&width=1600' }} />
          <motion.div className="absolute inset-0" style={{ clipPath }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/comparison-old.png" alt="Versiunea veche a site-ului" width={1600} height={1000} loading="lazy" decoding="async" className="h-full w-full object-cover grayscale" onError={(event) => { event.currentTarget.src = '/placeholder.svg?height=1000&width=1600' }} />
          </motion.div>
          <span className="type-kicker absolute left-4 top-4 rounded-[12px] bg-[rgba(5,10,20,0.78)] px-3 py-2 !text-[var(--text-3)] backdrop-blur">ÎNAINTE</span>
          <span className="type-kicker absolute right-4 top-4 rounded-[12px] bg-[rgba(5,10,20,0.78)] px-3 py-2 !text-[var(--gold)] backdrop-blur">DUPĂ</span>
          <motion.div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-[var(--gold)]" style={{ left }} />
          <motion.button
            ref={sliderRef}
            type="button"
            role="slider"
            aria-label="Compară site-ul vechi cu cel nou"
            aria-valuemin={5}
            aria-valuemax={95}
            aria-valuenow={50}
            aria-valuetext="Folosește săgețile stânga și dreapta pentru comparație"
            className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--gold)] text-[var(--bg)] shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-soft)]"
            style={{ left }}
            onPointerDown={startDragging}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault()
                position.set(clamp(position.get() + (event.key === 'ArrowLeft' ? -5 : 5)))
              }
            }}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <ChevronRight size={16} aria-hidden="true" />
          </motion.button>
        </div>
        <p className="type-kicker mt-6">[PROJECT_NAME] · redesign complet în [X] zile{' '}<a href="[LIVE_URL]" target="_blank" rel="noreferrer" className="transition-colors hover:text-[var(--gold)]">Vezi live</a></p>
      </FadeIn>
      </div>
    </section>
  )
}

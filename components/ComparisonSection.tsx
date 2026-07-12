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
    <section className="bg-[#050A14] px-5 py-24 sm:px-8 sm:py-32 md:px-10">
      <FadeIn>
        <h2 className="hero-heading mb-4 text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2.5rem, 9vw, 120px)' }}>Înainte și după</h2>
        <p className="mx-auto mb-12 max-w-lg text-center font-light text-[#F5F1E8] opacity-50">Același business. Trage de mâner și vezi diferența.</p>
      </FadeIn>

      <FadeIn delay={0.1} y={20}>
        <div ref={containerRef} className="relative mx-auto aspect-[16/10] max-w-5xl cursor-ew-resize touch-none overflow-hidden rounded-3xl border border-[rgba(201,162,39,0.3)]" onPointerDown={startDragging}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/comparison-new.png" alt="Versiunea nouă a site-ului" width={1600} height={1000} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.src = '/placeholder.svg?height=1000&width=1600' }} />
          <motion.div className="absolute inset-0" style={{ clipPath }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/comparison-old.png" alt="Versiunea veche a site-ului" width={1600} height={1000} loading="lazy" decoding="async" className="h-full w-full object-cover grayscale" onError={(event) => { event.currentTarget.src = '/placeholder.svg?height=1000&width=1600' }} />
          </motion.div>
          <span className="absolute left-4 top-4 rounded-full bg-[rgba(5,10,20,0.7)] px-3 py-1.5 text-xs tracking-[0.2em] text-[#F5F1E8] opacity-70 backdrop-blur">ÎNAINTE</span>
          <span className="absolute right-4 top-4 rounded-full bg-[rgba(5,10,20,0.7)] px-3 py-1.5 text-xs tracking-[0.2em] text-[#C9A227] backdrop-blur">DUPĂ</span>
          <motion.div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-[#C9A227]" style={{ left }} />
          <motion.button
            ref={sliderRef}
            type="button"
            role="slider"
            aria-label="Compară site-ul vechi cu cel nou"
            aria-valuemin={5}
            aria-valuemax={95}
            aria-valuenow={50}
            aria-valuetext="Folosește săgețile stânga și dreapta pentru comparație"
            className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#C9A227] text-[#050A14] shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5F1E8]"
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
        <p className="mt-6 text-center text-sm text-[#F5F1E8] opacity-50">[PROJECT_NAME] · redesign complet în [X] zile{' '}<a href="[LIVE_URL]" target="_blank" rel="noreferrer" className="text-[#C9A227] opacity-100 hover:underline">Vezi live</a></p>
      </FadeIn>
    </section>
  )
}

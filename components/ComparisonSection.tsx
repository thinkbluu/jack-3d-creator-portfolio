'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import FadeIn from './FadeIn'

const clamp = (value: number) => Math.min(95, Math.max(5, value))

export default function ComparisonSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const hasNudged = useRef(false)
  const [position, setPosition] = useState(50)
  const [dragging, setDragging] = useState(false)

  const updateFromPointer = useCallback((clientX: number) => {
    const bounds = containerRef.current?.getBoundingClientRect()
    if (!bounds) return
    const next = clamp(((clientX - bounds.left) / bounds.width) * 100)
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => setPosition(next))
  }, [])

  useEffect(() => {
    const element = containerRef.current
    if (!element || hasNudged.current) return
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasNudged.current) return
        hasNudged.current = true
        window.setTimeout(() => {
          const sequence = [42, 58, 50]
          sequence.forEach((value, index) => {
            window.setTimeout(() => setPosition(value), index * 600)
          })
        }, 1500)
        observer.disconnect()
      },
      { threshold: 0.35 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
  }, [])

  return (
    <section className="bg-[#050A14] px-5 py-24 sm:px-8 sm:py-32 md:px-10">
      <FadeIn>
        <h2 className="hero-heading mb-4 text-center font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2.5rem, 9vw, 120px)' }}>
          Înainte și după
        </h2>
        <p className="mx-auto mb-12 max-w-lg text-center font-light text-[#F5F1E8] opacity-50">
          Același business. Trage de mâner și vezi diferența.
        </p>
      </FadeIn>

      <FadeIn delay={0.1} y={20}>
        <div
          ref={containerRef}
          className="relative mx-auto aspect-[16/10] max-w-5xl cursor-ew-resize touch-none overflow-hidden rounded-3xl border border-[rgba(201,162,39,0.3)]"
          style={{ '--pos': `${position}%` } as CSSProperties}
          onPointerDown={(event) => {
            setDragging(true)
            event.currentTarget.setPointerCapture(event.pointerId)
            updateFromPointer(event.clientX)
          }}
          onPointerMove={(event) => {
            if (dragging) updateFromPointer(event.clientX)
          }}
          onPointerUp={(event) => {
            setDragging(false)
            event.currentTarget.releasePointerCapture(event.pointerId)
          }}
          onPointerCancel={() => setDragging(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/comparison-new.png" alt="Versiunea nouă a site-ului" className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.src = '/placeholder.svg?height=1000&width=1600' }} />
          <div className="absolute inset-0" style={{ clipPath: 'inset(0 calc(100% - var(--pos)) 0 0)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/comparison-old.png" alt="Versiunea veche a site-ului" className="h-full w-full object-cover grayscale" onError={(event) => { event.currentTarget.src = '/placeholder.svg?height=1000&width=1600' }} />
          </div>

          <span className="absolute left-4 top-4 rounded-full bg-[rgba(5,10,20,0.7)] px-3 py-1.5 text-xs tracking-[0.2em] text-[#F5F1E8] opacity-70 backdrop-blur">ÎNAINTE</span>
          <span className="absolute right-4 top-4 rounded-full bg-[rgba(5,10,20,0.7)] px-3 py-1.5 text-xs tracking-[0.2em] text-[#C9A227] backdrop-blur">DUPĂ</span>

          <div className={`pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-[#C9A227] ${dragging ? '' : 'transition-[left] duration-500 ease-in-out'}`} style={{ left: 'var(--pos)' }} />
          <button
            type="button"
            role="slider"
            aria-label="Compară site-ul vechi cu cel nou"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(position)}
            className={`absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#C9A227] text-[#050A14] shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F5F1E8] ${dragging ? '' : 'transition-[left] duration-500 ease-in-out'}`}
            style={{ left: 'var(--pos)' }}
            onKeyDown={(event) => {
              if (event.key === 'ArrowLeft') {
                event.preventDefault()
                setPosition((value) => clamp(value - 5))
              }
              if (event.key === 'ArrowRight') {
                event.preventDefault()
                setPosition((value) => clamp(value + 5))
              }
            }}
          >
            <ChevronLeft size={16} aria-hidden="true" />
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-[#F5F1E8] opacity-50">
          [PROJECT_NAME] · redesign complet în [X] zile{' '}
          <a href="[LIVE_URL]" target="_blank" rel="noreferrer" className="text-[#C9A227] opacity-100 hover:underline">Vezi live</a>
        </p>
      </FadeIn>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { useUi } from '@/lib/i18n/context'

const clamp = (value: number) => Math.min(1, Math.max(0, value))

/**
 * The turn of the page from night to day. Pinned for a moment, the sun comes
 * up from below the fold, the room warms through brass to cream, and the rest
 * of the homepage (prices, reviews, questions) carries on in daylight.
 */
export default function Dawn() {
  const { redesign } = useUi()
  const copy = redesign.dawn
  const sectionRef = useRef<HTMLElement>(null)
  const [day, setDay] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.style.setProperty('--d', '1')
      const id = requestAnimationFrame(() => setDay(true))
      return () => cancelAnimationFrame(id)
    }
    let raf = 0
    let running = false
    let isDay = false
    const tick = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const d = travel > 0 ? clamp(-rect.top / travel) : 1
      section.style.setProperty('--d', d.toFixed(4))
      if (d > 0.62 !== isDay) {
        isDay = d > 0.62
        setDay(isDay)
      }
      if (running) raf = requestAnimationFrame(tick)
    }
    const visibility = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
      if (running && !raf) raf = requestAnimationFrame(tick)
      if (!running) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    })
    visibility.observe(section)
    tick()
    return () => {
      running = false
      cancelAnimationFrame(raf)
      visibility.disconnect()
    }
  }, [])

  return (
    <section ref={sectionRef} aria-label={`${copy.line} ${copy.lineAccent}`} className="dawn relative">
      <div className={`dawn-stage sticky top-0 h-svh overflow-hidden ${day ? 'tone-cream' : 'tone-dark'}`}>
        <span aria-hidden="true" className="dawn-sky" />
        <span aria-hidden="true" className="dawn-sun" />
        <span aria-hidden="true" className="dawn-day" />
        <div className="studio-container relative flex h-full flex-col items-center justify-center text-center">
          <p className="dawn-line display-xl">
            {copy.line}
            <br />
            <span className="display-italic dawn-accent">{copy.lineAccent}</span>
          </p>
          <p className="dawn-sub mt-8 max-w-md text-lg leading-relaxed">{copy.sub}</p>
        </div>
      </div>
    </section>
  )
}

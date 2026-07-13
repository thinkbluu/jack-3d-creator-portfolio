'use client'

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const waypoints = [
  { id: 'home', label: 'Acasă' },
  { id: 'projects', label: 'Proiecte' },
  { id: 'about', label: 'Despre' },
  { id: 'services', label: 'Servicii' },
  { id: 'process', label: 'Proces' },
  { id: 'contact', label: 'Contact' },
]

export default function PlottedRoute() {
  const [supported, setSupported] = useState(false)
  const [filled, setFilled] = useState<boolean[]>(() => waypoints.map((_, index) => index === 0))
  const [pings, setPings] = useState<number[]>(() => waypoints.map(() => 0))
  const filledRef = useRef(filled)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const routeProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px) and (pointer: fine)')
    const update = () => setSupported(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!supported || reduceMotion) return
    const next = waypoints.map((_, index) => latest >= index / (waypoints.length - 1))
    const previous = filledRef.current
    setPings((current) => current.map((ping, index) => (!previous[index] && next[index] ? ping + 1 : ping)))
    filledRef.current = next
    setFilled(next)
  })

  if (!supported || reduceMotion) return null

  return (
    <nav aria-label="Rută prin pagină" className="pointer-events-none fixed left-10 top-[15vh] z-30 h-[70vh] w-6">
      <svg aria-hidden="true" className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 overflow-visible" viewBox="0 0 1 100" preserveAspectRatio="none">
        <motion.path
          d="M .5 0 V 100"
          fill="none"
          pathLength={routeProgress}
          stroke="var(--gold)"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          opacity="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {waypoints.map((waypoint, index) => (
        <button
          key={waypoint.id}
          type="button"
          aria-label={`Mergi la ${waypoint.label}`}
          onClick={() => document.getElementById(waypoint.id)?.scrollIntoView({ behavior: 'smooth' })}
          className="pointer-events-auto absolute left-1/2 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
          style={{ top: `${(index / (waypoints.length - 1)) * 100}%` }}
        >
          {pings[index] > 0 && filled[index] ? (
            <motion.span
              key={pings[index]}
              aria-hidden="true"
              className="absolute h-6 w-6 rounded-full border border-[var(--gold)]"
              initial={{ scale: 0.4, opacity: 0.6 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          ) : null}
          <span
            aria-hidden="true"
            className={`h-2 w-2 rounded-full border-[1.5px] border-[var(--gold)] transition-colors duration-200 ${filled[index] ? 'bg-[var(--gold)]' : 'bg-transparent'}`}
          />
        </button>
      ))}
    </nav>
  )
}

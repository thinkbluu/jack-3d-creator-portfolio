'use client'

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

const waypointConfig = [
  { id: 'about', label: 'Despre', x: 0.9 },
  { id: 'services', label: 'Servicii', x: 0.08 },
  { id: 'process', label: 'Proces', x: 0.88 },
  { id: 'projects', label: 'Escale', x: 0.1 },
  { id: 'faq', label: 'Înainte de îmbarcare', x: 0.85 },
] as const

type Point = { x: number; y: number }
type RouteWaypoint = Point & { id: string; label: string; fraction: number }
type RouteLayout = {
  width: number
  height: number
  path: string
  servicesTop: number
  servicesBottom: number
  startProgress: number
  waypoints: RouteWaypoint[]
  endpoint: Point
}

function createPath(points: Point[]) {
  if (points.length < 2) return ''
  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index]
    const distance = point.y - previous.y
    const controlOffset = Math.max(40, distance * 0.42)
    return `${path} C ${previous.x} ${previous.y + controlOffset}, ${point.x} ${point.y - controlOffset}, ${point.x} ${point.y}`
  }, `M ${points[0].x} ${points[0].y}`)
}

export default function PlottedRoute() {
  const [supported, setSupported] = useState(false)
  const [layout, setLayout] = useState<RouteLayout | null>(null)
  const [fractions, setFractions] = useState<number[]>([])
  const [passed, setPassed] = useState<boolean[]>([])
  const [pings, setPings] = useState<number[]>([])
  const pathRef = useRef<SVGPathElement>(null)
  const previousProgress = useRef(0)
  const previousPassed = useRef<boolean[]>([])
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const routeProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })
  const pathLength = useTransform(routeProgress, (progress) => {
    if (!layout) return 0
    return Math.min(1, Math.max(0, (progress - layout.startProgress) / (1 - layout.startProgress)))
  })

  const measure = useCallback(() => {
    const main = document.querySelector('main')
    const routeOrigin = document.querySelector<HTMLElement>('#ruta [data-route-origin="true"]')
    const contact = document.querySelector<HTMLElement>('#contact [data-route-contact="true"]')
    if (!(main instanceof HTMLElement) || !routeOrigin || !contact) return

    const mainRect = main.getBoundingClientRect()
    const width = main.clientWidth
    const mainPageTop = mainRect.top + window.scrollY
    const localCenter = (element: Element) => {
      const rect = element.getBoundingClientRect()
      return rect.top + window.scrollY - mainPageTop + rect.height / 2
    }

    const originRect = routeOrigin.getBoundingClientRect()
    const start: Point = {
      x: originRect.left + originRect.width / 2 - mainRect.left,
      y: originRect.top + window.scrollY - mainPageTop + originRect.height / 2,
    }
    const maxScroll = Math.max(1, main.scrollHeight - window.innerHeight)
    const startProgress = Math.min(0.98, Math.max(0, (start.y - window.innerHeight * 0.6) / maxScroll))

    const measuredWaypoints = waypointConfig.flatMap((waypoint) => {
      const element = document.getElementById(waypoint.id)
      return element
        ? [{ id: waypoint.id, label: waypoint.label, x: width * waypoint.x, y: localCenter(element), fraction: 0 }]
        : []
    })

    const contactRect = contact.getBoundingClientRect()
    const endpoint = {
      x: contactRect.left + contactRect.width / 2 - mainRect.left,
      y: contactRect.top + window.scrollY - mainPageTop + contactRect.height / 2,
    }
    const contactWaypoint: RouteWaypoint = { ...endpoint, id: 'contact', label: 'Contact', fraction: 1 }
    const points = [start, ...measuredWaypoints, endpoint]
    const services = document.getElementById('services')
    const servicesRect = services?.getBoundingClientRect()

    setLayout({
      width,
      height: main.scrollHeight,
      path: createPath(points),
      servicesTop: servicesRect ? servicesRect.top + window.scrollY - mainPageTop : 0,
      servicesBottom: servicesRect ? servicesRect.bottom + window.scrollY - mainPageTop : 0,
      startProgress,
      waypoints: [...measuredWaypoints, contactWaypoint],
      endpoint,
    })
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)')
    const updateSupport = () => setSupported(query.matches)
    updateSupport()
    query.addEventListener('change', updateSupport)
    return () => query.removeEventListener('change', updateSupport)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    let timeout = 0
    const scheduleMeasure = () => {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(measure, 120)
    }
    const initialMeasure = window.requestAnimationFrame(measure)
    window.addEventListener('load', scheduleMeasure)
    window.addEventListener('resize', scheduleMeasure)
    document.fonts.ready.then(scheduleMeasure)
    const observer = new ResizeObserver(scheduleMeasure)
    const main = document.querySelector('main')
    const contact = document.querySelector('#contact [data-route-contact="true"]')
    const routeOrigin = document.querySelector('#ruta [data-route-origin="true"]')
    if (main) observer.observe(main)
    if (contact) observer.observe(contact)
    if (routeOrigin) observer.observe(routeOrigin)
    document.querySelectorAll('img').forEach((image) => image.addEventListener('load', scheduleMeasure))
    return () => {
      window.cancelAnimationFrame(initialMeasure)
      window.clearTimeout(timeout)
      window.removeEventListener('load', scheduleMeasure)
      window.removeEventListener('resize', scheduleMeasure)
      observer.disconnect()
      document.querySelectorAll('img').forEach((image) => image.removeEventListener('load', scheduleMeasure))
    }
  }, [measure, reduceMotion, supported])

  useEffect(() => {
    const path = pathRef.current
    if (!path || !layout) return
    const totalLength = path.getTotalLength()
    const nextFractions = layout.waypoints.map((waypoint) => {
      let low = 0
      let high = totalLength
      for (let iteration = 0; iteration < 18; iteration += 1) {
        const middle = (low + high) / 2
        if (path.getPointAtLength(middle).y < waypoint.y) low = middle
        else high = middle
      }
      return ((low + high) / 2) / totalLength
    })
    setFractions(nextFractions)
    const initialPassed = nextFractions.map((fraction) => scrollYProgress.get() >= fraction)
    previousPassed.current = initialPassed
    setPassed(initialPassed)
    setPings(nextFractions.map(() => 0))
  }, [layout, scrollYProgress])

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!supported || reduceMotion || fractions.length === 0) return
    const movingDown = latest > previousProgress.current
    previousProgress.current = latest
    const nextPassed = fractions.map((fraction) => latest >= fraction)
    if (movingDown) {
      setPings((current) => current.map((ping, index) => (!previousPassed.current[index] && nextPassed[index] ? ping + 1 : ping)))
    }
    previousPassed.current = nextPassed
    setPassed(nextPassed)
  })

  if (reduceMotion || !layout) return null

  return (
    <nav aria-label="Rută prin pagină" className="pointer-events-none absolute inset-0 z-30 hidden lg:block [@media(pointer:coarse)]:hidden">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${layout.width} ${layout.height}`} preserveAspectRatio="none">
        <defs>
          <clipPath id="services-route-clip">
            <rect x="0" y={layout.servicesTop} width={layout.width} height={Math.max(0, layout.servicesBottom - layout.servicesTop)} />
          </clipPath>
          <filter id="route-endpoint-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <path d={layout.path} fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="8 11" opacity="0.2" vectorEffect="non-scaling-stroke" />
        <motion.path ref={pathRef} d={layout.path} fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeDasharray="8 11" opacity="0.5" pathLength={pathLength} vectorEffect="non-scaling-stroke" />
        <path d={layout.path} fill="none" stroke="rgba(10,18,32,0.35)" strokeWidth="1.5" strokeDasharray="8 11" opacity="0.25" clipPath="url(#services-route-clip)" vectorEffect="non-scaling-stroke" />
        <circle cx={layout.endpoint.x} cy={layout.endpoint.y} r="6" fill="var(--gold)" filter="url(#route-endpoint-glow)" />
      </svg>

      {layout.waypoints.map((waypoint, index) => (
        <button
          key={waypoint.id}
          type="button"
          aria-label={`Mergi la ${waypoint.label}`}
          onClick={() => document.getElementById(waypoint.id)?.scrollIntoView({ behavior: 'smooth' })}
          className="pointer-events-auto absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
          style={{ left: waypoint.x, top: waypoint.y }}
        >
          {pings[index] > 0 && passed[index] ? (
            <motion.span key={pings[index]} aria-hidden="true" className="absolute h-6 w-6 rounded-full border border-[var(--gold)]" initial={{ scale: 0.4, opacity: 0.65 }} animate={{ scale: 1.6, opacity: 0 }} transition={{ duration: 0.5, ease: 'easeOut' }} />
          ) : null}
          <span aria-hidden="true" className={`h-2 w-2 rounded-full border-[1.5px] border-[var(--gold)] transition-colors duration-200 ${passed[index] ? 'bg-[var(--gold)]' : 'bg-transparent'}`} />
        </button>
      ))}
    </nav>
  )
}

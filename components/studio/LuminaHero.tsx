'use client'

import { useEffect, useRef, useState } from 'react'
import TrackedLink from '@/components/TrackedLink'
import { useUi } from '@/lib/i18n/context'
import { whatsappUrl } from '@/lib/site'
import { useLights } from './lights'
import type { LuminaGL } from './lumina-gl'

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Weak devices get the CSS version straight away. */
function lowEnd() {
  const nav = navigator as Navigator & { deviceMemory?: number }
  const coarse = window.matchMedia('(pointer: coarse)').matches
  return coarse && (nav.hardwareConcurrency ?? 8) <= 4 && (nav.deviceMemory ?? 8) <= 4
}

/**
 * The homepage opening. The page starts in near darkness and the visitor's
 * cursor is a soft, warm lamp: the headline is raised out of a dark plaster
 * wall and only reads where the light falls, with its brass words catching
 * highlights. Scrolling brings blue hour up from below. The headline is real
 * text in the page; a CSS version with the same light stands in on weak
 * devices, without WebGL, or with reduced motion, and "lights on" turns the
 * whole thing into calm daylight.
 */
export default function LuminaHero() {
  const { redesign } = useUi()
  const copy = redesign.lumina
  const { on: lightsOn, toggle } = useLights()

  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const dayRef = useRef(lightsOn ? 1 : 0)
  const dayTarget = useRef(lightsOn ? 1 : 0)
  const [gl, setGl] = useState(false)
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    dayTarget.current = lightsOn ? 1 : 0
  }, [lightsOn])

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    const title = titleRef.current
    if (!section || !stage || !canvas || !title) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (coarse) requestAnimationFrame(() => setTouch(true))

    let disposed = false
    let engine: LuminaGL | null = null
    let raf = 0
    let running = false
    let last = performance.now()
    let lastMove = -1e9
    let slowFrames = 0
    let frames = 0
    const size = { width: 1, height: 1 }
    const light = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    let started = false
    let rebuild = 0

    const progress = () => {
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      return travel > 0 ? clamp(-rect.top / travel) : 0
    }

    const placeStart = () => {
      const first = title.querySelector<HTMLElement>('[data-word]')
      const s = stage.getBoundingClientRect()
      if (first) {
        const r = first.getBoundingClientRect()
        light.x = target.x = r.left - s.left + r.width * 0.6
        light.y = target.y = r.top - s.top + r.height * 0.6
      } else {
        light.x = target.x = size.width * 0.3
        light.y = target.y = size.height * 0.45
      }
    }

    const setVars = (p: number, dawn: number) => {
      stage.style.setProperty('--lx', `${light.x.toFixed(1)}px`)
      stage.style.setProperty('--ly', `${light.y.toFixed(1)}px`)
      stage.style.setProperty('--dawn', dawn.toFixed(3))
      stage.style.setProperty('--p', p.toFixed(3))
      stage.style.setProperty('--day', dayRef.current.toFixed(3))
    }

    const tick = (now: number) => {
      raf = 0
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const p = progress()
      const dawn = smooth(0.15, 0.95, p) * 0.75

      // Idle drift when nobody is steering the lamp.
      const t = now / 1000
      if (now - lastMove > 2600) {
        const titleBox = title.getBoundingClientRect()
        const s = stage.getBoundingClientRect()
        const cx = titleBox.left - s.left + titleBox.width * 0.5
        const cy = titleBox.top - s.top + titleBox.height * 0.5
        target.x = cx + Math.sin(t * 0.33) * titleBox.width * 0.42
        target.y = cy + Math.sin(t * 0.51 + 1.2) * titleBox.height * 0.45
      }
      const k = 1 - Math.pow(0.0015, dt)
      light.x += (target.x - light.x) * k
      light.y += (target.y - light.y) * k
      dayRef.current += (dayTarget.current - dayRef.current) * (1 - Math.pow(0.02, dt))

      setVars(p, dawn)
      if (engine) {
        engine.render({ light: [light.x, light.y], power: 1.15 + dawn * 0.4, dawn, day: dayRef.current, time: t })
        // Fall back to CSS if the device can't keep up.
        frames++
        if (dt > 0.045) slowFrames++
        if (frames === 90 && slowFrames > 45) {
          engine.dispose()
          engine = null
          setGl(false)
        }
      }
      if (running) raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
      raf = 0
    }

    const buildText = async () => {
      if (!engine) return
      if (document.fonts) await document.fonts.ready
      if (disposed || !engine) return
      const { drawHeadlineMap } = await import('./lumina-gl')
      const words = Array.from(title.querySelectorAll<HTMLElement>('[data-word]'))
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      engine.setText(drawHeadlineMap(stage, words, dpr))
    }

    const resize = () => {
      const rect = stage.getBoundingClientRect()
      size.width = rect.width
      size.height = rect.height
      engine?.resize(rect.width, rect.height)
      if (!started) {
        placeStart()
        started = true
      }
      window.clearTimeout(rebuild)
      rebuild = window.setTimeout(() => void buildText(), 120)
    }

    const onMove = (event: PointerEvent) => {
      const s = stage.getBoundingClientRect()
      target.x = event.clientX - s.left
      target.y = event.clientY - s.top
      lastMove = performance.now()
    }

    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    visibility.observe(section)
    const observer = new ResizeObserver(resize)
    observer.observe(stage)
    stage.addEventListener('pointermove', onMove, { passive: true })
    stage.addEventListener('pointerdown', onMove, { passive: true })

    resize()
    if (!reduced && !lowEnd()) {
      ;(async () => {
        const { LuminaGL: Engine } = await import('./lumina-gl')
        if (disposed) return
        try {
          engine = new Engine(canvas, Math.min(window.devicePixelRatio || 1, 1.5))
        } catch {
          return
        }
        resize()
        await buildText()
        if (disposed || !engine) return
        setGl(true)
      })()
    }

    return () => {
      disposed = true
      stop()
      window.clearTimeout(rebuild)
      visibility.disconnect()
      observer.disconnect()
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerdown', onMove)
      engine?.dispose()
    }
  }, [])

  const word = (text: string, accent = false) =>
    text.split(' ').map((value, index) => (
      <span key={`${value}-${index}`}>
        <span data-word="" data-accent={accent ? '1' : undefined} className={accent ? 'display-italic lumina-accent' : undefined}>
          {value}
        </span>{' '}
      </span>
    ))

  return (
    <section ref={sectionRef} id="povestea" aria-labelledby="lumina-title" className="lumina relative">
      <div
        ref={stageRef}
        data-gl={gl ? '1' : undefined}
        data-day={lightsOn ? '1' : undefined}
        className={`lumina-stage sticky top-0 h-svh overflow-hidden ${lightsOn ? 'tone-cream' : 'tone-dark'}`}
      >
        <canvas ref={canvasRef} aria-hidden="true" className="lumina-canvas absolute inset-0 h-full w-full" />
        <span aria-hidden="true" className="lumina-css-light" />

        <div className="lumina-lit studio-container relative flex h-full flex-col justify-between pb-6 pt-[clamp(6rem,14svh,8.5rem)]">
          <div className="flex items-start justify-between gap-6">
            <p className="mono-label flex items-center gap-3 text-[var(--fg-3)]">
              <span className="text-[var(--brass-lite)]">00</span>
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
              {copy.kicker}
            </p>
            <button type="button" onClick={toggle} aria-pressed={lightsOn} className="lumina-switch mono-label">
              <span aria-hidden="true" className="lumina-switch-dot" />
              {lightsOn ? copy.lightsOff : copy.lightsOn}
            </button>
          </div>

          <h1 ref={titleRef} id="lumina-title" className="lumina-title display-xl">
            {word(copy.titleBefore)}
            {word(copy.titleAccent, true)}
            {word(copy.titleAfter)}
          </h1>

          <div className="grid items-end gap-8 md:grid-cols-[minmax(0,26rem)_1fr]">
            <div>
              <p className="lumina-intro text-base leading-relaxed text-[var(--fg-2)] md:text-lg">{copy.intro}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#lucrari"
                  data-magnetic
                  className="lumina-primary inline-flex items-center gap-3 rounded-[var(--radius-pill)] px-6 py-3.5 text-sm font-semibold transition-colors"
                >
                  {copy.primary} <span aria-hidden="true">↓</span>
                </a>
                <TrackedLink
                  href={whatsappUrl(copy.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="whatsapp_click"
                  eventProperties={{ placement: 'home_lumina_hero' }}
                  className="lumina-secondary inline-flex items-center rounded-[var(--radius-pill)] border px-6 py-3.5 text-sm font-semibold transition-colors"
                >
                  {copy.secondary}
                </TrackedLink>
              </div>
            </div>
            <div className="flex items-end justify-between gap-6 md:justify-end md:gap-10">
              <p className="lumina-hint mono-label" aria-hidden="true">
                <span className="lumina-hint-dot" /> {touch ? copy.touchHint : copy.hint}
              </p>
              <a href="#lucrari" className="mono-label text-[var(--fg-2)] underline-offset-4 hover:underline">
                {copy.skip} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

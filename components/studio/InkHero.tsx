'use client'

import { useEffect, useRef, useState } from 'react'
import TrackedLink from '@/components/TrackedLink'
import { useUi } from '@/lib/i18n/context'
import { whatsappUrl } from '@/lib/site'
import type { InkGL } from './ink-gl'

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/**
 * The homepage opening as ink in water. The page is cream paper over a live
 * fluid; the cursor drags navy ink (now and then a thread of brass) through
 * it. The headline is a wax resist: printed navy on clean paper, and clean
 * paper wherever the ink pools around it. Drops bloom on arrival, and at the
 * end of the scroll the ink floods up and carries the visitor into the work.
 * The headline is real text; a still paper-and-ink version stands in without
 * WebGL 2 or with reduced motion.
 */
export default function InkHero() {
  const { redesign } = useUi()
  const copy = redesign.ink
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [gl, setGl] = useState(false)
  const [touch, setTouch] = useState(false)
  const [flooded, setFlooded] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    const title = titleRef.current
    if (!section || !stage || !canvas || !title) return
    if (window.matchMedia('(pointer: coarse)').matches) requestAnimationFrame(() => setTouch(true))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let disposed = false
    let engine: InkGL | null = null
    let raf = 0
    let running = false
    let last = performance.now()
    let lastInput = performance.now()
    let nextIdle = performance.now() + 5000
    let splats = 0
    let isFlooded = false
    let rebuild = 0
    const prev = { x: -1, y: -1 }
    const queue: { at: number; run: () => void }[] = []

    const progress = () => {
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      return travel > 0 ? clamp(-rect.top / travel) : 0
    }

    // A few drops bloom around the headline when the page arrives.
    const bloom = (delay: number) => {
      const now = performance.now() + delay
      const s = stage.getBoundingClientRect()
      const t = title.getBoundingClientRect()
      const points = [
        [t.left + t.width * 0.12, t.top + t.height * 0.2],
        [t.left + t.width * 0.78, t.top + t.height * 0.35],
        [t.left + t.width * 0.4, t.top + t.height * 0.95],
        [t.left + t.width * 0.95, t.top + t.height * 0.9],
        [t.left + t.width * 0.05, t.top + t.height * 0.75],
      ]
      points.forEach(([x, y], i) => {
        queue.push({
          at: now + i * 380,
          run: () => {
            const u = (x - s.left) / s.width
            const v = 1 - (y - s.top) / s.height
            const angle = Math.random() * Math.PI * 2
            engine?.splat(u, v, Math.cos(angle) * 400, Math.sin(angle) * 400, 3.2, i === 1 ? 1.2 : 0, 0.012)
          },
        })
      })
    }

    const tick = (now: number) => {
      raf = 0
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now
      const p = progress()
      if (engine) {
        while (queue.length && queue[0].at <= now) queue.shift()!.run()
        // When nobody is touching the ink, a slow drop now and then.
        if (now - lastInput > 5000 && now > nextIdle) {
          nextIdle = now + 3800
          const angle = Math.random() * Math.PI * 2
          engine.splat(0.15 + Math.random() * 0.7, 0.15 + Math.random() * 0.7, Math.cos(angle) * 250, Math.sin(angle) * 250, 1.6, Math.random() < 0.25 ? 0.8 : 0, 0.008)
        }
        engine.step(dt)
        engine.render(smooth(0.55, 1, p), now / 1000)
      }
      const flood = smooth(0.55, 1, p)
      stage.style.setProperty('--flood', flood.toFixed(3))
      if (flood > 0.6 !== isFlooded) {
        isFlooded = flood > 0.6
        setFlooded(isFlooded)
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

    const buildMask = async () => {
      if (!engine) return
      if (document.fonts) await document.fonts.ready
      if (disposed || !engine) return
      const { drawMask } = await import('./ink-gl')
      engine.setMask(
        drawMask(stage, Array.from(title.querySelectorAll<HTMLElement>('[data-word]')), 1, Array.from(stage.querySelectorAll<HTMLElement>('[data-clear]'))),
      )
    }
    const resize = () => {
      const { width, height } = stage.getBoundingClientRect()
      engine?.resize(width, height)
      window.clearTimeout(rebuild)
      rebuild = window.setTimeout(() => void buildMask(), 120)
    }

    const onMove = (event: PointerEvent) => {
      if (!engine) return
      const s = stage.getBoundingClientRect()
      const x = (event.clientX - s.left) / s.width
      const y = 1 - (event.clientY - s.top) / s.height
      if (prev.x >= 0) {
        const dx = (x - prev.x) * (s.width / s.height)
        const dy = y - prev.y
        if (Math.abs(dx) + Math.abs(dy) > 0.0005) {
          splats++
          const gold = splats % 9 === 0 ? 0.9 : 0
          engine.splat(x, y, dx * 6000, dy * 6000, 0.9, gold, 0.0018)
        }
      }
      prev.x = x
      prev.y = y
      lastInput = performance.now()
    }
    const onLeave = () => {
      prev.x = -1
      prev.y = -1
    }

    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    const observer = new ResizeObserver(resize)
    stage.addEventListener('pointermove', onMove, { passive: true })
    stage.addEventListener('pointerleave', onLeave)

    ;(async () => {
      const { InkGL: Engine } = await import('./ink-gl')
      if (disposed) return
      try {
        const small = window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches
        engine = new Engine(canvas, { dpr: Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75), small })
      } catch {
        engine = null
        return
      }
      resize()
      await buildMask()
      if (disposed || !engine) return
      observer.observe(stage)
      visibility.observe(section)
      setGl(true)
      bloom(document.documentElement.dataset.introSeen ? 300 : 1900)
    })()

    return () => {
      disposed = true
      stop()
      window.clearTimeout(rebuild)
      visibility.disconnect()
      observer.disconnect()
      stage.removeEventListener('pointermove', onMove)
      stage.removeEventListener('pointerleave', onLeave)
      engine?.dispose()
    }
  }, [])

  const word = (text: string, accent = false) =>
    text.split(' ').map((value, index) => (
      <span key={`${value}-${index}`}>
        <span data-word="" className={accent ? 'display-italic ink-accent' : undefined}>
          {value}
        </span>{' '}
      </span>
    ))

  return (
    <section ref={sectionRef} id="povestea" aria-labelledby="ink-title" className="ink relative">
      <div ref={stageRef} data-gl={gl ? '1' : undefined} className={`ink-stage sticky top-0 h-svh overflow-hidden ${flooded ? 'tone-dark' : 'tone-cream'}`}>
        <canvas ref={canvasRef} aria-hidden="true" className="ink-canvas absolute inset-0 h-full w-full touch-pan-y" />
        <span aria-hidden="true" className="ink-still" />

        <div className="ink-ui studio-container relative flex h-full flex-col justify-between pb-6 pt-[clamp(6rem,14svh,8.5rem)]">
          <p data-clear="" className="mono-label flex items-center gap-3 self-start text-[var(--fg-3)]">
            <span className="text-[var(--brass-ink)]">00</span>
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
            {copy.kicker}
          </p>

          <h1 ref={titleRef} id="ink-title" className="ink-title display-xl">
            {word(copy.titleBefore)}
            {word(copy.titleAccent, true)}
            {word(copy.titleAfter)}
          </h1>

          <div className="grid items-end gap-8 md:grid-cols-[minmax(0,26rem)_1fr]">
            <div data-clear="">
              <p className="text-base leading-relaxed text-[var(--fg-2)] md:text-lg">{copy.intro}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#lucrari"
                  data-magnetic
                  className="inline-flex items-center gap-3 rounded-[var(--radius-pill)] bg-[var(--ink)] px-6 py-3.5 text-sm font-semibold text-[var(--shell)] transition-colors hover:bg-[var(--navy-2)]"
                >
                  {copy.primary} <span aria-hidden="true">↓</span>
                </a>
                <TrackedLink
                  href={whatsappUrl(copy.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="whatsapp_click"
                  eventProperties={{ placement: 'home_ink_hero' }}
                  className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--line)] px-6 py-3.5 text-sm font-semibold text-[var(--fg)] transition-colors hover:border-[var(--fg)]"
                >
                  {copy.secondary}
                </TrackedLink>
              </div>
            </div>
            <div data-clear="" className="flex items-end justify-between gap-6 md:justify-end md:gap-10">
              <p className="ink-hint mono-label text-[var(--fg-3)]" aria-hidden="true">
                {touch ? copy.touchHint : copy.hint}
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

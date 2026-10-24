'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import TrackedLink from '@/components/TrackedLink'
import { useUi } from '@/lib/i18n/context'
import { whatsappUrl } from '@/lib/site'
import type { CompassGL } from './compass-gl'

const PARTS = ['morning', 'day', 'evening', 'night'] as const
type Part = (typeof PARTS)[number]

/**
 * Sets the part of day and the visit count before the first paint, so the
 * right greeting and colours show at once. A visit counts once per browser
 * session. `?ora=night` (or morning, day, evening) previews a part of day and
 * `?vizita=2` (3, 4) previews a returning visitor.
 */
const DAYPART_SCRIPT = `try{var q=new URLSearchParams(location.search).get('ora');var h=new Date().getHours();var p=['morning','day','evening','night'].indexOf(q)>-1?q:(h>=5&&h<11?'morning':h>=11&&h<18?'day':h>=18&&h<22?'evening':'night');document.documentElement.dataset.daypart=p;var v=parseInt(new URLSearchParams(location.search).get('vizita')||'',10);if(!v){v=parseInt(localStorage.getItem('mast-visits')||'0',10)||0;if(!sessionStorage.getItem('mast-visit-counted')){v+=1;localStorage.setItem('mast-visits',String(v));sessionStorage.setItem('mast-visit-counted','1')}}if(v>=2)document.documentElement.dataset.visit=v>=4?'4':String(v)}catch(e){}`

/**
 * The homepage opening says hello like a person would: good morning, good
 * afternoon, good evening, or "still up?" after hours, in the visitor's own
 * time. Evenings and nights open dark, days open on cream. A brass MAST
 * compass floats behind the greeting and turns toward the cursor.
 */
export default function SalutHero() {
  const { redesign } = useUi()
  const copy = redesign.salut
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dark, setDark] = useState(false)
  const [gl, setGl] = useState(false)

  useEffect(() => {
    const part = document.documentElement.dataset.daypart as Part | undefined
    const id = requestAnimationFrame(() => setDark(part === 'evening' || part === 'night'))
    // Fourth visit and beyond: the tab title says it too.
    if (document.documentElement.dataset.visit === '4') document.title = `${copy.returning.nudgeTitle} · MAST Studio`
    // The header picks its colours from what sits under it; ask it to look
    // again once the greeting's colours and the intro curtain have settled.
    const nudge = () => window.dispatchEvent(new Event('scroll'))
    const timers = [120, 600, 2300].map((ms) => window.setTimeout(nudge, ms))
    return () => {
      cancelAnimationFrame(id)
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [copy.returning.nudgeTitle])

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Data-saver connections keep the static mark: the engine is decoration.
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData) return

    let disposed = false
    let engine: CompassGL | null = null
    let raf = 0
    let idleTimer = 0
    let running = false
    let swapped = false
    let firstFrameAt = 0
    let lastScrollAt = -1e9
    let lastRenderAt = 0
    const pointer: [number, number] = [0, 0]
    const target: [number, number] = [0, 0]
    const night = ['evening', 'night'].includes(document.documentElement.dataset.daypart ?? '') ? 1 : 0

    // The mark's own entrance (crossfade + first ease) runs at full rate;
    // after that, time-driven idle frames are capped at 30fps.
    const INTRO_MS = 1200
    const IDLE_FRAME = 1000 / 30
    const SCROLL_GRACE = 300

    const render = (now: number) => {
      if (!engine) return
      const rect = section.getBoundingClientRect()
      const scroll = Math.min(1, Math.max(0, -rect.top / rect.height))
      engine.render(now / 1000, pointer, scroll, night)
      lastRenderAt = now
      if (!swapped) {
        swapped = true
        firstFrameAt = now
        // First frame is on screen: crossfade from the static mark.
        setGl(true)
      }
    }

    const settled = (now: number) =>
      Math.abs(target[0] - pointer[0]) < 0.001 &&
      Math.abs(target[1] - pointer[1]) < 0.001 &&
      now - lastScrollAt > SCROLL_GRACE &&
      now - firstFrameAt > INTRO_MS

    const tick = (now: number) => {
      raf = 0
      pointer[0] += (target[0] - pointer[0]) * 0.06
      pointer[1] += (target[1] - pointer[1]) * 0.06
      render(now)
      if (settled(now)) {
        // The frame above is the final settled one: the mark never freezes
        // mid-ease. The loop sleeps until the next pointermove/scroll.
        running = false
        return
      }
      const easing = Math.abs(target[0] - pointer[0]) > 0.001 || Math.abs(target[1] - pointer[1]) > 0.001
      const idleOnly = !easing && now - lastScrollAt > SCROLL_GRACE && now - firstFrameAt > INTRO_MS
      const delay = idleOnly ? Math.max(0, IDLE_FRAME - (now - lastRenderAt)) : 0
      if (delay > 0) {
        idleTimer = window.setTimeout(() => {
          idleTimer = 0
          if (running && !disposed) raf = requestAnimationFrame(tick)
        }, delay)
      } else {
        raf = requestAnimationFrame(tick)
      }
    }

    const start = () => {
      if (running || !engine) return
      running = true
      raf = requestAnimationFrame(tick)
    }

    const stop = () => {
      running = false
      if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      if (idleTimer) {
        window.clearTimeout(idleTimer)
        idleTimer = 0
      }
    }

    const onMove = (event: PointerEvent) => {
      target[0] = (event.clientX / window.innerWidth) * 2 - 1
      target[1] = (event.clientY / window.innerHeight) * 2 - 1
      start()
    }
    const onScrollLike = () => {
      lastScrollAt = performance.now()
      start()
    }
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      engine?.resize(width, height)
      // A resize while the loop is asleep still needs one fresh frame, or the
      // canvas keeps showing the old buffer stretched to the new size.
      if (engine && swapped && !running) render(performance.now())
    }
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    const onVisibility = () => (document.hidden ? stop() : start())
    const observer = new ResizeObserver(resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScrollLike, { passive: true })
    window.addEventListener('touchmove', onScrollLike, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    // Start late: only after the page has loaded, the intro curtain has
    // lifted and the browser is idle. Until then the static .salut-mark
    // shows, exactly as before.
    let curtainDone = document.documentElement.dataset.introSeen === '1'
    let pageLoaded = document.readyState === 'complete'
    let booted = false
    const boot = () => {
      if (booted || disposed || !curtainDone || !pageLoaded) return
      booted = true
      const win = window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number
      }
      const whenIdle = (callback: () => void) => {
        if (typeof win.requestIdleCallback === 'function') win.requestIdleCallback(callback, { timeout: 2500 })
        else window.setTimeout(callback, 2500)
      }
      whenIdle(async () => {
        if (disposed) return
        try {
          const { CompassGL: Engine } = await import('./compass-gl')
          if (disposed) return
          const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
          // High-density screens barely benefit from MSAA: skip it there.
          engine = new Engine(canvas, dpr, (window.devicePixelRatio || 1) < 2)
          await engine.load('/icons/mast-mark.svg')
          if (disposed) {
            engine.dispose()
            engine = null
            return
          }
          resize()
          render(performance.now())
          observer.observe(canvas)
          visibility.observe(section)
          start()
        } catch {
          engine?.dispose()
          engine = null
        }
      })
    }
    const onCurtainEnd = (event: AnimationEvent) => {
      if (event.animationName !== 'studio-loader-out') return
      curtainDone = true
      document.removeEventListener('animationend', onCurtainEnd)
      boot()
    }
    // Repeat visits hide the curtain before any animation runs; the timer
    // only covers pages where the curtain animation never fires.
    const curtainFallback = curtainDone ? 0 : window.setTimeout(() => {
      curtainDone = true
      boot()
    }, 4000)
    const onLoad = () => {
      pageLoaded = true
      boot()
    }
    if (!pageLoaded) window.addEventListener('load', onLoad, { once: true })
    document.addEventListener('animationend', onCurtainEnd)
    // Both gates may already be open when the effect runs (repeat visit on a
    // loaded page) — try to boot right away.
    boot()

    return () => {
      disposed = true
      stop()
      if (curtainFallback) window.clearTimeout(curtainFallback)
      document.removeEventListener('animationend', onCurtainEnd)
      window.removeEventListener('load', onLoad)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScrollLike)
      window.removeEventListener('touchmove', onScrollLike)
      document.removeEventListener('visibilitychange', onVisibility)
      visibility.disconnect()
      observer.disconnect()
      engine?.dispose()
    }
  }, [])

  return (
    <section ref={sectionRef} id="povestea" aria-labelledby="salut-title" className={`salut-hero relative ${dark ? 'tone-dark' : 'tone-cream'}`}>
      <script dangerouslySetInnerHTML={{ __html: DAYPART_SCRIPT }} />
      <div className="salut-orb" aria-hidden="true">
        <canvas
          ref={canvasRef}
          className="salut-canvas"
          data-on={gl ? '1' : undefined}
          style={{ transitionDuration: '400ms' }}
        />
        <span className="salut-mark" data-on={gl ? undefined : '1'} style={{ transitionDuration: '400ms' }} />
      </div>
      <div className="studio-container relative flex min-h-svh flex-col justify-between pb-10 pt-[clamp(6.5rem,15svh,9rem)] md:pb-14">
        <h1 id="salut-title" className="mono-label flex items-center gap-3 text-[var(--fg-3)]">
          <span className="text-[var(--accent)]">00</span>
          <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
          MAST Studio · {copy.kicker}
        </h1>
        <div>
          {PARTS.map((part) => (
            <div key={part} className="salut-hello" data-part={part}>
              <p
                className="salut-big display-xl"
                style={{ '--len': copy.greetings[part].hello.length } as CSSProperties}
              >
                {copy.greetings[part].hello}
              </p>
              <p className="salut-line">{copy.greetings[part].line}</p>
            </div>
          ))}
          {(['second', 'third'] as const).map((visit, index) => (
            <div key={visit} className="salut-back" data-visit={index + 2}>
              <p className="salut-big display-xl" style={{ '--len': copy.returning[visit].hello.length } as CSSProperties}>
                {copy.returning[visit].hello}
              </p>
              <p className="salut-line">{copy.returning[visit].line}</p>
            </div>
          ))}
          <div className="salut-back" data-visit="4">
            <p className="salut-nudge display-xl">
              {copy.returning.nudgeBefore}{' '}
              <TrackedLink
                href={whatsappUrl(copy.returning.nudgeMessage)}
                target="_blank"
                rel="noopener noreferrer"
                eventName="whatsapp_click"
                eventProperties={{ placement: 'home_return_nudge' }}
                className="salut-nudge-link display-italic"
              >
                {copy.returning.nudgeLink}
              </TrackedLink>
            </p>
            <p className="salut-line">{copy.returning.nudgeLine}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

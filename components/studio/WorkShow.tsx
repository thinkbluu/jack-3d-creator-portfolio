'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import { getAllProjects } from '@/lib/projects'
import { Kicker, Reveal, SplitHeading } from './Reveal'
import type { Rect, WorkGL } from './work-gl'

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
/** Scroll per project, in viewport heights. */
const STEP = 0.85

/**
 * Selected work, one project at a time and almost full screen. Scroll moves a
 * single WebGL plane from cover to cover with a noise-edged, colour-split
 * transition; the cursor bends a soft lens into the image. Clicking opens the
 * case study: the image grows to fill the screen and the page follows.
 * Every project is a real link with its text in the page, and a plain image
 * crossfade stands in where WebGL is missing or motion is reduced.
 */
export default function WorkShow() {
  const locale = useLocale()
  const href = useHref()
  const router = useRouter()
  const { redesign } = useUi()
  const copy = redesign.work
  const projects = getAllProjects(locale).filter((project) => project.type === 'client' && project.cover)
  const total = projects.length

  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<HTMLAnchorElement>(null)
  const activeRef = useRef(0)
  const expandRef = useRef<{ start: number; href: string } | null>(null)
  const [active, setActive] = useState(0)
  const [gl, setGl] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    const frame = frameRef.current
    if (!stage || !canvas || !frame || !total) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    let engine: WorkGL | null = null
    let raf = 0
    let running = false
    let visible = false
    let lastScroll = window.__lenis?.scroll ?? window.scrollY
    let velocity = 0
    let hover = 0
    let hoverTarget = 0
    const mouse: [number, number] = [0.5, 0.5]
    let size = { width: 0, height: 0 }

    const progress = () => {
      const rect = stage.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      return travel > 0 ? clamp(-rect.top / travel) : 0
    }

    // Without WebGL the DOM images crossfade, driven by the same scroll.
    const update = () => {
      const f = progress() * (total - 1)
      const i = Math.min(total - 2, Math.floor(f))
      const mix = total > 1 ? smooth(0.22, 0.78, f - i) : 0
      const shown = total > 1 ? (mix > 0.5 ? i + 1 : i) : 0
      if (shown !== activeRef.current) {
        activeRef.current = shown
        setActive(shown)
      }
      return { i: Math.max(0, i), mix }
    }

    const tick = (now: number) => {
      raf = 0
      const { i, mix } = update()
      if (engine) {
        const scroll = window.__lenis?.scroll ?? window.scrollY
        const delta = Math.max(-80, Math.min(80, scroll - lastScroll))
        velocity += (delta - velocity) * 0.12
        lastScroll = scroll
        hover += (hoverTarget - hover) * 0.08
        const box = frame.getBoundingClientRect()
        const host = canvas.getBoundingClientRect()
        let rect: Rect = { x: box.left - host.left, y: box.top - host.top, width: box.width, height: box.height }
        let radius = 8
        let dim = 0
        const expanding = expandRef.current
        if (expanding) {
          const e = easeInOut(clamp((now - expanding.start) / 850))
          rect = {
            x: rect.x * (1 - e),
            y: rect.y * (1 - e),
            width: rect.width + (size.width - rect.width) * e,
            height: rect.height + (size.height - rect.height) * e,
          }
          radius = 8 * (1 - e)
          dim = clamp((now - expanding.start - 650) / 400) * 0.92
        }
        const bend = expanding || reduced ? 0 : Math.max(-0.035, Math.min(0.035, velocity * -0.0006))
        engine.render({
          rect,
          from: i,
          to: Math.min(total - 1, i + 1),
          mix: total > 1 ? mix : 0,
          time: now / 1000,
          bend,
          shift: Math.min(0.004, Math.abs(velocity) * 0.00008),
          hover,
          mouse,
          radius,
          dim,
        })
      }
      if (running) raf = requestAnimationFrame(tick)
    }

    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
      raf = 0
    }

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      size = { width, height }
      engine?.resize(width, height)
    }

    const onMove = (event: PointerEvent) => {
      const box = frame.getBoundingClientRect()
      mouse[0] = (event.clientX - box.left) / box.width
      mouse[1] = 1 - (event.clientY - box.top) / box.height
    }
    const onEnter = () => (hoverTarget = 1)
    const onLeave = () => (hoverTarget = 0)

    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else if (!expandRef.current) stop()
    })
    visibility.observe(stage)
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)

    if (!reduced) {
      ;(async () => {
        const { WorkGL: Engine } = await import('./work-gl')
        if (disposed) return
        try {
          const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.75 : 2)
          engine = new Engine(
            canvas,
            projects.map((project) => project.cover),
            dpr,
          )
        } catch {
          engine = null
          return
        }
        resize()
        await engine.ready
        if (disposed) return
        setGl(true)
        if (visible) start()
      })()
    }

    frame.addEventListener('pointermove', onMove, { passive: true })
    frame.addEventListener('pointerenter', onEnter)
    frame.addEventListener('pointerleave', onLeave)
    update()

    return () => {
      disposed = true
      stop()
      visibility.disconnect()
      observer.disconnect()
      frame.removeEventListener('pointermove', onMove)
      frame.removeEventListener('pointerenter', onEnter)
      frame.removeEventListener('pointerleave', onLeave)
      engine?.dispose()
    }
    // The project list only changes with the locale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, total])

  const current = projects[active] ?? projects[0]
  const caseHref = current ? href(`/portofoliu/${current.slug}`) : href('/portofoliu')

  // The cover grows to fill the screen, fades to night, and the case study takes over.
  const open = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!gl || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
    event.preventDefault()
    if (expandRef.current) return
    expandRef.current = { start: performance.now(), href: caseHref }
    setLeaving(true)
    window.__lenis?.stop()
    window.setTimeout(() => {
      window.__lenis?.start()
      router.push(caseHref)
    }, 1050)
  }

  const goTo = (index: number) => {
    const stage = stageRef.current
    if (!stage) return
    const travel = stage.offsetHeight - window.innerHeight
    const target = stage.offsetTop + (total > 1 ? (index / (total - 1)) * travel : 0)
    if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.4 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <section id="lucrari" aria-labelledby="lucrari-titlu" className="tone-dark relative bg-[var(--night)]">
      <div className="studio-container grid gap-10 pb-16 pt-28 md:grid-cols-[1.6fr_1fr] md:items-end md:pb-20 md:pt-40">
        <div>
          <Kicker index="01" label={copy.kicker} className="text-[var(--fg-3)]" />
          <div id="lucrari-titlu" className="mt-6">
            <SplitHeading text={copy.title} className="display-xl text-balance text-[clamp(3rem,7.4vw,7.5rem)]" />
          </div>
        </div>
        <Reveal delay={0.2}>
          <p className="max-w-sm text-lg leading-relaxed text-[var(--fg-2)] md:justify-self-end">{copy.intro}</p>
        </Reveal>
      </div>

      <div
        ref={stageRef}
        className="work-stage relative"
        data-gl={gl ? '1' : undefined}
        data-leaving={leaving ? '1' : undefined}
        style={{ height: `${100 + Math.max(0, total - 1) * STEP * 100}svh` }}
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          <canvas ref={canvasRef} aria-hidden="true" className="work-canvas absolute inset-0 h-full w-full" />

          <Link
            ref={frameRef}
            href={caseHref}
            onClick={open}
            data-no-transition
            data-cursor={redesign.cursor.view}
            aria-label={current ? `${copy.view}: ${current.name}` : copy.all}
            className="work-frame"
          >
            {projects.map((project, index) => (
              <span key={project.slug} className="work-fallback" data-on={index === active ? '1' : undefined}>
                <Image src={project.cover} alt="" fill sizes="(min-width: 768px) 76vw, 92vw" className="object-cover object-top" />
              </span>
            ))}
          </Link>

          <div className="work-copy studio-container">
            {projects.map((project, index) => {
              const state = index === active ? 'on' : index < active ? 'past' : 'next'
              return (
                <article key={project.slug} className="work-item" data-state={state} inert={index !== active}>
                  <p className="work-meta mono-label text-[var(--fg-3)]">
                    <span className="text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
                    <span> / {String(total).padStart(2, '0')}</span>
                    <span aria-hidden="true" className="mx-3 inline-block h-px w-6 bg-current align-middle opacity-40" />
                    {project.categoryLabel} · {project.year}
                    <span className="ml-4 inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`size-1.5 rounded-full ${project.status === 'in-lucru' ? 'bg-[var(--fg-3)]' : 'bg-[var(--brass-lite)]'}`}
                      />
                      {project.status === 'in-lucru' ? copy.inProgress : copy.live}
                    </span>
                  </p>
                  <h3 className="work-name display-xl">
                    <span className="work-mask">
                      <span>{project.name}</span>
                    </span>
                  </h3>
                  <div className="work-side">
                    <p className="text-[var(--fg-2)]">{project.summary}</p>
                    <Link
                      href={href(`/portofoliu/${project.slug}`)}
                      className="mono-label mt-5 inline-flex items-center gap-3 text-[var(--fg)] underline-offset-4 hover:underline"
                    >
                      {copy.view} <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>

          <ol className="work-index" aria-label={copy.kicker}>
            {projects.map((project, index) => (
              <li key={project.slug}>
                <button
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={project.name}
                  aria-current={index === active ? 'true' : undefined}
                  className="mono-label"
                >
                  {String(index + 1).padStart(2, '0')}
                </button>
              </li>
            ))}
          </ol>
          <span aria-hidden="true" className="work-veil" />
        </div>
      </div>

      <div className="studio-container flex justify-center pb-28 pt-10 md:pb-36">
        <Link
          href={href('/portofoliu')}
          data-magnetic
          data-cursor={redesign.cursor.all}
          className="link-block group flex size-[min(64vw,15rem)] items-center justify-center rounded-full border border-[var(--line)] text-center transition-colors duration-500 hover:border-[var(--brass-lite)] hover:bg-[var(--brass-lite)] hover:text-[var(--night)]"
        >
          <span>
            <span className="display-italic block text-[clamp(1.5rem,2.2vw,2.1rem)]">{copy.all}</span>
            <span aria-hidden="true" className="mt-1 block text-2xl">→</span>
          </span>
        </Link>
      </div>
    </section>
  )
}

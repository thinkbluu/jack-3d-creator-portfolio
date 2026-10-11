'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import { getAllProjects } from '@/lib/projects'
import type { BookGL } from './book-gl'
import type { BookProject, Face } from './book-pages'
import { useLights } from './lights'

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
/** Scroll per page turn, in viewport heights. */
const STEP = 0.7
/** Fraction of each scroll step spent turning (the rest is resting on a spread). */
const TURN_FROM = 0.3
const TURN_TO = 0.7

/** Narrow screens show one page at a time: left page, right page, then turn. */
function panFor(f: number) {
  const g = f - Math.floor(f)
  if (g < TURN_FROM) return -1 + 2 * smooth(-TURN_FROM, TURN_FROM, g)
  if (g > TURN_TO) return -1 + 2 * smooth(-TURN_FROM, TURN_FROM, g - 1)
  return 1 - 2 * smooth(TURN_FROM, TURN_TO, g)
}

/**
 * Selected work as a printed monograph lying on a dark desk under the
 * visitor's lamp. Scrolling turns the pages: a foil-stamped cover, a contents
 * page, then a spread per project (plates on the left, the story set in serif
 * on the right). Clicking a spread moves in close and opens the case study.
 * Each project is also a plain link in the page; without WebGL the same
 * projects show as simple spreads.
 */
export default function WorkBook() {
  const locale = useLocale()
  const href = useHref()
  const router = useRouter()
  const { redesign } = useUi()
  const work = redesign.work
  const copy = redesign.book
  const { on: lightsOn, toggle } = useLights()
  const projects = getAllProjects(locale).filter((project) => project.type === 'client' && project.cover)
  const total = projects.length
  const turns = total + 2

  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const spreadRef = useRef(0)
  const dayTarget = useRef(lightsOn ? 1 : 0)
  const zoomRef = useRef<{ start: number; to: string } | null>(null)
  const [spread, setSpread] = useState(0)
  const [state, setState] = useState<'loading' | 'gl' | 'flat'>('loading')
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    dayTarget.current = lightsOn ? 1 : 0
  }, [lightsOn])

  useEffect(() => {
    const stage = stageRef.current
    const canvas = canvasRef.current
    if (!stage || !canvas || !total) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      const id = requestAnimationFrame(() => setState('flat'))
      return () => cancelAnimationFrame(id)
    }
    let disposed = false
    let engine: BookGL | null = null
    let raf = 0
    let running = false
    let last = performance.now()
    let lastMove = -1e9
    let day = dayTarget.current
    const light = { x: 0.3, y: 0.1 }
    const target = { x: 0.3, y: 0.1 }
    let pointer: [number, number] | null = null

    const progress = () => {
      const rect = stage.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      return travel > 0 ? clamp(-rect.top / travel) : 0
    }

    const tick = (now: number) => {
      raf = 0
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const f = progress() * turns
      const sheetTurns = Array.from({ length: turns }, (_, k) => smooth(k + TURN_FROM, k + TURN_TO, f))
      const shown = sheetTurns.filter((t) => t >= 0.5).length
      if (shown !== spreadRef.current) {
        spreadRef.current = shown
        setSpread(shown)
      }
      if (engine) {
        if (pointer && now - lastMove < 2600) {
          const [x, y] = engine.pick(pointer[0], pointer[1])
          target.x = x
          target.y = y
        } else {
          const t = now / 1000
          target.x = Math.sin(t * 0.31) * 0.55
          target.y = Math.sin(t * 0.47 + 1.1) * 0.3
        }
        const k = 1 - Math.pow(0.002, dt)
        light.x += (target.x - light.x) * k
        light.y += (target.y - light.y) * k
        day += (dayTarget.current - day) * (1 - Math.pow(0.02, dt))
        const zooming = zoomRef.current
        const zoom = zooming ? easeInOut(clamp((now - zooming.start) / 900)) : 0
        engine.render({
          turns: sheetTurns,
          light: [light.x, light.y],
          power: 1.6,
          day,
          time: now / 1000,
          pan: panFor(f),
          zoom,
        })
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

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect()
      engine?.resize(width, height)
    }
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer = [((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1]
      lastMove = performance.now()
    }

    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : !zoomRef.current && stop()), {
      rootMargin: '200px 0px',
    })
    const observer = new ResizeObserver(resize)
    stage.addEventListener('pointermove', onMove, { passive: true })

    ;(async () => {
      try {
        const [{ BookGL: Engine }, pages] = await Promise.all([import('./book-gl'), import('./book-pages')])
        if (disposed) return
        const small = window.innerWidth < 768
        const dpr = Math.min(window.devicePixelRatio || 1, small ? 1.75 : 2)
        engine = new Engine(canvas, dpr)
        if (document.fonts) await document.fonts.ready
        const w = 900
        const h = Math.round(w / 0.78)
        pages.setPageScale(small ? 0.72 : 1)
        const data: BookProject[] = projects.map((project) => ({
          slug: project.slug,
          name: project.name,
          category: project.categoryLabel,
          year: project.year,
          summary: project.summary,
          result: project.result,
          stack: project.stack,
          host: project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'maststudio.ro',
          cover: project.cover,
        }))
        const bookCopy = {
          coverTitle: copy.coverTitle,
          coverSub: copy.coverSub,
          coverYears: copy.coverYears,
          coverNote: copy.coverNote,
          index: copy.index,
          result: copy.result,
          built: copy.built,
          open: copy.open,
          end: copy.end,
          endNote: copy.endNote,
          intro: work.intro,
        }
        const images = await Promise.all(data.map((project) => pages.loadImage(project.cover)))
        if (disposed || !engine) return
        const sheets: [Face, Face][] = []
        sheets.push([await pages.drawCover(w, h, bookCopy), pages.drawContents(w, h, bookCopy, data)])
        sheets.push([pages.drawForeword(w, h, bookCopy), pages.drawPlate(w, h, data[0], 0, images[0])])
        for (let i = 0; i < data.length; i++) {
          const back =
            i + 1 < data.length
              ? pages.drawPlate(w, h, data[i + 1], i + 1, images[i + 1])
              : pages.drawColophon(w, h, bookCopy, data.length * 2 + 3)
          sheets.push([pages.drawStory(w, h, data[i], i, bookCopy), back])
        }
        // The last right-hand page never turns: an empty page for the next client.
        sheets.push([pages.drawBlank(w, h, bookCopy), pages.drawEndpaper(w, h)])
        if (disposed || !engine) return
        engine.setSheets(sheets)
        resize()
        observer.observe(canvas)
        visibility.observe(stage)
        setState('gl')
      } catch {
        engine?.dispose()
        engine = null
        if (!disposed) setState('flat')
      }
    })()

    return () => {
      disposed = true
      stop()
      visibility.disconnect()
      observer.disconnect()
      stage.removeEventListener('pointermove', onMove)
      engine?.dispose()
    }
    // The book is rebuilt only when the language changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, total])

  const projectIndex = spread >= 2 && spread <= total + 1 ? spread - 2 : -1
  const current = projectIndex >= 0 ? projects[projectIndex] : null
  const caseHref = current ? href(`/portofoliu/${current.slug}`) : href('/portofoliu')

  const goTo = (index: number) => {
    const stage = stageRef.current
    if (!stage) return
    const travel = stage.offsetHeight - window.innerHeight
    const target = stage.offsetTop + (index / turns) * travel
    if (window.__lenis) window.__lenis.scrollTo(target, { duration: 1.6 })
    else window.scrollTo({ top: target, behavior: 'smooth' })
  }

  const onBookClick = () => {
    if (spread === 0) return goTo(1.05)
    if (spread > total + 1) return router.push(href('/portofoliu'))
    if (!current || zoomRef.current) return
    zoomRef.current = { start: performance.now(), to: caseHref }
    setLeaving(true)
    window.__lenis?.stop()
    window.setTimeout(() => {
      window.__lenis?.start()
      router.push(caseHref)
    }, 1100)
  }

  const label =
    spread === 0
      ? copy.turn
      : spread === 1
        ? copy.index
        : current
          ? `${String(projectIndex + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')} · ${current.name}`
          : copy.end

  if (state === 'flat') {
    return (
      <section id="lucrari" aria-labelledby="lucrari-titlu" className="tone-dark relative bg-[var(--night)] py-28 md:py-40">
        <div className="studio-container">
          <p className="mono-label text-[var(--brass-lite)]">01 — {work.kicker}</p>
          <h2 id="lucrari-titlu" className="display-xl mt-6 text-[clamp(2.8rem,6vw,6rem)]">
            {work.title}
          </h2>
          <ol className="mt-16 grid gap-16">
            {projects.map((project, index) => (
              <li key={project.slug}>
                <Link href={href(`/portofoliu/${project.slug}`)} className="link-block group grid gap-8 rounded-[6px] bg-[#f3ede2] p-6 text-[#1a1714] md:grid-cols-2 md:p-10">
                  <div className="relative aspect-[2/1] overflow-hidden rounded-[4px]">
                    <Image src={project.cover} alt="" fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover object-top" />
                  </div>
                  <div>
                    <p className="mono-label text-[#8a6d2f]">
                      {String(index + 1).padStart(2, '0')} — {project.categoryLabel} · {project.year}
                    </p>
                    <h3 className="display-xl mt-4 text-[clamp(2rem,3.4vw,3.4rem)]">{project.name}</h3>
                    <p className="mt-4 text-[rgba(26,23,20,0.7)]">{project.summary}</p>
                    <p className="mono-label mt-6 text-[#8a6d2f]">{copy.open} →</p>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>
    )
  }

  return (
    <section id="lucrari" aria-labelledby="lucrari-titlu" className={`book relative ${lightsOn ? 'tone-cream' : 'tone-dark'}`}>
      <h2 id="lucrari-titlu" className="sr-only">
        {work.title}
      </h2>
      <div
        ref={stageRef}
        className="book-stage relative"
        data-gl={state === 'gl' ? '1' : undefined}
        data-leaving={leaving ? '1' : undefined}
        data-day={lightsOn ? '1' : undefined}
        style={{ height: `${100 + turns * STEP * 100}svh` }}
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            onClick={onBookClick}
            data-cursor={current ? redesign.cursor.open : spread === 0 ? redesign.cursor.open : undefined}
            className="book-canvas absolute inset-0 h-full w-full"
          />
          <div className="book-poster" aria-hidden="true">
            <span className="book-poster-cover">
              <span className="display-italic">{copy.coverTitle}</span>
            </span>
          </div>

          <div className="book-top studio-container">
            <p className="mono-label flex items-center gap-3">
              <span className="text-[var(--brass-lite)]">01</span>
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
              {work.kicker}
            </p>
            <button type="button" onClick={toggle} aria-pressed={lightsOn} className="lumina-switch mono-label">
              <span aria-hidden="true" className="lumina-switch-dot" />
              {lightsOn ? redesign.lumina.lightsOff : redesign.lumina.lightsOn}
            </button>
          </div>

          <div className="book-caption studio-container">
            <p className="mono-label" aria-live="polite">
              {label}
            </p>
            <div className="flex items-center gap-6">
              {current ? (
                <Link href={caseHref} className="mono-label text-[var(--brass-lite)] underline-offset-4 hover:underline">
                  {copy.open} →
                </Link>
              ) : spread > total + 1 ? (
                <Link href={href('/portofoliu')} className="mono-label text-[var(--brass-lite)] underline-offset-4 hover:underline">
                  {copy.end} →
                </Link>
              ) : null}
              <span className="book-dots" aria-hidden="true">
                {Array.from({ length: turns + 1 }, (_, i) => (
                  <span key={i} data-on={i === spread ? '1' : undefined} />
                ))}
              </span>
            </div>
          </div>

          {/* Every project as a plain link, for keyboards and crawlers. */}
          <ol className="sr-only">
            {projects.map((project) => (
              <li key={project.slug}>
                <Link href={href(`/portofoliu/${project.slug}`)}>
                  {project.name}: {project.summary}
                </Link>
              </li>
            ))}
          </ol>
          <span aria-hidden="true" className="book-veil" />
        </div>
      </div>
    </section>
  )
}

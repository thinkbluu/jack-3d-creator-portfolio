'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import TrackedLink from '@/components/TrackedLink'
import { useLocale, useUi } from '@/lib/i18n/context'
import { getAllProjects } from '@/lib/projects'
import { whatsappUrl } from '@/lib/site'

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const span = (from: number, to: number, value: number) => clamp((value - from) / (to - from))
const ease = (t: number) => t * t * (3 - 2 * t)

/** Scroll windows of the build, as fractions of the pinned travel. */
const WINDOWS = {
  layout: [0.03, 0.22],
  type: [0.2, 0.4],
  colour: [0.42, 0.62],
  image: [0.6, 0.8],
} as const
const LIVE_AT = 0.8
/** Where each stage label takes over in the HUD. */
const STAGE_AT = [0, 0.1, 0.29, 0.5, 0.69, LIVE_AT]

type Vars = CSSProperties & Record<`--${string}`, string | number>

/** A cell that slides from its draft spot into its place on the grid during the layout stage. */
function Cell({
  className = '',
  move,
  draft,
  note,
  children,
}: {
  className?: string
  move: { dx: string; dy: string; rot?: string; sc?: number; delay?: number }
  draft: boolean
  note?: string
  children: ReactNode
}) {
  const style: Vars = {
    '--dx': move.dx,
    '--dy': move.dy,
    '--rot': move.rot ?? '0deg',
    '--sc': move.sc ?? 1,
    '--d': move.delay ?? 0,
  }
  return (
    <div className={`build-cell ${className}`} style={style}>
      {draft && note ? (
        <span aria-hidden="true" className="build-ghost">
          <span className="build-tag build-tag-ghost">{note}</span>
        </span>
      ) : null}
      <div className="build-move">{children}</div>
    </div>
  )
}

/**
 * Headline split into letters for the draft, so it can be set one letter at a
 * time. Letters are plain inline spans and spaces stay real spaces, so the
 * draft wraps and kerns exactly like the finished headline above it.
 */
function SetLetters({ text, offset, total }: { text: string; offset: number; total: number }) {
  let index = offset
  const out: ReactNode[] = []
  text.split(' ').forEach((word, w) => {
    if (w > 0) {
      out.push(' ')
      index++
    }
    for (const letter of Array.from(word)) {
      const i = index++
      out.push(
        <span key={i} className="build-letter" style={{ '--i': (i / total).toFixed(4) } as Vars}>
          {letter}
        </span>,
      )
    }
  })
  return <>{out}</>
}

/**
 * The homepage opening. A MAST Studio hero builds itself as the visitor
 * scrolls: a blueprint on a drafting sheet, boxes snapping to the grid, the
 * headline being set letter by letter, colour pouring in from a corner, images
 * developing, and finally motion switching on. Two copies of the composition
 * share every transform: the draft sheet underneath (decorative, inert) and the
 * finished page on top, revealed by the colour pour. The finished page is the
 * real content, and it is what visitors without JavaScript or with reduced
 * motion see from the start.
 */
export default function BuildHero() {
  const locale = useLocale()
  const { redesign } = useUi()
  const copy = redesign.build
  const projects = getAllProjects(locale).filter((project) => project.type === 'client' && project.cover)

  const sectionRef = useRef<HTMLElement>(null)
  const [stage, setStage] = useState(0)
  const [live, setLive] = useState(false)
  const [shot, setShot] = useState(0)

  const titleWords = `${copy.titleBefore} ${copy.titleAccent} ${copy.titleAfter}`
  const letterTotal = titleWords.length

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      delete root.dataset.build
      const id = requestAnimationFrame(() => {
        setStage(STAGE_AT.length - 1)
        setLive(true)
      })
      return () => cancelAnimationFrame(id)
    }
    root.dataset.build = '0'

    let raf = 0
    let running = false
    let last = ''
    let lastStage = -1
    let lastLive = false

    const stageEl = section.querySelector<HTMLElement>('.build-stage')
    if (!stageEl) return
    const measure = () => {
      const { width, height } = stageEl.getBoundingClientRect()
      section.style.setProperty('--diag', `${Math.hypot(width, height) + 40}px`)
    }

    const frame = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const p = travel > 0 ? clamp(-rect.top / travel) : 1
      const values = [
        span(WINDOWS.layout[0], WINDOWS.layout[1], p),
        span(WINDOWS.type[0], WINDOWS.type[1], p),
        ease(span(WINDOWS.colour[0], WINDOWS.colour[1], p)),
        ease(span(WINDOWS.image[0], WINDOWS.image[1], p)),
      ].map((v) => v.toFixed(4))
      const key = values.join()
      if (key !== last) {
        last = key
        section.style.setProperty('--s2', values[0])
        section.style.setProperty('--s3', values[1])
        section.style.setProperty('--s4', values[2])
        section.style.setProperty('--s5', values[3])
        section.style.setProperty('--p', p.toFixed(4))
      }
      let next = 0
      STAGE_AT.forEach((at, i) => {
        if (p >= at) next = i
      })
      if (next !== lastStage) {
        lastStage = next
        setStage(next)
      }
      const isLive = p >= LIVE_AT
      if (isLive !== lastLive) {
        lastLive = isLive
        setLive(isLive)
      }
      if (running) raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
      raf = 0
    }

    measure()
    frame()
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    visibility.observe(section)
    const resize = new ResizeObserver(measure)
    resize.observe(stageEl)

    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      section.style.setProperty('--mx', ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3))
      section.style.setProperty('--my', ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3))
    }
    section.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      stop()
      visibility.disconnect()
      resize.disconnect()
      section.removeEventListener('pointermove', onPointer)
      delete root.dataset.build
    }
  }, [])

  // Once live, the browser frame cycles through real client sites.
  useEffect(() => {
    if (!live || projects.length < 2) return
    const timer = window.setInterval(() => setShot((value) => (value + 1) % projects.length), 3400)
    return () => window.clearInterval(timer)
  }, [live, projects.length])

  // Keyboard users tabbing into the hero land on the finished page.
  const onFocus = () => {
    const section = sectionRef.current
    if (!section || live) return
    const end = section.offsetTop + section.offsetHeight - window.innerHeight
    if (window.__lenis) window.__lenis.scrollTo(end, { immediate: true })
    else window.scrollTo(0, end)
  }

  const current = projects[shot] ?? projects[0]
  const host = (url?: string) => (url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'maststudio.ro')
  const statValue = Number.parseInt(copy.stat.replace(/\D/g, ''), 10) || 0

  const composition = (draft: boolean) => {
    const Title = draft ? 'p' : 'h1'
    return (
      <div className={`studio-container build-grid ${draft ? 'build-draft-grid' : ''}`}>
        {/* Kicker */}
        <Cell className="build-a-kicker" draft={draft} move={{ dx: '0px', dy: '0px' }}>
          <p className="mono-label flex items-center justify-between gap-6 text-[var(--fg-3)]">
            <span className="flex items-center gap-3">
              <span className="text-[var(--accent)]">00</span>
              <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
              <span>{copy.kicker}</span>
            </span>
            <span className="hidden md:inline">45.75° N · 21.23° E</span>
          </p>
          {draft ? <span className="build-tag build-tag-inline">{copy.notes.kicker}</span> : null}
        </Cell>

        {/* Headline */}
        <div className="build-a-title relative">
          {draft ? (
            <span aria-hidden="true" className="build-dim">
              <span className="build-tag build-tag-dim">{copy.notes.h1}</span>
            </span>
          ) : null}
          <Title
            id={draft ? undefined : 'build-title'}
            className="build-title display-xl text-balance text-[var(--fg)]"
          >
            {draft ? (
              <>
                <SetLetters text={copy.titleBefore} offset={0} total={letterTotal} />{' '}
                <span className="display-italic build-accent-draft">
                  <SetLetters
                    text={copy.titleAccent}
                    offset={copy.titleBefore.length + 1}
                    total={letterTotal}
                  />
                </span>{' '}
                <SetLetters
                  text={copy.titleAfter}
                  offset={copy.titleBefore.length + copy.titleAccent.length + 2}
                  total={letterTotal}
                />
              </>
            ) : (
              <>
                {copy.titleBefore}{' '}
                <span className="display-italic build-accent">{copy.titleAccent}</span> {copy.titleAfter}
              </>
            )}
          </Title>
        </div>

        {/* Intro and actions */}
        <Cell
          className="build-a-intro"
          draft={draft}
          note={copy.notes.text}
          move={{ dx: '5vw', dy: '-4svh', rot: '2deg', sc: 0.95, delay: 0.3 }}
        >
          <p className="build-intro max-w-[24rem] text-base leading-relaxed text-[var(--fg-2)] md:text-lg">
            {draft ? <span className="build-redact">{copy.intro}</span> : copy.intro}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {draft ? (
              <>
                <span className="build-button-draft">{copy.notes.button} · 01</span>
                <span className="build-button-draft">{copy.notes.button} · 02</span>
              </>
            ) : (
              <>
                <a
                  href="#lucrari"
                  data-magnetic
                  className="inline-flex items-center gap-3 rounded-[var(--radius-pill)] bg-[var(--on-dark)] px-6 py-3.5 text-sm font-semibold text-[var(--night)] transition-colors hover:bg-[var(--brass-lite)]"
                >
                  {copy.primary}
                  <span aria-hidden="true">↓</span>
                </a>
                <TrackedLink
                  href={whatsappUrl(copy.message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="whatsapp_click"
                  eventProperties={{ placement: 'home_build_hero' }}
                  className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--line)] px-6 py-3.5 text-sm font-semibold text-[var(--fg)] transition-colors hover:border-[var(--on-dark)]"
                >
                  {copy.secondary}
                </TrackedLink>
              </>
            )}
          </div>
        </Cell>

        {/* Browser frame with real client work */}
        <Cell
          className="build-a-media"
          draft={draft}
          note={`${copy.notes.image} · 1200 × 591`}
          move={{ dx: '-8vw', dy: '5svh', rot: '-2.5deg', sc: 0.88, delay: 0 }}
        >
          <div className="build-frame">
            <div className="build-bar">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="build-dot" />
                <span className="build-dot" />
                <span className="build-dot" />
              </span>
              <span className="build-url mono-label">
                {draft ? 'https://' : (
                  <>
                    <span className={`build-live-dot ${live ? 'is-on' : ''}`} aria-hidden="true" />
                    {host(current?.liveUrl)}
                  </>
                )}
              </span>
              <span className="mono-label hidden opacity-60 sm:inline">
                {draft ? '1200 × 591' : live ? copy.live : copy.stages[4]}
              </span>
            </div>
            <div className="build-shots">
              {draft ? (
                <span aria-hidden="true" className="build-placeholder">
                  <span className="build-tag build-tag-center">{copy.notes.image}</span>
                </span>
              ) : (
                <div className="build-develop">
                  {projects.map((project, index) => (
                    <div
                      key={project.slug}
                      className="build-shot"
                      data-state={index === shot ? 'active' : index === (shot - 1 + projects.length) % projects.length ? 'prev' : 'idle'}
                    >
                      <Image
                        src={project.cover}
                        alt={index === shot ? project.name : ''}
                        fill
                        priority={index === 0}
                        sizes="(min-width: 768px) 60vw, 92vw"
                        className="object-cover object-top"
                      />
                    </div>
                  ))}
                </div>
              )}
              {draft ? null : <span aria-hidden="true" className="build-scan" />}
            </div>
          </div>

          {/* Result card, overlapping the frame on wide screens */}
          <div className="build-card-wrap" aria-hidden={draft || undefined}>
            {draft ? (
              <span className="build-card build-card-draft">
                <span className="build-tag build-tag-center">{copy.notes.card}</span>
              </span>
            ) : (
              <div className="build-card">
                <p className="display-xl text-[clamp(2.4rem,3.6vw,3.4rem)] leading-none">
                  <span className="sr-only">{copy.stat}</span>
                  <span aria-hidden="true" className="build-count" style={{ '--to': statValue } as Vars} />
                </p>
                <p className="mt-3 text-sm leading-snug text-[rgba(26,23,20,0.72)]">{copy.statLabel}</p>
                <p className="mono-label mt-4 text-[#80672e]">{copy.statProject}</p>
              </div>
            )}
          </div>
        </Cell>
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      id="povestea"
      aria-labelledby="build-title"
      data-live={live ? '1' : undefined}
      className="build relative"
    >
      <script
        dangerouslySetInnerHTML={{
          __html:
            "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.build='0'}catch(e){}",
        }}
      />
      <div className="build-stage sticky top-0 h-svh overflow-hidden">
        {/* The drafting sheet */}
        <div aria-hidden="true" inert className="build-draft tone-cream absolute inset-0">
          <div className="build-paper" />
          <div className="studio-container build-columns" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="build-col" style={{ '--c': i } as Vars}>
                <span className="build-col-n">{String(i + 1).padStart(2, '0')}</span>
              </span>
            ))}
          </div>
          <span className="build-ruler" />
          <span className="build-tag build-tag-grid">{copy.notes.grid}</span>
          {composition(true)}
        </div>

        {/* The finished page, poured in */}
        <div className="build-final tone-dark grain absolute inset-0" onFocusCapture={onFocus}>
          <div className="studio-container build-columns build-columns-final" aria-hidden="true">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className="build-col" />
            ))}
          </div>
          {composition(false)}
        </div>
        <span aria-hidden="true" className="build-ring" />

        {/* Progress, readable on both surfaces */}
        <div className="build-hud">
          <div className="studio-container flex items-end justify-between gap-6">
            <ol className="mono-label hidden items-center gap-5 md:flex" aria-hidden="true">
              {copy.stages.map((label, index) => (
                <li key={label} className={`build-step ${stage === index ? 'is-on' : ''} ${stage > index ? 'is-done' : ''}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span> {label}
                </li>
              ))}
              <li className={`build-step ${live ? 'is-on' : ''}`}>
                <span className="build-live-dot is-on" /> {copy.live}
              </li>
            </ol>
            <p className="mono-label md:hidden" aria-hidden="true">
              {live ? copy.done : `${String(stage + 1).padStart(2, '0')} / 05 · ${copy.stages[Math.min(stage, 4)]}`}
            </p>
            <div className="flex items-center gap-6">
              <span className="mono-label hidden lg:inline" aria-hidden="true" style={{ opacity: stage === 0 ? 1 : 0, transition: 'opacity .5s' }}>
                {copy.scroll} ↓
              </span>
              <a href="#lucrari" className="mono-label underline-offset-4 hover:underline">
                {copy.skip} →
              </a>
            </div>
          </div>
          <span className="build-progress" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

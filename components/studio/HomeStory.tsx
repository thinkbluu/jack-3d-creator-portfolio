'use client'

import { useEffect, useRef, useState } from 'react'
import { useUi } from '@/lib/i18n/context'
import type { ParticleEngine, Shape } from './particle-engine'

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Where each chapter's words sit, so the story never repeats a composition. */
const LAYOUTS = [
  'left-0 bottom-[11svh] max-w-[64rem] text-left',
  'right-0 top-[20svh] max-w-[34rem] text-right',
  'left-0 bottom-[12svh] max-w-[38rem] text-left',
  'inset-x-0 bottom-[10svh] mx-auto max-w-[48rem] text-center',
  'left-0 top-[20svh] max-w-[36rem] text-left',
  'right-0 bottom-[12svh] max-w-[42rem] text-right',
]

function Words({ text, state, base }: { text: string; state: -1 | 0 | 1; base: number }) {
  return (
    <>
      {text.split(' ').map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.12em] align-top">
          <span
            className="inline-block"
            style={{
              transform: state === 0 ? 'translateY(0)' : state < 0 ? 'translateY(-110%)' : 'translateY(110%)',
              transition: `transform 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) ${state === 0 ? base + index * 0.035 : 0}s`,
            }}
          >
            {word}&nbsp;
          </span>
        </span>
      ))}
    </>
  )
}

/**
 * The homepage opening: a pinned, six-chapter story told by a WebGL particle
 * field. Scroll scrubs the morph between chapters; the cursor pushes particles
 * away, a click sends a shock wave, holding the pointer gathers them in.
 * All words are real text in the page, so the story reads without WebGL too.
 */
export default function HomeStory() {
  const { redesign } = useUi()
  const story = redesign.story
  const chapters = story.chapters
  const total = chapters.length
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [webgl, setWebgl] = useState(true)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    let disposed = false
    let engine: ParticleEngine | null = null
    let resizeObserver: ResizeObserver | null = null
    let visibility: IntersectionObserver | null = null
    let resizeTimer = 0
    let holdTimer = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768

    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      engine?.pointer(event.clientX - rect.left, event.clientY - rect.top, true)
    }
    const onLeave = () => engine?.pointer(-99999, -99999, false)
    const onDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      engine?.shock(event.clientX - rect.left, event.clientY - rect.top)
      window.clearTimeout(holdTimer)
      holdTimer = window.setTimeout(() => engine?.attract(true), 220)
    }
    const onUp = () => {
      window.clearTimeout(holdTimer)
      engine?.attract(false)
    }

    ;(async () => {
      const [{ ParticleEngine: Engine }, shapes] = await Promise.all([import('./particle-engine'), import('./shapes')])
      if (disposed) return
      try {
        engine = new Engine(canvas, {
          count: small ? 7000 : 16000,
          background: '#0b0f16',
          ink: '#faf7f2',
          accent: '#d4b267',
          trails: !small,
          reduced,
          lift: 0.1,
        })
      } catch {
        setWebgl(false)
        return
      }

      let built: Shape[] = []
      let pair = -1
      const build = async () => {
        if (!engine) return
        const { width, height } = canvas.getBoundingClientRect()
        engine.resize(width, height)
        const lift = height * 0.1
        const n = engine.count
        if (document.fonts) await document.fonts.ready
        built = [
          await shapes.compassShape(width, height, n, lift),
          { kind: 'chaos' },
          shapes.wireframeShape(width, height, n, lift),
          shapes.wordShape(width, height, n, lift, story.word, true),
          { kind: 'waves' },
          { kind: 'sphere' },
        ]
        pair = -1
      }
      await build()
      if (disposed || !engine) return

      engine.onFrame(() => {
        if (!engine || built.length < total) return
        const rect = section.getBoundingClientRect()
        const travel = rect.height - window.innerHeight
        const progress = travel > 0 ? clamp(-rect.top / travel) : 0
        const f = Math.min(total - 1, (progress / 0.94) * (total - 1))
        const i = Math.min(total - 2, Math.floor(f))
        const mix = smoothstep(0.45, 1, f - i)
        if (i !== pair) {
          engine.setPair(built[i], built[i + 1])
          pair = i
        }
        engine.setMix(mix)
        const shown = mix > 0.5 ? i + 1 : i
        if (shown !== activeRef.current) {
          activeRef.current = shown
          setActive(shown)
        }
        if (barRef.current) barRef.current.style.transform = `scaleY(${progress.toFixed(4)})`
      })
      engine.start()

      resizeObserver = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer)
        resizeTimer = window.setTimeout(() => void build(), 180)
      })
      resizeObserver.observe(canvas)
      visibility = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) engine?.start()
        else engine?.stop()
      })
      visibility.observe(section)
      section.addEventListener('pointermove', onMove, { passive: true })
      section.addEventListener('pointerleave', onLeave)
      section.addEventListener('pointerdown', onDown)
      window.addEventListener('pointerup', onUp)
    })()

    return () => {
      disposed = true
      window.clearTimeout(resizeTimer)
      window.clearTimeout(holdTimer)
      resizeObserver?.disconnect()
      visibility?.disconnect()
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      section.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      engine?.dispose()
    }
  }, [story.word, total])

  return (
    <section
      ref={sectionRef}
      id="povestea"
      aria-label={story.label}
      className="tone-dark relative"
      style={{ height: `${total * 100}svh` }}
    >
      <div className="grain sticky top-0 h-svh overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full touch-pan-y" />
        {!webgl ? (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-[40%] size-[min(70vw,70svh)] -translate-x-1/2 -translate-y-1/2 bg-[var(--brass-lite)] opacity-20"
            style={{
              mask: "url('/icons/mast-mark.svg') center / contain no-repeat",
              WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat",
            }}
          />
        ) : null}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% 42%, transparent 52%, rgba(11, 15, 22, 0.86) 100%)' }}
        />

        <div className="studio-container pointer-events-none relative h-full">
          {chapters.map((chapter, index) => {
            const state: -1 | 0 | 1 = index === active ? 0 : index < active ? -1 : 1
            const Title = index === 0 ? 'h1' : 'p'
            return (
              <div
                key={chapter.kicker}
                className={`absolute px-[inherit] ${LAYOUTS[index] ?? LAYOUTS[0]}`}
                style={{ opacity: state === 0 ? 1 : 0, transition: `opacity 0.6s ease ${state === 0 ? 0.1 : 0}s` }}
              >
                <p className="mono-label text-[var(--brass-lite)]">
                  {String(index).padStart(2, '0')} — {chapter.kicker}
                </p>
                <Title
                  className={`mt-4 text-balance text-[var(--on-dark)] ${
                    index === 0
                      ? 'display-xl text-[clamp(2.6rem,6.4vw,6.4rem)]'
                      : 'display-xl text-[clamp(1.9rem,3.8vw,3.6rem)] leading-[1.02]'
                  }`}
                >
                  <Words text={chapter.title} state={state} base={0.15} />
                </Title>
              </div>
            )
          })}

          <div className="absolute right-[inherit] top-1/2 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex" style={{ right: 'clamp(1.25rem, 3vw, 2.5rem)' }}>
            <span className="mono-label text-[var(--on-dark-3)]">
              {String(active).padStart(2, '0')} / {String(total - 1).padStart(2, '0')}
            </span>
            <span className="relative block h-40 w-px bg-[var(--hairline-dark)]">
              <span ref={barRef} className="absolute inset-0 block origin-top bg-[var(--brass-lite)]" style={{ transform: 'scaleY(0)' }} />
            </span>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-5">
          <div className="studio-container flex items-center justify-between gap-6">
            <span
              className="mono-label text-[var(--on-dark-3)] transition-opacity duration-500"
              style={{ opacity: active === 0 ? 1 : 0 }}
              aria-hidden="true"
            >
              {story.scroll} ↓
            </span>
            <span className="mono-label hidden text-[var(--on-dark-3)] md:inline" aria-hidden="true">
              {story.hint}
            </span>
            <a href="#lucrari" className="mono-label text-[var(--on-dark-2)] transition-colors hover:text-[var(--on-dark)]">
              {story.skip} →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

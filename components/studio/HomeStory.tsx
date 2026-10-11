'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useUi } from '@/lib/i18n/context'
import { getAllProjects } from '@/lib/projects'
import street from '@/public/street/manifest.json'
import type { ParticleEngine } from './particle-engine'
import type { ShopLayout, ShopMeta } from './lights-on/shop'

/** Set to '/work/hero-loop.mp4' once that recording is in public/work/. */
const HERO_LOOP: string | null = null

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Where each beat's words sit: the left column on desktop, the top on phones. */
const LAYOUTS = [
  'left-0 top-[16svh] md:top-auto md:bottom-[16svh] max-w-[40rem]',
  'left-0 top-[16svh] md:top-[24svh] max-w-[34rem]',
  'left-0 top-[16svh] md:top-auto md:bottom-[18svh] max-w-[34rem]',
  'left-0 top-[16svh] md:top-[26svh] max-w-[34rem]',
  'left-0 top-[16svh] md:top-auto md:bottom-[18svh] max-w-[34rem]',
  'left-0 top-[16svh] md:top-[24svh] max-w-[36rem]',
]

function Words({ text, state, base }: { text: string; state: -1 | 0 | 1; base: number }) {
  return (
    <>
      {text.split(' ').map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block max-w-full overflow-hidden pb-[0.12em] align-top">
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

/** Mirror the story's build stage onto <html>, so the header and page build with the shop. */
function setDocumentBuild(stage: number | null) {
  const root = document.documentElement
  if (stage === null) delete root.dataset.build
  else if (root.dataset.build !== String(stage)) root.dataset.build = String(stage)
}

/**
 * "Lights on": the homepage opening. A dark shop on a night street is built
 * layer by layer as the visitor scrolls (outline, structure, voice, colour,
 * life) until its lights come on and the crowd of particles starts walking in.
 * The page chrome builds with it through html[data-build]. All words are real
 * text in the page, so the story reads without WebGL too.
 */
export default function HomeStory() {
  const locale = useLocale()
  const { redesign } = useUi()
  const story = redesign.story
  const chapters = story.chapters
  const total = chapters.length
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)
  const counterValueRef = useRef<HTMLSpanElement>(null)
  const activeRef = useRef(0)
  const [active, setActive] = useState(0)
  const [still, setStill] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let disposed = false
    let engine: ParticleEngine | null = null
    let shop: Awaited<ReturnType<typeof import('./lights-on/shop').createShop>> | null = null
    let resizeObserver: ResizeObserver | null = null
    let visibility: IntersectionObserver | null = null
    let resizeTimer = 0
    let holdTimer = 0

    const fallback = () => {
      requestAnimationFrame(() => setStill(true))
      setDocumentBuild(5)
    }
    if (reduced) {
      // Show the lit shop and the finished page; the words still change with scroll below.
      fallback()
    }

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

    const progressOf = () => {
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      return travel > 0 ? clamp(-rect.top / travel) : 0
    }
    const buildOf = (progress: number) => clamp(progress / 0.9) * 5

    // Without WebGL the words and the rail still follow the scroll.
    const onScrollOnly = () => {
      const build = buildOf(progressOf())
      const shown = Math.min(total - 1, Math.floor(build + 0.35))
      if (shown !== activeRef.current) {
        activeRef.current = shown
        setActive(shown)
      }
      if (barRef.current) barRef.current.style.transform = `scaleY(${(build / 5).toFixed(4)})`
    }

    const startWithoutWebgl = () => {
      fallback()
      window.addEventListener('scroll', onScrollOnly, { passive: true })
      onScrollOnly()
    }
    if (reduced) {
      startWithoutWebgl()
      return () => {
        window.removeEventListener('scroll', onScrollOnly)
        setDocumentBuild(null)
      }
    }

    setDocumentBuild(0)
    const covers = getAllProjects(locale)
      .filter((project) => project.type === 'client')
      .map((project) => project.cover)

    ;(async () => {
      const [{ ParticleEngine: Engine }, { createShop }] = await Promise.all([
        import('./particle-engine'),
        import('./lights-on/shop'),
      ])
      if (disposed) return
      const small = coarse || window.innerWidth < 768
      try {
        engine = new Engine(canvas, {
          count: small ? 420 : 900,
          background: '#0b0f16',
          ink: '#faf7f2',
          accent: '#d4b267',
          trails: false,
          reduced,
          lift: 0,
        })
      } catch {
        startWithoutWebgl()
        return
      }
      engine.setPair({ kind: 'street' }, { kind: 'street' })
      engine.setMix(0)
      engine.setAccentMix(0)

      if (document.fonts) await document.fonts.ready
      const family = getComputedStyle(document.documentElement).getPropertyValue('--font-fraunces').trim() || 'Georgia, serif'
      try {
        shop = await createShop(engine, { meta: street.shops.hero as ShopMeta, covers, fontFamily: family, videoSrc: HERO_LOOP })
      } catch {
        engine.dispose()
        engine = null
        startWithoutWebgl()
        return
      }
      if (disposed) {
        shop.dispose()
        return
      }

      let layout: ShopLayout | null = null
      const layoutAll = () => {
        if (!engine || !shop) return
        const { width, height } = canvas.getBoundingClientRect()
        const isSmall = coarse || width < 768
        engine.resize(width, height)
        layout = shop.resize(width, height, isSmall)
        engine.setStreet({
          door: layout.door,
          ground: layout.ground,
          halfWidth: width / 2,
          depth: (layout.ground + height / 2) * 0.82,
        })
        const counter = counterRef.current
        if (counter) {
          if (isSmall) {
            counter.style.left = '50%'
            counter.style.top = `${height / 2 - layout.ground + 20}px`
            counter.style.transform = 'translateX(-50%)'
          } else {
            counter.style.left = `${width / 2 + layout.x - layout.width / 2 - 36}px`
            counter.style.top = `${height / 2 - (layout.ground + layout.height * 0.3)}px`
            counter.style.transform = 'translate(-100%, -50%)'
            counter.style.textAlign = 'right'
          }
        }
      }
      layoutAll()

      const started = performance.now()
      let frames = 0
      let slowFrames = 0
      let last = started
      let lowTier = false
      let counted = false

      engine.onFrame((now) => {
        if (!engine || !shop) return
        // Quality tier: if the first second runs slow, halve the crowd and stop the window animation.
        frames++
        if (frames > 10 && frames < 90 && now - last > 24) slowFrames++
        if (frames === 90 && slowFrames > 35 && !lowTier) {
          lowTier = true
          engine.setDrawCount(engine.count / 2)
        }
        last = now

        const progress = progressOf()
        const build = buildOf(progress)
        const draw = smooth(0, 2400, now - started)
        shop.update(build, draw, (now - started) / 1000, !lowTier)
        engine.setPull(smooth(2.0, 5.0, build))
        engine.setAccentMix(smooth(2.6, 3.4, build))
        setDocumentBuild(Math.min(5, Math.floor(build + 0.25)))

        const shown = Math.min(total - 1, Math.floor(build + 0.35))
        if (shown !== activeRef.current) {
          activeRef.current = shown
          setActive(shown)
        }
        if (barRef.current) barRef.current.style.transform = `scaleY(${(build / 5).toFixed(4)})`

        const counter = counterRef.current
        if (counter) {
          const on = build > 4.6
          counter.dataset.on = on ? 'true' : 'false'
          if (on && !counted && counterValueRef.current) {
            counted = true
            const target = parseInt(story.counterValue.replace(/\D/g, ''), 10) || 0
            const begin = performance.now()
            const tick = (t: number) => {
              const k = clamp((t - begin) / 1400)
              const eased = 1 - Math.pow(1 - k, 3)
              if (counterValueRef.current) counterValueRef.current.textContent = `+${Math.round(eased * target)}%`
              if (k < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        }
      })
      engine.start()

      resizeObserver = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer)
        resizeTimer = window.setTimeout(layoutAll, 160)
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
      window.removeEventListener('scroll', onScrollOnly)
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      section.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      shop?.dispose()
      engine?.dispose()
      setDocumentBuild(null)
    }
  }, [locale, story.counterValue, total])

  return (
    <section ref={sectionRef} id="povestea" aria-label={story.label} className="tone-dark relative" style={{ height: '400svh' }}>
      <div className="grain sticky top-0 h-svh overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full touch-pan-y" />
        {still ? (
          // eslint-disable-next-line @next/next/no-img-element -- a fixed-size still, sized by CSS
          <img
            src="/street/hero/lit.webp"
            alt=""
            aria-hidden="true"
            className="absolute bottom-[19svh] left-1/2 h-[60svh] w-auto -translate-x-1/2 max-md:bottom-[26svh] max-md:h-[34svh] md:left-[67%]"
          />
        ) : null}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 60% 45%, transparent 50%, rgba(11, 15, 22, 0.8) 100%)' }}
        />
        {/* Beat 1: the layout grid shows while the structure goes up. */}
        <div aria-hidden="true" className="bld-grid pointer-events-none absolute inset-0">
          <div className="studio-container grid h-full grid-cols-4 gap-6 md:grid-cols-12">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i} className={`border-x border-[rgba(250,247,242,0.06)] ${i >= 4 ? 'max-md:hidden' : ''}`} />
            ))}
          </div>
        </div>

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
                <p className="mono-label bld-ink text-[var(--brass-lite)]">
                  {String(index).padStart(2, '0')} — {chapter.kicker}
                </p>
                <Title
                  className={`bld-type bld-ink mt-4 text-balance text-[var(--on-dark)] ${
                    index === 0
                      ? 'display-xl text-[clamp(1.9rem,5.4vw,5.6rem)]'
                      : 'display-xl text-[clamp(1.8rem,3.4vw,3.4rem)] leading-[1.02]'
                  }`}
                >
                  <Words text={chapter.title} state={state} base={0.15} />
                </Title>
              </div>
            )
          })}

          <div className="absolute top-1/2 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex" style={{ right: 'clamp(1.25rem, 3vw, 2.5rem)' }}>
            <span className="mono-label bld-ink text-[var(--on-dark-3)]">
              {String(active).padStart(2, '0')} / {String(total - 1).padStart(2, '0')}
            </span>
            <span className="relative block h-40 w-px bg-[var(--hairline-dark)]">
              <span ref={barRef} className="absolute inset-0 block origin-top bg-[var(--brass-lite)]" style={{ transform: 'scaleY(0)' }} />
            </span>
          </div>
        </div>

        <div
          ref={counterRef}
          data-on={still ? 'true' : 'false'}
          className="lights-counter pointer-events-none absolute max-md:text-center"
          style={still ? { right: '6vw', bottom: '22svh' } : undefined}
        >
          <span ref={counterValueRef} className="display-xl block text-[clamp(2.6rem,4.4vw,4.4rem)] leading-none text-[var(--glow)]">
            {still ? story.counterValue : '+0%'}
          </span>
          <span className="mono-label mt-2 block max-w-[14rem] text-[var(--on-dark-2)]">{story.counterLabel}</span>
        </div>

        <div className="absolute inset-x-0 bottom-5">
          <div className="studio-container flex items-center justify-between gap-6">
            <span
              className="mono-label bld-ink text-[var(--on-dark-3)] transition-opacity duration-500"
              style={{ opacity: active === 0 ? 1 : 0 }}
              aria-hidden="true"
            >
              {story.scroll} ↓
            </span>
            <span className="mono-label bld-ink hidden text-[var(--on-dark-3)] md:inline" aria-hidden="true">
              {story.hint}
            </span>
            <a href="#lucrari" className="mono-label bld-ink pointer-events-auto text-[var(--on-dark-2)] transition-colors hover:text-[var(--on-dark)]">
              {story.skip} →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

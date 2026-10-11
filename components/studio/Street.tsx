'use client'

import Link from 'next/link'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import TrackedLink from '@/components/TrackedLink'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import { getProjectBySlug } from '@/lib/projects'
import { EMAIL, EMAIL_HREF, whatsappUrl } from '@/lib/site'
import street from '@/public/street/manifest.json'
import type { ParticleEngine } from './particle-engine'
import { Kicker } from './Reveal'

type Rect = { x: number; y: number; w: number; h: number }
type Meta = { width: number; height: number; sign: Rect[]; windows: Rect[] }
type SignFont = 'serif' | 'italic' | 'sans' | 'mono'

/** The street, left to right. `old` is the generic sign that peels off; `sign` the new one, set in code. */
const STREET: Array<
  | { kind: 'shop'; slug: string; old: string; sign: string; font: SignFont; ink: string }
  | { kind: 'lot' }
> = [
  { kind: 'shop', slug: 'veterinaria-timisoara', old: 'cabinet-veterinar', sign: 'Veterinaria', font: 'sans', ink: '#1d6b45' },
  { kind: 'shop', slug: 'agd-innerpath-consulting', old: 'consultanta', sign: 'AGD Innerpath', font: 'serif', ink: '#0f1b2b' },
  { kind: 'lot' },
  { kind: 'shop', slug: 'decodex', old: 'birou-proiecte', sign: 'DECODEX', font: 'mono', ink: '#172a41' },
  { kind: 'shop', slug: 'oncogen', old: 'laborator', sign: 'OncoGen', font: 'sans', ink: '#a3195b' },
  { kind: 'lot' },
  { kind: 'shop', slug: 'painea-casei', old: 'utilaje-panificatie', sign: 'Pâinea Casei', font: 'italic', ink: '#7a4520' },
  { kind: 'shop', slug: 'asesor', old: 'salon', sign: 'ASESOR', font: 'serif', ink: '#5a2d4c' },
]

/** All facades share one scale: the tallest one fills the street's height. */
const TALLEST = Math.max(...Object.values(street.shops).map((shop) => shop.height))
const STRIPS = 6

const pct = (value: number, of: number) => `${(value / of) * 100}%`
const rectStyle = (r: Rect, meta: Meta): CSSProperties => ({
  left: pct(r.x, meta.width),
  top: pct(r.y, meta.height),
  width: pct(r.w, meta.width),
  height: pct(r.h, meta.height),
})
const union = (rects: Rect[]): Rect | null => {
  if (!rects.length) return null
  const x0 = Math.min(...rects.map((r) => r.x))
  const y0 = Math.min(...rects.map((r) => r.y))
  const x1 = Math.max(...rects.map((r) => r.x + r.w))
  const y1 = Math.max(...rects.map((r) => r.y + r.h))
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }
}
const fontClass: Record<SignFont, string> = {
  serif: 'font-display font-normal',
  italic: 'display-italic',
  sans: 'font-sans font-bold tracking-tight',
  mono: 'font-mono font-medium tracking-[0.12em]',
}

/** One shopfront: facade, sign (old one peeling off, new one beneath), window and light. */
function Facade({
  folder,
  meta,
  sign,
  font = 'serif',
  ink = '#1a1714',
  old,
  media,
  lit,
  peeled,
}: {
  folder: string
  meta: Meta
  sign?: string
  font?: SignFont
  ink?: string
  old?: string
  media?: string
  lit: boolean
  peeled: boolean
}) {
  const signRect = meta.sign[0]
  const windowRect = union(meta.windows)
  const base = `/street/${folder}`
  const signSize = sign ? Math.min(15, 150 / Math.max(6, sign.length)) : 0
  return (
    <div
      className="street-facade relative"
      data-lit={lit ? 'true' : 'false'}
      data-peeled={peeled ? 'true' : 'false'}
      style={{ aspectRatio: `${meta.width} / ${meta.height}`, height: `calc(var(--street-h) * ${meta.height / TALLEST})` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- layered art sized by its container */}
      <img src={`${base}/facade.webp`} alt="" className="street-facade-img absolute inset-0 h-full w-full" draggable={false} />

      {media && windowRect ? (
        <div
          aria-hidden="true"
          className="street-window absolute inset-0"
          style={{ maskImage: `url(${base}/mask-window-a.png)`, WebkitMaskImage: `url(${base}/mask-window-a.png)` }}
        >
          <div className="absolute overflow-hidden" style={rectStyle(windowRect, meta)}>
            {/* eslint-disable-next-line @next/next/no-img-element -- the project's own cover, panned like a page being scrolled */}
            <img src={media} alt="" className="street-window-media h-[160%] w-full object-cover object-top" draggable={false} />
          </div>
          <div className="street-window-light absolute inset-0" />
        </div>
      ) : null}

      {signRect ? (
        <>
          <div
            aria-hidden="true"
            className="street-sign-light absolute inset-0"
            style={{ maskImage: `url(${base}/mask-sign-a.png)`, WebkitMaskImage: `url(${base}/mask-sign-a.png)` }}
          />
          {sign ? (
            <div className="absolute flex items-center justify-center overflow-hidden" style={{ ...rectStyle(signRect, meta), containerType: 'inline-size' }}>
              <span
                className={`street-sign-text block whitespace-nowrap leading-none ${fontClass[font]}`}
                style={{ fontSize: `${signSize}cqi`, color: ink }}
              >
                {sign}
              </span>
            </div>
          ) : null}
          {old ? (
            <div aria-hidden="true" className="street-old absolute" style={{ ...rectStyle(signRect, meta), perspective: '700px' }}>
              {Array.from({ length: STRIPS }, (_, i) => (
                <span
                  key={i}
                  className="street-strip absolute top-0 h-full"
                  style={{
                    left: `${(i / STRIPS) * 100}%`,
                    width: `${100 / STRIPS + 0.4}%`,
                    backgroundImage: `url(/street/old-signs/${old}/sign.webp)`,
                    backgroundSize: `${STRIPS * 100}% 100%`,
                    backgroundPosition: `${(i / (STRIPS - 1)) * 100}% 0`,
                    transitionDelay: `${i * 70}ms`,
                  }}
                />
              ))}
            </div>
          ) : null}
        </>
      ) : null}
      <span aria-hidden="true" className="street-spill pointer-events-none absolute -bottom-[14%] left-1/2 h-[30%] w-[170%] -translate-x-1/2" />
    </div>
  )
}

/**
 * Selected work as a night street of client shops. On desktop vertical scroll
 * walks the street sideways; on phones it is a vertical street. As each shop
 * reaches the middle of the screen its old sign peels off, the client's sign
 * shows, its site plays in the window and the lights come on. The last shop is
 * the visitor's: they type their business name, it is painted on the sign and
 * carried into the WhatsApp message.
 */
export default function Street() {
  const locale = useLocale()
  const href = useHref()
  const { redesign, finalCta, nav } = useUi()
  const copy = redesign.work
  const cta = redesign.cta
  const shops = street.shops as Record<string, Meta & { groundY: number }>

  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [distance, setDistance] = useState(0)
  const [lit, setLit] = useState<Record<string, boolean>>({})
  const [name, setName] = useState('')
  const litOrder = useRef<string[]>([])

  // Desktop: the street is as long as the track; vertical scroll moves it sideways.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const desktop = window.matchMedia('(min-width: 768px)')
    const measure = () => setDistance(desktop.matches ? Math.max(0, track.scrollWidth - window.innerWidth) : 0)
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    desktop.addEventListener('change', measure)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      desktop.removeEventListener('change', measure)
      window.removeEventListener('resize', measure)
    }
  }, [])

  // A shop lights up (and stays lit) once it reaches the middle of the screen.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const items = Array.from(track.querySelectorAll<HTMLElement>('[data-shop]'))
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const all = Object.fromEntries(items.map((item) => [item.dataset.shop!, true]))
      requestAnimationFrame(() => setLit(all))
      return
    }
    const desktop = window.matchMedia('(min-width: 768px)').matches
    const observer = new IntersectionObserver(
      (entries) => {
        const newly = entries.filter((entry) => entry.isIntersecting).map((entry) => (entry.target as HTMLElement).dataset.shop!)
        if (!newly.length) return
        litOrder.current = [...litOrder.current.filter((slug) => !newly.includes(slug)), ...newly]
        setLit((current) => ({ ...current, ...Object.fromEntries(newly.map((slug) => [slug, true])) }))
      },
      { rootMargin: desktop ? '0px -38% 0px -38%' : '-35% 0px -35% 0px' },
    )
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  // The crowd from the opening walks along this street too (desktop only),
  // turning toward the shop that lit up last.
  const nameRef = useRef(name)
  useEffect(() => {
    nameRef.current = name
  }, [name])
  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    const track = trackRef.current
    if (!canvas || !section || !track) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(min-width: 768px) and (pointer: fine)').matches
    if (reduced || !fine) return
    let engine: ParticleEngine | null = null
    let disposed = false
    let visibility: IntersectionObserver | null = null
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      engine?.pointer(event.clientX - rect.left, event.clientY - rect.top, true)
    }
    const onLeave = () => engine?.pointer(-99999, -99999, false)
    ;(async () => {
      const { ParticleEngine: Engine } = await import('./particle-engine')
      if (disposed) return
      try {
        engine = new Engine(canvas, { count: 520, background: '#0b0f16', ink: '#faf7f2', accent: '#d4b267', trails: false, lift: 0 })
      } catch {
        return
      }
      engine.setPair({ kind: 'street' }, { kind: 'street' })
      engine.setMix(0)
      engine.setAccentMix(1)
      const size = () => {
        const { width, height } = canvas.getBoundingClientRect()
        engine?.resize(width, height)
      }
      size()
      engine.onFrame(() => {
        if (!engine) return
        const box = canvas.getBoundingClientRect()
        const target =
          (nameRef.current.trim() ? 'visitor' : undefined) ?? litOrder.current[litOrder.current.length - 1]
        const facade = target ? track.querySelector<HTMLElement>(`[data-shop="${target}"] .street-facade`) : null
        const any = track.querySelector<HTMLElement>('.street-facade')
        const groundRect = (facade ?? any)?.getBoundingClientRect()
        if (!groundRect) return
        const ground = box.height / 2 - (groundRect.bottom - box.top)
        const door = facade?.getBoundingClientRect()
        engine.setStreet({
          door: door
            ? { x: door.left - box.left + door.width * 0.62 - box.width / 2, y: box.height / 2 - (door.bottom - box.top) + door.height * 0.04 }
            : { x: 0, y: ground },
          ground,
          halfWidth: box.width / 2,
          depth: 54,
        })
        engine.setPull(facade && door && door.right > box.left && door.left < box.right ? 1 : 0)
      })
      visibility = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) engine?.start()
        else engine?.stop()
      })
      visibility.observe(section)
      window.addEventListener('resize', size)
      section.addEventListener('pointermove', onMove, { passive: true })
      section.addEventListener('pointerleave', onLeave)
    })()
    return () => {
      disposed = true
      visibility?.disconnect()
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      engine?.dispose()
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  const x = useTransform(smoothProgress, (value) => -value * distance)
  const backdropX = useTransform(smoothProgress, (value) => -value * distance * 0.45)

  const visitorName = name.trim().slice(0, 28)
  const message = cta.message.replace('{name}', visitorName || cta.fallbackName)
  let shopIndex = 0

  return (
    <section
      ref={sectionRef}
      id="lucrari"
      aria-labelledby="lucrari-titlu"
      className="tone-dark relative"
      style={distance ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className="street grain relative overflow-hidden py-24 md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:py-0">
        {/* Upper floors behind the shops, moving slower than the street. */}
        <motion.div
          aria-hidden="true"
          style={distance ? { x: backdropX } : undefined}
          className="street-backdrop pointer-events-none absolute left-0 hidden w-[300vw] md:flex"
        >
          {[1, 2, 3, 1, 2].map((tile, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- decorative backdrop tiles
            <img key={i} src={`/street/backdrop/backdrop-${tile}.webp`} alt="" className="h-full w-auto opacity-30" draggable={false} />
          ))}
        </motion.div>
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" />

        <motion.div
          ref={trackRef}
          style={distance ? { x } : undefined}
          className="street-track relative flex flex-col items-center gap-24 px-[clamp(1.25rem,3vw,2.5rem)] md:w-max md:flex-row md:items-end md:gap-14"
        >
          <div className="flex w-full max-w-xl flex-col justify-end self-start md:w-[32vw] md:max-w-[30rem] md:self-auto md:pb-[calc(var(--caption-h)+1rem)]">
            <Kicker index="01" label={copy.kicker} className="text-[var(--fg-3)]" />
            <h2 id="lucrari-titlu" className="display-xl mt-6 text-balance text-[clamp(2.6rem,5.2vw,5.2rem)]">
              {copy.title}
            </h2>
            <p className="mt-6 max-w-sm text-[var(--fg-2)]">{copy.intro}</p>
          </div>

          {STREET.map((item, i) => {
            if (item.kind === 'lot') {
              const meta = shops['empty-lot']
              return (
                <Link
                  key={`lot-${i}`}
                  href={href('/cerere-oferta')}
                  data-cursor={nav.quote}
                  className="link-block street-item group flex shrink-0 flex-col items-center"
                >
                  <Facade folder="empty-lot" meta={meta} lit={false} peeled />
                  <span className="street-caption block w-full pt-6 text-center">
                    <span className="mono-label block text-[var(--fg-3)]">{copy.lot}</span>
                    <span className="mt-3 block text-[var(--brass-lite)] transition-colors group-hover:text-[var(--on-dark)]">{copy.lotCta}</span>
                  </span>
                </Link>
              )
            }
            const project = getProjectBySlug(item.slug, locale)
            if (!project) return null
            shopIndex++
            const isLit = !!lit[item.slug]
            return (
              <article key={item.slug} data-shop={item.slug} className="street-item flex shrink-0 flex-col items-center">
                <Link href={href(`/portofoliu/${project.slug}`)} data-cursor={copy.enter} aria-label={`${copy.view}: ${project.name}`} className="link-block">
                  <Facade
                    folder={item.slug}
                    meta={shops[item.slug]}
                    sign={item.sign}
                    font={item.font}
                    ink={item.ink}
                    old={item.old}
                    media={project.cover}
                    lit={isLit}
                    peeled={isLit}
                  />
                </Link>
                <div className="street-caption w-full max-w-[22rem] pt-6 md:text-center">
                  <p className="mono-label text-[var(--fg-3)]">
                    <span className="text-[var(--accent)]">{String(shopIndex).padStart(2, '0')}</span> · {project.categoryLabel} · {project.year}
                    {project.status === 'in-lucru' ? ` · ${copy.inProgress}` : ''}
                  </p>
                  <h3 className="display-xl mt-3 text-[clamp(1.7rem,2.4vw,2.4rem)]">
                    <Link href={href(`/portofoliu/${project.slug}`)} className="inline min-h-0 transition-colors hover:text-[var(--brass-lite)]">
                      {project.name}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--fg-2)]">{project.summary}</p>
                </div>
              </article>
            )
          })}

          {/* The visitor's shop: dark until they name it. */}
          <article data-shop="visitor" id="contact" className="street-item flex shrink-0 flex-col items-center md:flex-row md:items-end md:gap-12 md:pb-[var(--caption-h)]">
            <Facade folder="visitor" meta={shops.visitor} sign={visitorName || undefined} font="serif" ink="#80672e" lit={!!visitorName} peeled />
            <div className="w-full max-w-[26rem] pt-8">
              <Kicker index="07" label={cta.kicker} className="text-[var(--fg-3)]" />
              <h2 className="display-xl mt-5 text-balance text-[clamp(2rem,3.2vw,3.2rem)]">
                {cta.title} <span className="display-italic text-[var(--brass-lite)]">{cta.titleAccent}</span>
              </h2>
              <label htmlFor="street-name" className="mono-label mt-8 block text-[var(--fg-3)]">
                {cta.label}
              </label>
              <input
                id="street-name"
                type="text"
                value={name}
                maxLength={40}
                autoComplete="organization"
                placeholder={cta.placeholder}
                onChange={(event) => setName(event.target.value)}
                className="display-italic mt-3 block w-full border-b border-[var(--line)] bg-transparent pb-3 text-[clamp(1.8rem,2.6vw,2.6rem)] text-[var(--on-dark)] outline-none transition-colors placeholder:text-[var(--on-dark-3)] focus:border-[var(--brass-lite)]"
              />
              <p className="mono-label mt-3 text-[var(--fg-3)]" aria-hidden="true">
                {cta.hint}
              </p>
              <TrackedLink
                href={whatsappUrl(message)}
                target="_blank"
                rel="noopener noreferrer"
                eventName="whatsapp_click"
                eventProperties={{ placement: 'home_name_cta' }}
                data-magnetic
                className="mt-8 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--brass-lite)] px-7 py-4 text-center font-semibold text-[var(--night)] transition-colors hover:bg-[var(--on-dark)]"
              >
                {cta.whatsapp} →
              </TrackedLink>
              <p className="mt-5 text-sm text-[var(--fg-2)]">
                <Link href={href('/cerere-oferta')} className="inline min-h-0 text-[var(--fg)] underline-offset-4 hover:underline">
                  {nav.quote}
                </Link>
                {' · '}
                {finalCta.orEmail}{' '}
                <a href={EMAIL_HREF} className="inline min-h-0 text-[var(--fg)] underline-offset-4 hover:underline">
                  {EMAIL}
                </a>
              </p>
            </div>
          </article>

          <Link href={href('/portofoliu')} data-magnetic className="link-block group flex w-[60vw] shrink-0 items-center md:mb-[var(--caption-h)] md:w-[18vw]">
            <span className="flex aspect-square w-full flex-col items-center justify-center rounded-full border border-[var(--line)] text-center transition-colors duration-500 group-hover:border-[var(--brass-lite)] group-hover:bg-[var(--brass-lite)] group-hover:text-[var(--night)]">
              <span className="display-italic text-[clamp(1.4rem,2vw,2rem)]">{copy.all}</span>
              <span aria-hidden="true" className="mt-2 text-2xl">→</span>
            </span>
          </Link>
          <span aria-hidden="true" className="hidden w-[4vw] shrink-0 md:block" />
          <span aria-hidden="true" className="street-ground pointer-events-none absolute inset-x-0 hidden md:block" />
        </motion.div>
      </div>
    </section>
  )
}

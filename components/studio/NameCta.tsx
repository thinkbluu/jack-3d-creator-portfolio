'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import TrackedLink from '@/components/TrackedLink'
import { useHref, useUi } from '@/lib/i18n/context'
import { EMAIL, EMAIL_HREF, whatsappUrl } from '@/lib/site'
import type { ParticleEngine, Shape } from './particle-engine'
import { Kicker, SplitHeading } from './Reveal'

/**
 * The closing call to action: the visitor types their business name and the
 * particle field spells it out, then the WhatsApp message carries that name.
 */
export default function NameCta() {
  const href = useHref()
  const { redesign, finalCta, nav } = useUi()
  const copy = redesign.cta
  const [name, setName] = useState('')
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<ParticleEngine | null>(null)
  const buildRef = useRef<((text: string) => Promise<void>) | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return
    let disposed = false
    let visibility: IntersectionObserver | null = null
    let resizeObserver: ResizeObserver | null = null
    let resizeTimer = 0
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      engineRef.current?.pointer(event.clientX - rect.left, event.clientY - rect.top, true)
    }
    const onLeave = () => engineRef.current?.pointer(-99999, -99999, false)

    let started = false
    const boot = async () => {
      if (started) return
      started = true
      const [{ ParticleEngine: Engine }, shapes] = await Promise.all([import('./particle-engine'), import('./shapes')])
      if (disposed) return
      let engine: ParticleEngine
      try {
        engine = new Engine(canvas, {
          count: small ? 5000 : 11000,
          background: '#0b0f16',
          ink: '#faf7f2',
          accent: '#d4b267',
          trails: !small,
          reduced,
        })
      } catch {
        return
      }
      engineRef.current = engine
      let current: Shape = { kind: 'sphere' }
      let lastText = ''
      buildRef.current = async (text: string) => {
        lastText = text
        const { width, height } = canvas.getBoundingClientRect()
        engine.resize(width, height)
        if (document.fonts) await document.fonts.ready
        const next: Shape = text ? shapes.wordShape(width, height, engine.count, height * 0.12, text, true) : { kind: 'sphere' }
        engine.morphTo(current, next, 1600)
        current = next
      }
      const { width, height } = canvas.getBoundingClientRect()
      engine.resize(width, height)
      engine.setPair({ kind: 'chaos' }, current)
      engine.morphTo({ kind: 'chaos' }, current, 2200)
      engine.start()
      resizeObserver = new ResizeObserver(() => {
        window.clearTimeout(resizeTimer)
        resizeTimer = window.setTimeout(() => void buildRef.current?.(lastText), 200)
      })
      resizeObserver.observe(canvas)
    }

    visibility = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void boot()
          engineRef.current?.start()
        } else {
          engineRef.current?.stop()
        }
      },
      { rootMargin: '200px 0px' },
    )
    visibility.observe(section)
    section.addEventListener('pointermove', onMove, { passive: true })
    section.addEventListener('pointerleave', onLeave)

    return () => {
      disposed = true
      window.clearTimeout(resizeTimer)
      visibility?.disconnect()
      resizeObserver?.disconnect()
      section.removeEventListener('pointermove', onMove)
      section.removeEventListener('pointerleave', onLeave)
      engineRef.current?.dispose()
      engineRef.current = null
      buildRef.current = null
    }
  }, [])

  // Re-shape the field a moment after typing stops.
  useEffect(() => {
    const text = name.trim().slice(0, 28)
    const timer = window.setTimeout(() => void buildRef.current?.(text), 380)
    return () => window.clearTimeout(timer)
  }, [name])

  const message = copy.message.replace('{name}', name.trim() || copy.fallbackName)

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-labelledby="contact-titlu"
      className="tone-dark grain relative flex min-h-svh flex-col overflow-hidden"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 45%, rgba(11, 15, 22, 0.9) 100%)' }}
      />

      <div className="studio-container relative flex flex-1 flex-col justify-between gap-16 py-28 md:py-32">
        <div>
          <Kicker index="07" label={copy.kicker} className="text-[var(--fg-3)]" />
          <div id="contact-titlu" className="mt-6">
            <SplitHeading text={copy.title} accent={copy.titleAccent} className="display-xl text-[clamp(2.6rem,6vw,6rem)]" />
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-end">
          <div>
            <label htmlFor="cta-nume" className="mono-label text-[var(--fg-3)]">
              {copy.label}
            </label>
            <input
              id="cta-nume"
              type="text"
              value={name}
              maxLength={40}
              autoComplete="organization"
              placeholder={copy.placeholder}
              onChange={(event) => setName(event.target.value)}
              className="display-italic mt-3 block w-full border-b border-[var(--line)] bg-transparent pb-3 text-[clamp(2rem,4vw,3.6rem)] text-[var(--on-dark)] outline-none transition-colors placeholder:text-[var(--on-dark-3)] focus:border-[var(--brass-lite)]"
            />
            <p className="mono-label mt-4 text-[var(--fg-3)]" aria-hidden="true">
              {copy.hint}
            </p>
          </div>
          <div className="flex flex-col gap-5 md:items-end">
            <TrackedLink
              href={whatsappUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              eventName="whatsapp_click"
              eventProperties={{ placement: 'home_name_cta' }}
              data-magnetic
              className="items-center justify-center rounded-[var(--radius-pill)] bg-[var(--brass-lite)] px-8 py-4 text-center text-base font-semibold text-[var(--night)] transition-colors hover:bg-[var(--on-dark)]"
            >
              {copy.whatsapp} →
            </TrackedLink>
            <p className="text-[var(--fg-2)] md:text-right">
              <Link href={href('/cerere-oferta')} className="text-[var(--fg)] underline-offset-4 hover:underline">
                {nav.quote}
              </Link>
              {' · '}
              {finalCta.orEmail}{' '}
              <a href={EMAIL_HREF} className="text-[var(--fg)] underline-offset-4 hover:underline">
                {EMAIL}
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

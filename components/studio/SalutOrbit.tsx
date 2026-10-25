'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

export type OrbitCard = {
  key: string
  href?: string
  image?: string
  alt?: string
  eyebrow?: string
  title: string
  text?: string
  /** Large serif quote instead of an image, for reviews. */
  quote?: string
  meta?: ReactNode
}

/** Quote size bucket by length: short quotes read large, long ones stay legible. */
const quoteSize = (quote: string) => (quote.length < 60 ? 's' : quote.length <= 140 ? 'm' : 'l')

/**
 * A ring of cards that turns as you scroll past, like a carousel seen from
 * the front: the cards facing you are bright, the ones going round the back
 * dim. Used for project results now and for client reviews when they are in.
 */
export default function SalutOrbit({
  id,
  title,
  intro,
  cta,
  cards,
  tone = 'dark',
}: {
  id?: string
  title: string
  intro?: string
  cta?: ReactNode
  cards: OrbitCard[]
  tone?: 'dark' | 'cream'
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const ring = ringRef.current
    if (!section || !ring) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const items = Array.from(ring.querySelectorAll<HTMLElement>('[data-orbit]'))
    const step = 360 / items.length
    let raf = 0
    let running = false
    let turn = 0
    const tick = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0
      const target = reduced ? 0 : p * 300 - 30
      turn += (target - turn) * 0.1
      ring.style.transform = `translateZ(calc(var(--r) * -1)) rotateX(-6deg) rotateY(${(-turn).toFixed(2)}deg)`
      items.forEach((item, index) => {
        const angle = ((index * step - turn) * Math.PI) / 180
        const facing = Math.cos(angle)
        item.style.opacity = (0.25 + 0.75 * Math.max(0, facing)).toFixed(3)
        item.style.pointerEvents = facing > 0.6 ? 'auto' : 'none'
      })
      if (running) raf = requestAnimationFrame(tick)
    }
    const visibility = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
      if (running && !raf) raf = requestAnimationFrame(tick)
    })
    visibility.observe(section)
    tick()
    return () => {
      running = false
      cancelAnimationFrame(raf)
      visibility.disconnect()
    }
  }, [cards.length])

  const step = 360 / Math.max(1, cards.length)

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={title}
      className={`salut-orbit relative ${tone === 'dark' ? 'tone-dark' : 'tone-cream'}`}
      style={{ '--n': cards.length } as CSSProperties}
    >
      <div className="salut-orbit-stage sticky top-0 h-svh overflow-hidden">
        <div className="studio-container relative z-10 pt-[clamp(6rem,14svh,8.5rem)]">
          <h2 className="salut-orbit-title display-xl">{title}</h2>
          {intro ? <p className="mt-5 max-w-md text-lg text-[var(--fg-2)]">{intro}</p> : null}
          {cta}
        </div>
        <div className="salut-orbit-view" aria-hidden="false">
          <div ref={ringRef} className="salut-orbit-ring">
            {cards.map((card, index) => {
              const style = { '--a': `${index * step}deg`, '--tilt': `${index % 2 ? 3 : -3}deg` } as CSSProperties
              const body =
                card.quote && !card.image ? (
                  <span className="salut-orbit-review">
                    <span className="salut-orbit-review-top">
                      <span className="salut-orbit-stars">{card.eyebrow}</span>
                      <span className="salut-orbit-source">Google</span>
                    </span>
                    <span className="salut-orbit-mark" aria-hidden="true">
                      “
                    </span>
                    <span className="salut-orbit-quote" data-size={quoteSize(card.quote)}>
                      {card.quote}
                    </span>
                    <span className="salut-orbit-foot">
                      <span className="salut-orbit-reviewer">{card.title}</span>
                      <span className="salut-orbit-sub">Recenzie Google</span>
                    </span>
                  </span>
                ) : (
                  <>
                    {card.image ? (
                      <span className="salut-orbit-img">
                        <Image src={card.image} alt={card.alt ?? card.title} fill loading="eager" sizes="340px" className="object-cover object-[right_center]" />
                      </span>
                    ) : null}
                    <span className="salut-orbit-text">
                      {card.eyebrow ? <span className="mono-label salut-orbit-eyebrow">{card.eyebrow}</span> : null}
                      {card.quote ? <span className="salut-orbit-quote display-xl">“{card.quote}”</span> : null}
                      <span className="salut-orbit-name display-xl">{card.title}</span>
                      {card.text ? <span className="salut-orbit-line">{card.text}</span> : null}
                      {card.meta}
                    </span>
                  </>
                )
              return card.href ? (
                <Link key={card.key} href={card.href} data-orbit="" className="salut-orbit-card link-block" style={style}>
                  {body}
                </Link>
              ) : (
                <article key={card.key} data-orbit="" className="salut-orbit-card" style={style}>
                  {body}
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

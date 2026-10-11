'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

export type ValueCard = { title: string; text: string }

/**
 * A statement that stays put while value cards are set down over it, one by
 * one, each in its own place, and a brass seal is pressed onto the corner of
 * each card once it lands. Scrolling back lifts them again. Phones and
 * reduced motion get the cards in a plain list under the statement.
 */
export default function ValuesDrop({ label, statement, cards }: { label: string; statement: string; cards: ValueCard[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const items = Array.from(section.querySelectorAll<HTMLElement>('[data-value]'))
    const wide = window.matchMedia('(min-width: 900px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    const update = () => {
      frame = 0
      if (!wide.matches || reduced.matches) {
        items.forEach((item) => item.setAttribute('data-down', ''))
        return
      }
      const rect = section.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 1
      items.forEach((item, index) => {
        const at = 0.08 + (index / items.length) * 0.72
        item.toggleAttribute('data-down', progress >= at)
      })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    section.setAttribute('data-ready', '')
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className="values tone-cream" aria-label={label}>
      <div className="values-stage">
        <div className="studio-container values-statement-wrap">
          <p className="mono-label flex items-center gap-3 text-[var(--fg-3)]">
            <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
            {label}
          </p>
          <p className="values-statement display-xl">{statement}</p>
        </div>
        <ul className="values-cards">
          {cards.map((card, index) => (
            <li key={card.title} data-value="" className={`value-card value-pos-${index + 1}`} style={{ '--i': index } as CSSProperties}>
              <span className="mono-label value-num">{String(index + 1).padStart(2, '0')}</span>
              <h3 className="value-title display-xl">{card.title}</h3>
              <p className="value-text">{card.text}</p>
              <span aria-hidden="true" className="value-seal">
                <span className="value-seal-mark" />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

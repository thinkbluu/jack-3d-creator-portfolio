'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { useHref, useUi } from '@/lib/i18n/context'

/**
 * One confident sentence with a rotating last word, then a paragraph that
 * fills in, word by word, as it scrolls past, next to the ways in.
 */
export default function SalutStatement() {
  const href = useHref()
  const { redesign } = useUi()
  const copy = redesign.salut
  const [word, setWord] = useState(0)
  const fillRef = useRef<HTMLParagraphElement>(null)
  const words = copy.fill.split(' ')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => setWord((value) => (value + 1) % copy.words.length), 2200)
    return () => window.clearInterval(timer)
  }, [copy.words.length])

  useEffect(() => {
    const el = fillRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1')
      return
    }
    let raf = 0
    let running = false
    const tick = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = Math.min(1, Math.max(0, (vh * 0.85 - rect.top) / (rect.height + vh * 0.35)))
      el.style.setProperty('--p', p.toFixed(4))
      if (running) raf = requestAnimationFrame(tick)
    }
    const visibility = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting
      if (running && !raf) raf = requestAnimationFrame(tick)
    })
    visibility.observe(el)
    return () => {
      running = false
      cancelAnimationFrame(raf)
      visibility.disconnect()
    }
  }, [])

  return (
    <section aria-labelledby="salut-statement" className="tone-cream salut-statement relative py-28 md:py-40">
      <div className="studio-container">
        <h2 id="salut-statement" className="salut-say display-xl">
          {copy.statement}{' '}
          <span className="salut-words">
            {copy.words.map((value, index) => (
              <span
                key={value}
                className="display-italic"
                data-state={index === word ? 'on' : index === (word - 1 + copy.words.length) % copy.words.length ? 'out' : 'in'}
                aria-hidden={index === word ? undefined : true}
              >
                {value}
              </span>
            ))}
          </span>
        </h2>

        <div className="mt-24 grid gap-14 md:mt-32 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-20">
          <p ref={fillRef} className="salut-fill display-xl" style={{ '--n': words.length } as CSSProperties}>
            {words.map((value, index) => (
              <span key={`${value}-${index}`} style={{ '--i': index } as CSSProperties}>
                {value}{' '}
              </span>
            ))}
          </p>
          <ul className="salut-links self-end">
            {copy.links.map((link) => (
              <li key={link.label}>
                {link.href.startsWith('#') ? (
                  <a href={link.href}>
                    {link.label} <span aria-hidden="true">→</span>
                  </a>
                ) : (
                  <Link href={href(link.href)}>
                    {link.label} <span aria-hidden="true">→</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

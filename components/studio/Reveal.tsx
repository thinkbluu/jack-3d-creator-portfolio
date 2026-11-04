'use client'

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from 'react'

/**
 * Fade and rise into view once.
 *
 * The hidden state lives in CSS under a desktop-only media query (see
 * `.reveal-*` in globals.css), so the content is visible at first paint on
 * phones, for reduced-motion users and without JavaScript — the animation
 * must never delay LCP. On desktop the element is server-rendered hidden and
 * an IntersectionObserver swaps in the transition, matching the old
 * framer-motion `whileInView` behaviour (threshold 0.2, once).
 */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(min-width: 768px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.removeAttribute('data-reveal-pending')
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.removeAttribute('data-reveal-pending')
        el.setAttribute('data-reveal-shown', '')
        observer.disconnect()
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      data-reveal-pending=""
      className={className}
      style={{ '--reveal-y': `${y}px`, '--reveal-delay': `${Math.round(delay * 1000)}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}

/**
 * Headline whose words rise out of a mask, one after another, when it enters
 * the viewport. `accent` is appended on its own line in italic brass.
 *
 * Like Reveal, the hidden state is CSS-gated to desktops: on mobile the words
 * are plain visible text in the server HTML, so the h1 can become LCP without
 * waiting for hydration.
 */
export function SplitHeading({
  text,
  accent,
  as: Tag = 'h2',
  className = '',
  accentClassName = 'display-italic text-[var(--brass-lite)]',
}: {
  text: string
  accent?: string
  as?: ElementType
  className?: string
  accentClassName?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(min-width: 768px)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.removeAttribute('data-split-pending')
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.removeAttribute('data-split-pending')
        el.setAttribute('data-split-shown', '')
        observer.disconnect()
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const words = text.split(' ')
  const accentWords = accent ? accent.split(' ') : []
  let index = 0
  const word = (value: string, extra = '') => {
    const i = index++
    return (
      <span key={`${value}-${i}`} className="split-word">
        <span className={`split-inner ${extra}`} style={{ '--split-i': i } as CSSProperties}>
          {value}&nbsp;
        </span>
      </span>
    )
  }

  return (
    <div ref={ref} data-split-pending="" className="split-heading">
      <Tag className={className}>
        {words.map((value) => word(value))}
        {accentWords.length ? (
          <>
            <br />
            {accentWords.map((value) => word(value, accentClassName))}
          </>
        ) : null}
      </Tag>
    </div>
  )
}

/** Small mono kicker with a brass index: "01 — Lucrări". */
export function Kicker({ index, label, className = '' }: { index?: string; label: string; className?: string }) {
  return (
    <p className={`mono-label flex items-center gap-3 ${className}`}>
      {index ? <span className="text-[var(--accent)]">{index}</span> : null}
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
      <span>{label}</span>
    </p>
  )
}

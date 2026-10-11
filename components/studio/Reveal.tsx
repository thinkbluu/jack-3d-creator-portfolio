'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ElementType, ReactNode } from 'react'

const EASE = [0.2, 0.7, 0.2, 1] as const

/** Fade and rise into view once. */
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
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Headline whose words rise out of a mask, one after another, when it enters
 * the viewport. `accent` is appended on its own line in italic brass.
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
  const reduced = useReducedMotion()
  const words = text.split(' ')
  const accentWords = accent ? accent.split(' ') : []
  const word = (value: string, index: number, extra = '') => (
    <span key={`${value}-${index}`} className="inline-block overflow-hidden pb-[0.12em] align-top">
      <motion.span
        className={`inline-block ${extra}`}
        variants={{ hidden: { y: reduced ? 0 : '110%' }, shown: { y: 0 } }}
        transition={{ duration: reduced ? 0 : 0.9, delay: reduced ? 0 : index * 0.05, ease: EASE }}
      >
        {value}&nbsp;
      </motion.span>
    </span>
  )
  return (
    <motion.div initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.4 }}>
      <Tag className={className}>
        {words.map((value, index) => word(value, index))}
        {accentWords.length ? (
          <>
            <br />
            {accentWords.map((value, index) => word(value, words.length + index, accentClassName))}
          </>
        ) : null}
      </Tag>
    </motion.div>
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

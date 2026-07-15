'use client'

import { useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface ChartKickerProps {
  bearing: string
  label: string
  paper?: boolean
  coords?: boolean
}

function RollingDigit({ digit, delay, active, reduced }: { digit: string; delay: number; active: boolean; reduced: boolean | null }) {
  const [display, setDisplay] = useState(digit)

  useEffect(() => {
    if (!active || reduced) return

    const timers = [0, 90, 180].map((offset) =>
      window.setTimeout(() => setDisplay(String(Math.floor(Math.random() * 10))), delay + offset),
    )
    timers.push(window.setTimeout(() => setDisplay(digit), delay + 270))
    return () => timers.forEach(window.clearTimeout)
  }, [active, delay, digit, reduced])

  return <span className="inline-block w-[1ch] text-center tabular-nums">{display}</span>
}

function BearingDigits({ bearing }: { bearing: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const reduced = useReducedMotion()
  const digits = bearing.padStart(2, '0').slice(-2).split('')

  return (
    <>
      <span className="sr-only">BRG {bearing}</span>
      <span ref={ref} aria-hidden="true" className="inline-flex tabular-nums">
        <span>BRG&nbsp;</span>
        <span className="inline-flex w-[2ch]">
          <RollingDigit digit={digits[0]} delay={0} active={inView} reduced={reduced} />
          <RollingDigit digit={digits[1]} delay={60} active={inView} reduced={reduced} />
        </span>
      </span>
    </>
  )
}

export default function ChartKicker({ bearing, label, paper = false, coords = false }: ChartKickerProps) {
  return (
    <div className={`mb-4 flex w-full items-center justify-between gap-6 ${paper ? 'text-[rgba(10,18,32,0.38)]' : 'text-[var(--text-3)]'}`}>
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em]">
        <BearingDigits bearing={bearing} /> · {label}
      </p>
      {coords ? (
        <p className="hidden text-right text-[0.65rem] font-medium uppercase tracking-[0.2em] md:block">
          45.75° N · 21.23° E
        </p>
      ) : null}
    </div>
  )
}

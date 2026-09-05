'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { applyConsent, getStoredConsent } from '@/lib/analytics'

const GTAG_ID = process.env.NEXT_PUBLIC_GTAG_ID ?? 'G-WT5MMP4M9D'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!GTAG_ID) return
    // Read consent only after mount: localStorage is client-only, so gating on it
    // during render would cause a hydration mismatch. Defer to the next frame to
    // keep this out of the synchronous effect body.
    const id = requestAnimationFrame(() => {
      if (getStoredConsent() === null) setVisible(true)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  if (!GTAG_ID || !visible) return null

  function decide(state: 'granted' | 'denied') {
    applyConsent(state)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label="Consimțământ pentru măsurare"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--shell-warm)] p-5 shadow-[0_18px_40px_-24px_rgba(28,24,20,0.55)] md:inset-x-0"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-sm leading-relaxed text-[var(--ink-2)]">
          Folosim cookie-uri de măsurare pentru a înțelege ce funcționează. Le activăm doar cu acordul tău.{' '}
          <Link
            href="/cookies"
            className="font-semibold text-[var(--brass)] underline underline-offset-4"
          >
            Detalii
          </Link>
          .
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => decide('denied')}
            className="min-h-11 rounded-[var(--radius-pill)] border-[1.5px] border-[var(--hairline)] px-5 font-sans text-sm font-semibold text-[var(--ink-2)] transition-colors hover:border-[var(--brass)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brass)]"
          >
            Refuz
          </button>
          <button
            type="button"
            onClick={() => decide('granted')}
            className="min-h-11 rounded-[var(--radius-pill)] bg-[var(--ink)] px-5 font-sans text-sm font-bold text-[var(--shell)] transition-colors hover:bg-[#2E2822] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brass)]"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}

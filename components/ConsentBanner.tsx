'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { applyConsent, getStoredConsent } from '@/lib/analytics'
import { GA4_ID } from '@/lib/ads'
import { CONSENT_OPEN_EVENT } from '@/lib/consent'
import { useHref, useUi } from '@/lib/i18n/context'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!GA4_ID) return
    // Read consent only after mount: localStorage is client-only, so gating on it
    // during render would cause a hydration mismatch. Defer to the next frame to
    // keep this out of the synchronous effect body.
    const id = requestAnimationFrame(() => {
      if (getStoredConsent() === null) setVisible(true)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  // The footer "Cookie settings" button re-opens the banner, even after the
  // visitor has already answered, so the choice can be changed at any time.
  useEffect(() => {
    const open = () => setVisible(true)
    window.addEventListener(CONSENT_OPEN_EVENT, open)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open)
  }, [])

  const href = useHref()
  const { consent } = useUi()

  if (!GA4_ID || !visible) return null

  function decide(state: 'granted' | 'denied') {
    applyConsent(state)
    setVisible(false)
  }

  return (
    <div
      role="dialog"
      aria-label={consent.label}
      className="fixed inset-x-3 bottom-3 z-[60] max-w-md rounded-[10px] border border-[rgba(250,247,242,0.12)] bg-[rgba(11,15,22,0.92)] p-5 text-[#faf7f2] shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl md:inset-x-auto md:bottom-6 md:left-6"
    >
      <p className="mono-label text-[var(--brass-lite)]">Cookies</p>
      <p className="mt-3 font-sans text-sm leading-relaxed text-[rgba(250,247,242,0.74)]">
        {consent.body}{' '}
        <Link href={href('/cookies')} className="inline min-h-0 text-[#faf7f2] underline underline-offset-4">
          {consent.details}
        </Link>
        .
      </p>
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => decide('denied')}
          className="mono-label min-h-11 rounded-[var(--radius-pill)] border border-[rgba(250,247,242,0.2)] px-5 text-[#faf7f2] transition-colors hover:border-[#faf7f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brass-lite)]"
        >
          {consent.refuse}
        </button>
        <button
          type="button"
          onClick={() => decide('granted')}
          className="mono-label min-h-11 rounded-[var(--radius-pill)] bg-[var(--brass-lite)] px-5 text-[var(--night)] transition-colors hover:bg-[#faf7f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brass-lite)]"
        >
          {consent.accept}
        </button>
      </div>
    </div>
  )
}

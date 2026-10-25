'use client'

import { useEffect, useRef } from 'react'

import { isNoDepositActive } from '@/lib/offer'

const DISMISS_KEY = 'mast_offer_bar_dismissed'

/**
 * Dismiss button for the offer announcement bar. Remembers the choice for the
 * session (try/catch: private mode simply skips persistence) and hides the bar
 * automatically once the offer end date passes, so pages that were prerendered
 * while the offer was active do not keep showing it.
 */
export default function OfferBarDismiss() {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const bar = ref.current?.closest('[data-offer-bar]')
    if (!bar) return
    try {
      if (window.sessionStorage.getItem(DISMISS_KEY) === '1') {
        bar.remove()
        return
      }
    } catch {
      // Storage unavailable; the bar simply stays visible.
    }
    if (!isNoDepositActive()) bar.remove()
  }, [])

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Închide anunțul"
      onClick={() => {
        const bar = ref.current?.closest('[data-offer-bar]')
        if (bar) bar.remove()
        try {
          window.sessionStorage.setItem(DISMISS_KEY, '1')
        } catch {
          // Storage unavailable; dismissal lasts for this page view only.
        }
      }}
      className="flex size-6 shrink-0 items-center justify-center rounded-full text-[rgba(250,247,242,0.6)] transition-colors hover:text-[#faf7f2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b]"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M1 1l8 8M9 1l-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </button>
  )
}

'use client'

import { useEffect } from 'react'
import { CONSENT_EVENT, getStoredConsent, type ConsentState } from '@/lib/analytics'

let requested = false

function loadGoogleTag(id: string) {
  if (requested) return
  requested = true
  // The consent defaults and the stub `gtag` come from the beforeInteractive
  // script in the layout; these calls queue in dataLayer until gtag.js runs.
  window.gtag?.('js', new Date())
  window.gtag?.('config', id)
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.appendChild(script)
}

/**
 * Loads Google Tag only after the visitor accepts measurement, so nothing is
 * sent to Google before that (Consent Mode "basic"). Visitors who accepted on
 * an earlier visit get the tag once the page is idle.
 */
export default function GoogleTag({ id }: { id: string }) {
  useEffect(() => {
    let timer: number | undefined
    if (getStoredConsent() === 'granted') {
      timer = window.setTimeout(() => {
        if ('requestIdleCallback' in window) window.requestIdleCallback(() => loadGoogleTag(id))
        else loadGoogleTag(id)
      }, 0)
    }

    const onConsent = (event: Event) => {
      if ((event as CustomEvent<ConsentState>).detail === 'granted') loadGoogleTag(id)
    }
    window.addEventListener(CONSENT_EVENT, onConsent)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener(CONSENT_EVENT, onConsent)
    }
  }, [id])

  return null
}

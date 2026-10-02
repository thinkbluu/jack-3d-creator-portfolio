import { track } from '@vercel/analytics'
import { CONSENT_STORAGE_KEY } from './consent'

export { CONSENT_STORAGE_KEY }

export type ConsentState = 'granted' | 'denied'

/** Fired on window when the visitor answers the consent banner; `detail` is the ConsentState. */
export const CONSENT_EVENT = 'mast:consent'

type EventData = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Sends a conversion event to Vercel Analytics and, once the visitor has
 * accepted measurement, to Google Tag. Guards against SSR and never throws, so
 * tracking can never block a user action.
 */
export function trackConversion(event: string, data?: EventData) {
  if (typeof window === 'undefined') return

  try {
    track(event, data)
  } catch {
    // Vercel Analytics may be blocked or unavailable; ignore.
  }

  if (getStoredConsent() !== 'granted') return

  try {
    window.gtag?.('event', event, data ?? {})
  } catch {
    // Google Tag may not be loaded or consent may be denied; ignore.
  }
}

// Remembers the answer for this page view when localStorage is unavailable.
let sessionConsent: ConsentState | null = null

export function getStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null

  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : sessionConsent
  } catch {
    return sessionConsent
  }
}

/**
 * Persists the visitor choice and updates Google Consent Mode v2 accordingly.
 * Analytics/ads storage stays denied until the visitor explicitly accepts.
 */
export function applyConsent(state: ConsentState) {
  if (typeof window === 'undefined') return
  sessionConsent = state

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, state)
  } catch {
    // Storage may be unavailable (private mode); consent simply won't persist.
  }

  try {
    window.gtag?.('consent', 'update', {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state,
    })
  } catch {
    // Google Tag not present; nothing to update.
  }

  window.dispatchEvent(new CustomEvent<ConsentState>(CONSENT_EVENT, { detail: state }))
}

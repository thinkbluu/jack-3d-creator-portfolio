import { track } from '@vercel/analytics'

export const CONSENT_STORAGE_KEY = 'mast-consent'

export type ConsentState = 'granted' | 'denied'

type EventData = Record<string, string | number | boolean>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Sends a conversion event to both Vercel Analytics and Google Tag (when loaded).
 * Guards against SSR and never throws, so tracking can never block a user action.
 */
export function trackConversion(event: string, data?: EventData) {
  if (typeof window === 'undefined') return

  try {
    track(event, data)
  } catch {
    // Vercel Analytics may be blocked or unavailable; ignore.
  }

  try {
    window.gtag?.('event', event, data ?? {})
  } catch {
    // Google Tag may not be loaded or consent may be denied; ignore.
  }
}

export function getStoredConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null

  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

/**
 * Persists the visitor choice and updates Google Consent Mode v2 accordingly.
 * Analytics/ads storage stays denied until the visitor explicitly accepts.
 */
export function applyConsent(state: ConsentState) {
  if (typeof window === 'undefined') return

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
}

import { track } from '@vercel/analytics'
import { CONSENT_STORAGE_KEY } from './consent'
import { PRIVATE_CONTEST_PATHS } from './contest/config'
import { localizePath } from './i18n/paths'

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
 * Pages opened from personal contest links carry an access token in their
 * address. Google Tag never loads there, and Vercel Analytics gets their path
 * without the query string.
 */
export function isPrivatePath(pathname: string) {
  return PRIVATE_CONTEST_PATHS.some((path) => pathname.startsWith(path) || pathname.startsWith(localizePath(path, 'en')))
}

/** Vercel Analytics and Speed Insights `beforeSend`: personal contest pages are reported by path only. */
export function withoutToken<T extends { url: string }>(event: T): T {
  try {
    const url = new URL(event.url)
    return isPrivatePath(url.pathname) ? { ...event, url: `${url.origin}${url.pathname}` } : event
  } catch {
    return event
  }
}

// Vercel's documented queue stub, used when an event is sent before
// <Analytics /> initialises (for example from an effect on page load). The
// address filter goes in first, so queued events never carry an access token.
function ensureVercelQueue() {
  if (window.va) return
  window.va = function (...params) {
    ;(window.vaq ??= []).push(params)
  }
  window.va('beforeSend', withoutToken)
}

/**
 * Sends a conversion event to Vercel Analytics and, once the visitor has
 * accepted measurement, to Google Tag. Guards against SSR and never throws, so
 * tracking can never block a user action.
 */
export function trackConversion(event: string, data?: EventData) {
  if (typeof window === 'undefined') return

  try {
    ensureVercelQueue()
    track(event, data)
  } catch {
    // Vercel Analytics may be blocked or unavailable; ignore.
  }

  if (getStoredConsent() !== 'granted' || isPrivatePath(window.location.pathname)) return

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

/**
 * Google Ads conversion tracking configuration.
 *
 * Everything is driven by public env vars so one build ships with or without
 * ads measurement. Nothing loads outside production deployments (VERCEL_ENV,
 * mapped to NEXT_PUBLIC_TRACKING_ENV in next.config) or when the IDs are
 * missing — gtag calls then queue into a dataLayer nobody ever reads.
 */

export const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? ''
export const ADS_LEAD_SEND_TO = process.env.NEXT_PUBLIC_ADS_LEAD_LABEL ?? ''
export const ADS_WHATSAPP_SEND_TO = process.env.NEXT_PUBLIC_ADS_WHATSAPP_LABEL ?? ''

// GA4 keeps the site's existing property as fallback so current reporting
// continues even before NEXT_PUBLIC_GA4_ID is set.
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? process.env.NEXT_PUBLIC_GTAG_ID ?? 'G-WT5MMP4M9D'

export const TRACKING_ACTIVE =
  process.env.NEXT_PUBLIC_TRACKING_ENV === 'production' && Boolean(ADS_ID || GA4_ID)

/** localStorage key holding the last click attribution (gclid / utm_*), kept 90 days. */
export const ATTRIBUTION_KEY = 'ms_attribution'
/** sessionStorage key holding { id, phone, email } of the last mockup request. */
export const MS_LEAD_KEY = 'ms_lead'
/** sessionStorage flag marking the lead whose Ads conversion already fired. */
export const MS_LEAD_FIRED_KEY = 'ms_lead_fired'

const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000

export type Attribution = Record<string, string> & { savedAt?: number }

/**
 * Saves gclid / gbraid / wbraid / utm_* from the current address to
 * localStorage with a 90-day TTL, merging over any earlier attribution.
 * First-party storage only, so it runs on every page in every environment.
 */
export function saveAttributionFromUrl() {
  if (typeof window === 'undefined') return
  try {
    const found: Record<string, string> = {}
    new URLSearchParams(window.location.search).forEach((value, key) => {
      if (value && (key === 'gclid' || key === 'gbraid' || key === 'wbraid' || key.startsWith('utm_'))) {
        found[key] = value
      }
    })
    if (Object.keys(found).length === 0) return
    window.localStorage.setItem(
      ATTRIBUTION_KEY,
      JSON.stringify({ ...readAttribution(), ...found, savedAt: Date.now() }),
    )
  } catch {
    // Storage unavailable (private mode) — attribution simply isn't kept.
  }
}

/** Reads the stored click attribution, or {} when missing or older than 90 days. */
export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_KEY)
    if (!raw) return {}
    const saved = JSON.parse(raw) as Attribution
    if (!saved.savedAt || Date.now() - saved.savedAt > ATTRIBUTION_TTL_MS) {
      window.localStorage.removeItem(ATTRIBUTION_KEY)
      return {}
    }
    return saved
  } catch {
    return {}
  }
}

/** Sends a Google Ads conversion. Safe no-op outside production or without a label. */
export function fireAdsConversion(sendTo: string, params?: Record<string, unknown>) {
  if (!TRACKING_ACTIVE || !sendTo) return
  try {
    window.gtag?.('event', 'conversion', { send_to: sendTo, ...params })
  } catch {
    // gtag blocked or unavailable — tracking must never break the action it measures.
  }
}

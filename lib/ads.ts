/**
 * Google Ads conversion tracking configuration.
 *
 * Everything is driven by public env vars so one build ships with or without
 * ads measurement. Nothing loads outside production deployments (VERCEL_ENV,
 * mapped to NEXT_PUBLIC_TRACKING_ENV in next.config) or when the IDs are
 * missing — gtag calls then queue into a dataLayer nobody ever reads.
 */

export const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? process.env.NEXT_PUBLIC_GADS_CONVERSION_ID ?? ''
export const ADS_LEAD_SEND_TO = process.env.NEXT_PUBLIC_ADS_LEAD_LABEL ?? process.env.NEXT_PUBLIC_GADS_LEAD_LABEL ?? ''
export const ADS_WHATSAPP_SEND_TO = process.env.NEXT_PUBLIC_ADS_WHATSAPP_LABEL ?? process.env.NEXT_PUBLIC_GADS_WHATSAPP_LABEL ?? ''
// Phone-call conversion (tel: clicks). Create the matching conversion action
// in Google Ads and set NEXT_PUBLIC_ADS_CALL_LABEL to its label.
export const ADS_CALL_SEND_TO = process.env.NEXT_PUBLIC_ADS_CALL_LABEL ?? process.env.NEXT_PUBLIC_GADS_CALL_LABEL ?? ''

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
  // Dev diagnostic: shows which Ads conversion would fire in production.
  if (process.env.NODE_ENV !== 'production') {
    console.log('[ads-conversion]', sendTo || '(fără label configurat)', TRACKING_ACTIVE ? '' : '(no-op în dev)', params ?? {})
  }
  if (!TRACKING_ACTIVE || !sendTo) return
  // `send_to` is "ID/LABEL": compose it when only the label is configured.
  const target = sendTo.includes('/') || !ADS_ID ? sendTo : `${ADS_ID}/${sendTo}`
  try {
    window.gtag?.('event', 'conversion', { send_to: target, ...params })
  } catch {
    // gtag blocked or unavailable — tracking must never break the action it measures.
  }
}

/** Normalises a Romanian phone number to E.164 (+40…), or returns '' when it can't. */
export function normalizeRoPhoneE164(value: string): string {
  const digits = value.replace(/[\s.()\-]/g, '')
  if (digits.startsWith('+40')) return digits
  if (digits.startsWith('40') && digits.length >= 11) return `+${digits}`
  if (digits.startsWith('0')) return `+40${digits.slice(1)}`
  return ''
}

/**
 * Fires the lead conversion with enhanced-conversions data: the phone number
 * normalised to E.164 and SHA-256 hashed in the browser, as Google requires.
 * Falls back to a plain conversion when hashing is unavailable.
 */
export async function fireLeadConversion(phone?: string) {
  let userData: Record<string, string> | undefined
  const e164 = phone ? normalizeRoPhoneE164(phone) : ''
  if (e164 && typeof crypto?.subtle?.digest === 'function') {
    try {
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(e164))
      const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
      userData = { phone_number: hash }
    } catch {
      // Hashing unavailable — send the conversion without enhanced data.
    }
  }
  fireAdsConversion(ADS_LEAD_SEND_TO, userData ? { user_data: userData } : undefined)
}

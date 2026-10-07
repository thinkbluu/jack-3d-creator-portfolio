/** localStorage key holding the visitor's measurement consent ('granted' | 'denied'). */
export const CONSENT_STORAGE_KEY = 'mast-consent'

/** Fired on window to re-open the consent banner (footer "Cookie settings"). */
export const CONSENT_OPEN_EVENT = 'mast:consent-open'

/** Re-opens the consent banner so the visitor can change their choice. */
export function openConsentSettings() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT))
}

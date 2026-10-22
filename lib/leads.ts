import { localizePath } from './i18n/paths'
import type { Locale } from './i18n/locale'

/** sessionStorage flag marking a submitted lead whose conversion is still due. */
export const LEAD_SUBMITTED_KEY = 'lead_submitted'
/** sessionStorage keys holding the form source and the submitter's first name. */
export const LEAD_SOURCE_KEY = 'lead_source'
export const LEAD_NAME_KEY = 'lead_name'

/** Public thank-you path for a locale: /multumim or /en/thank-you. */
export function thankYouPath(locale: Locale) {
  return localizePath('/multumim', locale)
}

/**
 * Marks a successful form submission so the thank-you page can count exactly
 * one conversion, then sends the visitor there with the source in the address.
 * A full navigation on purpose: router pushes from submit handlers after
 * awaits can be dropped silently.
 */
export function redirectToThankYou(locale: Locale, source: string, fullName?: string | null) {
  try {
    sessionStorage.setItem(LEAD_SUBMITTED_KEY, '1')
    sessionStorage.setItem(LEAD_SOURCE_KEY, source)
    const firstName = fullName?.trim().split(/\s+/)[0]
    if (firstName) sessionStorage.setItem(LEAD_NAME_KEY, firstName)
    else sessionStorage.removeItem(LEAD_NAME_KEY)
  } catch {
    // Storage unavailable: the redirect still happens, only the personal
    // touches and the conversion guard are lost.
  }
  window.location.assign(`${thankYouPath(locale)}?sursa=${encodeURIComponent(source)}`)
}

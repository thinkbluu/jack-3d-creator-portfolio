import { Resend } from 'resend'

/** Resend client, or null when RESEND_API_KEY is not configured. */
export function resendClient() {
  const apiKey = process.env.RESEND_API_KEY
  return apiKey ? new Resend(apiKey) : null
}

/**
 * Sender address on the verified Resend domain (RESEND_EMAIL_DOMAIN), for
 * example `MAST Studio <lead@maststudio.ro>`. Without a domain Resend only
 * allows its test sender, which delivers to the account owner.
 */
export function fromAddress(localPart: string, name = 'MAST Studio') {
  const configuredDomain = process.env.RESEND_EMAIL_DOMAIN?.trim()
  if (!configuredDomain) return `${name} <onboarding@resend.dev>`

  const domain = configuredDomain
    .replace(/^https?:\/\//, '')
    .replace(/^.*@/, '')
    .replace(/\/$/, '')

  return `${name} <${localPart}@${domain}>`
}

export function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character,
  )
}

export function isValidEmail(value: string) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

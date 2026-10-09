'use client'

import { useEffect } from 'react'
import { ADS_LEAD_SEND_TO, MS_LEAD_FIRED_KEY, MS_LEAD_KEY, TRACKING_ACTIVE, fireAdsConversion } from '@/lib/ads'

/** Normalises to E.164 for enhanced conversions; the form already stores +40… numbers. */
function toE164(phone: string) {
  const digits = phone.replace(/[\s.\-()]/g, '')
  if (digits.startsWith('+')) return digits
  if (digits.startsWith('00')) return `+${digits.slice(2)}`
  if (digits.startsWith('0')) return `+40${digits.slice(1)}`
  return `+${digits}`
}

/**
 * Fires the Google Ads lead conversion exactly once per submitted mockup
 * request. A direct visit or a refresh (no `ms_lead` in sessionStorage) never
 * counts. Afterwards the flag is set and the phone/email are dropped from
 * storage — the submission id stays for the "Cod cerere" line.
 */
export default function MockupConversion() {
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(MS_LEAD_KEY)
      if (!raw) return
      const lead = JSON.parse(raw) as { id?: string; phone?: string; email?: string }
      if (!lead.id || !lead.phone) return
      if (sessionStorage.getItem(MS_LEAD_FIRED_KEY) === lead.id) return

      if (TRACKING_ACTIVE && ADS_LEAD_SEND_TO) {
        window.gtag?.('set', 'user_data', {
          phone_number: toE164(lead.phone),
          ...(lead.email ? { email: lead.email } : {}),
        })
        fireAdsConversion(ADS_LEAD_SEND_TO, { value: 50, currency: 'RON', transaction_id: lead.id })
      }

      sessionStorage.setItem(MS_LEAD_FIRED_KEY, lead.id)
      sessionStorage.setItem(MS_LEAD_KEY, JSON.stringify({ id: lead.id }))
    } catch {
      // Storage unavailable — skip quietly; the page itself is unaffected.
    }
  }, [])

  return null
}

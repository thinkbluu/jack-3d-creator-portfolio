// Data contract for the /mockup campaign landing page. The form component
// calls submitMockupRequest on submit; the real transport (Resend lead email,
// CRM, etc.) gets wired here in a follow-up.

export type MockupRequestData = {
  nume: string
  firma: string
  /** Normalized to +407XXXXXXXX. */
  telefon: string
  email: string
  domeniu: string
  site: string
  noSite: boolean
  projectType: 'prezentare' | 'magazin'
  servicii: string
  gclid?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
}

/** Placeholder until the real submission transport is wired up. */
export async function submitMockupRequest(data: MockupRequestData): Promise<{ ok: true }> {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[v0] mockup request (placeholder, not sent anywhere):', data)
  }
  return { ok: true }
}

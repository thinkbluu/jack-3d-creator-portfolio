'use client'

import { useEffect, useState } from 'react'

/** Reads the submission id saved by the form before the redirect. */
export default function LeadId() {
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('ms_lead')
      if (!raw) return
      const lead = JSON.parse(raw) as { id?: string }
      if (lead.id) setId(lead.id)
    } catch {
      // Missing or unreadable storage — the id line simply stays hidden.
    }
  }, [])

  if (!id) return null

  return <p className="font-sans text-xs text-[var(--ink-3)]">Cod cerere: {id}</p>
}

'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export const WHATSAPP_NUMBER = '40755928029'
export const PHONE_DISPLAY = '+40 755 928 029'
export const PHONE_HREF = `tel:+${WHATSAPP_NUMBER}`
export const EMAIL = 'contact@maststudio.ro'
export const EMAIL_HREF = `mailto:${EMAIL}`

export type Segment = 'salon' | 'servicii' | 'platforma' | 'ecommerce'

const VALID_SEGMENTS: Segment[] = ['salon', 'servicii', 'platforma', 'ecommerce']

function isSegment(v: unknown): v is Segment {
  return VALID_SEGMENTS.includes(v as Segment)
}

const messages: Record<Segment | 'general', string> = {
  salon: 'Salut! Am un salon și vreau un site care să aducă mai multe programări.',
  servicii: 'Salut! Ofer servicii și vreau un site care să transforme vizitatorii în clienți.',
  platforma: 'Salut! Am o idee de platformă și vreau să discutăm cum o construim.',
  ecommerce: 'Salut! Vând produse și vreau un magazin online. Ce presupune și cât costă?',
  general: 'Salut! Vreau să discutăm despre un site pentru afacerea mea.',
}

const SegmentContext = createContext<{
  segment: Segment | null
  setSegment: (segment: Segment | null) => void
} | null>(null)

export function getWaUrl(segment: Segment | null, overrideMessage?: string) {
  const message = overrideMessage ?? messages[segment ?? 'general']
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function SegmentProvider({ children }: { children: ReactNode }) {
  // Always start at null so the server and the first client render agree.
  // Stored/URL segments are adopted after mount, which keeps hydration clean.
  const [segment, setSegment] = useState<Segment | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('s')
    if (isSegment(fromUrl)) {
      setSegment(fromUrl)
    } else {
      const stored = window.sessionStorage.getItem('mast-segment')
      if (isSegment(stored)) setSegment(stored)
    }
    setHydrated(true)
  }, [])

  // Only persist once the initial adoption pass has run, so it can't clear storage first.
  useEffect(() => {
    if (!hydrated) return
    if (segment) window.sessionStorage.setItem('mast-segment', segment)
    else window.sessionStorage.removeItem('mast-segment')
  }, [segment, hydrated])

  const value = useMemo(() => ({ segment, setSegment }), [segment])
  return <SegmentContext.Provider value={value}>{children}</SegmentContext.Provider>
}

export function useSegment() {
  const context = useContext(SegmentContext)
  if (!context) throw new Error('useSegment must be used inside SegmentProvider')
  return context
}

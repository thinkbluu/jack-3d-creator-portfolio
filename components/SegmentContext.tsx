'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export const WHATSAPP_NUMBER = '40755928029'

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
  const [segment, setSegment] = useState<Segment | null>(() => {
    if (typeof window === 'undefined') return null
    const stored = window.sessionStorage.getItem('mast-segment')
    return isSegment(stored) ? stored : null
  })

  // Read ?s= param on mount and persist it, overriding storage; SSR-safe
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const s = params.get('s')
    if (isSegment(s)) {
      setSegment(s)
      window.sessionStorage.setItem('mast-segment', s)
    }
  }, [])

  useEffect(() => {
    if (segment) window.sessionStorage.setItem('mast-segment', segment)
    else window.sessionStorage.removeItem('mast-segment')
  }, [segment])

  const value = useMemo(() => ({ segment, setSegment }), [segment])
  return <SegmentContext.Provider value={value}>{children}</SegmentContext.Provider>
}

export function useSegment() {
  const context = useContext(SegmentContext)
  if (!context) throw new Error('useSegment must be used inside SegmentProvider')
  return context
}

'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Locale } from '@/lib/i18n/locale'
import { ui } from '@/lib/i18n/ui'
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, WHATSAPP_NUMBER } from '@/lib/site'

// Re-exported for the client components that already import them from here.
export { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF, WHATSAPP_NUMBER }

export type Segment = 'salon' | 'servicii' | 'platforma' | 'ecommerce'

const VALID_SEGMENTS: Segment[] = ['salon', 'servicii', 'platforma', 'ecommerce']

function isSegment(v: unknown): v is Segment {
  return VALID_SEGMENTS.includes(v as Segment)
}

const SegmentContext = createContext<{
  segment: Segment | null
  setSegment: (segment: Segment | null) => void
} | null>(null)

export function getWaUrl(segment: Segment | null, overrideMessage?: string, locale: Locale = 'ro') {
  const message = overrideMessage ?? ui[locale].whatsapp[segment ?? 'general']
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

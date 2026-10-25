'use client'

import { useEffect, useRef } from 'react'
import type { Locale } from '@/lib/i18n/locale'
import { ui } from '@/lib/i18n/ui'

const AWAY_SEEN_KEY = 'ms-away-title-shown'

// Conversion pages never get the away title: the visitor just converted.
const THANK_YOU_PATHS = ['/multumim', '/en/thank-you', '/mockup/multumim']

/**
 * Two quiet brand-voice touches that live outside the page markup:
 * the away-tab title (once per session, skipped on thank-you pages and
 * once the visitor started typing into a form) and the hiring note in the
 * developer console (production only, once per page load).
 */
export default function BrandVoice({ locale }: { locale: Locale }) {
  // Set the first time the visitor types into any form field on this page.
  const typedRef = useRef(false)

  useEffect(() => {
    const onInput = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      const tag = target.tagName
      if ((tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') && target.closest('form')) {
        typedRef.current = true
      }
    }
    document.addEventListener('input', onInput, { capture: true })
    return () => document.removeEventListener('input', onInput, { capture: true })
  }, [])

  useEffect(() => {
    const awayTitle = ui[locale].voice.awayTitle
    let savedTitle: string | null = null

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        const path = window.location.pathname
        if (THANK_YOU_PATHS.some((p) => path === p || path.startsWith(`${p}/`))) return
        if (typedRef.current) return
        try {
          if (sessionStorage.getItem(AWAY_SEEN_KEY) === '1') return
          sessionStorage.setItem(AWAY_SEEN_KEY, '1')
        } catch {
          return
        }
        // Captured at hide time, so whatever the page had (including the
        // returning-visitor nudge from SalutHero) is restored exactly.
        savedTitle = document.title
        document.title = awayTitle
      } else if (savedTitle !== null) {
        document.title = savedTitle
        savedTitle = null
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [locale])

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    // Brass that stays readable on both light and dark devtools.
    console.log(`%c${ui[locale].voice.console}`, 'color:#c9a24b;font-weight:bold;font-size:12px')
  }, [locale])

  return null
}

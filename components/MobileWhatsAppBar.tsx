'use client'

import { MessageCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocale, useUi } from '@/lib/i18n/context'
import { getWaUrl, useSegment } from './SegmentContext'
import TrackedLink from './TrackedLink'

/**
 * Sticky WhatsApp CTA on narrow viewports. When it is on screen it reserves
 * space at the bottom of the document so footer and closing buttons stay
 * reachable above it.
 */
export default function MobileWhatsAppBar() {
  const [visible, setVisible] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)
  const { segment } = useSegment()
  const locale = useLocale()
  const { whatsapp } = useUi()

  useEffect(() => {
    const scrollY = () => window.__lenis?.scroll ?? window.scrollY
    const update = () => setVisible(scrollY() > window.innerHeight)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const lenis = window.__lenis
    lenis?.on('scroll', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      lenis?.off('scroll', update)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const clear = () => {
      root.style.removeProperty('--mobile-wa-bar')
      root.classList.remove('has-mobile-wa-bar')
    }
    if (!visible || window.matchMedia('(min-width: 768px)').matches) {
      clear()
      return clear
    }
    const apply = () => {
      const height = barRef.current?.offsetHeight ?? 0
      if (height > 0) {
        root.style.setProperty('--mobile-wa-bar', `${height}px`)
        root.classList.add('has-mobile-wa-bar')
      }
    }
    apply()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(apply) : null
    if (barRef.current) observer?.observe(barRef.current)
    window.addEventListener('resize', apply)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', apply)
      clear()
    }
  }, [visible])

  return (
    <div
      ref={barRef}
      className={`whatsapp-bar fixed inset-x-0 bottom-0 z-40 border-t border-[var(--hairline)] bg-[var(--shell-warm)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform md:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      <TrackedLink href={getWaUrl(segment, undefined, locale)} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click" eventProperties={{ placement: 'mobile_sticky', segment: segment ?? 'general' }} className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[var(--brass)] py-3.5 font-semibold text-[var(--ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-px hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--glass-edge)]">
        <MessageCircle size={18} aria-hidden="true" />{whatsapp.sticky}
      </TrackedLink>
    </div>
  )
}

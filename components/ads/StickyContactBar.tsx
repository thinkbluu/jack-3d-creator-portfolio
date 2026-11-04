'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Phone } from 'lucide-react'
import { PHONE_HREF } from '@/lib/site'

type StickyContactBarProps = {
  waHref: string
  /** CSS selector of the final form; the bar hides while it is on screen. */
  hideWhenVisible: string
  labels: { whatsapp: string; call: string }
}

/**
 * Mobile sticky bar with the two fastest actions: WhatsApp and a phone call.
 * Hides while the final form is in view, so the two never fight for the tap.
 */
export default function StickyContactBar({ waHref, hideWhenVisible, labels }: StickyContactBarProps) {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const target = document.querySelector(hideWhenVisible)
    if (!target || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.15 })
    observer.observe(target)
    return () => observer.disconnect()
  }, [hideWhenVisible])

  return (
    <div
      aria-hidden={hidden}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-[var(--hairline)] bg-[var(--shell-warm)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform duration-200 md:hidden ${
        hidden ? 'pointer-events-none translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="grid grid-cols-2 gap-2">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={hidden ? -1 : 0}
          className="flex min-h-12 items-center justify-center gap-2 rounded-[12px] bg-[var(--brass)] px-3 font-sans text-[14px] font-bold text-[var(--ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brass)]"
        >
          <MessageCircle size={18} aria-hidden="true" />
          {labels.whatsapp}
        </a>
        <a
          href={PHONE_HREF}
          tabIndex={hidden ? -1 : 0}
          className="flex min-h-12 items-center justify-center gap-2 rounded-[12px] border-[1.5px] border-[var(--hairline)] px-3 font-sans text-[14px] font-bold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brass)]"
        >
          <Phone size={18} aria-hidden="true" />
          {labels.call}
        </a>
      </div>
    </div>
  )
}

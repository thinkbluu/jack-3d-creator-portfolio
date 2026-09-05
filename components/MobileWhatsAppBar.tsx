'use client'

import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getWaUrl, useSegment } from './SegmentContext'
import TrackedLink from './TrackedLink'

export default function MobileWhatsAppBar() {
  const [visible, setVisible] = useState(false)
  const { segment } = useSegment()

  useEffect(() => {
    const update = () => setVisible(window.scrollY > window.innerHeight)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  return (
    <div className={`fixed inset-x-0 bottom-0 z-40 border-t border-[var(--hairline)] bg-[var(--shell-warm)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] transition-transform md:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <TrackedLink href={getWaUrl(segment)} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click" eventProperties={{ placement: 'mobile_sticky', segment: segment ?? 'general' }} className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[var(--brass)] py-3.5 font-semibold text-[var(--shell)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-px hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--glass-edge)]">
        <MessageCircle size={18} aria-hidden="true" />Cere ofertă pe WhatsApp
      </TrackedLink>
    </div>
  )
}

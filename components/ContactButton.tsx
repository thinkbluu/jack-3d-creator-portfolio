'use client'

import { ArrowUpRight } from 'lucide-react'
import { getWaUrl, useSegment } from './SegmentContext'
import TrackedLink from './TrackedLink'

type ContactButtonProps = { hero?: boolean; label?: string }

export default function ContactButton({ hero = false, label }: ContactButtonProps) {
  const { segment } = useSegment()
  const text = label ?? (hero ? 'Vreau site-ul meu în 48h' : 'Cere ofertă pe WhatsApp')

  return (
    <div className="flex flex-col items-center">
      <TrackedLink
        data-route-contact="true"
        href={getWaUrl(segment)}
        target="_blank"
        rel="noopener noreferrer"
        eventName="whatsapp_cta_click"
        eventProperties={{ placement: hero ? 'hero' : 'final_cta', segment: segment ?? 'general' }}
        className={`group inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-[12px] bg-[var(--gold)] font-semibold uppercase tracking-[0.14em] text-[var(--bg)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-[filter,transform] hover:-translate-y-px hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold-soft)] ${hero ? 'px-7 py-4 text-xs sm:px-9' : 'px-6 py-3 text-xs sm:px-8 sm:py-3.5'}`}
      >
        {text}<ArrowUpRight aria-hidden="true" size={15} />
      </TrackedLink>
      {!label && <p className="mt-3 text-center text-xs font-medium tracking-wide text-[var(--text-3)]">răspuns în aceeași zi · fără nicio obligație</p>}
    </div>
  )
}

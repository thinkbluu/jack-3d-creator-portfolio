'use client'

import { ArrowUpRight } from 'lucide-react'
import { getWaUrl, useSegment } from './SegmentContext'
import TrackedLink from './TrackedLink'

type ContactButtonProps = { hero?: boolean; ghost?: boolean; label?: string; note?: boolean }

export default function ContactButton({ hero = false, ghost = false, label, note }: ContactButtonProps) {
  const { segment } = useSegment()
  const text = label ?? (hero ? 'Vreau site-ul meu în 48 de ore' : 'Cere ofertă pe WhatsApp')
  const showNote = note ?? !label

  const base =
    'group inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-sans font-bold transition-[background-color,transform,color] duration-[250ms] ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]'

  const skin = ghost
    ? 'border-[1.5px] border-[var(--brass)] bg-transparent text-[var(--brass)] hover:bg-[var(--brass)] hover:text-[var(--shell)]'
    : 'bg-[var(--ink)] text-[var(--shell)] hover:bg-[#2E2822] hover:-translate-y-px'

  return (
    <div className="flex flex-col items-center">
      <TrackedLink
        data-route-contact="true"
        href={getWaUrl(segment)}
        target="_blank"
        rel="noopener noreferrer"
        eventName="whatsapp_cta_click"
        eventProperties={{ placement: hero ? 'hero' : 'final_cta', segment: segment ?? 'general' }}
        className={`${base} ${skin}`}
        style={{
          borderRadius: 'var(--radius-pill)',
          padding: hero ? '17px 38px' : '15px 32px',
          fontSize: hero ? '15.5px' : '14.5px',
        }}
      >
        {text}
        <ArrowUpRight aria-hidden="true" size={16} />
      </TrackedLink>
      {showNote && (
        <p className="mt-3 text-center font-sans text-xs font-medium text-[var(--ink-3)]">
          răspuns în aceeași zi · fără nicio obligație
        </p>
      )}
    </div>
  )
}

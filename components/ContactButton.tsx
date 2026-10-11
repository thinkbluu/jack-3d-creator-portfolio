'use client'

import { ArrowUpRight } from 'lucide-react'
import { useLocale, useUi } from '@/lib/i18n/context'
import { getWaUrl, useSegment } from './SegmentContext'
import TrackedLink from './TrackedLink'

type ContactButtonProps = { hero?: boolean; ghost?: boolean; label?: string; note?: boolean }

export default function ContactButton({ hero = false, ghost = false, label, note }: ContactButtonProps) {
  const { segment } = useSegment()
  const locale = useLocale()
  const { whatsapp } = useUi()
  const text = label ?? (hero ? whatsapp.heroDefault : whatsapp.defaultCta)
  const showNote = note ?? !label

  const base =
    'group inline-flex max-w-full cursor-pointer items-center justify-center gap-2 whitespace-normal text-center font-sans font-bold transition-[background-color,transform,color] duration-[250ms] ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] sm:whitespace-nowrap'

  const skin = ghost
    ? 'border-[1.5px] border-[var(--brass)] bg-transparent text-[var(--brass-ink)] hover:bg-[var(--brass)] hover:text-[var(--ink)]'
    : 'bg-[var(--ink)] text-[var(--shell)] hover:bg-[#2E2822] hover:-translate-y-px'

  return (
    <div className="flex w-full max-w-full flex-col items-center">
      <TrackedLink
        data-route-contact="true"
        href={getWaUrl(segment, undefined, locale)}
        target="_blank"
        rel="noopener noreferrer"
        eventName="whatsapp_click"
        eventProperties={{ placement: hero ? 'hero' : 'final_cta', segment: segment ?? 'general' }}
        className={`${base} ${skin}`}
        style={{
          borderRadius: 'var(--radius-pill)',
          padding: hero ? '17px clamp(1rem, 4vw, 2.375rem)' : '15px clamp(1rem, 4vw, 2rem)',
          fontSize: hero ? '15.5px' : '14.5px',
        }}
      >
        {text}
        <ArrowUpRight aria-hidden="true" size={16} />
      </TrackedLink>
      {showNote && (
        <p className="mt-3 text-center font-sans text-xs font-medium text-[var(--ink-3)]">
          {whatsapp.note}
        </p>
      )}
    </div>
  )
}

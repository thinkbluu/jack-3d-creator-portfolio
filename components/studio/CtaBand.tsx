'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import TrackedLink from '@/components/TrackedLink'
import { useHref, useUi } from '@/lib/i18n/context'
import { EMAIL, EMAIL_HREF, whatsappUrl } from '@/lib/site'
import { Kicker, SplitHeading } from './Reveal'

/**
 * Closing call to action for inner pages: a big line, the WhatsApp button and
 * the quieter routes (quote form, email). `placement` names the analytics spot.
 */
export default function CtaBand({
  title,
  accent,
  message,
  placement,
  children,
}: {
  title: string
  accent?: string
  message?: string
  placement: string
  children?: ReactNode
}) {
  const href = useHref()
  const { whatsapp, nav, finalCta, redesign } = useUi()
  return (
    <section className="tone-dark grain relative overflow-hidden py-28 md:py-40">
      <div className="studio-container relative">
        <Kicker label={redesign.cta.kicker} className="text-[var(--fg-3)]" />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:items-end">
          <SplitHeading text={title} accent={accent} className="display-xl text-balance text-[clamp(2.6rem,6vw,6rem)]" />
          <div className="flex flex-col gap-5 lg:items-end">
            <TrackedLink
              href={whatsappUrl(message ?? whatsapp.general)}
              target="_blank"
              rel="noopener noreferrer"
              eventName="whatsapp_click"
              eventProperties={{ placement }}
              data-magnetic
              className="items-center justify-center rounded-[var(--radius-pill)] bg-[var(--brass-lite)] px-8 py-4 text-center text-base font-semibold text-[var(--night)] transition-colors hover:bg-[var(--on-dark)]"
            >
              {whatsapp.defaultCta} →
            </TrackedLink>
            <p className="text-[var(--fg-2)] lg:text-right">
              <Link href={href('/cerere-oferta')} className="inline min-h-0 text-[var(--fg)] underline-offset-4 hover:underline">
                {nav.quote}
              </Link>
              {' · '}
              {finalCta.orEmail}{' '}
              <a href={EMAIL_HREF} className="inline min-h-0 text-[var(--fg)] underline-offset-4 hover:underline">
                {EMAIL}
              </a>
            </p>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}

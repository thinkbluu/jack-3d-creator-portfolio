'use client'

import Link from 'next/link'
import TrackedLink from '@/components/TrackedLink'
import { useHref, useUi } from '@/lib/i18n/context'
import { EMAIL, EMAIL_HREF, whatsappUrl } from '@/lib/site'

/** The sign-off: one big word, and every way to reach us. */
export default function SalutBye() {
  const href = useHref()
  const { redesign } = useUi()
  const copy = redesign.salut
  return (
    <section aria-labelledby="salut-bye" className="tone-dark salut-bye relative pb-20 pt-28 md:pb-28 md:pt-40">
      <div className="studio-container">
        <h2 id="salut-bye" className="salut-bye-word display-xl">
          {copy.byeTitle}
        </h2>
        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-md text-xl leading-relaxed text-[var(--fg-2)]">{copy.byeLine}</p>
          <div className="flex flex-wrap gap-3">
            <TrackedLink
              href={whatsappUrl(copy.message)}
              target="_blank"
              rel="noopener noreferrer"
              eventName="whatsapp_click"
              eventProperties={{ placement: 'home_salut_bye' }}
              data-magnetic
              className="inline-flex items-center rounded-[var(--radius-pill)] bg-[var(--brass-lite)] px-7 py-4 font-semibold text-[var(--night)] transition-colors hover:bg-[var(--on-dark)]"
            >
              {copy.whatsapp}
            </TrackedLink>
            <Link
              href={href('/cerere-oferta')}
              className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--line)] px-7 py-4 font-semibold transition-colors hover:border-[var(--fg)]"
            >
              {copy.quote}
            </Link>
            <a href={EMAIL_HREF} className="inline-flex items-center px-3 py-4 font-semibold underline-offset-4 hover:underline">
              {EMAIL}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

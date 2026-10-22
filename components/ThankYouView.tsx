'use client'

import Link from 'next/link'
import { useEffect, useSyncExternalStore } from 'react'
import { primaryButtonClass, textLinkClass } from './form-styles'
import { trackConversion } from '@/lib/analytics'
import { ADS_LEAD_SEND_TO, fireAdsConversion } from '@/lib/ads'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { LEAD_NAME_KEY, LEAD_SOURCE_KEY, LEAD_SUBMITTED_KEY } from '@/lib/leads'
import { whatsappUrl } from '@/lib/site'

const noSubscribe = () => () => {}

// Captured once at module load, before the effect below deletes the storage
// keys so a refresh never counts twice: the title keeps showing the name for
// the whole visit. Server render has no sessionStorage and keeps the fallback.
let capturedName: string | null = null
try {
  capturedName = sessionStorage.getItem(LEAD_NAME_KEY)
} catch {
  capturedName = null
}
function readFirstName(): string | null {
  return capturedName
}

/**
 * Body of the thank-you pages (/multumim, /en/thank-you). Counts the lead
 * conversion exactly once: only when sessionStorage marks a submission from
 * this session, and the marker is removed before anything fires, so
 * refreshes and direct visits never count.
 */
export default function ThankYouView({ locale }: { locale: Locale }) {
  const copy = ui[locale].thanks
  // Server render shows the fallback title; the client snapshot (read before
  // the effect consumes the marker) personalises it.
  const firstName = useSyncExternalStore(noSubscribe, readFirstName, () => null)
  const title = firstName ? copy.titleNamed.replace('{name}', firstName) : copy.title

  useEffect(() => {
    try {
      if (sessionStorage.getItem(LEAD_SUBMITTED_KEY) !== '1') return
      // Consume the marker first: a refresh or a second tab must never
      // count the same lead twice.
      sessionStorage.removeItem(LEAD_SUBMITTED_KEY)
      sessionStorage.removeItem(LEAD_SOURCE_KEY)
      sessionStorage.removeItem(LEAD_NAME_KEY)
    } catch {
      // Storage unavailable: treat the visit as not a conversion.
      return
    }

    const source = new URLSearchParams(window.location.search).get('sursa') ?? 'direct'
    trackConversion('generate_lead', { form_source: source, language: locale })
    // No-op outside production or while the Ads label env var is missing.
    fireAdsConversion(ADS_LEAD_SEND_TO, { form_source: source })
  }, [locale])

  return (
    <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <div className="studio-container flex flex-col items-center pb-24 pt-16 text-center md:pt-24">
        <h1 className="display-xl max-w-4xl text-balance">{title}</h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--ink-2)]">{copy.responseLine}</p>

        <section aria-labelledby="ce-urmeaza" className="mt-16 w-full max-w-4xl">
          <h2 id="ce-urmeaza" className="mono-label text-[var(--ink-3)]">
            {copy.stepsTitle}
          </h2>
          <ol className="mt-6 grid gap-4 text-left md:grid-cols-3">
            {copy.steps.map((step, index) => (
              <li key={step} className="porthole border-[var(--glass-edge)] p-6">
                <span className="mono-label text-[var(--brass-ink)]">{String(index + 1).padStart(2, '0')}</span>
                <p className="mt-3 font-sans text-[15px] leading-relaxed text-[var(--ink-2)]">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <aside aria-labelledby="whatsapp-box" className="mt-6 w-full max-w-4xl border-[1.5px] border-[var(--brass)] bg-[rgba(176,141,63,0.07)] p-8 md:p-10">
          <h2 id="whatsapp-box" className="type-h3 text-balance">
            {copy.waTitle}
          </h2>
          <a href={whatsappUrl(copy.waPrefill)} target="_blank" rel="noopener noreferrer" className={`${primaryButtonClass} mt-6`}>
            {copy.waButton}
          </a>
        </aside>

        <section aria-labelledby="pana-atunci" className="mt-16 w-full max-w-4xl">
          <h2 id="pana-atunci" className="mono-label text-[var(--ink-3)]">
            {copy.untilTitle}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {copy.cards.map((card) => (
              <Link
                key={card.href}
                href={localizePath(card.href, locale)}
                className="porthole group flex flex-col border-[var(--glass-edge)] p-6 text-left transition-colors hover:border-[var(--brass)]"
              >
                <span className="block font-sans text-[15px] font-semibold text-[var(--ink)]">{card.title}</span>
                <span className="mt-2 block font-sans text-sm leading-relaxed text-[var(--ink-2)]">{card.text}</span>
              </Link>
            ))}
          </div>
        </section>

        <Link href={localizePath('/', locale)} className={`${textLinkClass} mt-12`}>
          {copy.backHome}
        </Link>
      </div>
    </main>
  )
}

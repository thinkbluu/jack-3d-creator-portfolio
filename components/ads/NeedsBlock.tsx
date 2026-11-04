import { Check } from 'lucide-react'
import { ADS_NEEDS, ADS_NEEDS_NOTE, type AdsLandingId } from '@/lib/ads-copy'
import type { Locale } from '@/lib/i18n/locale'

const copy = {
  ro: { title: 'De la tine avem nevoie doar de' },
  en: { title: 'All we need from you is' },
} as const

/** The "this won't be extra work for you" block, shared by the ad landing pages. */
export default function NeedsBlock({ landing, locale = 'ro' }: { landing: AdsLandingId; locale?: Locale }) {
  const t = copy[locale]
  return (
    <section aria-labelledby="needs-title" className="border-y border-[var(--hairline)] bg-[var(--shell-warm)] py-16 md:py-20">
      <div className="studio-container">
        <h2 id="needs-title" className="font-display text-[clamp(1.6rem,3vw,2.4rem)] text-[var(--ink)]">
          {t.title}
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {ADS_NEEDS[landing][locale].map((item) => (
            <li key={item} className="flex items-start gap-3 border-t-2 border-[var(--ink)] pt-4">
              <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--brass-ink)]" />
              <span className="font-medium text-[var(--ink)]">{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-sans text-base font-semibold text-[var(--brass-ink)]">{ADS_NEEDS_NOTE[locale]}</p>
      </div>
    </section>
  )
}

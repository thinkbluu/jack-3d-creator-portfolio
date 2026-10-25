import Link from 'next/link'

import { localizePath } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/locale'
import { isNoDepositActive, offerBar } from '@/lib/offer'
import OfferBarDismiss from './OfferBarDismiss'

/**
 * Thin announcement bar for the time-limited no-deposit offer, shown at the
 * top of every page while the offer is active. Rendered on the server so its
 * height is reserved in the HTML (no layout shift on load); the dismiss button
 * is the only client part. Disappears automatically after the end date.
 */
export default function OfferBar({ locale }: { locale: Locale }) {
  if (!isNoDepositActive()) return null
  const copy = offerBar[locale]
  return (
    <aside
      data-offer-bar
      className="relative z-40 border-b border-[rgba(250,247,242,0.14)]"
      style={{ background: '#0b0f16', color: '#faf7f2' }}
    >
      <div className="site-container flex min-h-9 items-center justify-center gap-3 py-1.5">
        <Link
          href={localizePath(copy.href, locale)}
          className="font-sans text-[13px] font-semibold tracking-wide hover:underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c9a24b]"
        >
          {copy.text}
        </Link>
        <OfferBarDismiss />
      </div>
    </aside>
  )
}

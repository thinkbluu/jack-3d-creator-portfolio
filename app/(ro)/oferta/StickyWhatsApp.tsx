'use client'

import { MessageCircle } from 'lucide-react'
import OfferWaLink from './OfferWaLink'

/**
 * Sticky WhatsApp bar on mobile, always visible on the ad landing page
 * (unlike the sitewide bar, which waits for a first scroll).
 */
export default function StickyWhatsApp({ href }: { href: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--hairline)] bg-[var(--shell-warm)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:hidden">
      <OfferWaLink
        href={href}
        placement="oferta_sticky"
        className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-[var(--brass)] py-3.5 font-semibold text-[var(--ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:-translate-y-px hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--glass-edge)]"
      >
        <MessageCircle size={18} aria-hidden="true" />
        Scrie-ne pe WhatsApp
      </OfferWaLink>
    </div>
  )
}

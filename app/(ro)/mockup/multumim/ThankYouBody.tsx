'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'
import { primaryButtonClass, textLinkClass } from '@/components/form-styles'

const WHATSAPP = 'https://wa.me/40746382204'

/**
 * The line under the headline and the actions, following the channel the
 * visitor picked in the form (saved to sessionStorage before the redirect).
 * WhatsApp is the default, so a missing or unreadable entry shows the
 * original page.
 */
function readEmailChoice(): string | null {
  try {
    const raw = sessionStorage.getItem('ms_lead')
    if (!raw) return null
    const lead = JSON.parse(raw) as { channel?: string; email?: string }
    return lead.channel === 'email' && lead.email ? lead.email : null
  } catch {
    // Storage unavailable: keep the WhatsApp version.
    return null
  }
}

const noSubscribe = () => () => {}

export default function ThankYouBody() {
  // Server render (and no stored choice) → WhatsApp version.
  const email = useSyncExternalStore(noSubscribe, readEmailChoice, () => null)

  if (email) {
    return (
      <>
        <p className="mx-auto mt-4 max-w-md font-sans text-[15px] leading-relaxed text-[var(--ink-2)] sm:text-base">
          Îți scriem pe email, la <strong className="font-semibold text-[var(--ink)]">{email}</strong>. Ți-am trimis
          deja o confirmare: dacă vrei ca mockup-ul să semene cât mai mult cu firma ta, răspunde-i cu logo-ul și câteva
          poze.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4">
          <Link href="/portofoliu" className={`${primaryButtonClass} w-full sm:w-auto`}>
            Vezi site-urile făcute de noi
          </Link>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
            Sau trimite logo-ul pe WhatsApp
          </a>
        </div>
      </>
    )
  }

  return (
    <>
      <p className="mx-auto mt-4 max-w-md font-sans text-[15px] leading-relaxed text-[var(--ink-2)] sm:text-base">
        Îți scriem pe WhatsApp. Între timp, poți trimite logo-ul și câteva poze, ca mockup-ul să semene cât mai mult cu
        firma ta.
      </p>
      <div className="mt-8 flex flex-col items-center gap-4">
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className={`${primaryButtonClass} w-full sm:w-auto`}>
          Trimite logo-ul pe WhatsApp
        </a>
        <Link href="/portofoliu" className={textLinkClass}>
          Vezi site-urile făcute de noi
        </Link>
      </div>
    </>
  )
}

'use client'

import { useEffect } from 'react'
import { WHATSAPP_NUMBER } from '@/lib/site'

// Localized by path: the English tree lives under /en.
const copy = {
  ro: {
    kicker: 'EROARE',
    title: 'A crăpat ceva.',
    body: 'De data asta nu e site-ul tău, e al nostru.',
    retry: 'Încearcă din nou',
    whatsapp: 'Scrie-ne pe WhatsApp',
  },
  en: {
    kicker: 'ERROR',
    title: 'Something broke.',
    body: "This time it's not your website, it's ours.",
    retry: 'Try again',
    whatsapp: 'Message us on WhatsApp',
  },
}

/**
 * Route-level error boundary. Same dark, quiet feel as the 404, with the
 * studio's deadpan line. Client-only: the locale comes from the URL path.
 */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const locale = typeof window !== 'undefined' && window.location.pathname.startsWith('/en') ? 'en' : 'ro'
  const c = copy[locale]

  return (
    <main className="flex min-h-svh flex-col items-center justify-center bg-[#0b0f16] px-6 text-center text-[#faf7f2]">
      <meta name="robots" content="noindex" />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d4b267]">{c.kicker}</p>
      <h1 className="mt-6 max-w-3xl text-balance font-[family-name:var(--font-display)] text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95]">
        {c.title}
      </h1>
      <p className="mt-5 max-w-md text-lg text-[rgba(250,247,242,0.72)]">{c.body}</p>
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-[#d4b267] px-6 py-3 text-sm font-semibold text-[#0b0f16] transition-colors hover:bg-[#e3c67f]"
        >
          {c.retry}
        </button>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-[#faf7f2] underline underline-offset-4"
        >
          {c.whatsapp}
        </a>
      </div>
    </main>
  )
}

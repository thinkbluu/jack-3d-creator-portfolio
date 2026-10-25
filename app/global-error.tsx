'use client'

import { useEffect } from 'react'
import { WHATSAPP_NUMBER } from '@/lib/site'

const copy = {
  ro: {
    title: 'A crăpat ceva.',
    body: 'De data asta nu e site-ul tău, e al nostru.',
    retry: 'Încearcă din nou',
    whatsapp: 'Scrie-ne pe WhatsApp',
  },
  en: {
    title: 'Something broke.',
    body: "This time it's not your website, it's ours.",
    retry: 'Try again',
    whatsapp: 'Message us on WhatsApp',
  },
}

/**
 * Global error boundary: renders when the root layout itself fails, so it
 * ships its own minimal <html>/<body> with inline styles only.
 */
export default function GlobalErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  const locale = typeof window !== 'undefined' && window.location.pathname.startsWith('/en') ? 'en' : 'ro'
  const c = copy[locale]

  return (
    <html lang={locale}>
      <body style={{ margin: 0, background: '#0b0f16', color: '#faf7f2', fontFamily: 'system-ui, sans-serif' }}>
        <main
          style={{
            display: 'flex',
            minHeight: '100svh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 1.5rem',
            textAlign: 'center',
          }}
        >
          <meta name="robots" content="noindex" />
          <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 0.95, margin: 0, maxWidth: '48rem' }}>{c.title}</h1>
          <p style={{ marginTop: '1.25rem', maxWidth: '28rem', fontSize: '1.125rem', color: 'rgba(250,247,242,0.72)' }}>{c.body}</p>
          <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <button
              type="button"
              onClick={reset}
              style={{
                background: '#d4b267',
                color: '#0b0f16',
                border: 'none',
                borderRadius: '999px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {c.retry}
            </button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#faf7f2', fontSize: '0.875rem', fontWeight: 600 }}
            >
              {c.whatsapp}
            </a>
          </div>
        </main>
      </body>
    </html>
  )
}

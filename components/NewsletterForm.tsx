'use client'

import { useState, type FormEvent } from 'react'
import { trackConversion } from '@/lib/analytics'
import { useLocale, useUi } from '@/lib/i18n/context'

type State = 'idle' | 'sending' | 'done' | 'error'

/**
 * One field and a button. Subscribes to the studio letter through
 * /api/newsletter, with a hidden honeypot like the other forms.
 */
export default function NewsletterForm({ placement, className = '' }: { placement: string; className?: string }) {
  const locale = useLocale()
  const copy = useUi().redesign.newsletter
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (state === 'sending') return
    setState('sending')
    setError('')
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, locale, placement }),
      })
      const result = (await response.json().catch(() => null)) as { ok: boolean; error?: string } | null
      if (!response.ok || !result?.ok) throw new Error(result?.error || copy.error)
      trackConversion('newsletter_signup', { placement })
      setState('done')
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : copy.error)
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <p role="status" className={`news-done ${className}`}>
        {copy.done}
      </p>
    )
  }

  return (
    <form onSubmit={submit} className={`news-form ${className}`}>
      <label className="sr-only" htmlFor={`news-${placement}`}>
        {copy.label}
      </label>
      <input
        id={`news-${placement}`}
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        placeholder={copy.placeholder}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="news-input"
      />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(event) => setWebsite(event.target.value)}
        className="hidden"
      />
      <button type="submit" disabled={state === 'sending'} className="news-button mono-label">
        {state === 'sending' ? copy.sending : copy.submit}
      </button>
      {state === 'error' ? (
        <p role="alert" className="news-error">
          {error}
        </p>
      ) : null}
      <p className="news-note">{copy.note}</p>
    </form>
  )
}

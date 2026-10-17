'use client'

import { useState, type FormEvent } from 'react'
import { trackConversion } from '@/lib/analytics'
import { CONTACT_TOPICS, type ContactTopic } from '@/lib/contact'
import type { Locale } from '@/lib/i18n/locale'
import { whatsappUrl } from '@/lib/site'
import ChannelSwitch, { type Channel } from './ChannelSwitch'

export type ContactFormCopy = {
  name: string
  email: string
  company: string
  optional: string
  topic: string
  topics: Record<ContactTopic, string>
  message: string
  messageHint: string
  submit: string
  submitWhatsapp: string
  sending: string
  channelLegend: string
  channelWhatsapp: string
  channelEmail: string
  hintWhatsapp: string
  hintEmail: string
  /** First line of the prefilled WhatsApp message; {topic} is replaced. */
  waIntro: string
  messageError: string
  /** Shown after a failed email send: switches the form to WhatsApp, message kept. */
  errorSwitch: string
  doneTitle: string
  doneText: string
  error: string
  privacy: string
}

type State = 'idle' | 'sending' | 'done' | 'error'

/**
 * Contact form with a WhatsApp/Email switch. WhatsApp opens a chat with the
 * topic and message already written; Email posts to /api/contact, which sends
 * the message to contact@maststudio.ro with reply-to set to the visitor.
 */
export default function ContactForm({ copy, locale }: { copy: ContactFormCopy; locale: Locale }) {
  const [state, setState] = useState<State>('idle')
  const [error, setError] = useState('')
  const [topic, setTopic] = useState<ContactTopic>('project')
  const [channel, setChannel] = useState<Channel>('whatsapp')

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (state === 'sending') return
    const data = new FormData(event.currentTarget)

    if (channel === 'whatsapp') {
      const message = String(data.get('message') ?? '').trim()
      if (message.length < 10) {
        setError(copy.messageError)
        setState('error')
        return
      }
      setError('')
      setState('idle')
      trackConversion('contact_form_submit', { topic, locale, channel })
      trackConversion('whatsapp_click', { placement: 'contact_form' })
      const intro = copy.waIntro.replace('{topic}', copy.topics[topic])
      window.open(whatsappUrl(`${intro}\n${message}`), '_blank', 'noopener,noreferrer')
      return
    }

    setState('sending')
    setError('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          company: data.get('company'),
          message: data.get('message'),
          website: data.get('website'),
          topic,
          locale,
        }),
      })
      const result = (await response.json().catch(() => null)) as { ok: boolean; error?: string } | null
      if (!response.ok || !result?.ok) throw new Error(result?.error || copy.error)
      trackConversion('contact_form_submit', { topic, locale, channel })
      setState('done')
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : copy.error)
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <div role="status" className="contact-done">
        <p className="display-xl text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.95]">{copy.doneTitle}</p>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-[var(--ink-2)]">{copy.doneText}</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="contact-form" noValidate={channel === 'whatsapp'}>
      <ChannelSwitch
        value={channel}
        onChange={(next) => {
          setChannel(next)
          setError('')
          setState('idle')
        }}
        legend={copy.channelLegend}
        legendClassName="mono-label text-[var(--ink-3)]"
        labels={{ whatsapp: copy.channelWhatsapp, email: copy.channelEmail }}
        hint={channel === 'whatsapp' ? copy.hintWhatsapp : copy.hintEmail}
        disabled={state === 'sending'}
      />

      <fieldset className="contact-topics">
        <legend className="mono-label text-[var(--ink-3)]">{copy.topic}</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((id) => (
            <label key={id} className="contact-chip">
              <input type="radio" name="topic" value={id} checked={topic === id} onChange={() => setTopic(id)} className="sr-only" />
              <span>{copy.topics[id]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="contact-field">
        <span className="mono-label">{copy.message}</span>
        <textarea name="message" required minLength={10} maxLength={4000} rows={5} placeholder={copy.messageHint} />
      </label>
      {channel === 'email' ? (
        <>
          <label className="contact-field">
            <span className="mono-label">{copy.name}</span>
            <input name="name" required minLength={2} maxLength={120} autoComplete="name" />
          </label>
          <label className="contact-field">
            <span className="mono-label">{copy.email}</span>
            <input name="email" type="email" required maxLength={254} autoComplete="email" inputMode="email" />
          </label>
          <label className="contact-field">
            <span className="mono-label">
              {copy.company} <em>{copy.optional}</em>
            </span>
            <input name="company" maxLength={160} autoComplete="organization" />
          </label>
        </>
      ) : null}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {state === 'error' ? (
        <p role="alert" className="text-[var(--brass-ink)]">
          {error}
          {channel === 'email' ? (
            <>
              {' '}
              <button
                type="button"
                onClick={() => {
                  setChannel('whatsapp')
                  setState('idle')
                  setError('')
                }}
                className="font-semibold text-[var(--ink)] underline underline-offset-4"
              >
                {copy.errorSwitch}
              </button>
            </>
          ) : null}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-sm leading-relaxed text-[var(--ink-3)]">{copy.privacy}</p>
        <button type="submit" disabled={state === 'sending'} className="contact-submit mono-label">
          {state === 'sending' ? copy.sending : channel === 'whatsapp' ? copy.submitWhatsapp : copy.submit}
          <span aria-hidden="true">{channel === 'whatsapp' ? '↗' : '→'}</span>
        </button>
      </div>
    </form>
  )
}

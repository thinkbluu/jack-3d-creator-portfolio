'use client'

import { FormEvent, useRef, useState } from 'react'
import { trackConversion } from '@/lib/analytics'
import { readAttribution } from '@/lib/ads'
import { fireLeadConversion } from '@/lib/ads'
import type { Locale } from '@/lib/i18n/locale'

type CallbackFormProps = {
  /** Project type sent to the lead API and the email subject. */
  projectType: 'presentation' | 'store' | 'redesign'
  /** Where the form sits, for the analytics event params. */
  placement: string
  locale?: Locale
}

const copy = {
  ro: {
    title: 'Te sunăm noi',
    intro: 'Lasă numărul de telefon și te sunăm. Fără telefoane în plus, fără presiune.',
    name: 'Nume',
    phone: 'Telefon',
    phonePlaceholder: '07xx xxx xxx',
    business: 'Ce face firma ta',
    businessPlaceholder: 'Ex: service auto în Timișoara',
    submit: 'Sună-mă',
    sending: 'Se trimite…',
    success: 'Mulțumim! Te sunăm în cel mult 15 minute, în programul de lucru.',
    error: 'Cererea nu a putut fi trimisă. Scrie-ne pe WhatsApp sau sună-ne.',
    errName: 'Spune-ne cum te numești.',
    errPhone: 'Scrie un număr de telefon valid.',
    errBusiness: 'Spune-ne, pe scurt, ce face firma ta.',
  },
  en: {
    title: 'We call you',
    intro: 'Leave your phone number and we call you. No extra calls, no pressure.',
    name: 'Name',
    phone: 'Phone',
    phonePlaceholder: '07xx xxx xxx',
    business: 'What your business does',
    businessPlaceholder: 'E.g. car service in Timișoara',
    submit: 'Call me',
    sending: 'Sending…',
    success: 'Thank you! We call you within 15 minutes, during working hours.',
    error: 'The request couldn’t be sent. Message us on WhatsApp or call us.',
    errName: 'Tell us your name.',
    errPhone: 'Enter a valid phone number.',
    errBusiness: 'Tell us, briefly, what your business does.',
  },
} as const

// Romanian mobile formats: 07xx xxx xxx or +40 7xx xxx xxx, spaces, dashes,
// dots and parentheses allowed.
function isValidRoPhone(value: string) {
  const normalized = value
    .replace(/[\s.()\-]/g, '')
    .replace(/^\+40/, '0')
    .replace(/^40/, '0')
  return /^07\d{8}$/.test(normalized)
}

export default function CallbackForm({ projectType, placement, locale = 'ro' }: CallbackFormProps) {
  const t = copy[locale]
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [business, setBusiness] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const firedRef = useRef(false)

  const fieldClass =
    'min-h-12 w-full rounded-[var(--radius-card)] border-[1.5px] border-[var(--hairline)] bg-[rgba(255,255,255,0.5)] px-4 py-3.5 font-sans text-base text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--fg-3)] focus:border-[var(--brass)] focus-visible:ring-2 focus-visible:ring-[var(--brass)] focus-visible:ring-offset-2'

  function validate() {
    const nextErrors: Record<string, string> = {}
    if (name.trim().length < 2) nextErrors.name = t.errName
    if (!isValidRoPhone(phone)) nextErrors.phone = t.errPhone
    if (business.trim().length < 3) nextErrors.business = t.errBusiness
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting || success || !validate()) return
    setIsSubmitting(true)
    setSubmitError('')

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType,
          name: name.trim(),
          phone: phone.trim(),
          business: business.trim(),
          channel: 'call',
          website: honeypot,
          locale,
          // The landing URL, so the studio sees which page and campaign sent the lead.
          pageUrl: window.location.href,
          // gclid / utm_* captured on first load by AdsTracking (lib/ads.ts).
          attribution: readAttribution(),
        }),
      })
      const result = (await response.json().catch(() => null)) as { ok?: boolean } | null
      if (!response.ok || !result?.ok) {
        setSubmitError(t.error)
        return
      }

      // Exactly one conversion per submit, even if the button is pressed twice.
      if (!firedRef.current) {
        firedRef.current = true
        // Bots that fill the hidden field get the success state, without the
        // conversion being counted on our side.
        if (!honeypot.trim()) {
          trackConversion('lead_form_submit', { placement, project_type: projectType })
          trackConversion('generate_lead', { form_source: placement, language: locale })
          await fireLeadConversion(phone)
        }
      }
      setSuccess(true)
    } catch {
      setSubmitError(t.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <p role="status" className="font-sans text-base font-semibold leading-relaxed text-[var(--brass-ink)]">
        {t.success}
      </p>
    )
  }

  const fieldError = (id: string, message?: string) =>
    message ? (
      <p id={id} className="mt-2 font-sans text-sm text-[var(--brass-ink)]">
        {message}
      </p>
    ) : null

  const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(' ') || undefined

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div>
        <label htmlFor={`${placement}-name`} className="font-sans text-sm font-semibold text-[var(--ink)]">
          {t.name}
        </label>
        <input
          id={`${placement}-name`}
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={120}
          className={`${fieldClass} mt-2`}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={describedBy(errors.name && `${placement}-name-error`)}
          disabled={isSubmitting}
        />
        {fieldError(`${placement}-name-error`, errors.name)}
      </div>

      <div>
        <label htmlFor={`${placement}-phone`} className="font-sans text-sm font-semibold text-[var(--ink)]">
          {t.phone}
        </label>
        <input
          id={`${placement}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          maxLength={30}
          placeholder={t.phonePlaceholder}
          className={`${fieldClass} mt-2`}
          aria-invalid={Boolean(errors.phone)}
          aria-describedby={describedBy(errors.phone && `${placement}-phone-error`)}
          disabled={isSubmitting}
        />
        {fieldError(`${placement}-phone-error`, errors.phone)}
      </div>

      <div>
        <label htmlFor={`${placement}-business`} className="font-sans text-sm font-semibold text-[var(--ink)]">
          {t.business}
        </label>
        <input
          id={`${placement}-business`}
          name="business"
          type="text"
          value={business}
          onChange={(event) => setBusiness(event.target.value)}
          maxLength={300}
          placeholder={t.businessPlaceholder}
          className={`${fieldClass} mt-2`}
          aria-invalid={Boolean(errors.business)}
          aria-describedby={describedBy(errors.business && `${placement}-business-error`)}
          disabled={isSubmitting}
        />
        {fieldError(`${placement}-business-error`, errors.business)}
      </div>

      {/* Honeypot, hidden from people and screen readers. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor={`${placement}-website`}>Website</label>
        <input
          id={`${placement}-website`}
          name="website"
          type="text"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[999px] bg-[var(--brass)] px-8 py-3.5 font-sans text-[15px] font-bold text-[var(--ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-[transform,filter] duration-200 hover:-translate-y-px hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? t.sending : t.submit}
      </button>

      <div aria-live="polite">
        {submitError ? <p className="font-sans text-sm leading-relaxed text-[var(--brass-ink)]">{submitError}</p> : null}
      </div>
    </form>
  )
}

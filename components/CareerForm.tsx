'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { trackConversion } from '@/lib/analytics'
import { CV_ACCEPT, CV_RETENTION_MONTHS, MAX_CV_BYTES, careerAreaOptions, cvExtension } from '@/lib/careers'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n/locale'
import { ui, type UiCopy } from '@/lib/i18n/ui'
import { EMAIL } from '@/lib/site'
import { checkboxClass, checkboxLabelClass, errorClass, inputClass, labelClass, primaryButtonClass, textLinkClass } from './form-styles'

type Field = 'name' | 'email' | 'phone' | 'area' | 'cv' | 'consent'
type FormErrors = Partial<Record<Field, string>>
type CareerCopy = UiCopy['careerForm']

function fill(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce((text, [key, value]) => text.split(`{${key}}`).join(value), template)
}

function withEmail(template: string) {
  return fill(template, { email: EMAIL })
}

function validate(form: FormData, copy: CareerCopy): FormErrors {
  const errors: FormErrors = {}
  const value = (field: string) => String(form.get(field) ?? '').trim()

  if (value('name').length < 3) errors.name = copy.nameError
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value('email'))) errors.email = copy.emailError
  if (value('phone') && value('phone').replace(/\D/g, '').length < 9) errors.phone = copy.phoneError
  if (!value('area')) errors.area = copy.areaError

  const cv = form.get('cv')
  if (!(cv instanceof File) || cv.size === 0) errors.cv = copy.cvMissing
  else if (!cvExtension(cv.name)) errors.cv = copy.cvType
  else if (cv.size > MAX_CV_BYTES) errors.cv = copy.cvSize

  if (form.get('consent') !== 'da') errors.consent = copy.consentError
  return errors
}

function visibleError(error: string | undefined, locale: Locale, copy: CareerCopy) {
  const fallback = withEmail(copy.fallback)
  if (!error) return fallback
  const keys = Object.keys(ui.ro.careerForm.api) as Array<keyof CareerCopy['api']>
  const match = keys.find((key) => withEmail(ui.ro.careerForm.api[key]) === error)
  if (match) return withEmail(copy.api[match])
  if (keys.some((key) => withEmail(ui.en.careerForm.api[key]) === error)) return error
  return locale === 'en' ? fallback : error
}

/** `defaultArea` preselects the position when the form sits on a job page. The value is the Romanian label stored by the API. */
export default function CareerForm({ defaultArea = '' }: { defaultArea?: string }) {
  const locale = useLocale()
  const href = useHref()
  const copy = useUi().careerForm
  const areas = careerAreaOptions(locale)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)
  const consent = fill(copy.consent, { months: String(CV_RETENTION_MONTHS) })
  const [consentBefore, consentAfter = ''] = consent.split('{privacy}')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const nextErrors = validate(form, copy)
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/cariere', { method: 'POST', body: form })
      const result = (await response.json()) as { ok?: boolean; error?: string }
      if (!response.ok || !result.ok) {
        setSubmitError(visibleError(result.error, locale, copy))
        return
      }
      trackConversion('career_application', { area: String(form.get('area')) })
      setIsSuccessful(true)
    } catch {
      setSubmitError(withEmail(copy.fallback))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccessful) {
    return (
      <div className="porthole border-[var(--glass-edge)] p-7 md:p-9" role="status">
        <p className="type-h3 text-balance">{copy.successTitle}</p>
        <p className="type-body mt-3">{copy.successBody}</p>
      </div>
    )
  }

  const describedBy = (field: Field) => (errors[field] ? `cariere-${field}-error` : undefined)
  const errorText = (field: Field) =>
    errors[field] ? (
      <p id={`cariere-${field}-error`} className={errorClass}>
        {errors[field]}
      </p>
    ) : null

  return (
    <form onSubmit={submit} className="porthole border-[var(--glass-edge)] p-7 md:p-9" noValidate>
      <div className="flex flex-col gap-6">
        <input type="hidden" name="locale" value={locale} />
        <div>
          <label htmlFor="cariere-name" className={labelClass}>
            {copy.name}
          </label>
          <input id="cariere-name" name="name" type="text" autoComplete="name" maxLength={120} className={inputClass} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy('name')} disabled={isSubmitting} required />
          {errorText('name')}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="cariere-email" className={labelClass}>
              {copy.email}
            </label>
            <input id="cariere-email" name="email" type="email" autoComplete="email" maxLength={254} className={inputClass} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy('email')} disabled={isSubmitting} required />
            {errorText('email')}
          </div>
          <div>
            <label htmlFor="cariere-phone" className={labelClass}>
              {copy.phone}
            </label>
            <input id="cariere-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} className={inputClass} aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy('phone')} disabled={isSubmitting} />
            {errorText('phone')}
          </div>
        </div>

        <div>
          <label htmlFor="cariere-area" className={labelClass}>
            {copy.area}
          </label>
          <select id="cariere-area" name="area" defaultValue={defaultArea} className={inputClass} aria-invalid={Boolean(errors.area)} aria-describedby={describedBy('area')} disabled={isSubmitting} required>
            <option value="" disabled>
              {copy.areaPlaceholder}
            </option>
            {areas.map((area) => (
              <option key={area.value} value={area.value}>
                {area.label}
              </option>
            ))}
          </select>
          {errorText('area')}
        </div>

        <div>
          <label htmlFor="cariere-links" className={labelClass}>
            {copy.links}
          </label>
          <input id="cariere-links" name="links" type="text" maxLength={500} placeholder={copy.linksPlaceholder} className={inputClass} disabled={isSubmitting} />
        </div>

        <div>
          <label htmlFor="cariere-message" className={labelClass}>
            {copy.message}
          </label>
          <textarea id="cariere-message" name="message" rows={4} maxLength={1500} className={`${inputClass} resize-y`} disabled={isSubmitting} />
        </div>

        <div>
          <label htmlFor="cariere-cv" className={labelClass}>
            {copy.cv}
          </label>
          <input
            id="cariere-cv"
            name="cv"
            type="file"
            accept={CV_ACCEPT}
            className={`${inputClass} cursor-pointer file:mr-4 file:rounded-full file:border-0 file:bg-[var(--ink)] file:px-4 file:py-2 file:font-sans file:text-sm file:font-semibold file:text-[var(--shell)]`}
            aria-invalid={Boolean(errors.cv)}
            aria-describedby={describedBy('cv')}
            disabled={isSubmitting}
            required
          />
          {errorText('cv')}
        </div>

        <div>
          <label className={checkboxLabelClass}>
            <input name="consent" type="checkbox" value="da" className={checkboxClass} aria-invalid={Boolean(errors.consent)} aria-describedby={describedBy('consent')} disabled={isSubmitting} required />
            <span>
              {consentBefore}
              <Link href={href('/confidentialitate')} className={textLinkClass}>
                {copy.privacy}
              </Link>
              {consentAfter}
            </span>
          </label>
          {errorText('consent')}
        </div>

        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="cariere-website">{copy.honeypot}</label>
          <input id="cariere-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex flex-col items-start gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={primaryButtonClass}
          >
            {isSubmitting ? copy.sending : copy.submit}
          </button>
          <div aria-live="polite">
            {submitError ? <p className="font-sans text-sm text-[var(--ink-2)]">{submitError}</p> : null}
          </div>
        </div>
      </div>
    </form>
  )
}

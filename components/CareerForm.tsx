'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { trackConversion } from '@/lib/analytics'
import { CAREER_AREAS, CV_ACCEPT, CV_RETENTION_MONTHS, MAX_CV_BYTES, cvExtension } from '@/lib/careers'
import { EMAIL } from '@/lib/site'
import { checkboxClass, checkboxLabelClass, errorClass, inputClass, labelClass, primaryButtonClass, textLinkClass } from './form-styles'

type Field = 'name' | 'email' | 'phone' | 'area' | 'cv' | 'consent'
type FormErrors = Partial<Record<Field, string>>

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {}
  const value = (field: string) => String(form.get(field) ?? '').trim()

  if (value('name').length < 3) errors.name = 'Scrie numele complet.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value('email'))) errors.email = 'Introdu o adresă de e-mail validă.'
  if (value('phone') && value('phone').replace(/\D/g, '').length < 9) errors.phone = 'Introdu un telefon cu minimum 9 cifre sau lasă câmpul gol.'
  if (!value('area')) errors.area = 'Alege domeniul care te interesează.'

  const cv = form.get('cv')
  if (!(cv instanceof File) || cv.size === 0) errors.cv = 'Atașează CV-ul.'
  else if (!cvExtension(cv.name)) errors.cv = 'CV-ul trebuie să fie PDF, DOC sau DOCX.'
  else if (cv.size > MAX_CV_BYTES) errors.cv = 'CV-ul are peste 4 MB. Trimite o variantă mai mică.'

  if (form.get('consent') !== 'da') errors.consent = 'Avem nevoie de acordul tău ca să păstrăm CV-ul.'
  return errors
}

/** `defaultArea` preselects the position when the form sits on a job page. */
export default function CareerForm({ defaultArea = '' }: { defaultArea?: string }) {
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const nextErrors = validate(form)
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length > 0) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/cariere', { method: 'POST', body: form })
      const result = (await response.json()) as { ok?: boolean; error?: string }
      if (!response.ok || !result.ok) {
        setSubmitError(result.error ?? `Candidatura nu a putut fi trimisă. Scrie-ne la ${EMAIL}.`)
        return
      }
      trackConversion('career_application', { area: String(form.get('area')) })
      setIsSuccessful(true)
    } catch {
      setSubmitError(`Candidatura nu a putut fi trimisă. Scrie-ne la ${EMAIL}.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccessful) {
    return (
      <div className="porthole border-[var(--glass-edge)] p-7 md:p-9" role="status">
        <p className="type-h3 text-balance">Am primit CV-ul tău.</p>
        <p className="type-body mt-3">
          Îți mulțumim. Ți-am trimis și o confirmare pe e-mail. Dacă profilul tău se potrivește, te contactăm noi.
        </p>
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
        <div>
          <label htmlFor="cariere-name" className={labelClass}>
            Nume complet
          </label>
          <input id="cariere-name" name="name" type="text" autoComplete="name" maxLength={120} className={inputClass} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy('name')} disabled={isSubmitting} required />
          {errorText('name')}
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="cariere-email" className={labelClass}>
              E-mail
            </label>
            <input id="cariere-email" name="email" type="email" autoComplete="email" maxLength={254} className={inputClass} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy('email')} disabled={isSubmitting} required />
            {errorText('email')}
          </div>
          <div>
            <label htmlFor="cariere-phone" className={labelClass}>
              Telefon (opțional)
            </label>
            <input id="cariere-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} className={inputClass} aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy('phone')} disabled={isSubmitting} />
            {errorText('phone')}
          </div>
        </div>

        <div>
          <label htmlFor="cariere-area" className={labelClass}>
            Domeniul care te interesează
          </label>
          <select id="cariere-area" name="area" defaultValue={defaultArea} className={inputClass} aria-invalid={Boolean(errors.area)} aria-describedby={describedBy('area')} disabled={isSubmitting} required>
            <option value="" disabled>
              Alege un domeniu
            </option>
            {CAREER_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          {errorText('area')}
        </div>

        <div>
          <label htmlFor="cariere-links" className={labelClass}>
            Portofoliu, LinkedIn sau GitHub (opțional)
          </label>
          <input id="cariere-links" name="links" type="text" maxLength={500} placeholder="ex: linkedin.com/in/numele-tau" className={inputClass} disabled={isSubmitting} />
        </div>

        <div>
          <label htmlFor="cariere-message" className={labelClass}>
            Câteva rânduri despre tine (opțional)
          </label>
          <textarea id="cariere-message" name="message" rows={4} maxLength={1500} className={`${inputClass} resize-y`} disabled={isSubmitting} />
        </div>

        <div>
          <label htmlFor="cariere-cv" className={labelClass}>
            CV (PDF, DOC sau DOCX, maximum 4 MB)
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
              Sunt de acord ca MAST Consult S.R.L. să păstreze CV-ul și datele mele cel mult {CV_RETENTION_MONTHS} luni, pentru recrutare. Detalii în{' '}
              <Link href="/confidentialitate" className={textLinkClass}>
                Politica de confidențialitate
              </Link>
              .
            </span>
          </label>
          {errorText('consent')}
        </div>

        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="cariere-website">Website</label>
          <input id="cariere-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex flex-col items-start gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={primaryButtonClass}
          >
            {isSubmitting ? 'Se trimite...' : 'Trimite CV-ul'}
          </button>
          <div aria-live="polite">
            {submitError ? <p className="font-sans text-sm text-[var(--ink-2)]">{submitError}</p> : null}
          </div>
        </div>
      </div>
    </form>
  )
}

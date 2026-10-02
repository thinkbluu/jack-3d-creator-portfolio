'use client'

import { FormEvent, useState, type InputHTMLAttributes } from 'react'
import Link from 'next/link'
import { trackConversion } from '@/lib/analytics'
import { BUSINESS_FORMS, RULES_PATH } from '@/lib/contest/config'
import { checkboxClass, checkboxLabelClass, errorClass, inputClass, labelClass, primaryButtonClass, textLinkClass } from './form-styles'

type Field = 'name' | 'email' | 'phone' | 'businessName' | 'businessForm' | 'activity' | 'city' | 'postUrl' | 'rules'
type FormErrors = Partial<Record<Field, string>>

function validate(form: FormData): FormErrors {
  const value = (field: string) => String(form.get(field) ?? '').trim()
  const errors: FormErrors = {}
  if (value('name').length < 3) errors.name = 'Scrie numele tău complet.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value('email'))) errors.email = 'Introdu o adresă de e-mail validă.'
  if (value('phone') && value('phone').replace(/\D/g, '').length < 9) errors.phone = 'Introdu un telefon cu minimum 9 cifre sau lasă câmpul gol.'
  if (value('businessName').length < 2) errors.businessName = 'Scrie numele afacerii.'
  if (!value('businessForm')) errors.businessForm = 'Alege forma de organizare.'
  if (value('activity').length < 3) errors.activity = 'Spune-ne domeniul de activitate.'
  if (value('city').length < 2) errors.city = 'Scrie orașul.'
  if (value('postUrl') && !/(instagram\.com|facebook\.com|fb\.com|fb\.watch)/i.test(value('postUrl'))) {
    errors.postUrl = 'Linkul trebuie să fie al unei postări de pe Instagram sau Facebook.'
  }
  if (form.get('rules') !== 'da') errors.rules = 'Ca să participi, trebuie să accepți regulamentul.'
  return errors
}

export default function ContestSignupForm() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<'confirm-sent' | 'already-confirmed' | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const nextErrors = validate(form)
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length > 0) return

    const payload = {
      ...Object.fromEntries(['name', 'email', 'phone', 'businessName', 'businessForm', 'activity', 'city', 'siteGoal', 'postUrl', 'website'].map((key) => [key, String(form.get(key) ?? '')])),
      rules: form.get('rules') === 'da',
      marketing: form.get('marketing') === 'da',
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/site-gratuit/inscriere', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = (await response.json()) as { ok?: boolean; status?: 'confirm-sent' | 'already-confirmed'; error?: string }
      if (!response.ok || !body.ok || !body.status) {
        setSubmitError(body.error ?? 'Înscrierea nu a mers. Încearcă din nou.')
        return
      }
      trackConversion('contest_signup', { marketing: payload.marketing })
      setResult(body.status)
    } catch {
      setSubmitError('Înscrierea nu a mers. Verifică conexiunea și încearcă din nou.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="porthole border-[var(--glass-edge)] p-7 md:p-9" role="status">
        <p className="type-h3 text-balance">{result === 'confirm-sent' ? 'Verifică-ți e-mailul.' : 'Ești deja înscris.'}</p>
        <p className="type-body mt-3">
          {result === 'confirm-sent'
            ? 'Ți-am trimis un link de confirmare. Apasă pe el în cel mult 3 zile ca să intri în runda din această lună. Dacă nu-l găsești, verifică și folderul Spam sau Promoții.'
            : 'Ți-am retrimis pe e-mail linkul către pagina ta de participare, unde adaugi postarea pentru runda din această lună.'}
        </p>
      </div>
    )
  }

  const describedBy = (field: Field) => (errors[field] ? `concurs-${field}-error` : undefined)
  const errorText = (field: Field) =>
    errors[field] ? (
      <p id={`concurs-${field}-error`} className={errorClass}>
        {errors[field]}
      </p>
    ) : null
  const textField = (field: Field, label: string, props: InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`concurs-${field}`} className={labelClass}>
        {label}
      </label>
      <input id={`concurs-${field}`} name={field} className={inputClass} aria-invalid={Boolean(errors[field])} aria-describedby={describedBy(field)} disabled={isSubmitting} {...props} />
      {errorText(field)}
    </div>
  )

  return (
    <form onSubmit={submit} className="porthole border-[var(--glass-edge)] p-7 md:p-9" noValidate>
      <div className="flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {textField('name', 'Numele tău', { type: 'text', autoComplete: 'name', maxLength: 120, required: true })}
          {textField('email', 'E-mail', { type: 'email', autoComplete: 'email', maxLength: 254, required: true })}
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {textField('businessName', 'Numele afacerii', { type: 'text', autoComplete: 'organization', maxLength: 120, required: true })}
          <div>
            <label htmlFor="concurs-businessForm" className={labelClass}>
              Forma de organizare
            </label>
            <select id="concurs-businessForm" name="businessForm" defaultValue="" className={inputClass} aria-invalid={Boolean(errors.businessForm)} aria-describedby={describedBy('businessForm')} disabled={isSubmitting} required>
              <option value="" disabled>
                Alege
              </option>
              {BUSINESS_FORMS.map((form) => (
                <option key={form} value={form}>
                  {form}
                </option>
              ))}
            </select>
            {errorText('businessForm')}
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {textField('activity', 'Domeniul de activitate', { type: 'text', maxLength: 120, placeholder: 'ex: salon de înfrumusețare', required: true })}
          {textField('city', 'Orașul', { type: 'text', autoComplete: 'address-level2', maxLength: 80, required: true })}
        </div>
        {textField('phone', 'Telefon (opțional)', { type: 'tel', autoComplete: 'tel', maxLength: 40 })}

        <div>
          <label htmlFor="concurs-siteGoal" className={labelClass}>
            Ce ar trebui să facă site-ul pentru afacerea ta? (opțional)
          </label>
          <textarea id="concurs-siteGoal" name="siteGoal" rows={3} maxLength={1000} className={`${inputClass} resize-y`} disabled={isSubmitting} />
        </div>

        {textField('postUrl', 'Linkul postării (opțional acum, îl poți adăuga și după confirmare)', { type: 'url', inputMode: 'url', maxLength: 500, placeholder: 'https://www.instagram.com/p/...' })}

        <div>
          <label className={checkboxLabelClass}>
            <input name="rules" type="checkbox" value="da" className={checkboxClass} aria-invalid={Boolean(errors.rules)} aria-describedby={describedBy('rules')} disabled={isSubmitting} required />
            <span>
              Am citit și accept{' '}
              <Link href={RULES_PATH} className={textLinkClass}>
                regulamentul concursului
              </Link>{' '}
              și{' '}
              <Link href="/confidentialitate" className={textLinkClass}>
                politica de confidențialitate
              </Link>
              . Afacerea mea e înregistrată în România și am cel puțin 18 ani.
            </span>
          </label>
          {errorText('rules')}
        </div>

        <label className={checkboxLabelClass}>
          <input name="marketing" type="checkbox" value="da" className={checkboxClass} disabled={isSubmitting} />
          <span>Vreau să primesc pe e-mail, o dată pe lună, ghiduri și noutăți de la MAST Studio. Mă pot dezabona oricând. (opțional)</span>
        </label>

        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="concurs-website">Website</label>
          <input id="concurs-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex flex-col items-start gap-3">
          <button type="submit" disabled={isSubmitting} className={primaryButtonClass}>
            {isSubmitting ? 'Se trimite...' : 'Mă înscriu în concurs'}
          </button>
          <div aria-live="polite">{submitError ? <p className="font-sans text-sm text-[var(--ink-2)]">{submitError}</p> : null}</div>
        </div>
      </div>
    </form>
  )
}

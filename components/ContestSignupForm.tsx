'use client'

import { FormEvent, useState, type InputHTMLAttributes } from 'react'
import Link from 'next/link'
import { trackConversion } from '@/lib/analytics'
import { BUSINESS_FORMS, RULES_PATH, type BusinessForm } from '@/lib/contest/config'
import { useHref, useLocale } from '@/lib/i18n/context'
import type { Locale } from '@/lib/i18n/locale'
import { checkboxClass, checkboxLabelClass, errorClass, inputClass, labelClass, primaryButtonClass, textLinkClass } from './form-styles'

type Field = 'name' | 'email' | 'phone' | 'businessName' | 'businessForm' | 'activity' | 'city' | 'postUrl' | 'rules'
type FormErrors = Partial<Record<Field, string>>

type ContestFormCopy = {
  errors: Record<Field, string>
  submitError: string
  networkError: string
  confirmTitle: string
  confirmBody: string
  alreadyTitle: string
  alreadyBody: string
  name: string
  email: string
  businessName: string
  businessForm: string
  choose: string
  forms: Record<BusinessForm, string>
  activity: string
  activityPlaceholder: string
  city: string
  phone: string
  siteGoal: string
  postUrl: string
  postPlaceholder: string
  rulesBefore: string
  rulesLink: string
  rulesMid: string
  privacyLink: string
  rulesAfter: string
  marketing: string
  sending: string
  submit: string
}

const contestFormCopy = {
  ro: {
    errors: {
      name: 'Scrie numele tău complet.',
      email: 'Introdu o adresă de e-mail validă.',
      phone: 'Introdu un telefon cu minimum 9 cifre sau lasă câmpul gol.',
      businessName: 'Scrie numele afacerii.',
      businessForm: 'Alege forma de organizare.',
      activity: 'Spune-ne domeniul de activitate.',
      city: 'Scrie orașul.',
      postUrl: 'Linkul trebuie să fie al unei postări de pe Instagram sau Facebook.',
      rules: 'Ca să participi, trebuie să accepți regulamentul.',
    },
    submitError: 'Înscrierea nu a mers. Încearcă din nou.',
    networkError: 'Înscrierea nu a mers. Verifică conexiunea și încearcă din nou.',
    confirmTitle: 'Verifică-ți e-mailul.',
    confirmBody: 'Ți-am trimis un link de confirmare. Apasă pe el în cel mult 3 zile ca să intri în runda din această lună. Dacă nu-l găsești, verifică și folderul Spam sau Promoții.',
    alreadyTitle: 'Ești deja înscris.',
    alreadyBody: 'Ți-am retrimis pe e-mail linkul către pagina ta de participare, unde adaugi postarea pentru runda din această lună.',
    name: 'Numele tău',
    email: 'E-mail',
    businessName: 'Numele afacerii',
    businessForm: 'Forma de organizare',
    choose: 'Alege',
    forms: {
      SRL: 'SRL',
      PFA: 'PFA',
      'Întreprindere individuală': 'Întreprindere individuală',
      'Întreprindere familială': 'Întreprindere familială',
      ONG: 'ONG',
      'Altă formă': 'Altă formă',
    },
    activity: 'Domeniul de activitate',
    activityPlaceholder: 'ex: salon de înfrumusețare',
    city: 'Orașul',
    phone: 'Telefon (opțional)',
    siteGoal: 'Ce ar trebui să facă site-ul pentru afacerea ta? (opțional)',
    postUrl: 'Linkul postării (opțional acum, îl poți adăuga și după confirmare)',
    postPlaceholder: 'https://www.instagram.com/p/...',
    rulesBefore: 'Am citit și accept ',
    rulesLink: 'regulamentul concursului',
    rulesMid: ' și ',
    privacyLink: 'politica de confidențialitate',
    rulesAfter: '. Afacerea mea e înregistrată în România și am cel puțin 18 ani.',
    marketing: 'Vreau să primesc pe e-mail, o dată pe lună, ghiduri și noutăți de la MAST Studio. Mă pot dezabona oricând. (opțional)',
    sending: 'Se trimite...',
    submit: 'Mă înscriu în concurs',
  },
  en: {
    errors: {
      name: 'Enter your full name.',
      email: 'Enter a valid email address.',
      phone: 'Enter a phone number with at least 9 digits, or leave the field empty.',
      businessName: 'Enter the business name.',
      businessForm: 'Choose the legal form.',
      activity: 'Tell us the field of activity.',
      city: 'Enter the city.',
      postUrl: 'The link must be an Instagram or Facebook post.',
      rules: 'To enter, you need to accept the rules.',
    },
    submitError: 'The entry did not go through. Try again.',
    networkError: 'The entry did not go through. Check your connection and try again.',
    confirmTitle: 'Check your email.',
    confirmBody: 'We sent you a confirmation link. Open it within 3 days to join this month’s round. If you cannot find it, check the Spam or Promotions folder too.',
    alreadyTitle: 'You are already entered.',
    alreadyBody: 'We sent the link to your entry page again, where you add the post for this month’s round.',
    name: 'Your name',
    email: 'Email',
    businessName: 'Business name',
    businessForm: 'Legal form',
    choose: 'Choose',
    forms: {
      SRL: 'SRL (limited liability company)',
      PFA: 'PFA (authorised natural person)',
      'Întreprindere individuală': 'Întreprindere individuală (individual enterprise)',
      'Întreprindere familială': 'Întreprindere familială (family enterprise)',
      ONG: 'ONG (non-profit)',
      'Altă formă': 'Altă formă (another legal form)',
    },
    activity: 'Field of activity',
    activityPlaceholder: 'e.g. beauty salon',
    city: 'City',
    phone: 'Phone (optional)',
    siteGoal: 'What should the website do for your business? (optional)',
    postUrl: 'Link to the post (optional for now; you can add it after confirming)',
    postPlaceholder: 'https://www.instagram.com/p/...',
    rulesBefore: 'I have read and accept the ',
    rulesLink: 'contest rules',
    rulesMid: ' and the ',
    privacyLink: 'privacy policy',
    rulesAfter: '. My business is registered in Romania and I am at least 18.',
    marketing: 'I want to receive guides and news from MAST Studio by email, once a month. I can unsubscribe at any time. (optional)',
    sending: 'Sending...',
    submit: 'Enter the contest',
  },
} satisfies Record<Locale, ContestFormCopy>

function validate(form: FormData, t: ContestFormCopy): FormErrors {
  const value = (field: string) => String(form.get(field) ?? '').trim()
  const errors: FormErrors = {}
  if (value('name').length < 3) errors.name = t.errors.name
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value('email'))) errors.email = t.errors.email
  if (value('phone') && value('phone').replace(/\D/g, '').length < 9) errors.phone = t.errors.phone
  if (value('businessName').length < 2) errors.businessName = t.errors.businessName
  if (!value('businessForm')) errors.businessForm = t.errors.businessForm
  if (value('activity').length < 3) errors.activity = t.errors.activity
  if (value('city').length < 2) errors.city = t.errors.city
  if (value('postUrl') && !/(instagram\.com|facebook\.com|fb\.com|fb\.watch)/i.test(value('postUrl'))) {
    errors.postUrl = t.errors.postUrl
  }
  if (form.get('rules') !== 'da') errors.rules = t.errors.rules
  return errors
}

export default function ContestSignupForm() {
  const locale = useLocale()
  const href = useHref()
  const t = contestFormCopy[locale]
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<'confirm-sent' | 'already-confirmed' | null>(null)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const nextErrors = validate(form, t)
    setErrors(nextErrors)
    setSubmitError('')
    if (Object.keys(nextErrors).length > 0) return

    const payload = {
      ...Object.fromEntries(['name', 'email', 'phone', 'businessName', 'businessForm', 'activity', 'city', 'siteGoal', 'postUrl', 'website'].map((key) => [key, String(form.get(key) ?? '')])),
      rules: form.get('rules') === 'da',
      marketing: form.get('marketing') === 'da',
      locale,
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
        setSubmitError(body.error ?? t.submitError)
        return
      }
      trackConversion('contest_signup', { marketing: payload.marketing })
      setResult(body.status)
    } catch {
      setSubmitError(t.networkError)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (result) {
    return (
      <div className="porthole border-[var(--glass-edge)] p-7 md:p-9" role="status">
        <p className="type-h3 text-balance">{result === 'confirm-sent' ? t.confirmTitle : t.alreadyTitle}</p>
        <p className="type-body mt-3">{result === 'confirm-sent' ? t.confirmBody : t.alreadyBody}</p>
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
          {textField('name', t.name, { type: 'text', autoComplete: 'name', maxLength: 120, required: true })}
          {textField('email', t.email, { type: 'email', autoComplete: 'email', maxLength: 254, required: true })}
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {textField('businessName', t.businessName, { type: 'text', autoComplete: 'organization', maxLength: 120, required: true })}
          <div>
            <label htmlFor="concurs-businessForm" className={labelClass}>
              {t.businessForm}
            </label>
            <select id="concurs-businessForm" name="businessForm" defaultValue="" className={inputClass} aria-invalid={Boolean(errors.businessForm)} aria-describedby={describedBy('businessForm')} disabled={isSubmitting} required>
              <option value="" disabled>
                {t.choose}
              </option>
              {BUSINESS_FORMS.map((form) => (
                <option key={form} value={form}>
                  {t.forms[form]}
                </option>
              ))}
            </select>
            {errorText('businessForm')}
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {textField('activity', t.activity, { type: 'text', maxLength: 120, placeholder: t.activityPlaceholder, required: true })}
          {textField('city', t.city, { type: 'text', autoComplete: 'address-level2', maxLength: 80, required: true })}
        </div>
        {textField('phone', t.phone, { type: 'tel', autoComplete: 'tel', maxLength: 40 })}

        <div>
          <label htmlFor="concurs-siteGoal" className={labelClass}>
            {t.siteGoal}
          </label>
          <textarea id="concurs-siteGoal" name="siteGoal" rows={3} maxLength={1000} className={`${inputClass} resize-y`} disabled={isSubmitting} />
        </div>

        {textField('postUrl', t.postUrl, { type: 'url', inputMode: 'url', maxLength: 500, placeholder: t.postPlaceholder })}

        <div>
          <label className={checkboxLabelClass}>
            <input name="rules" type="checkbox" value="da" className={checkboxClass} aria-invalid={Boolean(errors.rules)} aria-describedby={describedBy('rules')} disabled={isSubmitting} required />
            <span>
              {t.rulesBefore}
              <Link href={href(RULES_PATH)} className={textLinkClass}>
                {t.rulesLink}
              </Link>
              {t.rulesMid}
              <Link href={href('/confidentialitate')} className={textLinkClass}>
                {t.privacyLink}
              </Link>
              {t.rulesAfter}
            </span>
          </label>
          {errorText('rules')}
        </div>

        <label className={checkboxLabelClass}>
          <input name="marketing" type="checkbox" value="da" className={checkboxClass} disabled={isSubmitting} />
          <span>{t.marketing}</span>
        </label>

        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="concurs-website">Website</label>
          <input id="concurs-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="flex flex-col items-start gap-3">
          <button type="submit" disabled={isSubmitting} className={primaryButtonClass}>
            {isSubmitting ? t.sending : t.submit}
          </button>
          <div aria-live="polite">{submitError ? <p className="font-sans text-sm text-[var(--ink-2)]">{submitError}</p> : null}</div>
        </div>
      </div>
    </form>
  )
}

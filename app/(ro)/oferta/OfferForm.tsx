'use client'

import { FormEvent, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { trackConversion } from '@/lib/analytics'
import { redirectToThankYou } from '@/lib/leads'
import { useLocale } from '@/lib/i18n/context'

const businessTypes = [
  'Cabinet medical sau clinică',
  'Salon sau înfrumusețare',
  'Restaurant sau cafenea',
  'Meserii și servicii',
  'Firmă sau consultanță',
  'Magazin online',
  'Altceva',
]

type FormErrors = {
  name?: string
  phone?: string
  email?: string
  contact?: string
  businessType?: string
}

const inputClass =
  'min-h-12 w-full rounded-[var(--radius-card)] border-[1.5px] border-[var(--hairline)] bg-[rgba(255,255,255,0.5)] px-4 py-3.5 font-sans text-base text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--fg-3)] focus:border-[var(--brass)] focus-visible:ring-2 focus-visible:ring-[var(--brass)] focus-visible:ring-offset-2'

// Romanian mobile formats: 07xx xxx xxx or +40 7xx xxx xxx, spaces, dashes,
// dots and parentheses allowed.
function isValidRoPhone(value: string) {
  const normalized = value
    .replace(/[\s.\-()]/g, '')
    .replace(/^\+40/, '0')
    .replace(/^40/, '0')
  return /^07\d{8}$/.test(normalized)
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

export default function OfferForm() {
  const locale = useLocale()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})

  function validate() {
    const nextErrors: FormErrors = {}
    if (name.trim().length < 2) nextErrors.name = 'Spune-ne cum te numești.'
    if (phone.trim() && !isValidRoPhone(phone)) nextErrors.phone = 'Scrie un număr de telefon valid.'
    if (email.trim() && !isValidEmail(email)) nextErrors.email = 'Scrie o adresă de email validă.'
    if (!phone.trim() && !email.trim())
      nextErrors.contact = 'Lasă-ne un număr de telefon sau o adresă de email, ca să te putem contacta.'
    if (!businessType) nextErrors.businessType = 'Alege tipul afacerii.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) return

    // Bots that fill the hidden field get the same redirect, without the
    // conversion being counted on our side.
    if (!honeypot.trim()) {
      trackConversion('lead_form_submit', { channel: 'form', placement: 'oferta' })
    }
    redirectToThankYou(locale, 'oferta', name)
  }

  const fieldError = (id: string, message?: string) =>
    message ? (
      <p id={id} className="mt-2 font-sans text-sm text-[var(--brass-ink)]">
        {message}
      </p>
    ) : null

  const describedBy = (...ids: (string | false | undefined)[]) =>
    ids.filter(Boolean).join(' ') || undefined

  return (
    <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-5">
      <div>
        <label htmlFor="oferta-name" className="font-sans text-sm font-semibold text-[var(--ink)]">
          Nume
        </label>
        <input
          id="oferta-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={120}
          className={`${inputClass} mt-2`}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'oferta-name-error' : undefined}
          required
        />
        {fieldError('oferta-name-error', errors.name)}
      </div>

      <div>
        <label htmlFor="oferta-phone" className="font-sans text-sm font-semibold text-[var(--ink)]">
          Telefon
        </label>
        <input
          id="oferta-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          maxLength={30}
          placeholder="07xx xxx xxx"
          className={`${inputClass} mt-2`}
          aria-invalid={Boolean(errors.phone || errors.contact)}
          aria-describedby={describedBy(errors.phone && 'oferta-phone-error', errors.contact && 'oferta-contact-error')}
        />
        {fieldError('oferta-phone-error', errors.phone)}
        {fieldError('oferta-contact-error', errors.contact)}
      </div>

      <div>
        <label htmlFor="oferta-email" className="font-sans text-sm font-semibold text-[var(--ink)]">
          Email
        </label>
        <input
          id="oferta-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          maxLength={160}
          placeholder="nume@exemplu.ro"
          className={`${inputClass} mt-2`}
          aria-invalid={Boolean(errors.email || errors.contact)}
          aria-describedby={describedBy(errors.email && 'oferta-email-error', errors.contact && 'oferta-contact-error')}
        />
        {fieldError('oferta-email-error', errors.email)}
      </div>

      <div>
        <label htmlFor="oferta-type" className="font-sans text-sm font-semibold text-[var(--ink)]">
          Tip afacere
        </label>
        <select
          id="oferta-type"
          name="businessType"
          value={businessType}
          onChange={(event) => setBusinessType(event.target.value)}
          className={`${inputClass} mt-2 appearance-none bg-[rgba(255,255,255,0.5)]`}
          aria-invalid={Boolean(errors.businessType)}
          aria-describedby={errors.businessType ? 'oferta-type-error' : undefined}
          required
        >
          <option value="" disabled>
            Alege tipul afacerii
          </option>
          {businessTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {fieldError('oferta-type-error', errors.businessType)}
      </div>

      {/* Honeypot, hidden from people and screen readers. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="oferta-website">Website</label>
        <input
          id="oferta-website"
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
        className="group inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[999px] bg-[var(--ink)] px-8 py-3.5 font-sans text-[15px] font-bold text-[var(--shell)] transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-[#2E2822] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
      >
        Vreau site-ul gratuit
        <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </form>
  )
}

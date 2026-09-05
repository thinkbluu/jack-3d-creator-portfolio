'use client'

import { FormEvent, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { WHATSAPP_NUMBER } from './SegmentContext'

type LeadFormProps = {
  variant?: 'inline' | 'page'
  serviceSlug?: string
}

type ProjectType = 'Site de prezentare' | 'Magazin online' | 'Aplicație sau platformă' | 'Nu știu încă'

type FormErrors = {
  projectType?: string
  contact?: string
  currentSite?: string
}

const projectTypes: ProjectType[] = [
  'Site de prezentare',
  'Magazin online',
  'Aplicație sau platformă',
  'Nu știu încă',
]

const serviceProjectType: Record<string, ProjectType> = {
  'site-de-prezentare': 'Site de prezentare',
  'magazin-online': 'Magazin online',
  'aplicatii-si-platforme': 'Aplicație sau platformă',
}

function hasValidContact(value: string) {
  return value.includes('@') || value.replace(/\D/g, '').length >= 9
}

function hasValidSite(value: string) {
  if (!value.trim()) return true

  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`
    const url = new URL(candidate)
    return Boolean(url.hostname && url.hostname.includes('.'))
  } catch {
    return false
  }
}

function buildWhatsAppUrl(projectType: ProjectType, currentSite: string, contact: string) {
  const lines = [`Salut! Vreau ${projectType.toLowerCase()}.`]
  if (currentSite.trim()) lines.push(`Site actual: ${currentSite.trim()}.`)
  lines.push(`Mă puteți contacta la: ${contact.trim()}.`)

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

export default function LeadForm({ variant = 'inline', serviceSlug }: LeadFormProps) {
  const [projectType, setProjectType] = useState<ProjectType | ''>(
    serviceSlug ? (serviceProjectType[serviceSlug] ?? '') : '',
  )
  const [currentSite, setCurrentSite] = useState('')
  const [contact, setContact] = useState('')
  const [website, setWebsite] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const whatsAppUrl = projectType
    ? buildWhatsAppUrl(projectType, currentSite, contact)
    : `https://wa.me/${WHATSAPP_NUMBER}`

  function validate() {
    const nextErrors: FormErrors = {}

    if (!projectType) nextErrors.projectType = 'Alege tipul proiectului.'
    if (!hasValidContact(contact.trim())) {
      nextErrors.contact = 'Introdu un telefon cu minimum 9 cifre sau o adresă de email.'
    }
    if (!hasValidSite(currentSite)) {
      nextErrors.currentSite = 'Introdu o adresă validă, de exemplu firmata.ro.'
    }

    setErrors(nextErrors)
    setSubmitError(false)
    return Object.keys(nextErrors).length === 0
  }

  function payload() {
    return {
      projectType,
      currentSite: currentSite.trim(),
      contact: contact.trim(),
      website,
    }
  }

  function openWhatsApp() {
    if (!validate() || !projectType) return

    setIsSubmitting(true)
    void fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload()),
      keepalive: true,
    })
      .then(async (response) => {
        const result = (await response.json()) as { ok?: boolean }
        if (!response.ok || !result.ok) setSubmitError(true)
      })
      .catch(() => setSubmitError(true))
      .finally(() => setIsSubmitting(false))
    window.open(buildWhatsAppUrl(projectType, currentSite, contact), '_blank', 'noopener,noreferrer')
  }

  async function submitForCallback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload()),
      })
      const result = (await response.json()) as { ok?: boolean }

      if (!response.ok || !result.ok) throw new Error('Lead submission failed')
      setIsSuccessful(true)
    } catch {
      setSubmitError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccessful) {
    return (
      <div
        className={variant === 'page' ? 'porthole border-[var(--glass-edge)] p-7 md:p-9' : ''}
        role="status"
      >
        <p className="type-h3 text-balance">Am primit datele.</p>
        <p className="type-body mt-3">
          Te contactăm în cel mai scurt timp, în timpul programului.
        </p>
        <p className="mt-4 font-sans text-[13px] text-[var(--ink-3)]">
          Dacă vrei răspuns imediat,{' '}
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--brass)] underline underline-offset-4"
          >
            scrie-ne pe WhatsApp.
          </a>
        </p>
      </div>
    )
  }

  const inputClass =
    'min-h-11 w-full border-[1.5px] border-[var(--hairline)] bg-[rgba(255,255,255,0.5)] px-4 py-3.5 font-sans text-base text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-3)] focus:border-[var(--brass)] focus-visible:ring-2 focus-visible:ring-[var(--brass)] focus-visible:ring-offset-2'
  const primaryButtonClass =
    'group inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--ink)] px-8 py-[15px] font-sans text-[14.5px] font-bold text-[var(--shell)] transition-[background-color,transform,color] duration-[250ms] ease-out hover:-translate-y-px hover:bg-[#2E2822] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto'

  return (
    <form
      onSubmit={submitForCallback}
      className={variant === 'page' ? 'porthole border-[var(--glass-edge)] p-7 md:p-9' : ''}
      noValidate
    >
      <div className="flex flex-col gap-6">
        <fieldset aria-describedby={errors.projectType ? 'project-type-error' : undefined}>
          <legend className="font-sans text-sm font-semibold text-[var(--ink)]">Tip de proiect</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {projectTypes.map((option) => {
              const selected = projectType === option
              return (
                <label key={option} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="projectType"
                    value={option}
                    checked={selected}
                    onChange={() => setProjectType(option)}
                    className="peer sr-only"
                    disabled={isSubmitting}
                  />
                  <span className="relative flex min-h-11 items-center rounded-[var(--radius-pill)] border-[1.5px] border-[var(--hairline)] px-4 py-2.5 font-sans text-sm font-semibold text-[var(--ink-2)] transition-colors hover:border-[var(--brass)] peer-checked:border-[var(--brass)] peer-checked:bg-[rgba(176,141,63,0.08)] peer-checked:text-[var(--ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--brass)]">
                    {option}
                    {selected ? (
                      <span
                        aria-hidden="true"
                        className="absolute right-2 top-2 size-[7px] rounded-full bg-[var(--brass)]"
                      />
                    ) : null}
                  </span>
                </label>
              )
            })}
          </div>
          {errors.projectType ? (
            <p id="project-type-error" className="mt-2 font-sans text-sm text-[var(--brass)]">
              {errors.projectType}
            </p>
          ) : null}
        </fieldset>

        <div>
          <label htmlFor="lead-current-site" className="font-sans text-sm font-semibold text-[var(--ink)]">
            Ai deja un site? (opțional)
          </label>
          <input
            id="lead-current-site"
            type="url"
            inputMode="url"
            value={currentSite}
            onChange={(event) => setCurrentSite(event.target.value)}
            placeholder="ex: firmata.ro"
            maxLength={2048}
            className={`${inputClass} mt-3 rounded-[var(--radius-card)]`}
            aria-invalid={Boolean(errors.currentSite)}
            aria-describedby={errors.currentSite ? 'current-site-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.currentSite ? (
            <p id="current-site-error" className="mt-2 font-sans text-sm text-[var(--brass)]">
              {errors.currentSite}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lead-contact" className="font-sans text-sm font-semibold text-[var(--ink)]">
            Telefon sau email
          </label>
          <input
            id="lead-contact"
            type="text"
            value={contact}
            onChange={(event) => setContact(event.target.value)}
            autoComplete="on"
            maxLength={320}
            className={`${inputClass} mt-3 rounded-[var(--radius-card)]`}
            aria-invalid={Boolean(errors.contact)}
            aria-describedby={errors.contact ? 'contact-error' : undefined}
            disabled={isSubmitting}
            required
          />
          {errors.contact ? (
            <p id="contact-error" className="mt-2 font-sans text-sm text-[var(--brass)]">
              {errors.contact}
            </p>
          ) : null}
        </div>

        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="lead-website">Website</label>
          <input
            id="lead-website"
            name="website"
            type="text"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex flex-col items-start gap-3">
          <button
            type="button"
            onClick={openWhatsApp}
            disabled={isSubmitting}
            className={primaryButtonClass}
          >
            {isSubmitting ? 'Se trimite...' : 'Deschide WhatsApp cu datele completate'}
            {!isSubmitting ? <ArrowUpRight aria-hidden="true" size={16} /> : null}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 font-sans text-sm font-semibold text-[var(--ink-3)] underline decoration-[var(--hairline)] underline-offset-4 transition-colors hover:text-[var(--brass)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brass)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Se trimite...' : 'Sau trimite-ne datele și te contactăm noi'}
          </button>
        </div>

        <div aria-live="polite">
          {submitError ? (
            <p className="font-sans text-sm text-[var(--ink-2)]">
              Ceva nu a mers.{' '}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--brass)] underline underline-offset-4"
              >
                Scrie-ne direct pe WhatsApp.
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </form>
  )
}

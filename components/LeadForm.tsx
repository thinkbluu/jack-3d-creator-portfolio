'use client'

import { FormEvent, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { trackConversion } from '@/lib/analytics'
import { useLocale, useUi } from '@/lib/i18n/context'
import { canonicalServiceSlug } from '@/lib/i18n/paths'
import { WHATSAPP_NUMBER } from './SegmentContext'

type LeadFormProps = {
  variant?: 'inline' | 'page'
  serviceSlug?: string
}

type ProjectTypeId = 'presentation' | 'store' | 'app' | 'unsure'

type FormErrors = {
  projectType?: string
  contact?: string
  currentSite?: string
}

const serviceProjectType: Record<string, ProjectTypeId> = {
  'site-de-prezentare': 'presentation',
  'magazin-online': 'store',
  'aplicatii-web': 'app',
  'platforme-saas': 'app',
  'aplicatii-si-platforme': 'app',
}

function projectTypeForSlug(slug?: string): ProjectTypeId | '' {
  if (!slug) return ''
  if (serviceProjectType[slug]) return serviceProjectType[slug]
  const canonical = canonicalServiceSlug(slug)
  return canonical && serviceProjectType[canonical] ? serviceProjectType[canonical] : ''
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

function fill(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce((text, [key, value]) => text.split(`{${key}}`).join(value), template)
}

function buildWhatsAppUrl(intro: string, siteLine: string | null, contactLine: string) {
  const lines = [intro]
  if (siteLine) lines.push(siteLine)
  lines.push(contactLine)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

export default function LeadForm({ variant = 'inline', serviceSlug }: LeadFormProps) {
  const locale = useLocale()
  const lead = useUi().lead
  const [projectType, setProjectType] = useState<ProjectTypeId | ''>(projectTypeForSlug(serviceSlug))
  const [currentSite, setCurrentSite] = useState('')
  const [contact, setContact] = useState('')
  const [website, setWebsite] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const typeLabel = lead.types.find((option) => option.id === projectType)?.label ?? ''
  const whatsAppUrl = projectType
    ? buildWhatsAppUrl(
        fill(lead.waIntro, { type: typeLabel }),
        currentSite.trim() ? fill(lead.waSite, { site: currentSite.trim() }) : null,
        fill(lead.waContact, { contact: contact.trim() }),
      )
    : `https://wa.me/${WHATSAPP_NUMBER}`

  function validate() {
    const nextErrors: FormErrors = {}

    if (!projectType) nextErrors.projectType = lead.chooseType
    if (!hasValidContact(contact.trim())) nextErrors.contact = lead.badContact
    if (!hasValidSite(currentSite)) nextErrors.currentSite = lead.badSite

    setErrors(nextErrors)
    setSubmitError('')
    return Object.keys(nextErrors).length === 0
  }

  function payload() {
    return {
      projectType,
      currentSite: currentSite.trim(),
      contact: contact.trim(),
      website,
      locale,
    }
  }

  async function errorFrom(response: Response) {
    try {
      const result = (await response.json()) as { ok?: boolean; error?: string }
      if (!response.ok || !result.ok) return result.error || lead.error
      return ''
    } catch {
      return lead.error
    }
  }

  function openWhatsApp() {
    if (!validate() || !projectType) return

    trackConversion('lead_form_submit', {
      project_type: projectType,
      has_website: Boolean(currentSite.trim()),
    })
    trackConversion('whatsapp_click', {
      placement: variant === 'page' ? 'lead_form_page' : 'lead_form_inline',
    })

    setIsSubmitting(true)
    void fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload()),
      keepalive: true,
    })
      .then(async (response) => {
        const message = await errorFrom(response)
        if (message) setSubmitError(message)
      })
      .catch(() => setSubmitError(lead.error))
      .finally(() => setIsSubmitting(false))
    window.open(whatsAppUrl, '_blank', 'noopener,noreferrer')
  }

  async function submitForCallback(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validate() || !projectType) return

    trackConversion('lead_form_submit', {
      project_type: projectType,
      has_website: Boolean(currentSite.trim()),
    })

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload()),
      })
      const message = await errorFrom(response)
      if (message) {
        setSubmitError(message)
        return
      }
      setIsSuccessful(true)
    } catch {
      setSubmitError(lead.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccessful) {
    const [successTitle, ...successRest] = lead.success.split(/(?<=\.)\s+/)
    return (
      <div
        className={variant === 'page' ? 'porthole border-[var(--glass-edge)] p-7 md:p-9' : ''}
        role="status"
      >
        <p className="type-h3 text-balance">{successTitle}</p>
        {successRest.length > 0 ? <p className="type-body mt-3">{successRest.join(' ')}</p> : null}
        <p className="mt-4 font-sans text-[13px] text-[var(--ink-3)]">
          <a
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--brass-ink)] underline underline-offset-4"
          >
            {lead.errorLink}
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
          <legend className="font-sans text-sm font-semibold text-[var(--ink)]">{lead.legend}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {lead.types.map((option) => {
              const selected = projectType === option.id
              return (
                <label key={option.id} className="relative cursor-pointer">
                  <input
                    type="radio"
                    name="projectType"
                    value={option.id}
                    checked={selected}
                    onChange={() => setProjectType(option.id as ProjectTypeId)}
                    className="peer sr-only"
                    disabled={isSubmitting}
                  />
                  <span className="relative flex min-h-11 items-center rounded-[var(--radius-pill)] border-[1.5px] border-[var(--hairline)] px-4 py-2.5 font-sans text-sm font-semibold text-[var(--ink-2)] transition-colors hover:border-[var(--brass)] peer-checked:border-[var(--brass)] peer-checked:bg-[rgba(176,141,63,0.08)] peer-checked:text-[var(--ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--brass)]">
                    {option.label}
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
            <p id="project-type-error" className="mt-2 font-sans text-sm text-[var(--brass-ink)]">
              {errors.projectType}
            </p>
          ) : null}
        </fieldset>

        <div>
          <label htmlFor="lead-current-site" className="font-sans text-sm font-semibold text-[var(--ink)]">
            {lead.siteLabel}
          </label>
          <input
            id="lead-current-site"
            type="url"
            inputMode="url"
            value={currentSite}
            onChange={(event) => setCurrentSite(event.target.value)}
            placeholder={lead.sitePlaceholder}
            maxLength={2048}
            className={`${inputClass} mt-3 rounded-[var(--radius-card)]`}
            aria-invalid={Boolean(errors.currentSite)}
            aria-describedby={errors.currentSite ? 'current-site-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.currentSite ? (
            <p id="current-site-error" className="mt-2 font-sans text-sm text-[var(--brass-ink)]">
              {errors.currentSite}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lead-contact" className="font-sans text-sm font-semibold text-[var(--ink)]">
            {lead.contactLabel}
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
            <p id="contact-error" className="mt-2 font-sans text-sm text-[var(--brass-ink)]">
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
            {isSubmitting ? lead.sending : lead.openWhatsapp}
            {!isSubmitting ? <ArrowUpRight aria-hidden="true" size={16} /> : null}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="min-h-11 font-sans text-sm font-semibold text-[var(--ink-3)] underline decoration-[var(--hairline)] underline-offset-4 transition-colors hover:text-[var(--brass)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brass)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? lead.sending : lead.send}
          </button>
        </div>

        <div aria-live="polite">
          {submitError ? (
            <p className="font-sans text-sm text-[var(--ink-2)]">
              {submitError}{' '}
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[var(--brass-ink)] underline underline-offset-4"
              >
                {lead.errorLink}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </form>
  )
}

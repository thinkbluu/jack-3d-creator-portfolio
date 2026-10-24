'use client'

import { FormEvent, useState } from 'react'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { trackConversion } from '@/lib/analytics'
import { redirectToThankYou } from '@/lib/leads'
import { useLocale, useUi } from '@/lib/i18n/context'
import { canonicalServiceSlug } from '@/lib/i18n/paths'
import ChannelSwitch, { type Channel } from './ChannelSwitch'
import { WHATSAPP_NUMBER } from './SegmentContext'

type LeadFormProps = {
  variant?: 'inline' | 'page'
  serviceSlug?: string
}

type ProjectTypeId = 'presentation' | 'store' | 'app' | 'unsure'

type FormErrors = {
  projectType?: string
  currentSite?: string
  name?: string
  email?: string
  phone?: string
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
}

function hasValidPhone(value: string) {
  return !value.trim() || value.replace(/\D/g, '').length >= 9
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

function buildWhatsAppUrl(intro: string, siteLine: string | null) {
  const lines = [intro]
  if (siteLine) lines.push(siteLine)
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`
}

export default function LeadForm({ variant = 'inline', serviceSlug }: LeadFormProps) {
  const locale = useLocale()
  const lead = useUi().lead
  const [channel, setChannel] = useState<Channel>('whatsapp')
  const [projectType, setProjectType] = useState<ProjectTypeId | ''>(projectTypeForSlug(serviceSlug))
  const [currentSite, setCurrentSite] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const typeLabel = lead.types.find((option) => option.id === projectType)?.label ?? ''
  const whatsAppUrl = projectType
    ? buildWhatsAppUrl(
        fill(lead.waIntro, { type: typeLabel }),
        currentSite.trim() ? fill(lead.waSite, { site: currentSite.trim() }) : null,
      )
    : `https://wa.me/${WHATSAPP_NUMBER}`

  function validate() {
    const nextErrors: FormErrors = {}
    if (!projectType) nextErrors.projectType = lead.chooseType
    if (!hasValidSite(currentSite)) nextErrors.currentSite = lead.badSite
    if (channel === 'email') {
      if (name.trim().length < 2) nextErrors.name = lead.badName
      if (!isValidEmail(email.trim())) nextErrors.email = lead.badEmail
      if (!hasValidPhone(phone)) nextErrors.phone = lead.badPhone
    }
    setErrors(nextErrors)
    setSubmitError('')
    return Object.keys(nextErrors).length === 0
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting || !validate() || !projectType) return

    // Quote forms report `cerere-oferta`; a form embedded on a service page
    // reports the service slug.
    const source = serviceSlug ? (canonicalServiceSlug(serviceSlug) ?? serviceSlug) : 'cerere-oferta'

    if (channel === 'whatsapp') {
      trackConversion('whatsapp_click', {
        placement: variant === 'page' ? 'lead_form_page' : 'lead_form_inline',
      })
      // window.open with noopener returns null, so the redirect is not
      // gated on its result: WhatsApp keeps the conversation, the tab
      // behind it counts the lead.
      window.open(whatsAppUrl, '_blank', 'noopener,noreferrer')
      trackConversion('lead_form_submit', {
        project_type: projectType,
        has_website: Boolean(currentSite.trim()),
        channel,
      })
      redirectToThankYou(locale, source, name)
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectType,
          currentSite: currentSite.trim(),
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          channel,
          website,
          locale,
        }),
      })
      const message = await errorFrom(response)
      if (message) {
        setSubmitError(message)
        return
      }
      trackConversion('lead_form_submit', {
        project_type: projectType,
        has_website: Boolean(currentSite.trim()),
        channel,
      })
      redirectToThankYou(locale, source, name)
    } catch {
      setSubmitError(lead.error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'min-h-11 w-full border-[1.5px] border-[var(--hairline)] bg-[rgba(255,255,255,0.5)] px-4 py-3.5 font-sans text-base text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--ink-3)] focus:border-[var(--brass)] focus-visible:ring-2 focus-visible:ring-[var(--brass)] focus-visible:ring-offset-2'
  const primaryButtonClass =
    'group inline-flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-[var(--ink)] px-8 py-[15px] font-sans text-[14.5px] font-bold text-[var(--shell)] transition-[background-color,transform,color] duration-[250ms] ease-out hover:-translate-y-px hover:bg-[#2E2822] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto'
  const fieldError = (id: string, message?: string) =>
    message ? (
      <p id={id} className="mt-2 font-sans text-sm text-[var(--brass-ink)]">
        {message}
      </p>
    ) : null

  return (
    <form
      toolname="request_website_quote"
      tooldescription="Request a fixed-price quote from MAST Studio for a presentation website, online store, web or mobile app, SaaS platform, UX/UI design, maintenance or WhatsApp automation."
      onSubmit={submit}
      className={variant === 'page' ? 'porthole border-[var(--glass-edge)] p-7 md:p-9' : ''}
      noValidate
    >
      <div className="flex flex-col gap-6">
        <ChannelSwitch
          value={channel}
          onChange={(next) => {
            setChannel(next)
            setErrors({})
            setSubmitError('')
          }}
          legend={lead.channel.legend}
          labels={{ whatsapp: lead.channel.whatsapp, email: lead.channel.email }}
          hint={channel === 'whatsapp' ? lead.channel.hintWhatsapp : lead.channel.hintEmail}
          disabled={isSubmitting}
        />

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
                    toolparamdescription="Type of project the quote is for: 'presentation' (presentation website), 'store' (online store), 'app' (web or mobile app) or 'unsure' (not decided yet). Ask the user to choose."
                    checked={selected}
                    onChange={() => setProjectType(option.id as ProjectTypeId)}
                    className="peer sr-only"
                    disabled={isSubmitting}
                  />
                  <span className="relative flex min-h-11 items-center rounded-[var(--radius-pill)] border-[1.5px] border-[var(--hairline)] px-4 py-2.5 font-sans text-sm font-semibold text-[var(--ink-2)] transition-colors hover:border-[var(--brass)] peer-checked:border-[var(--brass)] peer-checked:bg-[rgba(176,141,63,0.08)] peer-checked:text-[var(--ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--brass)]">
                    {option.label}
                    {selected ? <span aria-hidden="true" className="absolute right-2 top-2 size-[7px] rounded-full bg-[var(--brass)]" /> : null}
                  </span>
                </label>
              )
            })}
          </div>
          {fieldError('project-type-error', errors.projectType)}
        </fieldset>

        <div>
          <label htmlFor="lead-current-site" className="font-sans text-sm font-semibold text-[var(--ink)]">
            {lead.siteLabel}
          </label>
          <input
            id="lead-current-site"
            name="currentSite"
            type="url"
            toolparamdescription="URL of the visitor's current website, e.g. www.firmata.ro. Optional — leave empty if there is no website."
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
          {fieldError('current-site-error', errors.currentSite)}
        </div>

        {channel === 'email' ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="lead-name" className="font-sans text-sm font-semibold text-[var(--ink)]">
                  {lead.nameLabel}
                </label>
                <input
                  id="lead-name"
                  name="name"
                  type="text"
                  toolparamdescription="Full name of the person requesting the quote, e.g. Ana Popescu."
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={120}
                  className={`${inputClass} mt-3 rounded-[var(--radius-card)]`}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'lead-name-error' : undefined}
                  disabled={isSubmitting}
                  required
                />
                {fieldError('lead-name-error', errors.name)}
              </div>
              <div>
                <label htmlFor="lead-email" className="font-sans text-sm font-semibold text-[var(--ink)]">
                  {lead.emailLabel}
                </label>
                <input
                  id="lead-email"
                  name="email"
                  type="email"
                  toolparamdescription="Email address in the format name@example.com."
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  maxLength={254}
                  className={`${inputClass} mt-3 rounded-[var(--radius-card)]`}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'lead-email-error' : undefined}
                  disabled={isSubmitting}
                  required
                />
                {fieldError('lead-email-error', errors.email)}
              </div>
            </div>
            <div>
              <label htmlFor="lead-phone" className="font-sans text-sm font-semibold text-[var(--ink)]">
                {lead.phoneLabel} <span className="font-normal text-[var(--ink-3)]">{lead.optional}</span>
              </label>
              <input
                id="lead-phone"
                name="phone"
                type="tel"
                toolparamdescription="Romanian mobile number, e.g. 07xx xxx xxx or +40 7xx xxx xxx. Optional."
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                maxLength={30}
                className={`${inputClass} mt-3 rounded-[var(--radius-card)]`}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? 'lead-phone-error' : undefined}
                disabled={isSubmitting}
              />
              {fieldError('lead-phone-error', errors.phone)}
            </div>
          </>
        ) : null}

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

        <div>
          <button type="submit" disabled={isSubmitting} className={primaryButtonClass}>
            {isSubmitting ? lead.sending : channel === 'whatsapp' ? lead.openWhatsapp : lead.sendEmail}
            {!isSubmitting ? channel === 'whatsapp' ? <ArrowUpRight aria-hidden="true" size={16} /> : <ArrowRight aria-hidden="true" size={16} /> : null}
          </button>
        </div>

        <div aria-live="polite">
          {submitError ? (
            <p className="font-sans text-sm text-[var(--ink-2)]">
              {submitError}{' '}
              <a href={whatsAppUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--brass-ink)] underline underline-offset-4">
                {lead.errorLink}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </form>
  )
}

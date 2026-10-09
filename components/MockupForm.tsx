'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { submitMockupRequest } from '@/lib/mockup'
import { useHref } from '@/lib/i18n/context'
import { checkboxClass, checkboxLabelClass, errorClass, inputClass, labelClass, primaryButtonClass, textLinkClass } from './form-styles'

const DOMAINS = [
  'Clinică / cabinet medical',
  'Cabinet veterinar',
  'Stomatologie',
  'Salon / beauty',
  'Meserii și construcții',
  'Consultanță / servicii B2B',
  'Restaurant / HoReCa',
  'Magazin / retail',
  'Altul',
] as const

/** Accepts 07XXXXXXXX, +407XXXXXXXX or 00407XXXXXXXX, ignoring spaces. */
const RO_MOBILE = /^(?:(?:\+40|0040)7|07)\d{8}$/

const mockupSchema = z
  .object({
    nume: z.string().trim().min(2, 'Scrie numele tău.'),
    firma: z.string().trim().min(2, 'Scrie numele firmei.'),
    telefon: z
      .string()
      .transform((v) => v.replace(/[\s.\-()]/g, ''))
      .refine((v) => RO_MOBILE.test(v), { message: 'Introdu un număr de mobil valid.' })
      .transform((v) => `+40${v.replace(/^(?:\+40|0040|0)/, '')}`),
    email: z
      .string()
      .trim()
      .refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), { message: 'Introdu o adresă de e-mail validă.' }),
    domeniu: z
      .string()
      .refine((v) => (DOMAINS as readonly string[]).includes(v), { message: 'Alege domeniul de activitate.' }),
    site: z.string().trim(),
    noSite: z.boolean(),
    projectType: z
      .string()
      .refine((v) => v === 'prezentare' || v === 'magazin', { message: 'Alege ce vrei pentru firma ta.' }),
    servicii: z.string().trim().min(3, 'Scrie serviciile sau produsele principale.'),
    consent: z.boolean().refine((v) => v === true, { message: 'Bifează acordul ca să putem trimite mockup-ul.' }),
    // Honeypot: real people and screen readers never see or fill this.
    website: z.string(),
    // Tracking fields, filled from the URL for now.
    gclid: z.string(),
    utm_source: z.string(),
    utm_medium: z.string(),
    utm_campaign: z.string(),
    utm_term: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.noSite) return
    if (!data.site) {
      ctx.addIssue({ code: 'custom', path: ['site'], message: 'Scrie adresa site-ului actual sau bifează „Nu am site”.' })
      return
    }
    if (!/^(https?:\/\/)?[\w-]+(\.[\w-]+)+/.test(data.site)) {
      ctx.addIssue({ code: 'custom', path: ['site'], message: 'Introdu o adresă validă, de ex. www.firmata.ro.' })
    }
  })

type FormInput = z.input<typeof mockupSchema>
type FormOutput = z.output<typeof mockupSchema>

const UTM_FIELDS = ['gclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term'] as const

export default function MockupForm() {
  const href = useHref()
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(mockupSchema),
    defaultValues: {
      nume: '',
      firma: '',
      telefon: '',
      email: '',
      domeniu: '',
      site: '',
      noSite: false,
      projectType: '',
      servicii: '',
      consent: false,
      website: '',
      gclid: '',
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
    },
  })

  const noSite = watch('noSite')
  const projectType = watch('projectType')

  // Read tracking params and the ?tip= preselect from the URL on mount, and
  // listen for PreselectLink clicks (Black Friday band → "Magazin online").
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    for (const field of UTM_FIELDS) {
      const value = params.get(field)
      if (value) setValue(field, value)
    }
    if (params.get('tip') === 'magazin') setValue('projectType', 'magazin')

    const preselect = (event: Event) => {
      if ((event as CustomEvent<string>).detail === 'magazin') setValue('projectType', 'magazin')
    }
    window.addEventListener('mockup:preselect', preselect)
    return () => window.removeEventListener('mockup:preselect', preselect)
  }, [setValue])

  async function onSubmit(data: FormOutput) {
    // Honeypot filled: silently drop the submission.
    if (data.website) {
      setSent(true)
      return
    }
    await submitMockupRequest(data)
    setSent(true)
  }

  // Errors reserve their slot (fixed-height <p>) so appearing text never
  // shifts the layout.
  const errorSlot = (field: keyof FormInput, id: string) => (
    <p id={id} className={`${errorClass} min-h-6`}>
      {errors[field] instanceof Object && 'message' in errors[field]! ? String((errors[field] as { message: string }).message) : ''}
    </p>
  )
  const describedBy = (field: keyof FormInput, id: string) => (errors[field] ? id : undefined)

  if (sent) {
    return (
      <div className="porthole border-[var(--glass-edge)] p-7 md:p-9" role="status">
        <p className="type-h3 text-balance">Am primit cererea.</p>
        <p className="type-body mt-3">Îți răspundem pe WhatsApp în maximum 24 de ore lucrătoare.</p>
      </div>
    )
  }

  const radioCard = (value: 'prezentare' | 'magazin', labelText: string) => (
    <label className="relative cursor-pointer">
      <input
        type="radio"
        value={value}
        {...register('projectType')}
        className="peer sr-only"
        disabled={isSubmitting}
      />
      <span className="relative flex min-h-11 items-center justify-center rounded-[var(--radius-card)] border-[1.5px] border-[var(--hairline)] bg-[rgba(255,255,255,0.5)] px-4 py-3.5 font-sans text-sm font-semibold text-[var(--ink-2)] transition-colors hover:border-[var(--brass)] peer-checked:border-[var(--brass)] peer-checked:bg-[rgba(176,141,63,0.08)] peer-checked:text-[var(--ink)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--brass)]">
        {labelText}
        {projectType === value ? <span aria-hidden="true" className="absolute right-2.5 top-2.5 size-[7px] rounded-full bg-[var(--brass)]" /> : null}
      </span>
    </label>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="porthole border-[var(--glass-edge)] p-6 md:p-8" noValidate>
      <div className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="mockup-nume" className={labelClass}>
              Nume
            </label>
            <input
              id="mockup-nume"
              autoComplete="name"
              maxLength={120}
              className={inputClass}
              aria-invalid={Boolean(errors.nume)}
              aria-describedby={describedBy('nume', 'mockup-nume-error')}
              disabled={isSubmitting}
              {...register('nume')}
            />
            {errorSlot('nume', 'mockup-nume-error')}
          </div>
          <div>
            <label htmlFor="mockup-firma" className={labelClass}>
              Numele firmei
            </label>
            <input
              id="mockup-firma"
              autoComplete="organization"
              maxLength={120}
              className={inputClass}
              aria-invalid={Boolean(errors.firma)}
              aria-describedby={describedBy('firma', 'mockup-firma-error')}
              disabled={isSubmitting}
              {...register('firma')}
            />
            {errorSlot('firma', 'mockup-firma-error')}
          </div>
        </div>

        <div>
          <label htmlFor="mockup-telefon" className={labelClass}>
            Telefon WhatsApp
          </label>
          <input
            id="mockup-telefon"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="07xx xxx xxx"
            maxLength={20}
            className={inputClass}
            aria-invalid={Boolean(errors.telefon)}
            aria-describedby={describedBy('telefon', 'mockup-telefon-error')}
            disabled={isSubmitting}
            {...register('telefon')}
          />
          {errorSlot('telefon', 'mockup-telefon-error')}
        </div>

        <div>
          <label htmlFor="mockup-email" className={labelClass}>
            Email <span className="font-normal text-[var(--ink-3)]">(opțional)</span>
          </label>
          <input
            id="mockup-email"
            type="email"
            autoComplete="email"
            maxLength={254}
            className={inputClass}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy('email', 'mockup-email-error')}
            disabled={isSubmitting}
            {...register('email')}
          />
          {errorSlot('email', 'mockup-email-error')}
        </div>

        <div>
          <label htmlFor="mockup-domeniu" className={labelClass}>
            Domeniu de activitate
          </label>
          <select
            id="mockup-domeniu"
            defaultValue=""
            className={inputClass}
            aria-invalid={Boolean(errors.domeniu)}
            aria-describedby={describedBy('domeniu', 'mockup-domeniu-error')}
            disabled={isSubmitting}
            {...register('domeniu')}
          >
            <option value="" disabled>
              Alege
            </option>
            {DOMAINS.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
          {errorSlot('domeniu', 'mockup-domeniu-error')}
        </div>

        <div>
          <label htmlFor="mockup-site" className={labelClass}>
            Site actual
          </label>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
            <input
              id="mockup-site"
              type="url"
              inputMode="url"
              placeholder="www.firmata.ro"
              maxLength={200}
              className={`${inputClass} mt-0 flex-1`}
              aria-invalid={Boolean(errors.site)}
              aria-describedby={describedBy('site', 'mockup-site-error')}
              disabled={isSubmitting || noSite}
              {...register('site')}
            />
            <label className={`${checkboxLabelClass} mt-0 shrink-0 sm:mt-3`}>
              <input type="checkbox" className={checkboxClass} disabled={isSubmitting} {...register('noSite')} />
              <span>Nu am site</span>
            </label>
          </div>
          {errorSlot('site', 'mockup-site-error')}
        </div>

        <fieldset>
          <legend className={labelClass}>Ce vrei?</legend>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {radioCard('prezentare', 'Site de prezentare')}
            {radioCard('magazin', 'Magazin online')}
          </div>
          {errorSlot('projectType', 'mockup-projectType-error')}
        </fieldset>

        <div>
          <label htmlFor="mockup-servicii" className={labelClass}>
            Ce servicii sau produse principale ai?
          </label>
          <textarea
            id="mockup-servicii"
            rows={2}
            maxLength={1000}
            placeholder="ex: consultații, vaccinări, toaletaj"
            className={`${inputClass} resize-y`}
            aria-invalid={Boolean(errors.servicii)}
            aria-describedby={describedBy('servicii', 'mockup-servicii-error')}
            disabled={isSubmitting}
            {...register('servicii')}
          />
          {errorSlot('servicii', 'mockup-servicii-error')}
        </div>

        <div>
          <label className={checkboxLabelClass}>
            <input
              type="checkbox"
              className={checkboxClass}
              aria-invalid={Boolean(errors.consent)}
              aria-describedby={describedBy('consent', 'mockup-consent-error')}
              disabled={isSubmitting}
              {...register('consent')}
            />
            <span>
              Sunt de acord ca MAST Consult S.R.L. să folosească aceste date pentru a-mi trimite mockup-ul și a mă
              contacta pe WhatsApp.{' '}
              <Link href={href('/confidentialitate')} className={textLinkClass}>
                Politica de confidențialitate
              </Link>
            </span>
          </label>
          {errorSlot('consent', 'mockup-consent-error')}
        </div>

        {/* Honeypot: invisible to people and screen readers. */}
        <div className="absolute left-[-9999px]" aria-hidden="true">
          <label htmlFor="mockup-website">Website</label>
          <input id="mockup-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
        </div>

        {UTM_FIELDS.map((field) => (
          <input key={field} type="hidden" {...register(field)} />
        ))}

        {process.env.NEXT_PUBLIC_MOCKUP_FULL === 'true' ? (
          <p className="rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--shell-warm)] px-4 py-3 font-sans text-sm font-semibold text-[var(--ink)]">
            Locurile de azi s-au ocupat. Cererea ta intră în programul de mâine.
          </p>
        ) : null}

        <div className="flex flex-col items-start gap-2">
          <button type="submit" disabled={isSubmitting} className={`${primaryButtonClass} w-full sm:w-auto`}>
            {isSubmitting ? 'Se trimite…' : 'Vreau mockup-ul gratuit'}
          </button>
          <p className="font-sans text-sm text-[var(--ink-2)]">
            Îți răspundem pe WhatsApp în maximum 24 de ore lucrătoare.
          </p>
        </div>
      </div>
    </form>
  )
}

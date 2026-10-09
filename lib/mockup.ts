import { z } from 'zod'

export const DOMAINS = [
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

/**
 * Shared by the client form and the /api/mockup route, so the server
 * re-checks exactly what the client validated.
 */
export const mockupSchema = z
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
    website: z.string().default(''),
    // Tracking fields, filled from the URL for now. Defaulted so partial
    // payloads (e.g. server-side retries) don't hard-fail on empty tracking.
    gclid: z.string().default(''),
    utm_source: z.string().default(''),
    utm_medium: z.string().default(''),
    utm_campaign: z.string().default(''),
    utm_term: z.string().default(''),
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

export type MockupFormInput = z.input<typeof mockupSchema>
export type MockupFormOutput = z.output<typeof mockupSchema>

/** "MS-" + YYMMDD (Europe/Bucharest) + 4 random uppercase letters, e.g. MS-261012-K7QD. */
export function submissionId(now = new Date()) {
  const [day, month, year] = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Bucharest',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  })
    .format(now)
    .split('/')
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const random = Array.from({ length: 4 }, () => letters[Math.floor(Math.random() * letters.length)]).join('')
  return `MS-${year}${month}${day}-${random}`
}

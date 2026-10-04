import { BUSINESS_FORMS, isContestConfigured, type BusinessForm } from '@/lib/contest/config'
import { normalizePostUrl, registerEntrant } from '@/lib/contest/service'
import { isValidEmail } from '@/lib/email'
import type { Locale } from '@/lib/i18n/locale'
import { clientIp, isRateLimited } from '@/lib/request'
import { EMAIL } from '@/lib/site'

type Result =
  | { ok: true; status: 'confirm-sent' | 'already-confirmed' }
  | { ok: false; error: string }

const errors = {
  ro: {
    invalid: 'Cerere invalidă.',
    closed: 'Înscrierile se deschid în curând. Urmărește-ne pe Instagram sau Facebook.',
    rate: 'Prea multe încercări. Încearcă din nou peste câteva minute.',
    name: 'Scrie numele tău complet.',
    email: 'Adresa de e-mail nu este validă.',
    phone: 'Numărul de telefon nu este valid.',
    businessName: 'Scrie numele afacerii.',
    businessForm: 'Alege forma de organizare.',
    activity: 'Spune-ne domeniul de activitate.',
    city: 'Scrie orașul.',
    postUrl: 'Linkul trebuie să fie al unei postări de pe Instagram sau Facebook.',
    rules: 'Trebuie să accepți regulamentul ca să participi.',
    ipRate: 'Prea multe înscrieri din aceeași rețea azi. Încearcă mâine.',
    emailFailed: `Nu am putut trimite e-mailul de confirmare. Scrie-ne la ${EMAIL}.`,
    failed: `Înscrierea nu a mers. Încearcă din nou sau scrie-ne la ${EMAIL}.`,
  },
  en: {
    invalid: 'Invalid request.',
    closed: 'Entries open soon. Follow us on Instagram or Facebook.',
    rate: 'Too many attempts. Try again in a few minutes.',
    name: 'Enter your full name.',
    email: 'The email address is not valid.',
    phone: 'The phone number is not valid.',
    businessName: 'Enter the business name.',
    businessForm: 'Choose the legal form.',
    activity: 'Tell us the field of activity.',
    city: 'Enter the city.',
    postUrl: 'The link must be an Instagram or Facebook post.',
    rules: 'You need to accept the rules to enter.',
    ipRate: 'Too many entries from the same network today. Try again tomorrow.',
    emailFailed: `We could not send the confirmation email. Write to us at ${EMAIL}.`,
    failed: `The entry did not go through. Try again, or write to us at ${EMAIL}.`,
  },
} satisfies Record<Locale, Record<string, string>>

function json(body: Result, status = 200) {
  return Response.json(body, { status })
}

function field(payload: Record<string, unknown>, key: string, maxLength: number) {
  const value = payload[key]
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function requestLocale(payload: Record<string, unknown>): Locale {
  return payload.locale === 'en' ? 'en' : 'ro'
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>
  try {
    payload = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ ok: false, error: errors.ro.invalid }, 400)
  }

  const t = errors[requestLocale(payload)]

  if (field(payload, 'website', 200)) return json({ ok: true, status: 'confirm-sent' })

  if (!isContestConfigured()) {
    return json({ ok: false, error: t.closed }, 503)
  }

  const ip = clientIp(request)
  if (isRateLimited(`concurs:${ip}`, 5, 10 * 60_000)) {
    return json({ ok: false, error: t.rate }, 429)
  }

  const name = field(payload, 'name', 120)
  const email = field(payload, 'email', 254)
  const phone = field(payload, 'phone', 40)
  const businessName = field(payload, 'businessName', 120)
  const businessForm = field(payload, 'businessForm', 40)
  const activity = field(payload, 'activity', 120)
  const city = field(payload, 'city', 80)
  const siteGoal = field(payload, 'siteGoal', 1000)
  const rawPostUrl = field(payload, 'postUrl', 500)

  if (name.length < 3) return json({ ok: false, error: t.name }, 400)
  if (!isValidEmail(email)) return json({ ok: false, error: t.email }, 400)
  if (phone && phone.replace(/\D/g, '').length < 9) return json({ ok: false, error: t.phone }, 400)
  if (businessName.length < 2) return json({ ok: false, error: t.businessName }, 400)
  if (!BUSINESS_FORMS.includes(businessForm as BusinessForm)) return json({ ok: false, error: t.businessForm }, 400)
  if (activity.length < 3) return json({ ok: false, error: t.activity }, 400)
  if (city.length < 2) return json({ ok: false, error: t.city }, 400)
  const postUrl = rawPostUrl ? normalizePostUrl(rawPostUrl) : ''
  if (postUrl === null) return json({ ok: false, error: t.postUrl }, 400)
  if (payload.rules !== true) return json({ ok: false, error: t.rules }, 400)

  try {
    const result = await registerEntrant(
      { name, email, phone, businessName, businessForm: businessForm as BusinessForm, activity, city, siteGoal, postUrl, marketing: payload.marketing === true },
      ip,
      requestLocale(payload),
    )
    if (result === 'rate-limited') return json({ ok: false, error: t.ipRate }, 429)
    if (result === 'email-failed') return json({ ok: false, error: t.emailFailed }, 502)
    return json({ ok: true, status: result })
  } catch (error) {
    console.error('[concurs] Înscrierea a eșuat:', error)
    return json({ ok: false, error: t.failed }, 500)
  }
}

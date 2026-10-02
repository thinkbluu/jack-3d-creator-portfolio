import { BUSINESS_FORMS, isContestConfigured, type BusinessForm } from '@/lib/contest/config'
import { normalizePostUrl, registerEntrant } from '@/lib/contest/service'
import { isValidEmail } from '@/lib/email'
import { clientIp, isRateLimited } from '@/lib/request'
import { EMAIL } from '@/lib/site'

type Result =
  | { ok: true; status: 'confirm-sent' | 'already-confirmed' }
  | { ok: false; error: string }

function json(body: Result, status = 200) {
  return Response.json(body, { status })
}

function field(payload: Record<string, unknown>, key: string, maxLength: number) {
  const value = payload[key]
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>
  try {
    payload = (await request.json()) as Record<string, unknown>
  } catch {
    return json({ ok: false, error: 'Cerere invalidă.' }, 400)
  }

  if (field(payload, 'website', 200)) return json({ ok: true, status: 'confirm-sent' })

  if (!isContestConfigured()) {
    return json({ ok: false, error: 'Înscrierile se deschid în curând. Urmărește-ne pe Instagram sau Facebook.' }, 503)
  }

  const ip = clientIp(request)
  if (isRateLimited(`concurs:${ip}`, 5, 10 * 60_000)) {
    return json({ ok: false, error: 'Prea multe încercări. Încearcă din nou peste câteva minute.' }, 429)
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

  if (name.length < 3) return json({ ok: false, error: 'Scrie numele tău complet.' }, 400)
  if (!isValidEmail(email)) return json({ ok: false, error: 'Adresa de e-mail nu este validă.' }, 400)
  if (phone && phone.replace(/\D/g, '').length < 9) return json({ ok: false, error: 'Numărul de telefon nu este valid.' }, 400)
  if (businessName.length < 2) return json({ ok: false, error: 'Scrie numele afacerii.' }, 400)
  if (!BUSINESS_FORMS.includes(businessForm as BusinessForm)) return json({ ok: false, error: 'Alege forma de organizare.' }, 400)
  if (activity.length < 3) return json({ ok: false, error: 'Spune-ne domeniul de activitate.' }, 400)
  if (city.length < 2) return json({ ok: false, error: 'Scrie orașul.' }, 400)
  const postUrl = rawPostUrl ? normalizePostUrl(rawPostUrl) : ''
  if (postUrl === null) return json({ ok: false, error: 'Linkul trebuie să fie al unei postări de pe Instagram sau Facebook.' }, 400)
  if (payload.rules !== true) return json({ ok: false, error: 'Trebuie să accepți regulamentul ca să participi.' }, 400)

  try {
    const result = await registerEntrant(
      { name, email, phone, businessName, businessForm: businessForm as BusinessForm, activity, city, siteGoal, postUrl, marketing: payload.marketing === true },
      ip,
    )
    if (result === 'rate-limited') return json({ ok: false, error: 'Prea multe înscrieri din aceeași rețea azi. Încearcă mâine.' }, 429)
    if (result === 'email-failed') return json({ ok: false, error: `Nu am putut trimite e-mailul de confirmare. Scrie-ne la ${EMAIL}.` }, 502)
    return json({ ok: true, status: result })
  } catch (error) {
    console.error('[concurs] Înscrierea a eșuat:', error)
    return json({ ok: false, error: `Înscrierea nu a mers. Încearcă din nou sau scrie-ne la ${EMAIL}.` }, 500)
  }
}

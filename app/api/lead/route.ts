import { createHash } from 'node:crypto'
import { escapeHtml, fromAddress, resendClient } from '@/lib/email'
import { clientIp, isRateLimited } from '@/lib/request'
import { EMAIL } from '@/lib/site'

const projectTypes = [
  'Site de prezentare',
  'Magazin online',
  'Aplicație sau platformă',
  'Nu știu încă',
] as const

type ProjectType = (typeof projectTypes)[number]

type LeadPayload = {
  projectType?: unknown
  currentSite?: unknown
  contact?: unknown
  website?: unknown
}

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5

function json(body: { ok: true } | { ok: false; error: string }, status = 200) {
  return Response.json(body, { status })
}

function isValidProjectType(value: unknown): value is ProjectType {
  return typeof value === 'string' && projectTypes.includes(value as ProjectType)
}

function isValidContact(value: string) {
  return value.includes('@') || value.replace(/\D/g, '').length >= 9
}

function isValidSite(value: string) {
  if (!value) return true

  try {
    const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`
    const url = new URL(candidate)
    return Boolean(url.hostname && url.hostname.includes('.'))
  } catch {
    return false
  }
}

function getUtmParameters(referrer: string | null) {
  if (!referrer) return []

  try {
    const url = new URL(referrer)
    return ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
      .map((key) => [key, url.searchParams.get(key)] as const)
      .filter((entry): entry is readonly [string, string] => Boolean(entry[1]))
  } catch {
    return []
  }
}

export async function POST(request: Request) {
  let payload: LeadPayload

  try {
    payload = (await request.json()) as LeadPayload
  } catch {
    return json({ ok: false, error: 'Cerere invalidă.' }, 400)
  }

  if (typeof payload.website === 'string' && payload.website.trim()) {
    return json({ ok: true })
  }

  const ip = clientIp(request)
  if (isRateLimited(`lead:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return json({ ok: false, error: 'Prea multe cereri. Încearcă din nou peste un minut.' }, 429)
  }

  if (!isValidProjectType(payload.projectType)) {
    return json({ ok: false, error: 'Tipul proiectului nu este valid.' }, 400)
  }

  const contact = typeof payload.contact === 'string' ? payload.contact.trim() : ''
  const currentSite = typeof payload.currentSite === 'string' ? payload.currentSite.trim() : ''

  if (!isValidContact(contact) || contact.length > 320) {
    return json({ ok: false, error: 'Telefonul sau adresa de email nu este validă.' }, 400)
  }

  if (currentSite.length > 2048 || !isValidSite(currentSite)) {
    return json({ ok: false, error: 'Adresa site-ului nu este validă.' }, 400)
  }

  const timeBucket = Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS)
  const timestamp = new Date(timeBucket * RATE_LIMIT_WINDOW_MS).toISOString()
  const utmParameters = getUtmParameters(request.headers.get('referer'))
  const lead = {
    projectType: payload.projectType,
    currentSite: currentSite || 'Nu a fost furnizat',
    contact,
    timestamp,
    ip,
    utm: Object.fromEntries(utmParameters),
  }

  const resend = resendClient()
  if (!resend) {
    console.info('[lead] RESEND_API_KEY lipsește; lead primit:', lead)
    return json({ ok: true })
  }

  const utmText = utmParameters.length
    ? utmParameters.map(([key, value]) => `${key}: ${value}`).join('\n')
    : 'Nu sunt disponibili'
  const utmHtml = utmParameters.length
    ? `<ul>${utmParameters.map(([key, value]) => `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</li>`).join('')}</ul>`
    : '<p>Nu sunt disponibili</p>'
  const idempotencyHash = createHash('sha256')
    .update(`${payload.projectType}\n${currentSite}\n${contact}\n${JSON.stringify(utmParameters)}\n${timeBucket}`)
    .digest('hex')
    .slice(0, 32)

  try {
    const { error } = await resend.emails.send(
      {
        from: fromAddress('lead'),
        to: [EMAIL],
        subject: `Lead nou: ${payload.projectType}`,
        text: [
          `Tip proiect: ${payload.projectType}`,
          `Site actual: ${currentSite || 'Nu a fost furnizat'}`,
          `Contact: ${contact}`,
          `Timestamp: ${timestamp}`,
          '',
          'Parametri UTM:',
          utmText,
        ].join('\n'),
        html: `
          <h1>Lead nou: ${escapeHtml(payload.projectType)}</h1>
          <p><strong>Tip proiect:</strong> ${escapeHtml(payload.projectType)}</p>
          <p><strong>Site actual:</strong> ${escapeHtml(currentSite || 'Nu a fost furnizat')}</p>
          <p><strong>Contact:</strong> ${escapeHtml(contact)}</p>
          <p><strong>Timestamp:</strong> ${escapeHtml(timestamp)}</p>
          <h2>Parametri UTM</h2>
          ${utmHtml}
        `,
      },
      { idempotencyKey: `lead/${idempotencyHash}` },
    )

    if (error) {
      console.error('[lead] Resend nu a putut trimite emailul:', error.message)
      return json({ ok: false, error: 'Lead-ul nu a putut fi trimis.' }, 502)
    }

    return json({ ok: true })
  } catch (error) {
    console.error('[lead] Eroare neașteptată la trimitere:', error)
    return json({ ok: false, error: 'Lead-ul nu a putut fi trimis.' }, 502)
  }
}

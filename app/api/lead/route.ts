import { createHash } from 'node:crypto'
import { escapeHtml, fromAddress, isValidEmail, resendClient } from '@/lib/email'
import type { Locale } from '@/lib/i18n/locale'
import { clientIp, isRateLimited } from '@/lib/request'
import { EMAIL } from '@/lib/site'

const projectTypeLabels = {
  presentation: 'Site de prezentare',
  store: 'Magazin online',
  app: 'Aplicație sau platformă',
  unsure: 'Nu știu încă',
} as const

type ProjectTypeId = keyof typeof projectTypeLabels

const legacyLabels = new Set<string>(Object.values(projectTypeLabels))

const englishTypes: Record<string, string> = {
  'Site de prezentare': 'a presentation website',
  'Magazin online': 'an online store',
  'Aplicație sau platformă': 'an app or platform',
  'Nu știu încă': 'a project you are still defining',
}

type LeadPayload = {
  projectType?: unknown
  currentSite?: unknown
  /** Legacy single field: phone or email. */
  contact?: unknown
  name?: unknown
  email?: unknown
  phone?: unknown
  channel?: unknown
  website?: unknown
  locale?: unknown
}

const confirmation = {
  ro: {
    subject: 'Am primit cererea de ofertă · MAST Studio',
    body: (name: string, type: string) =>
      `Bună, ${name},\n\nMulțumim! Am primit cererea ta de ofertă pentru: ${type}.\nRevenim cu oferta pe email în aceeași zi lucrătoare.\n\nDacă vrei să grăbim lucrurile, ne găsești și pe WhatsApp la +40 746 382 204.\n\nO zi bună,\nMAST Studio`,
  },
  en: {
    subject: 'We got your quote request · MAST Studio',
    body: (name: string, type: string) =>
      `Hi ${name},\n\nThank you! We got your quote request for: ${type}.\nWe'll send the quote by email the same working day.\n\nIf you'd like to move faster, you can also reach us on WhatsApp at +40 746 382 204.\n\nBest,\nMAST Studio`,
  },
} as const

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 5

function json(body: { ok: true } | { ok: false; error: string }, status = 200) {
  return Response.json(body, { status })
}

function requestLocale(value: unknown): Locale {
  return value === 'en' ? 'en' : 'ro'
}

function errors(locale: Locale) {
  if (locale === 'en') {
    return {
      invalid: 'Invalid request.',
      rate: 'Too many requests. Try again in a minute.',
      type: 'The project type isn’t valid.',
      contact: 'The phone number or email address isn’t valid.',
      name: 'Tell us your name.',
      email: 'That email address doesn’t look right.',
      site: 'The website address isn’t valid.',
      send: 'The request couldn’t be sent.',
    }
  }
  return {
    invalid: 'Cerere invalidă.',
    rate: 'Prea multe cereri. Încearcă din nou peste un minut.',
    type: 'Tipul proiectului nu este valid.',
    contact: 'Telefonul sau adresa de email nu este validă.',
    name: 'Spune-ne cum te numești.',
    email: 'Adresa de email nu pare corectă.',
    site: 'Adresa site-ului nu este validă.',
    send: 'Cererea nu a putut fi trimisă.',
  }
}

function romanianProjectType(value: unknown) {
  if (typeof value !== 'string') return null
  if (value in projectTypeLabels) return projectTypeLabels[value as ProjectTypeId]
  if (legacyLabels.has(value)) return value
  return null
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
    return json({ ok: false, error: errors('ro').invalid }, 400)
  }

  const locale = requestLocale(payload.locale)
  const error = errors(locale)

  if (typeof payload.website === 'string' && payload.website.trim()) {
    return json({ ok: true })
  }

  const ip = clientIp(request)
  if (isRateLimited(`lead:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return json({ ok: false, error: error.rate }, 429)
  }

  const projectType = romanianProjectType(payload.projectType)
  if (!projectType) {
    return json({ ok: false, error: error.type }, 400)
  }

  const str = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')
  const name = str(payload.name, 120)
  const email = str(payload.email, 254).toLowerCase()
  const phone = str(payload.phone, 30)
  const channel = payload.channel === 'email' ? 'email' : 'whatsapp'
  const currentSite = typeof payload.currentSite === 'string' ? payload.currentSite.trim() : ''

  // The email channel sends name + email (+ optional phone); older clients
  // send a single "contact" field with a phone number or an email address.
  let contact: string
  if (email || name) {
    if (name.length < 2) return json({ ok: false, error: error.name }, 400)
    if (!isValidEmail(email)) return json({ ok: false, error: error.email }, 400)
    if (phone && phone.replace(/\D/g, '').length < 9) return json({ ok: false, error: error.contact }, 400)
    contact = [email, phone].filter(Boolean).join(' · ')
  } else {
    contact = typeof payload.contact === 'string' ? payload.contact.trim() : ''
    if (!isValidContact(contact) || contact.length > 320) {
      return json({ ok: false, error: error.contact }, 400)
    }
  }

  if (currentSite.length > 2048 || !isValidSite(currentSite)) {
    return json({ ok: false, error: error.site }, 400)
  }

  const timeBucket = Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS)
  const timestamp = new Date(timeBucket * RATE_LIMIT_WINDOW_MS).toISOString()
  const utmParameters = getUtmParameters(request.headers.get('referer'))
  const lead = {
    projectType,
    locale,
    currentSite: currentSite || 'Nu a fost furnizat',
    name: name || undefined,
    contact,
    channel,
    timestamp,
    ip,
    utm: Object.fromEntries(utmParameters),
  }

  const resend = resendClient()
  if (!resend) {
    // Without email delivery the request would be lost: say so, and the form
    // offers WhatsApp instead.
    console.error('[lead] RESEND_API_KEY lipsește; lead nelivrat:', lead)
    return json({ ok: false, error: error.send }, 503)
  }

  const utmText = utmParameters.length
    ? utmParameters.map(([key, value]) => `${key}: ${value}`).join('\n')
    : 'Nu sunt disponibili'
  const utmHtml = utmParameters.length
    ? `<ul>${utmParameters.map(([key, value]) => `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value)}</li>`).join('')}</ul>`
    : '<p>Nu sunt disponibili</p>'
  const languageLine = locale === 'en' ? 'Limbă formular: engleză' : ''
  const idempotencyHash = createHash('sha256')
    .update(`${projectType}\n${currentSite}\n${contact}\n${JSON.stringify(utmParameters)}\n${timeBucket}`)
    .digest('hex')
    .slice(0, 32)

  try {
    const { error: sendError } = await resend.emails.send(
      {
        from: fromAddress('lead'),
        to: [EMAIL],
        ...(email ? { replyTo: email } : {}),
        subject: `Lead nou: ${projectType}${name ? `, ${name}` : ''}`,
        text: [
          ...(languageLine ? [languageLine, ''] : []),
          `Tip proiect: ${projectType}`,
          `Site actual: ${currentSite || 'Nu a fost furnizat'}`,
          ...(name ? [`Nume: ${name}`] : []),
          `Contact: ${contact}`,
          `Răspuns preferat: ${channel === 'email' ? 'email' : 'WhatsApp'}`,
          `Timestamp: ${timestamp}`,
          '',
          'Parametri UTM:',
          utmText,
        ].join('\n'),
        html: `
          ${languageLine ? `<p><strong>${escapeHtml(languageLine)}</strong></p>` : ''}
          <h1>Lead nou: ${escapeHtml(projectType)}</h1>
          <p><strong>Tip proiect:</strong> ${escapeHtml(projectType)}</p>
          <p><strong>Site actual:</strong> ${escapeHtml(currentSite || 'Nu a fost furnizat')}</p>
          ${name ? `<p><strong>Nume:</strong> ${escapeHtml(name)}</p>` : ''}
          <p><strong>Contact:</strong> ${escapeHtml(contact)}</p>
          <p><strong>Răspuns preferat:</strong> ${channel === 'email' ? 'email' : 'WhatsApp'}</p>
          <p><strong>Timestamp:</strong> ${escapeHtml(timestamp)}</p>
          <h2>Parametri UTM</h2>
          ${utmHtml}
        `,
      },
      { idempotencyKey: `lead/${idempotencyHash}` },
    )

    if (sendError) {
      console.error('[lead] Resend nu a putut trimite emailul:', sendError.message)
      return json({ ok: false, error: error.send }, 502)
    }

    // Confirmation to the visitor is best-effort; the lead itself is already in.
    if (email) {
      const reply = confirmation[locale]
      const typeForVisitor = locale === 'en' ? englishTypes[projectType] ?? projectType : projectType.toLowerCase()
      const { error: replyError } = await resend.emails.send(
        {
          from: fromAddress('lead'),
          to: [email],
          replyTo: EMAIL,
          subject: reply.subject,
          text: reply.body(name.split(' ')[0] || name, typeForVisitor),
        },
        { idempotencyKey: `lead-reply/${idempotencyHash}` },
      )
      if (replyError) console.error('[lead] Confirmarea nu a plecat:', replyError.message)
    }

    return json({ ok: true })
  } catch (sendFailure) {
    console.error('[lead] Eroare neașteptată la trimitere:', sendFailure)
    return json({ ok: false, error: error.send }, 502)
  }
}

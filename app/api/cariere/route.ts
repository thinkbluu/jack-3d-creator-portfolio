import { createHash } from 'node:crypto'
import { CAREER_AREAS, CV_RETENTION_MONTHS, MAX_CV_BYTES, cvExtension, hasCvSignature, type CareerArea } from '@/lib/careers'
import { escapeHtml, fromAddress, isValidEmail, resendClient } from '@/lib/email'
import type { Locale } from '@/lib/i18n/locale'
import { ui } from '@/lib/i18n/ui'
import { clientIp, isRateLimited } from '@/lib/request'
import { EMAIL } from '@/lib/site'

const RATE_LIMIT_WINDOW_MS = 10 * 60_000
const RATE_LIMIT_MAX = 3

function json(body: { ok: true } | { ok: false; error: string }, status = 200) {
  return Response.json(body, { status })
}

function text(form: FormData, field: string, maxLength: number) {
  const value = form.get(field)
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function isCareerArea(value: string): value is CareerArea {
  return CAREER_AREAS.includes(value as CareerArea)
}

function requestLocale(value: string): Locale {
  return value === 'en' ? 'en' : 'ro'
}

function fill(template: string) {
  return template.split('{email}').join(EMAIL)
}

function fileSlug(value: string) {
  return (
    value
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 60) || 'candidat'
  )
}

export async function POST(request: Request) {
  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return json({ ok: false, error: ui.ro.careerForm.api.invalid }, 400)
  }

  const locale = requestLocale(text(form, 'locale', 8))
  const copy = ui[locale].careerForm
  const fail = (template: string, status: number) => json({ ok: false, error: fill(template) }, status)

  if (text(form, 'website', 200)) return json({ ok: true })

  if (isRateLimited(`cariere:${clientIp(request)}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return fail(copy.api.rate, 429)
  }

  const name = text(form, 'name', 120)
  const email = text(form, 'email', 254)
  const phone = text(form, 'phone', 40)
  const area = text(form, 'area', 60)
  const links = text(form, 'links', 500)
  const message = text(form, 'message', 1500)

  if (name.length < 3) return fail(copy.api.name, 400)
  if (!isValidEmail(email)) return fail(copy.api.email, 400)
  if (phone && phone.replace(/\D/g, '').length < 9) return fail(copy.api.phone, 400)
  if (!isCareerArea(area)) return fail(copy.api.area, 400)
  if (form.get('consent') !== 'da') return fail(copy.api.consent, 400)

  const cv = form.get('cv')
  if (!(cv instanceof File) || cv.size === 0) return fail(copy.api.cvMissing, 400)
  if (cv.size > MAX_CV_BYTES) return fail(copy.api.cvSize, 400)
  const extension = cvExtension(cv.name)
  const bytes = new Uint8Array(await cv.arrayBuffer())
  if (!extension || !hasCvSignature(bytes, extension)) {
    return fail(copy.api.cvType, 400)
  }

  const resend = resendClient()
  if (!resend) {
    console.error('[cariere] RESEND_API_KEY lipsește; candidatura nu a putut fi trimisă.')
    return fail(copy.api.down, 503)
  }

  const rows: Array<[string, string]> = [
    ['Nume', name],
    ['E-mail', email],
    ['Telefon', phone || 'Nu a fost furnizat'],
    ['Domeniu', area],
    ['Portofoliu / LinkedIn', links || 'Nu au fost furnizate'],
    ['Mesaj', message || 'Fără mesaj'],
  ]
  const languageLine = locale === 'en' ? 'Limbă formular: engleză' : ''
  const idempotencyHash = createHash('sha256').update(`${email}\n${area}\n${cv.size}\n${Math.floor(Date.now() / 600_000)}`).digest('hex').slice(0, 32)

  try {
    const { error } = await resend.emails.send(
      {
        from: fromAddress('cariere'),
        to: [EMAIL],
        replyTo: email,
        subject: `Candidatură: ${area}, ${name}`,
        text: [
          ...(languageLine ? [languageLine, ''] : []),
          ...rows.map(([label, value]) => `${label}: ${value}`),
          '',
          `Păstrează CV-ul cel mult ${CV_RETENTION_MONTHS} luni, conform acordului dat.`,
        ].join('\n'),
        html: `
          ${languageLine ? `<p><strong>${escapeHtml(languageLine)}</strong></p>` : ''}
          <h1>Candidatură: ${escapeHtml(area)}</h1>
          ${rows.map(([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`).join('')}
          <p><em>Păstrează CV-ul cel mult ${CV_RETENTION_MONTHS} luni, conform acordului dat.</em></p>
        `,
        attachments: [{ filename: `cv-${fileSlug(name)}.${extension}`, content: Buffer.from(bytes) }],
      },
      { idempotencyKey: `cariere/${idempotencyHash}` },
    )

    if (error) {
      console.error('[cariere] Resend nu a putut trimite candidatura:', error.message)
      return fail(copy.api.failed, 502)
    }
  } catch (error) {
    console.error('[cariere] Eroare neașteptată la trimitere:', error)
    return fail(copy.api.failed, 502)
  }

  // Confirmation for the candidate; a failure here must not fail the application.
  const confirmation = locale === 'en'
    ? {
        subject: 'We’ve received your CV',
        text: [
          `Hello ${name.split(' ')[0]},`,
          '',
          'Thank you for wanting to work with MAST Studio. We’ve received your CV.',
          'We read every application and we’ll contact you if your profile fits an open role or a later one.',
          `We keep the CV for at most ${CV_RETENTION_MONTHS} months. If you want us to delete it sooner, reply to this email.`,
          '',
          'The MAST Studio team',
        ].join('\n'),
      }
    : {
        subject: 'Am primit CV-ul tău',
        text: [
          `Bună, ${name.split(' ')[0]},`,
          '',
          'Îți mulțumim că vrei să lucrezi cu MAST Studio. Am primit CV-ul tău.',
          'Citim fiecare candidatură și te contactăm dacă profilul tău se potrivește unui post deschis sau unui rol de mai târziu.',
          `Păstrăm CV-ul cel mult ${CV_RETENTION_MONTHS} luni. Dacă vrei să-l ștergem mai devreme, răspunde la acest e-mail.`,
          '',
          'Echipa MAST Studio',
        ].join('\n'),
      }

  try {
    await resend.emails.send({
      from: fromAddress('cariere'),
      to: [email],
      replyTo: EMAIL,
      subject: confirmation.subject,
      text: confirmation.text,
    })
  } catch (error) {
    console.error('[cariere] Confirmarea către candidat nu a putut fi trimisă:', error)
  }

  return json({ ok: true })
}

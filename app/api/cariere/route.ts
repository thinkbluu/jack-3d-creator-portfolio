import { createHash } from 'node:crypto'
import { CAREER_AREAS, CV_RETENTION_MONTHS, MAX_CV_BYTES, cvExtension, hasCvSignature, type CareerArea } from '@/lib/careers'
import { escapeHtml, fromAddress, isValidEmail, resendClient } from '@/lib/email'
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
    return json({ ok: false, error: 'Cerere invalidă.' }, 400)
  }

  if (text(form, 'website', 200)) return json({ ok: true })

  if (isRateLimited(`cariere:${clientIp(request)}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return json({ ok: false, error: 'Prea multe trimiteri. Încearcă din nou peste câteva minute.' }, 429)
  }

  const name = text(form, 'name', 120)
  const email = text(form, 'email', 254)
  const phone = text(form, 'phone', 40)
  const area = text(form, 'area', 60)
  const links = text(form, 'links', 500)
  const message = text(form, 'message', 1500)

  if (name.length < 3) return json({ ok: false, error: 'Scrie numele complet.' }, 400)
  if (!isValidEmail(email)) return json({ ok: false, error: 'Adresa de e-mail nu este validă.' }, 400)
  if (phone && phone.replace(/\D/g, '').length < 9) return json({ ok: false, error: 'Numărul de telefon nu este valid.' }, 400)
  if (!isCareerArea(area)) return json({ ok: false, error: 'Alege domeniul care te interesează.' }, 400)
  if (form.get('consent') !== 'da') return json({ ok: false, error: 'Avem nevoie de acordul tău ca să păstrăm CV-ul.' }, 400)

  const cv = form.get('cv')
  if (!(cv instanceof File) || cv.size === 0) return json({ ok: false, error: 'Atașează CV-ul.' }, 400)
  if (cv.size > MAX_CV_BYTES) return json({ ok: false, error: 'CV-ul are peste 4 MB. Trimite o variantă mai mică.' }, 400)
  const extension = cvExtension(cv.name)
  const bytes = new Uint8Array(await cv.arrayBuffer())
  if (!extension || !hasCvSignature(bytes, extension)) {
    return json({ ok: false, error: 'CV-ul trebuie să fie PDF, DOC sau DOCX.' }, 400)
  }

  const resend = resendClient()
  if (!resend) {
    console.error('[cariere] RESEND_API_KEY lipsește; candidatura nu a putut fi trimisă.')
    return json({ ok: false, error: `Trimiterea nu funcționează acum. Scrie-ne la ${EMAIL}.` }, 503)
  }

  const rows: Array<[string, string]> = [
    ['Nume', name],
    ['E-mail', email],
    ['Telefon', phone || 'Nu a fost furnizat'],
    ['Domeniu', area],
    ['Portofoliu / LinkedIn', links || 'Nu au fost furnizate'],
    ['Mesaj', message || 'Fără mesaj'],
  ]
  const idempotencyHash = createHash('sha256').update(`${email}\n${area}\n${cv.size}\n${Math.floor(Date.now() / 600_000)}`).digest('hex').slice(0, 32)

  try {
    const { error } = await resend.emails.send(
      {
        from: fromAddress('cariere'),
        to: [EMAIL],
        replyTo: email,
        subject: `Candidatură: ${area}, ${name}`,
        text: [...rows.map(([label, value]) => `${label}: ${value}`), '', `Păstrează CV-ul cel mult ${CV_RETENTION_MONTHS} luni, conform acordului dat.`].join('\n'),
        html: `
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
      return json({ ok: false, error: `Candidatura nu a putut fi trimisă. Scrie-ne la ${EMAIL}.` }, 502)
    }
  } catch (error) {
    console.error('[cariere] Eroare neașteptată la trimitere:', error)
    return json({ ok: false, error: `Candidatura nu a putut fi trimisă. Scrie-ne la ${EMAIL}.` }, 502)
  }

  // Confirmation for the candidate; a failure here must not fail the application.
  try {
    await resend.emails.send({
      from: fromAddress('cariere'),
      to: [email],
      replyTo: EMAIL,
      subject: 'Am primit CV-ul tău',
      text: [
        `Bună, ${name.split(' ')[0]},`,
        '',
        'Îți mulțumim că vrei să lucrezi cu MAST Studio. Am primit CV-ul tău.',
        'Acum nu avem un post deschis, așa că nu te vom suna imediat. Când apare un rol potrivit, te contactăm noi.',
        `Păstrăm CV-ul cel mult ${CV_RETENTION_MONTHS} luni. Dacă vrei să-l ștergem mai devreme, răspunde la acest e-mail.`,
        '',
        'Echipa MAST Studio',
      ].join('\n'),
    })
  } catch (error) {
    console.error('[cariere] Confirmarea către candidat nu a putut fi trimisă:', error)
  }

  return json({ ok: true })
}

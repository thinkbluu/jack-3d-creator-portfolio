import { escapeHtml, fromAddress, resendClient } from '@/lib/email'
import { mockupSchema, submissionId } from '@/lib/mockup'
import { clientIp, isRateLimited } from '@/lib/request'

const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const SUPPORT_WHATSAPP_NUMBER = '40746382204'

const PROJECT_TYPE_LABELS = {
  prezentare: 'Site de prezentare',
  magazin: 'Magazin online',
} as const

/** MOCKUP_FROM_EMAIL, falling back to the verified domain sender. */
function fromEmail() {
  const configured = process.env.MOCKUP_FROM_EMAIL?.trim()
  return configured || fromAddress('mockup')
}

/** MOCKUP_TO_EMAIL, falling back to contact@ on the verified domain. */
function toEmails(): string[] | null {
  const configured = process.env.MOCKUP_TO_EMAIL?.trim()
  if (configured) return [configured]

  const domain = process.env.RESEND_EMAIL_DOMAIN
    ?.trim()
    .replace(/^https?:\/\//, '')
    .replace(/^.*@/, '')
    .replace(/\/$/, '')
  return domain ? [`contact@${domain}`] : null
}

function bucharestNow() {
  return new Intl.DateTimeFormat('ro-RO', {
    timeZone: 'Europe/Bucharest',
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(new Date())
}

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 14px 8px 0;color:#6b6257;white-space:nowrap;vertical-align:top;border-bottom:1px solid #e8e1d4;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;font-weight:bold;border-bottom:1px solid #e8e1d4;">${escapeHtml(value)}</td>
  </tr>`
}

export async function POST(request: Request) {
  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return Response.json({ ok: false }, { status: 400 })
  }

  const parsed = mockupSchema.safeParse(payload)
  if (!parsed.success) {
    return Response.json({ ok: false }, { status: 400 })
  }
  const data = parsed.data
  const id = submissionId()

  // Honeypot filled: pretend success, send nothing.
  if (data.website.trim()) {
    return Response.json({ ok: true, id })
  }

  const ip = clientIp(request)
  if (isRateLimited(`mockup:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS)) {
    return Response.json({ ok: false }, { status: 429 })
  }

  const to = toEmails()
  const resend = resendClient()
  if (!resend || !to) {
    console.error('[mockup] Resend config lipsă (RESEND_API_KEY sau email destinație); cerere primită:', id)
    return Response.json({ ok: false })
  }

  const byEmail = data.canal === 'email'
  const channelLabel = byEmail ? 'Email' : 'WhatsApp'
  const waDigits = data.telefon.replace(/\D/g, '')
  const waMessage =
    `Salut, ${data.nume}! Am primit cererea pentru ${data.firma}. ` +
    'Lucrez la mockup și ți-l trimit aici până mâine. ' +
    'Dacă ai un logo sau culori preferate, trimite-le acum.'
  const waLink = waDigits ? `https://wa.me/${waDigits}?text=${encodeURIComponent(waMessage)}` : ''
  const mailSubject = `Mockup pentru ${data.firma}`
  const mailLink = data.email ? `mailto:${data.email}?subject=${encodeURIComponent(mailSubject)}` : ''
  // The reply button follows the visitor's choice: they asked for it there.
  const replyButton = byEmail
    ? `<a href="${escapeHtml(mailLink)}" style="display:inline-block;background:#1f1b16;color:#ffffff;text-decoration:none;font-size:18px;font-weight:bold;padding:14px 28px;border-radius:10px;">Răspunde pe email</a>`
    : `<a href="${waLink}" style="display:inline-block;background:#25d366;color:#ffffff;text-decoration:none;font-size:18px;font-weight:bold;padding:14px 28px;border-radius:10px;">Răspunde pe WhatsApp</a>`

  const trackingRows = [
    data.gclid ? row('gclid', data.gclid) : '',
    data.utm_source ? row('utm_source', data.utm_source) : '',
    data.utm_medium ? row('utm_medium', data.utm_medium) : '',
    data.utm_campaign ? row('utm_campaign', data.utm_campaign) : '',
    data.utm_term ? row('utm_term', data.utm_term) : '',
  ]
    .filter(Boolean)
    .join('')

  const internalHtml = `<div style="font-family:Arial,sans-serif;color:#1f1b16;">
  <p style="margin:0 0 8px;font-size:15px;">Vrea mockup-ul pe <strong>${channelLabel}</strong>.</p>
  <p style="margin:0 0 24px;">
    ${replyButton}
  </p>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
    ${row('Cod cerere', id)}
    ${row('Nume', data.nume)}
    ${row('Firmă', data.firma)}
    ${row('Canal ales', channelLabel)}
    ${row('Telefon', data.telefon || '—')}
    ${row('Email', data.email || '—')}
    ${row('Domeniu', data.domeniu)}
    ${row('Site actual', data.noSite ? 'Nu are site' : data.site)}
    ${row('Tip proiect', PROJECT_TYPE_LABELS[data.projectType])}
    ${row('Servicii / produse', data.servicii)}
    ${trackingRows}
    ${row('Ora (Europe/Bucharest)', bucharestNow())}
  </table>
</div>`

  const internalText = [
    `Cod cerere: ${id}`,
    `Nume: ${data.nume}`,
    `Firmă: ${data.firma}`,
    `Canal ales: ${channelLabel}`,
    `Telefon: ${data.telefon || '—'}`,
    `Email: ${data.email || '—'}`,
    `Domeniu: ${data.domeniu}`,
    `Site actual: ${data.noSite ? 'Nu are site' : data.site}`,
    `Tip proiect: ${PROJECT_TYPE_LABELS[data.projectType]}`,
    `Servicii / produse: ${data.servicii}`,
    data.gclid ? `gclid: ${data.gclid}` : '',
    data.utm_source ? `utm_source: ${data.utm_source}` : '',
    data.utm_medium ? `utm_medium: ${data.utm_medium}` : '',
    data.utm_campaign ? `utm_campaign: ${data.utm_campaign}` : '',
    data.utm_term ? `utm_term: ${data.utm_term}` : '',
    `Ora (Europe/Bucharest): ${bucharestNow()}`,
    waLink ? `WhatsApp: ${waLink}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  try {
    const { error: sendError } = await resend.emails.send({
      from: fromEmail(),
      to,
      subject: `Mockup nou (${channelLabel}): ${data.firma} (${data.domeniu}, ${PROJECT_TYPE_LABELS[data.projectType]})`,
      html: internalHtml,
      text: internalText,
      ...(data.email ? { replyTo: data.email } : {}),
    })
    if (sendError) throw sendError
  } catch (sendError) {
    console.error('[mockup] Trimiterea emailului intern a eșuat:', sendError, 'cerere:', id)
    return Response.json({ ok: false })
  }

  // Confirmation to the lead is best-effort; its failure must not fail the request.
  if (data.email) {
    const confirmationHtml = `<div style="background:#faf6ec;padding:32px;font-family:Georgia,serif;color:#1f1b16;font-size:15px;line-height:1.6;">
  <p style="margin:0 0 12px;">Salut, ${escapeHtml(data.nume)}!</p>
  <p style="margin:0 0 12px;">Am primit datele pentru ${escapeHtml(data.firma)}. ${
    byEmail
      ? 'Îți trimitem mockup-ul paginii principale pe email, la această adresă, în maximum 24 de ore lucrătoare.'
      : `Îți trimitem mockup-ul paginii principale pe WhatsApp, la ${escapeHtml(data.telefon)}, în maximum 24 de ore lucrătoare.`
  }</p>
  <p style="margin:0 0 12px;">${
    byEmail
      ? 'Dacă vrei să-l facem cât mai fidel, răspunde la acest email cu logo-ul și câteva poze.'
      : `Dacă vrei să-l facem cât mai fidel, trimite-ne logo-ul și câteva poze pe WhatsApp: <a href="https://wa.me/${SUPPORT_WHATSAPP_NUMBER}" style="color:#1f1b16;">https://wa.me/${SUPPORT_WHATSAPP_NUMBER}</a>`
  }</p>
  <p style="margin:0;">Echipa MAST Studio</p>
</div>`

    try {
      const { error: confirmError } = await resend.emails.send({
        from: fromEmail(),
        to: [data.email],
        subject: `Am primit cererea pentru mockup, ${data.firma}`,
        html: confirmationHtml,
        // Replies (logo, photos) land in the team inbox, not the sender address.
        replyTo: to[0],
      })
      if (confirmError) throw confirmError
    } catch (confirmError) {
      console.error('[mockup] Confirmarea către client a eșuat (cererea internă e ok):', confirmError, 'cerere:', id)
    }
  }

  return Response.json({ ok: true, id })
}

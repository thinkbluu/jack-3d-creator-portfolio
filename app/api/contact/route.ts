import { createHash } from 'node:crypto'
import { CONTACT_TOPICS, type ContactTopic } from '@/lib/contact'
import { escapeHtml, fromAddress, isValidEmail, resendClient } from '@/lib/email'
import type { Locale } from '@/lib/i18n/locale'
import { clientIp, isRateLimited } from '@/lib/request'
import { EMAIL } from '@/lib/site'

type Payload = {
  name?: unknown
  email?: unknown
  company?: unknown
  topic?: unknown
  message?: unknown
  website?: unknown
  locale?: unknown
}

const topicLabels: Record<ContactTopic, string> = {
  project: 'Proiect nou',
  question: 'Întrebare',
  press: 'Presă sau colaborare',
  other: 'Altceva',
}

const errors = {
  ro: {
    invalid: 'Cerere invalidă.',
    rate: 'Prea multe mesaje într-un minut. Mai încearcă puțin mai târziu.',
    name: 'Spune-ne cum te numești.',
    email: 'Adresa de e-mail nu pare corectă.',
    message: 'Mesajul trebuie să aibă între 10 și 4000 de caractere.',
    send: 'Mesajul nu a plecat. Scrie-ne direct la contact@maststudio.ro.',
  },
  en: {
    invalid: 'Invalid request.',
    rate: 'Too many messages in a minute. Please try again shortly.',
    name: 'Tell us your name.',
    email: 'That email address doesn’t look right.',
    message: 'The message needs between 10 and 4000 characters.',
    send: 'The message didn’t go through. Write to us at contact@maststudio.ro.',
  },
} as const

const autoReply = {
  ro: {
    subject: 'Am primit mesajul tău · MAST Studio',
    body: (name: string) =>
      `Bună, ${name},\n\nMulțumim pentru mesaj. L-am primit și îți răspundem în cel mult o zi lucrătoare, de obicei chiar azi.\n\nDacă e ceva urgent, ne găsești și pe WhatsApp la +40 746 382 204.\n\nO zi bună,\nMAST Studio`,
  },
  en: {
    subject: 'We got your message · MAST Studio',
    body: (name: string) =>
      `Hi ${name},\n\nThank you for writing. We got your message and will reply within one working day, usually today.\n\nIf it’s urgent, you can also reach us on WhatsApp at +40 746 382 204.\n\nBest,\nMAST Studio`,
  },
} as const

function json(body: { ok: true } | { ok: false; error: string }, status = 200) {
  return Response.json(body, { status })
}

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

/**
 * Contact form: sends the message to contact@maststudio.ro with reply-to set
 * to the sender, then a short confirmation to the sender. Honeypot field
 * `website`, five messages a minute per address.
 */
export async function POST(request: Request) {
  let payload: Payload
  try {
    payload = (await request.json()) as Payload
  } catch {
    return json({ ok: false, error: errors.ro.invalid }, 400)
  }
  const locale: Locale = payload.locale === 'en' ? 'en' : 'ro'
  const error = errors[locale]

  if (typeof payload.website === 'string' && payload.website.trim()) return json({ ok: true })
  const ip = clientIp(request)
  if (isRateLimited(`contact:${ip}`, 5, 60_000)) return json({ ok: false, error: error.rate }, 429)

  const name = text(payload.name, 120)
  const email = text(payload.email, 254).toLowerCase()
  const company = text(payload.company, 160)
  const message = typeof payload.message === 'string' ? payload.message.trim() : ''
  const topic: ContactTopic = CONTACT_TOPICS.includes(payload.topic as ContactTopic) ? (payload.topic as ContactTopic) : 'other'

  if (name.length < 2) return json({ ok: false, error: error.name }, 400)
  if (!isValidEmail(email)) return json({ ok: false, error: error.email }, 400)
  if (message.length < 10 || message.length > 4000) return json({ ok: false, error: error.message }, 400)

  const resend = resendClient()
  if (!resend) {
    console.info('[contact] RESEND_API_KEY lipsește; mesaj primit:', { name, email, company, topic, locale })
    return json({ ok: true })
  }

  const minute = Math.floor(Date.now() / 60_000)
  const key = createHash('sha256').update(`${email}\n${message}\n${minute}`).digest('hex').slice(0, 32)
  const label = topicLabels[topic]

  try {
    const { error: sendError } = await resend.emails.send(
      {
        from: fromAddress('contact', `${name} prin maststudio.ro`),
        to: [EMAIL],
        replyTo: email,
        subject: `${label}: ${name}${company ? `, ${company}` : ''}`,
        text: [
          `Nume: ${name}`,
          `E-mail: ${email}`,
          ...(company ? [`Firmă: ${company}`] : []),
          `Subiect: ${label}`,
          `Limbă: ${locale}`,
          '',
          message,
        ].join('\n'),
        html: `
          <p><strong>Nume:</strong> ${escapeHtml(name)}<br/>
          <strong>E-mail:</strong> ${escapeHtml(email)}<br/>
          ${company ? `<strong>Firmă:</strong> ${escapeHtml(company)}<br/>` : ''}
          <strong>Subiect:</strong> ${escapeHtml(label)}<br/>
          <strong>Limbă:</strong> ${locale}</p>
          <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
        `,
      },
      { idempotencyKey: `contact/${key}` },
    )
    if (sendError) {
      console.error('[contact] Resend nu a putut trimite:', sendError.message)
      return json({ ok: false, error: error.send }, 502)
    }

    const reply = autoReply[locale]
    const { error: replyError } = await resend.emails.send(
      {
        from: fromAddress('contact'),
        to: [email],
        replyTo: EMAIL,
        subject: reply.subject,
        text: reply.body(name.split(' ')[0]),
      },
      { idempotencyKey: `contact-reply/${key}` },
    )
    if (replyError) console.error('[contact] Confirmarea nu a plecat:', replyError.message)

    return json({ ok: true })
  } catch (failure) {
    console.error('[contact] Eroare neașteptată:', failure)
    return json({ ok: false, error: error.send }, 502)
  }
}

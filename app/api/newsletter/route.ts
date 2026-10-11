import { escapeHtml, fromAddress, isValidEmail, resendClient } from '@/lib/email'
import type { Locale } from '@/lib/i18n/locale'
import { clientIp, isRateLimited } from '@/lib/request'
import { EMAIL } from '@/lib/site'

type Payload = { email?: unknown; website?: unknown; locale?: unknown; placement?: unknown }

const errors = {
  ro: { invalid: 'Cerere invalidă.', email: 'Adresa de e-mail nu pare corectă.', rate: 'Prea multe încercări. Mai încearcă peste un minut.', send: 'Nu am putut salva adresa. Mai încearcă o dată.' },
  en: { invalid: 'Invalid request.', email: 'That email address doesn’t look right.', rate: 'Too many attempts. Try again in a minute.', send: 'We couldn’t save the address. Please try again.' },
} as const

const welcome = {
  ro: {
    subject: 'Bine ai venit la scrisorile MAST Studio',
    text: 'Mulțumim! O dată pe lună îți scriem ce am construit și ce am învățat. Dacă te răzgândești, răspunde la acest e-mail și te scoatem din listă.',
  },
  en: {
    subject: 'Welcome to the MAST Studio letter',
    text: 'Thank you! Once a month we write about what we built and what we learned. If you change your mind, reply to this email and we’ll take you off the list.',
  },
} as const

function json(body: { ok: true } | { ok: false; error: string }, status = 200) {
  return Response.json(body, { status })
}

/**
 * Newsletter sign-up. Saves the address as a Resend contact (and in the
 * segment RESEND_NEWSLETTER_SEGMENT_ID, when set), tells the studio, and
 * sends a short welcome. Without RESEND_API_KEY it only logs, so previews
 * never fail.
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
  if (isRateLimited(`newsletter:${clientIp(request)}`, 5, 60_000)) return json({ ok: false, error: error.rate }, 429)

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : ''
  if (!isValidEmail(email)) return json({ ok: false, error: error.email }, 400)
  const placement = typeof payload.placement === 'string' ? payload.placement.slice(0, 40) : 'unknown'

  const resend = resendClient()
  if (!resend) {
    console.info('[newsletter] RESEND_API_KEY lipsește; abonare primită:', { email, locale, placement })
    return json({ ok: true })
  }

  try {
    const segment = process.env.RESEND_NEWSLETTER_SEGMENT_ID?.trim()
    const { error: contactError } = await resend.contacts.create({
      email,
      unsubscribed: false,
      ...(segment ? { segments: [{ id: segment }] } : {}),
    })
    // A key limited to sending can't save contacts; the studio still gets
    // the address by email below, so the sign-up is not lost.
    const saved = !contactError || /already exists/i.test(contactError.message)
    if (!saved) console.error('[newsletter] Resend contacts:', contactError.message)
    const { error: notifyError } = await resend.emails.send({
      from: fromAddress('contact'),
      to: [EMAIL],
      subject: `Abonat nou la newsletter: ${email}`,
      text: `Adresă: ${email}\nLimbă: ${locale}\nLoc: ${placement}${saved ? '' : '\n\nNu a fost salvată în Resend: adaug-o manual în listă.'}`,
      html: `<p><strong>Adresă:</strong> ${escapeHtml(email)}</p><p><strong>Limbă:</strong> ${locale}</p><p><strong>Loc:</strong> ${escapeHtml(placement)}</p>${saved ? '' : '<p>Nu a fost salvată în Resend: adaug-o manual în listă.</p>'}`,
    })
    if (notifyError && !saved) {
      console.error('[newsletter] Notificarea nu a plecat:', notifyError.message)
      return json({ ok: false, error: error.send }, 502)
    }
    await resend.emails.send({
      from: fromAddress('contact'),
      to: [email],
      replyTo: EMAIL,
      subject: welcome[locale].subject,
      text: `${welcome[locale].text}\n\nMAST Studio\n${EMAIL}`,
    })
    return json({ ok: true })
  } catch (failure) {
    console.error('[newsletter] Eroare la trimitere:', failure)
    return json({ ok: false, error: error.send }, 502)
  }
}

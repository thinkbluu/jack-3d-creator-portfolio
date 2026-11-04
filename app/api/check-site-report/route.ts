import { createHash } from 'node:crypto'

import { checkerCopy } from '@/lib/checker/copy'
import { collectDetail } from '@/lib/checker/detail'
import { buildReportPdf } from '@/lib/checker/pdf'
import { normalizeInputUrl } from '@/lib/checker/checks'
import type { CategoryKey, CategoryResult, FixSuggestion, SiteReport, SpeedMetricSet } from '@/lib/checker/types'
import { CATEGORY_KEYS } from '@/lib/checker/types'
import { escapeHtml, fromAddress, isValidEmail, resendClient } from '@/lib/email'
import { localizePath } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/locale'
import { clientIp, isRateLimited } from '@/lib/request'
import { getServicePageBySlug } from '@/lib/services'
import { EMAIL, absoluteUrl } from '@/lib/site'

export const runtime = 'nodejs'
export const maxDuration = 30

const REPORTS_PER_HOUR = 10

type Payload = {
  url?: unknown
  locale?: unknown
  name?: unknown
  email?: unknown
  phone?: unknown
  consent?: unknown
  website?: unknown
  report?: unknown
}

function json(body: { ok: true } | { ok: false; error: string }, status = 200) {
  return Response.json(body, { status })
}

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

/** Validates an optional speed-metric set sent by the client. */
function parseMetrics(value: unknown): SpeedMetricSet | undefined {
  if (!value || typeof value !== 'object') return undefined
  const raw = value as Record<string, unknown>
  if (typeof raw.performance !== 'number' || raw.performance < 0 || raw.performance > 100) return undefined
  const str = (key: string) => (typeof raw[key] === 'string' ? (raw[key] as string).slice(0, 40) : undefined)
  const fcp = str('fcp')
  const lcp = str('lcp')
  const tbt = str('tbt')
  const cls = str('cls')
  const si = str('si')
  return {
    performance: Math.round(raw.performance),
    ...(fcp ? { fcp } : {}),
    ...(lcp ? { lcp } : {}),
    ...(tbt ? { tbt } : {}),
    ...(cls ? { cls } : {}),
    ...(si ? { si } : {}),
  }
}

/** Strict shape check: the PDF is rebuilt only from well-formed report data. */
function parseReport(value: unknown, url: string): SiteReport | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Record<string, unknown>
  if (typeof raw.url !== 'string' || raw.url !== url) return null
  if (typeof raw.finalUrl !== 'string' || typeof raw.checkedAt !== 'string') return null
  if (!Array.isArray(raw.categories) || !Array.isArray(raw.fixes)) return null

  const categories: CategoryResult[] = []
  for (const entry of raw.categories) {
    if (!entry || typeof entry !== 'object') return null
    const item = entry as Record<string, unknown>
    if (typeof item.key !== 'string' || !(CATEGORY_KEYS as readonly string[]).includes(item.key)) return null
    if (item.score !== null && (typeof item.score !== 'number' || item.score < 0 || item.score > 100)) return null
    if (typeof item.verdict !== 'string') return null
    const sub: CategoryResult['sub'] = []
    if (Array.isArray(item.sub)) {
      for (const entrySub of item.sub) {
        if (!entrySub || typeof entrySub !== 'object') return null
        const subItem = entrySub as Record<string, unknown>
        if (typeof subItem.id !== 'string' || typeof subItem.status !== 'string' || typeof subItem.label !== 'string') return null
        sub.push({
          id: subItem.id,
          status: subItem.status as 'pass',
          label: subItem.label.slice(0, 300),
          ...(typeof subItem.detail === 'string' ? { detail: subItem.detail.slice(0, 300) } : {}),
        })
      }
    }
    categories.push({
      key: item.key as CategoryKey,
      score: item.score === null ? null : Math.round(item.score),
      verdict: item.verdict as CategoryResult['verdict'],
      sub,
      ...(item.key === 'speed' ? { metrics: parseMetrics(item.metrics) } : {}),
    })
  }

  const fixes: FixSuggestion[] = []
  for (const entry of raw.fixes.slice(0, 5)) {
    if (!entry || typeof entry !== 'object') return null
    const item = entry as Record<string, unknown>
    if (typeof item.title !== 'string' || typeof item.what !== 'string' || typeof item.why !== 'string' || typeof item.who !== 'string') return null
    fixes.push({
      id: text(item.id, 60) || 'fix',
      title: item.title.slice(0, 200),
      what: item.what.slice(0, 400),
      why: item.why.slice(0, 400),
      who: item.who.slice(0, 300),
    })
  }

  const overall =
    raw.overall === null || raw.overall === undefined
      ? null
      : typeof raw.overall === 'number' && raw.overall >= 0 && raw.overall <= 100
        ? Math.round(raw.overall)
        : null

  const recommendedSlugs = Array.isArray(raw.recommendedSlugs)
    ? raw.recommendedSlugs.filter((slug): slug is string => typeof slug === 'string').slice(0, 8).map((slug) => slug.slice(0, 60))
    : []

  return {
    url,
    finalUrl: raw.finalUrl.slice(0, 500),
    checkedAt: raw.checkedAt.slice(0, 40),
    overall,
    categories,
    fixes,
    recommendedSlugs,
  }
}

/**
 * Emails the full PDF report to the visitor and a short lead notification to
 * the studio inbox. The lead is kept only as the notification email: the
 * project has no lead database, by design.
 */
export async function POST(request: Request) {
  let payload: Payload
  try {
    payload = (await request.json()) as Payload
  } catch {
    return json({ ok: false, error: checkerCopy.ro.ui.reportError }, 400)
  }

  const locale: Locale = payload.locale === 'en' ? 'en' : 'ro'
  const copy = checkerCopy[locale]

  // Honeypot: bots that fill every field get a fake success.
  if (typeof payload.website === 'string' && payload.website.trim()) return json({ ok: true })

  const ip = clientIp(request)
  if (isRateLimited(`check-report:${ip}`, REPORTS_PER_HOUR, 3_600_000)) {
    return json({ ok: false, error: copy.ui.errorRate }, 429)
  }

  const name = text(payload.name, 120)
  const email = text(payload.email, 254).toLowerCase()
  const phone = text(payload.phone, 40)
  const consent = payload.consent === true

  if (name.length < 2) return json({ ok: false, error: copy.ui.reportError }, 400)
  if (!isValidEmail(email)) return json({ ok: false, error: copy.ui.reportError }, 400)
  if (phone && !/^[+0-9 ()-]{6,40}$/.test(phone)) return json({ ok: false, error: copy.ui.reportError }, 400)

  if (typeof payload.url !== 'string') return json({ ok: false, error: copy.ui.reportError }, 400)
  const url = normalizeInputUrl(payload.url)
  if (!url) return json({ ok: false, error: copy.ui.reportError }, 400)
  const report = parseReport(payload.report, url)
  if (!report) return json({ ok: false, error: copy.ui.reportError }, 400)

  const resend = resendClient()
  if (!resend) {
    console.error('[check-report] RESEND_API_KEY lipsește; raport nelivrat:', { email, url })
    return json({ ok: false, error: copy.ui.reportError }, 503)
  }

  // The PDF is the detailed audit: raw measured values are collected fresh
  // here (one page fetch + a PageSpeed desktop run); the mobile speed result
  // is reused from the on-screen check.
  let facts
  try {
    facts = await collectDetail(url, 18_000, 12_000)
  } catch (error) {
    console.error('[check-report] Detaliile nu au putut fi colectate:', error)
    return json({ ok: false, error: copy.ui.reportError }, 500)
  }

  const services = report.recommendedSlugs.flatMap((slug) => {
    const service = getServicePageBySlug(slug, locale)
    return service ? [{ name: service.name, priceLabel: service.priceLabel }] : []
  })
  const recheckUrl = `${absoluteUrl(localizePath('/verifica-site', locale))}?url=${encodeURIComponent(url)}`

  let pdfBytes: Uint8Array
  try {
    pdfBytes = await buildReportPdf(report, facts, locale, { recheckUrl, services })
  } catch (error) {
    console.error('[check-report] PDF nu a putut fi generat:', error)
    return json({ ok: false, error: copy.ui.reportError }, 500)
  }

  const domain = new URL(url).hostname.replace(/^www\./, '')
  const minute = Math.floor(Date.now() / 60_000)
  const key = createHash('sha256').update(`${email}\n${url}\n${minute}`).digest('hex').slice(0, 32)
  const filename = `raport-verificare-${domain}.pdf`
  const subject =
    locale === 'ro' ? `Raportul verificării pentru ${domain}` : `Your website check report for ${domain}`
  const bodyText =
    locale === 'ro'
      ? `Bună, ${name},\n\nAtașat găsești raportul complet al verificării pentru ${url}.\n\nDacă vrei să discutăm rezultatele, ne găsești pe WhatsApp la +40 746 382 204.\n\nO zi bună,\nMAST Studio`
      : `Hi ${name},\n\nAttached is the full check report for ${url}.\n\nIf you'd like to talk through the results, reach us on WhatsApp at +40 746 382 204.\n\nBest,\nMAST Studio`

  try {
    const { error: sendError } = await resend.emails.send(
      {
        from: fromAddress('raport'),
        to: [email],
        replyTo: EMAIL,
        subject,
        text: bodyText,
        attachments: [{ filename, content: Buffer.from(pdfBytes).toString('base64') }],
      },
      { idempotencyKey: `check-report/${key}` },
    )
    if (sendError) {
      console.error('[check-report] Resend nu a putut trimite raportul:', sendError.message)
      return json({ ok: false, error: copy.ui.reportError }, 502)
    }

    // Lead notification to the studio inbox. No database: this email is the
    // record of the lead.
    const notification =
      locale === 'ro'
        ? `Raport PDF trimis.\n\nNume: ${name}\nE-mail: ${email}\nTelefon: ${phone || '-'}\nSite verificat: ${url}\nScor general: ${report.overall ?? 'n/a'}\nConsimțământ marketing: ${consent ? 'DA' : 'nu'}\nLimbă: ${locale}`
        : `PDF report sent.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nChecked site: ${url}\nOverall score: ${report.overall ?? 'n/a'}\nMarketing consent: ${consent ? 'YES' : 'no'}\nLanguage: ${locale}`
    const { error: notifyError } = await resend.emails.send(
      {
        from: fromAddress('raport', 'Verificator site MAST Studio'),
        to: [EMAIL],
        replyTo: email,
        subject: locale === 'ro' ? `Lead verificare site: ${domain} (${report.overall ?? 'n/a'})` : `Website check lead: ${domain} (${report.overall ?? 'n/a'})`,
        text: notification,
        html: `<pre style="white-space:pre-wrap;font-family:inherit">${escapeHtml(notification)}</pre>`,
      },
      { idempotencyKey: `check-lead/${key}` },
    )
    if (notifyError) console.error('[check-report] Notificarea de lead nu a plecat:', notifyError.message)

    return json({ ok: true })
  } catch (failure) {
    console.error('[check-report] Eroare neașteptată:', failure)
    return json({ ok: false, error: copy.ui.reportError }, 502)
  }
}

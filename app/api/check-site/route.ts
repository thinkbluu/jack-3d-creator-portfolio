import { runChecks } from '@/lib/checker/checks'
import { normalizeInputUrl } from '@/lib/checker/checks'
import { checkerCopy } from '@/lib/checker/copy'
import type { Locale } from '@/lib/i18n/locale'
import { clientIp, isRateLimited } from '@/lib/request'

/** The checker needs DNS resolution and outbound fetches: Node runtime. */
export const runtime = 'nodejs'
/** PageSpeed plus the page fetch need more than the default function time. */
export const maxDuration = 30

/** Total budget for one check run, in milliseconds. */
const TOTAL_BUDGET_MS = 25_000
/** Checks per IP per hour. Re-checks are free, they just count the same. */
const CHECKS_PER_HOUR = 10

function json(body: { ok: true; report: unknown } | { ok: false; error: string }, status = 200) {
  return Response.json(body, { status })
}

/**
 * Runs the five checks for one URL. No email, no account: the result comes
 * straight back and is shown on screen.
 */
export async function POST(request: Request) {
  let payload: { url?: unknown; locale?: unknown }
  try {
    payload = (await request.json()) as typeof payload
  } catch {
    return json({ ok: false, error: checkerCopy.ro.ui.errorInvalid }, 400)
  }

  const locale: Locale = payload.locale === 'en' ? 'en' : 'ro'
  const copy = checkerCopy[locale]

  if (typeof payload.url !== 'string') return json({ ok: false, error: copy.ui.errorInvalid }, 400)
  const url = normalizeInputUrl(payload.url)
  if (!url) return json({ ok: false, error: copy.ui.errorInvalid }, 400)

  const ip = clientIp(request)
  if (isRateLimited(`check-site:${ip}`, CHECKS_PER_HOUR, 3_600_000)) {
    return json({ ok: false, error: copy.ui.errorRate }, 429)
  }

  try {
    const report = await runChecks(url, locale, Date.now() + TOTAL_BUDGET_MS)
    return json({ ok: true, report })
  } catch (error) {
    if (error instanceof Error && error.name === 'SiteUnreachableError') {
      console.error('[check-site] site unreachable:', url, error.message)
      return json({ ok: false, error: copy.ui.errorUnreachable }, 502)
    }
    console.error('[check-site] unexpected failure:', url, error)
    return json({ ok: false, error: copy.ui.errorGeneric }, 500)
  }
}

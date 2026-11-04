import { runChecks } from '../lib/checker/checks'
import { normalizeInputUrl } from '../lib/checker/checks'

/**
 * Dev-only: exercises POST /api/check-site-report end to end against a local
 * dev server. Builds the same payload the browser sends (runChecks result),
 * then posts it. Usage:
 *   npx tsx scripts/test-check-report.ts <baseUrl> <recipient-email> [locale]
 */

async function main() {
  const [baseUrl, recipient, localeArg] = process.argv.slice(2)
  if (!baseUrl || !recipient) {
    console.error('usage: npx tsx scripts/test-check-report.ts <baseUrl> <recipient> [ro|en]')
    process.exit(1)
  }
  const locale = localeArg === 'en' ? 'en' : 'ro'
  const url = normalizeInputUrl('maststudio.ro')
  if (!url) throw new Error('normalizeInputUrl failed')

  console.log('[test] running checks…')
  const report = await runChecks(url, locale, Date.now() + 60_000)
  console.log('[test] overall:', report.overall)

  const payload = {
    url,
    locale,
    name: 'Test Cineva',
    email: recipient,
    phone: '+40 700 000 000',
    consent: true,
    website: '',
    report,
  }

  console.log('[test] posting to', `${baseUrl}/api/check-site-report`)
  const response = await fetch(`${baseUrl}/api/check-site-report`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(120_000),
  })
  const body = await response.json()
  console.log('[test] status:', response.status, 'body:', JSON.stringify(body))
}

main().catch((error) => {
  console.error('[test] failed:', error)
  process.exit(1)
})

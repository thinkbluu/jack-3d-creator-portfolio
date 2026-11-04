import { writeFile } from 'node:fs/promises'

import { runChecks } from '../lib/checker/checks'
import { collectDetail } from '../lib/checker/detail'
import { buildReportPdf } from '../lib/checker/pdf'
import { getServicePageBySlug } from '../lib/services'
import { absoluteUrl } from '../lib/site'
import { localizePath } from '../lib/i18n/paths'

/**
 * Dev-only: generates the detailed PDF report for a URL without going through
 * the email route, so the layout can be inspected. Usage:
 *   npx tsx scripts/gen-check-pdf.ts <url> <ro|en> <out.pdf>
 */

async function main() {
  const [url, localeArg, out] = process.argv.slice(2)
  if (!url || !localeArg || !out) {
    console.error('usage: npx tsx scripts/gen-check-pdf.ts <url> <ro|en> <out.pdf>')
    process.exit(1)
  }
  const locale = localeArg === 'en' ? 'en' : 'ro'

  console.log('[gen] running checks…')
  const report = await runChecks(url, locale, Date.now() + 60_000)
  console.log('[gen] overall:', report.overall, '| problems:', report.categories.flatMap((c) => c.sub).filter((s) => s.status === 'fail' || s.status === 'warn').length)

  console.log('[gen] collecting detail (page + PSI desktop)…')
  const facts = await collectDetail(url, 60_000, 20_000)
  console.log('[gen] desktop PSI:', facts.desktop?.performance ?? 'failed', '| redirects:', facts.redirects.length, '| cookies:', facts.cookies.length)

  const services = report.recommendedSlugs.flatMap((slug) => {
    const service = getServicePageBySlug(slug, locale)
    return service ? [{ name: service.name, priceLabel: service.priceLabel }] : []
  })
  const recheckUrl = `${absoluteUrl(localizePath('/verifica-site', locale))}?url=${encodeURIComponent(url)}`

  const bytes = await buildReportPdf(report, facts, locale, { recheckUrl, services })
  await writeFile(out, bytes)
  console.log('[gen] wrote', out, `${(bytes.length / 1024).toFixed(0)} KB`)
}

main().catch((error) => {
  console.error('[gen] failed:', error)
  process.exit(1)
})

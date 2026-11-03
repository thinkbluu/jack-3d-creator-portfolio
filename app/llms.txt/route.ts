import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { isNoDepositActive, llmsParagraphOffer } from '@/lib/offer'
import { getAllServicePages, serviceGroups } from '@/lib/services'
import { absoluteUrl } from '@/lib/site'

const DEPOSIT_PARAGRAPH =
  'Clientul plătește un avans de 50 EUR care se scade din prețul final. Vede site-ul finalizat, live pe internet, și plătește restul doar dacă este mulțumit de rezultat. Prima rundă de modificări este inclusă.'

const SERVICES_HEADER = '## Servicii și prețuri'
const NEXT_HEADER = '## Model de plată'

/** First sentence of the answer capsule, as the one-line summary. */
function capsuleSummary(capsule: string) {
  const cut = capsule.indexOf('. ')
  return cut === -1 ? capsule : capsule.slice(0, cut + 1)
}

/** Services grouped by the four groups, generated from lib/services so llms.txt never goes stale. */
function servicesSection() {
  const services = getAllServicePages('ro')
  const lines: string[] = [SERVICES_HEADER, '']
  for (const group of serviceGroups) {
    lines.push(`### ${group.name.ro}`, '')
    for (const service of services.filter((item) => item.group === group.id)) {
      lines.push(`- [${service.name}](${absoluteUrl(`/servicii/${service.slug}`)}): ${service.priceLabel}. ${capsuleSummary(service.answerCapsule)}`)
    }
    lines.push('')
  }
  return lines.join('\n').trimEnd()
}

// Served at request time so the payment-model paragraph follows the active
// offer and the services list follows lib/services without a redeploy. The
// base copy lives in public/llms-base.txt (public/llms.txt would shadow this
// route); the services section in the base file is replaced on every request.
export const revalidate = 3600

export async function GET() {
  const base = await readFile(path.join(process.cwd(), 'public', 'llms-base.txt'), 'utf8')
  const start = base.indexOf(SERVICES_HEADER)
  const end = base.indexOf(NEXT_HEADER)
  const withServices =
    start !== -1 && end !== -1 && end > start
      ? base.slice(0, start) + servicesSection() + '\n\n' + base.slice(end)
      : base
  const body = isNoDepositActive() ? withServices.replace(DEPOSIT_PARAGRAPH, llmsParagraphOffer) : withServices
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

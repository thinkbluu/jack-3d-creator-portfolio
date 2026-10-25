import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { isNoDepositActive, llmsParagraphOffer } from '@/lib/offer'

const DEPOSIT_PARAGRAPH =
  'Clientul plătește un avans de 50 EUR care se scade din prețul final. Vede site-ul finalizat, live pe internet, și plătește restul doar dacă este mulțumit de rezultat. Prima rundă de modificări este inclusă.'

// Served at request time so the payment-model paragraph follows the active
// offer without a redeploy. The base copy lives in public/llms-base.txt
// (public/llms.txt would shadow this route).
export const revalidate = 3600

export async function GET() {
  const base = await readFile(path.join(process.cwd(), 'public', 'llms-base.txt'), 'utf8')
  const body = isNoDepositActive() ? base.replace(DEPOSIT_PARAGRAPH, llmsParagraphOffer) : base
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

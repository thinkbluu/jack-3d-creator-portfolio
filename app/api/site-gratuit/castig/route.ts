import { isContestConfigured } from '@/lib/contest/config'
import { claimPrize } from '@/lib/contest/service'
import { verifyToken } from '@/lib/contest/tokens'
import { seeOther } from '@/lib/request'

const briefFields: Array<[string, string]> = [
  ['domain', 'Adresa site-ului (domeniu)'],
  ['pages', 'Pagini dorite'],
  ['services', 'Servicii și prețuri'],
  ['contact', 'Date de contact pentru site'],
  ['notes', 'Alte detalii'],
]

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const token = String(form?.get('t') ?? '')
  const entryId = isContestConfigured() ? verifyToken(token, 'claim') : null
  if (!form || !entryId) return seeOther(request, '/site-gratuit/castig?eroare=link')

  const back = (state: string) => seeOther(request, `/site-gratuit/castig?t=${encodeURIComponent(token)}&stare=${state}`)
  if (form.get('accept') !== 'da') return back('fara-acord')

  const brief = Object.fromEntries(briefFields.map(([key, label]) => [label, String(form.get(key) ?? '').trim().slice(0, 2000)]))

  try {
    const result = await claimPrize(entryId, brief, form.get('publish') === 'da')
    return back(result === 'claimed' ? 'confirmat' : result)
  } catch (error) {
    console.error('[concurs] Revendicarea premiului a eșuat:', error)
    return back('eroare')
  }
}

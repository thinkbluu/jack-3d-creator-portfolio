import { isContestConfigured } from '@/lib/contest/config'
import { confirmEntrant } from '@/lib/contest/service'
import { signToken, verifyToken } from '@/lib/contest/tokens'
import { seeOther } from '@/lib/request'

// The e-mail link opens a page with a button that posts here, so link
// scanners that pre-open e-mail links cannot confirm an address by themselves.
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const entrantId = isContestConfigured() ? verifyToken(String(form?.get('t') ?? ''), 'confirm') : null
  if (!entrantId) return seeOther(request, '/site-gratuit/confirmare?eroare=link')

  try {
    const confirmed = await confirmEntrant(entrantId)
    if (!confirmed) return seeOther(request, '/site-gratuit/confirmare?eroare=link')
    return seeOther(request, `/site-gratuit/participare?t=${encodeURIComponent(signToken('manage', confirmed, 400))}&stare=confirmat`)
  } catch (error) {
    console.error('[concurs] Confirmarea a eșuat:', error)
    return seeOther(request, '/site-gratuit/confirmare?eroare=server')
  }
}

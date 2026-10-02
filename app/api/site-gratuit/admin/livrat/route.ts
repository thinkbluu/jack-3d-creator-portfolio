import { isContestConfigured } from '@/lib/contest/config'
import { markDelivered } from '@/lib/contest/service'
import { verifyToken } from '@/lib/contest/tokens'
import { seeOther } from '@/lib/request'

function siteUrl(value: string) {
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`)
    return url.hostname.includes('.') ? url.toString() : null
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const token = String(form?.get('t') ?? '')
  const round = isContestConfigured() ? verifyToken(token, 'admin-delivered') : null
  if (!form || !round) return seeOther(request, '/site-gratuit/admin/livrat?eroare=link')

  const back = (state: string) => seeOther(request, `/site-gratuit/admin/livrat?t=${encodeURIComponent(token)}&stare=${state}`)
  const url = siteUrl(String(form.get('url') ?? '').trim())
  if (!url) return back('link-invalid')

  try {
    return back((await markDelivered(round, url)) ? 'livrat' : 'neconfirmat')
  } catch (error) {
    console.error('[concurs] Marcarea livrării a eșuat:', error)
    return back('eroare')
  }
}

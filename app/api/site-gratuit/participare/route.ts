import { isContestConfigured } from '@/lib/contest/config'
import { normalizePostUrl, rejoin, savePost, withdrawEntrant } from '@/lib/contest/service'
import { verifyToken } from '@/lib/contest/tokens'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { seeOther } from '@/lib/request'

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const locale: Locale = form?.get('locale') === 'en' ? 'en' : 'ro'
  const page = localizePath('/site-gratuit/participare', locale)
  const token = String(form?.get('t') ?? '')
  const entrantId = isContestConfigured() ? verifyToken(token, 'manage') : null
  if (!form || !entrantId) return seeOther(request, `${page}?eroare=link`)

  const back = (state: string) => seeOther(request, `${page}?t=${encodeURIComponent(token)}&stare=${state}`)

  try {
    switch (form.get('actiune')) {
      case 'postare': {
        const postUrl = normalizePostUrl(String(form.get('postUrl') ?? ''))
        if (!postUrl) return back('link-invalid')
        const result = await savePost(entrantId, postUrl)
        return back(result === 'saved' ? 'salvat' : result)
      }
      case 'retragere':
        await withdrawEntrant(entrantId)
        return back('retras')
      case 'revenire':
        await rejoin(entrantId)
        return back('revenit')
      default:
        return back('eroare')
    }
  } catch (error) {
    console.error('[concurs] Actualizarea participării a eșuat:', error)
    return back('eroare')
  }
}

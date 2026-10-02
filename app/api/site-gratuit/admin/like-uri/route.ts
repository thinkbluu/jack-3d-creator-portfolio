import { isContestConfigured } from '@/lib/contest/config'
import { getRoundForAdmin, recordLikes } from '@/lib/contest/service'
import { verifyToken } from '@/lib/contest/tokens'
import { seeOther } from '@/lib/request'

export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)
  const token = String(form?.get('t') ?? '')
  const round = isContestConfigured() ? verifyToken(token, 'admin-likes') : null
  if (!form || !round) return seeOther(request, '/site-gratuit/admin/like-uri?eroare=link')

  const back = (state: string) => seeOther(request, `/site-gratuit/admin/like-uri?t=${encodeURIComponent(token)}&stare=${state}`)

  try {
    const { entries } = await getRoundForAdmin(round)
    const values = entries.map((entry) => {
      const invalid = form.get(`invalid_${entry.id}`) === 'da'
      const raw = String(form.get(`likes_${entry.id}`) ?? '').trim()
      const likes = raw === '' ? null : Number.parseInt(raw, 10)
      return { id: entry.id, invalid, likes: Number.isFinite(likes) && likes !== null && likes >= 0 ? likes : null }
    })
    if (values.some((value) => !value.invalid && value.likes === null)) return back('lipsa-like-uri')

    const result = await recordLikes(round, values)
    return back(result)
  } catch (error) {
    console.error('[concurs] Înregistrarea aprecierilor a eșuat:', error)
    return back('eroare')
  }
}

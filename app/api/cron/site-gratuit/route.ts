import { isContestConfigured } from '@/lib/contest/config'
import { runDailyJobs } from '@/lib/contest/service'

export const dynamic = 'force-dynamic'

// Called once a day by Vercel Cron (vercel.json). Vercel sends
// `Authorization: Bearer <CRON_SECRET>` when CRON_SECRET is set.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 })
  }
  if (!isContestConfigured()) return Response.json({ ok: true, skipped: 'Concursul nu este configurat.' })

  try {
    return Response.json({ ok: true, ...(await runDailyJobs()) })
  } catch (error) {
    console.error('[concurs] Jobul zilnic a eșuat:', error)
    return Response.json({ ok: false }, { status: 500 })
  }
}

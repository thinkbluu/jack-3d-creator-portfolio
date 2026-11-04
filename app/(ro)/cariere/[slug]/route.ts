// The job pages were removed when every open position was filled. Known job
// slugs answer 410 Gone so search engines drop the expired JobPosting data
// (Google penalises expired postings); unknown slugs stay a plain 404.
import { JOB_OPENINGS } from '@/lib/careers'

const goneBody = `<!doctype html>
<html lang="ro">
<head><meta charset="utf-8"><meta name="robots" content="noindex"><title>410 — post închis</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 4rem auto; padding: 0 1rem; line-height: 1.6;">
<p>Acest anunț de angajare a fost închis.</p>
<p>Vezi <a href="/cariere">pagina de cariere</a> sau scrie-ne la <a href="mailto:contact@maststudio.ro">contact@maststudio.ro</a>.</p>
</body>
</html>`

const notFoundBody = `<!doctype html>
<html lang="ro">
<head><meta charset="utf-8"><title>404</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 4rem auto; padding: 0 1rem; line-height: 1.6;">
<p>Pagina nu există. Vezi <a href="/cariere">pagina de cariere</a>.</p>
</body>
</html>`

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (JOB_OPENINGS.some((job) => job.id === slug)) {
    return new Response(goneBody, {
      status: 410,
      headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=86400' },
    })
  }
  return new Response(notFoundBody, {
    status: 404,
    headers: { 'content-type': 'text/html; charset=utf-8' },
  })
}

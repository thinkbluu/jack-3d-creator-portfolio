// English mirror of the closed job pages: 410 Gone for known job slugs,
// 404 for anything else. See app/(ro)/cariere/[slug]/route.ts.
import { JOB_OPENINGS } from '@/lib/careers'

const goneBody = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="robots" content="noindex"><title>410 — posting closed</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 4rem auto; padding: 0 1rem; line-height: 1.6;">
<p>This job posting has been closed.</p>
<p>See the <a href="/en/careers">careers page</a> or write to <a href="mailto:contact@maststudio.ro">contact@maststudio.ro</a>.</p>
</body>
</html>`

const notFoundBody = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>404</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 40rem; margin: 4rem auto; padding: 0 1rem; line-height: 1.6;">
<p>This page doesn’t exist. See the <a href="/en/careers">careers page</a>.</p>
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

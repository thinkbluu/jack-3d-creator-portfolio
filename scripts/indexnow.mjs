// Submits URLs to IndexNow (Bing, Yandex, Seznam, Naver share the endpoint)
// after production deploys. A failed or timed-out submission must never fail
// the build, so every path logs and exits 0.
//
// - `postbuild` runs this without flags: it only submits when VERCEL_ENV is
//   "production", and only URLs whose sitemap lastmod is within the last 2 days.
// - `pnpm indexnow:all` (--all) is the manual first submission: it bypasses the
//   environment guard and submits every URL in the sitemap.
const KEY = 'e71358143d9b4bca8d8efb9d48cfbf83'
const HOST = 'maststudio.ro'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/IndexNow'
const SITEMAP_URL = `https://${HOST}/sitemap.xml`
const MAX_URLS_PER_REQUEST = 10000
const RECENT_WINDOW_MS = 2 * 24 * 60 * 60 * 1000
const TIMEOUT_MS = 10000

const STATUS_MEANING = {
  200: 'OK — key valid, URLs submitted',
  202: 'Accepted — key pending validation; resubmit once the key file is reachable',
  400: 'Bad request — the body is invalid',
  403: 'Key not valid — the key file is not reachable or does not match',
  422: "URLs don't match the host or the key",
  429: 'Too many requests — slow down and retry later',
}

const manual = process.argv.includes('--all')
if (!manual && process.env.VERCEL_ENV !== 'production') {
  console.log('[indexnow] Skipped: not a production deploy (set --all to submit manually).')
  process.exit(0)
}

function parseSitemap(xml) {
  const urls = []
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block[1].match(/<loc>\s*([^<\s]+)\s*<\/loc>/)?.[1]
    if (!loc) continue
    const lastmod = block[1].match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/)?.[1]
    urls.push({ loc, lastmod })
  }
  return urls
}

async function submit(urlList) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  const meaning = STATUS_MEANING[response.status] ?? `Unexpected status`
  console.log(`[indexnow] ${urlList.length} URLs → HTTP ${response.status}: ${meaning}`)
}

try {
  const response = await fetch(SITEMAP_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  if (!response.ok) {
    console.log(`[indexnow] Skipped: sitemap fetch failed with HTTP ${response.status}.`)
    process.exit(0)
  }
  const entries = parseSitemap(await response.text())
  const siteUrls = entries
    .map((entry) => entry.loc)
    .filter((loc) => loc.startsWith(`https://${HOST}`))

  const cutoff = Date.now() - RECENT_WINDOW_MS
  const urlList = manual
    ? siteUrls
    : siteUrls.filter((loc) => {
        const lastmod = entries.find((entry) => entry.loc === loc)?.lastmod
        if (!lastmod) return false
        const time = Date.parse(lastmod)
        return Number.isFinite(time) && time >= cutoff
      })

  if (urlList.length === 0) {
    console.log('[indexnow] Skipped: no URLs to submit.')
    process.exit(0)
  }

  console.log(`[indexnow] Submitting ${urlList.length} of ${siteUrls.length} sitemap URLs${manual ? ' (--all)' : ' (changed in the last 2 days)'}.`)
  for (let index = 0; index < urlList.length; index += MAX_URLS_PER_REQUEST) {
    await submit(urlList.slice(index, index + MAX_URLS_PER_REQUEST))
  }
} catch (error) {
  const reason = error?.name === 'TimeoutError' ? 'timed out' : `failed: ${error?.message ?? error}`
  console.log(`[indexnow] Submission ${reason}; ignoring.`)
}

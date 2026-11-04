// Submits URLs to IndexNow (Bing, Yandex, Seznam, Naver share the endpoint)
// after production deploys. A failed or timed-out submission must never fail
// the build, so every path logs and exits 0.
//
// Modes:
// - `postbuild` runs this without flags: it only submits when VERCEL_ENV is
//   "production", and only URLs whose sitemap lastmod is within the last
//   7 days (no database to track the previous submission). The whole run is
//   capped at 15 s so the deploy never waits on IndexNow.
// - `node scripts/indexnow.mjs --all` is the manual first submission: it
//   bypasses the environment guard and submits every URL in the sitemap
//   (RO and EN).
// - `node scripts/indexnow.mjs --url <url>` submits a single URL.
// - `--dry-run` (with --all or --url) prints the JSON payload and the URL
//   count without sending anything.
const KEY = process.env.INDEXNOW_KEY?.trim() || 'a63723ef725e4063aa9195084ed1385b'
// Must match SITE_URL in lib/site.ts and the sitemap — IndexNow rejects
// URLs whose host does not match `host` and the key file location.
const HOST = 'maststudio.ro'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const ENDPOINT = 'https://api.indexnow.org/indexnow'
const SITEMAP_URL = `https://${HOST}/sitemap.xml`
const MAX_URLS_PER_REQUEST = 10000
const RECENT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000
const TIMEOUT_MS = 10000
// Hard cap on total IndexNow time during a deploy build (postbuild mode).
const AUTO_DEADLINE_MS = 15000
// On 429 the endpoint asks us to slow down. Waiting 60 s is fine for a manual
// run but would blow the deploy budget, so only manual mode retries.
const RETRY_DELAY_MS = 60000

const STATUS_MEANING = {
  200: 'OK — key valid, URLs submitted',
  202: 'Accepted — key pending validation; resubmit once the key file is reachable',
  400: 'Bad request — the body is invalid',
  403: 'Key not valid — the key file is not reachable or does not match',
  422: "URLs don't match the host or the key",
  429: 'Too many requests — slow down and retry later',
}

const allIndex = process.argv.indexOf('--all')
const urlIndex = process.argv.indexOf('--url')
const dryRun = process.argv.includes('--dry-run')
const manualAll = allIndex !== -1
const singleUrl = urlIndex !== -1 ? process.argv[urlIndex + 1] : undefined
const manual = manualAll || Boolean(singleUrl) || dryRun

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

function buildPayload(urlList) {
  return { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList }
}

async function submitOnce(payload) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  const meaning = STATUS_MEANING[response.status] ?? 'Unexpected status'
  console.log(`[indexnow] ${payload.urlList.length} URLs → HTTP ${response.status}: ${meaning}`)
  return response.status
}

async function submit(payload, { allowRetry }) {
  const status = await submitOnce(payload)
  if (status === 429 && allowRetry) {
    console.log(`[indexnow] Waiting ${RETRY_DELAY_MS / 1000} s before the single retry…`)
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS))
    await submitOnce(payload)
  }
}

function printDryRun(payload) {
  const list = payload.urlList
  const preview = list.length > 5 ? [...list.slice(0, 5), `… and ${list.length - 5} more`] : list
  console.log(`[indexnow] Dry run: ${list.length} URLs in the payload.`)
  console.log(`[indexnow] First URLs: ${JSON.stringify(preview, null, 2)}`)
  console.log(`[indexnow] Payload (urlList truncated): ${JSON.stringify({ ...payload, urlList: preview })}`)
}

try {
  const startedAt = Date.now()
  const autoDeadline = () => Date.now() - startedAt > AUTO_DEADLINE_MS

  if (singleUrl) {
    if (!singleUrl.startsWith(`https://${HOST}`)) {
      console.log(`[indexnow] Skipped: --url must start with https://${HOST} (IndexNow rejects foreign hosts).`)
      process.exit(0)
    }
    const payload = buildPayload([singleUrl])
    if (dryRun) {
      printDryRun(payload)
      process.exit(0)
    }
    await submit(payload, { allowRetry: true })
    process.exit(0)
  }

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
  const urlList = manualAll || dryRun
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

  console.log(`[indexnow] Submitting ${urlList.length} of ${siteUrls.length} sitemap URLs${manualAll || dryRun ? ' (--all)' : ' (changed in the last 7 days)'}.`)

  const payload = buildPayload(urlList)
  if (dryRun) {
    printDryRun(payload)
    process.exit(0)
  }

  for (let index = 0; index < urlList.length; index += MAX_URLS_PER_REQUEST) {
    if (!manual && autoDeadline()) {
      console.log('[indexnow] Stopped: 15 s deploy budget reached before this batch; ignoring.')
      break
    }
    const batch = buildPayload(urlList.slice(index, index + MAX_URLS_PER_REQUEST))
    // Automatic mode never waits on a 429 — the deploy budget forbids it.
    await submit(batch, { allowRetry: manual })
  }
} catch (error) {
  const reason = error?.name === 'TimeoutError' ? 'timed out' : `failed: ${error?.message ?? error}`
  console.log(`[indexnow] Submission ${reason}; ignoring.`)
}

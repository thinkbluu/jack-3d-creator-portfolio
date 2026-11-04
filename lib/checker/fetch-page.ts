import { lookup } from 'node:dns/promises'
import { isIP } from 'node:net'

/**
 * Hardened page fetch for the website checker.
 *
 * Safety rules: only http/https, private and internal IPs blocked after DNS
 * resolution (and re-checked on every redirect hop), maximum 3 redirects,
 * maximum 2 MB of HTML, and an honest User-Agent that names the checker.
 */

export const CHECKER_USER_AGENT = 'MAST Studio Website Checker (+https://maststudio.ro/verifica-site)'

export const MAX_HTML_BYTES = 2 * 1024 * 1024
export const MAX_REDIRECTS = 3

export class FetchBlockedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FetchBlockedError'
  }
}

/** IPv4 ranges that must never be reached: private, loopback, link-local, reserved. */
function isPrivateIPv4(ip: string) {
  const parts = ip.split('.').map(Number)
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part) || part < 0 || part > 255)) return true
  const [a, b] = parts
  if (a === 0 || a === 10 || a === 127) return true
  if (a === 169 && b === 254) return true
  if (a === 172 && b >= 16 && b <= 31) return true
  if (a === 192 && b === 168) return true
  if (a === 100 && b >= 64 && b <= 127) return true // CGNAT
  if (a === 192 && b === 0) return true
  if (a === 198 && (b === 18 || b === 19)) return true
  if (a >= 224) return true // multicast + reserved
  return false
}

function isPrivateIPv6(ip: string) {
  const value = ip.toLowerCase()
  if (value === '::' || value === '::1') return true
  if (value.startsWith('fe80') || value.startsWith('fc') || value.startsWith('fd')) return true
  if (value.startsWith('::ffff:')) return isPrivateIPv4(value.slice(7))
  return false
}

function isPrivateIp(ip: string) {
  if (isIP(ip) === 4) return isPrivateIPv4(ip)
  if (isIP(ip) === 6) return isPrivateIPv6(ip)
  return true
}

/**
 * Resolves the host and refuses private, loopback or otherwise internal
 * addresses, so the checker can never be pointed at the internal network.
 */
export async function assertPublicHost(hostname: string) {
  const host = hostname.trim().toLowerCase().replace(/\.$/, '')
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    throw new FetchBlockedError(`blocked host: ${host}`)
  }
  if (isIP(host)) {
    if (isPrivateIp(host)) throw new FetchBlockedError(`blocked address: ${host}`)
    return
  }
  const records = await lookup(host, { all: true, verbatim: true }).catch(() => [])
  if (records.length === 0) throw new FetchBlockedError(`could not resolve: ${host}`)
  for (const record of records) {
    if (isPrivateIp(record.address)) throw new FetchBlockedError(`blocked address: ${record.address}`)
  }
}

/** Validates a URL for the checker: only http/https, then DNS-checks the host. */
export async function assertFetchableUrl(rawUrl: string) {
  let url: URL
  try {
    url = new URL(rawUrl)
  } catch {
    throw new FetchBlockedError('invalid URL')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new FetchBlockedError('only http and https are allowed')
  if (url.username || url.password) throw new FetchBlockedError('credentials in URL are not allowed')
  await assertPublicHost(url.hostname)
  return url
}

export type FetchedPage = {
  finalUrl: string
  status: number
  html: string
  /** Set-Cookie headers seen on the first, unconsented response. */
  cookies: string[]
  /** True when the body was cut off at the 2 MB limit. */
  truncated: boolean
  /** True when the first response was plain http (before any redirect). */
  startedInsecure: boolean
  /** Every redirect hop, in order (empty when the first response is final). */
  redirects: { from: string; status: number; to: string }[]
  /** Time to the final response header, in milliseconds. */
  serverResponseMs: number | null
  /** Content-Encoding of the final response (compression evidence). */
  contentEncoding: string | null
}

async function readBodyCapped(response: Response, maxBytes: number) {
  const reader = response.body?.getReader()
  if (!reader) return { text: '', truncated: false }
  const chunks: Uint8Array[] = []
  let total = 0
  let truncated = false
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) {
      truncated = true
      chunks.push(value.slice(0, value.byteLength - (total - maxBytes)))
      await reader.cancel().catch(() => {})
      break
    }
    chunks.push(value)
  }
  const merged = new Uint8Array(chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0))
  let offset = 0
  for (const chunk of chunks) {
    merged.set(chunk, offset)
    offset += chunk.byteLength
  }
  return { text: new TextDecoder('utf-8').decode(merged), truncated }
}

/**
 * GETs a URL through the safety gauntlet, following up to 3 redirects and
 * re-validating every hop against DNS. `maxBytes` caps the body size.
 */
export async function fetchChecked(rawUrl: string, options: { maxBytes?: number; timeoutMs: number; method?: 'GET' }): Promise<FetchedPage> {
  const maxBytes = options.maxBytes ?? MAX_HTML_BYTES
  let current = await assertFetchableUrl(rawUrl)
  const startedInsecure = current.protocol === 'http:'

  const redirects: { from: string; status: number; to: string }[] = []

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const hopStartedAt = Date.now()
    const response = await fetch(current, {
      method: options.method ?? 'GET',
      redirect: 'manual',
      headers: { 'User-Agent': CHECKER_USER_AGENT, Accept: 'text/html,application/xhtml+xml,text/plain,*/*' },
      signal: AbortSignal.timeout(options.timeoutMs),
      cache: 'no-store',
    }).catch((error: unknown) => {
      throw error instanceof Error ? error : new FetchBlockedError('fetch failed')
    })
    const serverResponseMs = Date.now() - hopStartedAt

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location')
      await response.body?.cancel().catch(() => {})
      if (!location) throw new FetchBlockedError(`redirect without destination (${response.status})`)
      if (hop === MAX_REDIRECTS) throw new FetchBlockedError('too many redirects')
      const next = new URL(location, current)
      if (next.protocol !== 'http:' && next.protocol !== 'https:') throw new FetchBlockedError('redirect to a non-web address')
      await assertPublicHost(next.hostname)
      redirects.push({ from: current.toString(), status: response.status, to: next.toString() })
      current = next
      continue
    }

    const { text, truncated } = await readBodyCapped(response, maxBytes)
    const cookies = typeof response.headers.getSetCookie === 'function' ? response.headers.getSetCookie() : []
    return {
      finalUrl: current.toString(),
      status: response.status,
      html: text,
      cookies,
      truncated,
      startedInsecure,
      redirects,
      serverResponseMs,
      contentEncoding: response.headers.get('content-encoding'),
    }
  }

  throw new FetchBlockedError('too many redirects')
}

/** Convenience wrapper for small support files (robots.txt, sitemap.xml). */
export async function fetchSmallFile(url: string, timeoutMs: number) {
  return fetchChecked(url, { maxBytes: 512 * 1024, timeoutMs })
}

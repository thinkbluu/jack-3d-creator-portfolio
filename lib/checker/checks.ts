import { checkerCopy, fill, type CheckerCopy } from './copy'
import { FetchBlockedError, fetchChecked, fetchSmallFile } from './fetch-page'
import type { CategoryKey, CategoryResult, CategoryVerdict, FixSuggestion, SiteReport, SubCheck } from './types'

/** Turns "firmata.ro", "www.firmata.ro" or a full URL into a clean https:// URL. */
export function normalizeInputUrl(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed || /\s/.test(trimmed)) return null
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  let url: URL
  try {
    url = new URL(withProtocol)
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  // A hostname must contain a dot (or be a bracketed IPv6 literal).
  if (!url.hostname.includes('.') && !url.hostname.startsWith('[')) return null
  if (!/^[a-z0-9.-]+$/i.test(url.hostname.replace(/^\[|\]$/g, ''))) return null
  url.hash = ''
  return url.toString()
}

type SubMap = Map<string, SubCheck>

function sub(map: SubMap, id: string, status: SubCheck['status'], label: string, detail?: string) {
  map.set(id, { id, status, label, ...(detail !== undefined ? { detail } : {}) })
}

/** Weighted score from the sub-checks; `error` entries are excluded entirely. */
function scoreFrom(weights: Record<string, number>, map: SubMap): number | null {
  let total = 0
  let earned = 0
  for (const [id, weight] of Object.entries(weights)) {
    const entry = map.get(id)
    if (!entry || entry.status === 'error') continue
    total += weight
    if (entry.status === 'pass') earned += weight
    else if (entry.status === 'warn') earned += weight / 2
  }
  if (total === 0) return null
  return Math.round((earned / total) * 100)
}

function verdictFor(score: number | null): CategoryVerdict {
  if (score === null) return 'unverified'
  if (score >= 80) return 'good'
  if (score >= 50) return 'fair'
  return 'poor'
}

// ---------------------------------------------------------------------------
// HTML helpers (regex-based on purpose: the checker runs on the server with
// no DOM, and the checks are deliberately simple and explainable).
// ---------------------------------------------------------------------------

function stripInvisible(html: string) {
  return html.replace(/<(script|style|noscript|svg)\b[\s\S]*?<\/\1>/gi, ' ')
}

function visibleText(html: string) {
  return stripInvisible(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
}

function tags(html: string, pattern: RegExp) {
  return html.match(pattern) ?? []
}

function attr(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'))
  return match ? (match[2] ?? match[3] ?? match[4] ?? null) : null
}

function hrefs(html: string): string[] {
  const values: string[] = []
  for (const anchor of tags(html, /<a\b[^>]*>/gi)) {
    const value = attr(anchor, 'href')
    if (value) values.push(value)
  }
  return values
}

const TRACKER_PATTERNS: Array<[string, RegExp]> = [
  ['google-analytics', /googletagmanager\.com\/gtag\/js|google-analytics\.com|googletagmanager\.com\/gtm\.js|__gtag|gtag\(/i],
  ['meta-pixel', /connect\.facebook\.net|fbq\(|facebook\.com\/tr\b/i],
  ['tiktok', /analytics\.tiktok\.com|ttq\./i],
]

const TRACKER_COOKIE_NAMES = /^(_ga|_gid|_gat|_fbp|_fr|_ttp|_ttq|_gcl)/i

const CONSENT_MARKERS =
  /cookiebot|cookieyes|complianz|cookielawinfo|onetrust|borlabs|moove_gdpr|cookie-consent|cookieconsent|cookie_consent|consentmanager|consent-manager|iubenda|termly|klaro|cookie-banner|cookiebanner|gdpr-cookie|cmplz_|Cookiebot|usercentrics/i

const CONSENT_TEXT_MARKERS = /accept[ăa] cookie|accept cookies|cookie policy|politica cookie|gestionare cookie|cookie settings|preferin[țt]e cookie/i

function jsonLdTypes(html: string): string[] {
  const types: string[] = []
  const blocks = html.match(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) ?? []
  for (const block of blocks) {
    const body = block.replace(/^<script[^>]*>/i, '').replace(/<\/script>$/i, '')
    try {
      const parsed: unknown = JSON.parse(body.trim())
      collectTypes(parsed, types)
    } catch {
      // Malformed JSON-LD is common; the other blocks still count.
    }
  }
  return types
}

function collectTypes(node: unknown, types: string[]) {
  if (Array.isArray(node)) {
    for (const item of node) collectTypes(item, types)
    return
  }
  if (node && typeof node === 'object') {
    const record = node as Record<string, unknown>
    const type = record['@type']
    if (typeof type === 'string') types.push(type)
    else if (Array.isArray(type)) types.push(...type.filter((item): item is string => typeof item === 'string'))
    if (record['@graph']) collectTypes(record['@graph'], types)
  }
}

const BUSINESS_TYPES = /(^|\b)(organization|localbusiness|professionalservice|store|restaurant|hotel|medicalclinic|dentist|physician|veterinarycare|legalservice|real estate agent|realestateagent|foodestablishment|healthandbeautybusiness|automotivebusiness|homeandconstructionbusiness|educationalorganization|onlinebusiness|business)\b/i

// ---------------------------------------------------------------------------
// The five categories
// ---------------------------------------------------------------------------

async function speedCheck(url: string, locale: 'ro' | 'en', deadline: number): Promise<CategoryResult> {
  const copy = checkerCopy[locale]
  const map: SubMap = new Map()
  const remaining = Math.max(2000, deadline - Date.now())
  const key = process.env.PAGESPEED_API_KEY?.trim()
  const psiUrl =
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=mobile&category=performance` +
    (key ? `&key=${encodeURIComponent(key)}` : '')

  try {
    const response = await fetch(psiUrl, { signal: AbortSignal.timeout(Math.min(remaining, 22_000)), cache: 'no-store' })
    if (!response.ok) throw new Error(`PSI ${response.status}`)
    const data = (await response.json()) as {
      lighthouseResult?: { categories?: { performance?: { score?: number } }; audits?: Record<string, { displayValue?: string; score?: number }> }
    }
    const score01 = data.lighthouseResult?.categories?.performance?.score
    if (typeof score01 !== 'number') throw new Error('PSI without performance score')
    const performance = Math.round(score01 * 100)
    const lcp = data.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue
    const cls = data.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue

    const status: SubCheck['status'] = performance >= 80 ? 'pass' : performance >= 50 ? 'warn' : 'fail'
    sub(map, 'performance', status, copy.sub.performance[status])
    return {
      key: 'speed',
      score: performance,
      verdict: verdictFor(performance),
      sub: [...map.values()],
      metrics: { performance, ...(lcp ? { lcp } : {}), ...(cls ? { cls } : {}) },
    }
  } catch {
    return { key: 'speed', score: null, verdict: 'unverified', sub: [] }
  }
}

type PageFacts = {
  finalUrl: string
  startedInsecure: boolean
  html: string
  cookies: string[]
  truncated: boolean
}

function legalCheck(page: PageFacts, locale: 'ro' | 'en'): CategoryResult {
  const copy = checkerCopy[locale]
  const map: SubMap = new Map()
  const links = hrefs(page.html)
  const text = visibleText(page.html)

  const finalHttps = page.finalUrl.startsWith('https://')
  sub(map, 'https', finalHttps ? 'pass' : 'fail', copy.sub.https[finalHttps ? 'pass' : 'fail'])

  const hasAnpc = links.some((link) => /anpc\.ro/i.test(link))
  sub(map, 'anpc', hasAnpc ? 'pass' : 'fail', copy.sub.anpc[hasAnpc ? 'pass' : 'fail'])

  const hasSal = links.some((link) => /reclamatiisal\.anpc\.ro|ec\.europa\.eu\/consumers\/odr/i.test(link))
  sub(map, 'sal', hasSal ? 'pass' : 'fail', copy.sub.sal[hasSal ? 'pass' : 'fail'])

  const hasCompany =
    /\bC\.?U\.?I\.?\s*[:\-–]?\s*\d{2,10}\b/i.test(text) ||
    /\bC\.?I\.?F\.?\s*[:\-–]?\s*\d{2,10}\b/i.test(text) ||
    /\bRO\s?\d{6,10}\b/.test(text) ||
    /\bJ\d{2}\/\d{1,5}\/\d{1,6}\b/.test(text)
  sub(map, 'company', hasCompany ? 'pass' : 'fail', copy.sub.company[hasCompany ? 'pass' : 'fail'])

  const hasPrivacy = links.some((link) => /confidentialitate|privacy|politica.*confidential|gdpr|date.*personale|data.*protection/i.test(link))
  sub(map, 'privacy', hasPrivacy ? 'pass' : 'fail', copy.sub.privacy[hasPrivacy ? 'pass' : 'fail'])

  const bannerMarker = CONSENT_MARKERS.test(page.html) || CONSENT_TEXT_MARKERS.test(page.html)
  const bannerStrong = /cookiebot|cookieyes|complianz|cookielawinfo|onetrust|borlabs|moove_gdpr|iubenda|termly|klaro|usercentrics|cookie-consent|cookieconsent/i.test(page.html)
  sub(
    map,
    'cookieBanner',
    bannerStrong ? 'pass' : bannerMarker ? 'warn' : 'fail',
    copy.sub.cookieBanner[bannerStrong ? 'pass' : bannerMarker ? 'warn' : 'fail'],
  )

  // Honest scope: this looks at the initial HTML and the first response's
  // Set-Cookie headers, not a full browser audit. A tracker script that is
  // present but visibly gated by a Consent Mode default-denied call counts
  // as a warning, not a failure.
  const trackerHits: string[] = []
  for (const [name, pattern] of TRACKER_PATTERNS) {
    if (pattern.test(page.html)) trackerHits.push(name)
  }
  const trackerCookies = page.cookies.filter((cookie) => TRACKER_COOKIE_NAMES.test(cookie.split('=')[0] ?? ''))
  const consentGated = /consent\s*\(\s*['"]default['"]|ad_storage|analytics_storage/i.test(page.html)
  const trackerStatus: SubCheck['status'] =
    trackerCookies.length > 0 ? 'fail' : trackerHits.length > 0 ? (consentGated ? 'warn' : 'fail') : 'pass'
  sub(map, 'trackers', trackerStatus, copy.sub.trackers[trackerStatus], trackerHits.length ? [...new Set(trackerHits)].join(', ') : undefined)

  const score = scoreFrom({ https: 20, anpc: 10, sal: 10, company: 15, privacy: 15, cookieBanner: 10, trackers: 20 }, map)
  return { key: 'legal', score, verdict: verdictFor(score), sub: [...map.values()] }
}

function googleCheck(page: PageFacts, locale: 'ro' | 'en', robotsStatus: number | null, sitemapOk: boolean | null): Promise<CategoryResult> {
  return Promise.resolve().then(async (): Promise<CategoryResult> => {
    const copy = checkerCopy[locale]
    const map: SubMap = new Map()
    const html = page.html

    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim().replace(/\s+/g, ' ') ?? ''
    const titleLength = title.length
    const titleStatus: SubCheck['status'] = titleLength === 0 ? 'fail' : titleLength >= 15 && titleLength <= 60 ? 'pass' : 'warn'
    sub(map, 'title', titleStatus, fill(copy.sub.title[titleStatus], { n: titleLength }))

    const description = html.match(/<meta[^>]*name\s*=\s*["']description["'][^>]*>/i)
    const descriptionLength = description ? (attr(description[0], 'content') ?? '').trim().length : 0
    const descriptionStatus: SubCheck['status'] =
      descriptionLength === 0 ? 'fail' : descriptionLength >= 70 && descriptionLength <= 160 ? 'pass' : 'warn'
    sub(map, 'description', descriptionStatus, fill(copy.sub.description[descriptionStatus], { n: descriptionLength }))

    const h1Count = tags(html, /<h1[\s>]/gi).length
    const h1Status: SubCheck['status'] = h1Count === 1 ? 'pass' : 'fail'
    sub(map, 'h1', h1Status, fill(copy.sub.h1[h1Status], { n: h1Count }))

    sub(
      map,
      'robots',
      robotsStatus === null ? 'error' : robotsStatus >= 200 && robotsStatus < 300 ? 'pass' : 'fail',
      robotsStatus === null ? copy.unverified : copy.sub.robots[robotsStatus >= 200 && robotsStatus < 300 ? 'pass' : 'fail'],
    )

    sub(
      map,
      'sitemap',
      sitemapOk === null ? 'error' : sitemapOk ? 'pass' : 'fail',
      sitemapOk === null ? copy.unverified : copy.sub.sitemap[sitemapOk ? 'pass' : 'fail'],
    )

    const types = jsonLdTypes(html)
    const hasBusinessSchema = types.some((type) => BUSINESS_TYPES.test(type))
    sub(map, 'jsonld', hasBusinessSchema ? 'pass' : 'fail', copy.sub.jsonld[hasBusinessSchema ? 'pass' : 'fail'])

    const links = hrefs(html)
    const hasMaps = links.some((link) =>
      /(?:maps\.google|google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl|g\.page|business\.site|google\.com\/business)/i.test(link),
    )
    sub(map, 'maps', hasMaps ? 'pass' : 'fail', copy.sub.maps[hasMaps ? 'pass' : 'fail'])

    const score = scoreFrom({ title: 15, description: 15, h1: 10, robots: 10, sitemap: 15, jsonld: 20, maps: 15 }, map)
    return { key: 'google', score, verdict: verdictFor(score), sub: [...map.values()] }
  })
}

function contactCheck(page: PageFacts, locale: 'ro' | 'en'): CategoryResult {
  const copy = checkerCopy[locale]
  const map: SubMap = new Map()
  const links = hrefs(page.html)
  const text = visibleText(page.html)

  const hasPhone = links.some((link) => /^tel:/i.test(link.trim()))
  sub(map, 'phone', hasPhone ? 'pass' : 'fail', copy.sub.phone[hasPhone ? 'pass' : 'fail'])

  const hasWhatsapp = links.some((link) => /wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(link))
  sub(map, 'whatsapp', hasWhatsapp ? 'pass' : 'fail', copy.sub.whatsapp[hasWhatsapp ? 'pass' : 'fail'])

  const hasEmailForm = links.some((link) => /^mailto:/i.test(link.trim())) || /<form\b/i.test(page.html)
  sub(map, 'emailForm', hasEmailForm ? 'pass' : 'fail', copy.sub.emailForm[hasEmailForm ? 'pass' : 'fail'])

  const hasAddress =
    /\b(str\.?\s|strada\s|bd\.?\s|bulevardul\s|b-dul\s|calea\s|pia[țt]a\s|splaiul?\s|șoseaua\s|sos\.\s)/i.test(text) ||
    /\b(adres[ăa]|address)\s*[:–-]/i.test(text)
  sub(map, 'address', hasAddress ? 'pass' : 'fail', copy.sub.address[hasAddress ? 'pass' : 'fail'])

  const hasHours = /\b(program|orar|deschis|opening hours|luni[ -–]|monday[ -–]|mon[ -–]fri|mon[ -–]sat)\b/i.test(text)
  sub(map, 'hours', hasHours ? 'pass' : 'fail', copy.sub.hours[hasHours ? 'pass' : 'fail'])

  const score = scoreFrom({ phone: 20, whatsapp: 15, emailForm: 25, address: 20, hours: 20 }, map)
  return { key: 'contact', score, verdict: verdictFor(score), sub: [...map.values()] }
}

function accessibilityCheck(page: PageFacts, locale: 'ro' | 'en'): CategoryResult {
  const copy = checkerCopy[locale]
  const map: SubMap = new Map()

  const images = tags(page.html, /<img\b[^>]*>/gi)
  const withoutAlt = images.filter((image) => attr(image, 'alt') === null).length
  let altStatus: SubCheck['status'] = 'pass'
  if (images.length > 0 && withoutAlt > 0) altStatus = withoutAlt / images.length >= 0.25 ? 'fail' : 'warn'
  sub(
    map,
    'alt',
    altStatus,
    fill(copy.sub.alt[altStatus], { n: withoutAlt, m: images.length }),
  )

  const labelForIds = new Set<string>()
  for (const label of tags(page.html, /<label\b[^>]*>/gi)) {
    const forId = attr(label, 'for')
    if (forId) labelForIds.add(forId)
  }
  const fields = tags(page.html, /<(input|textarea|select)\b[^>]*>/gi).filter((field) => {
    const type = (attr(field, 'type') ?? 'text').toLowerCase()
    return type !== 'hidden' && type !== 'submit' && type !== 'button' && type !== 'reset' && type !== 'image'
  })
  const unlabeled = fields.filter((field) => {
    if (attr(field, 'aria-label') !== null || attr(field, 'aria-labelledby') !== null || attr(field, 'title') !== null) return false
    const id = attr(field, 'id')
    return !(id && labelForIds.has(id))
  }).length
  let labelStatus: SubCheck['status'] = 'pass'
  if (fields.length > 0 && unlabeled > 0) labelStatus = unlabeled / fields.length >= 0.34 ? 'fail' : 'warn'
  sub(map, 'labels', labelStatus, fill(copy.sub.labels[labelStatus], { n: unlabeled, m: fields.length }))

  const hasLang = /<html\b[^>]*\blang\s*=\s*("[^"]+"|'[^']+'|[^\s>]+)/i.test(page.html)
  sub(map, 'lang', hasLang ? 'pass' : 'fail', copy.sub.lang[hasLang ? 'pass' : 'fail'])

  const score = scoreFrom({ alt: 40, labels: 35, lang: 25 }, map)
  return { key: 'accessibility', score, verdict: verdictFor(score), sub: [...map.values()] }
}

// ---------------------------------------------------------------------------
// Fixes and service recommendations
// ---------------------------------------------------------------------------

const FIX_PRIORITY: Record<string, number> = {
  https: 95,
  trackers: 92,
  emailForm: 85,
  phone: 80,
  speed: 78,
  jsonld: 72,
  sitemap: 70,
  title: 68,
  description: 66,
  h1: 60,
  privacy: 58,
  anpc: 55,
  sal: 50,
  maps: 48,
  cookieBanner: 45,
  company: 42,
  address: 40,
  whatsapp: 36,
  hours: 34,
  robots: 30,
  alt: 28,
  labels: 26,
  lang: 20,
}

function buildFixes(locale: 'ro' | 'en', speedScore: number | null, categories: CategoryResult[]): FixSuggestion[] {
  const copy = checkerCopy[locale]
  const candidates: Array<{ id: string; priority: number; values: Record<string, string | number> }> = []

  if (speedScore !== null && speedScore < 80) {
    candidates.push({ id: 'speed', priority: speedScore < 50 ? 90 : FIX_PRIORITY.speed, values: { n: speedScore } })
  }

  for (const category of categories) {
    for (const entry of category.sub) {
      if (entry.status !== 'fail' && entry.status !== 'warn') continue
      if (entry.id === 'alt' || entry.id === 'labels') {
        const detail = entry.label.match(/\d+/g)
        candidates.push({
          id: entry.id,
          priority: FIX_PRIORITY[entry.id] ?? 10,
          values: { n: detail?.[0] ?? 0, m: detail?.[1] ?? 0 },
        })
        continue
      }
      if (entry.id === 'h1') {
        const n = entry.label.match(/\d+/)?.[0] ?? '0'
        candidates.push({ id: 'h1', priority: FIX_PRIORITY.h1, values: { n } })
        continue
      }
      const priority = FIX_PRIORITY[entry.id]
      if (priority === undefined) continue
      // A warning counts at slightly lower priority than a failure.
      candidates.push({ id: entry.id, priority: entry.status === 'warn' ? priority - 5 : priority, values: {} })
    }
  }

  return candidates
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5)
    .map(({ id, values }) => {
      const template = copy.fixes[id]
      return {
        id,
        title: fill(template.title, values),
        what: fill(template.what, values),
        why: fill(template.why, values),
        who: template.who,
      }
    })
}

function recommendedSlugs(categories: CategoryResult[]): string[] {
  const slugs: string[] = []
  const byKey = new Map(categories.map((category) => [category.key, category]))
  const legal = byKey.get('legal')
  if (legal?.verdict === 'poor') slugs.push('conformitate-legala-site')
  // A single failed legal sub-check (missing ANPC link, no cookie banner…) is
  // already worth the legal-compliance service, even if the category averages "good".
  if (legal?.sub.some((entry) => entry.status === 'fail')) slugs.push('conformitate-legala-site')
  if (legal?.sub.some((entry) => entry.id === 'trackers' && entry.status === 'fail')) slugs.push('audit-securitate-gdpr')
  const speed = byKey.get('speed')
  if (speed?.verdict === 'poor') slugs.push('refacere-site')
  const contact = byKey.get('contact')
  if (contact?.verdict === 'poor') slugs.push('site-de-prezentare')
  const google = byKey.get('google')
  if (google?.verdict === 'poor') slugs.push('seo-local')
  if (google?.sub.some((entry) => entry.id === 'maps' && entry.status === 'fail')) slugs.push('seo-local')
  return [...new Set(slugs)]
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export class SiteUnreachableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SiteUnreachableError'
  }
}

/**
 * Runs all five checks against one URL. `deadline` is the absolute timestamp
 * by which everything must finish; single checks that miss it come back as
 * "unverified" instead of failing the whole report.
 */
export async function runChecks(url: string, locale: 'ro' | 'en', deadline: number): Promise<SiteReport> {
  const pageTimeout = Math.min(Math.max(deadline - Date.now(), 3000), 14_000)

  // Speed and the page fetch run in parallel: PageSpeed is the slow one.
  const [pageResult, speedResult] = await Promise.allSettled([
    fetchChecked(url, { timeoutMs: pageTimeout }),
    speedCheck(url, locale, deadline),
  ])

  if (pageResult.status === 'rejected') {
    const error = pageResult.reason
    if (error instanceof FetchBlockedError) throw new SiteUnreachableError(error.message)
    throw new SiteUnreachableError(error instanceof Error ? error.message : 'fetch failed')
  }

  const page: PageFacts = {
    finalUrl: pageResult.value.finalUrl,
    startedInsecure: pageResult.value.startedInsecure,
    html: pageResult.value.html,
    cookies: pageResult.value.cookies,
    truncated: pageResult.value.truncated,
  }

  // robots.txt and sitemap.xml are checked against the final origin.
  const origin = new URL(page.finalUrl).origin
  const supportTimeout = Math.max(2000, Math.min(deadline - Date.now(), 8000))
  const [robotsResult, sitemapResult] = await Promise.allSettled([
    fetchSmallFile(`${origin}/robots.txt`, supportTimeout),
    fetchSmallFile(`${origin}/sitemap.xml`, supportTimeout),
  ])

  const robotsStatus = robotsResult.status === 'fulfilled' ? robotsResult.value.status : null
  const sitemapOk =
    sitemapResult.status === 'fulfilled'
      ? sitemapResult.value.status >= 200 && sitemapResult.value.status < 300 && /<(urlset|sitemapindex)/i.test(sitemapResult.value.html)
      : null

  const [google, legal, contact, accessibility] = await Promise.all([
    googleCheck(page, locale, robotsStatus, sitemapOk),
    Promise.resolve(legalCheck(page, locale)),
    Promise.resolve(contactCheck(page, locale)),
    Promise.resolve(accessibilityCheck(page, locale)),
  ])

  const categories: CategoryResult[] = [speedResult.status === 'fulfilled' ? speedResult.value : { key: 'speed', score: null, verdict: 'unverified', sub: [] }, legal, google, contact, accessibility]

  const scored = categories.filter((category): category is CategoryResult & { score: number } => category.score !== null)
  const overall = scored.length ? Math.round(scored.reduce((sum, category) => sum + category.score, 0) / scored.length) : null

  return {
    url,
    finalUrl: page.finalUrl,
    checkedAt: new Date().toISOString(),
    overall,
    categories,
    fixes: buildFixes(locale, speedResult.status === 'fulfilled' ? speedResult.value.score : null, categories),
    recommendedSlugs: recommendedSlugs(categories),
  }
}

/** Category order helper for rendering. */
export function sortCategories(categories: CategoryResult[]): CategoryResult[] {
  const order: CategoryKey[] = ['speed', 'legal', 'google', 'contact', 'accessibility']
  return [...categories].sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))
}

import { CHECKER_USER_AGENT, fetchChecked, fetchSmallFile } from './fetch-page'
import {
  attr,
  CONSENT_MARKERS,
  CONSENT_TEXT_MARKERS,
  fetchPsi,
  hrefs,
  jsonLdTypes,
  psiOpportunities,
  tags,
  TRACKER_PATTERNS,
  visibleText,
} from './checks'
import type { DetailFacts, PsiSide } from './types'

/**
 * Raw measured facts for the PDF report. The screen shows a summary; the PDF
 * re-fetches the page once and records every value it reports, plus a
 * PageSpeed desktop run (mobile is reused from the on-screen check).
 */

const MAX_LISTED = 15

function snippet(text: string, match: RegExpExecArray | null): string | null {
  if (!match) return null
  const start = Math.max(0, match.index - 40)
  const end = Math.min(text.length, match.index + match[0].length + 60)
  return text.slice(start, end).replace(/\s+/g, ' ').trim()
}

function fileNameFromSrc(src: string): string {
  try {
    const url = new URL(src, 'https://example.invalid')
    const parts = url.pathname.split('/').filter(Boolean)
    return parts[parts.length - 1] ?? src
  } catch {
    return src.slice(0, 80)
  }
}

function domainFromUrl(value: string): string | null {
  try {
    return new URL(value, 'https://example.invalid').hostname
  } catch {
    return null
  }
}

function cookieName(cookie: string): string {
  return cookie.split('=')[0]?.trim() ?? cookie
}

function cookieDomain(cookie: string): string | null {
  const domain = cookie.match(/domain\s*=\s*([^;]+)/i)?.[1]?.trim()
  return domain ? domain.replace(/^\./, '') : null
}

async function psiSide(url: string, strategy: 'mobile' | 'desktop', timeoutMs: number): Promise<PsiSide | null> {
  const data = await fetchPsi(url, strategy, timeoutMs)
  const score01 = data?.lighthouseResult?.categories?.performance?.score
  if (!data || typeof score01 !== 'number') return null
  return {
    ok: true,
    performance: Math.round(score01 * 100),
    metrics: {
      performance: Math.round(score01 * 100),
      ...(data.lighthouseResult?.audits?.['first-contentful-paint']?.displayValue
        ? { fcp: data.lighthouseResult.audits['first-contentful-paint'].displayValue }
        : {}),
      ...(data.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue
        ? { lcp: data.lighthouseResult.audits['largest-contentful-paint'].displayValue }
        : {}),
      ...(data.lighthouseResult?.audits?.['total-blocking-time']?.displayValue
        ? { tbt: data.lighthouseResult.audits['total-blocking-time'].displayValue }
        : {}),
      ...(data.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue
        ? { cls: data.lighthouseResult.audits['cumulative-layout-shift'].displayValue }
        : {}),
      ...(data.lighthouseResult?.audits?.['speed-index']?.displayValue
        ? { si: data.lighthouseResult.audits['speed-index'].displayValue }
        : {}),
    },
    opportunities: psiOpportunities(data),
  }
}

/**
 * Collects every raw value the PDF reports. Never throws: when a piece cannot
 * be measured it comes back as null/empty and the PDF prints "nu am putut
 * verifica". `pageTimeoutMs` bounds the page fetch; `psiTimeoutMs` bounds the
 * desktop PageSpeed run.
 */
export async function collectDetail(url: string, psiTimeoutMs: number, pageTimeoutMs: number): Promise<DetailFacts> {
  const [pageResult, desktop] = await Promise.allSettled([
    fetchChecked(url, { timeoutMs: pageTimeoutMs }),
    psiSide(url, 'desktop', psiTimeoutMs),
  ])

  const facts: DetailFacts = {
    redirects: [],
    serverResponseMs: null,
    htmlBytes: 0,
    scriptCount: 0,
    stylesheetCount: 0,
    compression: 'unknown',
    finalUrl: url,
    userAgent: CHECKER_USER_AGENT,
    title: '',
    description: '',
    h1s: [],
    lang: '',
    jsonLdTypes: [],
    mapsLink: null,
    anpcLink: null,
    salLink: null,
    companyMatch: null,
    privacyLink: null,
    cookieBanner: 'none',
    trackers: [],
    trackerScripts: [],
    cookies: [],
    imagesTotal: 0,
    imagesWithoutAlt: [],
    fieldsTotal: 0,
    fieldsWithoutLabel: [],
    phone: null,
    whatsapp: null,
    email: null,
    hasForm: false,
    addressText: null,
    hoursText: null,
    robotsUrl: '',
    robotsOk: null,
    sitemapUrl: '',
    sitemapOk: null,
    desktop: desktop.status === 'fulfilled' ? desktop.value : null,
  }

  if (pageResult.status === 'rejected') return facts
  const page = pageResult.value
  const html = page.html
  const text = visibleText(html)
  const links = hrefs(html)

  facts.redirects = page.redirects
  facts.serverResponseMs = page.serverResponseMs
  facts.htmlBytes = Buffer.byteLength(html, 'utf8')
  facts.scriptCount = tags(html, /<script\b[^>]*>/gi).length
  facts.stylesheetCount = tags(html, /<link\b[^>]*rel\s*=\s*["']?stylesheet/gi).length + tags(html, /<style\b/gi).length
  facts.compression = page.contentEncoding === 'br' ? 'br' : page.contentEncoding === 'gzip' ? 'gzip' : page.contentEncoding ? 'unknown' : 'none'
  facts.finalUrl = page.finalUrl

  facts.title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim().replace(/\s+/g, ' ') ?? ''
  const descriptionTag = html.match(/<meta[^>]*name\s*=\s*["']description["'][^>]*>/i)
  facts.description = descriptionTag ? (attr(descriptionTag[0], 'content') ?? '').trim().replace(/\s+/g, ' ') : ''
  facts.h1s = tags(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)
    .map((h1) => h1.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, 5)
  facts.lang = attr(tags(html, /<html\b[^>]*>/gi)[0] ?? '', 'lang') ?? ''

  facts.jsonLdTypes = [...new Set(jsonLdTypes(html))].slice(0, 10)

  const mapsLink = links.find((link) =>
    /(?:maps\.google|google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl|g\.page|business\.site|google\.com\/business)/i.test(link),
  )
  facts.mapsLink = mapsLink ? mapsLink.slice(0, 300) : null
  const anpcLink = links.find((link) => /anpc\.ro/i.test(link))
  facts.anpcLink = anpcLink ? anpcLink.slice(0, 300) : null
  const salLink = links.find((link) => /reclamatiisal\.anpc\.ro|ec\.europa\.eu\/consumers\/odr/i.test(link))
  facts.salLink = salLink ? salLink.slice(0, 300) : null
  const privacyLink = links.find((link) => /confidentialitate|privacy|politica.*confidential|gdpr|date.*personale|data.*protection/i.test(link))
  facts.privacyLink = privacyLink ? privacyLink.slice(0, 300) : null

  const companyMatch =
    /\bC\.?U\.?I\.?\.?\s*[:\-–]?\s*\d{2,10}\b/i.exec(text) ??
    /\bC\.?I\.?F\.?\.?\s*[:\-–]?\s*\d{2,10}\b/i.exec(text) ??
    /\bRO\s?\d{6,10}\b/.exec(text) ??
    /\bJ\d{2}\/\d{1,5}\/\d{1,6}\b/.exec(text)
  facts.companyMatch = snippet(text, companyMatch)

  const bannerStrong = /cookiebot|cookieyes|complianz|cookielawinfo|onetrust|borlabs|moove_gdpr|iubenda|termly|klaro|usercentrics|cookie-consent|cookieconsent/i.test(html)
  const bannerHint = CONSENT_MARKERS.test(html) || CONSENT_TEXT_MARKERS.test(html)
  facts.cookieBanner = bannerStrong ? 'strong' : bannerHint ? 'hint' : 'none'

  for (const [name, pattern] of TRACKER_PATTERNS) {
    if (pattern.test(html)) facts.trackers.push(name)
  }
  for (const script of tags(html, /<script\b[^>]*>/gi)) {
    const src = attr(script, 'src')
    if (!src) continue
    if (TRACKER_PATTERNS.some(([, pattern]) => pattern.test(src))) {
      const domain = domainFromUrl(src)
      facts.trackerScripts.push(domain ? `${domain}` : src.slice(0, 80))
    }
  }
  facts.trackerScripts = [...new Set(facts.trackerScripts)].slice(0, 10)
  facts.cookies = page.cookies
    .map((cookie) => {
      const domain = cookieDomain(cookie)
      return domain ? `${cookieName(cookie)} (${domain})` : cookieName(cookie)
    })
    .slice(0, 15)

  const images = tags(html, /<img\b[^>]*>/gi)
  facts.imagesTotal = images.length
  facts.imagesWithoutAlt = images
    .filter((image) => attr(image, 'alt') === null)
    .map((image) => fileNameFromSrc(attr(image, 'src') ?? ''))
    .filter(Boolean)
    .slice(0, MAX_LISTED)

  const labelForIds = new Set<string>()
  for (const label of tags(html, /<label\b[^>]*>/gi)) {
    const forId = attr(label, 'for')
    if (forId) labelForIds.add(forId)
  }
  const fields = tags(html, /<(input|textarea|select)\b[^>]*>/gi).filter((field) => {
    const type = (attr(field, 'type') ?? 'text').toLowerCase()
    return type !== 'hidden' && type !== 'submit' && type !== 'button' && type !== 'reset' && type !== 'image'
  })
  facts.fieldsTotal = fields.length
  facts.fieldsWithoutLabel = fields
    .filter((field) => {
      if (attr(field, 'aria-label') !== null || attr(field, 'aria-labelledby') !== null || attr(field, 'title') !== null) return false
      const id = attr(field, 'id')
      return !(id && labelForIds.has(id))
    })
    .map((field) => attr(field, 'name') ?? attr(field, 'id') ?? attr(field, 'type') ?? 'necunoscut')
    .slice(0, MAX_LISTED)

  const phoneLink = links.find((link) => /^tel:/i.test(link.trim()))
  facts.phone = phoneLink ? phoneLink.trim().replace(/^tel:/i, '') : null
  const whatsappLink = links.find((link) => /wa\.me|api\.whatsapp\.com|whatsapp:\/\//i.test(link))
  facts.whatsapp = whatsappLink ? whatsappLink.slice(0, 200) : null
  const mailto = links.find((link) => /^mailto:/i.test(link.trim()))
  facts.email = mailto ? mailto.trim().replace(/^mailto:/i, '').split('?')[0] ?? null : null
  facts.hasForm = /<form\b/i.test(html)

  facts.addressText = snippet(
    text,
    /\b(str\.?\s|strada\s|bd\.?\s|bulevardul\s|b-dul\s|calea\s|pia[țt]a\s|splaiul?\s|șoseaua\s|sos\.\s)[^,.;]{0,60}/i.exec(text),
  )
  facts.hoursText = snippet(text, /\b(program(?:ul)?(?: de (?:funcționare|lucru))?)\b[^.]{0,80}/i.exec(text))

  const origin = new URL(page.finalUrl).origin
  facts.robotsUrl = `${origin}/robots.txt`
  facts.sitemapUrl = `${origin}/sitemap.xml`
  const supportTimeout = Math.max(2000, Math.min(pageTimeoutMs, 8000))
  const [robots, sitemap] = await Promise.allSettled([
    fetchSmallFile(facts.robotsUrl, supportTimeout),
    fetchSmallFile(facts.sitemapUrl, supportTimeout),
  ])
  facts.robotsOk = robots.status === 'fulfilled' ? robots.value.status >= 200 && robots.value.status < 300 : null
  facts.sitemapOk =
    sitemap.status === 'fulfilled'
      ? sitemap.value.status >= 200 && sitemap.value.status < 300 && /<(urlset|sitemapindex)/i.test(sitemap.value.html)
      : null

  return facts
}

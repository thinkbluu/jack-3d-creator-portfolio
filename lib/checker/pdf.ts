import { readFile } from 'node:fs/promises'
import path from 'node:path'

import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, PDFFont, PDFPage, rgb, type RGB } from 'pdf-lib'

import { checkerCopy, fill, type CheckerCopy, type PdfCopy } from './copy'
import { sortCategories } from './checks'
import type { CategoryResult, DetailFacts, PsiSide, SiteReport, SubCheck } from './types'

/**
 * Server-side PDF report with MAST Studio branding. The screen shows a
 * summary; this PDF is the detailed audit: every check with its measured
 * value, a full work plan, the study benchmarks, a checklist and a glossary.
 * Noto Sans is embedded so Romanian diacritics (ș ț ă î â) render correctly.
 */

const INK = rgb(0.102, 0.09, 0.078)
const SHELL = rgb(0.98, 0.968, 0.949)
const BRASS = rgb(0.639, 0.51, 0.227)
const GREY = rgb(0.42, 0.4, 0.38)
const GOOD = rgb(0.18, 0.49, 0.31)
const FAIR = rgb(0.69, 0.48, 0.12)
const POOR = rgb(0.7, 0.23, 0.18)
const UNVERIFIED = rgb(0.45, 0.44, 0.42)
const RULE = rgb(0.85, 0.82, 0.76)

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 48
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2
/** Space reserved at the bottom of every page for the footer line. */
const FOOTER_SPACE = 34
const CONTENT_BOTTOM = MARGIN + FOOTER_SPACE

const verdictColor: Record<string, RGB> = { good: GOOD, fair: FAIR, poor: POOR, unverified: UNVERIFIED }
const statusColor: Record<SubCheck['status'], RGB> = { pass: GOOD, warn: FAIR, fail: POOR, error: UNVERIFIED }

export type PdfService = { name: string; priceLabel: string }

/** The embedded font may lack a few decorative glyphs used on the site. */
function sanitize(text: string) {
  return text.replace(/→/g, '->').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = []
  for (const paragraph of sanitize(text).split('\n')) {
    const words = paragraph.split(/\s+/).filter(Boolean)
    let line = ''
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        line = candidate
        continue
      }
      if (line) lines.push(line)
      // A single word longer than the line (long URLs) is broken, not overflowed.
      let rest = word
      while (font.widthOfTextAtSize(rest, size) > maxWidth) {
        let cut = rest.length
        while (cut > 1 && font.widthOfTextAtSize(rest.slice(0, cut), size) > maxWidth) cut -= 1
        lines.push(rest.slice(0, cut))
        rest = rest.slice(cut)
      }
      line = rest
    }
    if (line) lines.push(line)
    if (words.length === 0) lines.push('')
  }
  return lines
}

type Fonts = { regular: PDFFont; bold: PDFFont }
type Cursor = { pdf: PDFDocument; page: PDFPage; y: number }

async function loadFonts(pdf: PDFDocument) {
  pdf.registerFontkit(fontkit)
  const fontsDir = path.join(process.cwd(), 'public', 'fonts')
  const [regular, bold] = await Promise.all([readFile(path.join(fontsDir, 'NotoSans-Regular.ttf')), readFile(path.join(fontsDir, 'NotoSans-Bold.ttf'))])
  return { regular: await pdf.embedFont(regular, { subset: true }), bold: await pdf.embedFont(bold, { subset: true }) }
}

function newPage(pdf: PDFDocument): PDFPage {
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  page.drawRectangle({ x: 0, y: 0, width: PAGE_WIDTH, height: PAGE_HEIGHT, color: SHELL })
  return page
}

function drawHeader(page: PDFPage, fonts: Fonts) {
  page.drawRectangle({ x: MARGIN, y: PAGE_HEIGHT - 58, width: 14, height: 14, color: BRASS })
  page.drawText('MAST Studio', { x: MARGIN + 22, y: PAGE_HEIGHT - 54, size: 13, font: fonts.bold, color: INK })
  page.drawText('maststudio.ro', { x: PAGE_WIDTH - MARGIN - fonts.regular.widthOfTextAtSize('maststudio.ro', 10), y: PAGE_HEIGHT - 54, size: 10, font: fonts.regular, color: GREY })
  page.drawLine({ start: { x: MARGIN, y: PAGE_HEIGHT - 70 }, end: { x: PAGE_WIDTH - MARGIN, y: PAGE_HEIGHT - 70 }, thickness: 0.7, color: RULE })
}

/** Moves to a fresh page when `needed` points would not fit above the footer. */
function ensureSpace(cursor: Cursor, needed: number) {
  if (cursor.y - needed < CONTENT_BOTTOM) {
    cursor.page = newPage(cursor.pdf)
    cursor.y = PAGE_HEIGHT - MARGIN
  }
}

function drawParagraph(cursor: Cursor, text: string, options: { font: PDFFont; size: number; color: RGB; maxWidth?: number; lineHeight?: number; indent?: number }) {
  const maxWidth = options.maxWidth ?? CONTENT_WIDTH
  const lineHeight = options.lineHeight ?? options.size * 1.45
  const x = MARGIN + (options.indent ?? 0)
  const lines = wrapText(text, options.font, options.size, maxWidth)
  ensureSpace(cursor, lines.length * lineHeight)
  for (const line of lines) {
    cursor.page.drawText(line, { x, y: cursor.y, size: options.size, font: options.font, color: options.color })
    cursor.y -= lineHeight
  }
}

function drawSectionTitle(cursor: Cursor, fonts: Fonts, title: string) {
  ensureSpace(cursor, 46)
  cursor.y -= 10
  cursor.page.drawText(title, { x: MARGIN, y: cursor.y, size: 15, font: fonts.bold, color: INK })
  cursor.y -= 8
  cursor.page.drawLine({ start: { x: MARGIN, y: cursor.y }, end: { x: PAGE_WIDTH - MARGIN, y: cursor.y }, thickness: 1.1, color: BRASS })
  cursor.y -= 16
}

/** Label in bold followed by the wrapped value on the same line. */
function drawField(cursor: Cursor, fonts: Fonts, label: string, value: string, options: { indent?: number; valueColor?: RGB; size?: number } = {}) {
  const size = options.size ?? 9.5
  const indent = options.indent ?? 0
  const labelWidth = fonts.bold.widthOfTextAtSize(`${label}: `, size)
  const firstMax = CONTENT_WIDTH - indent - labelWidth
  // First line shares the row with the label, the rest hang aligned.
  const lines: string[] = []
  let carry = ''
  for (const word of sanitize(value).split(/\s+/).filter(Boolean)) {
    const candidate = carry ? `${carry} ${word}` : word
    if (fonts.regular.widthOfTextAtSize(candidate, size) <= firstMax) {
      carry = candidate
      continue
    }
    if (carry) lines.push(carry)
    // A single word longer than the line (long URLs) is broken, not overflowed.
    let rest = word
    while (fonts.regular.widthOfTextAtSize(rest, size) > firstMax) {
      let cut = rest.length
      while (cut > 1 && fonts.regular.widthOfTextAtSize(rest.slice(0, cut), size) > firstMax) cut -= 1
      lines.push(rest.slice(0, cut))
      rest = rest.slice(cut)
    }
    carry = rest
  }
  if (carry) lines.push(carry)

  ensureSpace(cursor, lines.length * size * 1.45)
  lines.forEach((line, index) => {
    if (index === 0) {
      cursor.page.drawText(`${label}: `, { x: MARGIN + indent, y: cursor.y, size, font: fonts.bold, color: INK })
      cursor.page.drawText(line, { x: MARGIN + indent + labelWidth, y: cursor.y, size, font: fonts.regular, color: options.valueColor ?? INK })
    } else {
      cursor.page.drawText(line, { x: MARGIN + indent, y: cursor.y, size, font: fonts.regular, color: options.valueColor ?? INK })
    }
    cursor.y -= size * 1.45
  })
  cursor.y -= 3
}

/** Draws a pass/warn/fail mark: a vector check for pass, a dot otherwise. */
function drawStatusMark(cursor: Cursor, status: SubCheck['status'], x: number) {
  const color = statusColor[status]
  const y = cursor.y + 3
  if (status === 'pass') {
    cursor.page.drawLine({ start: { x, y: y - 1 }, end: { x: x + 2.4, y: y - 3.4 }, thickness: 1.4, color })
    cursor.page.drawLine({ start: { x: x + 2.4, y: y - 3.4 }, end: { x: x + 6.4, y: y + 1.6 }, thickness: 1.4, color })
  } else {
    cursor.page.drawCircle({ x: x + 2.5, y: y - 1, size: 2.5, color })
  }
}

function drawSubCheck(cursor: Cursor, fonts: Fonts, entry: SubCheck, unverifiedLabel: string) {
  const label = entry.status === 'error' ? unverifiedLabel : entry.label
  const size = 9.5
  const lines = wrapText(label, fonts.regular, size, CONTENT_WIDTH - 26)
  ensureSpace(cursor, lines.length * 13 + 2)
  drawStatusMark(cursor, entry.status, MARGIN + 6)
  lines.forEach((line, index) => {
    cursor.page.drawText(line, { x: MARGIN + 18, y: cursor.y - index * 13, size, font: fonts.regular, color: entry.status === 'error' ? UNVERIFIED : INK })
  })
  cursor.y -= lines.length * 13 + 2
}

/** Extracts the {n}/{m} values a fix template needs from a sub-check label. */
function fixValues(entry: SubCheck, category: CategoryResult): Record<string, string | number> {
  if (category.key === 'speed') return { n: category.score ?? 0 }
  const digits = entry.label.match(/\d+/g)
  if (entry.id === 'alt' || entry.id === 'labels') return { n: digits?.[0] ?? 0, m: digits?.[1] ?? 0 }
  if (entry.id === 'h1') return { n: digits?.[0] ?? '0' }
  return {}
}

type PlanItem = { id: string; entry: SubCheck; category: CategoryResult }

function planBucket(copy: PdfCopy, id: string): 'week' | 'month' | 'later' {
  const plan = copy.plan[id]
  if (!plan) return 'later'
  if (plan.impact === 'high' && plan.effort === 'under1h') return 'week'
  if (plan.impact === 'high' || (plan.impact === 'medium' && plan.effort === 'under1h')) return 'month'
  return 'later'
}

/** Parses a PageSpeed display value ("2,3 s", "340 ms", "0.25") for verdict colouring. */
function metricVerdict(value: string | undefined, metric: 'fcp' | 'lcp' | 'tbt' | 'cls' | 'si'): 'good' | 'fair' | 'poor' | null {
  if (!value) return null
  const normalized = value.replace(',', '.').toLowerCase()
  const number = Number.parseFloat(normalized.replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(number)) return null
  const inMs = normalized.includes('ms')
  const inSeconds = normalized.includes('s') && !inMs
  const ms = metric === 'cls' ? number : inMs ? number : inSeconds ? number * 1000 : number
  const good = { fcp: 1800, lcp: 2500, tbt: 200, cls: 0.1, si: 3400 }[metric]
  const poor = { fcp: 3000, lcp: 4000, tbt: 600, cls: 0.25, si: 5800 }[metric]
  const valueForCompare = metric === 'cls' ? number : ms
  if (valueForCompare <= good) return 'good'
  if (valueForCompare > poor) return 'poor'
  return 'fair'
}

function drawPsiTable(cursor: Cursor, fonts: Fonts, copy: PdfCopy, side: PsiSide, deviceLabel: string) {
  ensureSpace(cursor, 60)
  cursor.page.drawText(deviceLabel, { x: MARGIN + 14, y: cursor.y, size: 11, font: fonts.bold, color: INK })
  const perf = side.performance
  const perfColor = perf === null ? UNVERIFIED : perf >= 90 ? GOOD : perf >= 50 ? FAIR : POOR
  cursor.page.drawText(perf === null ? copy.psiFailed : `${perf}/100`, { x: MARGIN + 120, y: cursor.y, size: 11, font: fonts.bold, color: perfColor })
  cursor.y -= 16

  const metrics: Array<['fcp' | 'lcp' | 'tbt' | 'cls' | 'si', string | undefined]> = [
    ['fcp', side.metrics.fcp],
    ['lcp', side.metrics.lcp],
    ['tbt', side.metrics.tbt],
    ['cls', side.metrics.cls],
    ['si', side.metrics.si],
  ]
  for (const [key, value] of metrics) {
    const verdict = metricVerdict(value, key)
    const color = verdict ? verdictColor[verdict] : INK
    const scale = copy.metricScale[key]
    ensureSpace(cursor, 30)
    const labelX = MARGIN + 20
    const valueX = labelX + fonts.bold.widthOfTextAtSize(copy.metricLabels[key], 9.5) + 10
    cursor.page.drawText(copy.metricLabels[key], { x: labelX, y: cursor.y, size: 9.5, font: fonts.bold, color: INK })
    cursor.page.drawText(value ?? copy.psiFailed, { x: valueX, y: cursor.y, size: 9.5, font: fonts.bold, color })
    cursor.y -= 12
    drawParagraph(cursor, `${copy.metricExplanations[key]} ${copy.scaleWords.thresholds}: ${scale.good} (${copy.scaleWords.good}), ${scale.poor} (${copy.scaleWords.poor}).`, { font: fonts.regular, size: 8.5, color: GREY, indent: 20 })
    cursor.y -= 2
  }
}

function drawPsiSide(cursor: Cursor, fonts: Fonts, copy: PdfCopy, side: PsiSide | null, deviceLabel: string) {
  ensureSpace(cursor, 40)
  if (!side || !side.ok) {
    cursor.page.drawText(`${deviceLabel}: ${copy.psiFailed}.`, { x: MARGIN + 14, y: cursor.y, size: 10, font: fonts.regular, color: UNVERIFIED })
    cursor.y -= 18
    return
  }
  drawPsiTable(cursor, fonts, copy, side, deviceLabel)
  if (side.opportunities.length > 0 && deviceLabel === copy.deviceMobile) {
    cursor.y -= 4
    drawParagraph(cursor, copy.opportunitiesTitle, { font: fonts.bold, size: 10.5, color: INK, indent: 14 })
    side.opportunities.forEach((opportunity, index) => {
      const template = copy.opportunities[opportunity.id]
      const text = template ?? fill(copy.opportunityFallback, { title: opportunity.title })
      const savings = opportunity.displayValue ? ` (${opportunity.displayValue})` : ''
      drawParagraph(cursor, `${index + 1}. ${text}${savings}`, { font: fonts.regular, size: 9.5, color: INK, indent: 20 })
    })
  }
}

function drawDetailRows(cursor: Cursor, fonts: Fonts, copy: CheckerCopy, facts: DetailFacts) {
  const pdf = copy.pdf
  const notFound = pdf.detailNotFound

  // --- Legal detail ---
  drawSectionTitle(cursor, fonts, copy.categories.legal.name)
  drawField(cursor, fonts, 'HTTPS', facts.finalUrl.startsWith('https://') ? facts.finalUrl : `${facts.finalUrl} (${copy.verdicts.poor.toLowerCase()})`)
  if (facts.redirects.length === 0) {
    drawParagraph(cursor, pdf.detailNoRedirects, { font: fonts.regular, size: 9.5, color: INK, indent: 14 })
    cursor.y -= 3
  } else {
    drawParagraph(cursor, pdf.detailRedirects, { font: fonts.bold, size: 9.5, color: INK, indent: 14 })
    for (const hop of facts.redirects) {
      drawParagraph(cursor, fill(pdf.detailRedirectHop, { from: hop.from, to: hop.to, status: hop.status }), { font: fonts.regular, size: 9, color: GREY, indent: 24 })
    }
    cursor.y -= 3
  }
  drawField(cursor, fonts, 'ANPC', facts.anpcLink ? fill(pdf.detailLinkFound, { url: facts.anpcLink }) : notFound, { valueColor: facts.anpcLink ? GOOD : POOR })
  drawField(cursor, fonts, 'SAL', facts.salLink ? fill(pdf.detailLinkFound, { url: facts.salLink }) : notFound, { valueColor: facts.salLink ? GOOD : POOR })
  drawField(cursor, fonts, 'CUI/CIF', facts.companyMatch ? fill(pdf.detailCompanyFound, { text: facts.companyMatch }) : notFound, { valueColor: facts.companyMatch ? GOOD : POOR })
  drawField(cursor, fonts, copy.categories.legal.name + ' / privacy', facts.privacyLink ? fill(pdf.detailLinkFound, { url: facts.privacyLink }) : notFound, { valueColor: facts.privacyLink ? GOOD : POOR })
  drawParagraph(cursor, pdf.detailCookieBanner[facts.cookieBanner], { font: fonts.regular, size: 9.5, color: facts.cookieBanner === 'none' ? POOR : INK, indent: 14 })
  cursor.y -= 3
  drawParagraph(cursor, facts.trackers.length ? fill(pdf.detailTrackersFound, { list: facts.trackers.join(', ') }) : pdf.detailTrackersNone, {
    font: fonts.regular,
    size: 9.5,
    color: facts.trackers.length ? POOR : GOOD,
    indent: 14,
  })
  for (const script of facts.trackerScripts) {
    drawParagraph(cursor, script, { font: fonts.regular, size: 8.5, color: GREY, indent: 24 })
  }
  cursor.y -= 3
  drawParagraph(cursor, pdf.detailCookiesTitle, { font: fonts.bold, size: 9.5, color: INK, indent: 14 })
  if (facts.cookies.length === 0) {
    drawParagraph(cursor, pdf.detailCookiesNone, { font: fonts.regular, size: 9.5, color: GOOD, indent: 24 })
  } else {
    for (const cookie of facts.cookies) {
      drawParagraph(cursor, cookie, { font: fonts.regular, size: 9, color: INK, indent: 24 })
    }
  }
  drawParagraph(cursor, pdf.detailCookiesNote, { font: fonts.regular, size: 8.5, color: GREY, indent: 24 })
  cursor.y -= 6

  // --- Google detail ---
  drawSectionTitle(cursor, fonts, copy.categories.google.name)
  drawField(cursor, fonts, pdf.detailTitleRow, facts.title ? `${facts.title} (${facts.title.length} ${pdf.detailChars})` : notFound)
  drawField(cursor, fonts, pdf.detailDescriptionRow, facts.description ? `${facts.description} (${facts.description.length} ${pdf.detailChars})` : notFound)
  if (facts.h1s.length === 0) {
    drawParagraph(cursor, pdf.detailH1None, { font: fonts.regular, size: 9.5, color: POOR, indent: 14 })
  } else {
    drawParagraph(cursor, fill(pdf.detailH1Text, { n: facts.h1s.length }), { font: fonts.bold, size: 9.5, color: INK, indent: 14 })
    for (const h1 of facts.h1s) drawParagraph(cursor, h1, { font: fonts.regular, size: 9, color: INK, indent: 24 })
  }
  cursor.y -= 3
  drawField(cursor, fonts, 'robots.txt', `${facts.robotsUrl} · ${facts.robotsOk === null ? pdf.unverified : facts.robotsOk ? 'OK' : notFound}`, { valueColor: facts.robotsOk ? GOOD : facts.robotsOk === null ? UNVERIFIED : POOR })
  drawField(cursor, fonts, 'sitemap.xml', `${facts.sitemapUrl} · ${facts.sitemapOk === null ? pdf.unverified : facts.sitemapOk ? 'OK' : notFound}`, { valueColor: facts.sitemapOk ? GOOD : facts.sitemapOk === null ? UNVERIFIED : POOR })
  drawParagraph(cursor, facts.jsonLdTypes.length ? fill(pdf.detailJsonLd, { list: facts.jsonLdTypes.join(', ') }) : pdf.detailJsonLdNone, {
    font: fonts.regular,
    size: 9.5,
    color: facts.jsonLdTypes.length ? INK : POOR,
    indent: 14,
  })
  cursor.y -= 3
  drawField(cursor, fonts, 'Google Maps / Business', facts.mapsLink ? fill(pdf.detailLinkFound, { url: facts.mapsLink }) : notFound, { valueColor: facts.mapsLink ? GOOD : POOR })
  cursor.y -= 6

  // --- Contact detail ---
  drawSectionTitle(cursor, fonts, copy.categories.contact.name)
  drawField(cursor, fonts, pdf.detailPhone, facts.phone ?? notFound, { valueColor: facts.phone ? GOOD : POOR })
  drawField(cursor, fonts, pdf.detailWhatsapp, facts.whatsapp ?? notFound, { valueColor: facts.whatsapp ? GOOD : POOR })
  drawField(cursor, fonts, pdf.detailEmail, facts.email ?? notFound, { valueColor: facts.email ? GOOD : POOR })
  drawParagraph(cursor, facts.hasForm ? pdf.detailForm : pdf.detailFormNone, { font: fonts.regular, size: 9.5, color: facts.hasForm ? INK : POOR, indent: 14 })
  cursor.y -= 3
  drawField(cursor, fonts, pdf.detailAddress, facts.addressText ?? notFound, { valueColor: facts.addressText ? GOOD : POOR })
  drawField(cursor, fonts, pdf.detailHours, facts.hoursText ?? notFound, { valueColor: facts.hoursText ? GOOD : POOR })
  cursor.y -= 6

  // --- Accessibility detail ---
  drawSectionTitle(cursor, fonts, copy.categories.accessibility.name)
  drawField(cursor, fonts, 'lang', facts.lang ? fill(pdf.detailLang, { lang: facts.lang }) : notFound, { valueColor: facts.lang ? GOOD : POOR })
  if (facts.imagesWithoutAlt.length === 0) {
    drawParagraph(cursor, fill(pdf.detailImagesAllAlt, { m: facts.imagesTotal }), { font: fonts.regular, size: 9.5, color: GOOD, indent: 14 })
  } else {
    drawParagraph(cursor, fill(pdf.detailImagesNoAlt, { n: facts.imagesWithoutAlt.length, m: facts.imagesTotal }), { font: fonts.bold, size: 9.5, color: POOR, indent: 14 })
    for (const name of facts.imagesWithoutAlt) drawParagraph(cursor, name, { font: fonts.regular, size: 8.5, color: INK, indent: 24 })
  }
  cursor.y -= 3
  if (facts.fieldsWithoutLabel.length === 0) {
    drawParagraph(cursor, fill(pdf.detailFieldsAllLabeled, { m: facts.fieldsTotal }), { font: fonts.regular, size: 9.5, color: GOOD, indent: 14 })
  } else {
    drawParagraph(cursor, fill(pdf.detailFieldsNoLabel, { n: facts.fieldsWithoutLabel.length, m: facts.fieldsTotal }), { font: fonts.bold, size: 9.5, color: POOR, indent: 14 })
    for (const name of facts.fieldsWithoutLabel) drawParagraph(cursor, name, { font: fonts.regular, size: 8.5, color: INK, indent: 24 })
  }
  cursor.y -= 6

  // --- Technical (informational) ---
  drawSectionTitle(cursor, fonts, pdf.techTitle)
  drawParagraph(cursor, pdf.techNote, { font: fonts.regular, size: 9, color: GREY })
  cursor.y -= 4
  drawField(cursor, fonts, pdf.techLabels.serverTime, facts.serverResponseMs === null ? pdf.unverified : `${facts.serverResponseMs} ms`)
  drawField(cursor, fonts, pdf.techLabels.htmlSize, facts.htmlBytes === 0 ? pdf.unverified : `${(facts.htmlBytes / 1024).toFixed(1)} KB`)
  drawField(cursor, fonts, pdf.techLabels.scripts, `${facts.scriptCount}`)
  drawField(cursor, fonts, pdf.techLabels.stylesheets, `${facts.stylesheetCount}`)
  drawField(cursor, fonts, pdf.techLabels.compression, pdf.compressionValues[facts.compression])
  drawField(cursor, fonts, pdf.techLabels.finalUrl, facts.finalUrl)
  drawField(cursor, fonts, pdf.techLabels.userAgent, facts.userAgent)
}

/**
 * Builds the full PDF for a report. Throws only if the fonts cannot be read.
 * `facts` carries the raw measured values collected for the PDF; `services`
 * are the matching MAST Studio services for the closing section.
 */
export async function buildReportPdf(
  report: SiteReport,
  facts: DetailFacts,
  locale: 'ro' | 'en',
  options: { recheckUrl: string; services: PdfService[] },
): Promise<Uint8Array> {
  const copy = checkerCopy[locale]
  const pdf = await PDFDocument.create()
  const fonts = await loadFonts(pdf)

  pdf.setTitle(`${copy.pdf.title} – ${report.url}`)
  pdf.setAuthor('MAST Studio')
  pdf.setCreator('MAST Studio website checker')

  const dateLabel = new Intl.DateTimeFormat(locale === 'ro' ? 'ro-RO' : 'en-GB', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Bucharest' }).format(new Date(report.checkedAt))

  // ------------------------------------------------------------------ cover
  const page = newPage(pdf)
  const cursor: Cursor = { pdf, page, y: PAGE_HEIGHT - MARGIN }
  drawHeader(page, fonts)
  cursor.y = PAGE_HEIGHT - 108

  drawParagraph(cursor, copy.pdf.title, { font: fonts.bold, size: 22, color: INK })
  cursor.y -= 8
  drawParagraph(cursor, `${copy.pdf.reportFor}: ${report.url}`, { font: fonts.regular, size: 10.5, color: GREY })
  drawParagraph(cursor, `${copy.pdf.date}: ${dateLabel}`, { font: fonts.regular, size: 10.5, color: GREY })
  cursor.y -= 14

  const overallText = report.overall === null ? copy.pdf.unverified : `${report.overall}`
  cursor.page.drawText(overallText, { x: MARGIN, y: cursor.y - 34, size: 44, font: fonts.bold, color: INK })
  const overallWidth = fonts.bold.widthOfTextAtSize(overallText, 44)
  cursor.page.drawText('/ 100', { x: MARGIN + overallWidth + 8, y: cursor.y - 30, size: 14, font: fonts.regular, color: GREY })
  cursor.page.drawText(copy.pdf.overall, { x: MARGIN + overallWidth + 8, y: cursor.y - 46, size: 10, font: fonts.regular, color: GREY })
  cursor.y -= 66

  drawParagraph(cursor, copy.pdf.categories, { font: fonts.bold, size: 14, color: INK })
  cursor.y -= 6
  for (const category of sortCategories(report.categories)) {
    const meta = copy.categories[category.key]
    const scoreLabel = category.score === null ? copy.pdf.unverified : `${category.score} / 100`
    const color = verdictColor[category.verdict]
    ensureSpace(cursor, 20)
    cursor.page.drawCircle({ x: MARGIN + 4, y: cursor.y + 3, size: 3.5, color })
    cursor.page.drawText(meta.name, { x: MARGIN + 14, y: cursor.y, size: 12, font: fonts.bold, color: INK })
    const nameWidth = fonts.bold.widthOfTextAtSize(meta.name, 12)
    cursor.page.drawText(scoreLabel, { x: MARGIN + 14 + nameWidth + 10, y: cursor.y, size: 12, font: fonts.regular, color })
    cursor.y -= 17
  }
  cursor.y -= 6

  // Three-line plain summary.
  const scored = sortCategories(report.categories).filter((category): category is CategoryResult & { score: number } => category.score !== null)
  if (scored.length > 0) {
    const best = scored.reduce((a, b) => (b.score > a.score ? b : a))
    const worst = scored.reduce((a, b) => (b.score < a.score ? b : a))
    drawParagraph(cursor, fill(copy.pdf.summaryBest, { name: copy.categories[best.key].name, score: best.score }), { font: fonts.regular, size: 10.5, color: INK })
    drawParagraph(cursor, fill(copy.pdf.summaryWorst, { name: copy.categories[worst.key].name, score: worst.score }), { font: fonts.regular, size: 10.5, color: INK })
  }
  const problems = report.categories.flatMap((category) => category.sub).filter((entry) => entry.status === 'fail' || entry.status === 'warn')
  const urgent = problems.filter((entry) => entry.status === 'fail')
  drawParagraph(cursor, fill(copy.pdf.summaryProblems, { n: problems.length, urgent: urgent.length }), { font: fonts.regular, size: 10.5, color: INK })

  // ----------------------------------------------------------- how to read
  drawSectionTitle(cursor, fonts, copy.pdf.howToReadTitle)
  for (const paragraph of copy.pdf.howToRead) {
    drawParagraph(cursor, paragraph, { font: fonts.regular, size: 10, color: INK })
    cursor.y -= 4
  }
  drawParagraph(cursor, `${copy.pdf.thresholds.good}; ${copy.pdf.thresholds.fair}; ${copy.pdf.thresholds.poor}.`, { font: fonts.regular, size: 10, color: GREY })

  // ----------------------------------------------------------- work plan
  drawSectionTitle(cursor, fonts, copy.pdf.planTitle)
  drawParagraph(cursor, copy.pdf.planIntro, { font: fonts.regular, size: 10, color: GREY })
  cursor.y -= 4

  const planItems: PlanItem[] = []
  for (const category of sortCategories(report.categories)) {
    for (const entry of category.sub) {
      if (entry.status !== 'fail' && entry.status !== 'warn') continue
      const id = category.key === 'speed' ? 'speed' : entry.id
      if (!copy.pdf.plan[id]) continue
      planItems.push({ id, entry, category })
    }
  }
  const buckets: Array<{ key: 'week' | 'month' | 'later'; items: PlanItem[] }> = [
    { key: 'week', items: [] },
    { key: 'month', items: [] },
    { key: 'later', items: [] },
  ]
  for (const item of planItems) buckets.find((bucket) => bucket.key === planBucket(copy.pdf, item.id))?.items.push(item)

  for (const bucket of buckets) {
    if (bucket.items.length === 0) continue
    ensureSpace(cursor, 60)
    cursor.page.drawText(copy.pdf.buckets[bucket.key], { x: MARGIN, y: cursor.y, size: 12.5, font: fonts.bold, color: BRASS })
    cursor.y -= 18
    for (const item of bucket.items) {
      const template = copy.fixes[item.id]
      const values = fixValues(item.entry, item.category)
      const plan = copy.pdf.plan[item.id]
      const title = fill(template.title, values)
      const what = fill(template.what, values)
      const why = fill(template.why, values)
      const who = template.who
      // Keep-together: estimate the block height before drawing it.
      const stepLines = plan.steps.reduce((sum, step, index) => sum + wrapText(`${index + 1}. ${step}`, fonts.regular, 9.5, CONTENT_WIDTH - 28).length, 0)
      const blockHeight = 16 + wrapText(what, fonts.regular, 9.5, CONTENT_WIDTH - 14).length * 14 + wrapText(why, fonts.regular, 9.5, CONTENT_WIDTH - 14).length * 14 + stepLines * 14 + 44
      ensureSpace(cursor, Math.min(blockHeight, PAGE_HEIGHT - MARGIN - CONTENT_BOTTOM))
      cursor.page.drawText(title, { x: MARGIN, y: cursor.y, size: 11.5, font: fonts.bold, color: INK })
      cursor.y -= 15
      drawParagraph(cursor, `${copy.pdf.planLabels.problem}: ${what}`, { font: fonts.regular, size: 9.5, color: INK, indent: 14 })
      drawParagraph(cursor, `${copy.pdf.planLabels.why}: ${why}`, { font: fonts.regular, size: 9.5, color: GREY, indent: 14 })
      drawParagraph(cursor, `${copy.pdf.planLabels.how}:`, { font: fonts.bold, size: 9.5, color: INK, indent: 14 })
      plan.steps.forEach((step, index) => {
        drawParagraph(cursor, `${index + 1}. ${step}`, { font: fonts.regular, size: 9.5, color: INK, indent: 24 })
      })
      drawParagraph(cursor, `${copy.pdf.planLabels.who}: ${who}`, { font: fonts.regular, size: 9.5, color: GREY, indent: 14 })
      drawParagraph(cursor, `${copy.pdf.planLabels.effort}: ${copy.pdf.efforts[plan.effort]} | ${copy.pdf.planLabels.impact}: ${copy.pdf.impacts[plan.impact]}`, { font: fonts.regular, size: 9.5, color: GREY, indent: 14 })
      cursor.y -= 8
    }
    cursor.y -= 4
  }

  // ------------------------------------------------- categories with values
  drawSectionTitle(cursor, fonts, copy.pdf.categories)
  const speed = report.categories.find((category) => category.key === 'speed')
  for (const category of sortCategories(report.categories)) {
    const meta = copy.categories[category.key]
    const scoreLabel = category.score === null ? copy.pdf.unverified : `${category.score} / 100`
    ensureSpace(cursor, 80)
    cursor.page.drawText(meta.name, { x: MARGIN, y: cursor.y, size: 13, font: fonts.bold, color: INK })
    const nameWidth = fonts.bold.widthOfTextAtSize(meta.name, 13)
    cursor.page.drawText(scoreLabel, { x: MARGIN + nameWidth + 12, y: cursor.y, size: 13, font: fonts.regular, color: verdictColor[category.verdict] })
    if (meta.note) {
      cursor.page.drawText(`(${meta.note})`, { x: MARGIN + nameWidth + 12 + fonts.regular.widthOfTextAtSize(scoreLabel, 13) + 8, y: cursor.y, size: 9, font: fonts.regular, color: GREY })
    }
    cursor.y -= 20

    for (const entry of category.sub) drawSubCheck(cursor, fonts, entry, copy.pdf.unverified)

    if (category.key === 'speed') {
      cursor.y -= 4
      const mobile: PsiSide = {
        ok: category.score !== null,
        performance: category.score,
        metrics: {
          performance: category.score ?? 0,
          ...(category.metrics?.fcp ? { fcp: category.metrics.fcp } : {}),
          ...(category.metrics?.lcp ? { lcp: category.metrics.lcp } : {}),
          ...(category.metrics?.tbt ? { tbt: category.metrics.tbt } : {}),
          ...(category.metrics?.cls ? { cls: category.metrics.cls } : {}),
          ...(category.metrics?.si ? { si: category.metrics.si } : {}),
        },
        opportunities: [],
      }
      drawPsiSide(cursor, fonts, copy.pdf, mobile, copy.pdf.deviceMobile)
      drawPsiSide(cursor, fonts, copy.pdf, facts.desktop, copy.pdf.deviceDesktop)
    }
    cursor.y -= 8
  }

  // The raw measured values, one section per category.
  drawDetailRows(cursor, fonts, copy, facts)

  // ------------------------------------------------------------- benchmark
  drawSectionTitle(cursor, fonts, copy.pdf.benchmarkTitle)
  {
    const boxLines = [
      copy.pdf.benchmarkIntro,
      ...copy.pdf.benchmarkLines,
      copy.pdf.benchmarkSource,
    ]
    const boxHeight = boxLines.reduce((sum, line) => sum + wrapText(line, fonts.regular, 9.5, CONTENT_WIDTH - 28).length * 14, 0) + 28
    ensureSpace(cursor, Math.min(boxHeight + 20, PAGE_HEIGHT - MARGIN - CONTENT_BOTTOM))
    const boxTop = cursor.y + 6
    cursor.page.drawRectangle({ x: MARGIN, y: boxTop - boxHeight, width: CONTENT_WIDTH, height: boxHeight, borderColor: BRASS, borderWidth: 1, color: SHELL })
    cursor.y = boxTop - 14
    for (const line of boxLines) {
      const isSource = line === copy.pdf.benchmarkSource
      drawParagraph(cursor, line, { font: isSource ? fonts.bold : fonts.regular, size: 9.5, color: isSource ? GREY : INK, maxWidth: CONTENT_WIDTH - 28, indent: 14 })
    }
    cursor.y = boxTop - boxHeight - 10
  }

  // ------------------------------------------------------------- checklist
  drawSectionTitle(cursor, fonts, copy.pdf.checklistTitle)
  drawParagraph(cursor, copy.pdf.checklistIntro, { font: fonts.regular, size: 9.5, color: GREY })
  cursor.y -= 2
  for (const category of sortCategories(report.categories)) {
    for (const entry of category.sub) {
      const lines = wrapText(entry.label, fonts.regular, 9.5, CONTENT_WIDTH - 30)
      ensureSpace(cursor, lines.length * 13 + 3)
      cursor.page.drawRectangle({ x: MARGIN + 4, y: cursor.y - 1, width: 9, height: 9, borderColor: GREY, borderWidth: 0.8 })
      lines.forEach((line, index) => {
        cursor.page.drawText(line, { x: MARGIN + 20, y: cursor.y - index * 13, size: 9.5, font: fonts.regular, color: INK })
      })
      cursor.y -= lines.length * 13 + 3
    }
  }

  // -------------------------------------------------------------- glossary
  drawSectionTitle(cursor, fonts, copy.pdf.glossaryTitle)
  for (const entry of copy.pdf.glossary) {
    const textLines = wrapText(entry.text, fonts.regular, 9.5, CONTENT_WIDTH - 110)
    ensureSpace(cursor, textLines.length * 13 + 3)
    cursor.page.drawText(entry.term, { x: MARGIN, y: cursor.y, size: 9.5, font: fonts.bold, color: INK })
    textLines.forEach((line, index) => {
      cursor.page.drawText(line, { x: MARGIN + 100, y: cursor.y - index * 13, size: 9.5, font: fonts.regular, color: INK })
    })
    cursor.y -= textLines.length * 13 + 3
  }

  // ------------------------------------------------------------ what next
  drawSectionTitle(cursor, fonts, copy.pdf.nextTitle)
  drawParagraph(cursor, copy.pdf.nextIntro, { font: fonts.regular, size: 10, color: INK })
  for (const service of options.services) {
    ensureSpace(cursor, 16)
    cursor.page.drawText(service.name, { x: MARGIN + 14, y: cursor.y, size: 10, font: fonts.bold, color: INK })
    cursor.page.drawText(service.priceLabel, { x: MARGIN + 14 + fonts.bold.widthOfTextAtSize(service.name, 10) + 10, y: cursor.y, size: 10, font: fonts.regular, color: GREY })
    cursor.y -= 15
  }
  cursor.y -= 4
  drawParagraph(cursor, copy.pdf.nextWhatsapp, { font: fonts.regular, size: 10, color: INK })
  drawParagraph(cursor, copy.pdf.nextEmail, { font: fonts.regular, size: 10, color: INK })
  drawParagraph(cursor, fill(copy.pdf.nextRecheck, { url: options.recheckUrl }), { font: fonts.regular, size: 10, color: INK })
  cursor.y -= 6
  drawParagraph(cursor, copy.pdf.nextGenerated, { font: fonts.bold, size: 10, color: GREY })
  cursor.y -= 10
  drawParagraph(cursor, copy.pdf.footer, { font: fonts.regular, size: 8, color: GREY })

  // ------------------------------------------------- footers + page numbers
  const pages = pdf.getPages()
  pages.forEach((current, index) => {
    const y = MARGIN + 14
    current.drawLine({ start: { x: MARGIN, y: y + 12 }, end: { x: PAGE_WIDTH - MARGIN, y: y + 12 }, thickness: 0.7, color: RULE })
    current.drawText(`${copy.pdf.footerSite} · ${copy.pdf.date.toLowerCase()}: ${dateLabel}`, { x: MARGIN, y, size: 8, font: fonts.regular, color: GREY })
    const pageLabel = fill(copy.pdf.pageOf, { x: index + 1, y: pages.length })
    current.drawText(pageLabel, { x: PAGE_WIDTH - MARGIN - fonts.regular.widthOfTextAtSize(pageLabel, 8), y, size: 8, font: fonts.regular, color: GREY })
  })

  return pdf.save()
}

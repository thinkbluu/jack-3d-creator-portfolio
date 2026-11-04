import { readFile } from 'node:fs/promises'
import path from 'node:path'

import fontkit from '@pdf-lib/fontkit'
import { PDFDocument, PDFFont, PDFPage, rgb, type RGB } from 'pdf-lib'

import { checkerCopy } from './copy'
import { sortCategories, type SiteReport } from './types'

/**
 * Server-side PDF report with MAST Studio branding. Noto Sans is embedded so
 * Romanian diacritics (ș ț ă î â) render correctly on every reader.
 */

const INK = rgb(0.102, 0.09, 0.078)
const SHELL = rgb(0.98, 0.968, 0.949)
const BRASS = rgb(0.639, 0.51, 0.227)
const GREY = rgb(0.42, 0.4, 0.38)
const GOOD = rgb(0.18, 0.49, 0.31)
const FAIR = rgb(0.69, 0.48, 0.12)
const POOR = rgb(0.7, 0.23, 0.18)
const UNVERIFIED = rgb(0.45, 0.44, 0.42)

const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN = 48
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

const verdictColor: Record<string, RGB> = { good: GOOD, fair: FAIR, poor: POOR, unverified: UNVERIFIED }

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
      // A single word longer than the line is cut rather than overflowing.
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

function drawHeader(page: PDFPage, fonts: { regular: PDFFont; bold: PDFFont }) {
  page.drawRectangle({ x: MARGIN, y: PAGE_HEIGHT - 58, width: 14, height: 14, color: BRASS })
  page.drawText('MAST Studio', { x: MARGIN + 22, y: PAGE_HEIGHT - 54, size: 13, font: fonts.bold, color: INK })
  page.drawText('maststudio.ro', { x: PAGE_WIDTH - MARGIN - fonts.regular.widthOfTextAtSize('maststudio.ro', 10), y: PAGE_HEIGHT - 54, size: 10, font: fonts.regular, color: GREY })
  page.drawLine({ start: { x: MARGIN, y: PAGE_HEIGHT - 70 }, end: { x: PAGE_WIDTH - MARGIN, y: PAGE_HEIGHT - 70 }, thickness: 0.7, color: rgb(0.85, 0.82, 0.76) })
}

function drawParagraph(cursor: Cursor, text: string, options: { font: PDFFont; size: number; color: RGB; maxWidth?: number; lineHeight?: number; indent?: number }) {
  const maxWidth = options.maxWidth ?? CONTENT_WIDTH
  const lineHeight = options.lineHeight ?? options.size * 1.45
  const x = MARGIN + (options.indent ?? 0)
  for (const line of wrapText(text, options.font, options.size, maxWidth)) {
    if (cursor.y < MARGIN + 60) {
      cursor.page = newPage(cursor.pdf)
      cursor.y = PAGE_HEIGHT - MARGIN
    }
    cursor.page.drawText(line, { x, y: cursor.y, size: options.size, font: options.font, color: options.color })
    cursor.y -= lineHeight
  }
}

/** Builds the full PDF for a report. Throws only if the fonts cannot be read. */
export async function buildReportPdf(report: SiteReport, locale: 'ro' | 'en'): Promise<Uint8Array> {
  const copy = checkerCopy[locale]
  const pdf = await PDFDocument.create()
  const fonts = await loadFonts(pdf)

  pdf.setTitle(`${copy.pdf.title} - ${report.url}`)
  pdf.setAuthor('MAST Studio')
  pdf.setCreator('MAST Studio website checker')

  const page = newPage(pdf)
  const cursor: Cursor = { pdf, page, y: PAGE_HEIGHT - MARGIN }
  drawHeader(page, fonts)
  cursor.y = PAGE_HEIGHT - 108

  drawParagraph(cursor, copy.pdf.title, { font: fonts.bold, size: 22, color: INK })
  cursor.y -= 8

  const dateLabel = new Intl.DateTimeFormat(locale === 'ro' ? 'ro-RO' : 'en-GB', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Bucharest' }).format(new Date(report.checkedAt))
  drawParagraph(cursor, `${copy.pdf.reportFor}: ${report.url}`, { font: fonts.regular, size: 10.5, color: GREY })
  drawParagraph(cursor, `${copy.pdf.date}: ${dateLabel}`, { font: fonts.regular, size: 10.5, color: GREY })
  cursor.y -= 14

  // Overall score block.
  const overallText = report.overall === null ? copy.pdf.unverified : `${report.overall}`
  cursor.page.drawText(overallText, { x: MARGIN, y: cursor.y - 34, size: 44, font: fonts.bold, color: INK })
  const overallWidth = fonts.bold.widthOfTextAtSize(overallText, 44)
  cursor.page.drawText('/ 100', { x: MARGIN + overallWidth + 8, y: cursor.y - 30, size: 14, font: fonts.regular, color: GREY })
  cursor.page.drawText(copy.pdf.overall, { x: MARGIN + overallWidth + 8, y: cursor.y - 46, size: 10, font: fonts.regular, color: GREY })
  cursor.y -= 66

  // Categories.
  drawParagraph(cursor, copy.pdf.categories, { font: fonts.bold, size: 14, color: INK })
  cursor.y -= 6

  for (const category of sortCategories(report.categories)) {
    const meta = copy.categories[category.key]
    const verdictLabel = category.score === null ? copy.pdf.unverified : copy.verdicts[category.verdict]
    const scoreLabel = category.score === null ? copy.pdf.unverified : `${category.score} / 100`
    const color = verdictColor[category.verdict]

    if (cursor.y < MARGIN + 120) {
      cursor.page = newPage(pdf)
      cursor.y = PAGE_HEIGHT - MARGIN
    }

    cursor.page.drawCircle({ x: MARGIN + 4, y: cursor.y + 3, size: 3.5, color })
    cursor.page.drawText(meta.name, { x: MARGIN + 14, y: cursor.y, size: 12, font: fonts.bold, color: INK })
    const nameWidth = fonts.bold.widthOfTextAtSize(meta.name, 12)
    cursor.page.drawText(scoreLabel, { x: MARGIN + 14 + nameWidth + 10, y: cursor.y, size: 12, font: fonts.regular, color })
    if (meta.note) {
      const scoreWidth = fonts.regular.widthOfTextAtSize(scoreLabel, 12)
      cursor.page.drawText(`(${meta.note})`, { x: MARGIN + 14 + nameWidth + 10 + scoreWidth + 8, y: cursor.y, size: 9, font: fonts.regular, color: GREY })
    }
    cursor.y -= 17

    for (const entry of category.sub) {
      const bulletColor = entry.status === 'pass' ? GOOD : entry.status === 'warn' ? FAIR : entry.status === 'fail' ? POOR : UNVERIFIED
      const label = entry.status === 'error' ? copy.pdf.unverified : entry.label
      const lines = wrapText(label, fonts.regular, 9.5, CONTENT_WIDTH - 26)
      cursor.page.drawCircle({ x: MARGIN + 8, y: cursor.y + 3, size: 2, color: bulletColor })
      lines.forEach((line, index) => {
        cursor.page.drawText(line, { x: MARGIN + 18, y: cursor.y - index * 13, size: 9.5, font: fonts.regular, color: entry.status === 'error' ? UNVERIFIED : INK })
      })
      cursor.y -= lines.length * 13 + 2
    }

    if (category.metrics) {
      const { lcp, cls } = category.metrics
      if (lcp) drawParagraph(cursor, `${copy.speedMetrics.lcp}: ${lcp}`, { font: fonts.regular, size: 9.5, color: GREY, indent: 18 })
      if (cls) drawParagraph(cursor, `${copy.speedMetrics.cls}: ${cls}`, { font: fonts.regular, size: 9.5, color: GREY, indent: 18 })
    }
    cursor.y -= 10
  }

  // Top fixes.
  if (cursor.y < MARGIN + 160) {
    cursor.page = newPage(pdf)
    cursor.y = PAGE_HEIGHT - MARGIN
  }
  cursor.y -= 8
  drawParagraph(cursor, copy.pdf.topFixes, { font: fonts.bold, size: 14, color: INK })
  cursor.y -= 6

  report.fixes.forEach((fix, index) => {
    if (cursor.y < MARGIN + 150) {
      cursor.page = newPage(pdf)
      cursor.y = PAGE_HEIGHT - MARGIN
    }
    drawParagraph(cursor, `${index + 1}. ${fix.title}`, { font: fonts.bold, size: 11.5, color: INK })
    drawParagraph(cursor, `${copy.pdf.what}: ${fix.what}`, { font: fonts.regular, size: 9.5, color: INK, indent: 14 })
    drawParagraph(cursor, `${copy.pdf.why}: ${fix.why}`, { font: fonts.regular, size: 9.5, color: GREY, indent: 14 })
    drawParagraph(cursor, `${copy.pdf.who}: ${fix.who}`, { font: fonts.regular, size: 9.5, color: GREY, indent: 14 })
    cursor.y -= 8
  })

  // Footer note on the last page.
  if (cursor.y < MARGIN + 80) {
    cursor.page = newPage(pdf)
    cursor.y = PAGE_HEIGHT - MARGIN
  }
  cursor.y = Math.max(cursor.y, MARGIN + 46)
  cursor.page.drawLine({ start: { x: MARGIN, y: cursor.y }, end: { x: PAGE_WIDTH - MARGIN, y: cursor.y }, thickness: 0.7, color: rgb(0.85, 0.82, 0.76) })
  drawParagraph(cursor, copy.pdf.footer, { font: fonts.regular, size: 8, color: GREY, maxWidth: CONTENT_WIDTH })

  return pdf.save()
}

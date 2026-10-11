/**
 * The pages of the work book, drawn with the 2D canvas so the book needs no
 * image assets beyond the project screenshots. Each face is a canvas; the
 * cover also returns a mask that marks its brass foil.
 */

export type BookProject = {
  slug: string
  name: string
  category: string
  year: number
  summary: string
  result?: string
  stack: string[]
  host: string
  cover: string
}

export type BookCopy = {
  coverTitle: string
  coverSub: string
  coverYears: string
  coverNote: string
  index: string
  result: string
  built: string
  open: string
  end: string
  endNote: string
  intro: string
}

export type Face = { canvas: HTMLCanvasElement; foil?: HTMLCanvasElement }

const PAPER = '#f3ede2'
const INK = '#1a1714'
const INK2 = 'rgba(26, 23, 20, 0.68)'
const INK3 = 'rgba(26, 23, 20, 0.45)'
const BRASS = '#8a6d2f'
const NAVY = '#13213a'

type Fonts = { serif: string; sans: string; mono: string }

function fonts(): Fonts {
  const style = getComputedStyle(document.documentElement)
  const read = (name: string, fallback: string) => style.getPropertyValue(name).trim() || fallback
  return {
    serif: read('--font-fraunces', 'Georgia, serif'),
    sans: read('--font-dm-sans', 'system-ui, sans-serif'),
    mono: read('--font-dm-mono', 'ui-monospace, monospace'),
  }
}

/** Pages are laid out at 900 px wide and rasterised at this scale. */
let SCALE = 1
export function setPageScale(scale: number) {
  SCALE = scale
}

function make(width: number, height: number, scaled = true) {
  const canvas = document.createElement('canvas')
  const k = scaled ? SCALE : 1
  canvas.width = Math.round(width * k)
  canvas.height = Math.round(height * k)
  const ctx = canvas.getContext('2d')!
  ctx.scale(k, k)
  return { canvas, ctx }
}

/** Seeded speckle so paper and cloth have tooth without textures. */
function grain(ctx: CanvasRenderingContext2D, width: number, height: number, alpha: number, seed = 1) {
  let s = seed * 9301 + 49297
  const rand = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const count = Math.round((width * height) / 90)
  for (let i = 0; i < count; i++) {
    const v = rand()
    ctx.fillStyle = v > 0.5 ? `rgba(255,255,255,${alpha * rand()})` : `rgba(60,40,20,${alpha * rand()})`
    ctx.fillRect(rand() * width, rand() * height, 1 + rand() * 1.5, 1 + rand() * 1.5)
  }
}

function paper(width: number, height: number, seed: number) {
  const { canvas, ctx } = make(width, height)
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, width, height)
  const glow = ctx.createRadialGradient(width * 0.5, height * 0.45, width * 0.1, width * 0.5, height * 0.5, width * 0.9)
  glow.addColorStop(0, 'rgba(255,255,255,0.25)')
  glow.addColorStop(1, 'rgba(120,90,50,0.10)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, width, height)
  grain(ctx, width, height, 0.07, seed)
  return { canvas, ctx }
}

/** Word wrap within a width, returning lines. */
function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else line = next
  }
  if (line) lines.push(line)
  return lines
}

function lines(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines = 99) {
  let rows = wrap(ctx, text, maxWidth)
  if (rows.length > maxLines) {
    rows = rows.slice(0, maxLines)
    rows[maxLines - 1] = rows[maxLines - 1].replace(/\s+\S*$/, '') + ' …'
  }
  rows.forEach((row, i) => ctx.fillText(row, x, y + i * lineHeight))
  return y + rows.length * lineHeight
}

function mono(ctx: CanvasRenderingContext2D, f: Fonts, size: number, text: string, x: number, y: number, color: string, align: CanvasTextAlign = 'left') {
  ctx.font = `500 ${size}px ${f.mono}`
  ctx.fillStyle = color
  ctx.textAlign = align
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${size * 0.12}px`
  ctx.fillText(text.toUpperCase(), x, y)
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px'
  ctx.textAlign = 'left'
}

function folio(ctx: CanvasRenderingContext2D, f: Fonts, width: number, height: number, n: number, side: 'left' | 'right') {
  mono(ctx, f, 18, String(n).padStart(2, '0'), side === 'left' ? 70 : width - 70, height - 56, INK3, side === 'left' ? 'left' : 'right')
  mono(ctx, f, 14, 'MAST Studio', width / 2, height - 56, INK3, 'center')
}

function rule(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, color = 'rgba(26,23,20,0.18)') {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, 2)
}

/** Draw an image to cover a box, anchored to the top. */
function coverImage(ctx: CanvasRenderingContext2D, image: CanvasImageSource & { width: number; height: number }, x: number, y: number, w: number, h: number, zoom = 1, focusX = 0.5) {
  const scale = Math.max(w / image.width, h / image.height) * zoom
  const sw = w / scale
  const sh = h / scale
  const sx = Math.max(0, Math.min(image.width - sw, image.width * focusX - sw / 2))
  ctx.drawImage(image, sx, 0, sw, sh, x, y, w, h)
}

export function loadImage(src: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => resolve(null)
    image.src = src
  })
}

export async function drawCover(width: number, height: number, copy: BookCopy): Promise<Face> {
  const f = fonts()
  const { canvas, ctx } = make(width, height)
  const foilLayer = make(width, height)
  // Book cloth: navy with a fine woven texture.
  ctx.fillStyle = NAVY
  ctx.fillRect(0, 0, width, height)
  for (let y = 0; y < height; y += 3) {
    ctx.fillStyle = y % 6 === 0 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.05)'
    ctx.fillRect(0, y, width, 1)
  }
  for (let x = 0; x < width; x += 3) {
    ctx.fillStyle = x % 6 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.04)'
    ctx.fillRect(x, 0, 1, height)
  }
  grain(ctx, width, height, 0.05, 3)
  // Blind-debossed frame.
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'
  ctx.lineWidth = 3
  ctx.strokeRect(54, 54, width - 108, height - 108)
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  ctx.strokeRect(57, 57, width - 108, height - 108)

  // Brass foil: drawn twice, in colour and into the mask.
  const foil = (target: CanvasRenderingContext2D, color: string) => {
    target.fillStyle = color
    target.textAlign = 'center'
    target.font = `500 22px ${f.mono}`
    if ('letterSpacing' in target) (target as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '6px'
    target.fillText(copy.coverSub.toUpperCase(), width / 2, 150)
    target.fillText(copy.coverYears, width / 2, height - 130)
    if ('letterSpacing' in target) (target as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '-4px'
    target.font = `italic 300 ${Math.round(width * 0.25)}px ${f.serif}`
    target.fillText(copy.coverTitle, width / 2, height * 0.62)
    target.fillRect(width / 2 - 70, height * 0.69, 140, 3)
    if ('letterSpacing' in target) (target as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px'
    target.textAlign = 'left'
  }
  const mark = await loadImage('/icons/mast-mark.svg')
  const drawMark = (target: CanvasRenderingContext2D, color: string) => {
    if (!mark) return
    const size = width * 0.3
    const tmp = make(Math.round(size), Math.round(size), false)
    tmp.ctx.drawImage(mark, 0, 0, size, size)
    tmp.ctx.globalCompositeOperation = 'source-in'
    tmp.ctx.fillStyle = color
    tmp.ctx.fillRect(0, 0, size, size)
    target.drawImage(tmp.canvas, width / 2 - size / 2, height * 0.2)
  }
  const brass = ctx.createLinearGradient(0, 0, width, height)
  brass.addColorStop(0, '#e6c983')
  brass.addColorStop(0.5, '#b8913f')
  brass.addColorStop(1, '#d9b766')
  foil(ctx, '#c9a457')
  drawMark(ctx, '#c9a457')
  foilLayer.ctx.fillStyle = '#000'
  foilLayer.ctx.fillRect(0, 0, width, height)
  foil(foilLayer.ctx, '#fff')
  drawMark(foilLayer.ctx, '#fff')
  return { canvas, foil: foilLayer.canvas }
}

export function drawContents(width: number, height: number, copy: BookCopy, projects: BookProject[]): Face {
  const f = fonts()
  const { canvas, ctx } = paper(width, height, 5)
  mono(ctx, f, 18, copy.coverSub, 80, 120, BRASS)
  ctx.fillStyle = INK
  ctx.font = `400 ${Math.round(width * 0.11)}px ${f.serif}`
  ctx.fillText(copy.index, 76, 250)
  let y = 360
  projects.forEach((project, i) => {
    const page = String(i * 2 + 3).padStart(2, '0')
    mono(ctx, f, 18, String(i + 1).padStart(2, '0'), 80, y, BRASS)
    ctx.font = `400 40px ${f.serif}`
    ctx.fillStyle = INK
    ctx.fillText(project.name, 140, y + 4)
    const nameWidth = ctx.measureText(project.name).width
    ctx.fillStyle = INK3
    for (let x = 150 + nameWidth; x < width - 130; x += 14) ctx.fillRect(x, y, 3, 3)
    mono(ctx, f, 18, page, width - 80, y + 2, INK2, 'right')
    mono(ctx, f, 14, `${project.category} · ${project.year}`, 140, y + 40, INK3)
    y += 112
  })
  folio(ctx, f, width, height, 1, 'left')
  return { canvas }
}

export function drawForeword(width: number, height: number, copy: BookCopy): Face {
  const f = fonts()
  const { canvas, ctx } = paper(width, height, 7)
  ctx.fillStyle = BRASS
  ctx.font = `italic 300 180px ${f.serif}`
  ctx.fillText('“', 70, 330)
  ctx.fillStyle = INK
  ctx.font = `italic 300 64px ${f.serif}`
  const end = lines(ctx, copy.coverNote, 80, 380, width - 160, 74)
  rule(ctx, 80, end + 30, 120, BRASS)
  ctx.fillStyle = INK2
  ctx.font = `400 28px ${f.sans}`
  lines(ctx, copy.intro, 80, end + 110, width - 200, 44)
  folio(ctx, f, width, height, 2, 'right')
  return { canvas }
}

export function drawPlate(width: number, height: number, project: BookProject, index: number, image: HTMLImageElement | null): Face {
  const f = fonts()
  const { canvas, ctx } = paper(width, height, 11 + index)
  ctx.fillStyle = 'rgba(138,109,47,0.85)'
  ctx.font = `italic 300 170px ${f.serif}`
  ctx.fillText(String(index + 1).padStart(2, '0'), 64, 210)
  mono(ctx, f, 16, `Pl. ${String(index + 1).padStart(2, '0')}`, width - 80, 120, INK3, 'right')
  mono(ctx, f, 16, project.host, width - 80, 150, BRASS, 'right')
  const x = 70
  const w = width - 140
  const h1 = Math.round(w / 2.03)
  const y1 = 270
  const h2 = height - 150 - (y1 + h1 + 70)
  if (image) {
    ctx.save()
    ctx.shadowColor = 'rgba(40,25,10,0.25)'
    ctx.shadowBlur = 24
    ctx.shadowOffsetY = 10
    ctx.fillStyle = '#fff'
    ctx.fillRect(x, y1, w, h1)
    ctx.restore()
    coverImage(ctx, image, x, y1, w, h1)
    // A detail plate: the same site, closer.
    coverImage(ctx, image, x, y1 + h1 + 70, w * 0.62, h2, 1.9, 0.3)
  } else {
    ctx.fillStyle = 'rgba(26,23,20,0.08)'
    ctx.fillRect(x, y1, w, h1)
  }
  mono(ctx, f, 14, 'Detaliu', x + w * 0.62 + 30, y1 + h1 + 90, INK3)
  ctx.fillStyle = INK2
  ctx.font = `italic 300 30px ${f.serif}`
  lines(ctx, project.category, x + w * 0.62 + 30, y1 + h1 + 150, w * 0.38 - 30, 38, 3)
  folio(ctx, f, width, height, index * 2 + 3, 'left')
  return { canvas }
}

export function drawStory(width: number, height: number, project: BookProject, index: number, copy: BookCopy): Face {
  const f = fonts()
  const { canvas, ctx } = paper(width, height, 23 + index)
  mono(ctx, f, 18, `${String(index + 1).padStart(2, '0')} — ${project.category} · ${project.year}`, 80, 130, BRASS)
  // The name, as large as it fits on two lines.
  let size = 120
  ctx.fillStyle = INK
  for (; size > 60; size -= 4) {
    ctx.font = `400 ${size}px ${f.serif}`
    if (wrap(ctx, project.name, width - 160).length <= 2) break
  }
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-size * 0.03}px`
  let y = lines(ctx, project.name, 76, 140 + size, width - 160, size * 0.95, 2)
  if ('letterSpacing' in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '0px'
  rule(ctx, 80, y + 20, 90, BRASS)
  ctx.fillStyle = INK2
  ctx.font = `400 30px ${f.sans}`
  y = lines(ctx, project.summary, 80, y + 90, width - 170, 46, 5)
  if (project.result) {
    y += 40
    mono(ctx, f, 15, copy.result, 80, y, INK3)
    ctx.fillStyle = INK
    ctx.font = `italic 300 36px ${f.serif}`
    y = lines(ctx, project.result, 80, y + 52, width - 170, 46, 4)
  }
  const bottom = height - 150
  rule(ctx, 80, bottom - 70, width - 160)
  mono(ctx, f, 14, `${copy.built} · ${project.stack.slice(0, 3).join(' · ')}`, 80, bottom - 30, INK3)
  mono(ctx, f, 16, `${copy.open} →`, 80, bottom + 12, BRASS)
  folio(ctx, f, width, height, index * 2 + 4, 'right')
  return { canvas }
}

export function drawColophon(width: number, height: number, copy: BookCopy, page: number): Face {
  const f = fonts()
  const { canvas, ctx } = paper(width, height, 41)
  mono(ctx, f, 18, copy.coverSub, 80, 130, BRASS)
  ctx.fillStyle = INK
  ctx.font = `italic 300 ${Math.round(width * 0.12)}px ${f.serif}`
  ctx.fillText(copy.end, 76, height * 0.45)
  rule(ctx, 80, height * 0.45 + 50, 90, BRASS)
  mono(ctx, f, 16, 'maststudio.ro/portofoliu →', 80, height * 0.45 + 120, INK2)
  folio(ctx, f, width, height, page, 'left')
  return { canvas }
}

export function drawBlank(width: number, height: number, copy: BookCopy): Face {
  const f = fonts()
  const { canvas, ctx } = paper(width, height, 53)
  ctx.fillStyle = INK
  ctx.font = `italic 300 60px ${f.serif}`
  lines(ctx, copy.endNote, 80, 200, width - 160, 70)
  for (let y = 380; y < height - 200; y += 64) rule(ctx, 80, y, width - 160, 'rgba(26,23,20,0.1)')
  return { canvas }
}

export function drawEndpaper(width: number, height: number): Face {
  const { canvas, ctx } = make(width, height)
  ctx.fillStyle = NAVY
  ctx.fillRect(0, 0, width, height)
  ctx.strokeStyle = 'rgba(201,164,87,0.16)'
  ctx.lineWidth = 2
  for (let i = -height; i < width + height; i += 36) {
    ctx.beginPath()
    ctx.moveTo(i, 0)
    ctx.lineTo(i + height, height)
    ctx.stroke()
  }
  grain(ctx, width, height, 0.05, 61)
  return { canvas }
}

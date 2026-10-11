import type { Shape } from './particle-engine'

/**
 * Turn something drawn on a 2D canvas into `count` particle targets, centred on
 * the viewport (y up, like the WebGL scene). Pixels are sampled on a grid and
 * then drawn at random with a little jitter, so any count fills any shape.
 */
function sample(
  width: number,
  height: number,
  count: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
  depth?: (x: number, y: number) => number,
): Shape {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const data = new Float32Array(count * 3)
  if (!ctx) return { kind: 'points', data }
  ctx.fillStyle = '#fff'
  ctx.strokeStyle = '#fff'
  draw(ctx)

  const pixels = ctx.getImageData(0, 0, width, height).data
  const gap = width < 700 ? 2 : 3
  const xs: number[] = []
  const ys: number[] = []
  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      if (pixels[(y * width + x) * 4 + 3] > 120) {
        xs.push(x)
        ys.push(y)
      }
    }
  }
  if (!xs.length) return { kind: 'chaos' }
  for (let i = 0; i < count; i++) {
    const k = (Math.random() * xs.length) | 0
    data[i * 3] = xs[k] + (Math.random() - 0.5) * gap - width / 2
    data[i * 3 + 1] = height / 2 - (ys[k] + (Math.random() - 0.5) * gap)
    data[i * 3 + 2] = depth ? depth(data[i * 3], data[i * 3 + 1]) : (Math.random() - 0.5) * 80
  }
  return { kind: 'points', data }
}

/** The display font as next/font registered it (a hashed family name). */
export function displayFontFamily() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--font-fraunces').trim()
  return value || 'Georgia, serif'
}

let markImage: Promise<HTMLImageElement | null> | null = null

function loadMark() {
  if (!markImage) {
    markImage = new Promise((resolve) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => resolve(null)
      image.src = '/icons/mast-mark.svg'
    })
  }
  return markImage
}

/** The MAST compass rose, the brand mark, as particles. */
export async function compassShape(width: number, height: number, count: number, lift: number): Promise<Shape> {
  const image = await loadMark()
  if (!image) return { kind: 'chaos' }
  const size = Math.min(width * 0.9, height * 0.95)
  const radius = size / 2
  return sample(
    width,
    height,
    count,
    (ctx) => {
      ctx.drawImage(image, width / 2 - size / 2, height / 2 - lift - size / 2, size, size)
    },
    // A raised star: the centre stands proud and the points fall away, so the
    // rose shows its volume as the field turns.
    (x, y) => {
      const r = Math.hypot(x, y - lift) / radius
      return (1 - Math.min(1, r)) * radius * 0.55 + (Math.random() - 0.5) * 24
    },
  )
}

/** A word set in the display face, fitted to the width. */
export function wordShape(width: number, height: number, count: number, lift: number, text: string, italic = false): Shape {
  const family = displayFontFamily()
  return sample(width, height, count, (ctx) => {
    let size = height * 0.42
    const style = italic ? 'italic 300' : '400'
    ctx.font = `${style} ${size}px ${family}`
    const measured = ctx.measureText(text).width
    const max = width * 0.86
    if (measured > max) {
      size = (size * max) / measured
      ctx.font = `${style} ${size}px ${family}`
    }
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, width / 2, height / 2 - lift)
  })
}

/** A website wireframe: browser frame, menu, headline, image, three cards. */
export function wireframeShape(width: number, height: number, count: number, lift: number): Shape {
  return sample(width, height, count, (ctx) => {
    const bw = Math.min(width * 0.8, height * 1.15)
    const bh = bw * 0.62
    const x0 = (width - bw) / 2
    const y0 = height / 2 - lift - bh / 2
    ctx.lineWidth = Math.max(2, bw / 320)
    const box = (x: number, y: number, w: number, h: number) => ctx.strokeRect(x0 + bw * x, y0 + bh * y, bw * w, bh * h)
    const bar = (x: number, y: number, w: number, h: number) => ctx.fillRect(x0 + bw * x, y0 + bh * y, bw * w, bh * h)
    box(0, 0, 1, 1)
    bar(0, 0.085, 1, 0.006)
    for (let k = 0; k < 3; k++) {
      ctx.beginPath()
      ctx.arc(x0 + bw * (0.025 + k * 0.022), y0 + bh * 0.043, bw * 0.006, 0, Math.PI * 2)
      ctx.fill()
    }
    box(0.05, 0.15, 0.1, 0.05)
    for (let k = 0; k < 4; k++) bar(0.55 + k * 0.1, 0.17, 0.065, 0.008)
    bar(0.05, 0.3, 0.42, 0.05)
    bar(0.05, 0.38, 0.3, 0.05)
    bar(0.05, 0.47, 0.36, 0.012)
    box(0.05, 0.53, 0.14, 0.07)
    box(0.55, 0.27, 0.4, 0.34)
    ctx.beginPath()
    ctx.moveTo(x0 + bw * 0.55, y0 + bh * 0.61)
    ctx.lineTo(x0 + bw * 0.95, y0 + bh * 0.27)
    ctx.stroke()
    for (let k = 0; k < 3; k++) box(0.05 + k * 0.31, 0.7, 0.28, 0.22)
  })
}

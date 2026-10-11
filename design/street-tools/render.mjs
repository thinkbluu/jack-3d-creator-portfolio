import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs'
import fs from 'node:fs'
import path from 'node:path'
const [,, scale = '2'] = process.argv
const browser = await chromium.launch()
const files = fs.readdirSync('raw').filter((f) => f.endsWith('.svg'))
for (const f of files) {
  const svg = fs.readFileSync(path.join('raw', f), 'utf8')
  const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)
  const w = Math.round(+m[1] * +scale), h = Math.round(+m[2] * +scale)
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  const html = `<html><body style="margin:0;background:transparent">${svg.replace(/<\?xml[^>]*>/, '').replace(/width="[\d.]+" height="[\d.]+"/, `width="${w}" height="${h}"`)}</body></html>`
  await page.setContent(html)
  await page.screenshot({ path: path.join('png', f.replace('.svg', '.png')), omitBackground: true })
  await page.close()
  console.log(f, w, h)
}
await browser.close()

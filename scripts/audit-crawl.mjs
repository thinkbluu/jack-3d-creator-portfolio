// One-off audit crawler: fetches every route and extracts SEO head signals.
const BASE = 'http://localhost:3000'

const roPaths = [
  '/', '/servicii', '/servicii/aplicatii-web', '/servicii/magazin-online', '/servicii/mentenanta',
  '/portofoliu', '/portofoliu/veterinaria-timisoara', '/despre', '/contact', '/cere-oferta',
  '/cerere-oferta', '/comparatie', '/glosar', '/blog', '/blog/cat-costa-un-site-in-romania',
  '/blog/wordpress-vs-personalizat', '/cariere', '/confidentialitate', '/cookies', '/termeni',
  '/site-gratuit', '/site-gratuit/regulament', '/site-gratuit/castig', '/nonexistent-page-404-check',
]
const enPaths = [
  '/en', '/en/services', '/en/work', '/en/about', '/en/contact', '/en/get-a-quote',
  '/en/request-a-quote', '/en/compare', '/en/glossary', '/en/blog', '/en/careers',
  '/en/privacy', '/en/cookies', '/en/terms', '/en/free-website', '/en/nonexistent-page-404-check',
]

function getMeta(html) {
  const pick = (re) => html.match(re)?.[1] ?? null
  const title = pick(/<title[^>]*>([^<]*)<\/title>/)
  const desc = pick(/<meta\s+name="description"\s+content="([^"]*)"/) ?? pick(/<meta\s+content="([^"]*)"\s+name="description"/)
  const canonical = pick(/<link\s+rel="canonical"\s+href="([^"]*)"/) ?? pick(/<link\s+href="([^"]*)"\s+rel="canonical"/)
  const hreflang = [...html.matchAll(/<link\s+rel="alternate"\s+hreflang="([^"]*)"\s+href="([^"]*)"/g)].map((m) => `${m[1]}=${m[2]}`)
  const ogTitle = pick(/<meta\s+property="og:title"\s+content="([^"]*)"/)
  const ogImage = pick(/<meta\s+property="og:image"\s+content="([^"]*)"/)
  const ogLocale = pick(/<meta\s+property="og:locale"\s+content="([^"]*)"/)
  const robots = pick(/<meta\s+name="robots"\s+content="([^"]*)"/)
  const jsonLd = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1].length)
  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map((m) => m[1].replace(/<[^>]*>/g, '').trim())
  const h2count = (html.match(/<h2[^>]*>/g) ?? []).length
  const imgsNoAlt = (html.match(/<img(?![^>]*\salt=)[^>]*>/g) ?? []).length
  const imgCount = (html.match(/<img\s/g) ?? []).length
  return { title, desc, canonical, hreflang, ogTitle, ogImage, ogLocale, robots, jsonLd, h1s, h2count, imgCount, imgsNoAlt }
}

async function crawl(path) {
  try {
    const res = await fetch(`${BASE}${path}`, { redirect: 'follow' })
    const html = await res.text()
    const m = getMeta(html)
    return { path, status: res.status, ...m }
  } catch (e) {
    return { path, status: 'ERR', error: String(e) }
  }
}

const all = [...roPaths.map((p) => [p, 'ro']), ...enPaths.map((p) => [p, 'en'])]
const results = []
for (const [path] of all) {
  results.push(await crawl(path))
}

for (const r of results) {
  const titleLen = r.title?.length ?? 0
  const descLen = r.desc?.length ?? 0
  console.log(`== ${r.path} [${r.status}]`)
  console.log(`   title(${titleLen}): ${r.title}`)
  console.log(`   desc(${descLen}): ${r.desc}`)
  console.log(`   canonical: ${r.canonical}`)
  console.log(`   hreflang: ${r.hreflang?.join(' ') || 'NONE'}`)
  console.log(`   og: locale=${r.ogLocale} img=${r.ogImage} ogTitle=${r.ogTitle ? 'yes' : 'MISSING'}`)
  console.log(`   robots: ${r.robots ?? 'default'} | jsonLd blocks: ${r.jsonLd?.length ?? 0} sizes=[${r.jsonLd?.join(',')}]`)
  console.log(`   h1(${r.h1s?.length}): ${r.h1s?.join(' || ').slice(0, 120)} | h2: ${r.h2count} | imgs: ${r.imgCount} noAlt: ${r.imgsNoAlt}`)
}

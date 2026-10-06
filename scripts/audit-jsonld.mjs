// One-off audit: validate JSON-LD blocks on key pages.
const BASE = 'http://localhost:3000'
const pages = ['/', '/servicii/aplicatii-web', '/servicii/magazin-online', '/blog/cat-costa-un-site-in-romania', '/portofoliu/veterinaria-timisoara', '/comparatie', '/en', '/en/services', '/en/blog', '/cariere', '/contact', '/despre']

const REQUIRED = {
  Organization: ['name', 'url', 'logo', 'sameAs', 'contactPoint', 'address'],
  WebSite: ['name', 'url', 'inLanguage'],
  Service: ['name', 'description', 'provider', 'areaServed'],
  Article: ['headline', 'datePublished', 'dateModified', 'author', 'image'],
  CaseStudy: ['name', 'description'],
  JobPosting: ['title', 'datePosted', 'hiringOrganization'],
  BreadcrumbList: ['itemListElement'],
  FAQPage: ['mainEntity'],
  WebPage: ['name', 'url'],
}

for (const page of pages) {
  const res = await fetch(`${BASE}${page}`)
  const html = await res.text()
  const blocks = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]))
  console.log(`\n== ${page}`)
  for (const block of blocks) {
    const graph = Array.isArray(block['@graph']) ? block['@graph'] : [block]
    for (const node of graph) {
      const type = Array.isArray(node['@type']) ? node['@type'].join('+') : node['@type']
      const issues = []
      for (const req of REQUIRED[type] ?? []) {
        const v = node[req]
        if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) issues.push(`missing ${req}`)
      }
      const extras = type === 'Organization' ? `sameAs=${JSON.stringify(node.sameAs)}` : ''
      console.log(`  ${type}: ${issues.length ? 'ISSUES: ' + issues.join(', ') : 'ok'} ${extras}`)
      if (type === 'Organization') {
        if (node.aggregateRating || node.review) console.log('  WARNING: self-serving review markup on Organization')
      }
    }
  }
}

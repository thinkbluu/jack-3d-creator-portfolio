import { getAllPosts } from '@/lib/blog'

const siteUrl = 'https://maststudio.ro'

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(date: string) {
  return new Date(`${date}T00:00:00Z`).toUTCString()
}

export function GET() {
  const posts = getAllPosts()
  const latestDate = posts.reduce((latest, post) => {
    const candidate = post.updatedAt ?? post.publishedAt
    return candidate > latest ? candidate : latest
  }, posts[0]?.publishedAt ?? new Date().toISOString().slice(0, 10))

  const items = posts
    .map((post) => {
      const link = `${siteUrl}/blog/${post.slug}`
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <description>${escapeXml(post.excerpt)}</description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${toRfc822(post.updatedAt ?? post.publishedAt)}</pubDate>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MAST Studio Blog</title>
    <description>Ghiduri și prețuri reale pentru site-uri, magazine online și aplicații web în România.</description>
    <link>${siteUrl}/blog</link>
    <language>ro-ro</language>
    <lastBuildDate>${toRfc822(latestDate)}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}

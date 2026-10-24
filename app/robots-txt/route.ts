import { SITE_URL } from '@/lib/site'

// Prerendered at build time.
export const dynamic = 'force-static'

// Search engines and AI assistants may crawl everything except the API.
const crawlers = [
  '*',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
  'Bingbot',
  'CCBot',
  'Applebot-Extended',
]

export function GET() {
  const lines = crawlers.map((userAgent) => `User-agent: ${userAgent}\nAllow: /\nDisallow: /api/`)
  lines.push('', `Sitemap: ${SITE_URL}/sitemap.xml`)
  // Agentic Resource Discovery manifest.
  lines.push(`Agentmap: ${SITE_URL}/.well-known/ard.json`)
  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}

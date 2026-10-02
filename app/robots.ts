import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Search engines and AI assistants may crawl everything except the API.
const crawlers = ['*', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'Bingbot', 'CCBot', 'Applebot-Extended']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: crawlers.map((userAgent) => ({ userAgent, allow: '/', disallow: '/api/' })),
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

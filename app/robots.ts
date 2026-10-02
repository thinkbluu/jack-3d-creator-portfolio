import type { MetadataRoute } from 'next'
import { PRIVATE_CONTEST_PATHS } from '@/lib/contest/config'
import { SITE_URL } from '@/lib/site'

// Search engines and AI assistants may crawl everything except the API and the
// contest pages reached through personal links in e-mails.
const crawlers = ['*', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'Bingbot', 'CCBot', 'Applebot-Extended']
const privatePaths = ['/api/', ...PRIVATE_CONTEST_PATHS]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: crawlers.map((userAgent) => ({ userAgent, allow: '/', disallow: privatePaths })),
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

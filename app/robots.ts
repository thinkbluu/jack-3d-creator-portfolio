import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// Search engines and AI assistants may crawl everything except the API and the
// contest pages reached through personal links in e-mails.
const crawlers = ['*', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-Web', 'PerplexityBot', 'Google-Extended', 'Bingbot', 'CCBot', 'Applebot-Extended']
const privatePaths = ['/api/', '/site-gratuit/confirmare', '/site-gratuit/participare', '/site-gratuit/castig', '/site-gratuit/admin/']

export default function robots(): MetadataRoute.Robots {
  return {
    rules: crawlers.map((userAgent) => ({ userAgent, allow: '/', disallow: privatePaths })),
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}

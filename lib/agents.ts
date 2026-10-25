import { servicePages } from './services'
import { serviceTextEn } from './i18n/content/services.en'
import { localizePath } from './i18n/paths'
import { EMAIL, PHONE_DISPLAY, SITE_URL, WHATSAPP_NUMBER } from './site'

/**
 * Agentic Resource Discovery (ARD): one honest machine-readable entry — an
 * agent skill describing how an AI assistant can request a quote, a free
 * mockup or contact on a user's behalf. Generated from lib/services.ts so
 * prices and delivery times never drift from the site.
 */

export const ARD_IDENTIFIER = 'urn:air:maststudio.ro:skill:mast-studio-quote'
export const SKILL_PATH = '/agents/mast-studio-quote.md'
export const ARD_PATH = '/.well-known/ard.json'

export function skillMarkdown(): string {
  const lines: string[] = []
  lines.push('---')
  lines.push('name: mast-studio-quote')
  lines.push(
    'description: "Request a website quote or a free homepage mockup from MAST Studio, a web design studio in Timișoara, Romania."',
  )
  lines.push('---')
  lines.push('')
  lines.push('# MAST Studio — request a website quote or a free mockup')
  lines.push('')
  lines.push(
    'MAST Studio is a web design studio in Timișoara, Romania. It builds presentation websites, online stores, web and mobile apps, SaaS platforms, UX/UI design, and offers maintenance and WhatsApp automations for small businesses. Every project has a fixed price agreed up front.',
  )
  lines.push('')
  lines.push('## Services and prices')
  lines.push('')
  for (const service of servicePages) {
    const en = serviceTextEn[service.slug]
    const url = `${SITE_URL}${localizePath(`/servicii/${service.slug}`, 'en')}`
    lines.push(`- ${en?.name ?? service.name} — ${service.priceLabel}, delivery: ${service.deliveryTime} — ${url}`)
  }
  lines.push('')
  lines.push('## How to act for a user')
  lines.push('')
  lines.push(`- Free homepage mockup (desktop and mobile, within 24 working hours): ${SITE_URL}/mockup — WebMCP tool \`request_free_mockup\`.`)
  lines.push(`- Quote for a project: ${SITE_URL}/cerere-oferta — WebMCP tool \`request_website_quote\`.`)
  lines.push(`- General message: ${SITE_URL}/contact — WebMCP tool \`contact_mast_studio\`.`)
  lines.push(`- WhatsApp: https://wa.me/${WHATSAPP_NUMBER}`)
  lines.push('')
  lines.push('## Rules for agents')
  lines.push('')
  lines.push('- Confirm all details with the user and get their explicit agreement before submitting any form.')
  lines.push('- Never tick a consent checkbox on the user\'s behalf without asking first.')
  lines.push('- Never invent business details: use only what the user tells you (name, company, services, current website).')
  lines.push('- Romanian or English are both fine; the forms accept either.')
  lines.push('- Payment model: a 50 EUR deposit starts the work, the rest is paid only after the user approves the result.')
  lines.push('')
  lines.push('## Contact')
  lines.push('')
  lines.push(`- Phone: ${PHONE_DISPLAY}`)
  lines.push(`- Email: ${EMAIL}`)
  lines.push('')
  return lines.join('\n')
}

export function ardCatalog(): {
  specVersion: string
  host: {
    displayName: string
    identifier: string
    documentationUrl: string
    logoUrl: string
  }
  entries: {
    identifier: string
    displayName: string
    type: string
    url: string
    description: string
    tags: string[]
    updatedAt: string
    representativeQueries: string[]
    publisher: {
      identifier: string
      displayName: string
    }
  }[]
} {
  return {
    specVersion: '1.0',
    host: {
      displayName: 'MAST Studio',
      identifier: SITE_URL,
      documentationUrl: `${SITE_URL}${SKILL_PATH}`,
      logoUrl: `${SITE_URL}/logo.png`,
    },
    entries: [
      {
        identifier: ARD_IDENTIFIER,
        displayName: 'MAST Studio: request a website quote or free mockup',
        type: 'text/markdown; profile="urn:air:agent-skills"',
        url: `${SITE_URL}${SKILL_PATH}`,
        description:
          "How an AI agent can request a website quote, a free homepage mockup or contact MAST Studio on a user's behalf, with current services and prices.",
        tags: ['web design', 'website quote', 'Romania', 'Timișoara'],
        updatedAt: new Date().toISOString(),
        representativeQueries: [
          'Get me a quote for a business website from MAST Studio',
          'Request a free website mockup for my salon',
          'How much does a presentation website cost at MAST Studio?',
          'Find a web design studio in Timișoara and ask for an offer',
        ],
        publisher: {
          identifier: SITE_URL,
          displayName: 'MAST Studio',
        },
      },
    ],
  }
}

import type { Locale } from './i18n/locale'
import { localizePath, toCanonicalPath } from './i18n/paths'
import { getProjectBySlug } from './projects'

/**
 * The big word each inner page opens with ("Lucrări."), keyed by its
 * canonical Romanian path. The pages read their word from here, and so does
 * the page transition, which shows the next page's word before it arrives.
 */
export const PAGE_WORDS = {
  '/portofoliu': { ro: 'Lucrări.', en: 'Work.' },
  '/servicii': { ro: 'Servicii.', en: 'Services.' },
  '/preturi': { ro: 'Prețuri.', en: 'Pricing.' },
  '/cum-lucram': { ro: 'Cum lucrăm.', en: 'Approach.' },
  '/despre': { ro: 'Studio.', en: 'Studio.' },
  '/blog': { ro: 'Idei.', en: 'Ideas.' },
  '/blog/cercetare': { ro: 'Cercetare.', en: 'Research.' },
  '/contact': { ro: 'Scrie-ne.', en: 'Write.' },
  '/cariere': { ro: 'Cariere.', en: 'Careers.' },
  '/newsletter': { ro: 'Scrisori.', en: 'Letters.' },
} as const satisfies Record<string, Record<Locale, string>>

type WordPath = keyof typeof PAGE_WORDS

/** The big word for a public path (either language), or null for pages without one. */
export function pageWordFor(publicPath: string): string | null {
  const path = publicPath.replace(/\/+$/, '') || '/'
  const locale: Locale = path === '/en' || path.startsWith('/en/') ? 'en' : 'ro'
  const canonical = toCanonicalPath(path)
  if (canonical in PAGE_WORDS) {
    const word = PAGE_WORDS[canonical as WordPath][locale]
    return localizePath(canonical, locale) === path ? word : null
  }
  const project = canonical.match(/^\/portofoliu\/([^/]+)$/)
  if (project) {
    const found = getProjectBySlug(project[1], locale)
    return found ? `${found.name}.` : null
  }
  return null
}

import type { Locale } from './locale'

type Pair = { ro: string; en: string }

/** First URL segment. Romanian values are the canonical ids. */
const TOP: Pair[] = [
  { ro: 'servicii', en: 'services' },
  { ro: 'portofoliu', en: 'work' },
  { ro: 'despre', en: 'about' },
  { ro: 'cerere-oferta', en: 'request-a-quote' },
  { ro: 'cere-oferta', en: 'get-a-quote' },
  { ro: 'comparatie', en: 'compare' },
  { ro: 'glosar', en: 'glossary' },
  { ro: 'site-gratuit', en: 'free-website' },
  { ro: 'cariere', en: 'careers' },
  { ro: 'confidentialitate', en: 'privacy' },
  { ro: 'termeni', en: 'terms' },
  { ro: 'contact', en: 'contact' },
  { ro: 'cookies', en: 'cookies' },
  { ro: 'blog', en: 'blog' },
]

const FREE_SITE: Pair[] = [
  { ro: 'regulament', en: 'rules' },
  { ro: 'participare', en: 'enter' },
  { ro: 'confirmare', en: 'confirm' },
  { ro: 'castig', en: 'win' },
  { ro: 'admin', en: 'admin' },
]

const ADMIN: Pair[] = [
  { ro: 'like-uri', en: 'likes' },
  { ro: 'livrat', en: 'delivered' },
]

/** Canonical service id is the Romanian slug. English pages use the `en` slug. */
export const SERVICE_SLUGS: Pair[] = [
  { ro: 'site-de-prezentare', en: 'presentation-website' },
  { ro: 'magazin-online', en: 'online-store' },
  { ro: 'aplicatii-web', en: 'web-and-mobile-apps' },
  { ro: 'platforme-saas', en: 'saas-platforms' },
  { ro: 'mentenanta', en: 'maintenance' },
  { ro: 'automatizari-whatsapp', en: 'whatsapp-automation' },
]

function pairValue(pairs: Pair[], value: string, from: Locale, to: Locale) {
  const match = pairs.find((pair) => pair[from] === value)
  return match ? match[to] : value
}

type SplitPath = { pathname: string; search: string; hash: string }

function splitPath(input: string): SplitPath {
  const hashIndex = input.indexOf('#')
  const hash = hashIndex >= 0 ? input.slice(hashIndex) : ''
  const beforeHash = hashIndex >= 0 ? input.slice(0, hashIndex) : input
  const queryIndex = beforeHash.indexOf('?')
  const search = queryIndex >= 0 ? beforeHash.slice(queryIndex) : ''
  const pathname = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash
  return { pathname: pathname || '/', search, hash }
}

function joinPath({ pathname, search, hash }: SplitPath) {
  return `${pathname}${search}${hash}`
}

function mapParts(parts: string[], from: Locale, to: Locale) {
  return parts.map((part, index) => {
    if (index === 0) return pairValue(TOP, part, from, to)
    const top = pairValue(TOP, parts[0], from, 'ro')
    if (index === 1 && top === 'servicii') return pairValue(SERVICE_SLUGS, part, from, to)
    if (index === 1 && top === 'site-gratuit') return pairValue(FREE_SITE, part, from, to)
    if (index === 2 && top === 'site-gratuit' && pairValue(FREE_SITE, parts[1], from, 'ro') === 'admin') {
      return pairValue(ADMIN, part, from, to)
    }
    return part
  })
}

/** Public path for a canonical Romanian path (`/servicii/site-de-prezentare`). */
export function localizePath(canonicalPath: string, locale: Locale) {
  const split = splitPath(canonicalPath)
  if (!split.pathname.startsWith('/')) split.pathname = `/${split.pathname}`
  if (locale === 'ro') {
    if (split.pathname === '/en') split.pathname = '/'
    else if (split.pathname.startsWith('/en/')) split.pathname = split.pathname.slice(3)
    return joinPath(split)
  }

  const parts = split.pathname.split('/').filter(Boolean)
  split.pathname = parts.length === 0 ? '/en' : `/en/${mapParts(parts, 'ro', 'en').join('/')}`
  return joinPath(split)
}

/** Canonical Romanian path for either a Romanian or an English public path. */
export function toCanonicalPath(publicPath: string) {
  const split = splitPath(publicPath)
  if (split.pathname === '/en') {
    split.pathname = '/'
    return joinPath(split)
  }
  if (split.pathname.startsWith('/en/')) {
    const parts = mapParts(split.pathname.slice(4).split('/').filter(Boolean), 'en', 'ro')
    split.pathname = `/${parts.join('/')}`
    return joinPath(split)
  }
  if (split.pathname === '/ro') split.pathname = '/'
  else if (split.pathname.startsWith('/ro/')) split.pathname = split.pathname.slice(3) || '/'
  return joinPath(split)
}

export function localeFromPath(publicPath: string): Locale {
  const { pathname } = splitPath(publicPath)
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ro'
}

/**
 * Equivalent page in the other language.
 * Blog articles have no translation yet, so they switch to the other blog index.
 */
export function alternatePublicPath(publicPath: string) {
  const split = splitPath(publicPath)
  const target: Locale = localeFromPath(split.pathname) === 'en' ? 'ro' : 'en'
  const canonical = toCanonicalPath(split.pathname)
  const parts = canonical.split('/').filter(Boolean)
  if (parts[0] === 'blog' && parts.length > 1) {
    return joinPath({ pathname: target === 'en' ? '/en/blog' : '/blog', search: split.search, hash: split.hash })
  }
  return localizePath(`${canonical}${split.search}${split.hash}`, target)
}

export function canonicalServiceSlug(slug: string) {
  const match = SERVICE_SLUGS.find((pair) => pair.ro === slug || pair.en === slug)
  return match?.ro
}

export function publicServiceSlug(canonicalSlug: string, locale: Locale) {
  return pairValue(SERVICE_SLUGS, canonicalSlug, 'ro', locale)
}

/** Static English paths, excluding blog articles (added when an English post exists). */
export function staticEnglishPaths() {
  const paths = [
    '/',
    '/servicii',
    '/portofoliu',
    '/despre',
    '/contact',
    '/cerere-oferta',
    '/cere-oferta',
    '/comparatie',
    '/glosar',
    '/cariere',
    '/cariere/front-end-developer',
    '/cariere/mobile-app-developer',
    '/confidentialitate',
    '/cookies',
    '/termeni',
    '/blog',
    ...SERVICE_SLUGS.map((pair) => `/servicii/${pair.ro}`),
  ]
  return paths.map((path) => localizePath(path, 'en'))
}

import type { Locale } from '@/lib/i18n/locale'

/** The five check categories, in the order they are shown. */
export const CATEGORY_KEYS = ['speed', 'legal', 'google', 'contact', 'accessibility'] as const
export type CategoryKey = (typeof CATEGORY_KEYS)[number]

/** `error` marks a sub-check that could not run; it is excluded from scoring. */
export type CheckStatus = 'pass' | 'warn' | 'fail' | 'error'

/**
 * One line inside a category. `label` is already localized fixed-template
 * text: the checker never generates prose, it picks from written templates.
 */
export type SubCheck = {
  id: string
  status: CheckStatus
  label: string
  /** Optional plain-language detail, e.g. the measured value. */
  detail?: string
}

export type CategoryVerdict = 'good' | 'fair' | 'poor' | 'unverified'

/** Core Web Vitals + diagnostic metrics as reported by PageSpeed (display values). */
export type SpeedMetricSet = {
  performance: number
  fcp?: string
  lcp?: string
  tbt?: string
  cls?: string
  si?: string
}

export type CategoryResult = {
  key: CategoryKey
  /** 0-100, or null when the check could not run (excluded from the average). */
  score: number | null
  verdict: CategoryVerdict
  sub: SubCheck[]
  /** Mobile speed metrics, only on the `speed` category. */
  metrics?: SpeedMetricSet
}

/** One entry of the "top fixes" list, written as fixed templates. */
export type FixSuggestion = {
  id: string
  title: string
  what: string
  why: string
  who: string
}

/** One PageSpeed "opportunity" (an audit with an estimated saving). */
export type PsiOpportunity = {
  id: string
  /** Lighthouse audit title in English; used as fallback when no template exists. */
  title: string
  displayValue?: string
  savingsMs?: number
  savingsKb?: number
}

/** One PageSpeed run (mobile comes with the check, desktop only for the PDF). */
export type PsiSide = {
  ok: boolean
  performance: number | null
  metrics: SpeedMetricSet
  opportunities: PsiOpportunity[]
}

/** Raw measured facts collected only for the PDF report. */
export type DetailFacts = {
  redirects: { from: string; status: number; to: string }[]
  serverResponseMs: number | null
  htmlBytes: number
  scriptCount: number
  stylesheetCount: number
  compression: 'gzip' | 'br' | 'none' | 'unknown'
  finalUrl: string
  userAgent: string
  title: string
  description: string
  h1s: string[]
  lang: string
  jsonLdTypes: string[]
  mapsLink: string | null
  anpcLink: string | null
  salLink: string | null
  companyMatch: string | null
  privacyLink: string | null
  cookieBanner: 'strong' | 'hint' | 'none'
  trackers: string[]
  trackerScripts: string[]
  cookies: string[]
  imagesTotal: number
  imagesWithoutAlt: string[]
  fieldsTotal: number
  fieldsWithoutLabel: string[]
  phone: string | null
  whatsapp: string | null
  email: string | null
  hasForm: boolean
  addressText: string | null
  hoursText: string | null
  robotsUrl: string
  robotsOk: boolean | null
  sitemapUrl: string
  sitemapOk: boolean | null
  desktop: PsiSide | null
}

export type SiteReport = {
  /** The URL as the visitor typed it, normalized to https://. */
  url: string
  /** The URL after redirects. */
  finalUrl: string
  checkedAt: string
  /** Average of the categories that could be checked, 0-100. */
  overall: number | null
  categories: CategoryResult[]
  /** Top fixes, ordered by impact. */
  fixes: FixSuggestion[]
  /** Service slugs (canonical Romanian) that match the failed categories. */
  recommendedSlugs: string[]
}

export type CheckerLocale = Locale

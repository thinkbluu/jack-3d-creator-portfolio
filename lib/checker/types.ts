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

export type CategoryResult = {
  key: CategoryKey
  /** 0-100, or null when the check could not run (excluded from the average). */
  score: number | null
  verdict: CategoryVerdict
  sub: SubCheck[]
  /** Mobile speed metrics, only on the `speed` category. */
  metrics?: { performance: number; lcp?: string; cls?: string }
}

/** One entry of the "top fixes" list, written as fixed templates. */
export type FixSuggestion = {
  id: string
  title: string
  what: string
  why: string
  who: string
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

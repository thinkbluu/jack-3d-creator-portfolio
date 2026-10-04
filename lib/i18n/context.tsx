'use client'

import { createContext, useContext, useMemo } from 'react'
import { localizePath } from './paths'
import { DEFAULT_LOCALE, type Locale } from './locale'
import { ui, type UiCopy } from './ui'

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE)

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  return useContext(LocaleContext)
}

export function useUi(): UiCopy {
  return ui[useLocale()]
}

/** Turn a canonical Romanian path into the public path for the active locale. */
export function useHref() {
  const locale = useLocale()
  return useMemo(() => (canonicalPath: string) => localizePath(canonicalPath, locale), [locale])
}

export const LOCALES = ['ro', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'ro'

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export function htmlLang(locale: Locale) {
  return locale === 'en' ? 'en' : 'ro'
}

export function ogLocale(locale: Locale) {
  return locale === 'en' ? 'en_US' : 'ro_RO'
}

export function schemaLanguage(locale: Locale) {
  return locale === 'en' ? 'en' : 'ro-RO'
}

export function intlLocale(locale: Locale) {
  return locale === 'en' ? 'en-GB' : 'ro-RO'
}

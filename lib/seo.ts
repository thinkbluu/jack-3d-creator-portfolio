import type { Metadata } from 'next'
import { alternatePublicPath, toCanonicalPath } from './i18n/paths'
import { ogLocale, type Locale } from './i18n/locale'
import { ui } from './i18n/ui'
import { DEFAULT_OG_IMAGE_PATH, SITE_NAME, absoluteUrl } from './site'

export const TITLE_SUFFIX = ` | ${SITE_NAME}`
// Google truncates titles at roughly 60 characters on mobile.
export const MAX_TITLE_LENGTH = 60

export type SeoImage = {
  url: string
  alt: string
  width?: number
  height?: number
}

export const DEFAULT_OG_IMAGE: SeoImage = {
  url: DEFAULT_OG_IMAGE_PATH,
  width: 1200,
  height: 630,
  alt: ui.ro.meta.ogAlt,
}

export function defaultOgImage(locale: Locale = 'ro'): SeoImage {
  return {
    url: locale === 'en' ? '/en/opengraph-image' : DEFAULT_OG_IMAGE_PATH,
    width: 1200,
    height: 630,
    alt: ui[locale].meta.ogAlt,
  }
}

type PageMetadataInput = {
  /** Page title without the brand suffix; the suffix is added when it fits. */
  title: string
  description: string
  /** Path of the canonical URL, e.g. `/blog/slug`. */
  path: string
  /** Title for social previews; defaults to `title`. */
  socialTitle?: string
  image?: SeoImage
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  noindex?: boolean
  /** Use the title exactly as given (no brand suffix). */
  absoluteTitle?: boolean
  locale?: Locale
  /**
   * Mirror this page in the other language (default).
   * Pass false for content that exists in only one language, such as a Romanian article.
   */
  hreflang?: boolean
}

/** Appends ` | MAST Studio` unless the result would be truncated in search results. */
export function resolveTitle(title: string) {
  const clean = stripBrandSuffix(title)
  return clean.length + TITLE_SUFFIX.length <= MAX_TITLE_LENGTH ? `${clean}${TITLE_SUFFIX}` : clean
}

/** Removes a trailing `| MAST` / `| MAST Studio` that authors sometimes add by hand. */
export function stripBrandSuffix(title: string) {
  return title.replace(/\s*[|·–-]\s*MAST(\s+Studio)?\s*$/i, '').trim()
}

export function pageMetadata({
  title,
  description,
  path,
  socialTitle,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  noindex = false,
  absoluteTitle = false,
  locale = 'ro',
  hreflang = true,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path)
  const documentTitle = absoluteTitle ? title : resolveTitle(title)
  const shareTitle = socialTitle ?? stripBrandSuffix(title)
  const resolvedImage = image === DEFAULT_OG_IMAGE ? defaultOgImage(locale) : image
  const images = [{ url: resolvedImage.url, width: resolvedImage.width ?? 1200, height: resolvedImage.height ?? 630, alt: resolvedImage.alt }]
  const languages: Record<string, string> = {}
  if (hreflang) {
    const roPath = locale === 'ro' ? path : toCanonicalPath(path)
    const enPath = locale === 'en' ? path : alternatePublicPath(path)
    languages.ro = absoluteUrl(roPath)
    languages.en = absoluteUrl(enPath)
    languages['x-default'] = languages.ro
  } else {
    languages[locale] = url
    languages['x-default'] = locale === 'ro' ? url : absoluteUrl('/')
  }

  return {
    title: { absolute: documentTitle },
    description,
    alternates: { canonical: url, languages },
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      alternateLocale: locale === 'en' ? 'ro_RO' : 'en_US',
      title: shareTitle,
      description,
      images,
      ...(type === 'article' && publishedTime ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description,
      images: images.map((item) => ({ url: item.url, alt: item.alt })),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

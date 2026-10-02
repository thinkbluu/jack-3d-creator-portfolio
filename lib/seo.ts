import type { Metadata } from 'next'

export const defaultOgImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'MAST Studio — site-ul potrivit începe cu întrebarea potrivită',
}

export const defaultTwitterImage = '/twitter-image'

type SocialImage = {
  url: string
  width?: number
  height?: number
  alt?: string
}

type PageSocialInput = {
  title: string
  description: string
  url: string
  type?: 'website' | 'article'
  image?: SocialImage
  publishedTime?: string
  modifiedTime?: string
}

// A page-level `openGraph` or `twitter` object replaces the layout's, so each page sets its own tags.
export function getPageSocialMetadata({
  title,
  description,
  url,
  type = 'website',
  image,
  publishedTime,
  modifiedTime,
}: PageSocialInput): Pick<Metadata, 'openGraph' | 'twitter'> {
  const ogImage = image
    ? {
        url: image.url,
        alt: image.alt ?? title,
        ...(typeof image.width === 'number' ? { width: image.width } : {}),
        ...(typeof image.height === 'number' ? { height: image.height } : {}),
      }
    : defaultOgImage

  const shared = {
    locale: 'ro_RO',
    url,
    siteName: 'MAST Studio',
    title,
    description,
    images: [ogImage],
  }

  const openGraph: Metadata['openGraph'] =
    type === 'article'
      ? {
          ...shared,
          type: 'article',
          ...(publishedTime ? { publishedTime } : {}),
          ...(modifiedTime ? { modifiedTime } : {}),
        }
      : {
          ...shared,
          type: 'website',
        }

  return {
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image.url] : [defaultTwitterImage],
    },
  }
}

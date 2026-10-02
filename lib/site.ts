// Single source of truth for the business identity used in the UI, metadata
// and structured data. Keep it identical to the Google Business Profile and
// directory listings.

export const SITE_URL = 'https://maststudio.ro'
export const SITE_NAME = 'MAST Studio'
export const SITE_LOCALE = 'ro_RO'
export const SITE_LANGUAGE = 'ro-RO'

export const LEGAL_NAME = 'MAST Consult S.R.L.'
export const VAT_ID = 'RO49626121'
export const TRADE_REGISTER_NUMBER = 'J2024000723352'

export const WHATSAPP_NUMBER = '40746382204'
export const PHONE_E164 = `+${WHATSAPP_NUMBER}`
export const PHONE_DISPLAY = '+40 746 382 204'
export const PHONE_HREF = `tel:${PHONE_E164}`
export const EMAIL = 'contact@maststudio.ro'
export const EMAIL_HREF = `mailto:${EMAIL}`

// The studio works remotely and has no office open to visitors, so the site
// names only the city. The street address is the registered office and appears
// only where the law asks for it: terms, privacy, cookies and contest rules.
export const LOCATION = {
  locality: 'Timișoara',
  region: 'Timiș',
  countryCode: 'RO',
  country: 'România',
} as const

export const REGISTERED_OFFICE = 'Str. Victor Valcovici 19, cod 300503, Timișoara, județul Timiș'

export const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61593130697502'
export const INSTAGRAM_URL = 'https://www.instagram.com/maststudio.ro/'
export const INSTAGRAM_HANDLE = '@maststudio.ro'

export const SOCIAL_LINKS = [
  { label: 'Facebook', url: FACEBOOK_URL },
  { label: 'Instagram', url: INSTAGRAM_URL },
] as const

// Feed `sameAs` in the business structured data. Add the Google Business
// Profile and LinkedIn URLs here once they exist.
export const SOCIAL_PROFILES: string[] = SOCIAL_LINKS.map((link) => link.url)

// Alternative dispute resolution platform of ANPC (Ordinul ANPC 449/2022,
// modified by Ordinul 270/2026). The EU ODR (SOL) platform closed in July 2025.
export const ANPC_SAL_URL = 'https://reclamatiisal.anpc.ro/'

export const BUSINESS_ID = `${SITE_URL}/#business`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const LOGO_URL = `${SITE_URL}/logo.png`
export const DEFAULT_OG_IMAGE_PATH = '/opengraph-image'

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//.test(path)) return path
  if (path === '/' || path === '') return SITE_URL
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

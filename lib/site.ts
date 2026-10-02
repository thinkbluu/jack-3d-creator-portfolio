// Single source of truth for the business identity (NAP) used in the UI,
// metadata and structured data. Keep it identical to the Google Business
// Profile and directory listings.

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

export const ADDRESS = {
  street: 'Str. Victor Valcovici 19',
  postalCode: '300503',
  locality: 'Timișoara',
  region: 'Timiș',
  countryCode: 'RO',
  country: 'România',
} as const

export const ADDRESS_LINE = `${ADDRESS.street}, ${ADDRESS.postalCode} ${ADDRESS.locality}, jud. ${ADDRESS.region}`
export const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${ADDRESS.street}, ${ADDRESS.postalCode} ${ADDRESS.locality}, ${ADDRESS.country}`)}`

// Add the Google Business Profile, Facebook, Instagram and LinkedIn URLs here
// once they exist. They feed `sameAs` in the business structured data.
export const SOCIAL_PROFILES: string[] = []

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

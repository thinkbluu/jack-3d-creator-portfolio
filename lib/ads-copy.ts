// Copy shared by the Google Ads landing surfaces (/oferta and the two service
// pages the campaign points at). Change a line here and every surface follows.

/** Response-time microcopy shown under the hero buttons. One constant on purpose. */
export const RESPONSE_MICROCOPY: Record<'ro' | 'en', string> = {
  ro: 'Răspundem în 15 minute, de luni până sâmbătă, 08–21.',
  en: 'We reply within 15 minutes, Monday to Saturday, 08–21.',
}

/** WhatsApp prefill per landing page, so each conversation starts named. */
export const ADS_WA_MESSAGES = {
  oferta: 'Salut! Vreau un site de prezentare pentru firma mea. Am văzut oferta de pe site.',
  'magazin-online': 'Salut! Vreau un magazin online. Am văzut pagina magazin online de pe site.',
  'refacere-site': 'Salut! Vreau să refac site-ul firmei. Am văzut pagina de refacere site de pe site.',
} as const

export type AdsLandingId = keyof typeof ADS_WA_MESSAGES

/** "De la tine avem nevoie doar de" items, per landing. */
export const ADS_NEEDS: Record<AdsLandingId, { ro: string[]; en: string[] }> = {
  oferta: {
    ro: ['logo-ul, dacă ai', '3-4 poze (sau le găsim noi)', 'un telefon de 15 minute'],
    en: ['your logo, if you have one', '3-4 photos (or we find them)', 'a 15-minute phone call'],
  },
  'magazin-online': {
    ro: ['lista de produse în Excel sau poze', 'logo-ul, dacă ai', 'un telefon de 15 minute'],
    en: ['your product list in Excel or photos', 'your logo, if you have one', 'a 15-minute phone call'],
  },
  'refacere-site': {
    ro: ['adresa site-ului actual', 'un telefon de 15 minute'],
    en: ['the address of your current website', 'a 15-minute phone call'],
  },
}

/** The closing reassurance under the needs list. */
export const ADS_NEEDS_NOTE: Record<'ro' | 'en', string> = {
  ro: 'Nu trebuie să scrii nimic.',
  en: 'You don’t have to write anything.',
}

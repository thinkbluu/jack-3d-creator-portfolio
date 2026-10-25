// Time-limited "no deposit" offer (November 2026). Every place that shows
// deposit copy picks between the offer variant and the regular one with
// isNoDepositActive(), evaluated at render time (never at module scope, so
// ISR revalidation can flip the copy without a redeploy).

export const NO_DEPOSIT_UNTIL = '2026-11-30T23:59:59+02:00' // Europe/Bucharest

export function isNoDepositActive(date: Date = new Date()): boolean {
  const until = Date.parse(NO_DEPOSIT_UNTIL)
  if (Number.isNaN(until)) return false
  return date.getTime() <= until
}

export type Locale = 'ro' | 'en'

/** One-line conditions shown next to the offer (hero and /preturi). */
export const offerConditions: Record<Locale, string> = {
  ro: 'Condiții: începem când avem materialele complete, site-ul rămâne pe adresa noastră de test până la plată, iar decizia o iei în 7 zile de la livrare.',
  en: 'Conditions: we start once we have your complete materials, the site stays on our test address until payment, and you decide within 7 days of delivery.',
}

/** Announcement bar copy, linking to the pricing page (canonical path). */
export const offerBar: Record<Locale, { text: string; href: string }> = {
  ro: { text: 'Fără avans în noiembrie. Plătești doar dacă îți place. →', href: '/preturi' },
  en: { text: 'No deposit in November. Pay only if you like it. →', href: '/preturi' },
}

/** Hero value line variants shown while the offer is active. */
export const heroSubheadsOffer: Record<Locale, Record<string, string>> = {
  ro: {
    default: 'Site-uri de prezentare de la 300 EUR, live în 48 de ore. În noiembrie, fără avans: plătești doar dacă îți place.',
    salon: 'Rezervări online non-stop și mai puține programări ratate. În noiembrie, fără avans: plătești doar dacă îți place.',
    servicii: 'Cereri de ofertă, nu doar vizite. În noiembrie, fără avans: plătești doar dacă îți place.',
    ecommerce: 'Vinzi și noaptea, cu plăți și facturi automate. În noiembrie, fără avans: plătești doar dacă îți place.',
    platforma: 'De la idee la primii utilizatori. Discutăm întâi, apoi facem oferta.',
  },
  en: {
    default: 'Presentation websites from 300 EUR, live in 48 hours. In November, no deposit: you pay only if you like it.',
    salon: 'Bookings around the clock, and fewer missed appointments. In November, no deposit: you pay only if you like it.',
    servicii: 'Quote requests, not just visits. In November, no deposit: you pay only if you like it.',
    ecommerce: 'You sell at night too, with payments and invoices handled automatically. In November, no deposit: you pay only if you like it.',
    platforma: 'From idea to first users. We talk first, then we quote.',
  },
}

/** Manifest third pair while the offer is active. */
export const manifestPairOffer: Record<Locale, { other: string; before: string; highlight: string; after: string }> = {
  ro: { other: 'Alții cer 50% avans.', before: 'Noi, în noiembrie, ', highlight: 'nimic', after: '.' },
  en: { other: 'Others ask for a 50% deposit.', before: 'In November, we ask for ', highlight: 'nothing', after: '.' },
}

/** Home metadata variants while the offer is active. */
export const homeMetaOffer: Record<
  Locale,
  { defaultDescription: string; ogSubtitle: string; homeDescription: string }
> = {
  ro: {
    defaultDescription:
      'Studio de web design din Timișoara: creare site de prezentare de la 300 EUR, live în 48 de ore, și magazine online de la 900 EUR. În noiembrie, fără avans: plătești doar dacă ești mulțumit.',
    ogSubtitle: 'Studio de web design · site de prezentare de la 300 EUR · magazine online de la 900 EUR · fără avans în noiembrie',
    homeDescription:
      'Studio de web design din Timișoara: creare site de prezentare de la 300 EUR, live în 48 de ore, și magazine online de la 900 EUR. În noiembrie, fără avans.',
  },
  en: {
    defaultDescription:
      'A web design studio in Timișoara: presentation websites from 300 EUR, live in 48 hours, and online stores from 900 EUR. In November, no deposit: you pay only if you’re happy.',
    ogSubtitle: 'Web design studio · presentation websites from 300 EUR · online stores from 900 EUR · no deposit in November',
    homeDescription:
      'A web design studio in Timișoara: presentation websites from 300 EUR, live in 48 hours, and online stores from 900 EUR. In November, no deposit.',
  },
}

/** Thank-you page "what happens next" step while the offer is active. */
export const thanksStepOffer: Record<Locale, string> = {
  ro: 'Dacă ți se potrivește, trimiți materialele și începem; plătești doar dacă îți place.',
  en: 'If it looks right, you send your materials and we start; you pay only if you like it.',
}

/** Services index intro (studio mode) while the offer is active. */
export const servicesIntroOffer: Record<Locale, string> = {
  ro: 'Prețuri la vedere, ofertă fixă, fără surprize. În noiembrie, fără avans: plătești doar dacă îți place.',
  en: 'Prices in the open, fixed quotes, no surprises. In November, no deposit: you pay only if you like it.',
}

/** Service page copy overrides while the offer is active, keyed by slug. */
export const serviceOfferCopy: Record<
  Locale,
  Record<string, { answerCapsule?: string; metaDescription?: string }>
> = {
  ro: {
    'site-de-prezentare': {
      answerCapsule:
        'Un site de prezentare la MAST Studio costă de la 300 EUR și este livrat live în 48 de ore de la primirea materialelor. Include design unic, texte scrise de noi, versiune pentru mobil și optimizare de viteză. În noiembrie, fără avans: plătești doar dacă ești mulțumit de rezultat.',
    },
    'magazin-online': {
      metaDescription:
        'Creare magazin online cu plată cu cardul, gestionare comenzi, facturare și curieri. De la 900 EUR, livrat în 7 zile după materiale. În noiembrie, fără avans.',
      answerCapsule:
        'Un magazin online la MAST Studio costă de la 900 EUR și este livrat în 7 zile. Include catalog de produse, plată cu cardul, gestionare comenzi și integrare cu programul de facturare. În noiembrie, fără avans: plătești doar dacă ești mulțumit.',
    },
  },
  en: {
    'site-de-prezentare': {
      answerCapsule:
        'A presentation website at MAST Studio starts at 300 EUR and goes live in 48 hours from the moment we receive your materials. It includes a unique design, copy we write, a mobile version, and speed optimisation. In November, no deposit: you pay only if you are happy with the result.',
    },
    'magazin-online': {
      metaDescription:
        'An online store with card payments, order management, invoicing, and couriers. From 900 EUR, delivered in 7 days after your materials. In November, no deposit.',
      answerCapsule:
        'An online store at MAST Studio starts at 900 EUR and is delivered in 7 days. It includes a product catalogue, card payments, order management, and a connection to your invoicing software. In November, no deposit: you pay only if you are happy.',
    },
  },
}

/** llms.txt deposit paragraph while the offer is active. */
export const llmsParagraphOffer =
  'În noiembrie 2026, clientul nu plătește avans. Vede site-ul finalizat, live pe adresa noastră de test, și plătește doar dacă este mulțumit de rezultat. Prima rundă de modificări este inclusă.'

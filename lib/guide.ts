import { getAllIndustries } from './industries'
import type { Locale } from './i18n/locale'
import { servicePages } from './services'

/**
 * The "which service do you need" guide (/ce-iti-trebuie). Three questions;
 * with JavaScript one per screen, without it all of them on one page as a
 * plain form whose submit renders the result server-side from query params.
 * The mapping points only at existing service slugs — validated at module
 * load so the build fails loudly if a slug is renamed or removed.
 *
 * The guide never invents prices: the result screen shows the service's
 * existing `priceLabel`, read through the same localized getter the service
 * pages use, so the offer copy and the EN labels apply.
 */

export type GuideOption = {
  /** Stable id used in the mapping and the query params. */
  id: string
  label: string
  /** Short phrase that fits inside the WhatsApp summary sentence. */
  summary: string
}

export type GuideQuestion = {
  id: string
  prompt: string
  options: GuideOption[]
}

export type GuideCopy = {
  seoTitle: string
  metaDescription: string
  title: string
  lead: string
  intro: string
  progressTemplate: string
  back: string
  next: string
  resultKicker: string
  resultTitle: string
  resultLead: string
  priceLabel: string
  industryLabel: string
  whatsappLabel: string
  whatsappTemplate: string
  restart: string
  formSubmit: string
  formLegend: string
  otherOption: string
  otherSummary: string
  industryPrompt: string
  andSeparator: string
  resultAnnouncement: string
}

export const guideGoalQuestion: Record<Locale, GuideQuestion> = {
  ro: {
    id: 'goal',
    prompt: 'Ce vrei să obții?',
    options: [
      { id: 'gasit', label: 'Să fiu găsit și contactat', summary: 'fiu găsit și contactat' },
      { id: 'vand', label: 'Să vând online', summary: 'vând online' },
      { id: 'automatizez', label: 'Să automatizez munca', summary: 'automatizez munca' },
      { id: 'produs', label: 'Să construiesc un produs', summary: 'construiesc un produs' },
      { id: 'repar', label: 'Să-mi repar site-ul existent', summary: 'îmi repar site-ul existent' },
    ],
  },
  en: {
    id: 'goal',
    prompt: 'What do you want to achieve?',
    options: [
      { id: 'gasit', label: 'Get found and contacted', summary: 'to be found and contacted' },
      { id: 'vand', label: 'Sell online', summary: 'to sell online' },
      { id: 'automatizez', label: 'Automate my work', summary: 'to automate my work' },
      { id: 'produs', label: 'Build a product', summary: 'to build a product' },
      { id: 'repar', label: 'Fix my existing website', summary: 'to fix my existing website' },
    ],
  },
}

/** The second question, chosen by the first answer. */
export const guideBranches: Record<Locale, Record<string, GuideQuestion>> = {
  ro: {
    gasit: {
      id: 'site',
      prompt: 'Ai deja site?',
      options: [
        { id: 'nu', label: 'Nu', summary: 'nu am site încă' },
        { id: 'vechi', label: 'Da, dar e vechi', summary: 'am un site, dar e vechi' },
      ],
    },
    vand: {
      id: 'produse',
      prompt: 'Câte produse?',
      options: [
        { id: 'sub50', label: 'Sub 50', summary: 'sub 50 de produse' },
        { id: '500', label: '50–500', summary: 'între 50 și 500 de produse' },
        { id: 'peste500', label: 'Peste 500', summary: 'peste 500 de produse' },
      ],
    },
    automatizez: {
      id: 'consuma',
      prompt: 'Ce te consumă cel mai mult?',
      options: [
        { id: 'mesaje', label: 'Mesajele clienților', summary: 'cel mai mult mă consumă mesajele clienților' },
        { id: 'programari', label: 'Programările', summary: 'cel mai mult mă consumă programările' },
        { id: 'documente', label: 'Documentele și ofertele', summary: 'cel mai mult mă consumă documentele și ofertele' },
        { id: 'nustiu', label: 'Nu știu încă', summary: 'nu știu încă ce mă consumă cel mai mult' },
      ],
    },
    produs: {
      id: 'stadiu',
      prompt: 'În ce stadiu ești?',
      options: [
        { id: 'idee', label: 'Doar idee', summary: 'am doar o idee' },
        { id: 'clienti', label: 'Am clienți interesați', summary: 'am clienți interesați' },
        { id: 'versiune', label: 'Am deja o versiune', summary: 'am deja o versiune' },
      ],
    },
    repar: {
      id: 'deranjeaza',
      prompt: 'Ce te deranjează?',
      options: [
        { id: 'lent', label: 'E lent sau urât', summary: 'e lent sau urât' },
        { id: 'legal', label: 'Nu sunt sigur că e legal', summary: 'nu sunt sigur că e legal' },
        { id: 'securitate', label: 'Mă tem de securitate', summary: 'mă tem de securitate' },
      ],
    },
  },
  en: {
    gasit: {
      id: 'site',
      prompt: 'Do you already have a website?',
      options: [
        { id: 'nu', label: 'No', summary: "I don't have a site yet" },
        { id: 'vechi', label: 'Yes, but it is outdated', summary: "I have a site, but it's outdated" },
      ],
    },
    vand: {
      id: 'produse',
      prompt: 'How many products?',
      options: [
        { id: 'sub50', label: 'Under 50', summary: 'under 50 products' },
        { id: '500', label: '50–500', summary: 'between 50 and 500 products' },
        { id: 'peste500', label: 'Over 500', summary: 'over 500 products' },
      ],
    },
    automatizez: {
      id: 'consuma',
      prompt: 'What drains you the most?',
      options: [
        { id: 'mesaje', label: 'Customer messages', summary: 'what drains me most is customer messages' },
        { id: 'programari', label: 'Bookings', summary: 'what drains me most is bookings' },
        { id: 'documente', label: 'Documents and quotes', summary: 'what drains me most is documents and quotes' },
        { id: 'nustiu', label: "I don't know yet", summary: "I don't know yet what drains me most" },
      ],
    },
    produs: {
      id: 'stadiu',
      prompt: 'What stage are you at?',
      options: [
        { id: 'idee', label: 'Just an idea', summary: "it's just an idea" },
        { id: 'clienti', label: 'I have interested clients', summary: 'I have interested clients' },
        { id: 'versiune', label: 'I already have a version', summary: 'I already have a version' },
      ],
    },
    repar: {
      id: 'deranjeaza',
      prompt: 'What bothers you about it?',
      options: [
        { id: 'lent', label: "It's slow or ugly", summary: "it's slow or ugly" },
        { id: 'legal', label: "I'm not sure it's legal", summary: "I'm not sure it's legal" },
        { id: 'securitate', label: "I'm worried about security", summary: "I'm worried about security" },
      ],
    },
  },
}

/** The six industries from lib/industries, plus "other". */
export const GUIDE_INDUSTRY_SLUGS = [
  'clinici-medicale',
  'cabinete-veterinare',
  'saloane-infrumusetare',
  'avocati-contabili',
  'meseriasi',
  'magazine-online',
] as const

export const GUIDE_OTHER_ID = 'altul'

/**
 * Answer key `${goal}:${follow}` → recommended service slugs, in order.
 * Every slug must exist in lib/services (validated below).
 */
export const GUIDE_PATHS: Record<string, string[]> = {
  'gasit:nu': ['site-de-prezentare', 'seo-local'],
  'gasit:vechi': ['refacere-site', 'vizibilitate-ai'],
  'vand:sub50': ['magazin-online', 'conformitate-legala-site'],
  'vand:500': ['magazin-online', 'conformitate-legala-site'],
  'vand:peste500': ['magazin-online', 'conformitate-legala-site'],
  'automatizez:mesaje': ['asistent-ai', 'automatizari-whatsapp'],
  'automatizez:programari': ['sistem-programari-online'],
  'automatizez:documente': ['automatizari-ai'],
  'automatizez:nustiu': ['audit-strategie-ai'],
  'produs:idee': ['mvp-startup'],
  'produs:clienti': ['mvp-startup', 'design-ux-ui'],
  'produs:versiune': ['platforme-saas', 'aplicatii-mobile'],
  'repar:lent': ['refacere-site'],
  'repar:legal': ['conformitate-legala-site'],
  'repar:securitate': ['audit-securitate-gdpr'],
}

export type GuideAnswers = { goal?: string; follow?: string; industry?: string }

/** "A, B și C" — a list that reads naturally inside a sentence. */
export function joinNatural(items: string[], separator: string): string {
  if (items.length <= 1) return items.join('')
  return `${items.slice(0, -1).join(', ')}${separator}${items[items.length - 1]}`
}

export type GuideResolution = {
  serviceSlugs: string[]
  /** Canonical industry slug, or null for "other" / unanswered. */
  industrySlug: string | null
}

/** Resolve the three answers to the recommended services. Returns null while the answers are incomplete or invalid. */
export function resolveGuide(answers: GuideAnswers): GuideResolution | null {
  const goal = guideGoalQuestion.ro.options.find((option) => option.id === answers.goal)
  if (!goal) return null
  const branch = guideBranches.ro[goal.id]
  const follow = branch.options.find((option) => option.id === answers.follow)
  if (!follow) return null
  const serviceSlugs = GUIDE_PATHS[`${goal.id}:${follow.id}`]
  if (!serviceSlugs) return null
  const industrySlug =
    answers.industry && answers.industry !== GUIDE_OTHER_ID && GUIDE_INDUSTRY_SLUGS.includes(answers.industry as (typeof GUIDE_INDUSTRY_SLUGS)[number])
      ? answers.industry
      : null
  return { serviceSlugs, industrySlug }
}

export const guideCopy: Record<Locale, GuideCopy> = {
  ro: {
    seoTitle: 'Ce serviciu web îți trebuie? Ghid rapid',
    metaDescription:
      'Răspunde la trei întrebări și află ce îți trebuie: site, magazin online, aplicație sau AI, cu prețul de pornire și pașii următori. Durează 30 de secunde.',
    title: 'Ghid: ce serviciu îți trebuie',
    lead: 'Trei întrebări, un răspuns clar.',
    intro:
      'Răspunzi la trei întrebări și îți spunem ce serviciu se potrivește, cu prețul de pornire și cu ce pas urmează. Fără termeni tehnici, fără obligații.',
    progressTemplate: 'Întrebarea {step} din {total}',
    back: 'Înapoi la întrebarea anterioară',
    next: 'Continuă',
    resultKicker: 'Recomandarea',
    resultTitle: 'Ce ți se potrivește',
    resultLead: 'Pe baza răspunsurilor tale, aceste servicii sunt punctul de plecare potrivit.',
    priceLabel: 'Preț de pornire',
    industryLabel: 'Pentru domeniul tău',
    whatsappLabel: 'Discută pe WhatsApp',
    whatsappTemplate: 'Salut! Am completat ghidul de pe site: vreau să {a1}, {a2}, {a3}. Mi-ați recomandat {services}.',
    restart: 'Reia ghidul',
    formSubmit: 'Vezi recomandarea',
    formLegend: 'Ghid de orientare — răspunde la toate cele trei întrebări',
    otherOption: 'Altul',
    otherSummary: 'într-un alt domeniu',
    industryPrompt: 'Ce domeniu?',
    andSeparator: ' și ',
    resultAnnouncement: 'Recomandarea noastră: {services}.',
  },
  en: {
    seoTitle: 'Which web service do you need? Quick guide',
    metaDescription:
      'Answer three questions and find out what you need: a website, an online store, an app or AI, with the starting price and the next steps. Takes 30 seconds.',
    title: 'Guide: what you need',
    lead: 'Three questions, one clear answer.',
    intro:
      'Answer three questions and we will tell you which service fits, with the starting price and the next step. No jargon, no obligations.',
    progressTemplate: 'Question {step} of {total}',
    back: 'Back to the previous question',
    next: 'Continue',
    resultKicker: 'Recommendation',
    resultTitle: 'What fits you',
    resultLead: 'Based on your answers, these services are the right starting point.',
    priceLabel: 'Starting price',
    industryLabel: 'For your field',
    whatsappLabel: 'Chat on WhatsApp',
    whatsappTemplate: 'Hi! I completed the guide on your site: I want {a1}, {a2}, {a3}. You recommended {services}.',
    restart: 'Restart the guide',
    formSubmit: 'See the recommendation',
    formLegend: 'Orientation guide — answer all three questions',
    otherOption: 'Other',
    otherSummary: 'in a different field',
    industryPrompt: 'What field are you in?',
    andSeparator: ' and ',
    resultAnnouncement: 'Our recommendation: {services}.',
  },
}

// Fail the build when the mapping points at a service or industry that does
// not exist — a dead-end recommendation would otherwise ship silently.
const knownServiceSlugs = new Set(servicePages.map((service) => service.slug))
for (const [key, slugs] of Object.entries(GUIDE_PATHS)) {
  for (const slug of slugs) {
    if (!knownServiceSlugs.has(slug)) {
      throw new Error(`[guide] mapping "${key}" points at unknown service slug "${slug}"`)
    }
  }
}
const knownIndustrySlugs = new Set(getAllIndustries('ro').map((industry) => industry.slug))
for (const slug of GUIDE_INDUSTRY_SLUGS) {
  if (!knownIndustrySlugs.has(slug)) {
    throw new Error(`[guide] unknown industry slug "${slug}"`)
  }
}

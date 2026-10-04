import type { Locale } from './i18n/locale'
import { careerLabelsEn, jobTextEn } from './i18n/content/careers.en'

// Shared by the careers page form and the /api/cariere route.

export type JobOpening = {
  /** Also the page address: /cariere/<id>. */
  id: string
  title: string
  /** Page title without the brand suffix; at most 46 characters. */
  seoTitle: string
  /** Meta description, 120-158 characters. */
  description: string
  /** Monthly net salary in RON, on an employment contract. */
  salaryMin: number
  salaryMax: number
  summary: string
  responsibilities: string[]
  requirements: string[]
  niceToHave: string[]
  datePosted: string
}

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: 'front-end-developer',
    title: 'Front-end developer',
    seoTitle: 'Front-end developer (React), remote România',
    description:
      'Angajăm front-end developer cu 2-3 ani de experiență în React și Next.js. 7.500-9.000 RON net pe lună, 8 ore pe zi, la distanță, din România.',
    salaryMin: 7500,
    salaryMax: 9000,
    summary:
      'Construiești site-uri de prezentare, magazine online și aplicații web rapide și accesibile pentru afaceri mici din România, de la design la lansare.',
    responsibilities: [
      'transformi designul în pagini React și Next.js, gândite întâi pentru telefon',
      'ții site-urile rapide, accesibile și bine optimizate pentru Google',
      'integrezi formulare, plăți, WhatsApp și servicii externe',
      'lucrezi direct cu designerul și, când e nevoie, cu clientul',
    ],
    requirements: [
      '2-3 ani de experiență cu React, TypeScript și CSS modern (ideal Tailwind)',
      'proiecte live sau cod public pe care ni le poți arăta',
      'atenție la detalii: viteză, accesibilitate, SEO tehnic',
      'limba română la nivel de lucru',
    ],
    niceToHave: ['Next.js App Router', 'animații cu Framer Motion', 'experiență cu magazine online'],
    datePosted: '2026-10-02',
  },
  {
    id: 'mobile-app-developer',
    title: 'Mobile app developer',
    seoTitle: 'Mobile app developer (React Native), remote',
    description:
      'Angajăm mobile app developer cu 2-3 ani de experiență în React Native. 8.000-10.000 RON net pe lună, 8 ore pe zi, la distanță, din România.',
    salaryMin: 8000,
    salaryMax: 10000,
    summary:
      'Construiești aplicații mobile pentru iOS și Android, de la portaluri pentru clienți la programări și instrumente interne, pentru afaceri din România.',
    responsibilities: [
      'dezvolți aplicații pentru iOS și Android dintr-o singură bază de cod',
      'conectezi aplicațiile la API-uri, plăți și notificări',
      'publici și actualizezi aplicațiile în App Store și Google Play',
      'lucrezi în etape scurte, cu progres pe care clientul îl poate testa',
    ],
    requirements: [
      '2-3 ani de experiență cu React Native (sau Flutter) și TypeScript',
      'cel puțin o aplicație publicată în App Store sau Google Play',
      'înțelegi bine performanța și experiența pe telefon',
      'limba română la nivel de lucru',
    ],
    niceToHave: ['Expo', 'experiență cu Next.js pentru partea web', 'notificări push și plăți în aplicație'],
    datePosted: '2026-10-02',
  },
]

export const JOB_SCHEDULE = 'Normă întreagă, 8 ore pe zi'
export const JOB_CONTRACT = 'Contract de muncă sau colaborare (PFA/SRL)'
export const JOB_LOCATION = 'La distanță, din România'

function localizeJob(job: JobOpening, locale: Locale): JobOpening {
  if (locale === 'ro') return job
  const text = jobTextEn[job.id]
  return text ? { ...job, ...text } : job
}

export function getJobOpenings(locale: Locale = 'ro') {
  return JOB_OPENINGS.map((job) => localizeJob(job, locale))
}

export function getJobOpening(id: string, locale: Locale = 'ro') {
  const job = JOB_OPENINGS.find((item) => item.id === id)
  return job ? localizeJob(job, locale) : undefined
}

export function careerSchedule(locale: Locale = 'ro') {
  return locale === 'en' ? careerLabelsEn.schedule : JOB_SCHEDULE
}

export function careerContract(locale: Locale = 'ro') {
  return locale === 'en' ? careerLabelsEn.contract : JOB_CONTRACT
}

export function careerLocation(locale: Locale = 'ro') {
  return locale === 'en' ? careerLabelsEn.location : JOB_LOCATION
}

/** Extra areas beyond the open roles. Values submitted to the API stay the Romanian labels. */
export function careerAreaOptions(locale: Locale = 'ro') {
  const extras = locale === 'en'
    ? [
        { value: 'Web design', label: 'Web design' },
        { value: 'Texte și conținut', label: 'Copy and content' },
        { value: 'Marketing și vânzări', label: 'Marketing and sales' },
        { value: 'Altceva', label: 'Something else' },
      ]
    : [
        { value: 'Web design', label: 'Web design' },
        { value: 'Texte și conținut', label: 'Texte și conținut' },
        { value: 'Marketing și vânzări', label: 'Marketing și vânzări' },
        { value: 'Altceva', label: 'Altceva' },
      ]
  return [
    ...getJobOpenings(locale).map((job) => ({ value: JOB_OPENINGS.find((item) => item.id === job.id)?.title ?? job.title, label: job.title })),
    ...extras,
  ]
}

/** For example "7.500-9.000 RON net/lună". */
export function salaryLabel(job: JobOpening, locale: Locale = 'ro') {
  const format = (value: number) => value.toLocaleString(locale === 'en' ? 'en-GB' : 'ro-RO')
  const suffix = locale === 'en' ? careerLabelsEn.salarySuffix : 'RON net/lună'
  return `${format(job.salaryMin)}-${format(job.salaryMax)} ${suffix}`
}

export const CAREER_AREAS = [
  ...JOB_OPENINGS.map((job) => job.title),
  'Web design',
  'Texte și conținut',
  'Marketing și vânzări',
  'Altceva',
] as const

export type CareerArea = (typeof CAREER_AREAS)[number]

/** Below Vercel's 4.5 MB request limit, leaving room for the other fields. */
export const MAX_CV_BYTES = 4 * 1024 * 1024

export const CV_RETENTION_MONTHS = 12

export const CV_ACCEPT = '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const cvSignatures: Record<string, number[]> = {
  pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
  docx: [0x50, 0x4b, 0x03, 0x04], // zip container
  doc: [0xd0, 0xcf, 0x11, 0xe0], // OLE2 compound file
}

export function cvExtension(fileName: string) {
  const extension = fileName.toLowerCase().split('.').pop() ?? ''
  return extension in cvSignatures ? extension : null
}

/** Checks the file's first bytes, so a renamed file of another type is rejected. */
export function hasCvSignature(bytes: Uint8Array, extension: string) {
  const signature = cvSignatures[extension]
  return Boolean(signature) && signature.every((byte, index) => bytes[index] === byte)
}

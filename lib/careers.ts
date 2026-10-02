// Shared by the careers page form and the /api/cariere route.

export type JobOpening = {
  id: string
  title: string
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
    summary:
      'Construiești site-uri de prezentare, magazine online și aplicații web rapide și accesibile pentru afaceri mici din România, de la design la lansare.',
    responsibilities: [
      'transformi designul în pagini React și Next.js, gândite întâi pentru telefon',
      'ții site-urile rapide, accesibile și bine optimizate pentru Google',
      'integrezi formulare, plăți, WhatsApp și servicii externe',
      'lucrezi direct cu designerul și, când e nevoie, cu clientul',
    ],
    requirements: [
      'experiență cu React, TypeScript și CSS modern (ideal Tailwind)',
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
    summary:
      'Construiești aplicații mobile pentru iOS și Android, de la portaluri pentru clienți la programări și instrumente interne, pentru afaceri din România.',
    responsibilities: [
      'dezvolți aplicații pentru iOS și Android dintr-o singură bază de cod',
      'conectezi aplicațiile la API-uri, plăți și notificări',
      'publici și actualizezi aplicațiile în App Store și Google Play',
      'lucrezi în etape scurte, cu progres pe care clientul îl poate testa',
    ],
    requirements: [
      'experiență cu React Native (sau Flutter) și TypeScript',
      'cel puțin o aplicație publicată în App Store sau Google Play',
      'înțelegi bine performanța și experiența pe telefon',
      'limba română la nivel de lucru',
    ],
    niceToHave: ['Expo', 'experiență cu Next.js pentru partea web', 'notificări push și plăți în aplicație'],
    datePosted: '2026-10-02',
  },
]

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

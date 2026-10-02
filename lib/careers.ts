// Shared by the careers page form and the /api/cariere route.

export const CAREER_AREAS = [
  'Web design',
  'Programare front-end',
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

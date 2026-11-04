import fs from 'node:fs'
import path from 'node:path'

/**
 * True when a cover file exists under public/. Some case studies ship before
 * their cover artwork is produced; the UI renders a neutral block for those
 * instead of a broken image.
 */
export function coverExists(cover: string | undefined): boolean {
  if (!cover) return false
  try {
    return fs.existsSync(path.join(process.cwd(), 'public', cover))
  } catch {
    return false
  }
}

/** Server-side: blanks the cover path when the file is missing, so cards render their fallback instead of requesting a 404. */
export function stripMissingCovers<P extends { cover: string }>(projects: P[]): P[] {
  return projects.map((project) => (coverExists(project.cover) ? project : { ...project, cover: '' }))
}

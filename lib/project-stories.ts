import fs from 'node:fs'
import path from 'node:path'
import type { Locale } from './i18n/locale'

/**
 * Optional long-form case study for a portfolio project, written in Markdown/MDX
 * at content/portofoliu/<slug>.mdx. English versions live in content/portofoliu/en/.
 * Returns null when the project has none in that language.
 */
export function getProjectStory(slug: string, locale: Locale = 'ro'): string | null {
  const safeSlug = path.basename(slug)
  if (safeSlug !== slug) return null
  const directory = locale === 'en'
    ? path.join(process.cwd(), 'content', 'portofoliu', 'en')
    : path.join(process.cwd(), 'content', 'portofoliu')
  const filePath = path.join(directory, `${safeSlug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf8').trim()
}

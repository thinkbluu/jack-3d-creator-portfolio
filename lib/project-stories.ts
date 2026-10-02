import fs from 'node:fs'
import path from 'node:path'

const storiesDirectory = path.join(process.cwd(), 'content', 'portofoliu')

/**
 * Optional long-form case study for a portfolio project, written in Markdown/MDX
 * at content/portofoliu/<slug>.mdx. Returns null when the project has none.
 */
export function getProjectStory(slug: string): string | null {
  const safeSlug = path.basename(slug)
  if (safeSlug !== slug) return null
  const filePath = path.join(storiesDirectory, `${safeSlug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  return fs.readFileSync(filePath, 'utf8').trim()
}

import type { Locale } from './i18n/locale'

export type TeamMember = {
  /** URL slug: /echipa/<slug>. */
  slug: string
  name: string
  role: Record<Locale, string>
  /** Portrait under /public/team/, 4:5, at least 1200 px tall, WebP. */
  photo?: string
  /** A few sentences in the first person or the third, as the person prefers. */
  bio: Record<Locale, string[]>
  /** What they look after at the studio, a few words each. */
  focus?: Record<Locale, string[]>
  links?: { label: string; url: string }[]
}

/**
 * The people at the studio. Each entry gets a profile at /echipa/<slug> and
 * a card on the studio page; with the list empty, neither appears. Add real
 * people only, with their agreement for the photo and the text.
 */
export const team: TeamMember[] = []

export function getTeam() {
  return team
}

export function getTeamMember(slug: string) {
  return team.find((member) => member.slug === slug)
}

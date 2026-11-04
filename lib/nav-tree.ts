import { localizePath } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/locale'
import { ui } from '@/lib/i18n/ui'
import { getAllIndustries } from '@/lib/industries'
import { getFeaturedProjects } from '@/lib/projects'
import { getServicesByGroup } from '@/lib/services'

/**
 * The single navigation tree shared by the desktop dropdowns, the mobile
 * accordion and the SiteNavigationElement JSON-LD, so all three always show
 * the same links. Pure data: safe to call from server and client components.
 */
export type NavChild = { href: string; label: string; note?: string }

export type NavPanelGroup = {
  id: string
  href: string
  label: string
  children: NavChild[]
}

export type NavEntry = {
  id: string
  href: string
  label: string
  panel?: {
    /** One column per group; the Servicii panel uses all four. */
    groups: NavPanelGroup[]
    /** Slim row of secondary links at the bottom of the panel. */
    more: NavChild[]
    wide?: boolean
  }
}

export function buildNavTree(locale: Locale): NavEntry[] {
  const copy = ui[locale]
  const href = (path: string) => localizePath(path, locale)

  const serviceGroups = getServicesByGroup(locale).map((group) => ({
    id: group.id,
    href: `${href('/servicii')}#${group.id}`,
    label: group.name[locale],
    children: group.services.map((service) => ({
      href: href(`/servicii/${service.slug}`),
      label: service.name,
    })),
  }))

  const industries = getAllIndustries(locale).map((industry) => ({
    href: href(`/solutii/${industry.slug}`),
    label: industry.name,
  }))

  const projects = getFeaturedProjects(4, locale).map((project) => ({
    href: href(`/portofoliu/${project.slug}`),
    label: project.name,
    note: project.summary,
  }))

  // The footer's last guide entry is the "all guides" link; the panel shows
  // the articles themselves and moves the overview into the bottom row.
  const guides = copy.footer.guideLinks
    .filter((link) => link.href !== '/blog')
    .map((link) => ({ href: href(link.href), label: link.label }))

  const studioLabel = (path: string) =>
    copy.footer.studioLinks.find((link) => link.href === path)?.label ?? path

  return [
    {
      id: 'servicii',
      href: href('/servicii'),
      label: copy.nav.services,
      panel: {
        groups: serviceGroups,
        wide: true,
        more: [
          { href: href('/servicii'), label: copy.nav.moreServices },
          { href: href('/ce-iti-trebuie'), label: copy.nav.notSure },
          { href: href('/verifica-site'), label: copy.nav.checkerFree },
        ],
      },
    },
    {
      id: 'solutii',
      href: href('/solutii'),
      label: copy.nav.solutions,
      panel: {
        groups: [{ id: 'solutii', href: href('/solutii'), label: copy.footer.solutions, children: industries }],
        more: [{ href: href('/solutii'), label: copy.nav.moreSolutions }],
      },
    },
    {
      id: 'portofoliu',
      href: href('/portofoliu'),
      label: copy.nav.portfolio,
      panel: {
        groups: [{ id: 'lucrari', href: href('/portofoliu'), label: copy.nav.recentWork, children: projects }],
        more: [{ href: href('/portofoliu'), label: copy.nav.moreWork }],
      },
    },
    {
      id: 'ghiduri',
      href: href('/blog'),
      label: copy.nav.guides,
      panel: {
        groups: [{ id: 'ghiduri', href: href('/blog'), label: copy.footer.guides, children: guides }],
        more: [{ href: href('/blog'), label: copy.nav.moreGuides }],
      },
    },
    { id: 'preturi', href: href('/preturi'), label: copy.nav.pricing },
    {
      id: 'studio',
      href: href('/despre'),
      label: copy.nav.about,
      panel: {
        groups: [
          {
            id: 'studio',
            href: href('/despre'),
            label: copy.nav.about,
            children: [
              { href: href('/despre'), label: studioLabel('/despre') },
              { href: href('/cum-lucram'), label: copy.nav.approach },
              { href: href('/comparatie'), label: studioLabel('/comparatie') },
              { href: href('/glosar'), label: studioLabel('/glosar') },
              { href: href('/newsletter'), label: copy.nav.newsletter },
              { href: href('/cariere'), label: copy.nav.careers },
              { href: href('/contact'), label: copy.nav.contact },
            ],
          },
        ],
        more: [],
      },
    },
  ]
}

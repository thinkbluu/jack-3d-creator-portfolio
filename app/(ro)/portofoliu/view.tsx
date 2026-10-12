import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import PageOpen from '@/components/studio/PageOpen'
import WorkIndex from '@/components/studio/WorkIndex'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { getAllProjects } from '@/lib/projects'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'
import { PAGE_WORDS } from '@/lib/page-words'

const portfolioPageCopy = {
  ro: {
    title: 'Portofoliu web design: proiecte livrate',
    description:
      'Site-uri de prezentare, site-uri instituționale și platforme construite de MAST Studio pentru afaceri și instituții din Timișoara și din toată România.',
    schemaName: 'Portofoliu web design MAST Studio',
    word: PAGE_WORDS['/portofoliu'].ro,
    intro:
      'Site-uri, platforme și concepte construite integral de noi, pentru afaceri și instituții din Timișoara și din toată România.',
  },
  en: {
    title: 'Web design portfolio: delivered projects',
    description:
      'Presentation websites, institutional websites, and platforms built by MAST Studio for businesses and institutions in Timișoara and across Romania.',
    schemaName: 'MAST Studio web design portfolio',
    word: PAGE_WORDS['/portofoliu'].en,
    intro:
      'Websites, platforms and concepts we built in full, for businesses and institutions in Timișoara and across Romania.',
  },
} as const

export function portfolioMetadata(locale: Locale) {
  const copy = portfolioPageCopy[locale]
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: localizePath('/portofoliu', locale),
    locale,
  })
}

export function PortfolioView({ locale }: { locale: Locale }) {
  const copy = portfolioPageCopy[locale]
  const path = localizePath('/portofoliu', locale)
  const projects = getAllProjects(locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.portfolio, path },
  ]

  const jsonLd = graph(
    webPageNode({
      path,
      name: copy.schemaName,
      description: copy.description,
      type: 'CollectionPage',
      breadcrumb: true,
      locale,
    }),
    breadcrumbNode(crumbs),
    {
      '@type': 'ItemList',
      '@id': `${absoluteUrl(path)}#proiecte`,
      itemListElement: projects
        .filter((project) => project.type === 'client')
        .map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(localizePath(`/portofoliu/${project.slug}`, locale)),
          name: project.name,
        })),
    },
  )

  return (
    <>
      <SiteHeader current="portofoliu" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--night)]">
        <PageOpen crumbs={crumbs} index="01" title={copy.title} word={copy.word} lead={copy.intro} short />
        <section className="tone-dark pb-[clamp(5rem,10vw,9rem)]">
          <div className="studio-container">
            <WorkIndex projects={projects} />
            <p className="mono-label mt-24 max-w-xl text-[var(--fg-3)]">{ui[locale].projects.conceptsNote}</p>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

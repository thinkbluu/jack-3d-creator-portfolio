import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import PortfolioGrid from '@/components/PortfolioGrid'
import SiteHeader from '@/components/SiteHeader'
import CtaBand from '@/components/studio/CtaBand'
import PageHero from '@/components/studio/PageHero'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { getAllProjects } from '@/lib/projects'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

const portfolioPageCopy = {
  ro: {
    title: 'Portofoliu web design: proiecte livrate',
    description:
      'Site-uri de prezentare, site-uri instituționale și platforme construite de MAST Studio pentru afaceri și instituții din Timișoara și din toată România.',
    schemaName: 'Portofoliu web design MAST Studio',
    intro:
      'Site-uri, platforme și proiecte digitale construite integral de noi, pentru afaceri și instituții din Timișoara și din toată România.',
    next: 'Vrei ca proiectul tău să fie următorul?',
  },
  en: {
    title: 'Web design portfolio: delivered projects',
    description:
      'Presentation websites, institutional websites, and platforms built by MAST Studio for businesses and institutions in Timișoara and across Romania.',
    schemaName: 'MAST Studio web design portfolio',
    intro:
      'Websites, platforms, and digital projects we built in full, for businesses and institutions in Timișoara and across Romania.',
    next: 'Want your project to be next?',
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

  const clientCount = projects.filter((project) => project.type === 'client').length

  return (
    <>
      <SiteHeader current="portofoliu" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageHero
          crumbs={crumbs}
          kicker={ui[locale].nav.portfolio}
          title={copy.title}
          intro={copy.intro}
          aside={
            <p className="flex items-end gap-4 lg:justify-end">
              <span className="display-xl text-[clamp(5rem,10vw,9rem)] leading-[0.8] text-[var(--brass-lite)]">
                {String(clientCount).padStart(2, '0')}
              </span>
              <span className="mono-label max-w-[10rem] pb-2 text-[var(--fg-3)]">{ui[locale].projects.clients}</span>
            </p>
          }
        />
        <div className="studio-container py-20 md:py-28">
          <PortfolioGrid projects={projects} />
        </div>
        <CtaBand title={copy.next} placement="portfolio_cta" />
      </main>
      <Footer cta={false} />
      <JsonLd data={jsonLd} />
    </>
  )
}

export const metadata = portfolioMetadata('ro')

export default function Page() {
  return <PortfolioView locale="ro" />
}

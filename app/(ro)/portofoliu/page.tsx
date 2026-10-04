import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import PortfolioGrid from '@/components/PortfolioGrid'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
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

  return (
    <>
      <SiteHeader current="portofoliu" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container py-12 md:py-20">
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 max-w-3xl">
            <p className="kicker">{ui[locale].nav.portfolio}</p>
            <h1 className="type-h2 mt-4 text-balance">{copy.title}</h1>
            <p className="type-body mt-6 max-w-2xl text-[var(--ink-2)]">{copy.intro}</p>
          </div>

          <PortfolioGrid projects={projects} />

          <section className="porthole mt-20 flex flex-col items-start gap-5 p-8">
            <h2 className="type-h3">{copy.next}</h2>
            <SegmentProvider>
              <ContactButton hero label={ui[locale].whatsapp.defaultCta} />
            </SegmentProvider>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

export const metadata = portfolioMetadata('ro')

export default function Page() {
  return <PortfolioView locale="ro" />
}

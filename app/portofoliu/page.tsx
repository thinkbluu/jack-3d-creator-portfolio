import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import PortfolioGrid from '@/components/PortfolioGrid'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
import { getAllProjects } from '@/lib/projects'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

const path = '/portofoliu'
const title = 'Portofoliu web design: proiecte livrate'
const description =
  'Site-uri de prezentare, site-uri instituționale și platforme construite de MAST Studio pentru afaceri și instituții din Timișoara și din toată România.'

export const metadata = pageMetadata({ title, description, path })

const crumbs: BreadcrumbItem[] = [
  { name: 'Acasă', path: '/' },
  { name: 'Portofoliu', path },
]

export default function PortfolioPage() {
  const projects = getAllProjects()

  const jsonLd = graph(
    webPageNode({ path, name: 'Portofoliu web design MAST Studio', description, type: 'CollectionPage', breadcrumb: true }),
    breadcrumbNode(crumbs),
    {
      '@type': 'ItemList',
      '@id': `${absoluteUrl(path)}#proiecte`,
      itemListElement: projects
        .filter((project) => project.type === 'client')
        .map((project, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: absoluteUrl(`/portofoliu/${project.slug}`),
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
            <p className="kicker">Portofoliu</p>
            <h1 className="type-h2 mt-4 text-balance">Portofoliu web design: proiecte livrate</h1>
            <p className="type-body mt-6 max-w-2xl text-[var(--ink-2)]">
              Site-uri, platforme și proiecte digitale construite integral de noi, pentru afaceri și instituții din Timișoara și din toată România.
            </p>
          </div>

          <PortfolioGrid projects={projects} />

          <section className="porthole mt-20 flex flex-col items-start gap-5 p-8">
            <h2 className="type-h3">Vrei ca proiectul tău să fie următorul?</h2>
            <SegmentProvider>
              <ContactButton hero label="Cere ofertă pe WhatsApp" />
            </SegmentProvider>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

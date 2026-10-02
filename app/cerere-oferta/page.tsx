import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import LeadForm from '@/components/LeadForm'
import SiteHeader from '@/components/SiteHeader'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

const path = '/cerere-oferta'
const description =
  'Cere o ofertă pentru site de prezentare, magazin online sau aplicație. Completezi trei câmpuri și primești în aceeași zi un răspuns clar despre preț și termen.'

export const metadata = pageMetadata({
  title: 'Cerere ofertă site web',
  description,
  path,
})

const crumbs: BreadcrumbItem[] = [
  { name: 'Acasă', path: '/' },
  { name: 'Cerere ofertă', path },
]

export default function CerereOfertaPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <section className="site-container pb-16 pt-12 md:pb-24 md:pt-20">
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div className="flex flex-col gap-6 lg:sticky lg:top-28">
              <p className="kicker">Cerere ofertă</p>
              <div className="flex flex-col gap-4">
                <h1 className="type-h1 max-w-2xl text-balance">Cerere de ofertă pentru site-ul tău</h1>
                <p className="type-body max-w-xl text-pretty">
                  Completează cele trei câmpuri de mai jos. Poți continua direct pe WhatsApp sau ne poți lăsa datele ca să revenim noi.
                </p>
              </div>

              <div className="flex flex-col gap-4 border-t border-[var(--hairline)] pt-6 font-sans text-sm text-[var(--ink-2)]">
                <p>Fără apeluri de vânzare inutile și fără obligații.</p>
                <p>Primești un răspuns clar despre soluție, buget și următorul pas.</p>
              </div>
            </div>

            <LeadForm variant="page" />
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={graph(webPageNode({ path, name: 'Cerere ofertă site web', description, breadcrumb: true }), breadcrumbNode(crumbs))} />
    </>
  )
}

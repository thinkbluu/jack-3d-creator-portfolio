import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
import { breadcrumbNode, graph, serviceNode, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { getAllServicePages } from '@/lib/services'
import { absoluteUrl } from '@/lib/site'

const path = '/servicii'
const title = 'Servicii web design și prețuri'
const description =
  'Servicii web design din Timișoara cu prețuri la vedere: site de prezentare de la 300 EUR, magazin online de la 900 EUR, aplicații, mentenanță și WhatsApp.'

export const metadata = pageMetadata({ title, description, path })

const crumbs: BreadcrumbItem[] = [
  { name: 'Acasă', path: '/' },
  { name: 'Servicii', path },
]

const steps = [
  { title: 'Ne scrii', text: 'În două fraze ne spui ce faci. În aceeași zi primești oferta și lista scurtă cu ce ne trebuie de la tine.' },
  { title: 'Trimiți materialele', text: 'Texte de bază, poze, siglă. Din momentul în care le avem, pornește termenul scris în ofertă.' },
  { title: 'Vezi și decizi', text: 'Îți trimitem rezultatul live. Îl testezi, ceri modificări și abia apoi plătești restul.' },
]

export default function ServicesHubPage() {
  const services = getAllServicePages()

  const jsonLd = graph(
    webPageNode({ path, name: title, description, type: 'CollectionPage', breadcrumb: true }),
    breadcrumbNode(crumbs),
    {
      '@type': 'ItemList',
      '@id': `${absoluteUrl(path)}#lista`,
      name: title,
      itemListElement: services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: serviceNode(service),
      })),
    },
  )

  return (
    <>
      <SiteHeader current="servicii" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container py-12 md:py-20">
          <Breadcrumbs items={crumbs} />

          <header className="mt-6 max-w-3xl">
            <p className="kicker">Servicii · Timișoara și toată România</p>
            <h1 className="type-h2 mt-4 text-balance">Servicii web design și prețuri</h1>
            <p className="type-body mt-6 max-w-2xl">
              Construim site-uri de prezentare, magazine online, aplicații și platforme pentru afaceri din Timișoara și din toată România. Fiecare serviciu are preț de pornire și termen scris. La site-uri și magazine online plătești un avans de 50 EUR, iar restul doar dacă ești mulțumit de rezultat.
            </p>
          </header>

          <section aria-labelledby="preturi-pe-scurt" className="mt-12 max-w-3xl">
            <h2 id="preturi-pe-scurt" className="type-h3">Prețuri pe scurt</h2>
            <div className="prose mt-4">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Serviciu</th>
                    <th scope="col">Preț</th>
                    <th scope="col">Termen</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.slug}>
                      <th scope="row">
                        <Link href={`/servicii/${service.slug}`}>{service.name}</Link>
                      </th>
                      <td>{service.priceLabel}</td>
                      <td>{service.deliveryTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-label="Servicii" className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.slug} className="porthole flex flex-col gap-4 p-7">
                <h2 className="type-h3">
                  <Link href={`/servicii/${service.slug}`} className="hover:text-[var(--brass-ink)]">
                    {service.h1}
                  </Link>
                </h2>
                <p className="type-body text-[15px]">{service.answerCapsule}</p>
                <p className="font-sans text-sm font-bold text-[var(--brass-ink)]">
                  {service.priceLabel} · {service.deliveryTime}
                </p>
                <Link
                  href={`/servicii/${service.slug}`}
                  className="mt-auto w-fit font-sans text-sm font-semibold text-[var(--ink)] underline underline-offset-4 hover:text-[var(--brass-ink)]"
                >
                  Ce include: {service.shortName.toLowerCase()} →
                </Link>
              </article>
            ))}
          </section>

          <section className="mt-16 max-w-3xl border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Cum lucrăm, indiferent de serviciu</h2>
            <ol className="mt-6 flex flex-col gap-6">
              {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full font-sans text-[13px] font-semibold"
                    style={{ background: 'var(--shell-warm)', color: 'var(--brass-ink)', border: '1px solid var(--hairline)' }}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-sans text-[15px] font-semibold text-[var(--ink)]">{step.title}</h3>
                    <p className="type-body mt-1 text-[15px]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="type-body mt-8">
              Nu știi ce ți se potrivește? Citește{' '}
              <Link href="/blog/site-prezentare-sau-magazin-online" className="font-semibold text-[var(--ink)] underline underline-offset-4">
                site de prezentare sau magazin online
              </Link>{' '}
              sau compară{' '}
              <Link href="/comparatie" className="font-semibold text-[var(--ink)] underline underline-offset-4">
                freelancer, studio și agenție
              </Link>
              .
            </p>
          </section>

          <section className="porthole mt-16 flex max-w-3xl flex-col items-start gap-5 p-8">
            <h2 className="type-h3">Spune-ne ce ai nevoie și primești oferta azi</h2>
            <SegmentProvider>
              <ContactButton hero label="Cere ofertă pe WhatsApp" />
            </SegmentProvider>
            <Link href="/cerere-oferta" className="font-sans text-sm font-semibold text-[var(--ink)] underline underline-offset-4">
              Sau completează cererea de ofertă
            </Link>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

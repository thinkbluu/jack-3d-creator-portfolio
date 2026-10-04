import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import LeadForm from '@/components/LeadForm'
import SiteHeader from '@/components/SiteHeader'
import { localizePath } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/locale'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

const quote = {
  ro: {
    title: 'Cerere ofertă site web',
    description:
      'Cere o ofertă pentru site de prezentare, magazin online sau aplicație. Completezi trei câmpuri și primești în aceeași zi un răspuns clar despre preț și termen.',
    crumb: 'Cerere ofertă',
    kicker: 'Cerere ofertă',
    h1: 'Cerere de ofertă pentru site-ul tău',
    body: 'Completează cele trei câmpuri de mai jos. Poți continua direct pe WhatsApp sau ne poți lăsa datele ca să revenim noi.',
    notes: ['Fără apeluri de vânzare inutile și fără obligații.', 'Primești un răspuns clar despre soluție, buget și următorul pas.'],
  },
  en: {
    title: 'Request a quote for a website',
    description:
      'Request a quote for a presentation website, an online store or an app. You fill in three fields and the same day you get a clear reply about price and timeline.',
    crumb: 'Request a quote',
    kicker: 'Quote request',
    h1: 'A quote request for your website',
    body: 'Fill in the three fields below. You can continue straight to WhatsApp, or leave your details and we’ll come back to you.',
    notes: ['No pointless sales calls, and no obligation.', 'You get a clear reply about the solution, the budget and the next step.'],
  },
}

export function quoteMetadata(locale: Locale = 'ro') {
  const copy = quote[locale]
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: localizePath('/cerere-oferta', locale),
    locale,
  })
}

export function QuoteView({ locale }: { locale: Locale }) {
  const copy = quote[locale]
  const path = localizePath('/cerere-oferta', locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: copy.crumb, path },
  ]

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <section className="site-container pb-16 pt-12 md:pb-24 md:pt-20">
          <Breadcrumbs items={crumbs} />
          <div className="mt-8 grid items-start gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
            <div className="flex flex-col gap-6 lg:sticky lg:top-28">
              <p className="kicker">{copy.kicker}</p>
              <div className="flex flex-col gap-4">
                <h1 className="type-h1 max-w-2xl text-balance">{copy.h1}</h1>
                <p className="type-body max-w-xl text-pretty">{copy.body}</p>
              </div>

              <div className="flex flex-col gap-4 border-t border-[var(--hairline)] pt-6 font-sans text-sm text-[var(--ink-2)]">
                {copy.notes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
              </div>
            </div>

            <LeadForm variant="page" />
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={graph(webPageNode({ path, name: copy.title, description: copy.description, breadcrumb: true, locale }), breadcrumbNode(crumbs))} />
    </>
  )
}

export const metadata = quoteMetadata('ro')

export default function CerereOfertaPage() {
  return <QuoteView locale="ro" />
}

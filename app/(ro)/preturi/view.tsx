import Link from 'next/link'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import PageOpen from '@/components/studio/PageOpen'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, faqNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { getAllServicePages } from '@/lib/services'

type PricingCopy = {
  word: string
  lead: string
  title: string
  description: string
  kicker: string
  intro: string
  servicesTitle: string
  columns: { price: string; time: string; includes: string }
  serviceLink: string
  neverIncluded: string
  neverIncludedItems: string[]
  paymentTitle: string
  paymentBody: string
  faqTitle: string
  faq: { question: string; answer: string }[]
  cta: string
  ctaLink: string
  closing: string
}

const pricingCopy: Record<Locale, PricingCopy> = {
  ro: {
    word: 'Prețuri.',
    lead: 'Cât costă un site, un magazin sau o aplicație. Scris dinainte.',
    title: 'Prețuri site web și magazin online',
    description:
      'Prețuri MAST Studio: site de prezentare de la 300 EUR, magazin online de la 900 EUR, design UX/UI de la 250 EUR, aplicații cu ofertă fixă. Avans 50 EUR, restul doar dacă ești mulțumit.',
    kicker: 'Prețuri · Timișoara și toată România',
    intro:
      'Fiecare serviciu are preț de pornire și termen scris. Prețul din ofertă e cel pe care îl plătești — fără costuri ascunse.',
    servicesTitle: 'Servicii și prețuri',
    columns: { price: 'Preț', time: 'Termen', includes: 'Ce include' },
    serviceLink: 'Vezi serviciul →',
    neverIncluded: 'Ce nu include niciodată prețul',
    neverIncludedItems: [
      'Domeniu și găzduire — se plătesc anual, direct la furnizor',
      'Fotografii profesionale — le poți face cu un fotograf local; noi le integrăm în site',
      'Campanii de publicitate — Google Ads sau Meta Ads, cu buget separat',
    ],
    paymentTitle: 'Cum plătești',
    paymentBody:
      'La site-uri și magazine online plătești un avans de 50 EUR și restul doar după ce vezi site-ul live și ești mulțumit de rezultat. La aplicații și platforme prețul e fix și se plătește în etape, pe măsură ce vezi progresul.',
    faqTitle: 'Întrebări frecvente despre prețuri',
    faq: [
      {
        question: 'Cât costă un site de prezentare?',
        answer:
          'Un site de prezentare pornește de la 300 EUR, cu design inclus și termen de livrare scris în ofertă. Prețul final depinde de numărul de pagini și de funcționalități.',
      },
      {
        question: 'Cât costă un magazin online?',
        answer:
          'Un magazin online pornește de la 900 EUR, cu integrare de plată, produse încărcate și formare pentru echipa ta.',
      },
      {
        question: 'Ce înseamnă avansul de 50 EUR?',
        answer:
          'La site-uri și magazine online plătești 50 EUR la start și restul doar după ce vezi site-ul live și ești mulțumit de rezultat. Avansul acoperă prima etapă de lucru.',
      },
      {
        question: 'Ce se plătește separat?',
        answer:
          'Domeniul și găzduirea (anual, direct la furnizor), fotografiile profesionale și campaniile de publicitate. Toate celelalte costuri sunt scrise în ofertă.',
      },
      {
        question: 'Aplicațiile au preț fix?',
        answer:
          'Da. După prima conversație primești în 24 de ore o ofertă cu preț fix și termen estimat. Prețul nu se schimbă pe parcurs, dacă nu schimbi tu cerințele.',
      },
    ],
    cta: 'Vrei o ofertă cu preț fix? Scrie-ne și o primești azi',
    ctaLink: 'Trimite cererea de ofertă',
    closing: 'Un site bun costă. Un site prost costă mai mult. Doar că nu vezi factura.',
  },
  en: {
    word: 'Pricing.',
    lead: 'What a website, a store, or an app costs. Written down up front.',
    title: 'Website and app pricing',
    description:
      'MAST Studio prices: a presentation website from 300 EUR, an online store from 900 EUR, UX/UI design from 250 EUR, apps with a fixed-price quote. 50 EUR deposit, the rest only if you are happy.',
    kicker: 'Pricing · Timișoara and across Romania',
    intro:
      'Every service has a starting price and a written timeline. The price in the quote is the price you pay — no hidden costs.',
    servicesTitle: 'Services and prices',
    columns: { price: 'Price', time: 'Timeline', includes: 'What’s included' },
    serviceLink: 'See the service →',
    neverIncluded: 'What the price never includes',
    neverIncludedItems: [
      'Domain and hosting — paid yearly, directly to the provider',
      'Professional photography — you can hire a local photographer; we integrate the photos into the site',
      'Advertising campaigns — Google Ads or Meta Ads, on a separate budget',
    ],
    paymentTitle: 'How you pay',
    paymentBody:
      'For websites and online stores you pay a 50 EUR deposit and the rest only after you see the site live and are happy with the result. For apps and platforms the price is fixed and paid in stages, as you see the progress.',
    faqTitle: 'Frequently asked questions about prices',
    faq: [
      {
        question: 'How much does a presentation website cost?',
        answer:
          'A presentation website starts at 300 EUR, with the design included and a delivery time written in the quote. The final price depends on the number of pages and the features.',
      },
      {
        question: 'How much does an online store cost?',
        answer:
          'An online store starts at 900 EUR, with payment integration, your products loaded, and training for your team.',
      },
      {
        question: 'What does the 50 EUR deposit mean?',
        answer:
          'For websites and online stores you pay 50 EUR to start and the rest only after you see the site live and are happy with the result. The deposit covers the first stage of work.',
      },
      {
        question: 'What is paid separately?',
        answer:
          'The domain and hosting (yearly, directly to the provider), professional photography, and advertising campaigns. Every other cost is written in the quote.',
      },
      {
        question: 'Do apps have a fixed price?',
        answer:
          'Yes. After the first conversation you get a fixed-price quote and an estimated timeline within 24 hours. The price does not change along the way, unless you change the requirements.',
      },
    ],
    cta: 'Want a fixed-price quote? Write to us and you get it today',
    ctaLink: 'Send the quote request',
    closing: 'A good website costs money. A bad one costs more. You just never see the invoice.',
  },
}

export function pricingMetadata(locale: Locale) {
  const copy = pricingCopy[locale]
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: localizePath('/preturi', locale),
    locale,
  })
}

export function PricingView({ locale }: { locale: Locale }) {
  const copy = pricingCopy[locale]
  const path = localizePath('/preturi', locale)
  const services = getAllServicePages(locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.pricing, path },
  ]

  const jsonLd = graph(
    webPageNode({ path, name: copy.title, description: copy.description, breadcrumb: true, locale }),
    breadcrumbNode(crumbs),
    faqNode(copy.faq, path),
  )

  return (
    <>
      <SiteHeader tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageOpen crumbs={crumbs} title={copy.title} word={copy.word} lead={copy.lead} short>
          <p className="max-w-sm leading-relaxed text-[var(--fg-2)]">{copy.intro}</p>
        </PageOpen>

        <section aria-labelledby="preturi-servicii" className="page-section">
          <div className="studio-container">
            <h2 id="preturi-servicii" className="type-h3">
              {copy.servicesTitle}
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <article key={service.slug} className="flex flex-col rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--shell-warm)] p-6 md:p-8">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="font-sans text-lg font-semibold text-[var(--ink)]">{service.name}</h3>
                    <p className="display-xl text-[clamp(1.3rem,1.8vw,1.7rem)] leading-[1.05] text-[var(--brass-ink)]">{service.priceLabel}</p>
                  </div>
                  <p className="mono-label mt-3 text-[var(--fg-3)]">
                    {service.deliveryLabel}: {service.deliveryTime}
                  </p>
                  <p className="mono-label mt-6 text-[var(--fg-3)]">{copy.columns.includes}</p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {service.includes.slice(0, 4).map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-[var(--ink-2)]">
                        <svg aria-hidden="true" width="14" height="11" viewBox="0 0 14 11" fill="none" className="mt-[6px] shrink-0">
                          <path d="M1 5.5L5 9.5L13 1.5" stroke="var(--brass)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={localizePath(`/servicii/${service.slug}`, locale)}
                    className="mt-6 inline-block w-fit border-t border-[var(--hairline)] pt-4 font-sans text-sm font-semibold text-[var(--ink)] hover:text-[var(--brass-ink)]"
                  >
                    {copy.serviceLink}
                  </Link>
                </article>
              ))}
            </div>
            <p className="mt-12 max-w-2xl text-lg italic leading-relaxed text-[var(--ink-2)]" style={{ fontFamily: 'var(--font-display)' }}>
              {copy.closing}
            </p>
          </div>
        </section>

        <section className="page-section border-t border-[var(--hairline)]">
          <div className="studio-container grid gap-12 md:grid-cols-2 md:gap-10">
            <div>
              <h2 className="type-h3">{copy.neverIncluded}</h2>
              <ul className="mt-6 flex flex-col gap-3">
                {copy.neverIncludedItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[var(--ink-2)]">
                    <span aria-hidden="true" className="mt-[10px] size-1.5 shrink-0 rounded-full bg-[var(--ink-3)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="type-h3">{copy.paymentTitle}</h2>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--ink-2)]">{copy.paymentBody}</p>
            </div>
          </div>
        </section>

        <section className="page-section border-t border-[var(--hairline)]">
          <div className="studio-container">
            <h2 className="type-h3">{copy.faqTitle}</h2>
            <div className="mt-6 max-w-3xl divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              {copy.faq.map((item) => (
                <details key={item.question} className="faq-item group py-5">
                  <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 font-sans font-semibold [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <span
                      className="faq-icon flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink)]"
                      aria-hidden="true"
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 0V11M0 5.5H11" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 font-sans text-[15px] leading-relaxed text-[var(--ink-2)]">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section border-t border-[var(--hairline)]">
          <div className="studio-container">
            <div className="porthole flex flex-col items-start gap-5 p-8 md:p-12">
              <h2 className="type-h3">{copy.cta}</h2>
              <Link
                href={localizePath('/cerere-oferta', locale)}
                className="mono-label inline-flex min-h-11 items-center rounded-[var(--radius-pill)] bg-[var(--ink)] px-6 text-[var(--shell)] transition-colors hover:bg-[var(--navy-2)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
              >
                {copy.ctaLink}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

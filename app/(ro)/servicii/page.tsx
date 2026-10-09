import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, graph, serviceNode, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { getAllServicePages } from '@/lib/services'
import { absoluteUrl } from '@/lib/site'

type ServicesCopy = {
  title: string
  description: string
  kicker: string
  intro: string
  prices: string
  columns: { service: string; price: string; time: string }
  servicesLabel: string
  includes: string
  how: string
  steps: { title: string; text: string }[]
  unsureBefore: string
  unsureBlog: string
  unsureOr: string
  unsureCompare: string
  cta: string
  form: string
  freeBefore: string
  freeLink: string
  freeAfter: string
}

const servicesCopy: Record<Locale, ServicesCopy> = {
  ro: {
    title: 'Servicii web design și prețuri',
    description:
      'Servicii web design din Timișoara cu prețuri la vedere: site de prezentare de la 300 EUR, magazin online de la 900 EUR, aplicații, mentenanță și WhatsApp.',
    kicker: 'Servicii · Timișoara și toată România',
    intro:
      'Construim site-uri de prezentare, magazine online, aplicații și platforme pentru afaceri din Timișoara și din toată România. Fiecare serviciu are preț de pornire și termen scris. La site-uri și magazine online plătești un avans de 50 EUR, iar restul doar dacă ești mulțumit de rezultat.',
    prices: 'Prețuri pe scurt',
    columns: { service: 'Serviciu', price: 'Preț', time: 'Termen' },
    servicesLabel: 'Servicii',
    includes: 'Ce include:',
    how: 'Cum lucrăm, indiferent de serviciu',
    steps: [
      { title: 'Ne scrii', text: 'În două fraze ne spui ce faci. În aceeași zi primești oferta și lista scurtă cu ce ne trebuie de la tine.' },
      { title: 'Trimiți materialele', text: 'Texte de bază, poze, siglă. Din momentul în care le avem, pornește termenul scris în ofertă.' },
      { title: 'Vezi și decizi', text: 'Îți trimitem rezultatul live. Îl testezi, ceri modificări și abia apoi plătești restul.' },
    ],
    unsureBefore: 'Nu știi ce ți se potrivește? Citește',
    unsureBlog: 'site de prezentare sau magazin online',
    unsureOr: 'sau compară',
    unsureCompare: 'freelancer, studio și agenție',
    cta: 'Spune-ne ce ai nevoie și primești oferta azi',
    form: 'Sau completează cererea de ofertă',
    freeBefore: 'Ai o afacere mică și nu ai încă buget pentru site? În fiecare lună oferim',
    freeLink: 'un site de prezentare gratuit',
    freeAfter: 'unei afaceri din România, prin concursul nostru lunar.',
  },
  en: {
    title: 'Web design services and prices',
    description:
      'Web design services from Timișoara with prices in the open: a presentation website from 300 EUR, an online store from 900 EUR, apps, maintenance, and WhatsApp.',
    kicker: 'Services · Timișoara and across Romania',
    intro:
      'We build presentation websites, online stores, apps, and platforms for businesses in Timișoara and across Romania. Each service has a starting price and a written timeline. For websites and online stores you pay a 50 EUR deposit, and the rest only if you are happy with the result.',
    prices: 'Prices at a glance',
    columns: { service: 'Service', price: 'Price', time: 'Timeline' },
    servicesLabel: 'Services',
    includes: 'What’s included:',
    how: 'How we work, whichever service you need',
    steps: [
      { title: 'You write to us', text: 'In two sentences you tell us what you do. The same day you get the quote and a short list of what we need from you.' },
      { title: 'You send the materials', text: 'Basic text, photos, a logo. The timeline written in the quote starts the moment we have them.' },
      { title: 'You see it and decide', text: 'We send you the live result. You test it, ask for changes, and only then pay the rest.' },
    ],
    unsureBefore: 'Not sure what fits? Read',
    unsureBlog: 'presentation website or online store',
    unsureOr: 'or compare',
    unsureCompare: 'freelancer, studio, and agency',
    cta: 'Tell us what you need and you get the quote today',
    form: 'Or fill in the quote request',
    freeBefore: 'Running a small business and you don’t have the budget for a website yet? Every month we offer',
    freeLink: 'a free presentation website',
    freeAfter: 'to a business in Romania, through our monthly contest.',
  },
}

/** Lowercase a leading word, but keep internal capitals such as WhatsApp and SaaS. Romanian stays fully lowercased, as before. */
function phraseName(name: string, locale: Locale) {
  if (locale === 'ro') return name.toLowerCase()
  const [first, ...rest] = name.split(' ')
  if (first.slice(1) !== first.slice(1).toLowerCase()) return name
  return [first.charAt(0).toLowerCase() + first.slice(1), ...rest].join(' ')
}

export function servicesMetadata(locale: Locale) {
  const copy = servicesCopy[locale]
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: localizePath('/servicii', locale),
    locale,
  })
}

export function ServicesView({ locale }: { locale: Locale }) {
  const copy = servicesCopy[locale]
  const path = localizePath('/servicii', locale)
  const services = getAllServicePages(locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.services, path },
  ]

  const jsonLd = graph(
    webPageNode({ path, name: copy.title, description: copy.description, type: 'CollectionPage', breadcrumb: true, locale }),
    breadcrumbNode(crumbs),
    {
      '@type': 'ItemList',
      '@id': `${absoluteUrl(path)}#lista`,
      name: copy.title,
      itemListElement: services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: serviceNode(service, locale),
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
            <p className="kicker">{copy.kicker}</p>
            <h1 className="type-h2 mt-4 text-balance">{copy.title}</h1>
            <p className="type-body mt-6 max-w-2xl">{copy.intro}</p>
          </header>

          <section aria-labelledby="preturi-pe-scurt" className="mt-12 max-w-3xl">
            <h2 id="preturi-pe-scurt" className="type-h3">{copy.prices}</h2>
            <div className="prose mt-4">
              <table>
                <thead>
                  <tr>
                    <th scope="col">{copy.columns.service}</th>
                    <th scope="col">{copy.columns.price}</th>
                    <th scope="col">{copy.columns.time}</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service) => (
                    <tr key={service.slug}>
                      <th scope="row">
                        <Link href={localizePath(`/servicii/${service.slug}`, locale)}>{service.name}</Link>
                      </th>
                      <td>{service.priceLabel}</td>
                      <td>{service.deliveryTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section aria-label={copy.servicesLabel} className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.slug} className="porthole flex flex-col gap-4 p-7">
                <h2 className="type-h3">
                  <Link href={localizePath(`/servicii/${service.slug}`, locale)} className="hover:text-[var(--brass-ink)]">
                    {service.h1}
                  </Link>
                </h2>
                <p className="type-body text-[15px]">{service.answerCapsule}</p>
                <p className="font-sans text-sm font-bold text-[var(--brass-ink)]">
                  {service.priceLabel} · {service.deliveryTime}
                </p>
                <Link
                  href={localizePath(`/servicii/${service.slug}`, locale)}
                  className="mt-auto w-fit font-sans text-sm font-semibold text-[var(--ink)] underline underline-offset-4 hover:text-[var(--brass-ink)]"
                >
                  {copy.includes} {phraseName(service.shortName, locale)} →
                </Link>
              </article>
            ))}
          </section>

          <section className="mt-16 max-w-3xl border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">{copy.how}</h2>
            <ol className="mt-6 flex flex-col gap-6">
              {copy.steps.map((step, index) => (
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
              {copy.unsureBefore}{' '}
              <Link href="/blog/site-prezentare-sau-magazin-online" className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                {copy.unsureBlog}
              </Link>{' '}
              {copy.unsureOr}{' '}
              <Link href={localizePath('/comparatie', locale)} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                {copy.unsureCompare}
              </Link>
              .
            </p>
          </section>

          <section className="porthole mt-16 flex max-w-3xl flex-col items-start gap-5 p-8">
            <h2 className="type-h3">{copy.cta}</h2>
            <SegmentProvider>
              <ContactButton hero label={ui[locale].whatsapp.defaultCta} />
            </SegmentProvider>
            <Link href={localizePath('/cerere-oferta', locale)} className="font-sans text-sm font-semibold text-[var(--ink)] underline underline-offset-4">
              {copy.form}
            </Link>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

export const metadata = servicesMetadata('ro')

export default function Page() {
  return <ServicesView locale="ro" />
}

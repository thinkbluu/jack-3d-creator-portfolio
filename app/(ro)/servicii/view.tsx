import Link from 'next/link'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import PageOpen from '@/components/studio/PageOpen'
import SectionHead from '@/components/studio/SectionHead'
import { Reveal } from '@/components/studio/Reveal'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, graph, serviceNode, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { getAllServicePages } from '@/lib/services'
import { absoluteUrl } from '@/lib/site'
import { PAGE_WORDS } from '@/lib/page-words'

type ServicesCopy = {
  word: string
  lead: string
  howLabel: string
  howLink: string
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
    word: PAGE_WORDS['/servicii'].ro,
    lead: 'Ce construim, cât costă și în cât timp. Scris dinainte.',
    howLabel: 'Procesul',
    howLink: 'Tot procesul, pas cu pas',
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
    how: 'Același drum, la orice proiect.',
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
    word: PAGE_WORDS['/servicii'].en,
    lead: 'What we build, what it costs and how long it takes. Written down up front.',
    howLabel: 'Process',
    howLink: 'The whole process, step by step',
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
    how: 'The same road, for every project.',
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
      <SiteHeader current="servicii" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageOpen crumbs={crumbs} index="02" title={copy.title} word={copy.word} lead={copy.lead} short>
          <p className="max-w-sm leading-relaxed text-[var(--fg-2)]">{copy.intro}</p>
        </PageOpen>

        <section aria-labelledby="preturi-pe-scurt" className="tone-dark pb-[clamp(5rem,10vw,9rem)]">
          <div className="studio-container">
            <h2 id="preturi-pe-scurt" className="sr-only">
              {copy.prices}
            </h2>
            <ol className="big-rows">
              {services.map((service, index) => (
                <li key={service.slug}>
                  <Link href={localizePath(`/servicii/${service.slug}`, locale)} className="big-row service-row">
                    <span className="mono-label text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className="big-row-name block">{service.name}</span>
                      <span className="service-row-text">{service.answerCapsule}</span>
                    </span>
                    <span className="service-row-facts">
                      <span>
                        <span className="mono-label text-[var(--fg-3)]">{copy.columns.price}</span>
                        <span className="block">{service.priceLabel}</span>
                      </span>
                      <span>
                        <span className="mono-label text-[var(--fg-3)]">{copy.columns.time}</span>
                        <span className="block">{service.deliveryTime}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="page-section">
          <div className="studio-container">
            <SectionHead
              label={copy.howLabel}
              title={copy.how}
              intro={
                <Link href={localizePath('/cum-lucram', locale)} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                  {copy.howLink} →
                </Link>
              }
            />
            <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
              {copy.steps.map((step, index) => (
                <li key={step.title} className="border-t border-[var(--ink)] pt-6">
                  <Reveal delay={index * 0.1}>
                    <span className="mono-label text-[var(--brass-ink)]">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="type-h3 mt-6">{step.title}</h3>
                    <p className="mt-3 leading-relaxed text-[var(--ink-2)]">{step.text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
            <p className="mt-16 max-w-3xl text-lg text-[var(--ink-2)]">
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
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

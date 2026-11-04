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
import { getServicesByGroup } from '@/lib/services'
import { isNoDepositActive } from '@/lib/offer'
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
  fitLabel: string
  fitSteps: { label: string; anchor: string }[]
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
  pricingPage: string
  guideLink: string
}

const servicesCopy: Record<Locale, ServicesCopy> = {
  ro: {
    word: PAGE_WORDS['/servicii'].ro,
    lead: 'Tot ce îi trebuie afacerii tale online, într-un singur loc.',
    howLabel: 'Procesul',
    howLink: 'Tot procesul, pas cu pas',
    title: 'Servicii web design și prețuri',
    description:
      'Servicii web design din Timișoara cu prețuri la vedere: site de prezentare de la 300 EUR, magazin online de la 900 EUR, aplicații, mentenanță și WhatsApp.',
    kicker: 'Servicii · Timișoara și toată România',
    intro:
      'Site-uri, magazine online, aplicații, inteligență artificială și creștere după lansare. Un singur partener, un singur interlocutor, prețuri de pornire și termene scrise pentru fiecare serviciu.',
    fitLabel: 'Cum se leagă',
    fitSteps: [
      { label: 'Fii găsit', anchor: '#crestere' },
      { label: 'Convinge', anchor: '#web' },
      { label: 'Vinde', anchor: '#web' },
      { label: 'Automatizează', anchor: '#ai' },
      { label: 'Crește', anchor: '#crestere' },
    ],
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
    pricingPage: 'Toate prețurile, pe o singură pagină',
    guideLink: 'Nu știi ce să alegi? Află în 30 de secunde →',
  },
  en: {
    word: PAGE_WORDS['/servicii'].en,
    lead: 'Everything your business needs online, in one place.',
    howLabel: 'Process',
    howLink: 'The whole process, step by step',
    title: 'Web design services and prices',
    description:
      'Web design services from Timișoara with prices in the open: a presentation website from 300 EUR, an online store from 900 EUR, apps, maintenance, and WhatsApp.',
    kicker: 'Services · Timișoara and across Romania',
    intro:
      'Websites, online stores, apps, artificial intelligence and growth after launch. One partner, one point of contact, starting prices and written timelines for every service.',
    fitLabel: 'How it fits together',
    fitSteps: [
      { label: 'Get found', anchor: '#crestere' },
      { label: 'Convince', anchor: '#web' },
      { label: 'Sell', anchor: '#web' },
      { label: 'Automate', anchor: '#ai' },
      { label: 'Grow', anchor: '#crestere' },
    ],
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
    pricingPage: 'All prices, on a single page',
    guideLink: 'Not sure what to choose? Find out in 30 seconds →',
  },
}

// No-deposit offer variant for the intro (November 2026): the current intro
// with the no-deposit sentence appended.
const servicesIntroOffer: Record<Locale, string> = {
  ro: `${servicesCopy.ro.intro} La site-uri și magazine online, în noiembrie, nu plătești avans: restul doar dacă ești mulțumit de rezultat.`,
  en: `${servicesCopy.en.intro} For websites and online stores, in November there is no deposit: you pay the rest only if you are happy with the result.`,
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
  const copy = isNoDepositActive() ? { ...servicesCopy[locale], intro: servicesIntroOffer[locale] } : servicesCopy[locale]
  const path = localizePath('/servicii', locale)
  const grouped = getServicesByGroup(locale)
  // The ItemList keeps every service, now in group order.
  const services = grouped.flatMap((group) => group.services)
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
          <Link
            href={localizePath('/preturi', locale)}
            className="mt-4 inline-block font-sans text-sm font-semibold text-[var(--ink)] underline underline-offset-4 hover:text-[var(--brass-ink)]"
          >
            {copy.pricingPage} →
          </Link>
        </PageOpen>

        <section aria-labelledby="preturi-pe-scurt" className="tone-dark pb-[clamp(5rem,10vw,9rem)]">
          <div className="studio-container">
            <h2 id="preturi-pe-scurt" className="sr-only">
              {copy.prices}
            </h2>

            <nav aria-label={copy.fitLabel} className="mb-20 md:mb-28">
              <p className="mono-label text-[var(--fg-3)]">{copy.fitLabel}</p>
              <ol className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-5">
                {copy.fitSteps.map((step, index) => (
                  <li key={step.label}>
                    <a href={step.anchor} className="group flex items-baseline gap-3 border-t border-[var(--hairline)] pt-4">
                      <span className="mono-label text-[var(--fg-3)]">{String(index + 1).padStart(2, '0')}</span>
                      <span className="font-semibold text-[var(--ink)] transition-colors group-hover:text-[var(--accent)]">
                        {step.label} <span aria-hidden="true">→</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ol>
              <p className="mt-8 border-t border-[var(--hairline)] pt-6">
                <Link
                  href={localizePath('/ce-iti-trebuie', locale)}
                  className="font-sans text-base font-semibold text-[var(--ink)] underline decoration-[var(--brass)] underline-offset-4 transition-colors hover:text-[var(--brass-ink)]"
                >
                  {copy.guideLink}
                </Link>
              </p>
            </nav>

            <div className="flex flex-col gap-20 md:gap-28">
              {grouped.map((group) => (
                <section key={group.id} id={group.id} aria-labelledby={`${group.id}-titlu`} className="scroll-mt-24">
                  <h2 id={`${group.id}-titlu`} className="type-h2 text-balance">
                    {group.name[locale]}
                  </h2>
                  <p className="mt-4 max-w-xl leading-relaxed text-[var(--fg-2)]">{group.line[locale]}</p>
                  <ol className="big-rows mt-10 md:mt-14">
                    {group.services.map((service, index) => (
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
                </section>
              ))}
            </div>
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

// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BlogCard from '@/components/BlogCard'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import TrackedLink from '@/components/TrackedLink'
import PageHero from '@/components/studio/PageHero'
import { SegmentProvider } from '@/components/SegmentContext'
import { getIndustryBySlug, type Industry } from '@/lib/industries'
import { getPostBySlug, type BlogPost } from '@/lib/blog'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { getProjectBySlug, type Project } from '@/lib/projects'
import { breadcrumbNode, faqNode, graph, serviceNode, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { getServicePageBySlug, type ServicePage } from '@/lib/services'
import { absoluteUrl, whatsappUrl } from '@/lib/site'

type IndustryChrome = {
  kicker: string
  inShort: string
  problems: string
  dataPoint: string
  recommend: string
  price: string
  projects: string
  guide: string
  guideNote: string
  faqAbout: (name: string) => string
  contactTitle: string
  writeDirect: (message: string) => string
  whatsappCta: string
  preferForm: string
  quoteForm: string
  all: string
  imageAlt: (h1: string) => string
}

const industryChrome: Record<Locale, IndustryChrome> = {
  ro: {
    kicker: 'Soluții · Timișoara',
    inShort: 'Pe scurt',
    problems: 'Ce se întâmplă des',
    dataPoint: 'Un număr din teren',
    recommend: 'Ce îți recomandăm',
    price: 'Preț',
    projects: 'Din portofoliu',
    guide: 'Ghidul complet',
    guideNote: '',
    faqAbout: (name) => `Întrebări frecvente despre ${name}`,
    contactTitle: 'Hai să vorbim despre site-ul tău',
    writeDirect: (message) => `Sau scrie-ne direct: „${message}”`,
    whatsappCta: 'Scrie-ne pe WhatsApp',
    preferForm: 'Preferi un formular?',
    quoteForm: 'Trimite o cerere de ofertă',
    all: 'Toate serviciile și prețurile',
    imageAlt: (h1) => `${h1} la MAST Studio`,
  },
  en: {
    kicker: 'Solutions · Timișoara',
    inShort: 'In short',
    problems: 'What often happens',
    dataPoint: 'A number from the field',
    recommend: 'What we recommend',
    price: 'Price',
    projects: 'From our portfolio',
    guide: 'The complete guide',
    guideNote: 'Published in Romanian',
    faqAbout: (name) => `Frequently asked questions about ${name}`,
    contactTitle: 'Let’s talk about your website',
    writeDirect: (message) => `Or write to us directly: “${message}”`,
    whatsappCta: 'Message us on WhatsApp',
    preferForm: 'Prefer a form?',
    quoteForm: 'Send a quote request',
    all: 'All services and prices',
    imageAlt: (h1) => `${h1} at MAST Studio`,
  },
}

/** Lowercase the leading word so it reads naturally mid-sentence; keep acronyms such as AI intact. */
function phraseName(name: string, locale: Locale) {
  if (locale === 'ro') return name.toLowerCase()
  const [first, ...rest] = name.split(' ')
  if (first.slice(1) !== first.slice(1).toLowerCase()) return name
  return [first.charAt(0).toLowerCase() + first.slice(1), ...rest].join(' ')
}

export function industryMetadata(locale: Locale, publicSlug: string): Metadata {
  const industry = getIndustryBySlug(publicSlug, locale)
  if (!industry) return {}
  const path = localizePath(`/solutii/${industry.slug}`, locale)
  return pageMetadata({
    title: industry.seoTitle,
    description: industry.metaDescription,
    path,
    locale,
    socialTitle: industry.h1,
    image: {
      url: `${path}/og.png`,
      alt: industryChrome[locale].imageAlt(industry.h1),
    },
  })
}

function DotList({ items, tone }: { items: string[]; tone: 'brass' | 'muted' }) {
  return (
    <ul className="mt-4 flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="type-body flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-[10px] size-1.5 shrink-0 rounded-full"
            style={{ background: tone === 'brass' ? 'var(--brass)' : 'var(--ink-3)' }}
          />
          {item}
        </li>
      ))}
    </ul>
  )
}

export async function IndustryDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const industry = getIndustryBySlug(slug, locale)
  if (!industry) notFound()

  const copy = industryChrome[locale]
  const path = localizePath(`/solutii/${industry.slug}`, locale)
  const name = phraseName(industry.name, locale)
  // Missing references are skipped silently: the data may point at work that
  // has not been published yet, and a broken link must never ship.
  const services = industry.recommendedServices
    .map((serviceSlug) => getServicePageBySlug(serviceSlug, locale))
    .filter((item): item is ServicePage => Boolean(item))
  const projects = industry.projectSlugs
    .map((projectSlug) => getProjectBySlug(projectSlug, locale))
    .filter((item): item is Project => Boolean(item))
  // The guides are written in Romanian only, so the link keeps the Romanian URL.
  const post: BlogPost | undefined = industry.guidePost ? getPostBySlug(industry.guidePost, 'ro') : undefined

  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.solutions, path: localizePath('/solutii', locale) },
    { name: industry.name, path },
  ]

  const jsonLd = graph(
    webPageNode({ path, name: industry.h1, description: industry.metaDescription, breadcrumb: true, locale }),
    breadcrumbNode(crumbs),
    faqNode(industry.faq, path),
    services.length > 0
      ? {
          '@type': 'ItemList',
          '@id': `${absoluteUrl(path)}#servicii-recomandate`,
          name: copy.recommend,
          itemListElement: services.map((service, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: serviceNode(service, locale),
          })),
        }
      : undefined,
  )

  return (
    <>
      <SiteHeader current="solutii" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <article>
          <PageHero
            crumbs={crumbs}
            kicker={copy.kicker}
            title={industry.h1}
            intro={industry.intro}
            aside={
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
                <Link
                  href={`${localizePath('/cerere-oferta', locale)}?sursa=${industry.slug}`}
                  className="mono-label inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-[var(--radius-pill)] bg-[var(--brass-lite)] px-6 text-[var(--night)] transition-colors hover:bg-[var(--on-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass-lite)]"
                >
                  {ui[locale].nav.quote}
                </Link>
                <TrackedLink
                  href={whatsappUrl(industry.waMessage)}
                  eventName="whatsapp_click"
                  eventProperties={{ placement: 'industry_hero', industry: industry.slug }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mono-label inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-[var(--radius-pill)] border border-[var(--hairline-dark)] px-6 text-[var(--on-dark)] transition-colors hover:border-[var(--on-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass-lite)]"
                >
                  {copy.whatsappCta}
                </TrackedLink>
              </div>
            }
          >
            {projects.length > 0 ? (
              <nav aria-label={copy.projects}>
                <ul className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
                  {projects.slice(0, 3).map((project) => (
                    <li key={project.slug}>
                      <Link
                        href={localizePath(`/portofoliu/${project.slug}`, locale)}
                        className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass-lite)]"
                      >
                        <span className="relative block w-full overflow-hidden rounded-[6px] bg-[#0b0f17]" style={{ aspectRatio: '16 / 10' }}>
                          {project.cover ? (
                            <Image
                              src={project.cover}
                              alt={project.coverAlt}
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              className="object-cover object-[right_center] transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04] motion-reduce:transition-none"
                            />
                          ) : null}
                        </span>
                        <span className="mono-label mt-3 block truncate text-[var(--fg-3)] transition-colors group-hover:text-[var(--ink)]">
                          {project.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </PageHero>
          <div className="studio-container py-20 md:py-28">
            <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <p className="kicker">{copy.inShort}</p>
                <p className="display-xl mt-5 text-[clamp(1.5rem,2.1vw,2rem)] leading-[1.22] tracking-[-0.015em] text-[var(--ink)]">
                  {industry.answerCapsule}
                </p>
              </aside>
              <div>
                <section>
                  <h2 className="type-h3">{copy.problems}</h2>
                  <DotList items={industry.problems} tone="muted" />
                </section>

                <section className="mt-12 border-t border-[var(--hairline)] pt-12">
                  <h2 className="type-h3">{copy.dataPoint}</h2>
                  <figure className="mt-6 rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--shell-warm)] p-6 md:p-8">
                    <blockquote className="display-xl text-[clamp(1.3rem,1.9vw,1.7rem)] leading-[1.25] text-[var(--ink)]">
                      {industry.dataPoint.text}
                    </blockquote>
                    <figcaption className="mono-label mt-5 text-[var(--fg-3)]">{industry.dataPoint.source}</figcaption>
                  </figure>
                </section>

                <section className="mt-12 border-t border-[var(--hairline)] pt-12">
                  <h2 className="type-h3">{copy.recommend}</h2>
                  <ol className="big-rows mt-8">
                    {services.map((service, index) => (
                      <li key={service.slug}>
                        <Link href={localizePath(`/servicii/${service.slug}`, locale)} className="big-row service-row">
                          <span className="mono-label text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
                          <span className="min-w-0">
                            <span className="big-row-name block">{service.name}</span>
                            <span className="service-row-text">{service.serviceType}</span>
                          </span>
                          <span className="service-row-facts">
                            <span>
                              <span className="mono-label text-[var(--fg-3)]">{copy.price}</span>
                              <span className="block">{service.priceLabel}</span>
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                  <Link
                    href={localizePath('/servicii', locale)}
                    className="mt-6 inline-block font-sans text-sm font-semibold text-[var(--ink)] underline underline-offset-4"
                  >
                    {copy.all} →
                  </Link>
                </section>

                {post ? (
                  <section className="mt-12 border-t border-[var(--hairline)] pt-12">
                    <h2 className="type-h3">{copy.guide}</h2>
                    {copy.guideNote ? <p className="mono-label mt-2 text-[var(--fg-3)]">{copy.guideNote}</p> : null}
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                      <BlogCard post={post} headingLevel="h3" locale="ro" />
                    </div>
                  </section>
                ) : null}

                <section className="mt-12 border-t border-[var(--hairline)] pt-12">
                  <h2 className="type-h3">{copy.faqAbout(name)}</h2>
                  <div className="mt-6 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
                    {industry.faq.map((item) => (
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
                </section>
              </div>
            </div>

            <section className="porthole mt-24 flex flex-col items-start gap-5 p-8 md:p-12">
              <h2 className="type-h3">{copy.contactTitle}</h2>
              <SegmentProvider>
                <ContactButton hero label={ui[locale].whatsapp.defaultCta} />
              </SegmentProvider>
              <TrackedLink
                href={whatsappUrl(industry.waMessage)}
                eventName="industry_page_whatsapp_click"
                eventProperties={{ industry: industry.slug }}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-sm font-semibold text-[var(--brass-ink)] hover:underline"
              >
                {copy.writeDirect(industry.waMessage)}
              </TrackedLink>
              <p className="font-sans text-sm text-[var(--ink-2)]">
                {copy.preferForm}{' '}
                <Link
                  href={localizePath('/cerere-oferta', locale)}
                  className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4"
                >
                  {copy.quoteForm}
                </Link>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import BlogCard from '@/components/BlogCard'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import ProjectCard from '@/components/ProjectCard'
import SiteHeader from '@/components/SiteHeader'
import TrackedLink from '@/components/TrackedLink'
import PageHero from '@/components/studio/PageHero'
import { SegmentProvider } from '@/components/SegmentContext'
import { getPostBySlug, type BlogPost } from '@/lib/blog'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { getProjectBySlug, type Project } from '@/lib/projects'
import { breadcrumbNode, faqNode, graph, serviceNode, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { getAllServicePages, getServicePageBySlug } from '@/lib/services'
import { whatsappUrl } from '@/lib/site'

type ServicePageProps = {
  params: Promise<{ slug: string }>
}

type ServiceChrome = {
  kicker: string
  inShort: string
  price: string
  includesPrice: string
  includesSubscription: string
  paidSeparately: string
  forWho: string
  process: string
  faqAbout: (name: string) => string
  offerFor: (name: string) => string
  writeDirect: (message: string) => string
  preferForm: string
  quoteForm: string
  projects: string
  guides: string
  other: string
  all: string
  imageAlt: (h1: string, price: string) => string
}

const serviceChrome: Record<Locale, ServiceChrome> = {
  ro: {
    kicker: 'Servicii web design · Timișoara',
    inShort: 'Pe scurt',
    price: 'Preț',
    includesPrice: 'Ce include prețul',
    includesSubscription: 'Ce include abonamentul',
    paidSeparately: 'Ce se plătește separat',
    forWho: 'Pentru cine e potrivit',
    process: 'Cum decurge',
    faqAbout: (name) => `Întrebări frecvente despre ${name}`,
    offerFor: (name) => `Vrei o ofertă pentru ${name}?`,
    writeDirect: (message) => `Sau scrie-ne direct: „${message}”`,
    preferForm: 'Preferi un formular?',
    quoteForm: 'Trimite o cerere de ofertă',
    projects: 'Proiecte realizate',
    guides: 'Ghiduri utile',
    other: 'Alte servicii',
    all: 'Toate serviciile și prețurile',
    imageAlt: (h1, price) => `${h1} la MAST Studio, ${price}`,
  },
  en: {
    kicker: 'Web design services · Timișoara',
    inShort: 'In short',
    price: 'Price',
    includesPrice: 'What the price includes',
    includesSubscription: 'What the subscription includes',
    paidSeparately: 'What is paid separately',
    forWho: 'Who it’s for',
    process: 'How it works',
    faqAbout: (name) => `Frequently asked questions about ${name}`,
    offerFor: (name) => `Want a quote for ${name}?`,
    writeDirect: (message) => `Or write to us directly: “${message}”`,
    preferForm: 'Prefer a form?',
    quoteForm: 'Send a quote request',
    projects: 'Delivered projects',
    guides: 'Useful guides',
    other: 'Other services',
    all: 'All services and prices',
    imageAlt: (h1, price) => `${h1} at MAST Studio, ${price}`,
  },
}

/** Lowercase a leading word, but keep internal capitals such as WhatsApp and SaaS. Romanian stays fully lowercased, as before. */
function phraseName(name: string, locale: Locale) {
  if (locale === 'ro') return name.toLowerCase()
  const [first, ...rest] = name.split(' ')
  if (first.slice(1) !== first.slice(1).toLowerCase()) return name
  return [first.charAt(0).toLowerCase() + first.slice(1), ...rest].join(' ')
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllServicePages('ro').map((service) => ({ slug: service.slug }))
}

export function serviceMetadata(locale: Locale, publicSlug: string): Metadata {
  const service = getServicePageBySlug(publicSlug, locale)
  if (!service) return {}
  const path = localizePath(`/servicii/${service.slug}`, locale)
  const copy = serviceChrome[locale]
  return pageMetadata({
    title: service.seoTitle,
    description: service.metaDescription,
    path,
    locale,
    socialTitle: `${service.h1} — ${service.priceLabel}`,
    image: {
      url: `${path}/og.png`,
      alt: copy.imageAlt(service.h1, service.priceLabel),
    },
  })
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="type-body flex items-start gap-3">
          <svg aria-hidden="true" width="14" height="11" viewBox="0 0 14 11" fill="none" className="mt-[6px] shrink-0">
            <path d="M1 5.5L5 9.5L13 1.5" stroke="var(--brass)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  )
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

export async function ServiceDetail({ locale, slug }: { locale: Locale; slug: string }) {
  const service = getServicePageBySlug(slug, locale)
  if (!service) notFound()

  const copy = serviceChrome[locale]
  const path = localizePath(`/servicii/${service.slug}`, locale)
  const name = phraseName(service.shortName, locale)
  const related = service.relatedSlugs
    .map((relatedSlug) => getServicePageBySlug(relatedSlug, locale))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
  const projects = service.projectSlugs
    .map((projectSlug) => getProjectBySlug(projectSlug, locale))
    .filter((item): item is Project => Boolean(item))
  const posts = service.relatedPosts
    .map((postSlug) => getPostBySlug(postSlug, locale))
    .filter((item): item is BlogPost => Boolean(item))

  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.services, path: localizePath('/servicii', locale) },
    { name: service.name, path },
  ]

  const jsonLd = graph(
    webPageNode({ path, name: service.h1, description: service.metaDescription, breadcrumb: true, locale }),
    breadcrumbNode(crumbs),
    serviceNode(service, locale),
    faqNode(service.faq, path),
  )

  return (
    <>
      <SiteHeader current="servicii" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <article>
          <PageHero
            crumbs={crumbs}
            kicker={copy.kicker}
            title={service.h1}
            intro={service.intro}
            aside={
              <dl className="grid grid-cols-2 gap-8 border-t border-[var(--line)] pt-6 lg:ml-auto lg:max-w-sm">
                <div>
                  <dt className="mono-label text-[var(--fg-3)]">{copy.price}</dt>
                  <dd className="display-xl mt-3 text-[clamp(1.6rem,2.2vw,2.2rem)] leading-[1.05] text-[var(--accent)]">{service.priceLabel}</dd>
                </div>
                <div>
                  <dt className="mono-label text-[var(--fg-3)]">{service.deliveryLabel}</dt>
                  <dd className="display-xl mt-3 text-[clamp(1.6rem,2.2vw,2.2rem)] leading-[1.05]">{service.deliveryTime}</dd>
                </div>
              </dl>
            }
          />
          <div className="studio-container py-20 md:py-28">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr]">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <p className="kicker">{copy.inShort}</p>
              <p className="display-xl mt-5 text-[clamp(1.5rem,2.1vw,2rem)] leading-[1.22] tracking-[-0.015em] text-[var(--ink)]">{service.answerCapsule}</p>
            </aside>
          <div>
            <section>
              <h2 className="type-h3">{service.priceUnit ? copy.includesSubscription : copy.includesPrice}</h2>
              <CheckList items={service.includes} />
            </section>

            <section className="mt-12 border-t border-[var(--hairline)] pt-12">
              <h2 className="type-h3">{copy.paidSeparately}</h2>
              <DotList items={service.notIncluded} tone="muted" />
            </section>

            <section className="mt-12 border-t border-[var(--hairline)] pt-12">
              <h2 className="type-h3">{copy.forWho}</h2>
              <DotList items={service.forWho} tone="brass" />
            </section>

            <section className="mt-12 border-t border-[var(--hairline)] pt-12">
              <h2 className="type-h3">{copy.process}</h2>
              <ol className="mt-6 flex flex-col gap-6">
                {service.process.map((step, index) => (
                  <li key={step.step} className="flex gap-4">
                    <span
                      aria-hidden="true"
                      className="flex size-8 shrink-0 items-center justify-center rounded-full font-sans text-[13px] font-semibold"
                      style={{ background: 'var(--shell-warm)', color: 'var(--brass-ink)', border: '1px solid var(--hairline)' }}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-sans text-[15px] font-semibold text-[var(--ink)]">{step.step}</h3>
                      <p className="type-body mt-1 text-[15px]">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-12 border-t border-[var(--hairline)] pt-12">
              <h2 className="type-h3">{copy.faqAbout(name)}</h2>
              <div className="mt-6 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
                {service.faq.map((item) => (
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
            <h2 className="type-h3">{copy.offerFor(name)}</h2>
            <SegmentProvider>
              <ContactButton hero label={ui[locale].whatsapp.defaultCta} />
            </SegmentProvider>
            <TrackedLink
              href={whatsappUrl(service.waMessage)}
              eventName="service_page_whatsapp_click"
              eventProperties={{ service: service.name }}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-semibold text-[var(--brass-ink)] hover:underline"
            >
              {copy.writeDirect(service.waMessage)}
            </TrackedLink>
            <p className="font-sans text-sm text-[var(--ink-2)]">
              {copy.preferForm}{' '}
              <Link href={localizePath('/cerere-oferta', locale)} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                {copy.quoteForm}
              </Link>
              .
            </p>
          </section>

          {projects.length > 0 ? (
            <section className="mt-24">
              <h2 className="type-h2">{copy.projects}</h2>
              <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-2">
                {projects.map((project) => (
                  <ProjectCard key={project.slug} project={project} headingLevel="h3" />
                ))}
              </div>
            </section>
          ) : null}

          {posts.length > 0 ? (
            <section className="mt-24">
              <h2 className="type-h2">{copy.guides}</h2>
              <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogCard key={post.slug} post={post} headingLevel="h3" locale={locale} />
                ))}
              </div>
            </section>
          ) : null}

          {related.length > 0 ? (
            <section className="mt-24 border-t border-[var(--hairline)] pt-12">
              <h2 className="type-h2">{copy.other}</h2>
              <div className="mt-6 flex flex-col gap-3">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    href={localizePath(`/servicii/${item.slug}`, locale)}
                    className="group flex items-center justify-between gap-4 border-b border-[var(--hairline)] py-6"
                  >
                    <span className="display-xl text-[clamp(1.8rem,3vw,3rem)] text-[var(--ink)] transition-transform duration-500 group-hover:translate-x-3">{item.name}</span>
                    <span className="mono-label text-[var(--brass-ink)]">{item.priceLabel} →</span>
                  </Link>
                ))}
                <Link href={localizePath('/servicii', locale)} className="font-sans text-sm font-semibold text-[var(--ink)] underline underline-offset-4">
                  {copy.all}
                </Link>
              </div>
            </section>
          ) : null}
          </div>
        </article>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  return serviceMetadata('ro', slug)
}

export default async function Page({ params }: ServicePageProps) {
  const { slug } = await params
  return <ServiceDetail locale="ro" slug={slug} />
}

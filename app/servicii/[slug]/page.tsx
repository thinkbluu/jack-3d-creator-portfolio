import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import TrackedLink from '@/components/TrackedLink'
import { SegmentProvider, WHATSAPP_NUMBER } from '@/components/SegmentContext'
import { getAllServicePages, getServicePageBySlug } from '@/lib/services'

const siteUrl = 'https://maststudio.ro'

function getWaUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

type ServicePageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllServicePages().map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = getServicePageBySlug(slug)
  if (!service) return {}
  const canonical = `${siteUrl}/servicii/${service.slug}`
  const description = service.answerCapsule.length > 160 ? `${service.answerCapsule.slice(0, 157)}...` : service.answerCapsule
  return {
    title: `${service.name} | Prețuri și termene | MAST Studio`,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      url: canonical,
      title: `${service.name} | Prețuri și termene | MAST Studio`,
      description,
    },
  }
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = getServicePageBySlug(slug)
  if (!service) notFound()

  const related = service.relatedSlugs
    .map((relatedSlug) => getServicePageBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))

  const canonical = `${siteUrl}/servicii/${service.slug}`

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.answerCapsule,
    provider: { '@id': `${siteUrl}/#business` },
    areaServed: [
      { '@type': 'City', name: 'Timișoara' },
      { '@type': 'Country', name: 'România' },
    ],
    ...(service.priceFrom !== null
      ? {
          offers: {
            '@type': 'Offer',
            priceSpecification: {
              '@type': 'PriceSpecification',
              minPrice: service.priceFrom,
              priceCurrency: 'EUR',
            },
          },
        }
      : {
          offers: {
            '@type': 'Offer',
            priceSpecification: {
              '@type': 'PriceSpecification',
              description: 'Ofertă personalizată, răspuns în 24 de ore',
            },
          },
        }),
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Acasă', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Servicii', item: `${siteUrl}/#servicii` },
      { '@type': 'ListItem', position: 3, name: service.name, item: canonical },
    ],
  }

  return (
    <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <header className="border-b border-[var(--hairline)]">
        <nav aria-label="Navigație principală" className="site-container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-[22px] bg-[var(--brass)]"
              style={{
                mask: "url('/icons/mast-mark.svg') center / contain no-repeat",
                WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat",
              }}
            />
            <span className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-semibold">MAST</span>
              <span className="font-sans text-[10px] font-medium tracking-[.28em]">STUDIO</span>
            </span>
          </Link>
          <Link href="/" className="font-sans text-xs uppercase tracking-[0.16em] text-[var(--ink-2)] hover:text-[var(--ink)]">
            Înapoi la site
          </Link>
        </nav>
      </header>

      <article className="site-container py-16 md:py-24">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-2xl font-sans text-xs text-[var(--ink-3)]">
          <Link href="/" className="hover:text-[var(--ink)]">Acasă</Link>
          <span className="mx-2">/</span>
          <Link href="/#servicii" className="hover:text-[var(--ink)]">Servicii</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--ink)]">{service.name}</span>
        </nav>

        <header className="mx-auto mt-6 max-w-2xl">
          <p className="kicker">Servicii</p>
          <h1 className="type-h2 mt-4 text-balance">{service.name}</h1>
          <p className="type-body mt-4">{service.intro}</p>
        </header>

        <div className="mx-auto mt-8 max-w-2xl">
          <p className="kicker">Pe scurt</p>
          <div
            className="type-body mt-3 text-[17px] font-medium text-[var(--ink)]"
            style={{
              background: 'var(--shell-warm)',
              borderLeft: '3px solid var(--brass)',
              borderRadius: 'var(--radius-card)',
              padding: '20px 24px',
              marginBottom: '32px',
            }}
          >
            {service.answerCapsule}
          </div>
        </div>

        <div className="mx-auto flex max-w-2xl flex-wrap items-center gap-x-8 gap-y-3 border-y border-[var(--hairline)] py-6">
          <div>
            <p className="kicker">Preț</p>
            <p className="mt-1 font-sans text-2xl font-bold text-[var(--brass)]">{service.priceLabel}</p>
          </div>
          <div>
            <p className="kicker">Termen de livrare</p>
            <p className="mt-1 font-sans text-2xl font-bold text-[var(--ink)]">{service.deliveryTime}</p>
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <section className="mt-12">
            <h2 className="type-h3">Ce include prețul</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {service.includes.map((item) => (
                <li key={item} className="type-body flex items-start gap-3">
                  <svg aria-hidden="true" width="14" height="11" viewBox="0 0 14 11" fill="none" className="mt-[6px] shrink-0">
                    <path d="M1 5.5L5 9.5L13 1.5" stroke="var(--brass)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Ce se plătește separat</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {service.notIncluded.map((item) => (
                <li key={item} className="type-body flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[10px] size-1.5 shrink-0 rounded-full" style={{ background: 'var(--ink-3)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Pentru cine e potrivit</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {service.forWho.map((item) => (
                <li key={item} className="type-body flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[10px] size-1.5 shrink-0 rounded-full" style={{ background: 'var(--brass)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Cum decurge</h2>
            <ol className="mt-6 flex flex-col gap-6">
              {service.process.map((step, index) => (
                <li key={step.step} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full font-sans text-[13px] font-semibold"
                    style={{ background: 'var(--shell-warm)', color: 'var(--brass)', border: '1px solid var(--hairline)' }}
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
            <h2 className="type-h3">Întrebări frecvente despre {service.shortName.toLowerCase()}</h2>
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
                  <p className="mt-3 font-sans text-sm leading-relaxed text-[var(--ink-2)]">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <section className="porthole mx-auto mt-16 flex max-w-2xl flex-col items-start gap-5 border-[var(--glass-edge)] p-7">
          <p className="type-h3">Vrei o ofertă pentru {service.shortName.toLowerCase()}?</p>
          <SegmentProvider>
            <ContactButton hero label="Cere ofertă pe WhatsApp" />
          </SegmentProvider>
          <TrackedLink
            href={getWaUrl(service.waMessage)}
            eventName="service_page_whatsapp_click"
            eventProperties={{ service: service.name }}
            target="_blank"
            rel="noopener"
            className="font-sans text-sm font-semibold text-[var(--brass)] hover:underline"
          >
            {`Sau scrie-ne direct: „${service.waMessage}”`}
          </TrackedLink>
        </section>

        {related.length > 0 ? (
          <section className="mx-auto mt-16 max-w-2xl border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Alte servicii</h2>
            <div className="mt-6 flex flex-col gap-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/servicii/${item.slug}`}
                  className="type-body flex items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--hairline)] px-5 py-4 transition-colors hover:border-[var(--brass)]"
                >
                  <span className="font-semibold text-[var(--ink)]">{item.name}</span>
                  <span className="font-sans text-xs uppercase tracking-[0.14em] text-[var(--brass)]">{item.priceLabel} →</span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <Footer />
    </main>
  )
}

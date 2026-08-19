'use client'

import { ArrowUpRight } from 'lucide-react'
import FadeIn from './FadeIn'
import ChartKicker from './ChartKicker'
import TrackedLink from './TrackedLink'
import { getWaUrl, useSegment, type Segment } from './SegmentContext'

export const services = [
  {
    name: 'Site de prezentare',
    description: 'Clienții te caută pe Google, îți văd serviciile și prețurile, și îți scriu direct. Fără să sune, fără să aștepte.',
    price: 'de la 300 EUR',
    guarantee: 'Prima rundă de modificări inclusă',
    message: 'Salut! Vreau un site de prezentare, livrat în 48 de ore. Îmi poți face o ofertă?',
  },
  {
    name: 'Magazin online',
    description: 'Vinzi și noaptea. Catalog, plată cu cardul, comenzi și facturi care se emit singure.',
    price: 'de la 900 EUR',
    guarantee: 'Prima rundă de modificări inclusă',
    message: 'Salut! Vreau un magazin online. Îmi poți face o ofertă?',
  },
  {
    name: 'Aplicații web și mobile',
    description: 'Ai un proces care îți mănâncă orele? Îl transformăm într-un instrument pe care echipa ta chiar îl folosește.',
    price: 'ofertă personalizată',
    guarantee: 'Ofertă fixă, fără costuri surpriză',
    message: 'Salut! Am nevoie de o aplicație web sau mobilă. Putem discuta?',
  },
  {
    name: 'Platforme și SaaS',
    description: 'Ai o idee de produs digital? O construim de la schiță până la primii utilizatori care plătesc.',
    price: 'ofertă personalizată',
    guarantee: 'Ofertă fixă, fără costuri surpriză',
    message: 'Salut! Vreau să construim o platformă personalizată. Putem discuta?',
  },
]

const continuingServices = [
  {
    name: 'Mentenanță și creștere',
    description: 'Ne ocupăm noi mai departe: actualizări, siguranță, mici modificări și optimizare lunară ca să urci în Google.',
    price: 'de la 90 EUR pe lună, fără contract pe termen lung',
    message: 'Salut! Mă interesează mentenanță și creștere pentru site-ul meu.',
  },
  {
    name: 'Automatizări și WhatsApp',
    description: 'Clienții îți scriu, un asistent automat le răspunde, ia datele și îți lasă doar decizia. Plus facturare automată.',
    price: 'de la 250 EUR',
    message: 'Salut! Mă interesează automatizări și WhatsApp pentru afacerea mea.',
  },
]

const cardClass =
  'group flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--shell)]/60 p-6 transition-[transform,border-color,box-shadow] duration-[250ms] ease-out hover:-translate-y-[3px] hover:border-[var(--brass)] hover:shadow-[0_18px_44px_rgba(26,23,20,0.10)] focus-visible:-translate-y-[3px] focus-visible:border-[var(--brass)] focus-visible:shadow-[0_18px_44px_rgba(26,23,20,0.10)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] md:p-7'

function PriceLine({ children }: { children: string }) {
  return <p className="mt-4 font-sans text-sm font-bold text-[var(--brass)]">{children}</p>
}

function OfferAffordance() {
  return (
    <span className="mt-6 flex items-center gap-2">
      <span className="kicker">Cere ofertă</span>
      <ArrowUpRight
        aria-hidden="true"
        className="h-4 w-4 text-[var(--brass)] transition-transform duration-[250ms] ease-out group-hover:-translate-y-[3px] group-hover:translate-x-[3px]"
      />
    </span>
  )
}

const serviceItemListJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: services.map((service, position) => ({
    '@type': 'ListItem',
    position: position + 1,
    item: {
      '@type': 'Service',
      name: service.name,
      description: service.description,
      provider: { '@id': 'https://maststudio.ro/#business' },
      areaServed: [
        { '@type': 'City', name: 'Timișoara' },
        { '@type': 'Country', name: 'România' },
      ],
      ...(service.name === 'Site de prezentare' || service.name === 'Magazin online'
        ? {
            offers: {
              '@type': 'Offer',
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: service.name === 'Site de prezentare' ? 300 : 900,
                priceCurrency: 'EUR',
              },
            },
          }
        : {
            offers: {
              '@type': 'Offer',
              priceSpecification: {
                '@type': 'PriceSpecification',
                description: 'Ofertă personalizată',
              },
            },
          }),
    },
  })),
}

export default function ServicesSection() {
  const { segment } = useSegment()
  const recommendedName: Record<Segment, string> = {
    salon: 'Site de prezentare',
    servicii: 'Site de prezentare',
    ecommerce: 'Magazin online',
    platforma: 'Platforme și SaaS',
  }

  return (
    <section id="servicii" className="scene-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceItemListJsonLd).replace(/</g, '\\u003c') }} />
      <div className="porthole scene-panel">
        <FadeIn>
          <ChartKicker label="Servicii" />
          <h2 className="type-h2 text-balance">Patru direcții. Una e a ta.</h2>
          <p className="type-body mt-4">Prețuri la vedere. Alege ce ți se potrivește.</p>
        </FadeIn>

        <div className="mt-9 grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((service, index) => {
            const recommended = Boolean(segment && recommendedName[segment] === service.name)
            return (
              <FadeIn key={service.name} delay={index * 0.06} className="h-full">
                <TrackedLink
                  href={getWaUrl(null, service.message)}
                  eventName="service_whatsapp_click"
                  eventProperties={{ service: service.name }}
                  target="_blank"
                  rel="noopener"
                  aria-label={`Cere ofertă pe WhatsApp pentru ${service.name}`}
                  className={`${cardClass} ${recommended ? '!border-[var(--brass)] shadow-[0_18px_44px_rgba(26,23,20,0.10)]' : ''}`}
                >
                  <span className={`mb-4 w-fit rounded-[var(--radius-pill)] border border-[var(--brass)] px-3 py-1 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--brass)] ${recommended ? '' : 'invisible'}`}>
                    Recomandat pentru tine
                  </span>
                  <h3 className="type-h3">{service.name}</h3>
                  <p className="type-body mt-2 text-[0.95rem]">{service.description}</p>
                  <PriceLine>{service.price}</PriceLine>
                  <p className="mt-2 font-sans text-[12.5px] text-[var(--ink-3)]">{service.guarantee}</p>
                  <span className="mt-auto">
                    <OfferAffordance />
                  </span>
                </TrackedLink>
              </FadeIn>
            )
          })}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {continuingServices.map((service, index) => (
            <FadeIn key={service.name} delay={index * 0.06} className="h-full">
              <TrackedLink
                href={getWaUrl(null, service.message)}
                eventName="service_whatsapp_click"
                eventProperties={{ service: service.name }}
                target="_blank"
                rel="noopener"
                aria-label={`Cere ofertă pe WhatsApp pentru ${service.name}`}
                className={cardClass}
              >
                <h3 className="type-h3">{service.name}</h3>
                <p className="type-body mt-2 text-[0.95rem]">{service.description}</p>
                <PriceLine>{service.price}</PriceLine>
                <span className="mt-auto">
                  <OfferAffordance />
                </span>
              </TrackedLink>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

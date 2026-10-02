import {
  BUSINESS_ID,
  EMAIL,
  LEGAL_NAME,
  LOCATION,
  LOGO_URL,
  PHONE_E164,
  SITE_LANGUAGE,
  SITE_NAME,
  SITE_URL,
  SOCIAL_PROFILES,
  TRADE_REGISTER_NUMBER,
  VAT_ID,
  WEBSITE_ID,
  absoluteUrl,
} from './site'
import { getAllServicePages, type ServicePage } from './services'

type JsonObject = Record<string, unknown>

export type BreadcrumbItem = { name: string; path: string }

const areaServed = [
  { '@type': 'City', name: 'Timișoara' },
  { '@type': 'AdministrativeArea', name: 'Județul Timiș' },
  { '@type': 'Country', name: 'România' },
]

export const businessRef = { '@id': BUSINESS_ID }

/** City-level address: the studio serves clients remotely and has no office open to visitors. */
export function postalAddress() {
  return {
    '@type': 'PostalAddress',
    addressLocality: LOCATION.locality,
    addressRegion: LOCATION.region,
    addressCountry: LOCATION.countryCode,
  }
}

export function serviceUrl(service: Pick<ServicePage, 'slug'>) {
  return absoluteUrl(`/servicii/${service.slug}`)
}

function offerFor(service: ServicePage): JsonObject {
  if (service.priceFrom === null) {
    return {
      '@type': 'Offer',
      url: serviceUrl(service),
      priceCurrency: 'EUR',
      description: 'Ofertă personalizată cu preț fix, în 24 de ore de la prima discuție',
    }
  }
  return {
    '@type': 'Offer',
    url: serviceUrl(service),
    price: service.priceFrom,
    priceCurrency: 'EUR',
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      minPrice: service.priceFrom,
      priceCurrency: 'EUR',
      ...(service.priceUnit ? { unitCode: service.priceUnit, unitText: 'lună' } : {}),
    },
  }
}

export function serviceNode(service: ServicePage): JsonObject {
  return {
    '@type': 'Service',
    '@id': `${serviceUrl(service)}#service`,
    name: service.name,
    serviceType: service.serviceType,
    description: service.answerCapsule,
    url: serviceUrl(service),
    provider: businessRef,
    areaServed,
    offers: offerFor(service),
  }
}

export function businessNode(): JsonObject {
  return {
    '@type': 'ProfessionalService',
    '@id': BUSINESS_ID,
    name: SITE_NAME,
    alternateName: 'MAST Studio Timișoara',
    legalName: LEGAL_NAME,
    description:
      'Studio de web design din Timișoara. Site-uri de prezentare de la 300 EUR livrate în 48 de ore, magazine online de la 900 EUR, aplicații web, platforme SaaS, mentenanță și automatizări WhatsApp.',
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: LOGO_URL, width: 512, height: 512 },
    image: absoluteUrl('/opengraph-image'),
    telephone: PHONE_E164,
    email: EMAIL,
    address: postalAddress(),
    areaServed,
    priceRange: '300-3000 EUR',
    currenciesAccepted: 'EUR',
    knowsLanguage: ['ro', 'en'],
    vatID: VAT_ID,
    identifier: { '@type': 'PropertyValue', propertyID: 'Registrul Comerțului', value: TRADE_REGISTER_NUMBER },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: PHONE_E164,
      email: EMAIL,
      areaServed: 'RO',
      availableLanguage: ['ro', 'en'],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicii web design',
      itemListElement: getAllServicePages().map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.name, url: serviceUrl(service) },
        url: serviceUrl(service),
        ...(service.priceFrom !== null ? { price: service.priceFrom, priceCurrency: 'EUR' } : {}),
      })),
    },
    ...(SOCIAL_PROFILES.length ? { sameAs: SOCIAL_PROFILES } : {}),
  }
}

export function websiteNode(): JsonObject {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: ['MAST', 'maststudio.ro'],
    inLanguage: SITE_LANGUAGE,
    publisher: businessRef,
  }
}

export function webPageNode({
  path,
  name,
  description,
  type = 'WebPage',
  breadcrumb = false,
  mainEntity,
}: {
  path: string
  name: string
  description: string
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage'
  breadcrumb?: boolean
  mainEntity?: JsonObject
}): JsonObject {
  const url = absoluteUrl(path)
  return {
    '@type': type,
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    inLanguage: SITE_LANGUAGE,
    isPartOf: { '@id': WEBSITE_ID },
    ...(mainEntity ? { mainEntity } : {}),
    ...(breadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
  }
}

export function breadcrumbNode(items: BreadcrumbItem[]): JsonObject {
  const last = items[items.length - 1]
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(last.path)}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function faqNode(items: { question: string; answer: string }[], path: string): JsonObject {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
}

/** Wraps nodes in a single JSON-LD document. */
export function graph(...nodes: Array<JsonObject | null | undefined | false>) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) }
}

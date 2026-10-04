import ContestTeaser from '@/components/ContestTeaser'
import Footer from '@/components/Footer'
import HomePage from '@/components/HomePage'
import JsonLd from '@/components/JsonLd'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { getHomeFaqs } from '@/lib/home-faq'
import { businessRef, faqNode, graph, serviceNode, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { getAllServicePages } from '@/lib/services'
import { absoluteUrl } from '@/lib/site'

const homeServicesListName = {
  ro: 'Servicii web design MAST Studio',
  en: 'MAST Studio web design services',
} as const

function homeCopy(locale: Locale) {
  const meta = ui[locale].meta
  return {
    title: meta.homeTitle,
    description: meta.homeDescription,
    socialTitle: meta.socialTitle,
    servicesName: homeServicesListName[locale],
  }
}

export function homeMetadata(locale: Locale) {
  const copy = homeCopy(locale)
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: localizePath('/', locale),
    locale,
    socialTitle: copy.socialTitle,
    absoluteTitle: true,
  })
}

export function HomeView({ locale }: { locale: Locale }) {
  const copy = homeCopy(locale)
  const path = localizePath('/', locale)
  const services = getAllServicePages(locale)
  const homeJsonLd = graph(
    webPageNode({ path, name: copy.title, description: copy.description, locale, mainEntity: businessRef }),
    {
      '@type': 'ItemList',
      '@id': `${absoluteUrl(path)}#servicii`,
      name: copy.servicesName,
      itemListElement: services.map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: serviceNode(service, locale),
      })),
    },
    faqNode(
      getHomeFaqs(locale).map(([question, answer]) => ({ question, answer })),
      path,
    ),
  )

  return (
    <>
      <JsonLd data={homeJsonLd} />
      <HomePage afterScenes={<ContestTeaser />} footer={<Footer />} />
    </>
  )
}

export const metadata = homeMetadata('ro')

export default function Page() {
  return <HomeView locale="ro" />
}

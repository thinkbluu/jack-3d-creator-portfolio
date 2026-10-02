import Footer from '@/components/Footer'
import HomePage from '@/components/HomePage'
import JsonLd from '@/components/JsonLd'
import { homeFaqs } from '@/lib/home-faq'
import { businessRef, faqNode, graph, serviceNode, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { getAllServicePages } from '@/lib/services'
import { absoluteUrl } from '@/lib/site'

const title = 'Web design Timișoara · Creare site în 48h | MAST Studio'
const description =
  'Studio de web design din Timișoara: creare site de prezentare de la 300 EUR, live în 48 de ore, și magazine online de la 900 EUR. Avans 50 EUR.'

export const metadata = pageMetadata({
  title,
  description,
  path: '/',
  socialTitle: 'MAST Studio — web design Timișoara, site-ul tău live în 48 de ore',
  absoluteTitle: true,
})

const services = getAllServicePages()

const homeJsonLd = graph(
  webPageNode({ path: '/', name: title, description, mainEntity: businessRef }),
  {
    '@type': 'ItemList',
    '@id': `${absoluteUrl('/')}#servicii`,
    name: 'Servicii web design MAST Studio',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: serviceNode(service),
    })),
  },
  faqNode(
    homeFaqs.map(([question, answer]) => ({ question, answer })),
    '/',
  ),
)

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <HomePage footer={<Footer />} />
    </>
  )
}

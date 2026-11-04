// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import Link from 'next/link'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import PageOpen from '@/components/studio/PageOpen'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { PAGE_WORDS } from '@/lib/page-words'
import { getAllIndustries } from '@/lib/industries'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

type SolutionsCopy = {
  word: string
  lead: string
  title: string
  description: string
  kicker: string
  intro: string
  servicesLabel: string
  oneService: string
  manyServices: (count: number) => string
}

const solutionsCopy: Record<Locale, SolutionsCopy> = {
  ro: {
    word: PAGE_WORDS['/solutii'].ro,
    lead: 'Fiecare domeniu are întrebările lui. Am pus la un loc serviciile potrivite pentru fiecare.',
    title: 'Soluții pe domenii',
    description:
      'Fiecare domeniu are întrebările lui. Serviciile potrivite pentru clinici, cabinete veterinare, saloane, avocați, meseriași și magazine online, la un loc.',
    kicker: 'Soluții · Timișoara și toată România',
    intro: 'Alege domeniul tău și vezi ce îți recomandăm: servicii, prețuri de pornire și exemple din portofoliu, totul într-o singură pagină.',
    servicesLabel: 'Servicii',
    oneService: '1 serviciu',
    manyServices: (count) => `${count} servicii`,
  },
  en: {
    word: PAGE_WORDS['/solutii'].en,
    lead: 'Every industry has its own questions. We put the right services for each in one place.',
    title: 'Solutions by industry',
    description:
      'The right services for each industry: clinics, veterinary practices, salons, lawyers and accountants, trades and online stores, all in one place.',
    kicker: 'Solutions · Timișoara and across Romania',
    intro: 'Pick your industry and see what we recommend: services, starting prices and portfolio examples, all on a single page.',
    servicesLabel: 'Services',
    oneService: '1 service',
    manyServices: (count) => `${count} services`,
  },
}

/** First sentence of the answer capsule, as the one-line summary. */
function capsuleSummary(capsule: string) {
  const cut = capsule.indexOf('. ')
  return cut === -1 ? capsule : capsule.slice(0, cut + 1)
}

export function solutionsMetadata(locale: Locale) {
  const copy = solutionsCopy[locale]
  return pageMetadata({
    title: locale === 'ro' ? 'Soluții digitale pe domenii de activitate' : 'Digital solutions by industry',
    description: copy.description,
    path: localizePath('/solutii', locale),
    locale,
  })
}

export function SolutionsView({ locale }: { locale: Locale }) {
  const copy = solutionsCopy[locale]
  const path = localizePath('/solutii', locale)
  const industries = getAllIndustries(locale)

  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.solutions, path },
  ]

  const jsonLd = graph(
    webPageNode({ path, name: copy.title, description: copy.description, type: 'CollectionPage', breadcrumb: true, locale }),
    breadcrumbNode(crumbs),
    {
      '@type': 'ItemList',
      '@id': `${absoluteUrl(path)}#domenii`,
      name: copy.title,
      itemListElement: industries.map((industry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'WebPage',
          name: industry.name,
          url: absoluteUrl(localizePath(`/solutii/${industry.slug}`, locale)),
        },
      })),
    },
  )

  return (
    <>
      <SiteHeader current="solutii" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageOpen crumbs={crumbs} index="08" title={copy.title} word={copy.word} lead={copy.lead} short>
          <p className="max-w-sm leading-relaxed text-[var(--fg-2)]">{copy.intro}</p>
        </PageOpen>

        <section aria-labelledby="solutii-lista" className="tone-dark pb-[clamp(5rem,10vw,9rem)]">
          <div className="studio-container">
            <h2 id="solutii-lista" className="sr-only">
              {copy.title}
            </h2>
            <ol className="big-rows">
              {industries.map((industry, index) => (
                <li key={industry.slug}>
                  <Link href={localizePath(`/solutii/${industry.slug}`, locale)} className="big-row service-row">
                    <span className="mono-label text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
                    <span className="min-w-0">
                      <span className="big-row-name block">{industry.name}</span>
                      <span className="service-row-text">{capsuleSummary(industry.answerCapsule)}</span>
                    </span>
                    <span className="service-row-facts">
                      <span>
                        <span className="mono-label text-[var(--fg-3)]">{copy.servicesLabel}</span>
                        <span className="block">
                          {industry.recommendedServices.length === 1 ? copy.oneService : copy.manyServices(industry.recommendedServices.length)}
                        </span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

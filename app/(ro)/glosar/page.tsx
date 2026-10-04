import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
import { getAllGlossaryTerms, getGlossaryCategoryLabels, type GlossaryCategory } from '@/lib/glossary'
import type { Locale } from '@/lib/i18n/locale'
import { schemaLanguage } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

const glossaryPageCopy = {
  ro: {
    title: 'Glosar web design: termeni explicați simplu',
    description:
      'Termenii din web design explicați simplu, pentru patroni: PageSpeed, domeniu, găzduire, SEO, responsive, landing page, GDPR și alții. Fără jargon tehnic.',
    crumb: 'Glosar',
    kicker: 'Resurse',
    heading: 'Glosar de termeni web design',
    intro: 'Termenii pe care îi auzi când discuți despre site-uri, explicați pe înțelesul oricui.',
    filterLegend: 'Filtrează termenii după categorie',
    filterAll: 'Toate',
    seeAlso: 'Vezi și:',
    missing: 'Nu ai găsit termenul pe care îl căutai?',
    ask: 'Întreabă-ne pe WhatsApp',
    schemaSetName: 'Glosar de termeni web design MAST Studio',
  },
  en: {
    title: 'Web design glossary: terms explained simply',
    description:
      'Web design terms explained simply, for business owners: PageSpeed, domain, hosting, SEO, responsive, landing page, GDPR, and others. No technical jargon.',
    crumb: 'Glossary',
    kicker: 'Resources',
    heading: 'Web design glossary',
    intro: 'The terms you hear when you talk about websites, explained so anyone can follow.',
    filterLegend: 'Filter terms by category',
    filterAll: 'All',
    seeAlso: 'See also:',
    missing: 'Didn’t find the term you were looking for?',
    ask: 'Ask us on WhatsApp',
    schemaSetName: 'MAST Studio web design glossary',
  },
} as const

const categories: GlossaryCategory[] = ['tehnic', 'design', 'marketing', 'legal']

export function glossaryMetadata(locale: Locale) {
  const copy = glossaryPageCopy[locale]
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: localizePath('/glosar', locale),
    locale,
  })
}

export function GlossaryView({ locale }: { locale: Locale }) {
  const copy = glossaryPageCopy[locale]
  const labels = getGlossaryCategoryLabels(locale)
  const path = localizePath('/glosar', locale)
  const terms = getAllGlossaryTerms(locale)
  const language = schemaLanguage(locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: copy.crumb, path },
  ]

  const definedTermSet = {
    '@type': 'DefinedTermSet',
    '@id': `${absoluteUrl(path)}#glosar`,
    name: copy.schemaSetName,
    url: absoluteUrl(path),
    inLanguage: language,
    hasDefinedTerm: terms.map((item) => ({
      '@type': 'DefinedTerm',
      '@id': `${absoluteUrl(path)}#${item.slug}`,
      name: item.term,
      description: item.definition,
      url: `${absoluteUrl(path)}#${item.slug}`,
      inLanguage: language,
      inDefinedTermSet: { '@id': `${absoluteUrl(path)}#glosar` },
    })),
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <article className="glosar-page site-container py-12 md:py-20">
        <header className="mx-auto max-w-2xl">
          <Breadcrumbs items={crumbs} />
          <p className="kicker mt-6">{copy.kicker}</p>
          <h1 className="type-h2 mt-4 text-balance">{copy.heading}</h1>
          <p className="type-body mt-4">{copy.intro}</p>
        </header>

        <div className="mx-auto mt-8 max-w-2xl">
          <fieldset className="flex flex-wrap gap-2">
            <legend className="sr-only">{copy.filterLegend}</legend>

            <label className="glosar-pill-label">
              <input type="radio" name="glosar-filter" id="glosar-filter-all" className="peer sr-only" defaultChecked />
              <span className="glosar-pill peer-checked:border-[var(--ink)] peer-checked:bg-[var(--ink)] peer-checked:text-[var(--shell)]">
                {copy.filterAll}
              </span>
            </label>

            {categories.map((category) => (
              <label key={category} className="glosar-pill-label">
                <input type="radio" name="glosar-filter" id={`glosar-filter-${category}`} className="peer sr-only" />
                <span className="glosar-pill peer-checked:border-[var(--ink)] peer-checked:bg-[var(--ink)] peer-checked:text-[var(--shell)]">
                  {labels[category]}
                </span>
              </label>
            ))}
          </fieldset>
        </div>

        <div className="glosar-list mx-auto mt-4 max-w-2xl">
          {terms.map((item) => (
            <div
              key={item.slug}
              id={item.slug}
              data-category={item.category}
              className="glosar-term border-t border-[var(--hairline)] py-8 first:border-t-0 first:pt-6"
            >
              <p className="kicker">{labels[item.category]}</p>
              <h2 className="type-h3 mt-2">{item.term}</h2>
              <p className="type-body mt-3">{item.definition}</p>
              {item.extra ? <p className="type-body mt-2 text-[14px] text-[var(--ink-3)]">{item.extra}</p> : null}
              {item.related?.length ? (
                <p className="mt-4 flex flex-wrap items-center gap-2 font-sans text-[13px] text-[var(--ink-3)]">
                  <span>{copy.seeAlso}</span>
                  {item.related.map((relatedSlug, index) => {
                    const relatedTerm = terms.find((t) => t.slug === relatedSlug)
                    if (!relatedTerm) return null
                    return (
                      <span key={relatedSlug}>
                        <a href={`#${relatedSlug}`} className="text-[var(--brass-ink)] hover:underline">
                          {relatedTerm.term}
                        </a>
                        {index < item.related!.length - 1 ? ',' : ''}
                      </span>
                    )
                  })}
                </p>
              ) : null}
            </div>
          ))}
        </div>

        <section className="porthole mx-auto mt-16 flex max-w-2xl flex-col items-start gap-5 border-[var(--glass-edge)] p-7">
          <h2 className="type-h3">{copy.missing}</h2>
          <SegmentProvider>
            <ContactButton hero label={copy.ask} />
          </SegmentProvider>
        </section>
      </article>

      <style>{`
        .glosar-pill-label { cursor: pointer; }
        .glosar-pill {
          display: flex;
          min-height: 2.75rem;
          align-items: center;
          border-radius: var(--radius-pill);
          border: 1px solid var(--hairline);
          padding: 0.5rem 1rem;
          font-family: var(--font-sans);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--ink-2);
          transition: border-color 0.15s, background-color 0.15s, color 0.15s;
        }
        .glosar-pill-label:hover .glosar-pill { border-color: var(--brass); color: var(--ink); }

        /* CSS-only filtering: hide terms that don't match the checked category pill. */
        .glosar-page:has(#glosar-filter-tehnic:checked) .glosar-term:not([data-category="tehnic"]) { display: none; }
        .glosar-page:has(#glosar-filter-design:checked) .glosar-term:not([data-category="design"]) { display: none; }
        .glosar-page:has(#glosar-filter-marketing:checked) .glosar-term:not([data-category="marketing"]) { display: none; }
        .glosar-page:has(#glosar-filter-legal:checked) .glosar-term:not([data-category="legal"]) { display: none; }
      `}</style>

      </main>
      <Footer />
      <JsonLd
        data={graph(
          webPageNode({
            path,
            name: copy.heading,
            description: copy.description,
            breadcrumb: true,
            locale,
            mainEntity: { '@id': `${absoluteUrl(path)}#glosar` },
          }),
          breadcrumbNode(crumbs),
          definedTermSet,
        )}
      />
    </>
  )
}

export const metadata = glossaryMetadata('ro')

export default function Page() {
  return <GlossaryView locale="ro" />
}

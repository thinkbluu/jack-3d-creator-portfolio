import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
import { getAllGlossaryTerms, glossaryCategoryLabels, type GlossaryCategory } from '@/lib/glossary'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

const path = '/glosar'
const description =
  'Termenii din web design explicați simplu, pentru patroni: PageSpeed, domeniu, găzduire, SEO, responsive, landing page, GDPR și alții. Fără jargon tehnic.'

export const metadata = pageMetadata({
  title: 'Glosar web design: termeni explicați simplu',
  description,
  path,
})

const crumbs: BreadcrumbItem[] = [
  { name: 'Acasă', path: '/' },
  { name: 'Glosar', path },
]

const categories: GlossaryCategory[] = ['tehnic', 'design', 'marketing', 'legal']

export default function GlossaryPage() {
  const terms = getAllGlossaryTerms()

  const definedTermSet = {
    '@type': 'DefinedTermSet',
    '@id': `${absoluteUrl(path)}#glosar`,
    name: 'Glosar de termeni web design MAST Studio',
    url: absoluteUrl(path),
    inLanguage: 'ro-RO',
    hasDefinedTerm: terms.map((item) => ({
      '@type': 'DefinedTerm',
      '@id': `${absoluteUrl(path)}#${item.slug}`,
      name: item.term,
      description: item.definition,
      url: `${absoluteUrl(path)}#${item.slug}`,
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
          <p className="kicker mt-6">Resurse</p>
          <h1 className="type-h2 mt-4 text-balance">Glosar de termeni web design</h1>
          <p className="type-body mt-4">
            Termenii pe care îi auzi când discuți despre site-uri, explicați pe înțelesul oricui.
          </p>
        </header>

        <div className="mx-auto mt-8 max-w-2xl">
          <fieldset className="flex flex-wrap gap-2">
            <legend className="sr-only">Filtrează termenii după categorie</legend>

            <label className="glosar-pill-label">
              <input type="radio" name="glosar-filter" id="glosar-filter-all" className="peer sr-only" defaultChecked />
              <span className="glosar-pill peer-checked:border-[var(--ink)] peer-checked:bg-[var(--ink)] peer-checked:text-[var(--shell)]">
                Toate
              </span>
            </label>

            {categories.map((category) => (
              <label key={category} className="glosar-pill-label">
                <input type="radio" name="glosar-filter" id={`glosar-filter-${category}`} className="peer sr-only" />
                <span className="glosar-pill peer-checked:border-[var(--ink)] peer-checked:bg-[var(--ink)] peer-checked:text-[var(--shell)]">
                  {glossaryCategoryLabels[category]}
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
              <p className="kicker">{glossaryCategoryLabels[item.category]}</p>
              <h2 className="type-h3 mt-2">{item.term}</h2>
              <p className="type-body mt-3">{item.definition}</p>
              {item.extra ? <p className="type-body mt-2 text-[14px] text-[var(--ink-3)]">{item.extra}</p> : null}
              {item.related?.length ? (
                <p className="mt-4 flex flex-wrap items-center gap-2 font-sans text-[13px] text-[var(--ink-3)]">
                  <span>Vezi și:</span>
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
          <h2 className="type-h3">Nu ai găsit termenul pe care îl căutai?</h2>
          <SegmentProvider>
            <ContactButton hero label="Întreabă-ne pe WhatsApp" />
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
          webPageNode({ path, name: 'Glosar de termeni web design', description, breadcrumb: true, mainEntity: { '@id': `${absoluteUrl(path)}#glosar` } }),
          breadcrumbNode(crumbs),
          definedTermSet,
        )}
      />
    </>
  )
}

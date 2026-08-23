import type { Metadata } from 'next'
import Link from 'next/link'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import { SegmentProvider } from '@/components/SegmentContext'
import { getAllGlossaryTerms, glossaryCategoryLabels, type GlossaryCategory } from '@/lib/glossary'

const siteUrl = 'https://maststudio.ro'

export const metadata: Metadata = {
  title: 'Glosar de termeni web design | MAST Studio',
  description:
    'Termenii din web design explicați simplu: PageSpeed, domeniu, găzduire, SEO, responsive și alții. Fără jargon.',
  alternates: { canonical: `${siteUrl}/glosar` },
}

const categories: GlossaryCategory[] = ['tehnic', 'design', 'marketing', 'legal']

export default function GlossaryPage() {
  const terms = getAllGlossaryTerms()

  const definedTermSetJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Glosar de termeni web design MAST Studio',
    url: `${siteUrl}/glosar`,
    hasDefinedTerm: terms.map((item) => ({
      '@type': 'DefinedTerm',
      name: item.term,
      description: item.definition,
      url: `${siteUrl}/glosar#${item.slug}`,
    })),
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

      <article className="glosar-page site-container py-16 md:py-24">
        <header className="mx-auto max-w-2xl">
          <p className="kicker">Resurse</p>
          <h1 className="type-h2 mt-4 text-balance">Glosar de termeni</h1>
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
                        <a href={`#${relatedSlug}`} className="text-[var(--brass)] hover:underline">
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
          <p className="type-h3">Nu ai găsit termenul pe care îl căutai?</p>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetJsonLd) }} />
      <Footer />
    </main>
  )
}

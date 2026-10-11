import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import NewsletterForm from '@/components/NewsletterForm'
import SiteHeader from '@/components/SiteHeader'
import PageOpen from '@/components/studio/PageOpen'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

const letter = {
  ro: {
    title: 'Newsletter MAST Studio: scrisori lunare despre web design',
    description: 'O scrisoare pe lună de la MAST Studio: ce am construit, ce am învățat și ce ne-a plăcut pe web. Fără reclame, te dezabonezi cu un singur răspuns.',
    name: 'Newsletter MAST Studio',
    word: 'Scrisori.',
    lead: 'O dată pe lună, de la studio, direct în inbox.',
    insideLabel: 'Ce găsești în ea',
    inside: [
      { title: 'Ce am construit', text: 'Un proiect recent și alegerile de design din spatele lui.' },
      { title: 'Ce am învățat', text: 'Un lucru practic despre site-uri, scris pentru cine are o afacere, nu pentru programatori.' },
      { title: 'Ce ne-a plăcut', text: 'Câteva site-uri, fonturi sau idei văzute pe web în luna aceea.' },
    ],
    promiseLabel: 'Promisiunea',
    promise: 'O scrisoare pe lună, nu mai mult. Fără reclame, fără liste vândute mai departe. Te scoatem din listă cu un singur răspuns.',
    formLabel: 'Abonează-te',
  },
  en: {
    title: 'MAST Studio newsletter: monthly letters on web design',
    description: 'One letter a month from MAST Studio: what we built, what we learned and what we liked on the web. No ads; unsubscribe with a single reply.',
    name: 'MAST Studio newsletter',
    word: 'Letters.',
    lead: 'Once a month, from the studio, straight to your inbox.',
    insideLabel: 'What’s inside',
    inside: [
      { title: 'What we built', text: 'A recent project and the design choices behind it.' },
      { title: 'What we learned', text: 'One practical thing about websites, written for business owners, not developers.' },
      { title: 'What we liked', text: 'A few websites, typefaces or ideas we saw on the web that month.' },
    ],
    promiseLabel: 'The promise',
    promise: 'One letter a month, no more. No ads, no lists sold on. One reply takes you off the list.',
    formLabel: 'Subscribe',
  },
} as const

export function newsletterMetadata(locale: Locale) {
  const copy = letter[locale]
  return pageMetadata({ title: copy.title, description: copy.description, path: localizePath('/newsletter', locale), locale })
}

export function NewsletterView({ locale }: { locale: Locale }) {
  const copy = letter[locale]
  const path = localizePath('/newsletter', locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.newsletter, path },
  ]

  return (
    <>
      <SiteHeader tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageOpen crumbs={crumbs} title={copy.name} word={copy.word} lead={copy.lead} short>
          <div className="w-full max-w-md">
            <p className="mono-label mb-4 text-[var(--fg-3)]">{copy.formLabel}</p>
            <NewsletterForm placement="newsletter_page" />
          </div>
        </PageOpen>
        <section className="page-section">
          <div className="studio-container">
            <p className="mono-label text-[var(--ink-3)]">{copy.insideLabel}</p>
            <ol className="mt-10 grid gap-10 md:grid-cols-3">
              {copy.inside.map((item, index) => (
                <li key={item.title} className="border-t border-[var(--ink)] pt-6">
                  <span className="mono-label text-[var(--brass-ink)]">{String(index + 1).padStart(2, '0')}</span>
                  <h2 className="display-xl mt-5 text-[clamp(2rem,3.2vw,3rem)] leading-none">{item.title}</h2>
                  <p className="mt-3 leading-relaxed text-[var(--ink-2)]">{item.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-24 grid gap-6 border-t border-[var(--hairline)] pt-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              <p className="mono-label text-[var(--ink-3)]">{copy.promiseLabel}</p>
              <p className="display-xl text-[clamp(1.8rem,3.2vw,3rem)] leading-[1.05]">{copy.promise}</p>
            </div>
          </div>
        </section>
      </main>
      <Footer letter={false} />
      <JsonLd data={graph(webPageNode({ path, name: copy.name, description: copy.description, breadcrumb: true, locale }), breadcrumbNode(crumbs))} />
    </>
  )
}

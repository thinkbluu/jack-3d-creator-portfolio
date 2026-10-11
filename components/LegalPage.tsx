import type { ReactNode } from 'react'
import Footer from './Footer'
import JsonLd from './JsonLd'
import SiteHeader from './SiteHeader'
import PageHero from './studio/PageHero'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'

type LegalPageProps = {
  locale?: Locale
  eyebrow: string
  title: string
  description: string
  /** Public path, already localized by the page. */
  path: string
  updated: string
  children: ReactNode
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4 border-t border-[var(--hairline)] pt-8">
      <h2 className="text-balance text-2xl font-semibold text-[var(--ink)] md:text-3xl">{title}</h2>
      <div className="flex flex-col gap-4 text-pretty text-base leading-relaxed text-[var(--ink-2)]">{children}</div>
    </section>
  )
}

export default function LegalPage({ locale = 'ro', eyebrow, title, description, path, updated, children }: LegalPageProps) {
  const copy = ui[locale].common
  const crumbs: BreadcrumbItem[] = [
    { name: copy.home, path: localizePath('/', locale) },
    { name: title, path },
  ]

  return (
    <>
      <SiteHeader tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <article>
          <PageHero crumbs={crumbs} kicker={eyebrow} title={title}>
            <p className="mono-label text-[var(--fg-3)]">
              {copy.updated}: {updated}
            </p>
          </PageHero>
          <div className="site-container flex max-w-4xl flex-col gap-12 py-20 md:py-28">{children}</div>
        </article>
      </main>
      <Footer />
      <JsonLd data={graph(webPageNode({ path, name: title, description, breadcrumb: true, locale }), breadcrumbNode(crumbs))} />
    </>
  )
}

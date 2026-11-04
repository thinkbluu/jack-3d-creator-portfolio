// Offer copy re-evaluates hourly so the no-deposit offer flips without a redeploy.
export const revalidate = 3600

import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import PageOpen from '@/components/studio/PageOpen'
import CheckerTool, { type ServiceLink } from '@/components/checker/CheckerTool'
import { checkerCopy } from '@/lib/checker/copy'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { getServicePageBySlug } from '@/lib/services'
import { WHATSAPP_NUMBER, absoluteUrl } from '@/lib/site'
import { PAGE_WORDS } from '@/lib/page-words'

const RECOMMENDED_SLUGS = [
  'conformitate-legala-site',
  'audit-securitate-gdpr',
  'refacere-site',
  'site-de-prezentare',
  'seo-local',
]

const seoCopy: Record<Locale, { title: string; description: string }> = {
  ro: {
    title: 'Verifică-ți site-ul gratuit: viteză, legal, Google',
    description:
      'Află în 15 secunde cum stă site-ul firmei tale: viteză pe mobil, legal, Google, contact. Rezultatul pe ecran, raportul PDF gratuit pe email.',
  },
  en: {
    title: 'Check your website free: speed, legal, Google',
    description:
      'See in 15 seconds how your business website stands: mobile speed, legal, Google, contact. Results on screen, the full PDF report by email.',
  },
}

export function checkerMetadata(locale: Locale) {
  const copy = seoCopy[locale]
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: localizePath('/verifica-site', locale),
    locale,
  })
}

export function CheckerView({ locale }: { locale: Locale }) {
  const copy = checkerCopy[locale]
  const path = localizePath('/verifica-site', locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: copy.ui.navLabel, path },
  ]

  const services: ServiceLink[] = RECOMMENDED_SLUGS.flatMap((slug) => {
    const service = getServicePageBySlug(slug, locale)
    if (!service) return []
    return [
      {
        slug,
        name: service.name,
        priceLabel: service.priceLabel,
        href: localizePath(`/servicii/${slug}`, locale),
      },
    ]
  })

  const jsonLd = graph(
    webPageNode({ path, name: copy.ui.h1, description: seoCopy[locale].description, type: 'WebPage', breadcrumb: true, locale }),
    breadcrumbNode(crumbs),
    {
      '@type': 'WebApplication',
      '@id': `${absoluteUrl(path)}#aplicatie`,
      name: 'MAST Studio Website Checker',
      url: absoluteUrl(path),
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      isAccessibleForFree: true,
      inLanguage: locale,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
    },
  )

  return (
    <>
      <SiteHeader tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageOpen crumbs={crumbs} index="03" title={copy.ui.h1} word={PAGE_WORDS['/verifica-site'][locale]} lead={copy.ui.lead} short>
          <p className="max-w-sm leading-relaxed text-[var(--fg-2)]">{copy.ui.intro}</p>
        </PageOpen>

        <section aria-labelledby="verificare" className="tone-dark pb-[clamp(5rem,10vw,9rem)]">
          <div className="studio-container">
            <h2 id="verificare" className="sr-only">
              {copy.ui.progressTitle}
            </h2>
            <CheckerTool
              locale={locale}
              copy={copy}
              privacyHref={localizePath('/confidentialitate', locale)}
              whatsappHref={`https://wa.me/${WHATSAPP_NUMBER}`}
              services={services}
            />
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

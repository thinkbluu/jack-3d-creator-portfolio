import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import SiteHeader from '@/components/SiteHeader'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'

export function notFoundMetadata(locale: Locale): Metadata {
  const copy = ui[locale].notFound
  return {
    title: { absolute: `${copy.metaTitle} | MAST Studio` },
    description: copy.metaDescription,
    robots: { index: false, follow: true },
  }
}

export default function NotFoundView({ locale }: { locale: Locale }) {
  const copy = ui[locale].notFound
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[70vh] items-center bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container flex max-w-4xl flex-col gap-7 py-24">
          <p className="type-kicker">{copy.kicker}</p>
          <h1 className="type-h1 text-balance">{copy.title}</h1>
          <p className="type-body max-w-2xl !text-[var(--ink-2)]">{copy.body}</p>
          <Link href={localizePath('/', locale)} className="w-fit rounded-full border border-[var(--brass)] px-6 py-3 font-medium text-[var(--brass-ink)] transition-colors hover:bg-[var(--brass)] hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]">
            {copy.back}
          </Link>
          <nav aria-label={copy.useful}>
            <ul className="flex flex-wrap gap-x-6">
              {copy.links.map((link) => (
                <li key={link.href}>
                  <Link href={localizePath(link.href, locale)} className="font-sans text-sm font-semibold text-[var(--ink)] underline underline-offset-4">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  )
}

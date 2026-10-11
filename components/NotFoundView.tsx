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
      <SiteHeader tone="dark" overlay />
      <main className="tone-dark grain relative flex min-h-svh items-center overflow-hidden">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-[10vw] top-1/2 size-[70vw] max-w-[60rem] -translate-y-1/2 bg-[var(--navy-2)] opacity-70"
          style={{
            mask: "url('/icons/mast-mark.svg') center / contain no-repeat",
            WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat",
          }}
        />
        <div className="studio-container relative flex flex-col gap-7 py-32">
          <p className="type-kicker">{copy.kicker}</p>
          <h1 className="display-xl max-w-4xl text-balance text-[clamp(3rem,8vw,8rem)]">{copy.title}</h1>
          <p className="type-body max-w-2xl !text-[var(--ink-2)]">{copy.body}</p>
          <Link href={localizePath('/', locale)} data-magnetic
            className="mono-label w-fit items-center rounded-full bg-[var(--brass-lite)] px-6 text-[var(--night)] transition-colors hover:bg-[var(--on-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass-lite)]">
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
      <Footer cta={false} />
    </>
  )
}

import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import SiteHeader from '@/components/SiteHeader'
import { CONTEST_PATH } from '@/lib/contest/config'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { textLinkClass } from './form-styles'

const chrome = {
  ro: {
    kicker: 'Concurs · Site gratuit',
    invalidBefore: 'Linkul nu mai e valabil sau e incomplet. Deschide-l din ultimul e-mail primit de la noi sau înscrie-te din nou pe ',
    invalidLink: 'pagina concursului',
    invalidAfter: '.',
  },
  en: {
    kicker: 'Contest · Free website',
    invalidBefore: 'This link is no longer valid or is incomplete. Open it from the latest email we sent you, or enter again on the ',
    invalidLink: 'contest page',
    invalidAfter: '.',
  },
} satisfies Record<Locale, { kicker: string; invalidBefore: string; invalidLink: string; invalidAfter: string }>

/** Pages reached through personal links in contest e-mails stay out of search results. */
export function privateMetadata(title: string): Metadata {
  return { title: { absolute: `${title} | MAST Studio` }, robots: { index: false, follow: false } }
}

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'success' }) {
  return (
    <p
      role="status"
      className="type-body rounded-[var(--radius-card)] border px-5 py-4 text-[var(--ink)]"
      style={{ borderColor: tone === 'success' ? 'var(--brass)' : 'var(--hairline)', background: 'var(--shell-warm)' }}
    >
      {children}
    </p>
  )
}

export function InvalidLink({ locale = 'ro' }: { locale?: Locale }) {
  const t = chrome[locale]
  return (
    <p className="type-body">
      {t.invalidBefore}
      <Link href={localizePath(CONTEST_PATH, locale)} className={textLinkClass}>
        {t.invalidLink}
      </Link>
      {t.invalidAfter}
    </p>
  )
}

export default function ContestPrivatePage({ title, children, locale = 'ro' }: { title: string; children: ReactNode; locale?: Locale }) {
  const t = chrome[locale]
  return (
    <>
      <SiteHeader current="site-gratuit" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container py-12 md:py-20">
          <div className="mx-auto max-w-2xl">
            <p className="kicker">{t.kicker}</p>
            <h1 className="type-h2 mt-4 text-balance">{title}</h1>
            <div className="mt-8 flex flex-col gap-6">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

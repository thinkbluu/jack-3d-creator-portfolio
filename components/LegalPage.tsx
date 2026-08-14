import Link from 'next/link'
import type { ReactNode } from 'react'
import Footer from './Footer'

type LegalPageProps = {
  eyebrow: string
  title: string
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

export default function LegalPage({ eyebrow, title, updated, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <header className="site-container flex items-center justify-between gap-4 border-b border-[var(--hairline)] py-6">
        <Link href="/" className="type-kicker text-[var(--brass)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]">MAST Studio</Link>
        <Link href="/" className="text-sm text-[var(--ink-2)] transition-colors hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]">Înapoi la bord</Link>
      </header>
      <article className="site-container flex max-w-4xl flex-col gap-12 py-16 md:py-24">
        <header className="flex flex-col gap-5">
          <p className="type-kicker text-[var(--brass)]">{eyebrow}</p>
          <h1 className="type-h1 text-balance">{title}</h1>
          <p className="type-body !text-[var(--ink-3)]">Ultima actualizare: {updated}</p>
        </header>
        {children}
      </article>
      <Footer />
    </main>
  )
}

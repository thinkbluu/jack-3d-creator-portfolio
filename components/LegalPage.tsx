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
    <section className="flex flex-col gap-4 border-t border-[var(--line)] pt-8">
      <h2 className="text-balance text-2xl font-semibold text-[var(--text)] md:text-3xl">{title}</h2>
      <div className="flex flex-col gap-4 text-pretty text-base leading-relaxed text-[var(--text-2)]">{children}</div>
    </section>
  )
}

export default function LegalPage({ eyebrow, title, updated, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="site-container flex items-center justify-between gap-4 border-b border-[var(--line)] py-6">
        <Link href="/" className="type-kicker text-[var(--gold)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]">MAST Studio</Link>
        <Link href="/" className="text-sm text-[var(--text-2)] transition-colors hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--gold)]">Înapoi la bord</Link>
      </header>
      <article className="site-container flex max-w-4xl flex-col gap-12 py-16 md:py-24">
        <header className="flex flex-col gap-5">
          <p className="type-kicker text-[var(--gold)]">{eyebrow}</p>
          <h1 className="type-h1 text-balance">{title}</h1>
          <p className="type-body !text-[var(--text-3)]">Ultima actualizare: {updated}</p>
        </header>
        <aside className="rounded-2xl border border-[var(--gold-soft)] bg-[rgba(201,168,106,0.06)] p-5 text-sm leading-relaxed text-[var(--text-2)]">
          <strong className="text-[var(--text)]">Înainte de publicare:</strong> completați sediul social, CUI și numărul de înregistrare la Registrul Comerțului. Aceste date nu sunt disponibile în proiect și nu au fost inventate.
        </aside>
        {children}
      </article>
      <Footer />
    </main>
  )
}

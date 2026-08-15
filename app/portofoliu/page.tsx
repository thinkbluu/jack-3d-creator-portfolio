import type { Metadata } from 'next'
import Link from 'next/link'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import PortfolioGrid from '@/components/PortfolioGrid'
import { SegmentProvider } from '@/components/SegmentContext'
import { getAllProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Portofoliu | MAST Studio',
  description: 'Site-uri, platforme și proiecte digitale construite de MAST Studio pentru afaceri și instituții din România.',
  alternates: { canonical: 'https://maststudio.ro/portofoliu' },
}

export default function PortfolioPage() {
  const projects = getAllProjects()

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

      <div className="site-container py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="kicker">Portofoliu</p>
          <h1 className="type-h2 mt-4 text-balance">Proiecte livrate</h1>
          <p className="type-body mt-6 max-w-2xl text-[var(--ink-2)]">
            Site-uri, platforme și proiecte digitale construite integral de noi, pentru afaceri și instituții din România.
          </p>
        </div>

        <PortfolioGrid projects={projects} />

        <section className="porthole mt-20 flex flex-col items-start gap-5 p-8">
          <p className="type-h3">Vrei ca proiectul tău să fie următorul?</p>
          <SegmentProvider>
            <ContactButton hero label="Cere ofertă pe WhatsApp" />
          </SegmentProvider>
        </section>
      </div>
      <Footer />
    </main>
  )
}

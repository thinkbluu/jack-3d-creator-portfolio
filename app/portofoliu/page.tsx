import type { Metadata } from 'next'
import Link from 'next/link'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import { SegmentProvider } from '@/components/SegmentContext'
import { getAllProjects } from '@/lib/projects'
import type { Project } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Portofoliu | MAST Studio',
  description: 'Site-uri, platforme și proiecte digitale construite de MAST Studio pentru afaceri și instituții din România.',
  alternates: { canonical: 'https://maststudio.ro/portofoliu' },
}

type FilterId = Project['category'] | 'toate'

const filters: Array<{ id: FilterId; label: string }> = [
  { id: 'toate', label: 'Toate' },
  { id: 'site-prezentare', label: 'Site de prezentare' },
  { id: 'site-institutional', label: 'Site instituțional' },
  { id: 'platforma', label: 'Platformă' },
  { id: 'concept-design', label: 'Concepte' },
]

type PortfolioPageProps = {
  searchParams: Promise<{ filtru?: string }>
}

export default async function PortfolioPage({ searchParams }: PortfolioPageProps) {
  const { filtru } = await searchParams
  const activeFilter: FilterId = filters.some((filter) => filter.id === filtru) ? (filtru as FilterId) : 'toate'

  const allProjects = getAllProjects()
  const filteredProjects =
    activeFilter === 'toate' ? allProjects : allProjects.filter((project) => project.category === activeFilter)

  const clientProjects = filteredProjects.filter((project) => project.type === 'client')
  const conceptProjects = filteredProjects.filter((project) => project.type === 'concept')

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

        <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label="Filtrează după categorie">
          {filters.map((filter) => {
            const isActive = filter.id === activeFilter
            const href = filter.id === 'toate' ? '/portofoliu' : `/portofoliu?filtru=${filter.id}`
            return (
              <Link
                key={filter.id}
                href={href}
                aria-current={isActive ? 'true' : undefined}
                className="kicker flex min-h-11 items-center rounded-full px-4 text-[11px] transition-colors duration-200"
                style={
                  isActive
                    ? { background: 'var(--brass)', color: 'var(--ink)', borderColor: 'var(--brass)' }
                    : { border: '1px solid var(--hairline)', color: 'var(--ink-2)' }
                }
              >
                {filter.label}
              </Link>
            )
          })}
        </div>

        {clientProjects.length > 0 ? (
          <section aria-label="Proiecte pentru clienți" className="mt-12">
            <h2 className="type-h3">Proiecte pentru clienți</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {clientProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        ) : null}

        {conceptProjects.length > 0 ? (
          <section
            aria-label="Concepte de design"
            className="mt-[72px] border-t border-[var(--hairline)] pt-[56px]"
          >
            <h2 className="type-h3">Concepte de design</h2>
            <p className="type-body mt-2 text-[14px] text-[var(--ink-2)]">
              Exerciții de design și interacțiune, construite pentru a testa idei. Nu reprezintă afaceri reale.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {conceptProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </section>
        ) : null}

        {clientProjects.length === 0 && conceptProjects.length === 0 ? (
          <p className="mt-12 border-t border-[var(--hairline)] pt-6 font-sans text-sm text-[var(--ink-3)]">
            Nu avem încă proiecte în această categorie.
          </p>
        ) : null}

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

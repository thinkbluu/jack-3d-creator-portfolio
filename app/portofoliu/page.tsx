'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import { SegmentProvider } from '@/components/SegmentContext'
import { getAllProjects, type ProjectCategory } from '@/lib/projects'

const filters: Array<{ id: ProjectCategory | 'toate'; label: string }> = [
  { id: 'toate', label: 'Toate' },
  { id: 'site-prezentare', label: 'Site de prezentare' },
  { id: 'magazin-online', label: 'Magazin online' },
  { id: 'aplicatie', label: 'Aplicație' },
  { id: 'platforma', label: 'Platformă' },
  { id: 'branding', label: 'Branding' },
]

export default function PortfolioPage() {
  const projects = getAllProjects()
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | 'toate'>('toate')

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'toate') return projects
    return projects.filter((project) => project.category === activeFilter)
  }, [projects, activeFilter])

  return (
    <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <header className="border-b border-[var(--hairline)]">
        <nav aria-label="Navigație principală" className="site-container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span aria-hidden="true" className="size-[22px] bg-[var(--brass)]" style={{ mask: "url('/icons/mast-mark.svg') center / contain no-repeat", WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat" }} />
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
            Site-uri, magazine online și platforme construite pentru afaceri reale.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label="Filtrează după categorie">
          {filters.map((filter) => {
            const isActive = filter.id === activeFilter
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setActiveFilter(filter.id)}
                aria-pressed={isActive}
                className="kicker rounded-full px-4 py-2 text-[11px] transition-colors duration-200"
                style={
                  isActive
                    ? { background: 'var(--brass)', color: 'var(--ink)', borderColor: 'var(--brass)' }
                    : { border: '1px solid var(--hairline)', color: 'var(--ink-2)' }
                }
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        <section aria-label="Proiecte" className="mt-12">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}
            </div>
          ) : (
            <p className="border-t border-[var(--hairline)] pt-6 font-sans text-sm text-[var(--ink-3)]">
              Primele proiecte apar aici în curând.
            </p>
          )}
        </section>

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

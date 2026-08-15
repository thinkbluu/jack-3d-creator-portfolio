'use client'

import { useMemo, useState } from 'react'
import ProjectCard from '@/components/ProjectCard'
import type { Project } from '@/lib/projects'

type FilterId = Project['category'] | 'toate'

const filters: Array<{ id: FilterId; label: string }> = [
  { id: 'toate', label: 'Toate' },
  { id: 'site-prezentare', label: 'Site de prezentare' },
  { id: 'site-institutional', label: 'Site instituțional' },
  { id: 'platforma', label: 'Platformă' },
]

export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterId>('toate')

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'toate') return projects
    return projects.filter((project) => project.category === activeFilter)
  }, [projects, activeFilter])

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label="Filtrează după categorie">
        {filters.map((filter) => {
          const isActive = filter.id === activeFilter
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              aria-pressed={isActive}
              className="kicker flex min-h-11 items-center rounded-full px-4 text-[11px] transition-colors duration-200"
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
            Nu avem încă proiecte în această categorie.
          </p>
        )}
      </section>
    </>
  )
}

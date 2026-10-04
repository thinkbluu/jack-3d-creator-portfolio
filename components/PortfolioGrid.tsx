'use client'

import { useEffect, useMemo, useState } from 'react'
import ProjectCard from '@/components/ProjectCard'
import type { Project } from '@/lib/projects'
import { useUi } from '@/lib/i18n/context'

const filterIds = ['toate', 'site-prezentare', 'site-institutional', 'platforma', 'concept-design'] as const
type FilterId = (typeof filterIds)[number]

function isFilterId(value: string | null): value is FilterId {
  return filterIds.some((id) => id === value)
}

/**
 * Filters on the client so /portofoliu stays a static page. The server-rendered
 * HTML lists every project; a `?filtru=` link from elsewhere is applied after mount.
 */
export default function PortfolioGrid({ projects }: { projects: Project[] }) {
  const copy = useUi().projects
  const filters = filterIds.map((id) => ({ id, label: copy.filters[id] }))
  const [activeFilter, setActiveFilter] = useState<FilterId>('toate')

  // Read the URL after mount (it does not exist during prerendering). Deferred to
  // the next frame, the same way ConsentBanner adopts stored state.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const fromUrl = new URLSearchParams(window.location.search).get('filtru')
      if (isFilterId(fromUrl)) setActiveFilter(fromUrl)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const selectFilter = (id: FilterId) => {
    setActiveFilter(id)
    const url = id === 'toate' ? window.location.pathname : `${window.location.pathname}?filtru=${id}`
    window.history.replaceState(null, '', url)
  }

  const filteredProjects = useMemo(
    () => (activeFilter === 'toate' ? projects : projects.filter((project) => project.category === activeFilter)),
    [projects, activeFilter],
  )
  const clientProjects = filteredProjects.filter((project) => project.type === 'client')
  const conceptProjects = filteredProjects.filter((project) => project.type === 'concept')

  return (
    <>
      <div className="mt-10 flex flex-wrap gap-3" role="group" aria-label={copy.filtersLabel}>
        {filters.map((filter) => {
          const isActive = filter.id === activeFilter
          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => selectFilter(filter.id)}
              aria-pressed={isActive}
              className="kicker flex min-h-11 items-center rounded-full px-4 text-[11px] transition-colors duration-200"
              style={
                isActive
                  ? { background: 'var(--brass)', color: 'var(--ink)', border: '1px solid var(--brass)' }
                  : { border: '1px solid var(--hairline)', color: 'var(--ink-2)' }
              }
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {clientProjects.length > 0 ? (
        <section aria-labelledby="proiecte-clienti" className="mt-12">
          <h2 id="proiecte-clienti" className="type-h3">
            {copy.clients}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {clientProjects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} headingLevel="h3" priority={index < 2} />
            ))}
          </div>
        </section>
      ) : null}

      {conceptProjects.length > 0 ? (
        <section aria-labelledby="concepte-design" className="mt-[72px] border-t border-[var(--hairline)] pt-[56px]">
          <h2 id="concepte-design" className="type-h3">
            {copy.concepts}
          </h2>
          <p className="type-body mt-2 text-[14px] text-[var(--ink-2)]">
            {copy.conceptsNote}
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            {conceptProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} headingLevel="h3" />
            ))}
          </div>
        </section>
      ) : null}

      {filteredProjects.length === 0 ? (
        <p className="mt-12 border-t border-[var(--hairline)] pt-6 font-sans text-sm text-[var(--ink-2)]">
          {copy.empty}
        </p>
      ) : null}
    </>
  )
}

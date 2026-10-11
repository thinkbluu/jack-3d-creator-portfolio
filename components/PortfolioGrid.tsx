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
              className={`mono-label flex min-h-11 items-center rounded-full border px-5 transition-colors duration-300 ${
                isActive
                  ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--shell)]'
                  : 'border-[var(--hairline)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {clientProjects.length > 0 ? (
        <section aria-labelledby="proiecte-clienti" className="mt-12">
          <h2 id="proiecte-clienti" className="kicker">
            {copy.clients}
          </h2>
          {/* Editorial rhythm: wide and narrow cards alternate, the right column drops. */}
          <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-12">
            {clientProjects.map((project, index) => (
              <div
                key={project.slug}
                className={`${index % 4 === 0 || index % 4 === 3 ? 'md:col-span-7' : 'md:col-span-5'} ${index % 2 === 1 ? 'md:mt-32' : ''}`}
              >
                <ProjectCard project={project} headingLevel="h3" priority={index < 2} />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {conceptProjects.length > 0 ? (
        <section aria-labelledby="concepte-design" className="mt-32 border-t border-[var(--hairline)] pt-16">
          <h2 id="concepte-design" className="type-h2">
            {copy.concepts}
          </h2>
          <p className="mt-4 max-w-xl text-[var(--ink-2)]">
            {copy.conceptsNote}
          </p>
          <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-16 md:grid-cols-3">
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

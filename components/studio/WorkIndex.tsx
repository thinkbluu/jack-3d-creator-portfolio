'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useHref, useUi } from '@/lib/i18n/context'
import type { Project } from '@/lib/projects'

const filterIds = ['toate', 'site-prezentare', 'site-institutional', 'platforma', 'concept-design'] as const
type FilterId = (typeof filterIds)[number]

function isFilterId(value: string | null): value is FilterId {
  return filterIds.some((id) => id === value)
}

/** Portrait and landscape covers alternate, so the two columns never line up. */
const SHAPES = ['4 / 5', '4 / 3', '4 / 3', '4 / 5'] as const

/**
 * The work index: large covers in two staggered columns, each rising into
 * place as it scrolls in. The filters work on the client so the page stays
 * static; `?filtru=` from a link elsewhere is applied after mount.
 */
export default function WorkIndex({ projects }: { projects: Project[] }) {
  const copy = useUi().projects
  const href = useHref()
  const [active, setActive] = useState<FilterId>('toate')
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const fromUrl = new URLSearchParams(window.location.search).get('filtru')
      if (isFilterId(fromUrl)) setActive(fromUrl)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const visible = useMemo(
    () => (active === 'toate' ? projects : projects.filter((project) => project.category === active)),
    [projects, active],
  )

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const items = Array.from(list.querySelectorAll<HTMLElement>('[data-work]'))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-in', '')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    list.setAttribute('data-ready', '')
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [visible])

  const select = (id: FilterId) => {
    setActive(id)
    window.history.replaceState(null, '', id === 'toate' ? window.location.pathname : `${window.location.pathname}?filtru=${id}`)
  }

  const count = (id: FilterId) => (id === 'toate' ? projects.length : projects.filter((project) => project.category === id).length)

  return (
    <div>
      <div className="work-filters" role="group" aria-label={copy.filtersLabel}>
        {filterIds
          .filter((id) => count(id) > 0)
          .map((id) => (
            <button key={id} type="button" aria-pressed={active === id} onClick={() => select(id)} className="work-filter mono-label">
              {copy.filters[id]}
              <sup>{count(id)}</sup>
            </button>
          ))}
      </div>

      <ul ref={listRef} className="work-grid">
        {visible.map((project, index) => (
          <li key={project.slug} data-work="" className="work-item" style={{ '--shape': SHAPES[index % 4] } as CSSProperties}>
            <Link href={href(`/portofoliu/${project.slug}`)} data-cursor={copy.view} className="work-card link-block">
              <span className="work-card-media">
                <Image
                  src={project.cover}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 46vw, 100vw"
                  priority={index < 2}
                  className="object-cover object-top"
                />
              </span>
              <span className="work-card-meta mono-label">
                <span>{project.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{project.year}</span>
                {project.status === 'in-lucru' ? <span className="work-card-flag">{copy.inProgress}</span> : null}
                {project.type === 'concept' ? <span className="work-card-flag">{copy.concept}</span> : null}
              </span>
              <h2 className="work-card-name display-xl">{project.name}</h2>
              <span className="work-card-line">{project.summary}</span>
            </Link>
          </li>
        ))}
      </ul>

      {visible.length === 0 ? <p className="mt-12 text-[var(--fg-2)]">{copy.empty}</p> : null}
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Project } from '@/lib/projects'

type ProjectCardProps = {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <Link
      href={`/portofoliu/${project.slug}`}
      className="porthole group flex flex-col overflow-hidden p-0 transition-[transform,border-color] duration-[350ms] hover:-translate-y-[3px] hover:border-[var(--brass)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
        {imageFailed || !project.cover ? (
          <div className="flex h-full w-full items-center justify-center bg-[var(--shell-warm)] px-6">
            <span className="kicker text-center">{project.name}</span>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.cover}
            alt={`Site-ul ${project.name}, realizat de MAST Studio`}
            width={1200}
            height={750}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition-transform duration-[350ms] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={
                project.type === 'concept'
                  ? 'kicker rounded-full border border-[var(--hairline)] px-3 py-1 text-[10px] text-[var(--ink-3)]'
                  : 'kicker rounded-full border border-[var(--glass-edge)] px-3 py-1 text-[10px]'
              }
            >
              {project.categoryLabel}
            </span>
            {project.status === 'in-lucru' ? (
              <span className="kicker rounded-full border border-[var(--hairline)] px-3 py-1 text-[10px] text-[var(--ink-3)]">
                În lucru
              </span>
            ) : null}
            {project.type === 'concept' ? (
              <span className="kicker rounded-full border border-[var(--hairline)] px-3 py-1 text-[10px] text-[var(--ink-3)]">
                Concept
              </span>
            ) : null}
          </div>
          <span className="shrink-0 font-sans text-xs text-[var(--ink-3)]">{project.year}</span>
        </div>
        <h2 className="type-h3 text-pretty">{project.name}</h2>
        <p className="type-body text-[13.5px] text-[var(--ink-3)]">{project.client}</p>
        <p className="type-body line-clamp-2 text-[14px] text-[var(--ink-2)]">{project.summary}</p>
      </div>
    </Link>
  )
}

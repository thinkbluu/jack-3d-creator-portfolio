'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/projects'
import { useHref, useUi } from '@/lib/i18n/context'

type ProjectCardProps = {
  project: Project
  /** Use h3 when the card sits under a section h2. */
  headingLevel?: 'h2' | 'h3'
  /** Load the image eagerly with high priority (first card above the fold). */
  priority?: boolean
}

export default function ProjectCard({ project, headingLevel = 'h2', priority = false }: ProjectCardProps) {
  const [imageFailed, setImageFailed] = useState(false)
  const href = useHref()
  const copy = useUi().projects
  const Heading = headingLevel
  const alt =
    project.type === 'concept'
      ? `${copy.altConcept} ${project.name}`
      : `${copy.altClient} ${project.name}${copy.altClientBy}`

  return (
    <Link
      href={href(`/portofoliu/${project.slug}`)}
      className="porthole group flex flex-col overflow-hidden p-0 transition-[transform,border-color] duration-[350ms] hover:-translate-y-[3px] hover:border-[var(--brass)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span className="relative block w-full overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
        {imageFailed || !project.cover ? (
          <span className="flex h-full w-full items-center justify-center bg-[var(--shell-warm)] px-6">
            <span className="kicker text-center">{project.name}</span>
          </span>
        ) : (
          <Image
            src={project.cover}
            alt={alt}
            fill
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            sizes="(min-width: 1024px) 560px, (min-width: 768px) 50vw, 100vw"
            onError={() => setImageFailed(true)}
            className="object-cover transition-transform duration-[350ms] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}
      </span>
      <span className="flex flex-1 flex-col gap-3 p-6">
        <span className="flex items-center justify-between gap-3">
          <span className="flex flex-wrap items-center gap-2">
            <span
              className={
                project.type === 'concept'
                  ? 'kicker rounded-full border border-[var(--hairline)] px-3 py-1 text-[10px] text-[var(--ink-2)]'
                  : 'kicker rounded-full border border-[var(--glass-edge)] px-3 py-1 text-[10px]'
              }
            >
              {project.categoryLabel}
            </span>
            {project.status === 'in-lucru' ? (
              <span className="kicker rounded-full border border-[var(--hairline)] px-3 py-1 text-[10px] text-[var(--ink-2)]">
                {copy.inProgress}
              </span>
            ) : null}
            {project.type === 'concept' ? (
              <span className="kicker rounded-full border border-[var(--hairline)] px-3 py-1 text-[10px] text-[var(--ink-2)]">
                {copy.concept}
              </span>
            ) : null}
          </span>
          <span className="shrink-0 font-sans text-xs text-[var(--ink-2)]">{project.year}</span>
        </span>
        <Heading className="type-h3 text-pretty">{project.name}</Heading>
        <span className="type-body text-[13.5px] text-[var(--ink-2)]">{project.client}</span>
        <span className="type-body line-clamp-2 text-[14px] text-[var(--ink-2)]">{project.summary}</span>
      </span>
    </Link>
  )
}

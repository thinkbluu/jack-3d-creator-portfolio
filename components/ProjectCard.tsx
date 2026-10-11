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
  const { projects: copy, redesign } = useUi()
  const cursor = redesign.cursor
  const Heading = headingLevel
  const alt =
    project.type === 'concept'
      ? `${copy.altConcept} ${project.name}`
      : `${copy.altClient} ${project.name}${copy.altClientBy}`

  return (
    <Link
      href={href(`/portofoliu/${project.slug}`)}
      data-cursor={cursor.view}
      className="link-block group flex flex-col focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
    >
      <span className="relative block w-full overflow-hidden rounded-[6px] bg-[var(--shell-warm)]" style={{ aspectRatio: '16 / 10' }}>
        {imageFailed || !project.cover ? (
          <span className="flex h-full w-full items-center justify-center px-6">
            <span className="kicker text-center">{project.name}</span>
          </span>
        ) : (
          <Image
            src={project.cover}
            alt={alt}
            fill
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            sizes="(min-width: 1024px) 50vw, 100vw"
            onError={() => setImageFailed(true)}
            className="object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        )}
      </span>
      <span className="mt-5 flex flex-col gap-3">
        <span className="mono-label flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--ink-3)]">
          <span>{project.categoryLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{project.year}</span>
          {project.status === 'in-lucru' ? (
            <>
              <span aria-hidden="true">·</span>
              <span>{copy.inProgress}</span>
            </>
          ) : null}
          {project.type === 'concept' ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-[var(--brass-ink)]">{copy.concept}</span>
            </>
          ) : null}
        </span>
        <Heading className="display-xl text-pretty text-[clamp(1.9rem,3vw,3rem)] transition-colors duration-500 group-hover:text-[var(--brass-ink)]">
          {project.name}
        </Heading>
        <span className="text-[var(--ink-2)]">{project.client}</span>
        <span className="line-clamp-2 max-w-xl text-[var(--ink-2)]">{project.summary}</span>
      </span>
    </Link>
  )
}

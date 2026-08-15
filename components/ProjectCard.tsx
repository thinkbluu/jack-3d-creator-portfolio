import Link from 'next/link'
import type { Project } from '@/lib/projects'

type ProjectCardProps = {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/portofoliu/${project.slug}`}
      className="porthole group flex flex-col overflow-hidden p-0 transition-[transform,border-color] duration-200 hover:-translate-y-[3px] hover:border-[var(--brass)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16 / 10' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.cover}
          alt={project.name}
          width={800}
          height={500}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="kicker rounded-full border border-[var(--glass-edge)] px-3 py-1 text-[10px] text-[var(--ink-2)]">
            {project.categoryLabel}
          </span>
          <span className="font-sans text-xs text-[var(--ink-3)]">{project.year}</span>
        </div>
        <h2 className="type-h3 text-pretty">{project.name}</h2>
        <p className="type-body line-clamp-2 text-[14px] text-[var(--ink-2)]">{project.summary}</p>
      </div>
    </Link>
  )
}

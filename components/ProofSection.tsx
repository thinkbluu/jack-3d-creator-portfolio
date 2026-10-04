'use client'

import Link from 'next/link'
import ChartKicker from './ChartKicker'
import ComparisonSection from './ComparisonSection'
import ProjectCard from './ProjectCard'
import { useHref, useLocale, useUi } from '@/lib/i18n/context'
import { getAllProjects, getFeaturedProjects } from '@/lib/projects'

export default function ProofSection() {
  const locale = useLocale()
  const href = useHref()
  const copy = useUi().proof

  if (getAllProjects(locale).length === 0) {
    return <ComparisonSection />
  }

  const featured = getFeaturedProjects(3, locale)

  return (
    <section id="dovada" className="scene-section">
      <div className="porthole scene-panel">
        <ChartKicker label={copy.kicker} />
        <h2 className="type-h2 text-balance">{copy.title}</h2>
        <p className="type-body mt-4">{copy.intro}</p>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href={href('/portofoliu')}
            className="font-sans text-sm font-semibold text-[var(--brass-ink)] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-[var(--brass)]"
          >
            {copy.all}
          </Link>
        </div>
      </div>
    </section>
  )
}

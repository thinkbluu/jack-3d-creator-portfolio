import Link from 'next/link'
import ChartKicker from './ChartKicker'
import ComparisonSection from './ComparisonSection'
import ProjectCard from './ProjectCard'
import { getAllProjects, getFeaturedProjects } from '@/lib/projects'

export default function ProofSection() {
  if (getAllProjects().length === 0) {
    return <ComparisonSection />
  }

  const featured = getFeaturedProjects(3)

  return (
    <section id="dovada" className="scene-section">
      <div className="porthole scene-panel">
        <ChartKicker label="Dovada" />
        <h2 className="type-h2 text-balance">Proiecte livrate, nu exemple.</h2>
        <p className="type-body mt-4">Site-uri și platforme construite integral de noi, live acum.</p>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/portofoliu"
            className="font-sans text-sm font-semibold text-[var(--brass)] underline decoration-transparent underline-offset-4 transition-colors hover:decoration-[var(--brass)]"
          >
            Vezi toate proiectele →
          </Link>
        </div>
      </div>
    </section>
  )
}

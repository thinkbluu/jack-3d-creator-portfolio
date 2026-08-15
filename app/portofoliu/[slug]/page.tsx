import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import ProjectCard from '@/components/ProjectCard'
import { SegmentProvider } from '@/components/SegmentContext'
import { getAllProjects, getProjectBySlug } from '@/lib/projects'

const siteUrl = 'https://maststudio.ro'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  const canonical = `${siteUrl}/portofoliu/${project.slug}`
  return {
    title: `${project.name} | Portofoliu MAST Studio`,
    description: project.summary,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title: `${project.name} | Portofoliu MAST Studio`,
      description: project.summary,
      images: [{ url: project.cover }],
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const related = getAllProjects().filter((item) => item.slug !== project.slug).slice(0, 2)

  const creativeWorkJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: project.summary,
    dateCreated: String(project.year),
    creator: { '@type': 'Organization', name: 'MAST Studio', url: siteUrl },
    about: { '@type': 'Organization', name: project.client },
    ...(project.liveUrl ? { url: project.liveUrl } : {}),
  }

  return (
    <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <header className="border-b border-[var(--hairline)]">
        <nav className="site-container flex h-20 items-center justify-between">
          <Link href="/portofoliu" className="font-sans text-sm text-[var(--ink-2)] hover:text-[var(--ink)]">← Înapoi la portofoliu</Link>
          <Link href="/" className="font-serif text-xl font-semibold">MAST</Link>
        </nav>
      </header>

      <article className="site-container py-16 md:py-24">
        <header className="mx-auto max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="kicker rounded-full border border-[var(--glass-edge)] px-3 py-1 text-[10px]">{project.categoryLabel}</span>
            {project.status === 'in-lucru' ? (
              <span className="kicker rounded-full border border-[var(--hairline)] px-3 py-1 text-[10px] text-[var(--ink-3)]">În lucru</span>
            ) : null}
            {project.type === 'concept' ? (
              <span className="kicker rounded-full border border-[var(--hairline)] px-3 py-1 text-[10px] text-[var(--ink-3)]">Concept</span>
            ) : null}
          </div>
          <h1 className="type-h2 mt-6 text-balance">{project.name}</h1>
          <p className="type-body mt-4 text-[var(--ink-2)]">{project.client} · {project.year}</p>
          <p className="type-body mt-4 text-[17px]">{project.summary}</p>
          {project.liveUrl && project.status === 'live' ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border-[1.5px] border-[var(--brass)] px-6 py-3 font-sans text-sm font-bold text-[var(--brass)] transition-colors duration-200 hover:bg-[var(--brass)] hover:text-[var(--shell)]"
            >
              Vezi site-ul live ↗
            </a>
          ) : null}
        </header>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.cover || '/placeholder.svg'}
          alt={`Site-ul ${project.name}, realizat de MAST Studio`}
          width={1200}
          height={750}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="mx-auto mt-12 w-full max-w-4xl object-cover"
          style={{ borderRadius: 'var(--radius-panel)' }}
        />

        <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-12">
          <section>
            <h2 className="type-h3">Provocarea</h2>
            <p className="type-body mt-4 text-[var(--ink-2)]">{project.challenge}</p>
          </section>
          <section>
            <h2 className="type-h3">Soluția</h2>
            <p className="type-body mt-4 text-[var(--ink-2)]">{project.solution}</p>
          </section>
          {project.result ? (
            <section>
              <h2 className="type-h3">Rezultatul</h2>
              <p className="type-body mt-4 text-[var(--ink-2)]">{project.result}</p>
            </section>
          ) : null}
        </div>

        {project.stack.length > 0 ? (
          <div className="mx-auto mt-12 max-w-2xl">
            <h2 className="type-h3">Construit cu</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span key={item} className="kicker rounded-full border border-[var(--glass-edge)] px-3 py-1 text-[10px] text-[var(--ink-2)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {project.gallery?.length ? (
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
            {project.gallery.map((image) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={image}
                src={image}
                alt={project.name}
                width={800}
                height={600}
                loading="lazy"
                className="w-full object-cover"
                style={{ borderRadius: 'var(--radius-card)' }}
              />
            ))}
          </div>
        ) : null}

        {project.testimonial ? (
          <section className="porthole mx-auto mt-16 max-w-2xl p-8">
            <span aria-hidden="true" style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--brass)', lineHeight: 1 }}>
              &ldquo;
            </span>
            <p className="type-body mt-2 text-[17px]">{project.testimonial.quote}</p>
            <p className="kicker mt-6">{project.testimonial.author} · {project.testimonial.role}</p>
          </section>
        ) : null}

        <section className="porthole mx-auto mt-16 flex max-w-2xl flex-col items-start gap-5 p-8">
          <p className="type-h3">Vrei ca proiectul tău să fie următorul?</p>
          <SegmentProvider>
            <ContactButton hero label="Cere ofertă pe WhatsApp" />
          </SegmentProvider>
        </section>

        {related.length > 0 ? (
          <section className="mx-auto mt-20 max-w-5xl">
            <h2 className="type-h3">Alte proiecte</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {related.map((item) => <ProjectCard key={item.slug} project={item} />)}
            </div>
          </section>
        ) : null}
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(creativeWorkJsonLd) }} />
      <Footer />
    </main>
  )
}

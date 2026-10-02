import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import ProjectCard from '@/components/ProjectCard'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
import { getProjectStory } from '@/lib/project-stories'
import { getAllProjects, getProjectBySlug, type Project } from '@/lib/projects'
import { breadcrumbNode, businessRef, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { SITE_LANGUAGE, absoluteUrl } from '@/lib/site'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllProjects().map((project) => ({ slug: project.slug }))
}

function lowerFirst(value: string) {
  return value.charAt(0).toLowerCase() + value.slice(1)
}

function projectTitle(project: Project) {
  return `${project.name}: ${lowerFirst(project.categoryLabel)}`
}

function relatedProjects(project: Project) {
  const others = getAllProjects().filter((item) => item.slug !== project.slug)
  const sameCategory = others.filter((item) => item.category === project.category)
  const rest = others.filter((item) => item.category !== project.category && item.type === 'client')
  return [...sameCategory, ...rest].slice(0, 2)
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return {}
  return pageMetadata({
    title: projectTitle(project),
    description: project.metaDescription,
    path: `/portofoliu/${project.slug}`,
    socialTitle: `${project.name} — ${project.categoryLabel}`,
    image: { url: `/portofoliu/${project.slug}/og.png`, alt: `${project.name}, ${lowerFirst(project.categoryLabel)} realizat de MAST Studio` },
    // Design concepts are exercises, not client work: keep them out of the index.
    noindex: project.type === 'concept',
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) notFound()

  const path = `/portofoliu/${project.slug}`
  const url = absoluteUrl(path)
  const story = getProjectStory(project.slug)
  const related = relatedProjects(project)
  const crumbs: BreadcrumbItem[] = [
    { name: 'Acasă', path: '/' },
    { name: 'Portofoliu', path: '/portofoliu' },
    { name: project.name, path },
  ]
  const coverAlt =
    project.type === 'concept'
      ? `Captură din conceptul de design ${project.name}`
      : `Captură din site-ul ${project.name}, realizat de MAST Studio`

  const jsonLd = graph(
    webPageNode({ path, name: projectTitle(project), description: project.metaDescription, breadcrumb: true }),
    breadcrumbNode(crumbs),
    {
      '@type': 'CreativeWork',
      '@id': `${url}#proiect`,
      name: project.name,
      headline: projectTitle(project),
      description: project.summary,
      abstract: project.challenge,
      image: absoluteUrl(project.cover),
      dateCreated: String(project.year),
      inLanguage: SITE_LANGUAGE,
      genre: project.categoryLabel,
      keywords: project.stack.join(', '),
      creator: businessRef,
      mainEntityOfPage: { '@id': `${url}#webpage` },
      ...(project.liveUrl ? { url: project.liveUrl } : {}),
      ...(project.type === 'concept' ? {} : { about: { '@type': 'Organization', name: project.client } }),
    },
  )

  return (
    <>
      <SiteHeader current="portofoliu" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <article className="site-container py-12 md:py-20">
          <header className="mx-auto max-w-2xl">
            <Breadcrumbs items={crumbs} />
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="kicker rounded-full border border-[var(--glass-edge)] px-3 py-1 text-[10px]">{project.categoryLabel}</span>
              {project.status === 'in-lucru' ? (
                <span className="kicker rounded-full border border-[var(--hairline)] px-3 py-1 text-[10px] text-[var(--ink-2)]">În lucru</span>
              ) : null}
              {project.type === 'concept' ? (
                <span className="kicker rounded-full border border-[var(--hairline)] px-3 py-1 text-[10px] text-[var(--ink-2)]">Concept</span>
              ) : null}
            </div>
            <h1 className="type-h2 mt-6 text-balance">{project.name}</h1>
            <p className="type-body mt-4 text-[var(--ink-2)]">
              {project.client} · {project.year}
            </p>
            <p className="type-body mt-4 text-[17px]">{project.summary}</p>
            {project.type === 'concept' && project.conceptNote ? (
              <div
                className="type-body mt-4 text-[14px] text-[var(--ink-2)]"
                style={{
                  border: '1px solid var(--hairline)',
                  borderRadius: 'var(--radius-card)',
                  padding: '16px 20px',
                  background: 'var(--shell-warm)',
                }}
              >
                {project.conceptNote}
              </div>
            ) : null}
            {project.liveUrl && project.status === 'live' ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 gap-2 rounded-[var(--radius-pill)] border-[1.5px] border-[var(--brass)] px-6 py-3 font-sans text-sm font-bold text-[var(--brass-ink)] transition-colors duration-200 hover:bg-[var(--brass)] hover:text-[var(--ink)]"
              >
                {project.type === 'concept' ? 'Vezi conceptul live ↗' : `Vezi site-ul ${project.name} ↗`}
              </a>
            ) : null}
          </header>

          {project.cover ? (
            <Image
              src={project.cover}
              alt={coverAlt}
              width={1200}
              height={750}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 896px, 100vw"
              className="mx-auto mt-12 h-auto w-full max-w-4xl object-cover"
              style={{ borderRadius: 'var(--radius-panel)' }}
            />
          ) : null}

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

          {story ? (
            <div className="prose mx-auto mt-12 max-w-2xl">
              <MDXRemote source={story} />
            </div>
          ) : null}

          {project.stack.length > 0 ? (
            <div className="mx-auto mt-12 max-w-2xl">
              <h2 className="type-h3">Construit cu</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li key={item} className="kicker rounded-full border border-[var(--glass-edge)] px-3 py-1 text-[10px] text-[var(--ink-2)]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {project.gallery?.length ? (
            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
              {project.gallery.map((image, index) => (
                <Image
                  key={image}
                  src={image}
                  alt={`${project.name}, captură ${index + 2}`}
                  width={800}
                  height={600}
                  sizes="(min-width: 768px) 448px, 100vw"
                  className="h-auto w-full object-cover"
                  style={{ borderRadius: 'var(--radius-card)' }}
                />
              ))}
            </div>
          ) : null}

          {project.testimonial ? (
            <figure className="porthole mx-auto mt-16 max-w-2xl p-8">
              <span aria-hidden="true" style={{ fontFamily: 'var(--font-display)', fontSize: '48px', color: 'var(--brass)', lineHeight: 1 }}>
                &ldquo;
              </span>
              <blockquote className="type-body mt-2 text-[17px]">{project.testimonial.quote}</blockquote>
              <figcaption className="kicker mt-6">
                {project.testimonial.author} · {project.testimonial.role}
              </figcaption>
            </figure>
          ) : null}

          <section className="porthole mx-auto mt-16 flex max-w-2xl flex-col items-start gap-5 p-8">
            <h2 className="type-h3">Vrei ca proiectul tău să fie următorul?</h2>
            <SegmentProvider>
              <ContactButton hero label="Cere ofertă pe WhatsApp" />
            </SegmentProvider>
            <p className="font-sans text-sm text-[var(--ink-2)]">
              Vezi{' '}
              <Link href="/servicii" className="font-semibold text-[var(--ink)] underline underline-offset-4">
                serviciile și prețurile
              </Link>{' '}
              sau{' '}
              <Link href="/portofoliu" className="font-semibold text-[var(--ink)] underline underline-offset-4">
                tot portofoliul
              </Link>
              .
            </p>
          </section>

          {related.length > 0 ? (
            <section className="mx-auto mt-20 max-w-5xl">
              <h2 className="type-h3">Alte proiecte</h2>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                {related.map((item) => (
                  <ProjectCard key={item.slug} project={item} headingLevel="h3" />
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

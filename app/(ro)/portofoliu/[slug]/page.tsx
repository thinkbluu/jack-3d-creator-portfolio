import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import MdxContent from '@/components/MdxContent'
import ProjectCard from '@/components/ProjectCard'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
import type { Locale } from '@/lib/i18n/locale'
import { schemaLanguage } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { getProjectStory } from '@/lib/project-stories'
import { getAllProjects, getProjectBySlug, type Project } from '@/lib/projects'
import { breadcrumbNode, businessRef, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

type ProjectChrome = {
  challenge: string
  solution: string
  result: string
  builtWith: string
  seeConcept: string
  seeSite: (name: string) => string
  next: string
  see: string
  services: string
  or: string
  all: string
  related: string
  shot: (name: string, index: number) => string
  byStudio: string
}

const projectChrome: Record<Locale, ProjectChrome> = {
  ro: {
    challenge: 'Provocarea',
    solution: 'Soluția',
    result: 'Rezultatul',
    builtWith: 'Construit cu',
    seeConcept: 'Vezi conceptul live ↗',
    seeSite: (name) => `Vezi site-ul ${name} ↗`,
    next: 'Vrei ca proiectul tău să fie următorul?',
    see: 'Vezi',
    services: 'serviciile și prețurile',
    or: 'sau',
    all: 'tot portofoliul',
    related: 'Alte proiecte',
    shot: (name, index) => `${name}, captură ${index}`,
    byStudio: 'realizat de MAST Studio',
  },
  en: {
    challenge: 'The challenge',
    solution: 'The solution',
    result: 'The result',
    builtWith: 'Built with',
    seeConcept: 'See the live concept ↗',
    seeSite: (name) => `See the ${name} website ↗`,
    next: 'Want your project to be next?',
    see: 'See',
    services: 'the services and prices',
    or: 'or',
    all: 'all the work',
    related: 'Other projects',
    shot: (name, index) => `${name}, still ${index}`,
    byStudio: 'built by MAST Studio',
  },
}

export const dynamicParams = false

export function generateStaticParams() {
  return getAllProjects('ro').map((project) => ({ slug: project.slug }))
}

/** Lowercase the first word unless it keeps an internal capital, as in SaaS. */
function lowerFirst(value: string) {
  const [first, ...rest] = value.split(' ')
  if (first.slice(1) !== first.slice(1).toLowerCase()) return value
  return [first.charAt(0).toLowerCase() + first.slice(1), ...rest].join(' ')
}

function projectTitle(project: Project) {
  return `${project.name}: ${lowerFirst(project.categoryLabel)}`
}

function relatedProjects(project: Project, locale: Locale) {
  const others = getAllProjects(locale).filter((item) => item.slug !== project.slug)
  const sameCategory = others.filter((item) => item.category === project.category)
  const rest = others.filter((item) => item.category !== project.category && item.type === 'client')
  return [...sameCategory, ...rest].slice(0, 2)
}

export function projectMetadata(locale: Locale, slug: string): Metadata {
  const project = getProjectBySlug(slug, locale)
  if (!project) return {}
  const path = localizePath(`/portofoliu/${project.slug}`, locale)
  return pageMetadata({
    title: projectTitle(project),
    description: project.metaDescription,
    path,
    socialTitle: `${project.name} — ${project.categoryLabel}`,
    image: {
      url: localizePath(`/portofoliu/${project.slug}/og.png`, locale),
      alt: `${project.name}, ${lowerFirst(project.categoryLabel)} ${projectChrome[locale].byStudio}`,
    },
    // Design concepts are exercises, not client work: keep them out of the index.
    noindex: project.type === 'concept',
    locale,
  })
}

export async function ProjectView({ locale, slug }: { locale: Locale; slug: string }) {
  const project = getProjectBySlug(slug, locale)
  if (!project) notFound()

  const chrome = projectChrome[locale]
  const projectsUi = ui[locale].projects
  const path = localizePath(`/portofoliu/${project.slug}`, locale)
  const url = absoluteUrl(path)
  const story = getProjectStory(project.slug, locale)
  const originalStory = locale === 'en' && !story ? getProjectStory(project.slug, 'ro') : null
  const related = relatedProjects(project, locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.portfolio, path: localizePath('/portofoliu', locale) },
    { name: project.name, path },
  ]
  const coverAlt =
    project.type === 'concept'
      ? `${projectsUi.altConcept} ${project.name}`
      : `${projectsUi.altClient} ${project.name}${projectsUi.altClientBy}`

  const jsonLd = graph(
    webPageNode({ path, name: projectTitle(project), description: project.metaDescription, breadcrumb: true, locale }),
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
      inLanguage: schemaLanguage(locale),
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
                <span className="kicker rounded-full border border-[var(--hairline)] px-3 py-1 text-[10px] text-[var(--ink-2)]">{projectsUi.inProgress}</span>
              ) : null}
              {project.type === 'concept' ? (
                <span className="kicker rounded-full border border-[var(--hairline)] px-3 py-1 text-[10px] text-[var(--ink-2)]">{projectsUi.concept}</span>
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
                {project.type === 'concept' ? chrome.seeConcept : chrome.seeSite(project.name)}
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
              <h2 className="type-h3">{chrome.challenge}</h2>
              <p className="type-body mt-4 text-[var(--ink-2)]">{project.challenge}</p>
            </section>
            <section>
              <h2 className="type-h3">{chrome.solution}</h2>
              <p className="type-body mt-4 text-[var(--ink-2)]">{project.solution}</p>
            </section>
            {project.result ? (
              <section>
                <h2 className="type-h3">{chrome.result}</h2>
                <p className="type-body mt-4 text-[var(--ink-2)]">{project.result}</p>
              </section>
            ) : null}
          </div>

          {story ? (
            <div className="prose mx-auto mt-12 max-w-2xl">
              <MdxContent source={story} />
            </div>
          ) : originalStory ? (
            <div className="mx-auto mt-12 max-w-2xl">
              <p className="type-body text-[var(--ink-2)]">
                The long-form case study is published in Romanian. You can read the essay in the original.{' '}
                <Link
                  href={`/portofoliu/${project.slug}`}
                  className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4"
                >
                  Read the case study in Romanian →
                </Link>
              </p>
            </div>
          ) : null}

          {project.stack.length > 0 ? (
            <div className="mx-auto mt-12 max-w-2xl">
              <h2 className="type-h3">{chrome.builtWith}</h2>
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
                  alt={chrome.shot(project.name, index + 2)}
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
            <h2 className="type-h3">{chrome.next}</h2>
            <SegmentProvider>
              <ContactButton hero label={ui[locale].whatsapp.defaultCta} />
            </SegmentProvider>
            <p className="font-sans text-sm text-[var(--ink-2)]">
              {chrome.see}{' '}
              <Link href={localizePath('/servicii', locale)} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                {chrome.services}
              </Link>{' '}
              {chrome.or}{' '}
              <Link href={localizePath('/portofoliu', locale)} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                {chrome.all}
              </Link>
              .
            </p>
          </section>

          {related.length > 0 ? (
            <section className="mx-auto mt-20 max-w-5xl">
              <h2 className="type-h3">{chrome.related}</h2>
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

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  return projectMetadata('ro', slug)
}

export default async function Page({ params }: ProjectPageProps) {
  const { slug } = await params
  return <ProjectView locale="ro" slug={slug} />
}

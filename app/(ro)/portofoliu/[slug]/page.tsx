import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import MdxContent from '@/components/MdxContent'
import SiteHeader from '@/components/SiteHeader'
import CtaBand from '@/components/studio/CtaBand'
import ParallaxCover from '@/components/studio/ParallaxCover'
import { Reveal, SplitHeading } from '@/components/studio/Reveal'
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
  nextProject: string
  facts: { client: string; year: string; type: string }
  cursor: string
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
    nextProject: 'Proiectul următor',
    facts: { client: 'Client', year: 'An', type: 'Tip' },
    cursor: 'Următorul',
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
    nextProject: 'Next project',
    facts: { client: 'Client', year: 'Year', type: 'Type' },
    cursor: 'Next',
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

/** The next project of the same kind (client work or concept), wrapping around. */
function nextProject(project: Project, locale: Locale) {
  const same = getAllProjects(locale).filter((item) => item.type === project.type)
  const index = same.findIndex((item) => item.slug === project.slug)
  const next = same[(index + 1) % same.length]
  return next && next.slug !== project.slug ? next : undefined
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
  const next = nextProject(project, locale)
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

  const sections = [
    { label: chrome.challenge, text: project.challenge },
    { label: chrome.solution, text: project.solution },
    ...(project.result ? [{ label: chrome.result, text: project.result, highlight: true }] : []),
  ]
  const tags = [
    project.categoryLabel,
    String(project.year),
    ...(project.status === 'in-lucru' ? [projectsUi.inProgress] : []),
    ...(project.type === 'concept' ? [projectsUi.concept] : []),
  ]

  return (
    <>
      <SiteHeader current="portofoliu" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <article>
          <header className="tone-dark grain relative overflow-hidden pt-36 md:pt-44">
            <div className="studio-container relative">
              <Breadcrumbs items={crumbs} />
              <p className="mono-label mt-10 flex flex-wrap gap-x-3 text-[var(--fg-3)]">
                {tags.map((tag, index) => (
                  <span key={tag} className={index === 0 ? 'text-[var(--accent)]' : ''}>
                    {index > 0 ? <span aria-hidden="true">· </span> : null}
                    {tag}
                  </span>
                ))}
              </p>
              <SplitHeading as="h1" text={project.name} className="display-xl mt-6 text-balance text-[clamp(3.2rem,10vw,10rem)]" />
              <div className="mt-12 grid gap-10 pb-16 md:grid-cols-[1.4fr_1fr] md:items-start md:pb-20">
                <Reveal delay={0.2}>
                  <p className="max-w-2xl text-xl leading-relaxed text-[var(--fg-2)] md:text-2xl">{project.summary}</p>
                  {project.type === 'concept' && project.conceptNote ? (
                    <p className="mt-6 max-w-xl border-l border-[var(--line)] pl-5 text-[var(--fg-3)]">{project.conceptNote}</p>
                  ) : null}
                </Reveal>
                <Reveal delay={0.3}>
                  <dl className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--line)] pt-6">
                    <div>
                      <dt className="mono-label text-[var(--fg-3)]">{chrome.facts.client}</dt>
                      <dd className="mt-2">{project.client}</dd>
                    </div>
                    <div>
                      <dt className="mono-label text-[var(--fg-3)]">{chrome.facts.year}</dt>
                      <dd className="mt-2">{project.year}</dd>
                    </div>
                    {project.stack.length > 0 ? (
                      <div className="col-span-2">
                        <dt className="mono-label text-[var(--fg-3)]">{chrome.builtWith}</dt>
                        <dd className="mt-2">{project.stack.join(' · ')}</dd>
                      </div>
                    ) : null}
                  </dl>
                  {project.liveUrl && project.status === 'live' ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-magnetic
                      className="mono-label mt-8 items-center rounded-[var(--radius-pill)] bg-[var(--brass-lite)] px-6 text-[var(--night)] transition-colors hover:bg-[var(--on-dark)]"
                    >
                      {project.type === 'concept' ? chrome.seeConcept : chrome.seeSite(project.name)}
                    </a>
                  ) : null}
                </Reveal>
              </div>
            </div>
            {project.cover ? (
              <div className="relative px-[clamp(0.75rem,2vw,1.5rem)] pb-[clamp(0.75rem,2vw,1.5rem)]">
                <ParallaxCover src={project.cover} alt={coverAlt} priority />
              </div>
            ) : null}
          </header>

          <div className="studio-container py-24 md:py-36">
            {sections.map((section, index) => (
              <section key={section.label} className="grid gap-6 border-t border-[var(--hairline)] py-14 md:grid-cols-[1fr_2fr] md:gap-16 md:py-20">
                <h2 className="mono-label flex gap-3 text-[var(--ink-3)] md:sticky md:top-28 md:self-start">
                  <span className="text-[var(--brass-ink)]">{String(index + 1).padStart(2, '0')}</span>
                  {section.label}
                </h2>
                <Reveal>
                  <p
                    className={
                      'highlight' in section && section.highlight
                        ? 'display-xl text-balance text-[clamp(2rem,3.6vw,3.4rem)] leading-[1.05] text-[var(--ink)]'
                        : 'max-w-3xl text-xl leading-relaxed text-[var(--ink-2)] md:text-2xl md:leading-relaxed'
                    }
                  >
                    {section.text}
                  </p>
                </Reveal>
              </section>
            ))}

            {story ? (
              <div className="prose mx-auto mt-16 max-w-3xl border-t border-[var(--hairline)] pt-20">
                <MdxContent source={story} />
              </div>
            ) : originalStory ? (
              <p className="mx-auto mt-16 max-w-3xl border-t border-[var(--hairline)] pt-12 text-[var(--ink-2)]">
                The long-form case study is published in Romanian. You can read the essay in the original.{' '}
                <Link href={`/portofoliu/${project.slug}`} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                  Read the case study in Romanian →
                </Link>
              </p>
            ) : null}

            {project.gallery?.length ? (
              <div className="mt-24 grid grid-cols-1 gap-6 md:grid-cols-2">
                {project.gallery.map((image, index) => (
                  <Reveal key={image} delay={(index % 2) * 0.1} className={index % 3 === 0 ? 'md:col-span-2' : ''}>
                    <Image
                      src={image}
                      alt={chrome.shot(project.name, index + 2)}
                      width={1600}
                      height={1000}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="h-auto w-full rounded-[6px] object-cover"
                    />
                  </Reveal>
                ))}
              </div>
            ) : null}
          </div>

          {project.testimonial ? (
            <figure className="tone-navy grain relative overflow-hidden py-28 md:py-40">
              <div className="studio-container relative">
                <span aria-hidden="true" className="display-italic block text-[8rem] leading-[0.6] text-[var(--brass-lite)]">
                  &ldquo;
                </span>
                <blockquote className="display-xl mt-6 max-w-5xl text-balance text-[clamp(2rem,4.4vw,4.2rem)] leading-[1.05]">
                  {project.testimonial.quote}
                </blockquote>
                <figcaption className="mono-label mt-10 text-[var(--fg-3)]">
                  {project.testimonial.author} · {project.testimonial.role}
                </figcaption>
              </div>
            </figure>
          ) : null}
        </article>

        {next ? (
          <Link
            href={localizePath(`/portofoliu/${next.slug}`, locale)}
            data-cursor={chrome.cursor}
            className="link-block tone-dark group relative block overflow-hidden"
          >
            <span className="studio-container relative z-10 flex min-h-[70svh] flex-col justify-between py-16 md:py-20">
              <span className="mono-label text-[var(--fg-3)]">{chrome.nextProject} →</span>
              <span>
                <span className="mono-label block text-[var(--accent)]">
                  {next.categoryLabel} · {next.year}
                </span>
                <span className="display-xl mt-4 block text-[clamp(3rem,10vw,10rem)] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:translate-x-4">
                  {next.name}
                </span>
              </span>
            </span>
            {next.cover ? (
              <Image
                src={next.cover}
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-top opacity-25 transition-[opacity,transform] duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03] group-hover:opacity-45"
              />
            ) : null}
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[var(--night)] via-[rgba(11,15,22,0.6)] to-[rgba(11,15,22,0.3)]" />
          </Link>
        ) : null}

        <CtaBand title={chrome.next} placement="case_study_cta">
          <p className="text-[var(--fg-2)] lg:text-right">
            {chrome.see}{' '}
            <Link href={localizePath('/servicii', locale)} className="inline min-h-0 text-[var(--fg)] underline underline-offset-4">
              {chrome.services}
            </Link>{' '}
            {chrome.or}{' '}
            <Link href={localizePath('/portofoliu', locale)} className="inline min-h-0 text-[var(--fg)] underline underline-offset-4">
              {chrome.all}
            </Link>
            .
          </p>
        </CtaBand>
      </main>
      <Footer cta={false} />
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

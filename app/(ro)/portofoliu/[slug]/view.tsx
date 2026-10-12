import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import MdxContent from '@/components/MdxContent'
import SiteHeader from '@/components/SiteHeader'
import PageOpen from '@/components/studio/PageOpen'
import ParallaxCover from '@/components/studio/ParallaxCover'
import { Reveal } from '@/components/studio/Reveal'
import type { Locale } from '@/lib/i18n/locale'
import { schemaLanguage } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { getProjectDesign } from '@/lib/project-design'
import { getProjectStory } from '@/lib/project-stories'
import { getAllProjects, getProjectBySlug, type Project } from '@/lib/projects'
import { breadcrumbNode, businessRef, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { absoluteUrl } from '@/lib/site'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

type ProjectChrome = {
  brief: string
  choicesLabel: string
  choices: string
  palette: string
  type: string
  story: string
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
    brief: 'Brief',
    choicesLabel: 'Alegeri de design',
    choices: 'Cum am gândit-o.',
    palette: 'Paleta',
    type: 'Litere',
    story: 'Povestea completă',
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
    brief: 'Brief',
    choicesLabel: 'Design choices',
    choices: 'How we thought it through.',
    palette: 'Palette',
    type: 'Type',
    story: 'The full story',
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
  const coverAlt = project.coverAlt

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

  const design = getProjectDesign(project.slug, locale)
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
          <PageOpen
            crumbs={crumbs}
            title={projectTitle(project)}
            word={`${project.name}.`}
            lead={
              <>
                <p>{project.summary}</p>
                {project.type === 'concept' && project.conceptNote ? (
                  <p className="mt-5 max-w-md border-l border-[var(--line)] pl-4 text-base font-normal leading-relaxed text-[var(--fg-3)]">
                    {project.conceptNote}
                  </p>
                ) : null}
              </>
            }
            short
          >
            <dl className="case-facts">
              <div>
                <dt>{chrome.facts.client}</dt>
                <dd>{project.client}</dd>
              </div>
              <div>
                <dt>{chrome.facts.year}</dt>
                <dd>{tags.slice(1).join(' · ')}</dd>
              </div>
              <div>
                <dt>{chrome.facts.type}</dt>
                <dd>{project.categoryLabel}</dd>
              </div>
            </dl>
          </PageOpen>

          {project.cover ? (
            <div className="tone-dark px-[clamp(0.75rem,2vw,1.5rem)] pb-[clamp(0.75rem,2vw,1.5rem)]">
              <ParallaxCover src={project.cover} alt={coverAlt} priority />
            </div>
          ) : null}

          <section className="studio-container page-section grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16">
            <h2 className="mono-label flex gap-3 text-[var(--ink-3)] md:sticky md:top-28 md:self-start">
              <span className="text-[var(--brass-ink)]">01</span>
              {chrome.brief}
            </h2>
            <Reveal>
              <p className="display-xl text-balance text-[clamp(1.8rem,3.4vw,3.2rem)] leading-[1.08]">{project.challenge}</p>
            </Reveal>
          </section>

          <section aria-labelledby="alegeri" className="tone-dark page-section">
            <div className="studio-container">
              <p className="mono-label flex gap-3 text-[var(--fg-3)]">
                <span className="text-[var(--accent)]">02</span>
                {chrome.choicesLabel}
              </p>
              <h2 id="alegeri" className="section-title display-xl mt-6 max-w-[12ch]">
                {chrome.choices}
              </h2>
              {design ? (
                <ol className="case-notes">
                  {design.notes.map((note, index) => (
                    <li key={note.label} className="case-note">
                      <span className="mono-label text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
                      <h3 className="case-note-label display-xl">{note.label}</h3>
                      <p className="case-note-text">{note.text}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-12 max-w-3xl text-xl leading-relaxed text-[var(--fg-2)]">{project.solution}</p>
              )}
              {design?.palette?.length || design?.type || project.stack.length ? (
                <dl className="case-kit">
                  {design?.palette?.length ? (
                    <div>
                      <dt className="mono-label">{chrome.palette}</dt>
                      <dd className="mt-4 flex flex-wrap gap-3">
                        {design.palette.map((swatch) => (
                          <span key={swatch.hex} className="case-swatch">
                            <span className="case-swatch-chip" style={{ background: swatch.hex }} />
                            <span className="mono-label">{swatch.name}</span>
                          </span>
                        ))}
                      </dd>
                    </div>
                  ) : null}
                  {design?.type ? (
                    <div>
                      <dt className="mono-label">{chrome.type}</dt>
                      <dd className="mt-4 text-lg">{design.type}</dd>
                    </div>
                  ) : null}
                  {project.stack.length ? (
                    <div>
                      <dt className="mono-label">{chrome.builtWith}</dt>
                      <dd className="mt-4 text-lg">{project.stack.join(' · ')}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
            </div>
          </section>

          {project.gallery?.length ? (
            <div className="studio-container page-section grid grid-cols-1 gap-6 md:grid-cols-2">
              {project.gallery.map((image, index) => (
                <Reveal key={image} delay={(index % 2) * 0.1} className={index % 3 === 0 ? 'md:col-span-2' : ''}>
                  <Image
                    src={image}
                    alt={chrome.shot(project.name, index + 2)}
                    width={1600}
                    height={1000}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="h-auto w-full rounded-[10px] object-cover"
                  />
                </Reveal>
              ))}
            </div>
          ) : null}

          {story || originalStory ? (
            <section className="studio-container page-section border-t border-[var(--hairline)]">
              <p className="mono-label flex gap-3 text-[var(--ink-3)]">
                <span className="text-[var(--brass-ink)]">03</span>
                {chrome.story}
              </p>
              {story ? (
                <div className="prose mx-auto mt-12 max-w-3xl">
                  <MdxContent source={story} />
                </div>
              ) : (
                <p className="mx-auto mt-12 max-w-3xl text-[var(--ink-2)]">
                  The long-form case study is published in Romanian.{' '}
                  <Link href={`/portofoliu/${project.slug}`} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                    Read the case study in Romanian →
                  </Link>
                </p>
              )}
            </section>
          ) : null}

          {project.liveUrl && project.status === 'live' ? (
            <div className="studio-container pb-[clamp(4rem,8vw,7rem)]">
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="big-row">
                <span className="mono-label text-[var(--ink-3)]">↗</span>
                <span className="big-row-name">{project.type === 'concept' ? chrome.seeConcept : chrome.seeSite(project.name)}</span>
                <span aria-hidden="true" className="big-row-arrow">→</span>
              </a>
            </div>
          ) : null}

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
                className="object-cover object-[right_center] opacity-25 transition-[opacity,transform] duration-[1.2s] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.03] group-hover:opacity-45"
              />
            ) : null}
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[var(--night)] via-[rgba(11,15,22,0.6)] to-[rgba(11,15,22,0.3)]" />
          </Link>
        ) : null}

      </main>
      <Footer />
      <JsonLd data={jsonLd} />
    </>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import CareerForm from '@/components/CareerForm'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { CV_RETENTION_MONTHS, JOB_OPENINGS, careerContract, careerLocation, careerSchedule, getJobOpening, salaryLabel, type JobOpening } from '@/lib/careers'
import { localizePath } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/locale'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { LOGO_URL, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

const jobCopy = {
  ro: {
    open: 'Post deschis',
    salary: 'Salariu',
    salaryDetail: '{salary}, la contract de muncă. La colaborare, suma echivalentă o stabilim direct.',
    hours: 'Program',
    contract: 'Contract',
    where: 'Unde',
    willDo: 'Ce vei face',
    looking: 'Ce căutăm',
    plus: 'Un plus',
    howTitle: 'Cum lucrăm',
    how: 'Suntem o echipă mică din Timișoara și lucrăm la distanță, cu afaceri mici din toată România. Avem un proces fix, de la prima discuție la lansare, și lucrezi direct cu oamenii care iau deciziile, fără niveluri de management între voi.',
    apply: 'Aplică pentru acest post',
    applyNote: `Completează formularul și atașează CV-ul. Îl păstrăm cel mult ${CV_RETENTION_MONTHS} luni și îl folosim doar pentru recrutare.`,
    also: 'Vezi și',
    alsoLink: 'celelalte posturi și roluri de la MAST Studio',
    schemaWillDo: 'Ce vei face:',
    schemaLooking: 'Ce căutăm:',
    schemaSalary: '{schedule}. {contract}. Salariu: {salary} la contract de muncă; la colaborare, suma echivalentă se stabilește direct.',
    country: 'România',
  },
  en: {
    open: 'Open role',
    salary: 'Salary',
    salaryDetail: '{salary}, on an employment contract. For a collaboration, we agree the equivalent amount directly.',
    hours: 'Hours',
    contract: 'Contract',
    where: 'Where',
    willDo: 'What you’ll do',
    looking: 'What we’re looking for',
    plus: 'A plus',
    howTitle: 'How we work',
    how: 'We’re a small team in Timișoara and we work remotely, with small businesses across Romania. We have a fixed process, from the first conversation to launch, and you work directly with the people who make the decisions, with no management layers between you.',
    apply: 'Apply for this role',
    applyNote: `Fill in the form and attach your CV. We keep it for at most ${CV_RETENTION_MONTHS} months and use it only for recruitment.`,
    also: 'See also',
    alsoLink: 'the other open roles at MAST Studio',
    schemaWillDo: 'What you’ll do:',
    schemaLooking: 'What we’re looking for:',
    schemaSalary: '{schedule}. {contract}. Salary: {salary} on an employment contract; for a collaboration, the equivalent amount is agreed directly.',
    country: 'Romania',
  },
}

function fill(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce((text, [key, value]) => text.split(`{${key}}`).join(value), template)
}

export const dynamicParams = false

export function generateStaticParams() {
  return JOB_OPENINGS.map((job) => ({ slug: job.id }))
}

export function jobMetadata(locale: Locale, slug: string) {
  const job = getJobOpening(slug, locale)
  if (!job) return {}
  return pageMetadata({
    title: job.seoTitle,
    description: job.description,
    path: localizePath(`/cariere/${job.id}`, locale),
    locale,
  })
}

export async function generateMetadata({ params }: Props) {
  return jobMetadata('ro', (await params).slug)
}

// Google job posting data. Salaries are published net, as the page shows them.
function jobPostingNode(job: JobOpening, path: string, locale: Locale) {
  const copy = jobCopy[locale]
  const list = (items: string[]) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`
  const salary = salaryLabel(job, locale)
  return {
    '@type': 'JobPosting',
    '@id': `${absoluteUrl(path)}#job`,
    title: job.title,
    description: `<p>${job.summary}</p><p>${copy.schemaWillDo}</p>${list(job.responsibilities)}<p>${copy.schemaLooking}</p>${list(job.requirements)}<p>${fill(copy.schemaSalary, { schedule: careerSchedule(locale), contract: careerContract(locale), salary })}</p>`,
    datePosted: job.datePosted,
    employmentType: ['FULL_TIME', 'CONTRACTOR'],
    hiringOrganization: { '@type': 'Organization', name: SITE_NAME, sameAs: SITE_URL, logo: LOGO_URL },
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: { '@type': 'Country', name: copy.country },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'RON',
      value: { '@type': 'QuantitativeValue', minValue: job.salaryMin, maxValue: job.salaryMax, unitText: 'MONTH' },
    },
    directApply: true,
    url: absoluteUrl(path),
  }
}

export function JobView({ locale, slug }: { locale: Locale; slug: string }) {
  const job = getJobOpening(slug, locale)
  if (!job) notFound()

  const copy = jobCopy[locale]
  const path = localizePath(`/cariere/${job.id}`, locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.careers, path: localizePath('/cariere', locale) },
    { name: job.title, path },
  ]
  const salary = salaryLabel(job, locale)
  const facts = [
    [copy.salary, fill(copy.salaryDetail, { salary })],
    [copy.hours, careerSchedule(locale)],
    [copy.contract, careerContract(locale)],
    [copy.where, careerLocation(locale)],
  ]
  const canonicalTitle = JOB_OPENINGS.find((item) => item.id === job.id)?.title ?? job.title

  return (
    <>
      <SiteHeader current="cariere" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container py-12 md:py-20">
          <Breadcrumbs items={crumbs} />

          <header className="mt-6 max-w-3xl">
            <p className="kicker">{copy.open} · {careerLocation(locale)}</p>
            <h1 className="type-h2 mt-4 text-balance">{job.title}</h1>
            <p className="type-body mt-6 max-w-2xl">{job.summary}</p>
          </header>

          <dl className="porthole mt-10 grid max-w-3xl gap-5 p-7 sm:grid-cols-2 md:p-9">
            {facts.map(([term, detail]) => (
              <div key={term}>
                <dt className="kicker">{term}</dt>
                <dd className="type-body mt-1 text-[15px] text-[var(--ink)]">{detail}</dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="ce-vei-face" className="mt-14 grid max-w-3xl gap-10 md:grid-cols-2">
            <div>
              <h2 id="ce-vei-face" className="type-h3">
                {copy.willDo}
              </h2>
              <ul className="type-body mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px]">
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="type-h3">{copy.looking}</h2>
              <ul className="type-body mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px]">
                {job.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-12 max-w-3xl border-t border-[var(--hairline)] pt-10">
            <h2 className="type-h3">{copy.plus}</h2>
            <p className="type-body mt-4">{job.niceToHave.join(', ')}.</p>
            <h2 className="type-h3 mt-10">{copy.howTitle}</h2>
            <p className="type-body mt-4">{copy.how}</p>
          </section>

          <section aria-labelledby="aplica" className="mt-14 max-w-3xl">
            <h2 id="aplica" className="type-h3">
              {copy.apply}
            </h2>
            <p className="type-body mt-4">{copy.applyNote}</p>
            <div className="mt-6">
              <CareerForm defaultArea={canonicalTitle} />
            </div>
            <p className="type-body mt-8">
              {copy.also}{' '}
              <Link href={localizePath('/cariere', locale)} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                {copy.alsoLink}
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd data={graph(webPageNode({ path, name: job.seoTitle, description: job.description, breadcrumb: true, locale }), breadcrumbNode(crumbs), jobPostingNode(job, path, locale))} />
    </>
  )
}

export default async function JobPage({ params }: Props) {
  return <JobView locale="ro" slug={(await params).slug} />
}

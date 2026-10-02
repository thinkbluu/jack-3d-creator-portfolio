import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import CareerForm from '@/components/CareerForm'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { CV_RETENTION_MONTHS, JOB_CONTRACT, JOB_LOCATION, JOB_OPENINGS, JOB_SCHEDULE, getJobOpening, salaryLabel, type JobOpening } from '@/lib/careers'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { LOGO_URL, SITE_NAME, SITE_URL, absoluteUrl } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return JOB_OPENINGS.map((job) => ({ slug: job.id }))
}

export async function generateMetadata({ params }: Props) {
  const job = getJobOpening((await params).slug)
  if (!job) return {}
  return pageMetadata({ title: job.seoTitle, description: job.description, path: `/cariere/${job.id}` })
}

// Google job posting data. Salaries are published net, as the page shows them.
function jobPostingNode(job: JobOpening, path: string) {
  const list = (items: string[]) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`
  return {
    '@type': 'JobPosting',
    '@id': `${absoluteUrl(path)}#job`,
    title: job.title,
    description: `<p>${job.summary}</p><p>Ce vei face:</p>${list(job.responsibilities)}<p>Ce căutăm:</p>${list(job.requirements)}<p>${JOB_SCHEDULE}. ${JOB_CONTRACT}. Salariu: ${salaryLabel(job)} la contract de muncă; la colaborare, suma echivalentă se stabilește direct.</p>`,
    datePosted: job.datePosted,
    employmentType: ['FULL_TIME', 'CONTRACTOR'],
    hiringOrganization: { '@type': 'Organization', name: SITE_NAME, sameAs: SITE_URL, logo: LOGO_URL },
    jobLocationType: 'TELECOMMUTE',
    applicantLocationRequirements: { '@type': 'Country', name: 'România' },
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'RON',
      value: { '@type': 'QuantitativeValue', minValue: job.salaryMin, maxValue: job.salaryMax, unitText: 'MONTH' },
    },
    directApply: true,
    url: absoluteUrl(path),
  }
}

export default async function JobPage({ params }: Props) {
  const job = getJobOpening((await params).slug)
  if (!job) notFound()

  const path = `/cariere/${job.id}`
  const crumbs: BreadcrumbItem[] = [
    { name: 'Acasă', path: '/' },
    { name: 'Cariere', path: '/cariere' },
    { name: job.title, path },
  ]
  const facts = [
    ['Salariu', `${salaryLabel(job)}, la contract de muncă. La colaborare, suma echivalentă o stabilim direct.`],
    ['Program', JOB_SCHEDULE],
    ['Contract', JOB_CONTRACT],
    ['Unde', JOB_LOCATION],
  ]

  return (
    <>
      <SiteHeader current="cariere" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container py-12 md:py-20">
          <Breadcrumbs items={crumbs} />

          <header className="mt-6 max-w-3xl">
            <p className="kicker">Post deschis · {JOB_LOCATION}</p>
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
                Ce vei face
              </h2>
              <ul className="type-body mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px]">
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="type-h3">Ce căutăm</h2>
              <ul className="type-body mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px]">
                {job.requirements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="mt-12 max-w-3xl border-t border-[var(--hairline)] pt-10">
            <h2 className="type-h3">Un plus</h2>
            <p className="type-body mt-4">{job.niceToHave.join(', ')}.</p>
            <h2 className="type-h3 mt-10">Cum lucrăm</h2>
            <p className="type-body mt-4">
              Suntem o echipă mică din Timișoara și lucrăm la distanță, cu afaceri mici din toată România. Avem un proces fix, de la prima discuție la lansare, și lucrezi direct cu oamenii care iau deciziile, fără niveluri de management între voi.
            </p>
          </section>

          <section aria-labelledby="aplica" className="mt-14 max-w-3xl">
            <h2 id="aplica" className="type-h3">
              Aplică pentru acest post
            </h2>
            <p className="type-body mt-4">
              Completează formularul și atașează CV-ul. Îl păstrăm cel mult {CV_RETENTION_MONTHS} luni și îl folosim doar pentru recrutare.
            </p>
            <div className="mt-6">
              <CareerForm defaultArea={job.title} />
            </div>
            <p className="type-body mt-8">
              Vezi și{' '}
              <Link href="/cariere" className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                celelalte posturi și roluri de la MAST Studio
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd data={graph(webPageNode({ path, name: job.seoTitle, description: job.description, breadcrumb: true }), breadcrumbNode(crumbs), jobPostingNode(job, path))} />
    </>
  )
}

import Link from 'next/link'
import CareerForm from '@/components/CareerForm'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import PageHero from '@/components/studio/PageHero'
import { CV_RETENTION_MONTHS, careerLocation, careerSchedule, getJobOpenings, salaryLabel } from '@/lib/careers'
import { localizePath } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/locale'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { EMAIL, EMAIL_HREF } from '@/lib/site'

const careers = {
  ro: {
    title: 'Cariere MAST Studio: front-end și mobile developer',
    description:
      'MAST Studio angajează un front-end developer (React, Next.js) și un mobile app developer (React Native). Lucru la distanță, din România. Trimite CV-ul aici.',
    name: 'Cariere la MAST Studio',
    kicker: 'Cariere',
    intro:
      'Căutăm un front-end developer și un mobile app developer. Lucrăm la distanță, cu afaceri mici din toată România. Dacă vrei să lucrezi cu noi pe alt rol, trimite-ne oricum CV-ul: când apare un post potrivit, te contactăm noi.',
    openTitle: 'Posturi deschise',
    details: 'Detalii și aplicare: {title} →',
    otherTitle: 'Alte roluri pentru care ne poți scrie',
    roles: [
      { title: 'Web design', text: 'Interfețe clare pentru afaceri mici, gândite întâi pentru telefon.' },
      { title: 'Texte și conținut', text: 'Texte pentru site-uri și ghiduri în limba română, simple și precise.' },
      { title: 'Marketing și vânzări', text: 'Discuții cu clienții, oferte și campanii pentru afaceri mici.' },
    ],
    howTitle: 'Cum lucrăm',
    how: 'Suntem o echipă mică din Timișoara și lucrăm la distanță, cu afaceri mici din toată România. Avem un proces fix, de la prima discuție la lansare, și construim site-uri de prezentare, magazine online și aplicații. Lucrăm în limba română, cu clienți care vor rezultate clare, nu jargon.',
    cvTitle: 'Ce se întâmplă cu CV-ul tău',
    cv: [
      'Primești pe e-mail confirmarea că l-am primit.',
      `Îl păstrăm cel mult ${CV_RETENTION_MONTHS} luni și îl folosim doar pentru recrutare.`,
      'Te contactăm dacă profilul tău se potrivește unui post deschis sau unui rol de mai târziu.',
    ],
    deleteBefore: 'Poți cere oricând ștergerea, scriindu-ne la',
    formTitle: 'Trimite-ne CV-ul',
  },
  en: {
    title: 'Careers at MAST Studio: front-end and mobile developer',
    description:
      'MAST Studio is hiring a front-end developer (React, Next.js) and a mobile app developer (React Native). Remote work, from Romania. Send your CV here.',
    name: 'Careers at MAST Studio',
    kicker: 'Careers',
    intro:
      'We’re hiring a front-end developer and a mobile app developer. We work remotely, with small businesses across Romania. If you want to work with us in another role, send your CV anyway: when a fitting role opens, we’ll contact you.',
    openTitle: 'Open roles',
    details: 'Details and how to apply: {title} →',
    otherTitle: 'Other roles you can write to us about',
    roles: [
      { title: 'Web design', text: 'Clear interfaces for small businesses, thought of for the phone first.' },
      { title: 'Copy and content', text: 'Copy for websites and guides in Romanian, plain and precise.' },
      { title: 'Marketing and sales', text: 'Conversations with clients, quotes and campaigns for small businesses.' },
    ],
    howTitle: 'How we work',
    how: 'We’re a small team in Timișoara and we work remotely, with small businesses across Romania. We have a fixed process, from the first conversation to launch, and we build presentation websites, online stores and apps. We work in Romanian, with clients who want clear results, not jargon.',
    cvTitle: 'What happens to your CV',
    cv: [
      'You get an email confirming we’ve received it.',
      `We keep it for at most ${CV_RETENTION_MONTHS} months and use it only for recruitment.`,
      'We contact you if your profile fits an open role or a later one.',
    ],
    deleteBefore: 'You can ask us to delete it at any time, by writing to',
    formTitle: 'Send us your CV',
  },
}

export function careersMetadata(locale: Locale = 'ro') {
  const copy = careers[locale]
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: localizePath('/cariere', locale),
    absoluteTitle: true,
    locale,
  })
}

export function CareersView({ locale }: { locale: Locale }) {
  const copy = careers[locale]
  const path = localizePath('/cariere', locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.careers, path },
  ]
  const jobs = getJobOpenings(locale)

  return (
    <>
      <SiteHeader current="cariere" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageHero crumbs={crumbs} kicker={copy.kicker} title={copy.name} intro={copy.intro} />
        <div className="site-container py-20 md:py-28">
          <section aria-labelledby="posturi-deschise" className="max-w-4xl">
            <h2 id="posturi-deschise" className="type-h3">
              {copy.openTitle}
            </h2>
            <div className="mt-6 flex flex-col gap-6">
              {jobs.map((job) => (
                <article key={job.id} aria-labelledby={`${job.id}-titlu`} className="porthole p-7 md:p-9">
                  <p className="kicker">
                    {careerLocation(locale)} · {careerSchedule(locale).toLowerCase()}
                  </p>
                  <h3 id={`${job.id}-titlu`} className="type-h3 mt-3">
                    <Link href={localizePath(`/cariere/${job.id}`, locale)} className="hover:text-[var(--brass-ink)]">
                      {job.title}
                    </Link>
                  </h3>
                  <p className="type-body mt-4">{job.summary}</p>
                  <p className="mt-4 font-sans text-sm font-bold text-[var(--brass-ink)]">{salaryLabel(job, locale)}</p>
                  <Link href={localizePath(`/cariere/${job.id}`, locale)} className="mt-5 w-fit font-sans text-sm font-semibold text-[var(--ink)] underline underline-offset-4 hover:text-[var(--brass-ink)]">
                    {copy.details.split('{title}').join(job.title.toLowerCase())}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="pe-cine-cautam" className="mt-14 max-w-3xl border-t border-[var(--hairline)] pt-12">
            <h2 id="pe-cine-cautam" className="type-h3">
              {copy.otherTitle}
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {copy.roles.map((role) => (
                <li key={role.title} className="porthole p-6">
                  <h3 className="font-sans text-[15px] font-semibold text-[var(--ink)]">{role.title}</h3>
                  <p className="type-body mt-2 text-[15px]">{role.text}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="cum-lucram" className="mt-14 max-w-3xl border-t border-[var(--hairline)] pt-12">
            <h2 id="cum-lucram" className="type-h3">
              {copy.howTitle}
            </h2>
            <p className="type-body mt-4">{copy.how}</p>
          </section>

          <section aria-labelledby="ce-se-intampla" className="mt-14 max-w-3xl border-t border-[var(--hairline)] pt-12">
            <h2 id="ce-se-intampla" className="type-h3">
              {copy.cvTitle}
            </h2>
            <ul className="type-body mt-4 flex list-disc flex-col gap-2 pl-6">
              {copy.cv.map((item) => (
                <li key={item}>{item}</li>
              ))}
              <li>
                {copy.deleteBefore}{' '}
                <a href={EMAIL_HREF} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                  {EMAIL}
                </a>
                .
              </li>
            </ul>
          </section>

          <section aria-labelledby="trimite-cv" className="mt-14 max-w-3xl">
            <h2 id="trimite-cv" className="type-h3">
              {copy.formTitle}
            </h2>
            <div className="mt-6">
              <CareerForm />
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <JsonLd data={graph(webPageNode({ path, name: copy.name, description: copy.description, breadcrumb: true, locale }), breadcrumbNode(crumbs))} />
    </>
  )
}

export const metadata = careersMetadata('ro')

export default function CareersPage() {
  return <CareersView locale="ro" />
}

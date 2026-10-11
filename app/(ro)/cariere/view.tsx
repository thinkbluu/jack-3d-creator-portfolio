import Link from 'next/link'
import CareerForm from '@/components/CareerForm'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import PageOpen from '@/components/studio/PageOpen'
import SectionHead from '@/components/studio/SectionHead'
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
    word: 'Cariere.',
    lead: 'O echipă mică, la distanță, care ține la detalii.',
    otherLabel: 'Și altfel',
    otherHead: 'Alte roluri.',
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
    word: 'Careers.',
    lead: 'A small, remote team that cares about the details.',
    otherLabel: 'Otherwise',
    otherHead: 'Other roles.',
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
        <PageOpen crumbs={crumbs} index="07" title={copy.name} word={copy.word} lead={copy.lead} short>
          <p className="max-w-sm leading-relaxed text-[var(--fg-2)]">{copy.intro}</p>
        </PageOpen>

        <section aria-labelledby="posturi-deschise" className="tone-dark pb-[clamp(5rem,10vw,9rem)]">
          <div className="studio-container">
            <h2 id="posturi-deschise" className="mono-label text-[var(--fg-3)]">
              {copy.openTitle} <sup className="text-[var(--accent)]">{jobs.length}</sup>
            </h2>
            <ul className="big-rows mt-6">
              {jobs.map((job) => (
                <li key={job.id}>
                  <Link href={localizePath(`/cariere/${job.id}`, locale)} className="big-row service-row" aria-label={copy.details.split('{title}').join(job.title.toLowerCase())}>
                    <span className="mono-label text-[var(--accent)]">→</span>
                    <span className="min-w-0">
                      <span className="big-row-name block">{job.title}</span>
                      <span className="service-row-text">{job.summary}</span>
                    </span>
                    <span className="service-row-facts">
                      <span>
                        <span className="mono-label text-[var(--fg-3)]">{careerLocation(locale)}</span>
                        <span className="block">{careerSchedule(locale)}</span>
                      </span>
                      <span className="text-[var(--accent)]">{salaryLabel(job, locale)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="page-section">
          <div className="studio-container">
            <SectionHead index="01" label={copy.otherLabel} title={copy.otherHead} intro={copy.otherTitle} />
            <ul className="mt-14 grid gap-10 md:grid-cols-3">
              {copy.roles.map((role, index) => (
                <li key={role.title} className="border-t border-[var(--ink)] pt-6">
                  <span className="mono-label text-[var(--brass-ink)]">{String(index + 1).padStart(2, '0')}</span>
                  <h3 className="display-xl mt-5 text-[clamp(1.8rem,2.8vw,2.6rem)] leading-none">{role.title}</h3>
                  <p className="mt-3 leading-relaxed text-[var(--ink-2)]">{role.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="tone-warm page-section">
          <div className="studio-container grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="flex flex-col gap-12">
              <div>
                <h2 id="cum-lucram" className="mono-label text-[var(--fg-3)]">
                  {copy.howTitle}
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-[var(--ink-2)]">{copy.how}</p>
              </div>
              <div>
                <h2 id="ce-se-intampla" className="mono-label text-[var(--fg-3)]">
                  {copy.cvTitle}
                </h2>
                <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 leading-relaxed text-[var(--ink-2)]">
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
              </div>
            </div>
            <section aria-labelledby="trimite-cv">
              <h2 id="trimite-cv" className="section-title section-title-sm display-xl">
                {copy.formTitle}
              </h2>
              <div className="mt-10">
                <CareerForm />
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd data={graph(webPageNode({ path, name: copy.name, description: copy.description, breadcrumb: true, locale }), breadcrumbNode(crumbs))} />
    </>
  )
}

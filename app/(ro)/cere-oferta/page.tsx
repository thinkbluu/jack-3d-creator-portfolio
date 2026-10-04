import Image from 'next/image'
import LeadForm from '@/components/LeadForm'
import TrackedLink from '@/components/TrackedLink'
import { localizePath } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/locale'
import { getFeaturedProjects } from '@/lib/projects'
import { pageMetadata } from '@/lib/seo'
import { EMAIL, PHONE_DISPLAY, PHONE_HREF } from '@/lib/site'

const offer = {
  ro: {
    title: 'Cere ofertă pentru site',
    description:
      'Primești oferta în aceeași zi. Site de prezentare de la 300 EUR, live în 48 de ore. Avans 50 EUR, restul doar dacă ești mulțumit de rezultat.',
    kicker: 'Ofertă clară, în aceeași zi',
    h1: 'Primești oferta azi.',
    intro: 'Spune-ne în 30 de secunde ce îți trebuie. Îți răspundem în aceeași zi, cu preț și termen clar.',
    trust: ['48h de la conținut la site live', 'de la 300 EUR', '50 EUR avans, restul doar dacă ești mulțumit'],
    whyKicker: 'De ce noi',
    whyTitle: 'Fără surprize între ofertă și livrare.',
    reasons: ['Design unic, fără șabloane', 'Textele sunt scrise de noi', 'Plătești doar dacă ești mulțumit', 'Domeniul rămâne pe numele tău'],
    workKicker: 'Portofoliu selectat',
    workTitle: 'Proiecte livrate',
    projectAlt: 'Proiectul {name}',
    faqKicker: 'Înainte să începem',
    faqTitle: 'Întrebări frecvente',
    faq: [
      {
        question: 'Ce se întâmplă dacă nu îmi place?',
        answer: 'Îți prezentăm direcția și ajustăm ce nu funcționează. Achită restul doar după ce ești mulțumit de rezultat.',
      },
      {
        question: 'Chiar e gata în 48 de ore?',
        answer: 'Da, pentru un site de prezentare standard, cele 48 de ore încep din momentul în care avem toate informațiile necesare de la tine.',
      },
      {
        question: 'Ce trebuie să vă dau?',
        answer: 'Avem nevoie de informațiile de bază despre firmă, servicii, datele de contact și orice fotografii sau materiale pe care vrei să le folosim.',
      },
      {
        question: 'Ce se plătește separat?',
        answer: 'Domeniul și găzduirea se plătesc separat, direct pe numele tău. Îți explicăm costurile exacte înainte să începem.',
      },
    ],
    footer: '© 2026 MAST Studio · MAST Consult S.R.L. · CUI RO49626121 · Timișoara, România',
  },
  en: {
    title: 'Get a quote for your website',
    description:
      'You get the quote the same day. Presentation websites from 300 EUR, live in 48 hours. A 50 EUR deposit, the rest only if you’re happy with the result.',
    kicker: 'A clear quote, the same day',
    h1: 'You get the quote today.',
    intro: 'Tell us what you need in 30 seconds. We reply the same day, with a clear price and timeline.',
    trust: ['48h from content to a live site', 'from 300 EUR', '50 EUR deposit, the rest only if you’re happy'],
    whyKicker: 'Why us',
    whyTitle: 'No surprises between the quote and the delivery.',
    reasons: ['A unique design, with no templates', 'We write the copy', 'You pay only if you’re happy', 'The domain stays in your name'],
    workKicker: 'Selected work',
    workTitle: 'Delivered projects',
    projectAlt: 'The {name} project',
    faqKicker: 'Before we start',
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        question: 'What if I don’t like it?',
        answer: 'We show you the direction and adjust what doesn’t work. You pay the rest only after you’re happy with the result.',
      },
      {
        question: 'Is it really ready in 48 hours?',
        answer: 'Yes, for a standard presentation website. The 48 hours start the moment we have everything we need from you.',
      },
      {
        question: 'What do I need to give you?',
        answer: 'We need the basic information about the company, the services, the contact details, and any photos or materials you want us to use.',
      },
      {
        question: 'What is paid separately?',
        answer: 'The domain and the hosting are paid separately, directly in your name. We explain the exact costs before we start.',
      },
    ],
    footer: '© 2026 MAST Studio · MAST Consult S.R.L. · CUI RO49626121 · Timișoara, Romania',
  },
}

// Landing page for paid campaigns. It duplicates /cerere-oferta on purpose, so it
// stays out of the index (links are still followed) and out of the sitemap.
export function offerMetadata(locale: Locale = 'ro') {
  const copy = offer[locale]
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: localizePath('/cere-oferta', locale),
    noindex: true,
    locale,
  })
}

export function OfferView({ locale }: { locale: Locale }) {
  const copy = offer[locale]
  const projects = getFeaturedProjects(3, locale)

  return (
    <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <header className="border-b border-[var(--hairline)] bg-[var(--shell-warm)]">
        <div className="site-container flex min-h-16 items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-2 text-[var(--ink)]" aria-label="MAST Studio">
            <span
              aria-hidden="true"
              className="size-5 bg-[var(--brass)]"
              style={{
                mask: "url('/icons/mast-mark.svg') center / contain no-repeat",
                WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat",
              }}
            />
            <span className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-semibold">MAST</span>
              <span className="font-sans text-[10px] font-medium tracking-[0.28em]">STUDIO</span>
            </span>
          </div>
          <TrackedLink
            href={PHONE_HREF}
            eventProperties={{ placement: 'offer_header' }}
            className="font-sans text-sm font-semibold text-[var(--ink)] underline decoration-[var(--hairline)] underline-offset-4 transition-colors hover:text-[var(--brass)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
          >
            {PHONE_DISPLAY}
          </TrackedLink>
        </div>
      </header>

      <section className="site-container pb-14 pt-8 md:pb-20 md:pt-12">
        <div className="mx-auto max-w-3xl">
          <p className="kicker">{copy.kicker}</p>
          <h1 className="type-h2 mt-3 text-balance">{copy.h1}</h1>
          <p className="type-body mt-4 max-w-2xl text-pretty text-lg">{copy.intro}</p>
          <div className="mt-7">
            <LeadForm variant="page" />
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 border-y border-[var(--hairline)] sm:grid-cols-3">
          {copy.trust.map((point, index) => (
            <p
              key={point}
              className={`px-5 py-4 text-center font-sans text-sm font-semibold text-[var(--ink-2)] ${
                index > 0 ? 'border-t border-[var(--hairline)] sm:border-l sm:border-t-0' : ''
              }`}
            >
              {point}
            </p>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--hairline)] bg-[var(--shell-warm)] py-14 md:py-20">
        <div className="site-container grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="kicker">{copy.whyKicker}</p>
            <h2 className="type-h2 mt-3 text-balance">{copy.whyTitle}</h2>
          </div>
          <ul className="border-t border-[var(--hairline)]">
            {copy.reasons.map((reason) => (
              <li key={reason} className="border-b border-[var(--hairline)] py-4 font-sans text-base text-[var(--ink-2)]">
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="site-container py-14 md:py-20">
        <p className="kicker">{copy.workKicker}</p>
        <h2 className="type-h2 mt-3 text-balance">{copy.workTitle}</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {projects.map((project) => (
            <article key={project.slug} className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--shell-warm)]">
              <div className="relative aspect-[4/3] overflow-hidden border-b border-[var(--hairline)]">
                <Image src={project.cover} alt={copy.projectAlt.split('{name}').join(project.name)} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-col gap-2 p-5">
                <p className="kicker">{project.categoryLabel}</p>
                <h3 className="type-h3 text-balance">{project.name}</h3>
                <p className="font-sans text-sm leading-relaxed text-[var(--ink-3)]">{project.summary}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--hairline)] bg-[var(--shell-warm)] py-14 md:py-20">
        <div className="site-container mx-auto max-w-3xl">
          <p className="kicker">{copy.faqKicker}</p>
          <h2 className="type-h2 mt-3 text-balance">{copy.faqTitle}</h2>
          <div className="mt-8 border-t border-[var(--hairline)]">
            {copy.faq.map((faq) => (
              <details key={faq.question} className="group border-b border-[var(--hairline)] py-5">
                <summary className="cursor-pointer list-none pr-8 font-sans text-base font-semibold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]">
                  {faq.question}
                </summary>
                <p className="type-body mt-3 max-w-2xl text-pretty">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--hairline)] bg-[var(--shell)] py-8 font-sans text-sm text-[var(--ink-3)]">
        <div className="site-container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>{copy.footer}</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <TrackedLink
              href={PHONE_HREF}
              eventProperties={{ placement: 'offer_footer' }}
              className="transition-colors hover:text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
            >
              {PHONE_DISPLAY}
            </TrackedLink>
            <span>{EMAIL}</span>
          </div>
        </div>
      </footer>
    </main>
  )
}

export const metadata = offerMetadata('ro')

export default function CereOfertaPage() {
  return <OfferView locale="ro" />
}

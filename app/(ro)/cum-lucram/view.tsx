import Link from 'next/link'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import PageOpen from '@/components/studio/PageOpen'
import { Reveal } from '@/components/studio/Reveal'
import SectionHead from '@/components/studio/SectionHead'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

type Step = { title: string; text: string; gives: string }

const approach: Record<
  Locale,
  {
    title: string
    description: string
    word: string
    lead: string
    principlesLabel: string
    principlesTitle: string
    principlesIntro: string
    principles: { title: string; text: string }[]
    stepsLabel: string
    stepsTitle: string
    stepsIntro: string
    steps: Step[]
    givesLabel: string
    handoverLabel: string
    handoverTitle: string
    handover: string[]
    nextLabel: string
    next: { href: string; label: string; note: string }[]
  }
> = {
  ro: {
    title: 'Cum lucrăm: procesul MAST Studio, pas cu pas',
    description:
      'Cum construiește MAST Studio un site: analiză, structură, texte, design, testare și lansare, cu link live înainte de plată și predare completă la final.',
    word: 'Cum lucrăm.',
    lead: 'Puțini oameni, un proces scris și predare completă. Fără surprize la final.',
    principlesLabel: 'Principii',
    principlesTitle: 'Ce nu negociem.',
    principlesIntro: 'Patru reguli după care merge fiecare proiect, indiferent de mărime.',
    principles: [
      {
        title: 'Analiză înainte de design',
        text: 'Nu deschidem editorul până nu înțelegem ce vinzi, cui vinzi și de ce te-ar alege pe tine. Din discuția asta iese structura site-ului, nu din șabloane.',
      },
      {
        title: 'Puține proiecte, atenție completă',
        text: 'Lucrăm cu puține proiecte în același timp, ca să putem livra repede fără să tăiem colțuri.',
      },
      {
        title: 'Aceiași pași, de fiecare dată',
        text: 'Analiză, structură, texte, design, testare, lansare. Fiecare etapă are un livrabil pe care îl vezi, nu o promisiune că se lucrează la el.',
      },
      {
        title: 'Predare completă, nu doar un link',
        text: 'Primești accesele, documentația și un instructaj. Site-ul e al tău din prima zi, cu tot ce trebuie ca să te descurci și fără noi.',
      },
    ],
    stepsLabel: 'Procesul',
    stepsTitle: 'Pas cu pas.',
    stepsIntro: 'De la primul mesaj până la predare. Termenul scris în ofertă pornește când avem materialele.',
    steps: [
      {
        title: 'Ne scrii',
        text: 'Pe WhatsApp, pe e-mail sau prin formular. În două fraze ne spui ce faci și ce vrei.',
        gives: 'În aceeași zi: ofertă cu preț fix și lista scurtă de materiale.',
      },
      {
        title: 'Trimiți materialele',
        text: 'Texte, poze, siglă, ce ai deja. Nu trebuie să vină perfecte; le așezăm noi.',
        gives: 'Din acel moment pornește termenul din ofertă.',
      },
      {
        title: 'Structură și design',
        text: 'Ordinea paginilor, ierarhia, textele și direcția vizuală, construite în jurul a ce vinde afacerea ta.',
        gives: 'Site-ul se construiește direct, nu ca o imagine statică.',
      },
      {
        title: 'Link live',
        text: 'Vezi site-ul funcțional, nu un mockup. Îl testezi, îl arăți cui vrei și ceri modificări.',
        gives: 'Un link pe care îl deschizi de pe orice telefon.',
      },
      {
        title: 'Lansare și predare',
        text: 'Plătești restul doar dacă ești mulțumit, apoi site-ul intră live.',
        gives: 'Accese, documentație și instructaj de folosire.',
      },
    ],
    givesLabel: 'Primești',
    handoverLabel: 'La final',
    handoverTitle: 'Ce rămâne la tine.',
    handover: [
      'Accesele la domeniu, hosting și cod.',
      'Documentația site-ului.',
      'Un instructaj scurt de folosire.',
      'Mentenanță, dacă o vrei, fără contract pe termen lung.',
    ],
    nextLabel: 'Mai departe',
    next: [
      { href: '/portofoliu', label: 'Lucrări', note: 'Ce a ieșit din procesul ăsta' },
      { href: '/servicii', label: 'Servicii și prețuri', note: 'Ce construim și cât costă' },
      { href: '/contact', label: 'Scrie-ne', note: 'Primul pas' },
    ],
  },
  en: {
    title: 'Approach: how MAST Studio works, step by step',
    description:
      'How MAST Studio builds a website: analysis, structure, copy, design, testing and launch, with a live link before payment and a full handover at the end.',
    word: 'Approach.',
    lead: 'Few people, a written process and a full handover. No surprises at the end.',
    principlesLabel: 'Principles',
    principlesTitle: 'What we don’t negotiate.',
    principlesIntro: 'Four rules every project follows, whatever its size.',
    principles: [
      {
        title: 'Analysis before design',
        text: 'We don’t open the editor until we understand what you sell, who you sell to and why they would choose you. The structure of the site comes out of that conversation, not out of a template.',
      },
      {
        title: 'Few projects, full attention',
        text: 'We take on few projects at a time, so we can deliver quickly without cutting corners.',
      },
      {
        title: 'The same steps, every time',
        text: 'Analysis, structure, copy, design, testing, launch. Every stage ends in something you can see, not a promise that it’s being worked on.',
      },
      {
        title: 'A full handover, not just a link',
        text: 'You get the access, the documentation and a walkthrough. The site is yours from day one, with everything you need to carry on without us.',
      },
    ],
    stepsLabel: 'Process',
    stepsTitle: 'Step by step.',
    stepsIntro: 'From the first message to the handover. The timeline in the quote starts once we have the materials.',
    steps: [
      {
        title: 'You write to us',
        text: 'On WhatsApp, by email or through the form. In two sentences you tell us what you do and what you want.',
        gives: 'The same day: a fixed-price quote and a short list of materials.',
      },
      {
        title: 'You send the materials',
        text: 'Text, photos, a logo, whatever you have. They don’t need to be perfect; we put them in order.',
        gives: 'The timeline in the quote starts from that moment.',
      },
      {
        title: 'Structure and design',
        text: 'The order of the pages, the hierarchy, the copy and the visual direction, built around what your business sells.',
        gives: 'The site is built for real, not as a static picture.',
      },
      {
        title: 'Live link',
        text: 'You see the working site, not a mockup. You test it, show it to anyone and ask for changes.',
        gives: 'A link you can open on any phone.',
      },
      {
        title: 'Launch and handover',
        text: 'You pay the rest only if you’re happy, then the site goes live.',
        gives: 'Access, documentation and a walkthrough.',
      },
    ],
    givesLabel: 'You get',
    handoverLabel: 'At the end',
    handoverTitle: 'What stays with you.',
    handover: [
      'Access to the domain, the hosting and the code.',
      'The site’s documentation.',
      'A short walkthrough of how to use it.',
      'Maintenance, if you want it, with no long-term contract.',
    ],
    nextLabel: 'Next',
    next: [
      { href: '/portofoliu', label: 'Work', note: 'What came out of this process' },
      { href: '/servicii', label: 'Services and prices', note: 'What we build and what it costs' },
      { href: '/contact', label: 'Write to us', note: 'The first step' },
    ],
  },
}

export function approachMetadata(locale: Locale) {
  const copy = approach[locale]
  return pageMetadata({ title: copy.title, description: copy.description, path: localizePath('/cum-lucram', locale), locale })
}

export function ApproachView({ locale }: { locale: Locale }) {
  const copy = approach[locale]
  const path = localizePath('/cum-lucram', locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.approach, path },
  ]

  return (
    <>
      <SiteHeader current="cum-lucram" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageOpen crumbs={crumbs} index="03" title={copy.title} word={copy.word} lead={copy.lead} />

        <section className="page-section">
          <div className="studio-container">
            <SectionHead index="01" label={copy.principlesLabel} title={copy.principlesTitle} intro={copy.principlesIntro} />
            <ol className="approach-principles">
              {copy.principles.map((principle, index) => (
                <li key={principle.title}>
                  <Reveal delay={(index % 2) * 0.1}>
                    <span className="approach-num display-xl">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="mt-6 font-sans text-2xl font-semibold tracking-tight">{principle.title}</h3>
                    <p className="mt-3 max-w-md leading-relaxed text-[var(--ink-2)]">{principle.text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="tone-dark page-section">
          <div className="studio-container">
            <SectionHead index="02" label={copy.stepsLabel} title={copy.stepsTitle} intro={copy.stepsIntro} />
            <ol className="approach-steps">
              {copy.steps.map((step, index) => (
                <li key={step.title} className="approach-step">
                  <span className="approach-step-num display-xl">{index + 1}</span>
                  <div>
                    <h3 className="approach-step-title display-xl">{step.title}</h3>
                    <p className="mt-4 max-w-xl text-lg leading-relaxed text-[var(--fg-2)]">{step.text}</p>
                  </div>
                  <p className="approach-step-gives">
                    <span className="mono-label block text-[var(--accent)]">{copy.givesLabel}</span>
                    {step.gives}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="page-section">
          <div className="studio-container grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <SectionHead index="03" label={copy.handoverLabel} title={copy.handoverTitle} compact />
            <ul className="big-rows self-end">
              {copy.handover.map((item) => (
                <li key={item} className="border-b border-[var(--line)] py-5 text-xl">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="tone-warm page-section">
          <div className="studio-container">
            <p className="mono-label text-[var(--fg-3)]">{copy.nextLabel}</p>
            <ul className="big-rows mt-8">
              {copy.next.map((link) => (
                <li key={link.href}>
                  <Link href={localizePath(link.href, locale)} className="big-row">
                    <span className="mono-label text-[var(--fg-3)]">→</span>
                    <span>
                      <span className="big-row-name block">{link.label}</span>
                      <span className="mt-2 block text-[var(--fg-2)]">{link.note}</span>
                    </span>
                    <span aria-hidden="true" className="big-row-arrow">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
      <JsonLd
        data={graph(
          webPageNode({ path, name: copy.title, description: copy.description, breadcrumb: true, locale }),
          breadcrumbNode(crumbs),
        )}
      />
    </>
  )
}

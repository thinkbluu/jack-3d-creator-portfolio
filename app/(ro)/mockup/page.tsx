import Image from 'next/image'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import MockupForm from '@/components/MockupForm'
import PreselectLink from '@/components/PreselectLink'
import SiteHeader from '@/components/SiteHeader'
import { primaryButtonClass, textLinkClass } from '@/components/form-styles'
import { faqNode, graph, webPageNode } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

const PATH = '/mockup'

const META_TITLE = 'Mockup gratuit pentru site-ul firmei tale'
const META_DESCRIPTION =
  'Trimite datele firmei și primești gratuit, în 24 de ore, mockup-ul paginii principale pe desktop și mobil. Ofertă valabilă până pe 31 octombrie 2026.'

// TODO: înlocuiește cu URL-urile reale ale site-urilor live.
const PORTFOLIO_LINKS = {
  veterinaria: 'https://exemplu-veterinaria.ro',
  agd: 'https://exemplu-agd.ro',
  decodex: 'https://exemplu-decodex.ro',
} as const

const PORTFOLIO = [
  {
    key: 'veterinaria' as const,
    image: '/portfolio/veterinaria.jpg',
    alt: 'Pagina principală a site-ului Veterinaria Timișoara',
    name: 'Veterinaria Timișoara',
    line: 'Cabinet veterinar · aproximativ 80% mai mulți clienți noi raportați după lansare',
  },
  {
    key: 'agd' as const,
    image: '/portfolio/agd.jpg',
    alt: 'Pagina principală a site-ului AGD Innerpath Consulting',
    name: 'AGD Innerpath Consulting',
    line: 'Consultanță juridică și strategică · site bilingv',
  },
  {
    key: 'decodex' as const,
    image: '/portfolio/decodex.jpg',
    alt: 'Pagina principală a site-ului DECODEX',
    name: 'DECODEX',
    line: 'Site instituțional · proiect cofinanțat PoCIDIF 2021-2027',
  },
]

const STEPS = [
  {
    title: 'Ne trimiți datele',
    body: 'Numele firmei, domeniul și serviciile principale. Durează 1 minut.',
  },
  {
    title: 'Primești mockup-ul',
    body: 'În 24 de ore lucrătoare, pe WhatsApp, pe desktop și mobil, cu un mesaj vocal scurt.',
  },
  {
    title: 'Decizi tu',
    body: 'Îți place? Avans de 50 EUR, site live în 48 de ore. Restul îl plătești doar dacă ești mulțumit.',
  },
]

const FAQS = [
  {
    question: 'Chiar e gratuit?',
    answer: 'Da. Mockup-ul nu costă nimic și nu te obligă la nimic. Plătești doar dacă vrei să construim site-ul.',
  },
  {
    question: 'Ce primesc exact?',
    answer:
      'Designul paginii principale, pe desktop și pe mobil, cu numele, culorile și serviciile firmei tale. Îl primești ca imagini pe WhatsApp, cu un mesaj vocal scurt în care îți explicăm alegerile.',
  },
  {
    question: 'Ce se întâmplă după mockup?',
    answer:
      'Dacă îți place, avansul de 50 EUR îți rezervă locul. Site-ul e live în 48 de ore de la primirea materialelor, iar restul îl plătești doar dacă ești mulțumit.',
  },
  {
    question: 'Cât costă site-ul?',
    answer: 'Site de prezentare de la 300 EUR, magazin online de la 900 EUR. Prețul exact îl știi înainte să începem.',
  },
  {
    question: 'Pot avea magazinul gata de Black Friday?',
    answer: 'Da, dacă confirmi până pe 26 octombrie. Black Friday este pe 6 noiembrie.',
  },
]

const WHATSAPP_URL =
  'https://wa.me/40746382204?text=Salut%2C%20vreau%20mockup-ul%20gratuit%20pentru%20firma%20mea'

export const metadata = pageMetadata({
  title: META_TITLE,
  description: META_DESCRIPTION,
  path: PATH,
  locale: 'ro',
  // Campaign landing page, Romanian only — no English alternate exists.
  hreflang: false,
})

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
      <circle cx="8" cy="8" r="7.25" stroke="var(--brass)" strokeWidth="1.5" />
      <path d="M4.8 8.2 7 10.4 11.2 5.8" stroke="var(--brass-ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function MockupPage() {
  return (
    <>
      <SiteHeader />
      <JsonLd data={graph(webPageNode({ path: PATH, name: META_TITLE, description: META_DESCRIPTION }), faqNode(FAQS, PATH))} />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        {/* 1. Hero: copy left, form right on desktop; copy, then form on mobile. */}
        <section className="site-container pb-14 pt-8 md:pb-20 md:pt-14">
          <div className="grid items-start gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div>
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brass-ink)]">
                Ofertă de octombrie · locuri limitate
              </p>
              <h1 className="mt-4 text-balance font-[family-name:var(--font-display)] text-[28px] font-semibold leading-[1.15] sm:text-4xl lg:text-[44px]">
                Vezi site-ul firmei tale înainte să plătești ceva.
              </h1>
              <p className="mt-4 max-w-xl font-sans text-[15px] leading-relaxed text-[var(--ink-2)] sm:text-base">
                Trimite 4 informații. În 24 de ore lucrătoare primești pe WhatsApp mockup-ul paginii principale, pe
                desktop și mobil. Gratuit, până pe 31 octombrie.
              </p>
              <ul className="mt-5 flex flex-col gap-2.5">
                {['Design unic, fără template-uri', 'Fără obligații', 'Maximum 5 mockup-uri pe zi'].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 font-sans text-sm font-semibold text-[var(--ink)]">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div id="form" className="scroll-mt-6">
              <MockupForm />
              <p className="mt-4 text-center font-sans text-sm text-[var(--ink-2)]">
                Preferi WhatsApp?{' '}
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                  Scrie-ne direct
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* 2. Cum funcționează */}
        <section aria-labelledby="cum-functioneaza" className="site-container pb-14 md:pb-20">
          <h2 id="cum-functioneaza" className="type-h3">
            Cum funcționează
          </h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-3 md:border-l md:border-[var(--hairline)] md:pl-6 md:first:border-l-0 md:first:pl-0">
                <span
                  aria-hidden="true"
                  className="flex size-9 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--shell-warm)] font-sans text-sm font-semibold text-[var(--brass-ink)]"
                >
                  {index + 1}
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">{step.title}</h3>
                <p className="font-sans text-[15px] leading-relaxed text-[var(--ink-2)]">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 3. Site-uri live, nu machete */}
        <section aria-labelledby="site-uri-live" className="site-container pb-14 md:pb-20">
          <h2 id="site-uri-live" className="type-h3">
            Site-uri live, nu machete
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {PORTFOLIO.map((item) => (
              <article key={item.key} className="porthole flex flex-col overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.alt}
                  width={800}
                  height={600}
                  className="aspect-[4/3] w-full object-cover"
                  sizes="(min-width: 768px) 30vw, 100vw"
                />
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold">{item.name}</h3>
                  <p className="flex-1 font-sans text-sm leading-relaxed text-[var(--ink-2)]">{item.line}</p>
                  <a href={PORTFOLIO_LINKS[item.key]} target="_blank" rel="noopener noreferrer" className={`${textLinkClass} mt-2 self-start`}>
                    Vezi site-ul
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 4. Black Friday band */}
        <section aria-labelledby="black-friday" className="border-y border-[var(--hairline)] bg-[var(--shell-warm)]">
          <div aria-hidden="true" className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, transparent, var(--brass), transparent)' }} />
          <div className="site-container flex flex-col items-start gap-5 py-10 md:py-12">
            <h2 id="black-friday" className="type-h3 text-balance">
              Magazin online live înainte de Black Friday
            </h2>
            <p className="max-w-2xl font-sans text-[15px] leading-relaxed text-[var(--ink-2)]">
              Black Friday este pe 6 noiembrie. Confirmă până pe 26 octombrie și magazinul tău e gata la timp.
            </p>
            <PreselectLink type="magazin" className={primaryButtonClass}>
              Vreau mockup pentru magazin
            </PreselectLink>
          </div>
        </section>

        {/* 5. FAQ */}
        <section aria-labelledby="intrebari" className="site-container pb-14 pt-14 md:pb-20 md:pt-20">
          <h2 id="intrebari" className="type-h3">
            Întrebări frecvente
          </h2>
          <div className="mt-6 max-w-3xl divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
            {FAQS.map((item) => (
              <details key={item.question} className="faq-item group py-5">
                <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 font-sans font-semibold [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span className="faq-icon flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink)]" aria-hidden="true">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M5.5 0V11M0 5.5H11" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 font-sans text-[15px] leading-relaxed text-[var(--ink-2)]">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 6. Final CTA */}
        <section className="site-container pb-20 md:pb-28">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <h2 className="text-balance font-[family-name:var(--font-display)] text-3xl font-semibold leading-tight sm:text-4xl">
              Mockup-ul e gratuit. Locurile din octombrie, nu.
            </h2>
            <a href="#form" className={primaryButtonClass}>
              Vreau mockup-ul gratuit
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { Check } from 'lucide-react'
import FaqAccordion from './FaqAccordion'
import OfferForm from './OfferForm'
import OfferWaLink from './OfferWaLink'
import PortfolioLightbox from './PortfolioLightbox'
import StickyWhatsApp from './StickyWhatsApp'
import AnpcSalBadge from '@/components/AnpcSalBadge'
import { getAllProjects } from '@/lib/projects'
import { reviewCards } from '@/lib/reviews'
import { offerConditions } from '@/lib/offer'
import { EMAIL_HREF, LEGAL_NAME, SITE_NAME, TRADE_REGISTER_NUMBER, VAT_ID, whatsappUrl } from '@/lib/site'

// The exact prefill the campaign promises in the ad copy.
const OFFER_WA_MESSAGE = 'Salut! Am văzut oferta și vreau să-mi faceți site-ul gratuit să văd cum arată.'

const steps = [
  {
    index: '01',
    title: 'Ne scrii',
    when: '2 minute',
    text: 'Apeși butonul de WhatsApp sau trimiți formularul. Îți punem câteva întrebări despre afacerea ta și atât.',
  },
  {
    index: '02',
    title: 'Primești site-ul gata',
    when: '48 de ore',
    text: 'Construim site-ul cu design unic și textele scrise de noi, apoi îl vezi funcționând pe o adresă de test.',
  },
  {
    index: '03',
    title: 'Plătești doar dacă îți place',
    when: 'decizia ta',
    text: 'Îți place, plătești, iar site-ul pleacă pe domeniul tău. Nu îți place, nu datorezi nimic.',
  },
]

const deliverables = [
  'Design unic, nu șablon',
  'Texte scrise de noi',
  'Până la 5 pagini',
  'Versiune mobilă',
  'Buton WhatsApp',
  'Formular de contact',
  'SEO de bază',
  'Domeniul pe numele tău',
]

const faqs = [
  {
    question: 'Chiar e gratuit dacă nu-mi place?',
    answer:
      'Da. Vezi site-ul gata pe o adresă de test și ai 7 zile să decizi. Dacă nu îți place, nu plătești nimic.',
  },
  {
    question: 'Ce trebuie să vă trimit?',
    answer:
      'Materialele despre afacerea ta: logo, poze, date de contact și, dacă ai, textele. Dacă nu ai textele, le scriem noi.',
  },
  {
    question: 'Cât durează?',
    answer: '48 de ore de la primirea materialelor complete, pentru un site de prezentare.',
  },
  {
    question: 'Site-ul e al meu?',
    answer:
      'Da. Domeniul e înregistrat pe numele tău, iar după plată primești accesul complet la site și la găzduire.',
  },
]

// Reviews copied word for word from Google; the middle one names the 48 hour
// delivery, the promise this page is built around.
const trustReviews = [
  reviewCards.find((review) => review.author === 'Florin'),
  reviewCards.find((review) => review.author === 'Eduard'),
  reviewCards.find((review) => review.author === 'Preda'),
].filter((review) => review !== undefined)

const portfolioProjects = getAllProjects('ro')
  .filter((project) => project.type === 'client')
  .slice(0, 4)
  .map((project) => ({ name: project.name, cover: project.cover, coverAlt: project.coverAlt }))

const primaryButtonClass =
  'inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[999px] bg-[var(--brass)] px-8 py-3.5 font-sans text-[15px] font-bold text-[var(--ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-[transform,filter] duration-200 hover:-translate-y-px hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] sm:w-auto'

const secondaryButtonClass =
  'inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[999px] border-[1.5px] border-[var(--hairline)] px-8 py-3.5 font-sans text-[15px] font-bold text-[var(--ink)] transition-colors duration-200 hover:border-[var(--brass)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] sm:w-auto'

function Stars() {
  return (
    <p aria-label="5 stele din 5" className="font-sans text-sm tracking-[0.2em] text-[var(--brass-ink)]">
      ★★★★★
    </p>
  )
}

export default function OfferLanding() {
  return (
    <main id="main">
      {/* Campaign page: no announcement bar, so no exit link before the
          conversion. OfferBarDismiss still syncs --offer-bar-h to 0. */}
      <style>{'[data-offer-bar]{display:none!important}'}</style>

      {/* 1. Hero: renders instantly, no loader, no intro animation. */}
      <section className="tone-cream relative pb-16 pt-10 md:pb-24 md:pt-14">
        <div className="studio-container">
          <div className="flex items-center gap-2 text-[var(--ink)]">
            <span
              aria-hidden="true"
              className="size-[22px] bg-[var(--brass)]"
              style={{ mask: "url('/icons/mast-mark.svg') center / contain no-repeat", WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat" }}
            />
            <p className="wordmark">
              <span>MAST</span> <em>Studio</em>
            </p>
          </div>

          <div className="mt-14 grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-start lg:gap-16">
            <div>
              <p className="mono-label text-[var(--brass-ink)]">Ofertă valabilă până la 30 noiembrie</p>
              <h1 className="display-xl mt-5 text-[clamp(2.6rem,6.5vw,4.8rem)] leading-[0.98] text-[var(--ink)]">
                Îți facem site-ul gratuit. Plătești doar dacă îți place.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--fg-2)]">
                Site de prezentare de la 300 EUR, gata în 48 de ore după ce primim materialele. Fără avans până la 30
                noiembrie.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <OfferWaLink
                  href={whatsappUrl(OFFER_WA_MESSAGE)}
                  placement="oferta_hero"
                  className={primaryButtonClass}
                >
                  Scrie-ne pe WhatsApp
                </OfferWaLink>
                <a href="#formular" className={secondaryButtonClass}>
                  Completează formularul
                </a>
              </div>
            </div>

            <div id="formular" className="porthole scroll-mt-24 border-[var(--glass-edge)] p-6 md:p-8">
              <h2 className="font-display text-2xl text-[var(--ink)]">Vreau site-ul gratuit</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--fg-2)]">
                Nu folosești WhatsApp? Lasă-ne datele și te contactăm noi în aceeași zi.
              </p>
              <OfferForm />
              <p className="mt-5 border-t border-[var(--hairline)] pt-4 text-xs leading-relaxed text-[var(--fg-3)]">
                {offerConditions.ro}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust bar: real Google reviews, three visible. */}
      <section id="recenzii" aria-labelledby="recenzii-titlu" className="tone-warm scroll-mt-24 border-y border-[var(--hairline)] py-16 md:py-20">
        <div className="studio-container">
          <h2 id="recenzii-titlu" className="font-display text-[clamp(1.6rem,3vw,2.4rem)] text-[var(--ink)]">
            11 recenzii de 5 stele pe Google
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {trustReviews.map((review) => (
              <li key={review.author} className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[rgba(255,255,255,0.5)] p-6">
                <div className="flex items-center justify-between gap-4">
                  <Stars />
                  <span className="mono-label text-[var(--fg-3)]">Google</span>
                </div>
                <blockquote className="flex-1 text-[15px] leading-relaxed text-[var(--fg-2)]">“{review.quote}”</blockquote>
                <footer className="text-sm">
                  <p className="font-semibold text-[var(--ink)]">{review.author}</p>
                  <p className="text-[var(--fg-3)]">Recenzie Google</p>
                </footer>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Cum funcționează */}
      <section id="cum-functioneaza" aria-labelledby="cum-titlu" className="tone-cream scroll-mt-24 py-20 md:py-28">
        <div className="studio-container">
          <p className="mono-label text-[var(--brass-ink)]">Cum funcționează</p>
          <h2 id="cum-titlu" className="display-xl mt-4 text-[clamp(2rem,4.5vw,3.4rem)] text-[var(--ink)]">
            Trei pași, fără avans
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step) => (
              <li key={step.index} className="border-t-2 border-[var(--ink)] pt-6">
                <p className="display-xl text-[var(--brass-ink)]">{step.index}</p>
                <h3 className="mt-4 font-display text-2xl text-[var(--ink)]">{step.title}</h3>
                <p className="mono-label mt-2 text-[var(--fg-3)]">{step.when}</p>
                <p className="mt-3 leading-relaxed text-[var(--fg-2)]">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Ce primești */}
      <section aria-labelledby="primesti-titlu" className="tone-warm border-y border-[var(--hairline)] py-20 md:py-28">
        <div className="studio-container grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <div>
            <p className="mono-label text-[var(--brass-ink)]">Ce primești</p>
            <h2 id="primesti-titlu" className="display-xl mt-4 text-[clamp(2rem,4.5vw,3.4rem)] text-[var(--ink)]">
              Tot ce trebuie, nimic ce nu
            </h2>
          </div>
          <ul className="grid gap-x-10 gap-y-5 sm:grid-cols-2">
            {deliverables.map((item) => (
              <li key={item} className="flex items-center gap-3 border-b border-[var(--hairline)] pb-5">
                <Check size={18} aria-hidden="true" className="shrink-0 text-[var(--brass-ink)]" />
                <span className="font-medium text-[var(--ink)]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Portfolio: image cards only, no outbound navigation. */}
      <section id="lucrari" aria-labelledby="portofoliu-titlu" className="tone-cream scroll-mt-24 py-20 md:py-28">
        <div className="studio-container">
          <p className="mono-label text-[var(--brass-ink)]">Portofoliu</p>
          <h2 id="portofoliu-titlu" className="display-xl mt-4 text-[clamp(2rem,4.5vw,3.4rem)] text-[var(--ink)]">
            Site-uri livrate clienților
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-[var(--fg-2)]">
            Atinge o imagine ca să o vezi mare. Fiecare site pornește de la un design unic.
          </p>
          <div className="mt-10">
            <PortfolioLightbox projects={portfolioProjects} />
          </div>
        </div>
      </section>

      {/* 6. Prices */}
      <section id="preturi" aria-labelledby="preturi-titlu" className="tone-dark grain relative scroll-mt-24 py-20 md:py-28">
        <div className="studio-container relative">
          <p className="mono-label text-[var(--brass-lite)]">Prețuri</p>
          <h2 id="preturi-titlu" className="display-xl mt-4 text-[clamp(2rem,4.5vw,3.4rem)] text-[var(--on-dark)]">
            Clar, de la început
          </h2>
          <dl className="mt-12 grid gap-10 md:grid-cols-2">
            <div className="border-t-2 border-[var(--brass-lite)] pt-6">
              <dt className="mono-label text-[var(--on-dark-2)]">Site de prezentare</dt>
              <dd className="display-xl mt-3 text-[var(--on-dark)]">de la 300 EUR</dd>
              <dd className="mt-3 text-[var(--on-dark-2)]">Până la 5 pagini, gata în 48 de ore. În noiembrie, fără avans.</dd>
            </div>
            <div className="border-t-2 border-[var(--brass-lite)] pt-6">
              <dt className="mono-label text-[var(--on-dark-2)]">Magazin online</dt>
              <dd className="display-xl mt-3 text-[var(--on-dark)]">de la 900 EUR</dd>
              <dd className="mt-3 text-[var(--on-dark-2)]">Produse, plăți online și facturi automate.</dd>
            </div>
          </dl>
          <p className="mt-10 text-[var(--on-dark-2)]">Domeniul și găzduirea, 50–120 EUR pe an, plătite direct de tine.</p>
        </div>
      </section>

      {/* 7. FAQ */}
      <section aria-labelledby="faq-titlu" className="tone-cream py-20 md:py-28">
        <div className="studio-container">
          <p className="mono-label text-[var(--brass-ink)]">Întrebări</p>
          <h2 id="faq-titlu" className="display-xl mt-4 text-[clamp(2rem,4.5vw,3.4rem)] text-[var(--ink)]">
            Ce întreabă de obicei
          </h2>
          <div className="mt-10 max-w-3xl">
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section aria-labelledby="final-titlu" className="tone-dark grain relative py-20 md:py-28">
        <div className="studio-container relative text-center">
          <h2 id="final-titlu" className="display-xl mx-auto max-w-3xl text-[clamp(2.2rem,5vw,4rem)] text-[var(--on-dark)]">
            Site-ul gata în 48 de ore. Tu decizi dacă îl plătești.
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <OfferWaLink
              href={whatsappUrl(OFFER_WA_MESSAGE)}
              placement="oferta_final"
              className={`${primaryButtonClass} sm:w-auto`}
            >
              Scrie-ne pe WhatsApp
            </OfferWaLink>
            <a href="#formular" className={secondaryButtonClass}>
              Completează formularul
            </a>
          </div>
          <p className="mt-5 text-sm text-[var(--on-dark-2)]">
            Preferi email?{' '}
            <a
              href={EMAIL_HREF}
              className="font-semibold text-[var(--on-dark)] underline decoration-[var(--brass-lite)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--brass-lite)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
            >
              Scrie-ne la contact@maststudio.ro
            </a>
          </p>
        </div>
      </section>

      {/* Legal footer line: identity, legal pages, ANPC. No link lists. */}
      <footer className="tone-dark border-t border-[var(--hairline-dark)] pb-28 pt-8 md:pb-10">
        <div className="studio-container flex flex-col gap-6 text-sm text-[var(--on-dark-3)] md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME} · {LEGAL_NAME} · CUI {VAT_ID} · {TRADE_REGISTER_NUMBER}
          </p>
          <nav aria-label="Legale" className="shrink-0">
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <li>
                <Link href="/confidentialitate" className="transition-colors hover:text-[var(--on-dark)]">
                  Confidențialitate
                </Link>
              </li>
              <li>
                <Link href="/termeni" className="transition-colors hover:text-[var(--on-dark)]">
                  Termeni
                </Link>
              </li>
            </ul>
          </nav>
          <AnpcSalBadge className="self-start md:self-auto" />
        </div>
      </footer>

      {/* 9. Sticky WhatsApp on mobile, always visible. */}
      <StickyWhatsApp href={whatsappUrl(OFFER_WA_MESSAGE)} />
    </main>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { Check, MessageCircle, Phone } from 'lucide-react'
import FaqAccordion from './FaqAccordion'
import CallbackForm from '@/components/ads/CallbackForm'
import NeedsBlock from '@/components/ads/NeedsBlock'
import StickyContactBar from '@/components/ads/StickyContactBar'
import JsonLd from '@/components/JsonLd'
import AnpcSalBadge from '@/components/AnpcSalBadge'
import { ADS_WA_MESSAGES, RESPONSE_MICROCOPY } from '@/lib/ads-copy'
import { isNoDepositActive, offerConditions, offerHeroLine } from '@/lib/offer'
import { getAllProjects } from '@/lib/projects'
import { reviewCards } from '@/lib/reviews'
import { faqNode, graph } from '@/lib/schema'
import { getServicePageBySlug } from '@/lib/services'
import { LEGAL_NAME, PHONE_HREF, SITE_NAME, TRADE_REGISTER_NUMBER, VAT_ID, whatsappUrl } from '@/lib/site'

// The presentation-website service is the product this page sells; price and
// delivery come from its single source of truth in lib/services.ts.
const service = getServicePageBySlug('site-de-prezentare', 'ro')
const PRICE_FROM = service?.priceFrom ?? 300
const DELIVERY = service?.deliveryTime ?? '48 de ore'

const WA_HREF = whatsappUrl(ADS_WA_MESSAGES.oferta)

// Post-launch costs, exactly as stated on the service and maintenance pages.
const DOMAIN_HOSTING_COST = 'Domeniu și găzduire: 50–120 EUR pe an, pe numele firmei tale, plătite direct de tine.'

const steps = [
  {
    when: '15 minute',
    title: 'Discutăm',
    text: 'Ne spui pe telefon ce face firma ta. Primești o ofertă cu preț fix în aceeași zi.',
  },
  {
    when: '48 de ore',
    title: 'Construim',
    text: 'Design unic și textele scrise de noi. Din momentul în care primim materialele, pornește termenul.',
  },
  {
    when: 'decizia ta',
    title: 'Verifici, cerem modificările și publicăm',
    text: 'Vezi site-ul live pe o adresă de test, ceri modificări, apoi publicăm pe domeniul tău.',
  },
]

// The six things the buyer actually receives, in the words the campaign uses.
const deliverables = [
  'Design unic',
  'Texte scrise de noi',
  'Gândit pentru telefon',
  'Pregătit pentru Google',
  'Formular și WhatsApp',
  'Domeniul pe numele tău',
]

const comparisonRows = [
  { aspect: 'Domeniu propriu', free: 'Subdomeniu sau reclame', ours: 'Domeniul pe numele firmei tale' },
  { aspect: 'Apare bine în Google', free: 'Limitat', ours: 'Optimizare SEO de bază inclusă' },
  { aspect: 'Fără reclamele altora', free: 'Banneruri și brand străin', ours: 'Fără reclame' },
  { aspect: 'Viteză pe telefon', free: 'Variabilă', ours: 'Optimizare de viteză inclusă' },
  { aspect: 'Cineva care te ajută după lansare', free: 'Nimeni', ours: 'Instructaj la predare și mentenanță opțională' },
]

const faqs = [
  {
    question: 'Există costuri ascunse?',
    answer: `Nu. Prețul e fix în ofertă: de la ${PRICE_FROM} EUR pentru un site de prezentare de până la 5 pagini. ${DOMAIN_HOSTING_COST} Mentenanța e opțională, de la 90 EUR pe lună. Toate costurile îți sunt spuse în scris, înainte să începem.`,
  },
  {
    question: 'Al cui e domeniul?',
    answer:
      'Al firmei tale. Domeniul e înregistrat pe numele tău, iar după plată primești accesul complet la site și la găzduire.',
  },
  {
    question: 'Pot modifica singur textele?',
    answer:
      'Da. La predare primești un scurt instructaj de folosire, iar textele le poți schimba oricând. Dacă preferi, le scriem și le actualizăm noi.',
  },
  {
    question: 'Ce se întâmplă dacă nu-mi place?',
    answer:
      'Vezi site-ul funcțional, live pe o adresă de test, în 48 de ore. Prima rundă de modificări e inclusă în preț. În noiembrie, fără avans: plătești doar dacă îți place.',
  },
  {
    question: 'Cum se plătește?',
    answer:
      'În noiembrie, fără avans: plătești la final, doar dacă ești mulțumit de rezultat. În mod obișnuit, un avans mic și restul la predare, când site-ul e deja live și îți place.',
  },
  {
    question: 'Mă ajutați și după lansare?',
    answer:
      'Da. Prima rundă de modificări e inclusă, iar după lansare poți opta pentru mentenanță de la 90 EUR pe lună: actualizări, modificări mici și suport.',
  },
]

// Reviews copied word for word from Google; the middle one names the 48 hour
// delivery, the promise this page is built around.
const trustReviews = [
  reviewCards.find((review) => review.author === 'Florin'),
  reviewCards.find((review) => review.author === 'Eduard'),
  reviewCards.find((review) => review.author === 'Preda'),
].filter((review) => review !== undefined)

// Presentation sites first, then the rest; four cards with a link each to the
// full case study.
const portfolioProjects = getAllProjects('ro')
  .filter((project) => project.type === 'client')
  .sort((a, b) => Number(b.category === 'site-prezentare') - Number(a.category === 'site-prezentare'))
  .slice(0, 4)

const primaryButtonClass =
  'inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[999px] bg-[var(--brass)] px-8 py-3.5 font-sans text-[15px] font-bold text-[var(--ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-[transform,filter] duration-200 hover:-translate-y-px hover:brightness-[1.06] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] sm:w-auto'

const secondaryButtonClass =
  'inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[999px] border-[1.5px] border-[var(--hairline)] px-8 py-3.5 font-sans text-[15px] font-bold text-[var(--ink)] transition-colors duration-200 hover:border-[var(--brass)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)] sm:w-auto'

function Stars() {
  return (
    <p className="font-sans text-sm tracking-[0.2em] text-[var(--brass-ink)]">
      <span className="sr-only">5 stele din 5</span>
      <span aria-hidden="true">★★★★★</span>
    </p>
  )
}

export default function OfferLanding() {
  const offerActive = isNoDepositActive()
  const offerLine = offerActive ? ` ${offerHeroLine.ro}` : ''

  return (
    <main id="main">
      {/* Campaign page: no announcement bar, so no exit link before the
          conversion. OfferBarDismiss still syncs --offer-bar-h to 0. */}
      <style>{'[data-offer-bar]{display:none!important}'}</style>

      <JsonLd data={graph(faqNode(faqs, '/oferta'))} />

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

          <div className="mt-12 max-w-3xl">
            <h1 className="display-xl text-[clamp(2.4rem,6.5vw,4.6rem)] leading-[0.98] text-[var(--ink)]">
              Site de prezentare pentru firma ta, de la {PRICE_FROM} EUR
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--fg-2)]">
              Gata în {DELIVERY}. Textele le scriem noi.{offerLine}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className={primaryButtonClass}
              >
                <MessageCircle size={18} aria-hidden="true" />
                Scrie-ne pe WhatsApp
              </a>
              <a href={PHONE_HREF} className={secondaryButtonClass}>
                <Phone size={18} aria-hidden="true" />
                Sună-ne
              </a>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--fg-3)]">{RESPONSE_MICROCOPY.ro}</p>
          </div>
        </div>
      </section>

      {/* 2. What you get for the price, plus the honest post-launch costs. */}
      <section aria-labelledby="primesti-titlu" className="tone-warm border-y border-[var(--hairline)] py-16 md:py-24">
        <div className="studio-container">
          <h2 id="primesti-titlu" className="display-xl text-[clamp(2rem,4.5vw,3.4rem)] text-[var(--ink)]">
            Ce primești pentru de la {PRICE_FROM} EUR
          </h2>
          <ul className="mt-10 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {deliverables.map((item) => (
              <li key={item} className="flex items-center gap-3 border-b border-[var(--hairline)] pb-5">
                <Check size={18} aria-hidden="true" className="shrink-0 text-[var(--brass-ink)]" />
                <span className="font-medium text-[var(--ink)]">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10 max-w-2xl border-t-2 border-[var(--ink)] pt-6">
            <h3 className="font-display text-xl text-[var(--ink)]">Costuri după lansare</h3>
            <p className="mt-3 leading-relaxed text-[var(--fg-2)]">{DOMAIN_HOSTING_COST}</p>
            <p className="mt-2 leading-relaxed text-[var(--fg-2)]">
              Mentenanță opțională:{' '}
              <Link
                href="/servicii/mentenanta"
                className="font-semibold text-[var(--ink)] underline decoration-[var(--brass)] decoration-2 underline-offset-4"
              >
                de la 90 EUR pe lună
              </Link>
              . Fără costuri ascunse.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The "no extra work for you" block. */}
      <NeedsBlock landing="oferta" />

      {/* 4. How we work, with real timing. */}
      <section id="cum-functioneaza" aria-labelledby="cum-titlu" className="tone-cream scroll-mt-24 py-20 md:py-28">
        <div className="studio-container">
          <p className="mono-label text-[var(--brass-ink)]">Cum lucrăm</p>
          <h2 id="cum-titlu" className="display-xl mt-4 text-[clamp(2rem,4.5vw,3.4rem)] text-[var(--ink)]">
            Trei pași, de la telefon la site publicat
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {steps.map((step, index) => (
              <li key={step.title} className="border-t-2 border-[var(--ink)] pt-6">
                <p className="display-xl text-[var(--brass-ink)]">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="mt-4 font-display text-2xl text-[var(--ink)]">{step.title}</h3>
                <p className="mono-label mt-2 text-[var(--fg-3)]">{step.when}</p>
                <p className="mt-3 leading-relaxed text-[var(--fg-2)]">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Proof: real client projects, presentation sites first. */}
      <section id="lucrari" aria-labelledby="portofoliu-titlu" className="tone-warm border-y border-[var(--hairline)] py-20 md:py-28">
        <div className="studio-container">
          <p className="mono-label text-[var(--brass-ink)]">Portofoliu</p>
          <h2 id="portofoliu-titlu" className="display-xl mt-4 text-[clamp(2rem,4.5vw,3.4rem)] text-[var(--ink)]">
            Site-uri livrate clienților
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {portfolioProjects.map((project) => (
              <li key={project.slug}>
                <Link
                  href={`/portofoliu/${project.slug}`}
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass)]"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-[var(--hairline)]">
                    <Image
                      src={project.cover}
                      alt={project.coverAlt}
                      fill
                      sizes="(min-width: 640px) 40vw, 92vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </span>
                  <span className="mt-3 flex items-baseline justify-between gap-4">
                    <span className="font-display text-lg text-[var(--ink)]">{project.name}</span>
                    <span className="mono-label shrink-0 text-[var(--fg-3)]">{project.categoryLabel}</span>
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-[var(--brass-ink)] underline underline-offset-4">
                    Vezi studiul de caz
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Trust: real Google reviews. */}
      <section id="recenzii" aria-labelledby="recenzii-titlu" className="tone-cream py-16 md:py-20">
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

      {/* 7. Free builders vs a site made by us: the honest comparison. */}
      <section aria-labelledby="comparatie-titlu" className="tone-warm border-y border-[var(--hairline)] py-20 md:py-28">
        <div className="studio-container">
          <h2 id="comparatie-titlu" className="display-xl text-[clamp(2rem,4.5vw,3.4rem)] text-[var(--ink)]">
            Site gratuit sau site făcut de noi?
          </h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr>
                  <th scope="col" className="mono-label pb-4 pr-6 font-normal text-[var(--fg-3)]">
                    La ce te uiți
                  </th>
                  <th scope="col" className="mono-label pb-4 pr-6 font-normal text-[var(--fg-3)]">
                    Constructoare gratuite
                  </th>
                  <th scope="col" className="pb-4 font-sans text-sm font-bold text-[var(--ink)]">
                    Site făcut de noi
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) => (
                  <tr key={row.aspect} className="border-t border-[var(--hairline)]">
                    <th scope="row" className="py-4 pr-6 font-sans text-[15px] font-semibold text-[var(--ink)]">
                      {row.aspect}
                    </th>
                    <td className="py-4 pr-6 text-[15px] leading-relaxed text-[var(--fg-2)]">{row.free}</td>
                    <td className="py-4 text-[15px] leading-relaxed text-[var(--ink)]">{row.ours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. FAQ: the objections, answered with facts from the site. */}
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

      {/* 9. Final block: the three-field form and WhatsApp again. */}
      <section id="te-sunam" aria-labelledby="final-titlu" className="tone-dark grain relative scroll-mt-24 py-20 md:py-28">
        <div className="studio-container relative">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <h2 id="final-titlu" className="display-xl text-[clamp(2.2rem,5vw,4rem)] text-[var(--on-dark)]">
                Site-ul gata în {DELIVERY}. Tu decizi dacă îl plătești.
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--on-dark-2)]">
                Lasă-ne numărul și te sunăm. Sau scrie-ne direct pe WhatsApp.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={primaryButtonClass}
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  Scrie-ne pe WhatsApp
                </a>
                <a
                  href={PHONE_HREF}
                  className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[999px] border-[1.5px] border-[var(--hairline-dark)] px-8 py-3.5 font-sans text-[15px] font-bold text-[var(--on-dark)] transition-colors duration-200 hover:border-[var(--on-dark)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brass-lite)] sm:w-auto"
                >
                  <Phone size={18} aria-hidden="true" />
                  Sună-ne
                </a>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[var(--on-dark-2)]">{RESPONSE_MICROCOPY.ro}</p>
            </div>
            <div className="porthole scroll-mt-24 border-[var(--glass-edge)] p-6 md:p-8">
              <h3 className="font-display text-2xl text-[var(--ink)]">Te sunăm noi</h3>
              <CallbackForm projectType="presentation" placement="oferta_final" locale="ro" />
              <p className="mt-5 border-t border-[var(--hairline)] pt-4 text-xs leading-relaxed text-[var(--fg-3)]">
                {offerConditions.ro}
              </p>
            </div>
          </div>
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

      {/* 10. Sticky bar on mobile: WhatsApp and phone, hidden while the form is on screen. */}
      <StickyContactBar
        waHref={WA_HREF}
        hideWhenVisible="#te-sunam"
        labels={{ whatsapp: 'WhatsApp', call: 'Sună-ne' }}
      />
    </main>
  )
}

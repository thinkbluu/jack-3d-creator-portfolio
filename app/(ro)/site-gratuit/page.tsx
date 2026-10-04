import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContestSignupForm from '@/components/ContestSignupForm'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { textLinkClass } from '@/components/form-styles'
import { CLAIM_DAYS, CONTEST_HASHTAG, CONTEST_PATH, PRIZE_VALUE_EUR, RULES_PATH, isContestConfigured, roundEndLabel, roundLabel, roundOf } from '@/lib/contest/config'
import { publicWinners } from '@/lib/contest/service'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, faqNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { FACEBOOK_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/site'

// The current round and the winners list refresh at least once an hour.
export const revalidate = 3600

const ro = {
  title: 'Site gratuit pentru afacerea ta: concurs lunar',
  description: 'Câștigă un site de prezentare gratuit pentru afacerea ta. În fiecare lună, MAST Studio construiește un site pentru postarea cu cele mai multe aprecieri.',
  crumb: 'Site gratuit',
  kicker: 'Concurs lunar · Site gratuit',
  h1: 'Câștigă un site de prezentare gratuit pentru afacerea ta',
  intro:
    'În fiecare lună construim gratuit un site de prezentare pentru o afacere mică din România. Te înscrii aici, postezi pe Instagram sau pe pagina de Facebook a afacerii despre ce faci și de ce ai nevoie de site, ne etichetezi și strângi aprecieri. Postarea cu cele mai multe aprecieri la finalul lunii câștigă.',
  roundBanner: (roundName: string, end: string) => `Runda din ${roundName} se încheie pe ${end}.`,
  howTitle: 'Cum participi',
  steps: [
    'Completează formularul de mai jos și confirmă adresa de e-mail.',
    `Publică o postare despre afacerea ta și despre de ce ai nevoie de site: pe Instagram, din contul afacerii, sau pe pagina de Facebook a afacerii. Etichetează-ne (${INSTAGRAM_HANDLE} pe Instagram, MAST Studio pe Facebook) și folosește ${CONTEST_HASHTAG}.`,
    'Adaugă linkul postării pe pagina ta de participare, până în ultima zi a lunii.',
    'Strânge aprecieri. Postarea cu cele mai multe aprecieri câștigă site-ul.',
  ],
  findBefore: 'Ne găsești pe',
  findMid: 'și pe',
  findAfter: ', unde anunțăm câștigătorii.',
  prizeTitle: 'Ce primește câștigătorul',
  prize: [
    `site de prezentare de până la 5 pagini, în valoare de ${PRIZE_VALUE_EUR} EUR`,
    'design gândit întâi pentru telefon',
    'texte scrise de noi, pe baza informațiilor tale',
    'buton WhatsApp și formular de contact',
    'SEO de bază și instructaj la predare',
  ],
  excludedTitle: 'Ce nu e inclus',
  excluded: ['domeniul și găzduirea, orientativ 50-120 EUR pe an, pe numele afacerii tale', 'mentenanța lunară', 'magazin online sau funcții în plus', 'fotografii profesionale'],
  signupTitle: (roundName: string) => `Înscrie-te în runda din ${roundName}`,
  closedBefore: 'Înscrierile se deschid în curând. Urmărește-ne pe',
  closedMid: 'sau pe',
  closedAfter: 'ca să afli primul.',
  winnersTitle: 'Câștigători',
  seeSite: 'vezi site-ul',
  faqTitle: 'Întrebări frecvente',
  faqs: [
    {
      question: 'Cine poate participa?',
      answer:
        'Orice afacere înregistrată în România (SRL, PFA, întreprindere individuală sau familială, ONG), reprezentată de o persoană de cel puțin 18 ani, care nu a mai lucrat cu MAST Studio. O afacere participă cu o singură postare pe rundă.',
    },
    {
      question: 'Costă ceva participarea?',
      answer: 'Nu. Participarea e gratuită și nu te obligă la nimic. Newsletterul îl primești doar dacă bifezi separat acordul pentru el.',
    },
    {
      question: 'Ce primește câștigătorul?',
      answer: `Un site de prezentare construit de MAST Studio, în valoare de ${PRIZE_VALUE_EUR} EUR: până la 5 pagini, design, texte, versiune pentru telefon, buton WhatsApp, formular de contact și SEO de bază. Domeniul și găzduirea le plătește câștigătorul, orientativ 50-120 EUR pe an.`,
    },
    {
      question: 'Pe ce rețea pot posta?',
      answer: `Pe Instagram, din contul afacerii, sau pe pagina de Facebook a afacerii. Postările de pe profiluri personale de Facebook nu intră în concurs. Postarea trebuie să ne eticheteze și să folosească ${CONTEST_HASHTAG}.`,
    },
    {
      question: 'Cum se numără aprecierile?',
      answer:
        'După finalul lunii numărăm aprecierile afișate public la fiecare postare validă. Câștigă postarea cu cele mai multe aprecieri; la egalitate, cea al cărei link a fost trimis primul. Aprecierile cumpărate sau făcute cu conturi false duc la descalificare.',
    },
    {
      question: 'Când aflu rezultatul?',
      answer: `În primele zile lucrătoare ale lunii următoare. Câștigătorul primește un e-mail și are ${CLAIM_DAYS} zile să confirme premiul; altfel premiul trece la următoarea postare din clasament.`,
    },
    {
      question: 'Ce se întâmplă dacă nu câștig?',
      answer: 'Poți participa din nou în luna următoare, cu o postare nouă. Linkul către pagina ta de participare rămâne valabil.',
    },
  ],
  rulesBefore: 'Condițiile complete sunt în',
  rulesLink: 'regulamentul concursului',
  rulesAfter: '. Concursul nu este sponsorizat, susținut sau administrat de Instagram, Facebook sau Meta.',
}

const en: typeof ro = {
  title: 'A free website for your business: monthly contest',
  description: 'Win a free presentation website for your business. Every month, MAST Studio builds a website for the post with the most likes.',
  crumb: 'Free website',
  kicker: 'Monthly contest · Free website',
  h1: 'Win a free presentation website for your business',
  intro:
    'Every month we build a presentation website, free of charge, for a small business in Romania. You enter here, post on Instagram or on the business’s Facebook page about what you do and why you need a website, tag us and collect likes. The post with the most likes at the end of the month wins.',
  roundBanner: (roundName: string, end: string) => `The ${roundName} round ends on ${end}.`,
  howTitle: 'How to enter',
  steps: [
    'Fill in the form below and confirm your email address.',
    `Publish a post about your business and about why you need a website: on Instagram, from the business account, or on the business’s Facebook page. Tag us (${INSTAGRAM_HANDLE} on Instagram, MAST Studio on Facebook) and use ${CONTEST_HASHTAG}.`,
    'Add the link to the post on your entry page, by the last day of the month.',
    'Collect likes. The post with the most likes wins the website.',
  ],
  findBefore: 'You can find us on',
  findMid: 'and on',
  findAfter: ', where we announce the winners.',
  prizeTitle: 'What the winner receives',
  prize: [
    `a presentation website of up to 5 pages, worth ${PRIZE_VALUE_EUR} EUR`,
    'a design made for phones first',
    'copy written by us, from your information',
    'a WhatsApp button and a contact form',
    'basic SEO and a handover briefing',
  ],
  excludedTitle: 'What is not included',
  excluded: ['the domain and hosting, indicatively 50-120 EUR a year, in your business’s name', 'monthly maintenance', 'an online store or extra features', 'professional photographs'],
  signupTitle: (roundName: string) => `Enter the ${roundName} round`,
  closedBefore: 'Entries open soon. Follow us on',
  closedMid: 'or on',
  closedAfter: 'to be the first to know.',
  winnersTitle: 'Winners',
  seeSite: 'see the website',
  faqTitle: 'Frequently asked questions',
  faqs: [
    {
      question: 'Who can enter?',
      answer:
        'Any business registered in Romania (SRL, PFA, individual or family enterprise, ONG), represented by a person who is at least 18 and who has not worked with MAST Studio before. A business enters with a single post per round.',
    },
    {
      question: 'Does it cost anything to enter?',
      answer: 'No. Entry is free and does not oblige you to anything. You receive the newsletter only if you tick the separate consent for it.',
    },
    {
      question: 'What does the winner receive?',
      answer: `A presentation website built by MAST Studio, worth ${PRIZE_VALUE_EUR} EUR: up to 5 pages, design, copy, a version for phones, a WhatsApp button, a contact form and basic SEO. The winner pays for the domain and hosting, indicatively 50-120 EUR a year.`,
    },
    {
      question: 'Which network can I post on?',
      answer: `On Instagram, from the business account, or on the business’s Facebook page. Posts from personal Facebook profiles do not count. The post must tag us and use ${CONTEST_HASHTAG}.`,
    },
    {
      question: 'How are the likes counted?',
      answer:
        'After the end of the month we count the likes shown publicly on each valid post. The post with the most likes wins; in a tie, the one whose link was submitted first. Bought likes, or likes from fake accounts, lead to disqualification.',
    },
    {
      question: 'When do I find out the result?',
      answer: `In the first working days of the following month. The winner receives an email and has ${CLAIM_DAYS} days to confirm the prize; otherwise the prize passes to the next post in the ranking.`,
    },
    {
      question: 'What happens if I do not win?',
      answer: 'You can enter again the following month, with a new post. The link to your entry page stays valid.',
    },
  ],
  rulesBefore: 'The full conditions are in the',
  rulesLink: 'contest rules',
  rulesAfter: '. The contest is not sponsored, endorsed or administered by Instagram, Facebook or Meta.',
}

const copy = { ro, en }

export function freeWebsiteMetadata(locale: Locale) {
  const t = copy[locale]
  return pageMetadata({ title: t.title, description: t.description, path: localizePath(CONTEST_PATH, locale), locale })
}

export async function FreeWebsiteView({ locale }: { locale: Locale }) {
  const t = copy[locale]
  const path = localizePath(CONTEST_PATH, locale)
  const round = roundOf()
  const configured = isContestConfigured()
  const winners = await publicWinners()
  const roundName = roundLabel(round, locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: t.crumb, path },
  ]

  return (
    <>
      <SiteHeader current="site-gratuit" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container py-12 md:py-20">
          <Breadcrumbs items={crumbs} />

          <header className="mt-6 max-w-3xl">
            <p className="kicker">{t.kicker}</p>
            <h1 className="type-h2 mt-4 text-balance">{t.h1}</h1>
            <p className="type-body mt-6 max-w-2xl">{t.intro}</p>
            <p className="mt-6 inline-flex rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--shell-warm)] px-4 py-2 font-sans text-sm font-semibold text-[var(--ink)]">
              {t.roundBanner(roundName, roundEndLabel(round, locale))}
            </p>
          </header>

          <section aria-labelledby="cum-participi" className="mt-14 max-w-3xl">
            <h2 id="cum-participi" className="type-h3">
              {t.howTitle}
            </h2>
            <ol className="mt-6 flex flex-col gap-5">
              {t.steps.map((step, index) => (
                <li key={step} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full font-sans text-[13px] font-semibold"
                    style={{ background: 'var(--shell-warm)', color: 'var(--brass-ink)', border: '1px solid var(--hairline)' }}
                  >
                    {index + 1}
                  </span>
                  <p className="type-body">{step}</p>
                </li>
              ))}
            </ol>
            <p className="type-body mt-6">
              {t.findBefore}{' '}
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                Instagram
              </a>{' '}
              {t.findMid}{' '}
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                Facebook
              </a>
              {t.findAfter}
            </p>
          </section>

          <section aria-labelledby="ce-primesti" className="mt-14 grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="porthole p-7">
              <h2 id="ce-primesti" className="type-h3">
                {t.prizeTitle}
              </h2>
              <ul className="type-body mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px]">
                {t.prize.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="porthole p-7">
              <h2 className="type-h3">{t.excludedTitle}</h2>
              <ul className="type-body mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px]">
                {t.excluded.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section aria-labelledby="inscriere" className="mt-14 max-w-3xl">
            <h2 id="inscriere" className="type-h3">
              {t.signupTitle(roundName)}
            </h2>
            <div className="mt-6">
              {configured ? (
                <ContestSignupForm />
              ) : (
                <p className="porthole type-body p-7">
                  {t.closedBefore}{' '}
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                    Instagram
                  </a>{' '}
                  {t.closedMid}{' '}
                  <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                    Facebook
                  </a>{' '}
                  {t.closedAfter}
                </p>
              )}
            </div>
          </section>

          {winners.length > 0 ? (
            <section aria-labelledby="castigatori" className="mt-14 max-w-3xl">
              <h2 id="castigatori" className="type-h3">
                {t.winnersTitle}
              </h2>
              <ul className="mt-6 flex flex-col divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
                {winners.map((winner) => (
                  <li key={winner.round} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                    <p className="font-sans text-[15px] font-semibold text-[var(--ink)]">
                      {winner.businessName}, {winner.city}
                    </p>
                    <p className="font-sans text-sm text-[var(--ink-2)]">
                      {roundLabel(winner.round, locale)}
                      {winner.url ? (
                        <>
                          {' · '}
                          <a href={winner.url} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                            {t.seeSite}
                          </a>
                        </>
                      ) : null}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section aria-labelledby="intrebari" className="mt-16 max-w-3xl">
            <h2 id="intrebari" className="type-h3">
              {t.faqTitle}
            </h2>
            <div className="mt-6 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              {t.faqs.map((item) => (
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

          <p className="mt-10 max-w-3xl font-sans text-sm leading-relaxed text-[var(--ink-2)]">
            {t.rulesBefore}{' '}
            <Link href={localizePath(RULES_PATH, locale)} className={textLinkClass}>
              {t.rulesLink}
            </Link>
            {t.rulesAfter}
          </p>
        </div>
      </main>
      <Footer />
      <JsonLd data={graph(webPageNode({ path, name: t.title, description: t.description, breadcrumb: true, locale }), breadcrumbNode(crumbs), faqNode(t.faqs, path))} />
    </>
  )
}

export const metadata = freeWebsiteMetadata('ro')

export default function FreeSitePage() {
  return <FreeWebsiteView locale="ro" />
}

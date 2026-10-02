import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContestSignupForm from '@/components/ContestSignupForm'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { textLinkClass } from '@/components/form-styles'
import { CLAIM_DAYS, CONTEST_HASHTAG, CONTEST_PATH, PRIZE_VALUE_EUR, RULES_PATH, isContestConfigured, roundEndLabel, roundLabel, roundOf } from '@/lib/contest/config'
import { publicWinners } from '@/lib/contest/service'
import { breadcrumbNode, faqNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { FACEBOOK_URL, INSTAGRAM_HANDLE, INSTAGRAM_URL } from '@/lib/site'

// The current round and the winners list refresh at least once an hour.
export const revalidate = 3600

const title = 'Site gratuit pentru afacerea ta: concurs lunar'
const description =
  'Câștigă un site de prezentare gratuit pentru afacerea ta. În fiecare lună, MAST Studio construiește un site pentru postarea cu cele mai multe aprecieri.'

export const metadata = pageMetadata({ title, description, path: CONTEST_PATH })

const crumbs: BreadcrumbItem[] = [
  { name: 'Acasă', path: '/' },
  { name: 'Site gratuit', path: CONTEST_PATH },
]

const faqs = [
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
]

export default async function FreeSitePage() {
  const round = roundOf()
  const configured = isContestConfigured()
  const winners = await publicWinners()

  return (
    <>
      <SiteHeader current="site-gratuit" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <div className="site-container py-12 md:py-20">
          <Breadcrumbs items={crumbs} />

          <header className="mt-6 max-w-3xl">
            <p className="kicker">Concurs lunar · Site gratuit</p>
            <h1 className="type-h2 mt-4 text-balance">Câștigă un site de prezentare gratuit pentru afacerea ta</h1>
            <p className="type-body mt-6 max-w-2xl">
              În fiecare lună construim gratuit un site de prezentare pentru o afacere mică din România. Te înscrii aici, postezi pe Instagram sau pe pagina de Facebook a afacerii despre ce faci și de ce ai nevoie de site, ne etichetezi și strângi aprecieri. Postarea cu cele mai multe aprecieri la finalul lunii câștigă.
            </p>
            <p className="mt-6 inline-flex rounded-[var(--radius-card)] border border-[var(--hairline)] bg-[var(--shell-warm)] px-4 py-2 font-sans text-sm font-semibold text-[var(--ink)]">
              Runda din {roundLabel(round)} se încheie pe {roundEndLabel(round)}.
            </p>
          </header>

          <section aria-labelledby="cum-participi" className="mt-14 max-w-3xl">
            <h2 id="cum-participi" className="type-h3">
              Cum participi
            </h2>
            <ol className="mt-6 flex flex-col gap-5">
              {[
                'Completează formularul de mai jos și confirmă adresa de e-mail.',
                `Publică o postare despre afacerea ta și despre de ce ai nevoie de site: pe Instagram, din contul afacerii, sau pe pagina de Facebook a afacerii. Etichetează-ne (${INSTAGRAM_HANDLE} pe Instagram, MAST Studio pe Facebook) și folosește ${CONTEST_HASHTAG}.`,
                'Adaugă linkul postării pe pagina ta de participare, până în ultima zi a lunii.',
                'Strânge aprecieri. Postarea cu cele mai multe aprecieri câștigă site-ul.',
              ].map((step, index) => (
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
              Ne găsești pe{' '}
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                Instagram
              </a>{' '}
              și pe{' '}
              <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                Facebook
              </a>
              , unde anunțăm câștigătorii.
            </p>
          </section>

          <section aria-labelledby="ce-primesti" className="mt-14 grid max-w-3xl gap-6 md:grid-cols-2">
            <div className="porthole p-7">
              <h2 id="ce-primesti" className="type-h3">
                Ce primește câștigătorul
              </h2>
              <ul className="type-body mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px]">
                <li>site de prezentare de până la 5 pagini, în valoare de {PRIZE_VALUE_EUR} EUR</li>
                <li>design gândit întâi pentru telefon</li>
                <li>texte scrise de noi, pe baza informațiilor tale</li>
                <li>buton WhatsApp și formular de contact</li>
                <li>SEO de bază și instructaj la predare</li>
              </ul>
            </div>
            <div className="porthole p-7">
              <h2 className="type-h3">Ce nu e inclus</h2>
              <ul className="type-body mt-4 flex list-disc flex-col gap-2 pl-5 text-[15px]">
                <li>domeniul și găzduirea, orientativ 50-120 EUR pe an, pe numele afacerii tale</li>
                <li>mentenanța lunară</li>
                <li>magazin online sau funcții în plus</li>
                <li>fotografii profesionale</li>
              </ul>
            </div>
          </section>

          <section aria-labelledby="inscriere" className="mt-14 max-w-3xl">
            <h2 id="inscriere" className="type-h3">
              Înscrie-te în runda din {roundLabel(round)}
            </h2>
            <div className="mt-6">
              {configured ? (
                <ContestSignupForm />
              ) : (
                <p className="porthole type-body p-7">
                  Înscrierile se deschid în curând. Urmărește-ne pe{' '}
                  <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                    Instagram
                  </a>{' '}
                  sau pe{' '}
                  <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                    Facebook
                  </a>{' '}
                  ca să afli primul.
                </p>
              )}
            </div>
          </section>

          {winners.length > 0 ? (
            <section aria-labelledby="castigatori" className="mt-14 max-w-3xl">
              <h2 id="castigatori" className="type-h3">
                Câștigători
              </h2>
              <ul className="mt-6 flex flex-col divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
                {winners.map((winner) => (
                  <li key={winner.round} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between">
                    <p className="font-sans text-[15px] font-semibold text-[var(--ink)]">
                      {winner.businessName}, {winner.city}
                    </p>
                    <p className="font-sans text-sm text-[var(--ink-2)]">
                      {roundLabel(winner.round)}
                      {winner.url ? (
                        <>
                          {' · '}
                          <a href={winner.url} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                            vezi site-ul
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
              Întrebări frecvente
            </h2>
            <div className="mt-6 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              {faqs.map((item) => (
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
            Condițiile complete sunt în{' '}
            <Link href={RULES_PATH} className={textLinkClass}>
              regulamentul concursului
            </Link>
            . Concursul nu este sponsorizat, susținut sau administrat de Instagram, Facebook sau Meta.
          </p>
        </div>
      </main>
      <Footer />
      <JsonLd
        data={graph(
          webPageNode({ path: CONTEST_PATH, name: title, description, breadcrumb: true }),
          breadcrumbNode(crumbs),
          faqNode(faqs, CONTEST_PATH),
        )}
      />
    </>
  )
}

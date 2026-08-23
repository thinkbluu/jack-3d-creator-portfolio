import type { Metadata } from 'next'
import Link from 'next/link'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import { SegmentProvider } from '@/components/SegmentContext'

const siteUrl = 'https://maststudio.ro'

export const metadata: Metadata = {
  title: 'Freelancer, studio sau agenție: cum alegi pentru site-ul tău | MAST Studio',
  description:
    'Comparație onestă între opțiunile de a-ți face un site în România: freelancer, studio mic, agenție mare sau platformă de tip Wix. Prețuri, avantaje și dezavantaje reale.',
  alternates: { canonical: `${siteUrl}/comparatie` },
}

const answerCapsule =
  'Pentru un site simplu sub 500 EUR, un freelancer sau o platformă de tip Wix poate fi suficient. Pentru un site care trebuie să aducă clienți, un studio mic oferă cel mai bun raport între preț și calitate. Agențiile mari sunt potrivite pentru proiecte peste 3.000 EUR care necesită echipă dedicată.'

type ComparisonRow = {
  label: string
  wix: string
  freelancer: string
  studio: string
  agentie: string
}

const comparisonRows: ComparisonRow[] = [
  {
    label: 'Preț tipic',
    wix: '0-30 EUR/lună',
    freelancer: '150-600 EUR',
    studio: '300-2.500 EUR',
    agentie: '3.000-15.000+ EUR',
  },
  {
    label: 'Timp de livrare',
    wix: '1-3 zile (singur)',
    freelancer: '1-3 săptămâni',
    studio: '48h - 3 săptămâni',
    agentie: '1-3 luni',
  },
  {
    label: 'Design personalizat',
    wix: 'Șablon, personalizare limitată',
    freelancer: 'Variază, verifică portofoliul',
    studio: 'Da, construit pentru afacerea ta',
    agentie: 'Da, cu cercetare și strategie',
  },
  {
    label: 'Texte incluse',
    wix: 'Nu, le scrii tu',
    freelancer: 'Rar, de obicei separat',
    studio: 'Adesea inclus sau ghidat',
    agentie: 'Da, echipă de copywriting',
  },
  {
    label: 'Cine te ajută după livrare',
    wix: 'Suport general al platformei',
    freelancer: 'Depinde de disponibilitate',
    studio: 'Contact direct cu cei care au construit',
    agentie: 'Account manager dedicat',
  },
  {
    label: 'Cui i se potrivește',
    wix: 'Testezi o idee, buget minim',
    freelancer: 'Proiect simplu, buget mic, riști calitatea',
    studio: 'Afacere mică-mijlocie, vrei rezultate rapid',
    agentie: 'Proiect complex, brand mare, echipă internă',
  },
]

const wixSituations = [
  'Testezi o idee de afacere și nu știi încă dacă va funcționa.',
  'Ai nevoie doar de o pagină cu informații de bază: nume, contact, program.',
  'Bugetul e sub 300 EUR și accepți să investești timp propriu pentru a-l construi.',
  'Ești confortabil să înveți o unealtă nouă și să faci singur mentenanța.',
]

const freelancerSituations = [
  'Ai deja un proiect clar definit, cu specificații scrise.',
  'Ai lucrat cu freelancerul respectiv sau ai referințe verificate de la clienți reali.',
  'Bugetul e limitat, dar accepți riscul unei comunicări mai puțin structurate sau al termenelor variabile.',
  'Nu ai nevoie de garanții contractuale extinse sau de suport pe termen lung.',
]

const studioSituations = [
  'Vrei un site care trebuie să aducă efectiv clienți, nu doar să existe online.',
  'Ai nevoie de un termen de livrare previzibil și un preț fix, fără negocieri lungi.',
  'Preferi să discuți direct cu cei care construiesc site-ul, fără intermediari.',
  'Bugetul tău e între 300 și 3.000 EUR — sub asta, o platformă poate fi suficientă; peste asta, o agenție are sens dacă ai nevoie de echipă dedicată.',
]

const agencySituations = [
  'Proiectul are cerințe complexe: multiple integrări, echipe interne care trebuie coordonate, cercetare de piață extinsă.',
  'Bugetul e peste 3.000-5.000 EUR și ai nevoie de o echipă dedicată pe toată durata proiectului, nu de un singur furnizor.',
  'Ai nevoie de servicii conexe pe scară largă: campanii media, strategie de brand, structuri de raportare pentru un consiliu.',
]

const agencyNotFit = [
  'Dacă vrei un site simplu de prezentare livrat rapid, o agenție mare aduce costuri și proceduri disproporționate față de nevoie.',
  'Dacă bugetul tău e sub 3.000 EUR, majoritatea agențiilor mari nici nu vor accepta proiectul sau vor livra un rezultat sub-dimensionat pentru procesul lor standard.',
]

const faqItems = [
  {
    question: 'Care e cea mai ieftină opțiune pentru un site?',
    answer:
      'O platformă de tip Wix sau Shopify, construită singur, costă doar abonamentul lunar (0-30 EUR). Dar timpul tău are cost, iar rezultatul depinde de cât de mult înveți să folosești unealta.',
  },
  {
    question: 'Când nu are sens să lucrezi cu MAST Studio?',
    answer:
      'Dacă bugetul tău e sub 300 EUR, o platformă de tip Wix e probabil suficientă. Dacă proiectul e complex și necesită o echipă dedicată permanentă, mai degrabă decât un furnizor cu proces fix, o agenție mare e alegerea corectă, nu un studio mic.',
  },
  {
    question: 'De ce ar costa un freelancer mai puțin decât un studio, dar riscul e mai mare?',
    answer:
      'Un freelancer individual are costuri fixe mai mici, dar și mai puțină redundanță: dacă se îmbolnăvește, își schimbă prioritățile sau abandonează proiectul, nu ai plan de rezervă. Un studio mic, chiar dacă e format din puțini oameni, are un proces documentat și continuitate.',
  },
  {
    question: 'O agenție mare oferă neapărat calitate mai bună?',
    answer:
      'Nu neapărat mai bună — oferă altceva: echipă mai mare, procese de management de proiect mai formale și capacitate de a gestiona cerințe complexe. Pentru un site simplu, aceste avantaje nu se traduc automat în rezultat vizibil mai bun, dar costă semnificativ mai mult.',
  },
  {
    question: 'Pot trece de la o platformă tip Wix la un studio mai târziu?',
    answer:
      'Da. Mulți clienți își testează ideea pe o platformă, iar când afacerea crește și au nevoie de un site care convertește mai bine sau de funcționalități personalizate, migrează către un studio sau o soluție construită de la zero.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}

function HonestList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-2">
      {items.map((item) => (
        <li key={item} className="type-body flex items-start gap-3">
          <span aria-hidden="true" className="mt-[10px] size-1.5 shrink-0 rounded-full" style={{ background: 'var(--brass)' }} />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function ComparisonPage() {
  return (
    <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <header className="border-b border-[var(--hairline)]">
        <nav aria-label="Navigație principală" className="site-container flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-[22px] bg-[var(--brass)]"
              style={{
                mask: "url('/icons/mast-mark.svg') center / contain no-repeat",
                WebkitMask: "url('/icons/mast-mark.svg') center / contain no-repeat",
              }}
            />
            <span className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-semibold">MAST</span>
              <span className="font-sans text-[10px] font-medium tracking-[.28em]">STUDIO</span>
            </span>
          </Link>
          <Link href="/" className="font-sans text-xs uppercase tracking-[0.16em] text-[var(--ink-2)] hover:text-[var(--ink)]">
            Înapoi la site
          </Link>
        </nav>
      </header>

      <article className="site-container py-16 md:py-24">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-2xl font-sans text-xs text-[var(--ink-3)]">
          <Link href="/" className="hover:text-[var(--ink)]">Acasă</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--ink)]">Freelancer, studio sau agenție</span>
        </nav>

        <header className="mx-auto mt-6 max-w-2xl">
          <p className="kicker">Comparație</p>
          <h1 className="type-h2 mt-4 text-balance">Freelancer, studio, agenție sau platformă: cum alegi</h1>
        </header>

        <div className="mx-auto mt-8 max-w-2xl">
          <p className="kicker">Pe scurt</p>
          <div
            className="type-body mt-3 text-[17px] font-medium text-[var(--ink)]"
            style={{
              background: 'var(--shell-warm)',
              borderLeft: '3px solid var(--brass)',
              borderRadius: 'var(--radius-card)',
              padding: '20px 24px',
              marginBottom: '32px',
            }}
          >
            {answerCapsule}
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <section className="mt-12">
            <h2 className="type-h3">Tabel comparativ</h2>
            <div className="prose mt-6">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Criteriu</th>
                    <th scope="col">Platformă tip Wix</th>
                    <th scope="col">Freelancer</th>
                    <th scope="col">Studio mic</th>
                    <th scope="col">Agenție mare</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td>{row.wix}</td>
                      <td>{row.freelancer}</td>
                      <td>{row.studio}</td>
                      <td>{row.agentie}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Când e suficientă o platformă de tip Wix sau Shopify</h2>
            <p className="type-body mt-4">
              O platformă de tip Wix, Shopify sau Squarespace înseamnă abonament lunar mic și control total, dar tu ești cel care construiește și întreține site-ul. E o alegere onestă și corectă în anumite situații:
            </p>
            <HonestList items={wixSituations} />
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Când merită un freelancer</h2>
            <p className="type-body mt-4">
              Un freelancer individual poate livra la un preț mai mic decât un studio, dar cu variabilitate mai mare în calitate și disponibilitate. Merită luat în calcul atunci când:
            </p>
            <HonestList items={freelancerSituations} />
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Când merită un studio mic</h2>
            <p className="type-body mt-4">
              Un studio mic, așa cum e MAST Studio, oferă un echilibru între prețul unui freelancer și structura unei agenții: proces documentat, termen de livrare fix și contact direct cu cei care construiesc efectiv site-ul. Are sens atunci când:
            </p>
            <HonestList items={studioSituations} />
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Când ai nevoie de o agenție mare</h2>
            <p className="type-body mt-4">
              Agențiile mari au echipe extinse și procese formale de management de proiect, potrivite pentru cerințe complexe. Are sens să alegi o agenție mare atunci când:
            </p>
            <HonestList items={agencySituations} />
            <p className="type-body mt-6 font-semibold text-[var(--ink)]">Și când o agenție mare nu e alegerea potrivită:</p>
            <HonestList items={agencyNotFit} />
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Întrebări frecvente</h2>
            <div className="mt-6 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              {faqItems.map((item) => (
                <details key={item.question} className="faq-item group py-5">
                  <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 font-sans font-semibold [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <span
                      className="faq-icon flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink)]"
                      aria-hidden="true"
                    >
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 0V11M0 5.5H11" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 font-sans text-sm leading-relaxed text-[var(--ink-2)]">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <section className="porthole mx-auto mt-16 flex max-w-2xl flex-col items-start gap-5 border-[var(--glass-edge)] p-7">
          <p className="type-h3">Dacă un studio mic e alegerea potrivită pentru tine</p>
          <SegmentProvider>
            <ContactButton hero label="Cere ofertă pe WhatsApp" />
          </SegmentProvider>
        </section>
      </article>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <Footer />
    </main>
  )
}

import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
import { breadcrumbNode, faqNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

const path = '/comparatie'
const description =
  'Freelancer, studio mic, agenție sau Wix? Comparație onestă pentru un site de firmă în România: prețuri, termene, riscuri tipice și când merită fiecare.'

export const metadata = pageMetadata({
  title: 'Freelancer, studio sau agenție: cum alegi',
  description,
  path,
})

const crumbs: BreadcrumbItem[] = [
  { name: 'Acasă', path: '/' },
  { name: 'Freelancer, studio sau agenție', path },
]

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
    studio: '300-3.000 EUR',
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

const typicalRisks = [
  {
    option: 'Platformă de tip Wix',
    risk: 'Economisești acum, dar riști un site lent și greu de întreținut, pe care îl refaci peste un an.',
  },
  {
    option: 'Freelancer',
    risk: 'Poate livra excelent. Riscul tipic: dispare după lansare, nu documentează accesele sau ține site-ul pe contul lui. Cere predare scrisă.',
  },
  {
    option: 'Studio mic',
    risk: 'Dacă studioul nu are portofoliu live sau un preț „de la” scris, e doar un freelancer cu alt nume. Verifică proiecte reale.',
  },
  {
    option: 'Agenție mare',
    risk: 'Poate livra proiecte mari. Riscul tipic: plătești coordonare, prezentări și timp de așteptare pentru un site care putea fi un livrabil simplu.',
  },
]

const questionsBeforeDeposit = [
  'Cine deține domeniul și găzduirea: tu sau furnizorul?',
  'Termenul pornește după ce trimiți materialele sau „când apucăm”?',
  'Ce e inclus în preț și ce se plătește separat?',
  'Cine răspunde după lansare dacă site-ul nu mai merge?',
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
    question: 'Ce este un studio de web design?',
    answer:
      'O echipă mică specializată pe site-uri și produse digitale: mai structurată decât un freelancer care lucrează singur și mai ușoară decât o agenție full-service, cu account manageri și prezentări lungi.',
  },
  {
    question: 'Care e riscul tipic când lucrezi cu un freelancer?',
    answer:
      'Dispariția după lansare, lipsa unei copii de siguranță pentru găzduire și domeniu și o proprietate neclară asupra site-ului. Cere în scris cine deține domeniul, cine are accesele și ce se întâmplă dacă proiectul se blochează.',
  },
  {
    question: 'Pot trece de la o platformă tip Wix la un studio mai târziu?',
    answer:
      'Da. Mulți clienți își testează ideea pe o platformă, iar când afacerea crește și au nevoie de un site care convertește mai bine sau de funcționalități personalizate, migrează către un studio sau o soluție construită de la zero.',
  },
]

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
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <article className="site-container py-12 md:py-20">
        <Breadcrumbs items={crumbs} className="mx-auto max-w-2xl" />

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
            <h2 className="type-h3">Ce riscuri apar des la fiecare alegere</h2>
            <dl className="mt-4 flex flex-col gap-4">
              {typicalRisks.map((item) => (
                <div key={item.option}>
                  <dt className="font-sans font-semibold text-[var(--ink)]">{item.option}</dt>
                  <dd className="type-body mt-1">{item.risk}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Patru întrebări de pus înainte de avans</h2>
            <p className="type-body mt-4">Indiferent pe cine alegi, cere răspunsul în scris:</p>
            <ol className="type-body mt-4 flex list-decimal flex-col gap-2 pl-5">
              {questionsBeforeDeposit.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
            <p className="type-body mt-4">
              Pentru o listă mai completă, citește{' '}
              <Link href="/blog/cum-alegi-firma-web-design" className="font-semibold text-[var(--ink)] underline underline-offset-4">
                cum alegi o firmă de web design: 7 întrebări de pus
              </Link>
              .
            </p>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Unde se încadrează MAST Studio</h2>
            <p className="type-body mt-4">
              Suntem un studio mic din Timișoara, parte din MAST Consult S.R.L. Lucrăm cu afaceri care vor un site clar, cu preț la vedere și un singur interlocutor: {' '}
              <Link href="/servicii/site-de-prezentare" className="font-semibold text-[var(--ink)] underline underline-offset-4">site de prezentare</Link>{' '}
              de la 300 EUR, live în 48 de ore după materiale,{' '}
              <Link href="/servicii/magazin-online" className="font-semibold text-[var(--ink)] underline underline-offset-4">magazin online</Link>{' '}
              de la 900 EUR și{' '}
              <Link href="/servicii/mentenanta" className="font-semibold text-[var(--ink)] underline underline-offset-4">mentenanță</Link>{' '}
              de la 90 EUR pe lună. Avansul este de 50 EUR, iar restul îl plătești doar dacă ești mulțumit.
            </p>
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
          <h2 className="type-h3">Dacă un studio mic e alegerea potrivită pentru tine</h2>
          <SegmentProvider>
            <ContactButton hero label="Cere ofertă pe WhatsApp" />
          </SegmentProvider>
        </section>
      </article>

      </main>
      <Footer />
      <JsonLd
        data={graph(
          webPageNode({ path, name: 'Freelancer, studio, agenție sau platformă: cum alegi', description, breadcrumb: true }),
          breadcrumbNode(crumbs),
          faqNode(faqItems, path),
        )}
      />
    </>
  )
}

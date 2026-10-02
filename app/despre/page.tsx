import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
import { breadcrumbNode, businessRef, faqNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { EMAIL, EMAIL_HREF, LEGAL_NAME, PHONE_DISPLAY, PHONE_HREF, TRADE_REGISTER_NUMBER, VAT_ID } from '@/lib/site'

const path = '/despre'
const description =
  'MAST Studio e un studio de web design din Timișoara, parte din MAST Consult S.R.L. Construim site-uri, magazine online și platforme pentru firme din România.'

export const metadata = pageMetadata({
  title: 'Despre noi: studio de web design din Timișoara',
  description,
  path,
})

const crumbs: BreadcrumbItem[] = [
  { name: 'Acasă', path: '/' },
  { name: 'Despre', path },
]

const answerCapsule =
  'MAST Studio este un studio de web design din Timișoara, România, parte din MAST Consult S.R.L. Construiește site-uri de prezentare, magazine online, aplicații web și platforme pentru afaceri mici și mijlocii din România și internațional. Site de prezentare de la 300 EUR, livrat în 48 de ore.'

const workSteps = [
  {
    title: 'Ne scrii pe WhatsApp sau e-mail',
    text: 'În două fraze ne spui ce faci și ce vrei. În aceeași zi primești o ofertă cu preț fix și lista scurtă de materiale de care avem nevoie de la tine.',
  },
  {
    title: 'Trimiți materialele de bază',
    text: 'Texte, poze, siglă, ce ai deja. Nu trebuie să vină perfecte. Din momentul în care le primim, pornește termenul de livrare.',
  },
  {
    title: 'Construim și îți trimitem un link live',
    text: 'Vezi site-ul funcțional, nu un mockup. Îl testezi, îl arăți cui vrei și ceri modificări dacă e nevoie.',
  },
  {
    title: 'Plătești restul și primești predarea completă',
    text: 'Avansul de 50 EUR se scade din preț, iar restul îl plătești doar dacă ești mulțumit de rezultat. Primești accesele, documentația și un scurt instructaj de folosire.',
  },
]

const clientTypes = [
  'Cabinete medicale și clinici veterinare',
  'Saloane, clinici de înfrumusețare și studiouri de wellness',
  'Firme de servicii (contabilitate, juridic, consultanță, construcții)',
  'Comercianți și magazine care vor și un magazin online',
  'Instituții și organizații care au nevoie de un site instituțional',
]

const faqItems = [
  {
    question: 'Cât costă un site construit de MAST Studio?',
    answer:
      'Un site de prezentare începe de la 300 EUR și se livrează în 48 de ore. Un magazin online începe de la 900 EUR. Aplicațiile și platformele personalizate au preț stabilit după o discuție scurtă despre cerințe, cu ofertă în 24 de ore.',
  },
  {
    question: 'De ce este site-ul de prezentare atât de ieftin față de alte studiouri?',
    answer:
      'Lucrăm cu puține proiecte simultan și avem un proces fix, repetabil, fără etape inutile. Nu ai un account manager care intermediază, discuți direct cu cei care construiesc site-ul.',
  },
  {
    question: 'MAST Studio lucrează doar cu afaceri din Timișoara?',
    answer:
      'Nu. Suntem din Timișoara, dar lucrăm de la distanță cu clienți din toată România, iar procesul nostru e construit special pentru asta, fără nicio întâlnire față în față necesară.',
  },
  {
    question: 'Cine deține codul și conținutul site-ului după livrare?',
    answer:
      'Tu. La predare primești toate accesele (domeniu, hosting, cod) și documentația necesară. Site-ul e al tău din prima zi și poți continua fără noi, dacă alegi asta.',
  },
  {
    question: 'Ce se întâmplă după lansare, oferiți mentenanță?',
    answer:
      'Da. Mentenanța pornește de la 90 EUR pe lună, fără contract pe termen lung, și acoperă actualizări, backup și mici modificări. Poți continua și singur, folosind instructajul primit la predare.',
  },
]

export default function AboutPage() {
  return (
    <>
      <SiteHeader current="despre" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <article className="site-container py-12 md:py-20">
        <header className="mx-auto max-w-2xl">
          <Breadcrumbs items={crumbs} />
          <p className="kicker mt-6">Despre studio</p>
          <h1 className="type-h2 mt-4 text-balance">Despre MAST Studio</h1>
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
            <h2 className="type-h3">Ce face MAST Studio</h2>
            <p className="type-body mt-4">
              Construim site-uri de prezentare, magazine online, aplicații web și platforme personalizate pentru afaceri mici și mijlocii. Un site de prezentare standard se livrează în 48 de ore de la primirea materialelor, de la 300 EUR. Un magazin online, cu catalog de produse și plăți online, începe de la 900 EUR. Pentru aplicații și platforme cu cerințe specifice — programări, portaluri de clienți, integrări cu alte sisteme — stabilim preț și termen după o discuție scurtă, cu ofertă în 24 de ore.
            </p>
            <p className="type-body mt-4">
              Fiecare proiect trece prin același proces: analiză, structură, texte, design, testare, lansare. Nu folosim șabloane generice; site-ul e construit în jurul a ce vinde afacerea ta, nu invers.
            </p>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Unde lucrează MAST Studio</h2>
            <p className="type-body mt-4">
              Suntem din Timișoara și lucrăm la distanță, fără un birou deschis publicului. Colaborăm cu afaceri din oraș și din toată regiunea de vest a României, dar procesul nostru e construit pentru lucrul la distanță: acoperim clienți din toată România și, la cerere, proiecte pentru companii din afara țării.
            </p>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Cum lucrează MAST Studio</h2>
            <ol className="mt-6 flex flex-col gap-6">
              {workSteps.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full font-sans text-[13px] font-semibold"
                    style={{ background: 'var(--shell-warm)', color: 'var(--brass-ink)', border: '1px solid var(--hairline)' }}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-sans text-[15px] font-semibold text-[var(--ink)]">{step.title}</h3>
                    <p className="type-body mt-1 text-[15px]">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Cine este în spatele MAST Studio</h2>
            <p className="type-body mt-4">
              MAST Studio este divizia de web design a MAST Consult S.R.L., firmă de consultanță din Timișoara, CUI RO49626121. Echipa a lucrat cu afaceri mici și mijlocii din România la digitalizare și prezență online și a construit MAST Studio pentru a livra site-uri fără costurile și birocrația unei agenții mari: un singur punct de contact, un proces fix și predare completă la final.
            </p>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Date de identificare</h2>
            <dl className="type-body mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
              <dt className="font-semibold text-[var(--ink)]">Firmă</dt>
              <dd>{LEGAL_NAME}</dd>
              <dt className="font-semibold text-[var(--ink)]">CUI</dt>
              <dd>{VAT_ID}</dd>
              <dt className="font-semibold text-[var(--ink)]">Reg. Com.</dt>
              <dd>{TRADE_REGISTER_NUMBER}</dd>
              <dt className="font-semibold text-[var(--ink)]">Telefon</dt>
              <dd>
                <a href={PHONE_HREF} className="underline-offset-4 hover:underline">{PHONE_DISPLAY}</a>
              </dd>
              <dt className="font-semibold text-[var(--ink)]">E-mail</dt>
              <dd>
                <a href={EMAIL_HREF} className="underline-offset-4 hover:underline">{EMAIL}</a>
              </dd>
            </dl>
            <p className="type-body mt-4">
              Toate canalele de contact sunt pe pagina de{' '}
              <Link href="/contact" className="font-semibold text-[var(--ink)] underline underline-offset-4">contact</Link>.
            </p>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Cu ce tipuri de clienți lucrează</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {clientTypes.map((item) => (
                <li key={item} className="type-body flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[10px] size-1.5 shrink-0 rounded-full" style={{ background: 'var(--brass)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">Întrebări frecvente despre studio</h2>
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
          <h2 className="type-h3">Vrei să discutăm despre proiectul tău?</h2>
          <SegmentProvider>
            <ContactButton hero label="Cere ofertă pe WhatsApp" />
          </SegmentProvider>
        </section>
      </article>

      </main>
      <Footer />
      <JsonLd
        data={graph(
          webPageNode({ path, name: 'Despre MAST Studio', description, type: 'AboutPage', breadcrumb: true, mainEntity: businessRef }),
          breadcrumbNode(crumbs),
          faqNode(faqItems, path),
        )}
      />
    </>
  )
}

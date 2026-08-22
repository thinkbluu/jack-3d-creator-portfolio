import type { Metadata } from 'next'
import Link from 'next/link'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import { SegmentProvider } from '@/components/SegmentContext'

const siteUrl = 'https://maststudio.ro'

export const metadata: Metadata = {
  title: 'Despre MAST Studio | Studio de web design din Timișoara',
  description:
    'MAST Studio este un studio de web design din Timișoara, parte din MAST Consult S.R.L. Construim site-uri, magazine online și platforme pentru afaceri din România.',
  alternates: { canonical: `${siteUrl}/despre` },
}

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
    text: 'Plata se face în avans parțial la început și restul la livrare. Primești accesele, documentația și un scurt instructaj de folosire.',
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
      'Nu. Suntem cu sediul în Timișoara, dar lucrăm de la distanță cu clienți din toată România, iar procesul nostru e construit special pentru asta, fără nicio întâlnire față în față necesară.',
  },
  {
    question: 'Cine deține codul și conținutul site-ului după livrare?',
    answer:
      'Tu. La predare primești toate accesele (domeniu, hosting, cod) și documentația necesară. Site-ul e al tău din prima zi și poți continua fără noi, dacă alegi asta.',
  },
  {
    question: 'Ce se întâmplă după lansare, oferiți mentenanță?',
    answer:
      'Da, la cerere. Poți continua singur folosind instructajul primit la predare sau poți opta pentru un abonament de mentenanță și modificări ulterioare, discutat separat de la caz la caz.',
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

export default function AboutPage() {
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
        <header className="mx-auto max-w-2xl">
          <p className="kicker">Despre studio</p>
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
            <h2 className="type-h3">Unde este MAST Studio</h2>
            <p className="type-body mt-4">
              Sediul MAST Studio este în Timișoara, județul Timiș. De aici lucrăm cu afaceri din oraș și din toată regiunea de vest a României, dar procesul nostru e construit pentru colaborare la distanță: acoperim clienți din toată România și, la cerere, proiecte pentru companii din afara țării.
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
                    style={{ background: 'var(--shell-warm)', color: 'var(--brass)', border: '1px solid var(--hairline)' }}
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
              MAST Studio este divizia de web design a MAST Consult S.R.L., firmă de consultanță cu sediul în Timișoara, CUI RO49626121. Echipa a lucrat cu afaceri mici și mijlocii din România la digitalizare și prezență online și a construit MAST Studio pentru a livra site-uri fără costurile și birocrația unei agenții mari: un singur punct de contact, un proces fix și predare completă la final.
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
          <p className="type-h3">Vrei să discutăm despre proiectul tău?</p>
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

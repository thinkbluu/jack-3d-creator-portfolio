import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
import { localizePath } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/locale'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, businessRef, faqNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { EMAIL, EMAIL_HREF, LEGAL_NAME, PHONE_DISPLAY, PHONE_HREF, TRADE_REGISTER_NUMBER, VAT_ID } from '@/lib/site'

const about = {
  ro: {
    title: 'Despre noi: studio de web design din Timișoara',
    description:
      'MAST Studio e un studio de web design din Timișoara, parte din MAST Consult S.R.L. Construim site-uri, magazine online și platforme pentru firme din România.',
    name: 'Despre MAST Studio',
    kicker: 'Despre studio',
    inShort: 'Pe scurt',
    capsule:
      'MAST Studio este un studio de web design din Timișoara, România, parte din MAST Consult S.R.L. Construiește site-uri de prezentare, magazine online, aplicații web și platforme pentru afaceri mici și mijlocii din România și internațional. Site de prezentare de la 300 EUR, livrat în 48 de ore.',
    whatTitle: 'Ce face MAST Studio',
    what: [
      'Construim site-uri de prezentare, magazine online, aplicații web și platforme personalizate pentru afaceri mici și mijlocii. Un site de prezentare standard se livrează în 48 de ore de la primirea materialelor, de la 300 EUR. Un magazin online, cu catalog de produse și plăți online, începe de la 900 EUR. Pentru aplicații și platforme cu cerințe specifice — programări, portaluri de clienți, integrări cu alte sisteme — stabilim preț și termen după o discuție scurtă, cu ofertă în 24 de ore.',
      'Fiecare proiect trece prin același proces: analiză, structură, texte, design, testare, lansare. Nu folosim șabloane generice; site-ul e construit în jurul a ce vinde afacerea ta, nu invers.',
    ],
    whereTitle: 'Unde lucrează MAST Studio',
    where:
      'Suntem din Timișoara și lucrăm la distanță, fără un birou deschis publicului. Colaborăm cu afaceri din oraș și din toată regiunea de vest a României, dar procesul nostru e construit pentru lucrul la distanță: acoperim clienți din toată România și, la cerere, proiecte pentru companii din afara țării.',
    howTitle: 'Cum lucrează MAST Studio',
    steps: [
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
    ],
    whoTitle: 'Cine este în spatele MAST Studio',
    who: 'MAST Studio este divizia de web design a MAST Consult S.R.L., firmă de consultanță din Timișoara, CUI RO49626121. Echipa a lucrat cu afaceri mici și mijlocii din România la digitalizare și prezență online și a construit MAST Studio pentru a livra site-uri fără costurile și birocrația unei agenții mari: un singur punct de contact, un proces fix și predare completă la final.',
    idTitle: 'Date de identificare',
    company: 'Firmă',
    cui: 'CUI',
    register: 'Reg. Com.',
    phone: 'Telefon',
    email: 'E-mail',
    channelsBefore: 'Toate canalele de contact sunt pe pagina de',
    channelsLink: 'contact',
    channelsAfter: '.',
    clientsTitle: 'Cu ce tipuri de clienți lucrează',
    clients: [
      'Cabinete medicale și clinici veterinare',
      'Saloane, clinici de înfrumusețare și studiouri de wellness',
      'Firme de servicii (contabilitate, juridic, consultanță, construcții)',
      'Comercianți și magazine care vor și un magazin online',
      'Instituții și organizații care au nevoie de un site instituțional',
    ],
    faqTitle: 'Întrebări frecvente despre studio',
    faq: [
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
    ],
    cta: 'Vrei să discutăm despre proiectul tău?',
  },
  en: {
    title: 'About us: a web design studio in Timișoara',
    description:
      'MAST Studio is a web design studio in Timișoara, part of MAST Consult S.R.L. We build websites, online stores and platforms for companies in Romania.',
    name: 'About MAST Studio',
    kicker: 'About the studio',
    inShort: 'In short',
    capsule:
      'MAST Studio is a web design studio in Timișoara, Romania, part of MAST Consult S.R.L. It builds presentation websites, online stores, web apps and platforms for small and medium-sized businesses in Romania and abroad. Presentation websites from 300 EUR, delivered in 48 hours.',
    whatTitle: 'What MAST Studio does',
    what: [
      'We build presentation websites, online stores, web apps and custom platforms for small and medium-sized businesses. A standard presentation website is delivered in 48 hours from the moment we have the materials, from 300 EUR. An online store, with a product catalogue and online payments, starts at 900 EUR. For apps and platforms with specific requirements — bookings, client portals, integrations with other systems — we set the price and the timeline after a short conversation, with a quote in 24 hours.',
      'Every project goes through the same process: analysis, structure, copy, design, testing, launch. We don’t use generic templates. The website is built around what your business sells, not the other way around.',
    ],
    whereTitle: 'Where MAST Studio works',
    where:
      'We are based in Timișoara and we work remotely, with no office open to the public. We work with businesses in the city and across the west of Romania, and the process is built for remote work: we cover clients across Romania and, on request, projects for companies outside the country.',
    howTitle: 'How MAST Studio works',
    steps: [
      {
        title: 'You write to us on WhatsApp or email',
        text: 'In two sentences you tell us what you do and what you want. The same day you get a fixed-price quote and a short list of the materials we need from you.',
      },
      {
        title: 'You send the basic materials',
        text: 'Text, photos, a logo, whatever you already have. They don’t have to be perfect. The delivery clock starts the moment we receive them.',
      },
      {
        title: 'We build it and send you a live link',
        text: 'You see a working website, not a mockup. You test it, show it to whoever you want, and ask for changes if you need them.',
      },
      {
        title: 'You pay the rest and get a full handover',
        text: 'The 50 EUR deposit comes off the price, and you pay the rest only if you’re happy with the result. You get the access, the documentation, and a short walkthrough of how to use it.',
      },
    ],
    whoTitle: 'Who is behind MAST Studio',
    who: 'MAST Studio is the web design division of MAST Consult S.R.L., a consultancy in Timișoara, CUI RO49626121. The team has worked with small and medium-sized businesses in Romania on digitalisation and their online presence, and built MAST Studio to deliver websites without the cost and the bureaucracy of a large agency: one point of contact, a fixed process, and a full handover at the end.',
    idTitle: 'Company details',
    company: 'Company',
    cui: 'CUI',
    register: 'Trade reg.',
    phone: 'Phone',
    email: 'Email',
    channelsBefore: 'Every way to reach us is on the',
    channelsLink: 'contact',
    channelsAfter: ' page.',
    clientsTitle: 'The kinds of clients we work with',
    clients: [
      'Medical practices and veterinary clinics',
      'Salons, beauty clinics and wellness studios',
      'Service firms (accounting, legal, consultancy, construction)',
      'Retailers and shops that also want an online store',
      'Institutions and organisations that need an institutional website',
    ],
    faqTitle: 'Frequently asked questions about the studio',
    faq: [
      {
        question: 'How much does a website built by MAST Studio cost?',
        answer:
          'A presentation website starts at 300 EUR and is delivered in 48 hours. An online store starts at 900 EUR. Custom apps and platforms are priced after a short conversation about the requirements, with a quote in 24 hours.',
      },
      {
        question: 'Why is the presentation website so much cheaper than at other studios?',
        answer:
          'We take few projects at once and we have a fixed, repeatable process, with no wasted stages. There is no account manager in the middle. You talk directly to the people who build the website.',
      },
      {
        question: 'Does MAST Studio only work with businesses in Timișoara?',
        answer:
          'No. We are based in Timișoara, but we work remotely with clients across Romania, and the process is built for that, with no face-to-face meeting required.',
      },
      {
        question: 'Who owns the code and the content after delivery?',
        answer:
          'You do. At handover you get all the access (domain, hosting, code) and the documentation you need. The website is yours from day one, and you can carry on without us if you choose to.',
      },
      {
        question: 'What happens after launch? Do you offer maintenance?',
        answer:
          'Yes. Maintenance starts at 90 EUR a month, with no long-term contract, and covers updates, backups and small changes. You can also carry on by yourself, using the walkthrough you get at handover.',
      },
    ],
    cta: 'Want to talk about your project?',
  },
}

export function aboutMetadata(locale: Locale = 'ro') {
  const copy = about[locale]
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: localizePath('/despre', locale),
    locale,
  })
}

export function AboutView({ locale }: { locale: Locale }) {
  const copy = about[locale]
  const path = localizePath('/despre', locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: ui[locale].nav.about, path },
  ]

  return (
    <>
      <SiteHeader current="despre" />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <article className="site-container py-12 md:py-20">
        <header className="mx-auto max-w-2xl">
          <Breadcrumbs items={crumbs} />
          <p className="kicker mt-6">{copy.kicker}</p>
          <h1 className="type-h2 mt-4 text-balance">{copy.name}</h1>
        </header>

        <div className="mx-auto mt-8 max-w-2xl">
          <p className="kicker">{copy.inShort}</p>
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
            {copy.capsule}
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <section className="mt-12">
            <h2 className="type-h3">{copy.whatTitle}</h2>
            {copy.what.map((paragraph) => (
              <p key={paragraph} className="type-body mt-4">
                {paragraph}
              </p>
            ))}
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">{copy.whereTitle}</h2>
            <p className="type-body mt-4">{copy.where}</p>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">{copy.howTitle}</h2>
            <ol className="mt-6 flex flex-col gap-6">
              {copy.steps.map((step, index) => (
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
            <h2 className="type-h3">{copy.whoTitle}</h2>
            <p className="type-body mt-4">{copy.who}</p>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">{copy.idTitle}</h2>
            <dl className="type-body mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
              <dt className="font-semibold text-[var(--ink)]">{copy.company}</dt>
              <dd>{LEGAL_NAME}</dd>
              <dt className="font-semibold text-[var(--ink)]">{copy.cui}</dt>
              <dd>{VAT_ID}</dd>
              <dt className="font-semibold text-[var(--ink)]">{copy.register}</dt>
              <dd>{TRADE_REGISTER_NUMBER}</dd>
              <dt className="font-semibold text-[var(--ink)]">{copy.phone}</dt>
              <dd>
                <a href={PHONE_HREF} className="underline-offset-4 hover:underline">{PHONE_DISPLAY}</a>
              </dd>
              <dt className="font-semibold text-[var(--ink)]">{copy.email}</dt>
              <dd>
                <a href={EMAIL_HREF} className="underline-offset-4 hover:underline">{EMAIL}</a>
              </dd>
            </dl>
            <p className="type-body mt-4">
              {copy.channelsBefore}{' '}
              <Link href={localizePath('/contact', locale)} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                {copy.channelsLink}
              </Link>
              {copy.channelsAfter}
            </p>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">{copy.clientsTitle}</h2>
            <ul className="mt-4 flex flex-col gap-2">
              {copy.clients.map((item) => (
                <li key={item} className="type-body flex items-start gap-3">
                  <span aria-hidden="true" className="mt-[10px] size-1.5 shrink-0 rounded-full" style={{ background: 'var(--brass)' }} />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">{copy.faqTitle}</h2>
            <div className="mt-6 divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              {copy.faq.map((item) => (
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
          <h2 className="type-h3">{copy.cta}</h2>
          <SegmentProvider>
            <ContactButton hero label={ui[locale].whatsapp.defaultCta} />
          </SegmentProvider>
        </section>
      </article>

      </main>
      <Footer />
      <JsonLd
        data={graph(
          webPageNode({ path, name: copy.name, description: copy.description, type: 'AboutPage', breadcrumb: true, mainEntity: businessRef, locale }),
          breadcrumbNode(crumbs),
          faqNode(copy.faq, path),
        )}
      />
    </>
  )
}

export const metadata = aboutMetadata('ro')

export default function AboutPage() {
  return <AboutView locale="ro" />
}

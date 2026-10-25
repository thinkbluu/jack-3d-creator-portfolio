import Link from 'next/link'
import Image from 'next/image'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import PageOpen from '@/components/studio/PageOpen'
import SectionHead from '@/components/studio/SectionHead'
import ValuesDrop from '@/components/studio/ValuesDrop'
import { getTeam } from '@/lib/team'
import { localizePath } from '@/lib/i18n/paths'
import type { Locale } from '@/lib/i18n/locale'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, businessRef, faqNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'
import { EMAIL, EMAIL_HREF, LEGAL_NAME, PHONE_DISPLAY, PHONE_HREF, TRADE_REGISTER_NUMBER, VAT_ID } from '@/lib/site'
import { PAGE_WORDS } from '@/lib/page-words'

const about = {
  ro: {
    title: 'Despre noi: studio de web design din Timișoara',
    description:
      'MAST Studio e un studio de web design din Timișoara, parte din MAST Consult S.R.L. Construim site-uri, magazine online și platforme pentru firme din România.',
    name: 'Despre MAST Studio',
    kicker: 'Despre studio',
    word: PAGE_WORDS['/despre'].ro,
    lead: 'Un studio mic de web design din Timișoara. Credem că un site bun se simte, nu doar se vede.',
    missionTitle: 'Misiunea noastră: mai puține site-uri urâte pe internet.',
    missionNote: 'E o luptă grea. Ajută-ne.',
    missionBody:
      'În practică înseamnă asta: fiecare site e construit de la zero, e rapid, spune clar ce trebuie și rămâne al clientului.',
    valuesLabel: 'Ce ne ghidează',
    statement: 'Ascultăm cum funcționează afacerea ta și construim ce o vinde.',
    values: [
      { title: 'Fără șabloane.', text: 'Site-ul e construit în jurul a ce vinde afacerea ta, nu invers.' },
      { title: 'Fără jargon.', text: 'Îți explicăm fiecare alegere în cuvinte pe care le folosești și tu.' },
      { title: 'Un singur om de contact.', text: 'Vorbești direct cu cei care construiesc, fără intermediari.' },
      { title: 'Al tău din prima zi.', text: 'Accesele, codul și documentația rămân la tine.' },
    ],
    whatLabel: 'Ce facem',
    whatHead: 'Site-uri, magazine și platforme.',
    whoLabel: 'Cine suntem',
    whoHead: 'Timișoara, la distanță.',
    clientsLabel: 'Cu cine lucrăm',
    clientsHead: 'Afaceri care vor să fie găsite.',
    faqLabel: 'Pe scurt',
    faqHead: 'Întrebări.',
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
    word: PAGE_WORDS['/despre'].en,
    lead: 'A small web design studio in Timișoara. We believe a good website is felt, not only seen.',
    missionTitle: 'Our mission: fewer ugly websites on the internet.',
    missionNote: 'It’s a hard fight. Help us.',
    missionBody:
      'In practice it means this: every site is custom-built, fast, says clearly what it needs to say, and stays owned by the client.',
    valuesLabel: 'What guides us',
    statement: 'We listen to how your business works and build what sells it.',
    values: [
      { title: 'No templates.', text: 'The site is built around what your business sells, not the other way round.' },
      { title: 'No jargon.', text: 'We explain every choice in words you use yourself.' },
      { title: 'One point of contact.', text: 'You talk directly to the people who build it, with no one in between.' },
      { title: 'Yours from day one.', text: 'The access, the code and the documentation stay with you.' },
    ],
    whatLabel: 'What we do',
    whatHead: 'Websites, stores and platforms.',
    whoLabel: 'Who we are',
    whoHead: 'Timișoara, working remotely.',
    clientsLabel: 'Who we work with',
    clientsHead: 'Businesses that want to be found.',
    faqLabel: 'In short',
    faqHead: 'Questions.',
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

  const team = getTeam()

  return (
    <>
      <SiteHeader current="despre" tone="dark" overlay />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
        <PageOpen crumbs={crumbs} index="04" title={copy.name} word={copy.word} lead={copy.lead}>
          <div className="max-w-sm">
            <p className="mono-label text-[var(--fg-3)]">{copy.inShort}</p>
            <p className="mt-3 leading-relaxed text-[var(--fg-2)]">{copy.capsule}</p>
          </div>
        </PageOpen>

        <section aria-labelledby="manifesto" className="page-section">
          <div className="studio-container max-w-4xl">
            <h2 id="manifesto" className="display-xl text-balance text-[clamp(2.2rem,4.5vw,4.2rem)]">{copy.missionTitle}</h2>
            <p className="mt-5 text-xl italic text-[var(--brass-ink)]" style={{ fontFamily: 'var(--font-display)' }}>
              {copy.missionNote}
            </p>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[var(--ink-2)]">{copy.missionBody}</p>
          </div>
        </section>

        <ValuesDrop label={copy.valuesLabel} statement={copy.statement} cards={copy.values} />

        <section className="tone-dark page-section">
          <div className="studio-container">
            <SectionHead index="01" label={copy.whatLabel} title={copy.whatHead} />
            <div className="mt-14 grid gap-8 text-lg leading-relaxed text-[var(--fg-2)] md:grid-cols-2 md:gap-14">
              {copy.what.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className="page-section">
          <div className="studio-container">
            <SectionHead index="02" label={copy.whoLabel} title={copy.whoHead} />
            <div className="mt-14 grid gap-8 text-lg leading-relaxed text-[var(--ink-2)] md:grid-cols-2 md:gap-14">
              <p>{copy.who}</p>
              <p>{copy.where}</p>
            </div>
            {team.length ? (
              <ul className="team-grid">
                {team.map((member) => (
                  <li key={member.slug}>
                    <Link href={localizePath(`/echipa/${member.slug}`, locale)} className="team-card link-block">
                      <span className="team-card-photo">
                        {member.photo ? <Image src={member.photo} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" /> : null}
                      </span>
                      <span className="team-card-name display-xl">{member.name}</span>
                      <span className="mono-label text-[var(--ink-3)]">{member.role[locale]}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        <section className="tone-warm page-section">
          <div className="studio-container">
            <SectionHead index="03" label={copy.clientsLabel} title={copy.clientsHead} />
            <ul className="big-rows mt-14">
              {copy.clients.map((item, index) => (
                <li key={item} className="big-row">
                  <span className="mono-label text-[var(--accent)]">{String(index + 1).padStart(2, '0')}</span>
                  <span className="big-row-name">{item}</span>
                  <span />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="page-section">
          <div className="studio-container grid gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <div>
              <SectionHead index="04" label={copy.faqLabel} title={copy.faqHead} compact />
              <dl className="mt-12 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[var(--ink-2)]">
                <dt className="mono-label pt-1 text-[var(--ink-3)]">{copy.company}</dt>
                <dd>{LEGAL_NAME}</dd>
                <dt className="mono-label pt-1 text-[var(--ink-3)]">{copy.cui}</dt>
                <dd>{VAT_ID}</dd>
                <dt className="mono-label pt-1 text-[var(--ink-3)]">{copy.register}</dt>
                <dd>{TRADE_REGISTER_NUMBER}</dd>
                <dt className="mono-label pt-1 text-[var(--ink-3)]">{copy.phone}</dt>
                <dd>
                  <a href={PHONE_HREF} className="underline-offset-4 hover:underline">{PHONE_DISPLAY}</a>
                </dd>
                <dt className="mono-label pt-1 text-[var(--ink-3)]">{copy.email}</dt>
                <dd>
                  <a href={EMAIL_HREF} className="underline-offset-4 hover:underline">{EMAIL}</a>
                </dd>
              </dl>
            </div>
            <div className="divide-y divide-[var(--hairline)] self-end border-y border-[var(--hairline)]">
              <h2 className="sr-only">{copy.faqTitle}</h2>
              {copy.faq.map((item) => (
                <details key={item.question} className="faq-item group py-5">
                  <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between gap-4 font-sans text-lg font-semibold [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <span className="faq-icon flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border border-[var(--hairline)] text-[var(--ink)]" aria-hidden="true">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M5.5 0V11M0 5.5H11" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-[var(--ink-2)]">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
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

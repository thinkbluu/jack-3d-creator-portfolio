import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import ContactButton from '@/components/ContactButton'
import Footer from '@/components/Footer'
import JsonLd from '@/components/JsonLd'
import SiteHeader from '@/components/SiteHeader'
import { SegmentProvider } from '@/components/SegmentContext'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { breadcrumbNode, faqNode, graph, webPageNode, type BreadcrumbItem } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

type ComparisonRow = {
  label: string
  wix: string
  freelancer: string
  studio: string
  agentie: string
}

type ComparisonCopy = {
  metaTitle: string
  description: string
  crumb: string
  kicker: string
  h1: string
  answerCapsule: string
  tableTitle: string
  columns: { criterion: string; wix: string; freelancer: string; studio: string; agency: string }
  rows: ComparisonRow[]
  wixTitle: string
  wixIntro: string
  wixSituations: string[]
  freelancerTitle: string
  freelancerIntro: string
  freelancerSituations: string[]
  studioTitle: string
  studioIntro: string
  studioSituations: string[]
  agencyTitle: string
  agencyIntro: string
  agencySituations: string[]
  agencyNotTitle: string
  agencyNotFit: string[]
  risksTitle: string
  risks: { option: string; risk: string }[]
  questionsTitle: string
  questionsIntro: string
  questions: string[]
  questionsMore: string
  questionsLink: string
  fitTitle: string
  fitBefore: string
  fitPresentation: string
  fitMid: string
  fitStore: string
  fitBetween: string
  fitMaintenance: string
  fitAfter: string
  faqTitle: string
  faq: { question: string; answer: string }[]
  cta: string
}

const comparisonCopy: Record<Locale, ComparisonCopy> = {
  ro: {
    metaTitle: 'Freelancer, studio sau agenție: cum alegi',
    description:
      'Freelancer, studio mic, agenție sau Wix? Comparație onestă pentru un site de firmă în România: prețuri, termene, riscuri tipice și când merită fiecare.',
    crumb: 'Freelancer, studio sau agenție',
    kicker: 'Comparație',
    h1: 'Freelancer, studio, agenție sau platformă: cum alegi',
    answerCapsule:
      'Pentru un site simplu sub 500 EUR, un freelancer sau o platformă de tip Wix poate fi suficient. Pentru un site care trebuie să aducă clienți, un studio mic oferă cel mai bun raport între preț și calitate. Agențiile mari sunt potrivite pentru proiecte peste 3.000 EUR care necesită echipă dedicată.',
    tableTitle: 'Tabel comparativ',
    columns: {
      criterion: 'Criteriu',
      wix: 'Platformă tip Wix',
      freelancer: 'Freelancer',
      studio: 'Studio mic',
      agency: 'Agenție mare',
    },
    rows: [
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
    ],
    wixTitle: 'Când e suficientă o platformă de tip Wix sau Shopify',
    wixIntro:
      'O platformă de tip Wix, Shopify sau Squarespace înseamnă abonament lunar mic și control total, dar tu ești cel care construiește și întreține site-ul. E o alegere onestă și corectă în anumite situații:',
    wixSituations: [
      'Testezi o idee de afacere și nu știi încă dacă va funcționa.',
      'Ai nevoie doar de o pagină cu informații de bază: nume, contact, program.',
      'Bugetul e sub 300 EUR și accepți să investești timp propriu pentru a-l construi.',
      'Ești confortabil să înveți o unealtă nouă și să faci singur mentenanța.',
    ],
    freelancerTitle: 'Când merită un freelancer',
    freelancerIntro:
      'Un freelancer individual poate livra la un preț mai mic decât un studio, dar cu variabilitate mai mare în calitate și disponibilitate. Merită luat în calcul atunci când:',
    freelancerSituations: [
      'Ai deja un proiect clar definit, cu specificații scrise.',
      'Ai lucrat cu freelancerul respectiv sau ai referințe verificate de la clienți reali.',
      'Bugetul e limitat, dar accepți riscul unei comunicări mai puțin structurate sau al termenelor variabile.',
      'Nu ai nevoie de garanții contractuale extinse sau de suport pe termen lung.',
    ],
    studioTitle: 'Când merită un studio mic',
    studioIntro:
      'Un studio mic, așa cum e MAST Studio, oferă un echilibru între prețul unui freelancer și structura unei agenții: proces documentat, termen de livrare fix și contact direct cu cei care construiesc efectiv site-ul. Are sens atunci când:',
    studioSituations: [
      'Vrei un site care trebuie să aducă efectiv clienți, nu doar să existe online.',
      'Ai nevoie de un termen de livrare previzibil și un preț fix, fără negocieri lungi.',
      'Preferi să discuți direct cu cei care construiesc site-ul, fără intermediari.',
      'Bugetul tău e între 300 și 3.000 EUR — sub asta, o platformă poate fi suficientă; peste asta, o agenție are sens dacă ai nevoie de echipă dedicată.',
    ],
    agencyTitle: 'Când ai nevoie de o agenție mare',
    agencyIntro:
      'Agențiile mari au echipe extinse și procese formale de management de proiect, potrivite pentru cerințe complexe. Are sens să alegi o agenție mare atunci când:',
    agencySituations: [
      'Proiectul are cerințe complexe: multiple integrări, echipe interne care trebuie coordonate, cercetare de piață extinsă.',
      'Bugetul e peste 3.000-5.000 EUR și ai nevoie de o echipă dedicată pe toată durata proiectului, nu de un singur furnizor.',
      'Ai nevoie de servicii conexe pe scară largă: campanii media, strategie de brand, structuri de raportare pentru un consiliu.',
    ],
    agencyNotTitle: 'Și când o agenție mare nu e alegerea potrivită:',
    agencyNotFit: [
      'Dacă vrei un site simplu de prezentare livrat rapid, o agenție mare aduce costuri și proceduri disproporționate față de nevoie.',
      'Dacă bugetul tău e sub 3.000 EUR, majoritatea agențiilor mari nici nu vor accepta proiectul sau vor livra un rezultat sub-dimensionat pentru procesul lor standard.',
    ],
    risksTitle: 'Ce riscuri apar des la fiecare alegere',
    risks: [
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
    ],
    questionsTitle: 'Patru întrebări de pus înainte de avans',
    questionsIntro: 'Indiferent pe cine alegi, cere răspunsul în scris:',
    questions: [
      'Cine deține domeniul și găzduirea: tu sau furnizorul?',
      'Termenul pornește după ce trimiți materialele sau „când apucăm”?',
      'Ce e inclus în preț și ce se plătește separat?',
      'Cine răspunde după lansare dacă site-ul nu mai merge?',
    ],
    questionsMore: 'Pentru o listă mai completă, citește',
    questionsLink: 'cum alegi o firmă de web design: 7 întrebări de pus',
    fitTitle: 'Unde se încadrează MAST Studio',
    fitBefore:
      'Suntem un studio mic din Timișoara, parte din MAST Consult S.R.L. Lucrăm cu afaceri care vor un site clar, cu preț la vedere și un singur interlocutor:',
    fitPresentation: 'site de prezentare',
    fitMid: 'de la 300 EUR, live în 48 de ore după materiale,',
    fitStore: 'magazin online',
    fitBetween: 'de la 900 EUR și',
    fitMaintenance: 'mentenanță',
    fitAfter: 'de la 90 EUR pe lună. Avansul este de 50 EUR, iar restul îl plătești doar dacă ești mulțumit.',
    faqTitle: 'Întrebări frecvente',
    faq: [
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
    ],
    cta: 'Dacă un studio mic e alegerea potrivită pentru tine',
  },
  en: {
    metaTitle: 'Freelancer, studio, or agency: how to choose',
    description:
      'Freelancer, small studio, agency, or Wix? An honest comparison for a company website in Romania: prices, timelines, typical risks, and when each one is worth it.',
    crumb: 'Freelancer, studio, or agency',
    kicker: 'Comparison',
    h1: 'Freelancer, studio, agency, or platform: how to choose',
    answerCapsule:
      'For a simple website under 500 EUR, a freelancer or a platform like Wix can be enough. For a website that has to bring in clients, a small studio offers the best balance of price and quality. Large agencies fit projects over 3,000 EUR that need a dedicated team.',
    tableTitle: 'Comparison table',
    columns: {
      criterion: 'Criterion',
      wix: 'Wix-style platform',
      freelancer: 'Freelancer',
      studio: 'Small studio',
      agency: 'Large agency',
    },
    rows: [
      {
        label: 'Typical price',
        wix: '0-30 EUR/month',
        freelancer: '150-600 EUR',
        studio: '300-3,000 EUR',
        agentie: '3,000-15,000+ EUR',
      },
      {
        label: 'Delivery time',
        wix: '1-3 days (on your own)',
        freelancer: '1-3 weeks',
        studio: '48h - 3 weeks',
        agentie: '1-3 months',
      },
      {
        label: 'Custom design',
        wix: 'Template, limited customisation',
        freelancer: 'It varies, check the portfolio',
        studio: 'Yes, built for your business',
        agentie: 'Yes, with research and strategy',
      },
      {
        label: 'Copy included',
        wix: 'No, you write it',
        freelancer: 'Rarely, usually separate',
        studio: 'Often included or guided',
        agentie: 'Yes, a copywriting team',
      },
      {
        label: 'Who helps you after delivery',
        wix: 'The platform’s general support',
        freelancer: 'It depends on availability',
        studio: 'Direct contact with the people who built it',
        agentie: 'A dedicated account manager',
      },
      {
        label: 'Who it’s for',
        wix: 'You’re testing an idea, minimal budget',
        freelancer: 'A simple project, a small budget, and you risk the quality',
        studio: 'A small or mid-sized business, you want results quickly',
        agentie: 'A complex project, a large brand, an in-house team',
      },
    ],
    wixTitle: 'When a Wix- or Shopify-style platform is enough',
    wixIntro:
      'A platform like Wix, Shopify, or Squarespace means a small monthly subscription and full control, but you are the one who builds and maintains the website. It is an honest and fair choice in some situations:',
    wixSituations: [
      'You’re testing a business idea and you don’t yet know whether it will work.',
      'You only need a page with the basics: name, contact, opening hours.',
      'The budget is under 300 EUR and you accept spending your own time to build it.',
      'You’re comfortable learning a new tool and doing the maintenance yourself.',
    ],
    freelancerTitle: 'When a freelancer is worth it',
    freelancerIntro:
      'An individual freelancer can deliver at a lower price than a studio, but with more variation in quality and availability. It’s worth considering when:',
    freelancerSituations: [
      'You already have a clearly defined project, with written specifications.',
      'You’ve worked with that freelancer before, or you have verified references from real clients.',
      'The budget is limited, but you accept the risk of less structured communication or of timelines that move.',
      'You don’t need extensive contractual guarantees or long-term support.',
    ],
    studioTitle: 'When a small studio is worth it',
    studioIntro:
      'A small studio, as MAST Studio is, offers a balance between a freelancer’s price and an agency’s structure: a documented process, a fixed delivery date, and direct contact with the people who actually build the website. It makes sense when:',
    studioSituations: [
      'You want a website that has to bring in clients, not just exist online.',
      'You need a predictable delivery date and a fixed price, without long negotiations.',
      'You prefer to talk directly with the people who build the website, with no middlemen.',
      'Your budget is between 300 and 3,000 EUR — below that, a platform can be enough; above that, an agency makes sense if you need a dedicated team.',
    ],
    agencyTitle: 'When you need a large agency',
    agencyIntro:
      'Large agencies have extended teams and formal project-management processes, suited to complex requirements. It makes sense to choose a large agency when:',
    agencySituations: [
      'The project has complex requirements: multiple integrations, internal teams that need coordinating, and extensive market research.',
      'The budget is over 3,000-5,000 EUR and you need a dedicated team for the whole project, not a single supplier.',
      'You need related services at scale: media campaigns, brand strategy, and reporting structures for a board.',
    ],
    agencyNotTitle: 'And when a large agency is not the right choice:',
    agencyNotFit: [
      'If you want a simple presentation website delivered quickly, a large agency brings costs and procedures out of proportion to the need.',
      'If your budget is under 3,000 EUR, most large agencies will not take the project, or they will deliver something undersized for their standard process.',
    ],
    risksTitle: 'The risks that show up often with each choice',
    risks: [
      {
        option: 'Wix-style platform',
        risk: 'You save money now, but you risk a slow website that is hard to maintain, and that you rebuild a year later.',
      },
      {
        option: 'Freelancer',
        risk: 'They can deliver excellent work. The typical risk: they disappear after launch, don’t document the access, or keep the website on their own account. Ask for a written handover.',
      },
      {
        option: 'Small studio',
        risk: 'If the studio has no live portfolio or a written “from” price, it is just a freelancer under another name. Check real projects.',
      },
      {
        option: 'Large agency',
        risk: 'They can deliver large projects. The typical risk: you pay for coordination, presentations, and waiting time for a website that could have been a simple deliverable.',
      },
    ],
    questionsTitle: 'Four questions to ask before the deposit',
    questionsIntro: 'Whoever you choose, ask for the answer in writing:',
    questions: [
      'Who owns the domain and the hosting: you or the supplier?',
      'Does the timeline start after you send the materials, or “when we get to it”?',
      'What is included in the price, and what is paid separately?',
      'Who answers after launch if the website stops working?',
    ],
    questionsMore: 'For a fuller list, read',
    questionsLink: 'how to choose a web design firm: 7 questions to ask',
    fitTitle: 'Where MAST Studio fits',
    fitBefore:
      'We are a small studio in Timișoara, part of MAST Consult S.R.L. We work with businesses that want a clear website, with the price in the open and a single point of contact:',
    fitPresentation: 'presentation website',
    fitMid: 'from 300 EUR, live in 48 hours after the materials,',
    fitStore: 'online store',
    fitBetween: 'from 900 EUR, and',
    fitMaintenance: 'maintenance',
    fitAfter: 'from 90 EUR a month. The deposit is 50 EUR, and you pay the rest only if you are happy.',
    faqTitle: 'Frequently asked questions',
    faq: [
      {
        question: 'What is the cheapest option for a website?',
        answer:
          'A Wix- or Shopify-style platform, built by you, costs only the monthly subscription (0-30 EUR). But your time has a cost, and the result depends on how much you learn to use the tool.',
      },
      {
        question: 'When does it not make sense to work with MAST Studio?',
        answer:
          'If your budget is under 300 EUR, a Wix-style platform is probably enough. If the project is complex and needs a permanently dedicated team, rather than a supplier with a fixed process, a large agency is the right choice, not a small studio.',
      },
      {
        question: 'Why would a freelancer cost less than a studio, while the risk is higher?',
        answer:
          'An individual freelancer has lower fixed costs, and also less redundancy: if they fall ill, change priorities, or abandon the project, you have no backup plan. A small studio, even with only a few people, has a documented process and continuity.',
      },
      {
        question: 'Does a large agency necessarily offer better quality?',
        answer:
          'Not necessarily better — it offers something else: a larger team, more formal project-management processes, and the capacity to handle complex requirements. For a simple website, those advantages do not automatically turn into a visibly better result, but they cost significantly more.',
      },
      {
        question: 'What is a web design studio?',
        answer:
          'A small team specialised in websites and digital products: more structured than a freelancer working alone, and lighter than a full-service agency, with account managers and long presentations.',
      },
      {
        question: 'What is the typical risk when you work with a freelancer?',
        answer:
          'They disappear after launch, there is no backup for the hosting and the domain, and ownership of the website is unclear. Ask in writing who owns the domain, who holds the access, and what happens if the project stalls.',
      },
      {
        question: 'Can I move from a Wix-style platform to a studio later?',
        answer:
          'Yes. Many clients test the idea on a platform, and when the business grows and they need a website that converts better, or custom functionality, they move to a studio or to a solution built from scratch.',
      },
    ],
    cta: 'If a small studio is the right choice for you',
  },
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

export function comparisonMetadata(locale: Locale) {
  const copy = comparisonCopy[locale]
  return pageMetadata({
    title: copy.metaTitle,
    description: copy.description,
    path: localizePath('/comparatie', locale),
    locale,
  })
}

export function ComparisonView({ locale }: { locale: Locale }) {
  const copy = comparisonCopy[locale]
  const path = localizePath('/comparatie', locale)
  const crumbs: BreadcrumbItem[] = [
    { name: ui[locale].common.home, path: localizePath('/', locale) },
    { name: copy.crumb, path },
  ]

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-[var(--shell)] text-[var(--ink)]">
      <article className="site-container py-12 md:py-20">
        <Breadcrumbs items={crumbs} className="mx-auto max-w-2xl" />

        <header className="mx-auto mt-6 max-w-2xl">
          <p className="kicker">{copy.kicker}</p>
          <h1 className="type-h2 mt-4 text-balance">{copy.h1}</h1>
        </header>

        <div className="mx-auto mt-8 max-w-2xl">
          <p className="kicker">{ui[locale].blog.inShort}</p>
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
            {copy.answerCapsule}
          </div>
        </div>

        <div className="mx-auto max-w-2xl">
          <section className="mt-12">
            <h2 className="type-h3">{copy.tableTitle}</h2>
            <div className="prose mt-6">
              <table>
                <thead>
                  <tr>
                    <th scope="col">{copy.columns.criterion}</th>
                    <th scope="col">{copy.columns.wix}</th>
                    <th scope="col">{copy.columns.freelancer}</th>
                    <th scope="col">{copy.columns.studio}</th>
                    <th scope="col">{copy.columns.agency}</th>
                  </tr>
                </thead>
                <tbody>
                  {copy.rows.map((row) => (
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
            <h2 className="type-h3">{copy.wixTitle}</h2>
            <p className="type-body mt-4">{copy.wixIntro}</p>
            <HonestList items={copy.wixSituations} />
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">{copy.freelancerTitle}</h2>
            <p className="type-body mt-4">{copy.freelancerIntro}</p>
            <HonestList items={copy.freelancerSituations} />
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">{copy.studioTitle}</h2>
            <p className="type-body mt-4">{copy.studioIntro}</p>
            <HonestList items={copy.studioSituations} />
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">{copy.agencyTitle}</h2>
            <p className="type-body mt-4">{copy.agencyIntro}</p>
            <HonestList items={copy.agencySituations} />
            <p className="type-body mt-6 font-semibold text-[var(--ink)]">{copy.agencyNotTitle}</p>
            <HonestList items={copy.agencyNotFit} />
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">{copy.risksTitle}</h2>
            <dl className="mt-4 flex flex-col gap-4">
              {copy.risks.map((item) => (
                <div key={item.option}>
                  <dt className="font-sans font-semibold text-[var(--ink)]">{item.option}</dt>
                  <dd className="type-body mt-1">{item.risk}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">{copy.questionsTitle}</h2>
            <p className="type-body mt-4">{copy.questionsIntro}</p>
            <ol className="type-body mt-4 flex list-decimal flex-col gap-2 pl-5">
              {copy.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
            <p className="type-body mt-4">
              {copy.questionsMore}{' '}
              <Link href="/blog/cum-alegi-firma-web-design" className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">
                {copy.questionsLink}
              </Link>
              .
            </p>
          </section>

          <section className="mt-12 border-t border-[var(--hairline)] pt-12">
            <h2 className="type-h3">{copy.fitTitle}</h2>
            <p className="type-body mt-4">
              {copy.fitBefore}{' '}
              <Link href={localizePath('/servicii/site-de-prezentare', locale)} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">{copy.fitPresentation}</Link>{' '}
              {copy.fitMid}{' '}
              <Link href={localizePath('/servicii/magazin-online', locale)} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">{copy.fitStore}</Link>{' '}
              {copy.fitBetween}{' '}
              <Link href={localizePath('/servicii/mentenanta', locale)} className="inline min-h-0 font-semibold text-[var(--ink)] underline underline-offset-4">{copy.fitMaintenance}</Link>{' '}
              {copy.fitAfter}
            </p>
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
          webPageNode({ path, name: copy.h1, description: copy.description, breadcrumb: true, locale }),
          breadcrumbNode(crumbs),
          faqNode(copy.faq, path),
        )}
      />
    </>
  )
}

export const metadata = comparisonMetadata('ro')

export default function Page() {
  return <ComparisonView locale="ro" />
}

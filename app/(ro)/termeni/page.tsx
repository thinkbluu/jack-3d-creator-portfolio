import LegalPage, { LegalSection } from '@/components/LegalPage'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { pageMetadata } from '@/lib/seo'
import { REGISTERED_OFFICE } from '@/lib/site'

const ro = {
  title: 'Termeni și condiții',
  description:
    'Termenii de utilizare ai site-ului maststudio.ro: cine operează site-ul, cum se fac ofertele și contractele, proprietatea intelectuală și reclamațiile.',
  operatorTitle: '1. Operatorul site-ului',
  operatorBody: (office: string) =>
    `maststudio.ro este operat de MAST Consult S.R.L., cu sediul social în ${office}, CUI RO49626121, Registrul Comerțului J2024000723352, cu punct de contact la contact@maststudio.ro.`,
  roleTitle: '2. Rolul site-ului',
  roleBody:
    'Site-ul prezintă serviciile MAST Studio și facilitează solicitarea unei discuții sau oferte. Informațiile generale, prețurile „de la” și termenele orientative nu reprezintă singure o ofertă contractuală fermă.',
  quotesTitle: '3. Oferte și contractare',
  quotesBody:
    'Obiectul, livrabilele, calendarul, prețul, numărul de revizii și condițiile de plată se stabilesc în oferta sau contractul acceptat de ambele părți. Termenele încep după îndeplinirea condițiilor convenite, inclusiv primirea conținutului și a avansului, dacă sunt aplicabile.',
  clientTitle: '4. Obligațiile clientului',
  clientBody:
    'Clientul furnizează la timp informații corecte, feedback, aprobări și materiale asupra cărora deține drepturile necesare. Întârzierile sau schimbările de scop pot modifica termenul și costul proiectului.',
  ipTitle: '5. Proprietate intelectuală',
  ipBody:
    'Conținutul, identitatea și elementele acestui site aparțin MAST Studio sau licențiatorilor săi. Drepturile asupra livrabilelor pentru clienți sunt cele prevăzute în contract și se transferă numai în condițiile stabilite acolo, de regulă după plata integrală.',
  liabilityTitle: '6. Disponibilitate și răspundere',
  liabilityBody:
    'Depunem eforturi rezonabile pentru acuratețe și disponibilitate, dar site-ul poate fi întrerupt pentru mentenanță sau cauze externe. În limitele legii, nu răspundem pentru pierderi indirecte rezultate exclusiv din utilizarea informațiilor generale de pe site ori din serviciile externe accesate prin linkuri.',
  disputesTitle: '7. Reclamații și litigii',
  disputesBody:
    'Te rugăm să ne contactezi mai întâi pentru soluționare amiabilă. Consumatorii pot utiliza mecanismele ANPC SAL indicate în footer. Platforma europeană SOL este menționată informativ, în măsura în care serviciul rămâne disponibil și aplicabil. Se aplică legea română, fără a limita drepturile imperative ale consumatorilor.',
  changesTitle: '8. Modificări',
  changesBody:
    'Putem actualiza acești termeni pentru schimbări ale serviciilor sau legislației. Versiunea aplicabilă utilizării site-ului este cea publicată aici la data accesării.',
}

// HUMAN REVIEW: legal translation
const en: typeof ro = {
  title: 'Terms and conditions',
  description:
    'The terms of use of maststudio.ro: who operates the website, how quotes and contracts are made, intellectual property and complaints.',
  operatorTitle: '1. The operator of the website',
  operatorBody: (office: string) =>
    `maststudio.ro is operated by MAST Consult S.R.L., with its registered office at ${office}, CUI RO49626121, trade register J2024000723352, with a contact point at contact@maststudio.ro.`,
  roleTitle: '2. Role of the website',
  roleBody:
    'The website presents MAST Studio’s services and makes it possible to request a conversation or a quote. General information, “from” prices and indicative timeframes do not by themselves amount to a firm contractual offer.',
  quotesTitle: '3. Quotes and contracting',
  quotesBody:
    'The subject matter, deliverables, schedule, price, number of revisions and payment terms are set in the quote or contract accepted by both parties. Deadlines start after the agreed conditions are met, including receipt of the content and of the deposit, where they apply.',
  clientTitle: '4. The client’s obligations',
  clientBody:
    'The client provides, in good time, correct information, feedback, approvals and materials over which they hold the necessary rights. Delays or changes of scope may change the deadline and the cost of the project.',
  ipTitle: '5. Intellectual property',
  ipBody:
    'The content, identity and elements of this website belong to MAST Studio or its licensors. Rights in the deliverables for clients are those set out in the contract and transfer only on the conditions set there, usually after payment in full.',
  liabilityTitle: '6. Availability and liability',
  liabilityBody:
    'We make reasonable efforts as to accuracy and availability, but the website may be interrupted for maintenance or for external causes. Within the limits of the law, we are not liable for indirect losses arising solely from the use of the general information on the website or from external services reached through links.',
  disputesTitle: '7. Complaints and disputes',
  disputesBody:
    'Please contact us first so that we can look for an amicable solution. Consumers may use the ANPC SAL mechanisms shown in the footer. The European SOL platform is mentioned for information, to the extent the service remains available and applicable. Romanian law applies, without limiting consumers’ mandatory rights.',
  changesTitle: '8. Changes',
  changesBody:
    'We may update these terms for changes to the services or to the law. The version that applies to use of the website is the one published here on the date it is accessed.',
}

const copy = { ro, en }

export function termsMetadata(locale: Locale) {
  return pageMetadata({
    title: copy[locale].title,
    description: copy[locale].description,
    path: localizePath('/termeni', locale),
    locale,
  })
}

export function TermsView({ locale }: { locale: Locale }) {
  const t = copy[locale]
  return (
    <LegalPage
      locale={locale}
      eyebrow={ui[locale].common.legalEyebrow}
      title={t.title}
      description={t.description}
      path={localizePath('/termeni', locale)}
      updated={locale === 'en' ? '14 July 2026' : '14 iulie 2026'}
    >
      <LegalSection title={t.operatorTitle}>
        <p>{t.operatorBody(REGISTERED_OFFICE)}</p>
      </LegalSection>
      <LegalSection title={t.roleTitle}>
        <p>{t.roleBody}</p>
      </LegalSection>
      <LegalSection title={t.quotesTitle}>
        <p>{t.quotesBody}</p>
      </LegalSection>
      <LegalSection title={t.clientTitle}>
        <p>{t.clientBody}</p>
      </LegalSection>
      <LegalSection title={t.ipTitle}>
        <p>{t.ipBody}</p>
      </LegalSection>
      <LegalSection title={t.liabilityTitle}>
        <p>{t.liabilityBody}</p>
      </LegalSection>
      <LegalSection title={t.disputesTitle}>
        <p>{t.disputesBody}</p>
      </LegalSection>
      <LegalSection title={t.changesTitle}>
        <p>{t.changesBody}</p>
      </LegalSection>
    </LegalPage>
  )
}

export const metadata = termsMetadata('ro')

export default function TermsPage() {
  return <TermsView locale="ro" />
}

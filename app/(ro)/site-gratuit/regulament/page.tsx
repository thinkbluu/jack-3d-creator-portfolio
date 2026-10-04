import Link from 'next/link'
import LegalPage, { LegalSection } from '@/components/LegalPage'
import { CLAIM_DAYS, CONTEST_HASHTAG, CONTEST_NAME, CONTEST_PATH, PRIZE_VALUE_EUR } from '@/lib/contest/config'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { pageMetadata } from '@/lib/seo'
import { EMAIL, EMAIL_HREF, INSTAGRAM_HANDLE, LEGAL_NAME, REGISTERED_OFFICE, TRADE_REGISTER_NUMBER, VAT_ID } from '@/lib/site'

const linkClass = 'inline min-h-0 text-[var(--brass-ink)] underline underline-offset-4'

const ro = {
  metaTitle: 'Regulament concurs: site gratuit lunar',
  description:
    'Regulamentul oficial al concursului MAST Studio „Site gratuit în fiecare lună”: cine participă, cum se alege câștigătorul, premiul și datele personale.',
  eyebrow: 'Regulament oficial',
  heading: `Regulamentul concursului „${CONTEST_NAME}”`,
  organiserTitle: '1. Organizatorul',
  organiser: (office: string) =>
    `Concursul „${CONTEST_NAME}” (denumit în continuare „concursul”) este organizat de ${LEGAL_NAME}, cu sediul social în ${office}, CUI ${VAT_ID}, număr Registrul Comerțului ${TRADE_REGISTER_NUMBER}, prin divizia sa MAST Studio (denumită în continuare „organizatorul”).`,
  durationTitle: '2. Durata și rundele',
  durationBody:
    'Concursul începe la data publicării acestui regulament pe maststudio.ro și se desfășoară pe perioadă nedeterminată, în runde lunare. Fiecare rundă corespunde unei luni calendaristice și se încheie în ultima zi a lunii, la ora 23:59, ora României.',
  durationPrize: 'În fiecare rundă se acordă un singur premiu.',
  whoTitle: '3. Cine poate participa',
  whoBody:
    'Pot participa afacerile înregistrate în România (societăți, persoane fizice autorizate, întreprinderi individuale sau familiale, organizații neguvernamentale), reprezentate la înscriere de o persoană de cel puțin 18 ani.',
  whoCannot: 'Nu pot participa:',
  whoExcluded: [
    'afacerile care au avut deja un proiect plătit cu MAST Studio;',
    'afacerile care au câștigat deja premiul într-o rundă anterioară;',
    'angajații și colaboratorii organizatorului și rudele lor de gradul I.',
  ],
  whoOne: 'O afacere participă cu o singură înscriere și o singură postare în fiecare rundă.',
  howTitle: '4. Cum participi',
  how1Before: 'Te înscrii prin formularul de pe',
  how1After: 'și confirmi adresa de e-mail prin linkul primit. Înscrierile neconfirmate în 3 zile nu sunt valabile.',
  how2: 'Publici, în luna rundei, o postare care respectă cerințele de la punctul 5.',
  how3: 'Adaugi linkul postării pe pagina ta de participare, cel târziu până la finalul rundei.',
  howAfter:
    'După confirmare, participi în runda din luna respectivă. Poți participa și în rundele următoare, cu o postare nouă, publicată în luna rundei. Participarea este gratuită și nu presupune nicio cumpărare.',
  postTitle: '5. Cerințele postării',
  posts: [
    'este publicată pe Instagram, din contul afacerii, sau pe pagina de Facebook a afacerii; postările de pe profiluri personale de Facebook nu sunt acceptate;',
    'prezintă afacerea și explică de ce are nevoie de un site;',
    `etichetează contul MAST Studio (${INSTAGRAM_HANDLE} pe Instagram, pagina MAST Studio pe Facebook) și conține ${CONTEST_HASHTAG};`,
    'rămâne publică, cu numărul de aprecieri vizibil, până la desemnarea câștigătorului;',
    'nu conține conținut ilegal, ofensator sau care încalcă drepturile altor persoane.',
  ],
  winnerTitle: '6. Desemnarea câștigătorului',
  winnerBody:
    'În primele 5 zile lucrătoare de după încheierea rundei, organizatorul numără aprecierile (like-urile) afișate public la fiecare postare validă. Câștigă postarea cu cele mai multe aprecieri. La egalitate, câștigă postarea al cărei link a fost trimis primul.',
  winnerFake:
    'Postările care nu respectă regulamentul sau ale căror aprecieri sunt obținute artificial (cumpărate, prin conturi false sau prin schimburi automate de aprecieri) sunt descalificate. Organizatorul poate verifica oricând aceste aspecte.',
  prizeTitle: '7. Premiul',
  prizeBody: `Premiul este un site de prezentare construit de MAST Studio, cu o valoare comercială de ${PRIZE_VALUE_EUR} EUR: până la 5 pagini, design personalizat, texte scrise pe baza informațiilor primite de la câștigător, versiune pentru telefon, buton WhatsApp, formular de contact, optimizare SEO de bază și instructaj la predare.`,
  prizeExcluded:
    'Premiul nu include domeniul și găzduirea (plătite de câștigător, pe numele afacerii sale, orientativ 50-120 EUR pe an), mentenanța, paginile sau funcțiile suplimentare, un magazin online sau fotografiile profesionale.',
  prizeDelivery:
    'Site-ul se livrează după ce câștigătorul trimite materialele necesare (informații despre servicii, logo dacă există, fotografii, date de contact), într-un termen stabilit de comun acord, de cel mult 30 de zile de la primirea materialelor. Premiul nu poate fi schimbat în bani și nu poate fi transferat altei persoane.',
  claimTitle: '8. Confirmarea premiului',
  claimBody: `Câștigătorul este anunțat prin e-mail și are ${CLAIM_DAYS} zile să confirme premiul, prin linkul primit. Dacă nu îl confirmă în acest termen, premiul se acordă următoarei postări valide din clasament, după aceeași regulă.`,
  taxTitle: '9. Taxe',
  taxBody:
    'Organizatorul își îndeplinește obligațiile fiscale care îi revin conform Codului fiscal, inclusiv, după caz, calcularea, reținerea și plata impozitului pe veniturile din premii. Orice alte obligații fiscale ale câștigătorului rămân în sarcina acestuia.',
  dataTitle: '10. Date personale',
  dataBody:
    'Pentru concurs prelucrăm numele, adresa de e-mail, telefonul (opțional), datele afacerii, linkul postării și răspunsurile la acordurile din formular. Le folosim pentru organizarea concursului, contactarea participanților, desemnarea și anunțarea câștigătorului și pentru obligațiile legale ale organizatorului. Temeiul este executarea acestui regulament, pe care îl accepți la înscriere, obligația legală și, pentru newsletter și pentru publicarea numelui câștigătorului, consimțământul tău separat.',
  dataBefore: 'Înscrierile neconfirmate se șterg după 7 zile. Datele participanților se șterg la 12 luni după ultima rundă la care au participat. Datele câștigătorilor se păstrează cât cer obligațiile fiscale și contabile. Te poți retrage oricând de pe pagina ta de participare și poți cere ștergerea datelor scriind la',
  dataMid: '. Detalii în',
  privacyLink: 'Politica de confidențialitate',
  announceTitle: '11. Anunțarea câștigătorilor',
  announceBody:
    'Numele afacerii câștigătoare, orașul și site-ul realizat pot fi publicate pe maststudio.ro și pe rețelele sociale MAST Studio numai cu acordul câștigătorului, dat la confirmarea premiului.',
  metaPlatformTitle: '12. Instagram și Facebook',
  metaPlatformBody:
    'Concursul nu este sponsorizat, susținut, administrat sau asociat în vreun fel cu Instagram, Facebook sau Meta. Participanții înțeleg că furnizează datele către organizator, nu către Meta, și eliberează Meta de orice răspundere legată de concurs.',
  liabilityTitle: '13. Răspundere',
  liabilityBody:
    'Organizatorul nu răspunde pentru postările care nu pot fi verificate din cauza setărilor de confidențialitate ale participanților, pentru e-mailurile care nu ajung din cauza unor adrese greșite sau a filtrelor de spam ori pentru imposibilitatea câștigătorului de a trimite materialele necesare.',
  disputesTitle: '14. Litigii',
  disputesBody: 'Eventualele neînțelegeri se rezolvă pe cale amiabilă. Dacă acest lucru nu este posibil, litigiile se soluționează de instanțele competente din România.',
  changesTitle: '15. Modificarea și încetarea concursului',
  changesBody:
    'Organizatorul poate modifica regulamentul sau poate opri concursul, anunțând schimbarea pe această pagină cu cel puțin 15 zile înainte. Modificările nu afectează runda aflată în desfășurare.',
  availableTitle: '16. Disponibilitatea regulamentului',
  availableBody: 'Regulamentul este disponibil gratuit oricărei persoane interesate, pe această pagină. Pentru întrebări, scrie-ne la',
}

// HUMAN REVIEW: legal translation
const en: typeof ro = {
  metaTitle: 'Contest rules: a free website each month',
  description:
    'The official rules of the MAST Studio contest “A free website every month” (official name: “Site gratuit în fiecare lună”): who may enter, how the winner is chosen, the prize and personal data.',
  eyebrow: 'Official rules',
  heading: 'Rules of the “A free website every month” contest',
  organiser: (office: string) =>
    `The contest “A free website every month” (official name: “${CONTEST_NAME}”), referred to below as “the contest”, is organised by ${LEGAL_NAME}, with its registered office at ${office}, CUI ${VAT_ID}, trade register number ${TRADE_REGISTER_NUMBER}, through its MAST Studio division (referred to below as “the organiser”).`,
  organiserTitle: '1. The organiser',
  durationTitle: '2. Duration and rounds',
  durationBody:
    'The contest starts on the date these rules are published on maststudio.ro and runs for an indefinite period, in monthly rounds. Each round is one calendar month and ends on the last day of the month, at 23:59, Romanian time.',
  durationPrize: 'One prize is awarded in each round.',
  whoTitle: '3. Who may enter',
  whoBody:
    'Businesses registered in Romania may enter (companies, authorised natural persons, individual or family enterprises, non-governmental organisations), represented at entry by a person who is at least 18 years old.',
  whoCannot: 'The following may not enter:',
  whoExcluded: [
    'businesses that have already had a paid project with MAST Studio;',
    'businesses that have already won the prize in a previous round;',
    'the organiser’s employees and collaborators, and their first-degree relatives.',
  ],
  whoOne: 'A business enters with a single entry and a single post in each round.',
  howTitle: '4. How to enter',
  how1Before: 'You enter through the form on',
  how1After: 'and confirm your email address through the link you receive. Entries that are not confirmed within 3 days are not valid.',
  how2: 'During the month of the round, you publish a post that meets the requirements in section 5.',
  how3: 'You add the link to the post on your entry page, at the latest by the end of the round.',
  howAfter:
    'After confirmation, you take part in that month’s round. You may also enter later rounds, with a new post published in the month of the round. Entry is free and does not require any purchase.',
  postTitle: '5. Requirements for the post',
  posts: [
    'it is published on Instagram, from the business account, or on the business’s Facebook page; posts from personal Facebook profiles are not accepted;',
    'it presents the business and explains why it needs a website;',
    `it tags the MAST Studio account (${INSTAGRAM_HANDLE} on Instagram, the MAST Studio page on Facebook) and contains ${CONTEST_HASHTAG};`,
    'it stays public, with the like count visible, until the winner is selected;',
    'it does not contain content that is illegal, offensive or that infringes other people’s rights.',
  ],
  winnerTitle: '6. Selecting the winner',
  winnerBody:
    'In the first 5 working days after the round ends, the organiser counts the likes displayed publicly on each valid post. The post with the most likes wins. In a tie, the post whose link was submitted first wins.',
  winnerFake:
    'Posts that do not follow the rules, or whose likes were obtained artificially (bought, through fake accounts or through automated like exchanges), are disqualified. The organiser may check these points at any time.',
  prizeTitle: '7. The prize',
  prizeBody: `The prize is a presentation website built by MAST Studio, with a commercial value of ${PRIZE_VALUE_EUR} EUR: up to 5 pages, custom design, copy written from the information received from the winner, a version for phones, a WhatsApp button, a contact form, basic SEO and a handover briefing.`,
  prizeExcluded:
    'The prize does not include the domain and hosting (paid by the winner, in the name of their business, indicatively 50-120 EUR a year), maintenance, extra pages or features, an online store or professional photographs.',
  prizeDelivery:
    'The website is delivered after the winner sends the necessary materials (information about the services, a logo if one exists, photographs, contact details), within a period agreed together of at most 30 days from receipt of the materials. The prize cannot be exchanged for money and cannot be transferred to another person.',
  claimTitle: '8. Confirming the prize',
  claimBody: `The winner is notified by email and has ${CLAIM_DAYS} days to confirm the prize, through the link received. If they do not confirm within this period, the prize is awarded to the next valid post in the ranking, under the same rule.`,
  taxTitle: '9. Tax',
  taxBody:
    'The organiser meets the tax obligations that fall to it under the Romanian Fiscal Code (Codul fiscal), including, where applicable, calculating, withholding and paying the tax on income from prizes. Any other tax obligations of the winner remain the winner’s responsibility.',
  dataTitle: '10. Personal data',
  dataBody:
    'For the contest we process the name, email address, phone (optional), business details, the link to the post and the answers to the consents in the form. We use them to run the contest, to contact participants, to select and announce the winner and for the organiser’s legal obligations. The legal basis is performance of these rules, which you accept when you enter, a legal obligation and, for the newsletter and for publishing the winner’s name, your separate consent.',
  dataBefore:
    'Unconfirmed entries are deleted after 7 days. Participants’ data is deleted 12 months after the last round they entered. Winners’ data is kept for as long as tax and accounting obligations require. You can withdraw at any time from your entry page, and you can ask for your data to be deleted by writing to',
  dataMid: '. Details are in the',
  privacyLink: 'Privacy policy',
  announceTitle: '11. Announcing the winners',
  announceBody:
    'The winning business’s name, the city and the website produced may be published on maststudio.ro and on MAST Studio’s social networks only with the winner’s consent, given when the prize is confirmed.',
  metaPlatformTitle: '12. Instagram and Facebook',
  metaPlatformBody:
    'The contest is not sponsored, endorsed, administered by or associated in any way with Instagram, Facebook or Meta. Participants understand that they provide the data to the organiser, not to Meta, and they release Meta from any liability related to the contest.',
  liabilityTitle: '13. Liability',
  liabilityBody:
    'The organiser is not liable for posts that cannot be checked because of the participants’ privacy settings, for emails that do not arrive because of a wrong address or spam filters, or for the winner being unable to send the necessary materials.',
  disputesTitle: '14. Disputes',
  disputesBody: 'Any disagreement is resolved amicably. If that is not possible, disputes are settled by the competent courts in Romania.',
  changesTitle: '15. Changing and ending the contest',
  changesBody:
    'The organiser may change the rules or stop the contest, announcing the change on this page at least 15 days in advance. Changes do not affect a round that is already under way.',
  availableTitle: '16. Availability of the rules',
  availableBody: 'The rules are available free of charge to any interested person, on this page. For questions, write to us at',
}

const copy = { ro, en }

export function contestRulesMetadata(locale: Locale) {
  return pageMetadata({
    title: copy[locale].metaTitle,
    description: copy[locale].description,
    path: localizePath('/site-gratuit/regulament', locale),
    locale,
  })
}

export function ContestRulesView({ locale }: { locale: Locale }) {
  const t = copy[locale]
  const contestPath = localizePath(CONTEST_PATH, locale)
  return (
    <LegalPage
      locale={locale}
      eyebrow={t.eyebrow}
      title={t.heading}
      description={t.description}
      path={localizePath('/site-gratuit/regulament', locale)}
      updated={locale === 'en' ? '2 October 2026' : '2 octombrie 2026'}
    >
      <LegalSection title={t.organiserTitle}>
        <p>{t.organiser(REGISTERED_OFFICE)}</p>
      </LegalSection>

      <LegalSection title={t.durationTitle}>
        <p>{t.durationBody}</p>
        <p>{t.durationPrize}</p>
      </LegalSection>

      <LegalSection title={t.whoTitle}>
        <p>{t.whoBody}</p>
        <p>{t.whoCannot}</p>
        <ul className="list-disc pl-6">
          {t.whoExcluded.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>{t.whoOne}</p>
      </LegalSection>

      <LegalSection title={t.howTitle}>
        <ol className="list-decimal pl-6">
          <li>
            {t.how1Before}{' '}
            <Link href={contestPath} className={linkClass}>
              maststudio.ro{contestPath}
            </Link>{' '}
            {t.how1After}
          </li>
          <li>{t.how2}</li>
          <li>{t.how3}</li>
        </ol>
        <p>{t.howAfter}</p>
      </LegalSection>

      <LegalSection title={t.postTitle}>
        <ul className="list-disc pl-6">
          {t.posts.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title={t.winnerTitle}>
        <p>{t.winnerBody}</p>
        <p>{t.winnerFake}</p>
      </LegalSection>

      <LegalSection title={t.prizeTitle}>
        <p>{t.prizeBody}</p>
        <p>{t.prizeExcluded}</p>
        <p>{t.prizeDelivery}</p>
      </LegalSection>

      <LegalSection title={t.claimTitle}>
        <p>{t.claimBody}</p>
      </LegalSection>

      <LegalSection title={t.taxTitle}>
        <p>{t.taxBody}</p>
      </LegalSection>

      <LegalSection title={t.dataTitle}>
        <p>{t.dataBody}</p>
        <p>
          {t.dataBefore}{' '}
          <a href={EMAIL_HREF} className={linkClass}>
            {EMAIL}
          </a>
          {t.dataMid}{' '}
          <Link href={localizePath('/confidentialitate', locale)} className={linkClass}>
            {t.privacyLink}
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title={t.announceTitle}>
        <p>{t.announceBody}</p>
      </LegalSection>

      <LegalSection title={t.metaPlatformTitle}>
        <p>{t.metaPlatformBody}</p>
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

      <LegalSection title={t.availableTitle}>
        <p>
          {t.availableBody}{' '}
          <a href={EMAIL_HREF} className={linkClass}>
            {EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}

export const metadata = contestRulesMetadata('ro')

export default function ContestRulesPage() {
  return <ContestRulesView locale="ro" />
}

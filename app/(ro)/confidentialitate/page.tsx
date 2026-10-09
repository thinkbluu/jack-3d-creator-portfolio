import LegalPage, { LegalSection } from '@/components/LegalPage'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { pageMetadata } from '@/lib/seo'
import { REGISTERED_OFFICE } from '@/lib/site'

const linkClass = 'inline min-h-0 text-[var(--brass-ink)] underline underline-offset-4'

const ro = {
  title: 'Politica de confidențialitate',
  description:
    'Cum prelucrează MAST Studio datele personale ale vizitatorilor și clienților: ce date primim, de ce, cui le transmitem, cât le păstrăm și ce drepturi ai.',
  whoTitle: '1. Cine suntem',
  whoBody: (office: string) =>
    `Site-ul maststudio.ro este operat de MAST Consult S.R.L., cu sediul social în ${office}, CUI RO49626121, număr Registrul Comerțului J2024000723352, denumită în continuare „MAST Studio”.`,
  whoContact: 'Pentru întrebări despre datele tale ne poți contacta la ',
  dataTitle: '2. Ce date prelucrăm',
  dataAccounts:
    'Nu există conturi de utilizator pe acest site. Prelucrăm datele pe care alegi să ni le trimiți: prin formularul de cerere de ofertă (tipul proiectului, adresa site-ului actual, dacă o completezi, și numărul de telefon sau adresa de e-mail), prin e-mail sau prin WhatsApp (de exemplu numele, datele de contact, compania și informațiile despre proiect).',
  careersBefore: 'Dacă trimiți o candidatură pe pagina ',
  careersLink: 'Cariere',
  careersAfter: ', primim numele, e-mailul, telefonul (opțional), domeniul care te interesează, linkurile și mesajul tău, plus CV-ul atașat.',
  contestBefore: 'Dacă te înscrii la concursul ',
  contestLink: '„Site gratuit în fiecare lună”',
  contestAfter:
    ', primim numele, e-mailul, telefonul (opțional), datele afacerii (nume, formă de organizare, domeniu, oraș), linkul postării tale și răspunsurile la acordurile din formular. Pentru a limita înscrierile abuzive păstrăm o amprentă criptată (hash) a adresei IP, nu adresa în sine.',
  dataQuote:
    'Când trimiți formularul de ofertă, adresa IP este folosită temporar pentru a limita trimiterile abuzive, iar împreună cu cererea primim și parametrii de campanie (UTM) ai paginii de pe care ai venit, dacă există.',
  dataVercel:
    'Vercel poate procesa date tehnice necesare livrării și securizării site-ului, precum adresa IP, tipul dispozitivului, browserul, paginile accesate și momentele accesării. Vercel Analytics și Speed Insights furnizează măsurători agregate despre utilizare și performanță.',
  dataGoogle:
    'Folosim și Google Tag (Google Analytics 4) pentru a măsura vizitele și conversiile, precum trimiterea formularului, deschiderea WhatsApp sau apelurile. Google Tag se încarcă numai după ce accepți banner-ul de consimțământ; până atunci nu trimitem nimic către Google. Vercel Analytics și Speed Insights nu folosesc cookie-uri și rulează pentru toți vizitatorii. Detalii în ',
  cookiesLink: 'Politica privind cookie-urile',
  purposesTitle: '3. Scopuri și temeiuri',
  purposesBody:
    'Prelucrăm date pentru a răspunde solicitărilor, a pregăti și executa contracte, a comunica despre proiecte, a proteja serviciul și a înțelege performanța agregată a site-ului. Temeiurile pot fi demersurile precontractuale, executarea contractului, obligația legală și interesul legitim.',
  purposesConsent:
    'CV-urile le folosim doar pentru recrutare, pe baza consimțământului tău. Datele din concurs le folosim pentru organizarea lui, contactarea participanților și a câștigătorului și pentru obligațiile fiscale, conform regulamentului pe care îl accepți la înscriere. Newsletterul lunar îl trimitem doar dacă ai bifat acordul separat; te poți dezabona oricând din linkul din fiecare e-mail.',
  recipientsTitle: '4. Destinatari și transferuri',
  recipientsBody:
    'Datele pot fi accesate strict când este necesar de furnizorii noștri de infrastructură, măsurare și comunicare: Vercel (găzduire și statistici agregate), Resend (livrarea e-mailurilor: cererile din formulare, candidaturile, mesajele concursului și newsletterul), furnizorul bazei de date a concursului (Neon, prin Vercel), Google (Google Tag și Google Analytics, conform alegerii tale din banner) și WhatsApp/Meta atunci când alegi legătura WhatsApp. Postările de concurs sunt publice pe Instagram sau Facebook, conform setărilor tale. Acești furnizori operează conform propriilor politici și pot prelucra date în afara Spațiului Economic European folosind mecanisme legale aplicabile.',
  retentionTitle: '5. Durata păstrării',
  retentionBody:
    'Păstrăm conversațiile și documentele comerciale doar cât este necesar pentru solicitare, relația contractuală, apărarea drepturilor și obligațiile contabile sau legale. Datele tehnice agregate urmează perioadele configurate de furnizorii utilizați.',
  retentionContest:
    'CV-urile le păstrăm cel mult 12 luni de la primire. La concurs, înscrierile neconfirmate se șterg după 7 zile, datele participanților la 12 luni după ultima rundă la care au participat, iar datele câștigătorilor cât cer obligațiile fiscale și contabile. Adresa de e-mail rămâne în lista newsletterului până te dezabonezi.',
  rightsTitle: '6. Drepturile tale',
  rightsBody:
    'Poți solicita accesul, rectificarea, ștergerea, restricționarea, portabilitatea sau opoziția, după caz. Poți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal. Pentru exercitarea drepturilor, scrie-ne la adresa de contact.',
  securityTitle: '7. Securitate și actualizări',
  securityBody:
    'Aplicăm măsuri tehnice și organizatorice rezonabile, însă transmiterea online nu poate fi garantată ca absolut sigură. Putem actualiza politica pentru schimbări legale sau tehnice; versiunea curentă și data ei vor rămâne publicate aici.',
}

// HUMAN REVIEW: legal translation
const en: typeof ro = {
  title: 'Privacy policy',
  description:
    'How MAST Studio processes visitors’ and clients’ personal data: what data we receive, why, whom we share it with, how long we keep it and what rights you have.',
  whoTitle: '1. Who we are',
  whoBody: (office: string) =>
    `The website maststudio.ro is operated by MAST Consult S.R.L., with its registered office at ${office}, CUI RO49626121, trade register number J2024000723352, referred to below as “MAST Studio”.`,
  whoContact: 'For questions about your data, you can contact us at ',
  dataTitle: '2. What data we process',
  dataAccounts:
    'There are no user accounts on this website. We process the data you choose to send us: through the quote request form (the type of project, the address of your current website if you fill it in, and your phone number or email address), by email or by WhatsApp (for example your name, contact details, company and information about the project).',
  careersBefore: 'If you send an application on the ',
  careersLink: 'Careers',
  careersAfter: ' page, we receive your name, email, phone (optional), the field you are interested in, your links and message, plus the attached CV.',
  contestBefore: 'If you enter the ',
  contestLink: '“A free website every month”',
  contestAfter:
    ' contest, we receive your name, email, phone (optional), the business details (name, legal form, field, city), the link to your post and your answers to the consents in the form. To limit abusive entries we keep an encrypted fingerprint (hash) of the IP address, not the address itself.',
  dataQuote:
    'When you submit the quote form, the IP address is used temporarily to limit abusive submissions, and together with the request we also receive the campaign parameters (UTM) of the page you came from, if any.',
  dataVercel:
    'Vercel may process technical data needed to deliver and secure the website, such as the IP address, device type, browser, pages visited and times of access. Vercel Analytics and Speed Insights provide aggregate measurements of use and performance.',
  dataGoogle:
    'We also use Google Tag (Google Analytics 4) to measure visits and conversions, such as submitting a form, opening WhatsApp or calls. Google Tag loads only after you accept the consent banner; until then we send nothing to Google. Vercel Analytics and Speed Insights do not use cookies and run for all visitors. Details are in the ',
  cookiesLink: 'Cookie policy',
  purposesTitle: '3. Purposes and legal bases',
  purposesBody:
    'We process data in order to reply to requests, to prepare and perform contracts, to communicate about projects, to protect the service and to understand the aggregate performance of the website. The legal bases may be pre-contractual steps, performance of a contract, a legal obligation and legitimate interest.',
  purposesConsent:
    'We use CVs only for recruitment, on the basis of your consent. We use contest data to organise the contest, to contact participants and the winner, and for tax obligations, under the rules you accept when you enter. We send the monthly newsletter only if you tick the separate consent; you can unsubscribe at any time from the link in each email.',
  recipientsTitle: '4. Recipients and transfers',
  recipientsBody:
    'Data may be accessed, strictly when necessary, by our infrastructure, measurement and communication providers: Vercel (hosting and aggregate statistics), Resend (delivery of emails: form requests, applications, contest messages and the newsletter), the contest database provider (Neon, through Vercel), Google (Google Tag and Google Analytics, according to your choice in the banner) and WhatsApp/Meta when you choose the WhatsApp link. Contest posts are public on Instagram or Facebook, according to your settings. These providers operate under their own policies and may process data outside the European Economic Area using applicable legal mechanisms.',
  retentionTitle: '5. How long we keep data',
  retentionBody:
    'We keep conversations and commercial documents only for as long as needed for the request, the contractual relationship, the defence of rights and accounting or legal obligations. Aggregate technical data follows the periods configured by the providers we use.',
  retentionContest:
    'We keep CVs for at most 12 months from receipt. For the contest, unconfirmed entries are deleted after 7 days, participants’ data 12 months after the last round they entered, and winners’ data for as long as tax and accounting obligations require. The email address stays on the newsletter list until you unsubscribe.',
  rightsTitle: '6. Your rights',
  rightsBody:
    'You may request access, rectification, erasure, restriction, portability or objection, as applicable. You may lodge a complaint with the National Supervisory Authority for Personal Data Processing (Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal). To exercise your rights, write to us at the contact address.',
  securityTitle: '7. Security and updates',
  securityBody:
    'We apply reasonable technical and organisational measures, but transmission over the internet cannot be guaranteed as absolutely secure. We may update the policy for legal or technical changes; the current version and its date will remain published here.',
}

const copy = { ro, en }

export function privacyMetadata(locale: Locale) {
  return pageMetadata({
    title: copy[locale].title,
    description: copy[locale].description,
    path: localizePath('/confidentialitate', locale),
    locale,
  })
}

export function PrivacyView({ locale }: { locale: Locale }) {
  const t = copy[locale]
  return (
    <LegalPage
      locale={locale}
      eyebrow={ui[locale].common.legalEyebrow}
      title={t.title}
      description={t.description}
      path={localizePath('/confidentialitate', locale)}
      updated={locale === 'en' ? '2 October 2026' : '2 octombrie 2026'}
    >
      <LegalSection title={t.whoTitle}>
        <p>{t.whoBody(REGISTERED_OFFICE)}</p>
        <p>
          {t.whoContact}
          <a className={linkClass} href="mailto:contact@maststudio.ro">
            contact@maststudio.ro
          </a>
          .
        </p>
      </LegalSection>
      <LegalSection title={t.dataTitle}>
        <p>{t.dataAccounts}</p>
        <p>
          {t.careersBefore}
          <a className={linkClass} href={localizePath('/cariere', locale)}>
            {t.careersLink}
          </a>
          {t.careersAfter}
        </p>
        <p>{t.dataQuote}</p>
        <p>{t.dataVercel}</p>
        <p>
          {t.dataGoogle}
          <a className={linkClass} href={localizePath('/cookies', locale)}>
            {t.cookiesLink}
          </a>
          .
        </p>
      </LegalSection>
      <LegalSection title={t.purposesTitle}>
        <p>{t.purposesBody}</p>
        <p>{t.purposesConsent}</p>
      </LegalSection>
      <LegalSection title={t.recipientsTitle}>
        <p>{t.recipientsBody}</p>
      </LegalSection>
      <LegalSection title={t.retentionTitle}>
        <p>{t.retentionBody}</p>
        <p>{t.retentionContest}</p>
      </LegalSection>
      <LegalSection title={t.rightsTitle}>
        <p>{t.rightsBody}</p>
      </LegalSection>
      <LegalSection title={t.securityTitle}>
        <p>{t.securityBody}</p>
      </LegalSection>
    </LegalPage>
  )
}

export const metadata = privacyMetadata('ro')

export default function PrivacyPage() {
  return <PrivacyView locale="ro" />
}

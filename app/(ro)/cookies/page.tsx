import LegalPage, { LegalSection } from '@/components/LegalPage'
import type { Locale } from '@/lib/i18n/locale'
import { localizePath } from '@/lib/i18n/paths'
import { ui } from '@/lib/i18n/ui'
import { pageMetadata } from '@/lib/seo'
import { REGISTERED_OFFICE } from '@/lib/site'

const linkClass = 'inline min-h-0 text-[var(--brass-ink)] underline underline-offset-4'

const ro = {
  title: 'Politica privind cookie-urile',
  description:
    'Ce cookie-uri și ce stocare locală folosește maststudio.ro, cum funcționează consimțământul pentru Google Tag și Vercel Analytics și cum îți schimbi alegerea.',
  controllerTitle: '1. Operator și situația actuală',
  controllerBody: (office: string) =>
    `Politica se aplică site-ului maststudio.ro, operat de MAST Consult S.R.L., cu sediul social în ${office}, CUI RO49626121 și număr Registrul Comerțului J2024000723352.`,
  controllerNow:
    'maststudio.ro nu folosește cookie-uri pentru autentificare. Singurul instrument care poate seta cookie-uri este Google Tag (Google Analytics 4), iar el se încarcă numai după ce alegi „Accept” în banner-ul de consimțământ. Până atunci, sau dacă alegi „Refuz”, nu se încarcă deloc și nu trimite nimic către Google.',
  consentTitle: '2. Consimțământ și măsurare',
  consentVercel:
    'Folosim Vercel Analytics și Speed Insights pentru statistici agregate și indicatori tehnici, precum paginile vizitate, timpii de încărcare și tipul general de dispozitiv. Aceste instrumente nu folosesc cookie-uri, nu salvează nimic pe dispozitivul tău și nu construiesc profiluri individuale. Le folosim pentru toți vizitatorii, în baza interesului nostru legitim de a afla ce pagini sunt utile și cât de repede se încarcă site-ul.',
  consentGoogle:
    'Google Tag (Google Analytics 4) măsoară vizitele și conversiile, precum trimiterea unui formular, deschiderea WhatsApp sau un apel. Îl încărcăm doar după ce accepți banner-ul de consimțământ și nu îl încărcăm deloc pe paginile personale ale concursului, deschise din linkurile primite pe e-mail. Configurația noastră nu transmite către aceste servicii numele, adresa de e-mail, conținutul mesajelor WhatsApp sau alte date introduse de tine.',
  storageTitle: '3. Stocare tehnică',
  storageBody:
    'Site-ul folosește doar stocare tehnică în browser. În localStorage reținem alegerea ta din banner-ul de consimțământ (cheia „mast-consent”), ca să nu te întrebăm la fiecare vizită. În sessionStorage, doar pe durata sesiunii, reținem tipul de afacere ales pe pagina principală și dacă ai sărit peste animația de început. Nu folosim aceste date pentru a construi profiluri.',
  externalTitle: '4. Site-uri externe',
  externalBody:
    'Accesarea WhatsApp, Facebook, Instagram, ANPC sau a altor servicii externe te mută în mediul acelui furnizor, unde se aplică propria politică de cookie-uri și confidențialitate. MAST Studio nu controlează cookie-urile setate după ce părăsești domeniul nostru.',
  changesTitle: '5. Schimbări viitoare',
  changesBody:
    'Îți poți schimba alegerea oricând ștergând datele site-ului din setările browserului, iar banner-ul de consimțământ va reapărea. Dacă vom introduce alte instrumente neesențiale, vom actualiza această politică și le vom include în același mecanism de consimțământ înainte de activare.',
  contactTitle: '6. Contact',
  contactBody: 'Pentru întrebări despre tehnologiile folosite, scrie la ',
}

// HUMAN REVIEW: legal translation
const en: typeof ro = {
  title: 'Cookie policy',
  description:
    'Which cookies and which local storage maststudio.ro uses, how consent works for Google Tag and Vercel Analytics, and how you change your choice.',
  controllerTitle: '1. Controller and the current situation',
  controllerBody: (office: string) =>
    `This policy applies to the website maststudio.ro, operated by MAST Consult S.R.L., with its registered office at ${office}, CUI RO49626121 and trade register number J2024000723352.`,
  controllerNow:
    'maststudio.ro does not use cookies for authentication. The only tool that may set cookies is Google Tag (Google Analytics 4), and it loads only after you choose “Accept” in the consent banner. Until then, or if you choose “Refuse”, it does not load at all and sends nothing to Google.',
  consentTitle: '2. Consent and measurement',
  consentVercel:
    'We use Vercel Analytics and Speed Insights for aggregate statistics and technical indicators, such as pages visited, load times and the general type of device. These tools do not use cookies, do not save anything on your device and do not build individual profiles. We use them for all visitors, on the basis of our legitimate interest in knowing which pages are useful and how quickly the website loads.',
  consentGoogle:
    'Google Tag (Google Analytics 4) measures visits and conversions, such as submitting a form, opening WhatsApp or a call. We load it only after you accept the consent banner, and we do not load it at all on the personal contest pages opened from links received by email. Our configuration does not send these services your name, email address, the content of WhatsApp messages or other data you enter.',
  storageTitle: '3. Technical storage',
  storageBody:
    'The website uses only technical storage in the browser. In localStorage we keep your choice from the consent banner (the key “mast-consent”), so that we do not ask you on every visit. In sessionStorage, only for the length of the session, we keep the type of business chosen on the home page and whether you skipped the opening animation. We do not use this data to build profiles.',
  externalTitle: '4. External websites',
  externalBody:
    'Opening WhatsApp, Facebook, Instagram, ANPC or other external services takes you into that provider’s environment, where its own cookie and privacy policy applies. MAST Studio does not control cookies set after you leave our domain.',
  changesTitle: '5. Future changes',
  changesBody:
    'You can change your choice at any time by deleting the website’s data in your browser settings, and the consent banner will appear again. If we introduce other non-essential tools, we will update this policy and include them in the same consent mechanism before they are switched on.',
  contactTitle: '6. Contact',
  contactBody: 'For questions about the technologies used, write to ',
}

const copy = { ro, en }

export function cookiesMetadata(locale: Locale) {
  return pageMetadata({
    title: copy[locale].title,
    description: copy[locale].description,
    path: localizePath('/cookies', locale),
    locale,
  })
}

export function CookiesView({ locale }: { locale: Locale }) {
  const t = copy[locale]
  return (
    <LegalPage
      locale={locale}
      eyebrow={ui[locale].common.legalEyebrow}
      title={t.title}
      description={t.description}
      path={localizePath('/cookies', locale)}
      updated={locale === 'en' ? '2 October 2026' : '2 octombrie 2026'}
    >
      <LegalSection title={t.controllerTitle}>
        <p>{t.controllerBody(REGISTERED_OFFICE)}</p>
        <p>{t.controllerNow}</p>
      </LegalSection>
      <LegalSection title={t.consentTitle}>
        <p>{t.consentVercel}</p>
        <p>{t.consentGoogle}</p>
      </LegalSection>
      <LegalSection title={t.storageTitle}>
        <p>{t.storageBody}</p>
      </LegalSection>
      <LegalSection title={t.externalTitle}>
        <p>{t.externalBody}</p>
      </LegalSection>
      <LegalSection title={t.changesTitle}>
        <p>{t.changesBody}</p>
      </LegalSection>
      <LegalSection title={t.contactTitle}>
        <p>
          {t.contactBody}
          <a className={linkClass} href="mailto:contact@maststudio.ro">
            contact@maststudio.ro
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}

export const metadata = cookiesMetadata('ro')

export default function CookiesPage() {
  return <CookiesView locale="ro" />
}

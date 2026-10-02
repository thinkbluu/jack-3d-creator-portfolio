import LegalPage, { LegalSection } from '@/components/LegalPage'
import { pageMetadata } from '@/lib/seo'
import { REGISTERED_OFFICE } from '@/lib/site'

const path = '/cookies'
const title = 'Politica privind cookie-urile'
const description =
  'Ce cookie-uri și ce stocare locală folosește maststudio.ro, cum funcționează consimțământul pentru Google Tag și Vercel Analytics și cum îți schimbi alegerea.'

export const metadata = pageMetadata({ title, description, path })

export default function CookiesPage() {
  return (
    <LegalPage eyebrow="Document juridic" title={title} description={description} path={path} updated="2 octombrie 2026">
      <LegalSection title="1. Operator și situația actuală">
        <p>Politica se aplică site-ului maststudio.ro, operat de MAST Consult S.R.L., cu sediul social în {REGISTERED_OFFICE}, CUI RO49626121 și număr Registrul Comerțului J2024000723352.</p>
        <p>maststudio.ro nu folosește cookie-uri pentru autentificare. Singurul instrument care poate seta cookie-uri este Google Tag (Google Analytics 4), iar el se încarcă numai după ce alegi „Accept” în banner-ul de consimțământ. Până atunci, sau dacă alegi „Refuz”, nu se încarcă deloc și nu trimite nimic către Google.</p>
      </LegalSection>
      <LegalSection title="2. Consimțământ și măsurare">
        <p>Folosim Vercel Analytics și Speed Insights pentru statistici agregate și indicatori tehnici, precum paginile vizitate, timpii de încărcare și tipul general de dispozitiv. Aceste instrumente nu folosesc cookie-uri, nu salvează nimic pe dispozitivul tău și nu construiesc profiluri individuale. Le folosim pentru toți vizitatorii, în baza interesului nostru legitim de a afla ce pagini sunt utile și cât de repede se încarcă site-ul.</p>
        <p>Google Tag (Google Analytics 4) măsoară vizitele și conversiile, precum trimiterea unui formular, deschiderea WhatsApp sau un apel. Îl încărcăm doar după ce accepți banner-ul de consimțământ. Configurația noastră nu transmite către aceste servicii numele, adresa de e-mail, conținutul mesajelor WhatsApp sau alte date introduse de tine.</p>
      </LegalSection>
      <LegalSection title="3. Stocare tehnică">
        <p>Site-ul folosește doar stocare tehnică în browser. În localStorage reținem alegerea ta din banner-ul de consimțământ (cheia „mast-consent”), ca să nu te întrebăm la fiecare vizită. În sessionStorage, doar pe durata sesiunii, reținem tipul de afacere ales pe pagina principală și dacă ai sărit peste animația de început. Nu folosim aceste date pentru a construi profiluri.</p>
      </LegalSection>
      <LegalSection title="4. Site-uri externe">
        <p>Accesarea WhatsApp, Facebook, Instagram, ANPC sau a altor servicii externe te mută în mediul acelui furnizor, unde se aplică propria politică de cookie-uri și confidențialitate. MAST Studio nu controlează cookie-urile setate după ce părăsești domeniul nostru.</p>
      </LegalSection>
      <LegalSection title="5. Schimbări viitoare">
        <p>Îți poți schimba alegerea oricând ștergând datele site-ului din setările browserului, iar banner-ul de consimțământ va reapărea. Dacă vom introduce alte instrumente neesențiale, vom actualiza această politică și le vom include în același mecanism de consimțământ înainte de activare.</p>
      </LegalSection>
      <LegalSection title="6. Contact">
        <p>Pentru întrebări despre tehnologiile folosite, scrie la <a className="text-[var(--brass-ink)] underline-offset-4 hover:underline" href="mailto:contact@maststudio.ro">contact@maststudio.ro</a>.</p>
      </LegalSection>
    </LegalPage>
  )
}

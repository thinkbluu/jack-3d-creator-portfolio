import LegalPage, { LegalSection } from '@/components/LegalPage'
import { pageMetadata } from '@/lib/seo'

const path = '/confidentialitate'
const title = 'Politica de confidențialitate'
const description =
  'Cum prelucrează MAST Studio datele personale ale vizitatorilor și clienților: ce date primim, de ce, cui le transmitem, cât le păstrăm și ce drepturi ai.'

export const metadata = pageMetadata({ title, description, path })

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Document juridic" title={title} description={description} path={path} updated="2 octombrie 2026">
      <LegalSection title="1. Cine suntem">
        <p>Site-ul maststudio.ro este operat de MAST Consult S.R.L., cu sediul social în Str. Victor Valcovici 19, cod 300503, Timișoara, județul Timiș, CUI RO49626121, număr Registrul Comerțului J2024000723352, denumită în continuare „MAST Studio”.</p>
        <p>Pentru întrebări despre datele tale ne poți contacta la <a className="text-[var(--brass-ink)] underline-offset-4 hover:underline" href="mailto:contact@maststudio.ro">contact@maststudio.ro</a>.</p>
      </LegalSection>
      <LegalSection title="2. Ce date prelucrăm">
        <p>Nu există conturi de utilizator pe acest site. Prelucrăm datele pe care alegi să ni le trimiți: prin formularul de cerere de ofertă (tipul proiectului, adresa site-ului actual, dacă o completezi, și numărul de telefon sau adresa de e-mail), prin e-mail sau prin WhatsApp (de exemplu numele, datele de contact, compania și informațiile despre proiect).</p>
        <p>Când trimiți formularul, adresa IP este folosită temporar pentru a limita trimiterile abuzive, iar împreună cu cererea primim și parametrii de campanie (UTM) ai paginii de pe care ai venit, dacă există.</p>
        <p>Vercel poate procesa date tehnice necesare livrării și securizării site-ului, precum adresa IP, tipul dispozitivului, browserul, paginile accesate și momentele accesării. Vercel Analytics și Speed Insights furnizează măsurători agregate despre utilizare și performanță.</p>
        <p>Folosim și Google Tag (Google Analytics 4) pentru a măsura vizitele și conversiile, precum trimiterea formularului, deschiderea WhatsApp sau apelurile. Google Tag rulează în Consent Mode v2: stocarea pentru analiză și publicitate rămâne refuzată până când accepți banner-ul de consimțământ. Detalii în <a className="text-[var(--brass-ink)] underline-offset-4 hover:underline" href="/cookies">Politica privind cookie-urile</a>.</p>
      </LegalSection>
      <LegalSection title="3. Scopuri și temeiuri">
        <p>Prelucrăm date pentru a răspunde solicitărilor, a pregăti și executa contracte, a comunica despre proiecte, a proteja serviciul și a înțelege performanța agregată a site-ului. Temeiurile pot fi demersurile precontractuale, executarea contractului, obligația legală și interesul legitim.</p>
      </LegalSection>
      <LegalSection title="4. Destinatari și transferuri">
        <p>Datele pot fi accesate strict când este necesar de furnizorii noștri de infrastructură, măsurare și comunicare: Vercel (găzduire și statistici agregate), Resend (livrarea pe e-mail a cererilor trimise prin formular), Google (Google Tag și Google Analytics, conform alegerii tale din banner) și WhatsApp/Meta atunci când alegi legătura WhatsApp. Acești furnizori operează conform propriilor politici și pot prelucra date în afara Spațiului Economic European folosind mecanisme legale aplicabile.</p>
      </LegalSection>
      <LegalSection title="5. Durata păstrării">
        <p>Păstrăm conversațiile și documentele comerciale doar cât este necesar pentru solicitare, relația contractuală, apărarea drepturilor și obligațiile contabile sau legale. Datele tehnice agregate urmează perioadele configurate de furnizorii utilizați.</p>
      </LegalSection>
      <LegalSection title="6. Drepturile tale">
        <p>Poți solicita accesul, rectificarea, ștergerea, restricționarea, portabilitatea sau opoziția, după caz. Poți depune o plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal. Pentru exercitarea drepturilor, scrie-ne la adresa de contact.</p>
      </LegalSection>
      <LegalSection title="7. Securitate și actualizări">
        <p>Aplicăm măsuri tehnice și organizatorice rezonabile, însă transmiterea online nu poate fi garantată ca absolut sigură. Putem actualiza politica pentru schimbări legale sau tehnice; versiunea curentă și data ei vor rămâne publicate aici.</p>
      </LegalSection>
    </LegalPage>
  )
}

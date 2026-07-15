import type { Metadata } from 'next'
import LegalPage, { LegalSection } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Politica de confidențialitate',
  description: 'Cum prelucrează MAST Studio datele personale ale vizitatorilor și clienților.',
  alternates: { canonical: '/confidentialitate' },
}

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Document juridic" title="Politica de confidențialitate" updated="14 iulie 2026">
      <LegalSection title="1. Cine suntem">
        <p>Site-ul maststudio.ro este operat de MAST Consult S.R.L., cu sediul social în [DE COMPLETAT], CUI [DE COMPLETAT], număr Registrul Comerțului [DE COMPLETAT], denumită în continuare „MAST Studio”.</p>
        <p>Pentru întrebări despre datele tale ne poți contacta la <a className="text-[var(--gold)] underline-offset-4 hover:underline" href="mailto:contact@maststudio.ro">contact@maststudio.ro</a>.</p>
      </LegalSection>
      <LegalSection title="2. Ce date prelucrăm">
        <p>Nu există conturi sau formulare pe acest site. Putem primi datele pe care alegi să ni le trimiți prin e-mail sau WhatsApp, precum numele, datele de contact, compania și informațiile despre proiect.</p>
        <p>Vercel poate procesa date tehnice necesare livrării și securizării site-ului, precum adresa IP, tipul dispozitivului, browserul, paginile accesate și momentele accesării. Vercel Analytics și Speed Insights furnizează măsurători agregate despre utilizare și performanță.</p>
      </LegalSection>
      <LegalSection title="3. Scopuri și temeiuri">
        <p>Prelucrăm date pentru a răspunde solicitărilor, a pregăti și executa contracte, a comunica despre proiecte, a proteja serviciul și a înțelege performanța agregată a site-ului. Temeiurile pot fi demersurile precontractuale, executarea contractului, obligația legală și interesul legitim.</p>
      </LegalSection>
      <LegalSection title="4. Destinatari și transferuri">
        <p>Datele pot fi accesate strict când este necesar de furnizorii noștri de infrastructură și comunicare, în special Vercel și WhatsApp/Meta atunci când alegi legătura WhatsApp. Acești furnizori operează conform propriilor politici și pot prelucra date în afara Spațiului Economic European folosind mecanisme legale aplicabile.</p>
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

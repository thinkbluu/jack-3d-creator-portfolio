import type { Metadata } from 'next'
import LegalPage, { LegalSection } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Politica privind cookie-urile',
  description: 'Informații despre cookie-uri, stocare locală și măsurarea agregată pe maststudio.ro.',
  alternates: { canonical: '/cookies' },
}

export default function CookiesPage() {
  return (
    <LegalPage eyebrow="Document juridic" title="Politica privind cookie-urile" updated="14 iulie 2026">
      <LegalSection title="1. Operator și situația actuală">
        <p>Politica se aplică site-ului maststudio.ro, operat de MAST Consult S.R.L., cu sediul social în Str. Victor Valcovici 19, cod 300503, Timișoara, județul Timiș, CUI RO49626121 și număr Registrul Comerțului J2024000723352.</p>
        <p>maststudio.ro nu folosește cookie-uri pentru autentificare. Pentru instrumentele de măsurare care nu sunt strict necesare afișăm un banner de consimțământ: acestea rămân inactive până când alegi „Accept”, iar dacă alegi „Refuz” nu se activează deloc.</p>
      </LegalSection>
      <LegalSection title="2. Consimțământ și măsurare">
        <p>Folosim Vercel Analytics și Speed Insights pentru statistici agregate și indicatori tehnici precum timpii de încărcare, tipul general de dispozitiv și paginile vizitate. În plus, folosim Google Tag pentru măsurarea conversiilor (trimiterea formularului, deschiderea WhatsApp, apelurile telefonice). Google Tag rulează în modul „consimțământ” (Consent Mode v2), cu stocarea pentru analiză și publicitate setată implicit pe „refuzat”; o activăm doar după ce accepți banner-ul. Configurația noastră nu transmite către aceste servicii numele, adresa de e-mail, conținutul mesajelor WhatsApp sau alte date introduse de tine.</p>
      </LegalSection>
      <LegalSection title="3. Stocare tehnică">
        <p>Site-ul poate utiliza mecanisme tehnice strict necesare furnizării și protecției serviciului. Nu folosim localStorage pentru a construi profiluri și nu persistăm preferințe comerciale în browser.</p>
      </LegalSection>
      <LegalSection title="4. Site-uri externe">
        <p>Accesarea WhatsApp, ANPC sau a altor servicii externe te mută în mediul acelui furnizor, unde se aplică propria politică de cookie-uri și confidențialitate. MAST Studio nu controlează cookie-urile setate după ce părăsești domeniul nostru.</p>
      </LegalSection>
      <LegalSection title="5. Schimbări viitoare">
        <p>Îți poți schimba alegerea oricând ștergând datele site-ului din setările browserului, iar banner-ul de consimțământ va reapărea. Dacă vom introduce alte instrumente neesențiale, vom actualiza această politică și le vom include în același mecanism de consimțământ înainte de activare.</p>
      </LegalSection>
      <LegalSection title="6. Contact">
        <p>Pentru întrebări despre tehnologiile folosite, scrie la <a className="text-[var(--brass)] underline-offset-4 hover:underline" href="mailto:contact@maststudio.ro">contact@maststudio.ro</a>.</p>
      </LegalSection>
    </LegalPage>
  )
}

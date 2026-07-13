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
      <LegalSection title="1. Situația actuală">
        <p>În configurația actuală, maststudio.ro nu setează cookie-uri publicitare, nu creează profiluri de marketing și nu folosește cookie-uri pentru autentificare. De aceea nu afișăm un banner de consimțământ inutil.</p>
      </LegalSection>
      <LegalSection title="2. Măsurare fără profilare">
        <p>Folosim Vercel Analytics și Speed Insights pentru statistici agregate și indicatori tehnici precum timpii de încărcare, tipul general de dispozitiv și paginile vizitate. Configurația noastră nu transmite către aceste servicii numele, adresa de e-mail, conținutul mesajelor WhatsApp sau alte date introduse de tine.</p>
      </LegalSection>
      <LegalSection title="3. Stocare tehnică">
        <p>Site-ul poate utiliza mecanisme tehnice strict necesare furnizării și protecției serviciului. Nu folosim localStorage pentru a construi profiluri și nu persistăm preferințe comerciale în browser.</p>
      </LegalSection>
      <LegalSection title="4. Site-uri externe">
        <p>Accesarea WhatsApp, ANPC sau a altor servicii externe te mută în mediul acelui furnizor, unde se aplică propria politică de cookie-uri și confidențialitate. MAST Studio nu controlează cookie-urile setate după ce părăsești domeniul nostru.</p>
      </LegalSection>
      <LegalSection title="5. Schimbări viitoare">
        <p>Dacă vom introduce instrumente neesențiale care necesită consimțământ, vom actualiza această politică și vom implementa mecanismul de alegere înainte de activarea lor. Poți verifica și șterge cookie-urile oricând din setările browserului.</p>
      </LegalSection>
      <LegalSection title="6. Contact">
        <p>Pentru întrebări despre tehnologiile folosite, scrie la <a className="text-[var(--gold)] underline-offset-4 hover:underline" href="mailto:contact@maststudio.ro">contact@maststudio.ro</a>.</p>
      </LegalSection>
    </LegalPage>
  )
}

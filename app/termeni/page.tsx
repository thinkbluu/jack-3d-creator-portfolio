import type { Metadata } from 'next'
import LegalPage, { LegalSection } from '@/components/LegalPage'

export const metadata: Metadata = {
  title: 'Termeni și condiții',
  description: 'Termenii de utilizare ai site-ului maststudio.ro și informații despre serviciile MAST Studio.',
  alternates: { canonical: '/termeni' },
}

export default function TermsPage() {
  return (
    <LegalPage eyebrow="Document juridic" title="Termeni și condiții" updated="14 iulie 2026">
      <LegalSection title="1. Operatorul site-ului">
        <p>maststudio.ro este operat de MAST Consult S.R.L., sediu social [DE COMPLETAT], CUI [DE COMPLETAT], Registrul Comerțului [DE COMPLETAT], cu punct de contact la contact@maststudio.ro.</p>
      </LegalSection>
      <LegalSection title="2. Rolul site-ului">
        <p>Site-ul prezintă serviciile MAST Studio și facilitează solicitarea unei discuții sau oferte. Informațiile generale, prețurile „de la” și termenele orientative nu reprezintă singure o ofertă contractuală fermă.</p>
      </LegalSection>
      <LegalSection title="3. Oferte și contractare">
        <p>Obiectul, livrabilele, calendarul, prețul, numărul de revizii și condițiile de plată se stabilesc în oferta sau contractul acceptat de ambele părți. Termenele încep după îndeplinirea condițiilor convenite, inclusiv primirea conținutului și a avansului, dacă sunt aplicabile.</p>
      </LegalSection>
      <LegalSection title="4. Obligațiile clientului">
        <p>Clientul furnizează la timp informații corecte, feedback, aprobări și materiale asupra cărora deține drepturile necesare. Întârzierile sau schimbările de scop pot modifica termenul și costul proiectului.</p>
      </LegalSection>
      <LegalSection title="5. Proprietate intelectuală">
        <p>Conținutul, identitatea și elementele acestui site aparțin MAST Studio sau licențiatorilor săi. Drepturile asupra livrabilelor pentru clienți sunt cele prevăzute în contract și se transferă numai în condițiile stabilite acolo, de regulă după plata integrală.</p>
      </LegalSection>
      <LegalSection title="6. Disponibilitate și răspundere">
        <p>Depunem eforturi rezonabile pentru acuratețe și disponibilitate, dar site-ul poate fi întrerupt pentru mentenanță sau cauze externe. În limitele legii, nu răspundem pentru pierderi indirecte rezultate exclusiv din utilizarea informațiilor generale de pe site ori din serviciile externe accesate prin linkuri.</p>
      </LegalSection>
      <LegalSection title="7. Reclamații și litigii">
        <p>Te rugăm să ne contactezi mai întâi pentru soluționare amiabilă. Consumatorii pot utiliza mecanismele ANPC SAL indicate în footer. Platforma europeană SOL este menționată informativ, în măsura în care serviciul rămâne disponibil și aplicabil. Se aplică legea română, fără a limita drepturile imperative ale consumatorilor.</p>
      </LegalSection>
      <LegalSection title="8. Modificări">
        <p>Putem actualiza acești termeni pentru schimbări ale serviciilor sau legislației. Versiunea aplicabilă utilizării site-ului este cea publicată aici la data accesării.</p>
      </LegalSection>
    </LegalPage>
  )
}

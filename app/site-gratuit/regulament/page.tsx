import Link from 'next/link'
import LegalPage, { LegalSection } from '@/components/LegalPage'
import { CLAIM_DAYS, CONTEST_HASHTAG, CONTEST_NAME, CONTEST_PATH, PRIZE_VALUE_EUR } from '@/lib/contest/config'
import { pageMetadata } from '@/lib/seo'
import { EMAIL, EMAIL_HREF, INSTAGRAM_HANDLE, LEGAL_NAME, REGISTERED_OFFICE, TRADE_REGISTER_NUMBER, VAT_ID } from '@/lib/site'

const path = '/site-gratuit/regulament'
const title = 'Regulament concurs: site gratuit lunar'
const description =
  'Regulamentul oficial al concursului MAST Studio „Site gratuit în fiecare lună”: cine participă, cum se alege câștigătorul, premiul și datele personale.'

export const metadata = pageMetadata({ title, description, path })

const linkClass = 'text-[var(--brass-ink)] underline underline-offset-4'

export default function ContestRulesPage() {
  return (
    <LegalPage eyebrow="Regulament oficial" title={`Regulamentul concursului „${CONTEST_NAME}”`} description={description} path={path} updated="2 octombrie 2026">
      <LegalSection title="1. Organizatorul">
        <p>
          Concursul „{CONTEST_NAME}” (denumit în continuare „concursul”) este organizat de {LEGAL_NAME}, cu sediul social în {REGISTERED_OFFICE}, CUI {VAT_ID}, număr Registrul Comerțului {TRADE_REGISTER_NUMBER}, prin divizia sa MAST Studio (denumită în continuare „organizatorul”).
        </p>
      </LegalSection>

      <LegalSection title="2. Durata și rundele">
        <p>
          Concursul începe la data publicării acestui regulament pe maststudio.ro și se desfășoară pe perioadă nedeterminată, în runde lunare. Fiecare rundă corespunde unei luni calendaristice și se încheie în ultima zi a lunii, la ora 23:59, ora României.
        </p>
        <p>În fiecare rundă se acordă un singur premiu.</p>
      </LegalSection>

      <LegalSection title="3. Cine poate participa">
        <p>
          Pot participa afacerile înregistrate în România (societăți, persoane fizice autorizate, întreprinderi individuale sau familiale, organizații neguvernamentale), reprezentate la înscriere de o persoană de cel puțin 18 ani.
        </p>
        <p>Nu pot participa:</p>
        <ul className="list-disc pl-6">
          <li>afacerile care au avut deja un proiect plătit cu MAST Studio;</li>
          <li>afacerile care au câștigat deja premiul într-o rundă anterioară;</li>
          <li>angajații și colaboratorii organizatorului și rudele lor de gradul I.</li>
        </ul>
        <p>O afacere participă cu o singură înscriere și o singură postare în fiecare rundă.</p>
      </LegalSection>

      <LegalSection title="4. Cum participi">
        <ol className="list-decimal pl-6">
          <li>
            Te înscrii prin formularul de pe{' '}
            <Link href={CONTEST_PATH} className={linkClass}>
              maststudio.ro/site-gratuit
            </Link>{' '}
            și confirmi adresa de e-mail prin linkul primit. Înscrierile neconfirmate în 3 zile nu sunt valabile.
          </li>
          <li>Publici, în luna rundei, o postare care respectă cerințele de la punctul 5.</li>
          <li>Adaugi linkul postării pe pagina ta de participare, cel târziu până la finalul rundei.</li>
        </ol>
        <p>
          După confirmare, participi în runda din luna respectivă. Poți participa și în rundele următoare, cu o postare nouă, publicată în luna rundei. Participarea este gratuită și nu presupune nicio cumpărare.
        </p>
      </LegalSection>

      <LegalSection title="5. Cerințele postării">
        <ul className="list-disc pl-6">
          <li>
            este publicată pe Instagram, din contul afacerii, sau pe pagina de Facebook a afacerii; postările de pe profiluri personale de Facebook nu sunt acceptate;
          </li>
          <li>prezintă afacerea și explică de ce are nevoie de un site;</li>
          <li>
            etichetează contul MAST Studio ({INSTAGRAM_HANDLE} pe Instagram, pagina MAST Studio pe Facebook) și conține {CONTEST_HASHTAG};
          </li>
          <li>rămâne publică, cu numărul de aprecieri vizibil, până la desemnarea câștigătorului;</li>
          <li>nu conține conținut ilegal, ofensator sau care încalcă drepturile altor persoane.</li>
        </ul>
      </LegalSection>

      <LegalSection title="6. Desemnarea câștigătorului">
        <p>
          În primele 5 zile lucrătoare de după încheierea rundei, organizatorul numără aprecierile (like-urile) afișate public la fiecare postare validă. Câștigă postarea cu cele mai multe aprecieri. La egalitate, câștigă postarea al cărei link a fost trimis primul.
        </p>
        <p>
          Postările care nu respectă regulamentul sau ale căror aprecieri sunt obținute artificial (cumpărate, prin conturi false sau prin schimburi automate de aprecieri) sunt descalificate. Organizatorul poate verifica oricând aceste aspecte.
        </p>
      </LegalSection>

      <LegalSection title="7. Premiul">
        <p>
          Premiul este un site de prezentare construit de MAST Studio, cu o valoare comercială de {PRIZE_VALUE_EUR} EUR: până la 5 pagini, design personalizat, texte scrise pe baza informațiilor primite de la câștigător, versiune pentru telefon, buton WhatsApp, formular de contact, optimizare SEO de bază și instructaj la predare.
        </p>
        <p>
          Premiul nu include domeniul și găzduirea (plătite de câștigător, pe numele afacerii sale, orientativ 50-120 EUR pe an), mentenanța, paginile sau funcțiile suplimentare, un magazin online sau fotografiile profesionale.
        </p>
        <p>
          Site-ul se livrează după ce câștigătorul trimite materialele necesare (informații despre servicii, logo dacă există, fotografii, date de contact), într-un termen stabilit de comun acord, de cel mult 30 de zile de la primirea materialelor. Premiul nu poate fi schimbat în bani și nu poate fi transferat altei persoane.
        </p>
      </LegalSection>

      <LegalSection title="8. Confirmarea premiului">
        <p>
          Câștigătorul este anunțat prin e-mail și are {CLAIM_DAYS} zile să confirme premiul, prin linkul primit. Dacă nu îl confirmă în acest termen, premiul se acordă următoarei postări valide din clasament, după aceeași regulă.
        </p>
      </LegalSection>

      <LegalSection title="9. Taxe">
        <p>
          Organizatorul își îndeplinește obligațiile fiscale care îi revin conform Codului fiscal, inclusiv, după caz, calcularea, reținerea și plata impozitului pe veniturile din premii. Orice alte obligații fiscale ale câștigătorului rămân în sarcina acestuia.
        </p>
      </LegalSection>

      <LegalSection title="10. Date personale">
        <p>
          Pentru concurs prelucrăm numele, adresa de e-mail, telefonul (opțional), datele afacerii, linkul postării și răspunsurile la acordurile din formular. Le folosim pentru organizarea concursului, contactarea participanților, desemnarea și anunțarea câștigătorului și pentru obligațiile legale ale organizatorului. Temeiul este executarea acestui regulament, pe care îl accepți la înscriere, obligația legală și, pentru newsletter și pentru publicarea numelui câștigătorului, consimțământul tău separat.
        </p>
        <p>
          Înscrierile neconfirmate se șterg după 7 zile. Datele participanților se șterg la 12 luni după ultima rundă la care au participat. Datele câștigătorilor se păstrează cât cer obligațiile fiscale și contabile. Te poți retrage oricând de pe pagina ta de participare și poți cere ștergerea datelor scriind la{' '}
          <a href={EMAIL_HREF} className={linkClass}>
            {EMAIL}
          </a>
          . Detalii în{' '}
          <Link href="/confidentialitate" className={linkClass}>
            Politica de confidențialitate
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="11. Anunțarea câștigătorilor">
        <p>
          Numele afacerii câștigătoare, orașul și site-ul realizat pot fi publicate pe maststudio.ro și pe rețelele sociale MAST Studio numai cu acordul câștigătorului, dat la confirmarea premiului.
        </p>
      </LegalSection>

      <LegalSection title="12. Instagram și Facebook">
        <p>
          Concursul nu este sponsorizat, susținut, administrat sau asociat în vreun fel cu Instagram, Facebook sau Meta. Participanții înțeleg că furnizează datele către organizator, nu către Meta, și eliberează Meta de orice răspundere legată de concurs.
        </p>
      </LegalSection>

      <LegalSection title="13. Răspundere">
        <p>
          Organizatorul nu răspunde pentru postările care nu pot fi verificate din cauza setărilor de confidențialitate ale participanților, pentru e-mailurile care nu ajung din cauza unor adrese greșite sau a filtrelor de spam ori pentru imposibilitatea câștigătorului de a trimite materialele necesare.
        </p>
      </LegalSection>

      <LegalSection title="14. Litigii">
        <p>
          Eventualele neînțelegeri se rezolvă pe cale amiabilă. Dacă acest lucru nu este posibil, litigiile se soluționează de instanțele competente din România.
        </p>
      </LegalSection>

      <LegalSection title="15. Modificarea și încetarea concursului">
        <p>
          Organizatorul poate modifica regulamentul sau poate opri concursul, anunțând schimbarea pe această pagină cu cel puțin 15 zile înainte. Modificările nu afectează runda aflată în desfășurare.
        </p>
      </LegalSection>

      <LegalSection title="16. Disponibilitatea regulamentului">
        <p>
          Regulamentul este disponibil gratuit oricărei persoane interesate, pe această pagină. Pentru întrebări, scrie-ne la{' '}
          <a href={EMAIL_HREF} className={linkClass}>
            {EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  )
}

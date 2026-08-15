export type BlogCategory = 'ghid' | 'comparatie' | 'sfat'

export type BlogFaqItem = {
  question: string
  answer: string
}

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  categoryLabel: string
  readMin: number
  publishedAt: string
  updatedAt?: string
  body: string
  seoTitle?: string
  seoDescription?: string
  faqItems?: BlogFaqItem[]
}

export const posts: BlogPost[] = [
  {
    slug: 'cat-costa-un-site-in-romania',
    title: 'Cât costă un site în România, în 2026',
    excerpt: 'Prețuri reale pentru site-uri de prezentare, magazine online și aplicații. Ce e inclus, ce nu e, și de ce cel mai ieftin site costă de obicei cel mai mult.',
    category: 'ghid',
    categoryLabel: 'Ghid',
    readMin: 7,
    publishedAt: '2026-08-14',
    seoTitle: 'Cât costă un site în România în 2026 | Prețuri reale, fără ocolișuri',
    seoDescription: 'Prețuri reale pentru site de prezentare, magazin online și aplicații web în România. Ce e inclus în preț, ce se plătește separat și cum alegi corect.',
    faqItems: [
      {
        question: 'Cât costă un site de prezentare în România?',
        answer: 'Între 100 EUR la freelanceri fără experiență și peste 3.000 EUR la agenții mari. Zona realistă pentru un site bun, cu design personalizat și texte incluse, este 300-800 EUR. Sub 250 EUR primești aproape sigur o temă de-a gata, doar recolorată.',
      },
      {
        question: 'Cât costă un magazin online?',
        answer: 'Un magazin funcțional, cu catalog, plată cu cardul, gestionare comenzi și integrare cu facturarea, costă de obicei între 900 și 2.500 EUR. Sub 900 EUR primești o temă instalată rapid, fără personalizare reală și fără optimizare.',
      },
      {
        question: 'Ce nu este inclus, de obicei, în prețul unui site?',
        answer: 'Domeniul și găzduirea (între 50 și 120 EUR pe an, plătite pe numele tău), fotografiile profesionale, integrările avansate cu programe de facturare sau curierat, și campaniile de promovare. Textele sunt incluse la unii furnizori și excluse la alții, deci întreabă explicit.',
      },
      {
        question: 'De ce un site ieftin costă mai mult pe termen lung?',
        answer: 'Pentru că se construiește pe o temă de-a gata: se încarcă greu, seamănă cu alte mii de site-uri, se strică la actualizări și nu poate fi extinsă. Costul real apare în 18-24 de luni, când trebuie refăcut de la zero, plus clienții pierduți între timp.',
      },
      {
        question: 'Cât durează construcția unui site?',
        answer: 'Depinde de tip și de cât de repede vin materialele de la client. Un site de prezentare poate fi gata în 48 de ore dacă textele și pozele sunt pregătite. Un magazin online are nevoie de aproximativ 7 zile. Aplicațiile și platformele se estimează individual.',
      },
    ],
    body: `
<p>Dacă ai căutat vreodată „cât costă un site”, ai găsit fie răspunsuri evazive de tipul „depinde de complexitate”, fie formulare de contact. Articolul ăsta îți dă cifrele reale din piața românească, ce se ascunde în spatele lor și cum să alegi fără să plătești de două ori.</p>

<h2>Site de prezentare</h2>

<p>Este cel mai comun tip de site: spune cine ești, ce faci și cum poate clientul să te contacteze. Potrivit pentru saloane, cabinete, firme de servicii, meșteșugari, restaurante și orice afacere care vrea să fie găsită și să inspire încredere.</p>

<ul>
  <li><strong>100-250 EUR:</strong> temă cumpărată, instalată în câteva ore. Arată ca alte mii de site-uri, se încarcă greu pe telefon și nu poate fi modificată ușor.</li>
  <li><strong>300-800 EUR:</strong> design personalizat, texte scrise de furnizor, optimizare pentru viteză și mobil. Zona în care lucrează studiourile mici serioase.</li>
  <li><strong>800-2.000 EUR:</strong> agenții cu echipă și project manager, mai multe runde de revizii, adesea cu identitate vizuală inclusă.</li>
  <li><strong>Peste 2.000 EUR:</strong> agenții mari sau proiecte cu funcționalități speciale.</li>
</ul>

<h2>Magazin online</h2>

<p>Dacă vrei ca oamenii să plătească direct pe site, ai nevoie de magazin. Complexitatea crește: catalog de produse, coș, plăți, comenzi, facturi, livrare.</p>

<ul>
  <li><strong>Sub 500 EUR:</strong> temă WooCommerce sau Shopify instalată rapid, fără personalizare, adesea cu costuri lunare de platformă peste care se adaugă comisioane.</li>
  <li><strong>900-1.800 EUR:</strong> magazin funcțional cu design propriu, plăți integrate, gestionare comenzi și legătură cu programul de facturare. Zona realistă pentru un magazin care chiar vinde.</li>
  <li><strong>Peste 2.000 EUR:</strong> cataloage mari, integrări cu ERP sau curieri, automatizări de stoc.</li>
</ul>

<h2>Aplicații și platforme</h2>

<p>Un sistem de rezervări, o platformă cu conturi și abonamente, un instrument intern pentru echipă. Pornesc de la aproximativ 1.500 EUR pentru ceva simplu și nu au un plafon clar, pentru că depind de ce trebuie să facă. Orice furnizor serios îți dă o estimare după o discuție de treizeci de minute, nu un preț pe loc.</p>

<h2>Ce e inclus și ce se plătește separat</h2>

<p>Aici se nasc majoritatea neînțelegerilor. Întreabă explicit, înainte de avans, ce intră în preț.</p>

<p><strong>De obicei inclus:</strong> designul, implementarea, versiunea pentru telefon, instructajul de folosire la predare.</p>

<p><strong>De obicei separat, dar ar trebui spus din start:</strong></p>

<ul>
  <li><strong>Domeniul și găzduirea:</strong> 50-120 EUR pe an. Important: trebuie cumpărate pe numele firmei tale, nu al furnizorului.</li>
  <li><strong>Textele:</strong> unii le scriu, alții așteaptă să le trimiți tu. Diferența în efort e uriașă.</li>
  <li><strong>Fotografiile profesionale:</strong> dacă nu ai, costă separat. Pozele proaste strică și cel mai bun design.</li>
  <li><strong>Integrarea cu facturarea</strong> (SmartBill, Oblio) și cu e-Factura, obligatorie pentru firmele din România.</li>
  <li><strong>Promovarea:</strong> SEO avansat sau campanii de reclame sunt servicii separate de construcția site-ului.</li>
</ul>

<h2>De ce cel mai ieftin site costă cel mai mult</h2>

<p>Logica e simplă. Un site de 150 EUR înseamnă o temă gata făcută, aplicată în câteva ore. Tema aceea e folosită de alte câteva mii de site-uri, se încarcă lent pentru că vine cu funcții de care nu ai nevoie, și se strică la fiecare actualizare majoră a platformei.</p>

<p>Costul real apare mai târziu: în optsprezece-douăzeci și patru de luni ajungi să-l refaci de la zero, iar între timp pierzi clienți din cauza vitezei mici și a lipsei de încredere pe care o transmite un site care arată ca oricare altul.</p>

<blockquote>Nu cel mai ieftin site te costă cel mai puțin. Cel care îți aduce clienți costă cel mai puțin.</blockquote>

<h2>Trei întrebări înainte să dai avans</h2>

<ol>
  <li><strong>Îmi dai prețul final, în scris, înainte să începem?</strong> Dacă răspunsul e vag sau „depinde ce mai apare pe parcurs”, costul final va fi altul decât cel discutat.</li>
  <li><strong>Pot vedea site-ul terminat înainte să plătesc tot?</strong> Orice furnizor cu încredere în propria muncă acceptă asta. Dacă refuză, întreabă de ce.</li>
  <li><strong>Domeniul, găzduirea și accesele sunt pe numele meu?</strong> Trebuie să fie. Altfel, dacă vrei să schimbi furnizorul, pleci fără site.</li>
</ol>

<h2>Cum lucrăm noi</h2>

<p>Site de prezentare de la <strong>300 EUR</strong>, live în <strong>48 de ore</strong> de la primirea materialelor. Magazin online de la <strong>900 EUR</strong>, live în 7 zile. Rezervi locul cu un avans de <strong>50 EUR</strong> care se scade din preț, vezi site-ul finalizat pe internet, și plătești restul doar dacă ești mulțumit.</p>

<p>Textele sunt incluse. Domeniul se cumpără pe numele firmei tale. Fără costuri surpriză și fără contract pe termen lung.</p>
    `,
  },
]

export function getAllPosts() {
  return posts
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug)
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

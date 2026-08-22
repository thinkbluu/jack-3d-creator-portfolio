export type ServicePage = {
  slug: string
  name: string
  shortName: string
  answerCapsule: string
  priceFrom: number | null
  priceLabel: string
  deliveryTime: string
  intro: string
  includes: string[]
  notIncluded: string[]
  process: { step: string; description: string }[]
  forWho: string[]
  faq: { question: string; answer: string }[]
  relatedSlugs: string[]
  waMessage: string
}

export const servicePages: ServicePage[] = [
  {
    slug: 'site-de-prezentare',
    name: 'Site de prezentare',
    shortName: 'Site de prezentare',
    answerCapsule:
      'Un site de prezentare la MAST Studio costă de la 300 EUR și este livrat live în 48 de ore de la primirea materialelor. Include design unic, texte scrise de noi, versiune pentru mobil și optimizare de viteză. Plătești un avans de 50 EUR, restul doar dacă ești mulțumit de rezultat.',
    priceFrom: 300,
    priceLabel: 'de la 300 EUR',
    deliveryTime: '48 de ore',
    intro:
      'Site-ul de prezentare e primul lucru pe care un client potențial îl vede despre afacerea ta. Îl construim ca să spună clar ce faci, să inspire încredere și să transforme vizitatorii în mesaje și telefoane, nu doar în vizite fără urmă.',
    includes: [
      'design unic construit pentru afacerea ta',
      'copywriting complet',
      'până la 5 pagini',
      'versiune optimizată pentru telefon',
      'optimizare de viteză',
      'integrare buton WhatsApp',
      'formular de contact',
      'optimizare SEO de bază',
      'instructaj la predare',
    ],
    notIncluded: [
      'domeniul și găzduirea (50-120 EUR pe an, pe numele firmei tale)',
      'fotografiile profesionale',
      'campaniile de promovare',
    ],
    process: [
      { step: 'Ne scrii pe WhatsApp sau e-mail', description: 'Ne spui ce faci și ce vrei. Primești o ofertă cu preț fix în aceeași zi.' },
      { step: 'Trimiți materialele de bază', description: 'Texte, poze, siglă, ce ai deja. Din momentul în care le primim, pornește termenul de 48 de ore.' },
      { step: 'Construim și îți trimitem un link live', description: 'Vezi site-ul funcțional, nu un mockup. Ceri modificări dacă e nevoie.' },
      { step: 'Plătești restul și primești predarea completă', description: 'Accesele, documentația și un scurt instructaj de folosire.' },
    ],
    forWho: [
      'cabinete medicale și veterinare',
      'saloane și clinici de înfrumusețare',
      'firme de servicii și meseriași',
      'consultanți și profesii liberale',
      'restaurante și cafenele',
    ],
    faq: [
      {
        question: 'Cât costă exact un site de prezentare?',
        answer: 'De la 300 EUR pentru o pagină simplă, cu design personalizat, texte incluse și optimizare de viteză. Prețul final depinde de numărul de pagini și de câte materiale ai deja pregătite.',
      },
      {
        question: 'De ce este livrat în doar 48 de ore?',
        answer: 'Pentru că avem un proces fix, repetabil, fără etape inutile și fără intermediari. Cronometrul pornește din momentul în care primim materialele tale, nu din momentul semnării.',
      },
      {
        question: 'Ce se întâmplă dacă nu am texte sau poze pregătite?',
        answer: 'Scriem noi textele ca parte din pachet. Pentru fotografii profesionale te putem recomanda un fotograf, dar acest cost e separat de preț.',
      },
      {
        question: 'Pot cere modificări după ce văd site-ul live?',
        answer: 'Da. Prima rundă de modificări este inclusă în preț, exact pentru că vrem să vezi rezultatul înainte să plătești restul sumei.',
      },
      {
        question: 'Site-ul e optimizat pentru Google?',
        answer: 'Da, primești optimizare SEO de bază: titluri corecte, viteză de încărcare bună și structură citibilă pentru motoarele de căutare. SEO avansat sau campanii de promovare sunt servicii separate.',
      },
    ],
    relatedSlugs: ['magazin-online', 'aplicatii-si-platforme'],
    waMessage: 'Salut! Vreau un site de prezentare, livrat în 48 de ore. Îmi poți face o ofertă?',
  },
  {
    slug: 'magazin-online',
    name: 'Magazin online',
    shortName: 'Magazin online',
    answerCapsule:
      'Un magazin online la MAST Studio costă de la 900 EUR și este livrat în 7 zile. Include catalog de produse, plată cu cardul, gestionare comenzi și integrare cu programul de facturare. Plătești un avans de 50 EUR, restul doar dacă ești mulțumit.',
    priceFrom: 900,
    priceLabel: 'de la 900 EUR',
    deliveryTime: '7 zile',
    intro:
      'Un magazin online bun vinde și când tu dormi. Construim catalogul de produse, plățile online și fluxul de comenzi ca să nu mai gestionezi manual nimic din partea tehnică, doar coletele.',
    includes: [
      'catalog de produse cu categorii și filtre',
      'coș de cumpărături și checkout optimizat',
      'plată online cu cardul',
      'gestionare comenzi din panou propriu',
      'integrare cu programul de facturare',
      'integrare cu curieri pentru livrare',
      'versiune optimizată pentru telefon',
      'optimizare SEO de bază',
      'instructaj la predare',
    ],
    notIncluded: [
      'domeniul și găzduirea (50-120 EUR pe an, pe numele firmei tale)',
      'fotografiile profesionale ale produselor',
      'campaniile de promovare',
    ],
    process: [
      { step: 'Ne scrii pe WhatsApp sau e-mail', description: 'Ne spui ce vinzi și câte produse ai. Primești o ofertă cu preț fix în aceeași zi.' },
      { step: 'Trimiți catalogul de produse', description: 'Poze, prețuri, descrieri, ce ai deja. Din momentul în care le primim, pornește termenul de 7 zile.' },
      { step: 'Construim și îți trimitem un link live', description: 'Testezi tot fluxul, de la catalog la plată, înainte să plătești restul.' },
      { step: 'Plătești restul și primești predarea completă', description: 'Accesele, documentația și instructajul de administrare a magazinului.' },
    ],
    forWho: [
      'comercianți cu produse fizice',
      'producători mici și artizani',
      'magazine care vor și vânzare online, nu doar fizică',
      'branduri care vând direct către consumator',
      'distribuitori care vor un canal de vânzare propriu',
    ],
    faq: [
      {
        question: 'Cât costă exact un magazin online?',
        answer: 'De la 900 EUR pentru un catalog cu plăți integrate și gestionare de comenzi. Prețul final depinde de numărul de produse și de integrările necesare (facturare, curieri, ERP).',
      },
      {
        question: 'Ce metode de plată pot avea clienții mei?',
        answer: 'Plată cu cardul integrată direct în magazin, prin procesatorii de plăți disponibili în România. Putem adăuga și plata la livrare sau transfer bancar, la cerere.',
      },
      {
        question: 'Magazinul se integrează cu facturarea mea?',
        answer: 'Da, integrăm magazinul cu programe de facturare precum SmartBill sau Oblio, astfel încât facturile să se emită automat la fiecare comandă.',
      },
      {
        question: 'Câte produse pot avea în magazin?',
        answer: 'Nu există o limită fixă în platformă. Numărul de produse afectează timpul de populare a catalogului, care poate crește termenul de livrare peste cele 7 zile standard.',
      },
      {
        question: 'Pot să-mi administrez singur magazinul după predare?',
        answer: 'Da. Primești acces la un panou de administrare din care adaugi produse, urmărești comenzile și gestionezi stocul, plus un instructaj complet la predare.',
      },
    ],
    relatedSlugs: ['site-de-prezentare', 'aplicatii-si-platforme'],
    waMessage: 'Salut! Vreau un magazin online. Îmi poți face o ofertă?',
  },
  {
    slug: 'aplicatii-si-platforme',
    name: 'Aplicații și platforme',
    shortName: 'Aplicații și platforme',
    answerCapsule:
      'Aplicațiile web și platformele personalizate se estimează individual, iar oferta vine în 24 de ore de la prima discuție. Construim de la instrumente interne care automatizează procese repetitive până la platforme complete cu conturi, abonamente și plăți.',
    priceFrom: null,
    priceLabel: 'ofertă personalizată',
    deliveryTime: 'estimat după discuție',
    intro:
      'Dacă un proces din afacerea ta se repetă manual de prea multe ori, sau ai o idee de produs digital cu utilizatori și abonamente, construim instrumentul potrivit — de la un panou intern simplu până la o platformă completă.',
    includes: [
      'analiză a cerințelor și a fluxului de lucru',
      'design de interfață personalizat',
      'conturi de utilizator și autentificare',
      'integrări cu alte sisteme (facturare, plăți, API-uri externe)',
      'panou de administrare',
      'testare și lansare',
      'instructaj la predare',
    ],
    notIncluded: [
      'domeniul și găzduirea (cost variabil, în funcție de infrastructură)',
      'costurile serviciilor terțe integrate (plăți, SMS, e-mail)',
      'mentenanța continuă după perioada de garanție',
    ],
    process: [
      { step: 'Ne scrii pe WhatsApp sau e-mail', description: 'Descrii procesul sau ideea. Programăm o discuție scurtă de 30 de minute.' },
      { step: 'Primești oferta în 24 de ore', description: 'Preț fix, termen estimat și scopul exact al primei versiuni.' },
      { step: 'Construim în etape, cu acces la progres', description: 'Vezi platforma funcțională pe măsură ce avansăm, nu doar la final.' },
      { step: 'Lansare și predare completă', description: 'Accesele, documentația tehnică și instructajul pentru echipa ta.' },
    ],
    forWho: [
      'afaceri cu procese interne repetitive',
      'echipe care au nevoie de un portal pentru clienți',
      'fondatori cu o idee de produs digital (SaaS)',
      'companii care vor un sistem de programări sau rezervări',
      'organizații care au nevoie de integrări între sisteme existente',
    ],
    faq: [
      {
        question: 'De ce nu are un preț fix afișat?',
        answer: 'Pentru că fiecare aplicație e diferită ca scop și complexitate. Un instrument intern simplu costă mult mai puțin decât o platformă completă cu abonamente și plăți, așa că prețul se stabilește după ce înțelegem exact ce trebuie construit.',
      },
      {
        question: 'Cât durează construcția unei aplicații?',
        answer: 'Depinde de complexitate: de la câteva săptămâni pentru un instrument intern simplu, până la câteva luni pentru o platformă completă cu conturi și abonamente. Termenul exact vine cu oferta.',
      },
      {
        question: 'Ce se întâmplă la prima discuție?',
        answer: 'Ne descrii procesul sau ideea, punem întrebări despre fluxul real de lucru și despre ce ar trebui să facă sistemul. Nu durează mai mult de 30 de minute și nu implică niciun cost.',
      },
      {
        question: 'Pot cere modificări în timpul construcției?',
        answer: 'Da. Construim în etape și îți dăm acces la progres pe măsură ce avansăm, exact pentru a putea ajusta direcția din timp, nu doar la final.',
      },
      {
        question: 'Oferiți mentenanță după lansare?',
        answer: 'Da, la cerere. Poți opta pentru un abonament de mentenanță și dezvoltare continuă, discutat separat, sau poți continua singur cu echipa ta folosind documentația primită la predare.',
      },
    ],
    relatedSlugs: ['site-de-prezentare', 'magazin-online'],
    waMessage: 'Salut! Am nevoie de o aplicație web sau mobilă. Putem discuta?',
  },
]

export function getAllServicePages() {
  return servicePages
}

export function getServicePageBySlug(slug: string) {
  return servicePages.find((service) => service.slug === slug)
}

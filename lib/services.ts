import { isNoDepositActive, serviceOfferCopy } from './offer'
import type { Locale } from './i18n/locale'
import { canonicalServiceSlug } from './i18n/paths'
import { serviceTextEn } from './i18n/content/services.en'

export type ServiceGroup = 'web' | 'software' | 'ai' | 'crestere'

export type ServicePage = {
  slug: string
  /** Family the service belongs to; groups /servicii, the homepage deck and the footer. */
  group: ServiceGroup
  /** Name used in navigation, cards and structured data. */
  name: string
  shortName: string
  /** Visible H1, phrased the way people search for the service. */
  h1: string
  /** Title tag without the brand suffix (keep it under 46 characters). */
  seoTitle: string
  /** Meta description, 120-158 characters. */
  metaDescription: string
  answerCapsule: string
  priceFrom: number | null
  /** UN/CEFACT unit code for recurring prices, e.g. `MON` for monthly. */
  priceUnit?: 'MON'
  priceLabel: string
  deliveryLabel: string
  deliveryTime: string
  intro: string
  includes: string[]
  notIncluded: string[]
  process: { step: string; description: string }[]
  forWho: string[]
  /** Optional comparative package table, shown on the service page when present. */
  packages?: { name: string; price: string; time: string; forWho: string }[]
  faq: { question: string; answer: string }[]
  relatedSlugs: string[]
  /** Blog posts that support this service, by slug. */
  relatedPosts: string[]
  /** Portfolio projects that show this service, by slug. */
  projectSlugs: string[]
  waMessage: string
  serviceType: string
  updatedAt: string
}

export const servicePages: ServicePage[] = [
  {
    slug: 'site-de-prezentare',
    group: 'web',
    name: 'Site de prezentare',
    shortName: 'Site de prezentare',
    h1: 'Creare site de prezentare',
    seoTitle: 'Creare site de prezentare, de la 300 EUR',
    metaDescription:
      'Creare site de prezentare pentru afaceri mici: design unic, texte incluse, până la 5 pagini. De la 300 EUR, live în 48 de ore după materiale.',
    answerCapsule:
      'Un site de prezentare la MAST Studio costă de la 300 EUR și este livrat live în 48 de ore de la primirea materialelor. Include design unic, texte scrise de noi, versiune pentru mobil și optimizare de viteză. Plătești un avans de 50 EUR, restul doar dacă ești mulțumit de rezultat.',
    priceFrom: 300,
    priceLabel: 'de la 300 EUR',
    deliveryLabel: 'Termen de livrare',
    deliveryTime: '48 de ore după materiale',
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
      { step: 'Construim și îți trimitem un link live', description: 'Vezi site-ul funcțional, nu o machetă. Ceri modificări dacă e nevoie.' },
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
        answer:
          'De la 300 EUR pentru un site de prezentare de până la 5 pagini, cu design personalizat, texte incluse și optimizare de viteză. Prețul final depinde de numărul de pagini și de câte materiale ai deja pregătite.',
      },
      {
        question: 'De ce este livrat în doar 48 de ore?',
        answer:
          'Pentru că avem un proces fix, repetabil, fără etape inutile și fără intermediari. Cronometrul pornește din momentul în care primim materialele tale, nu din momentul semnării.',
      },
      {
        question: 'Ce se întâmplă dacă nu am texte sau poze pregătite?',
        answer:
          'Scriem noi textele ca parte din pachet. Pentru fotografii profesionale te putem recomanda un fotograf, dar acest cost e separat de preț.',
      },
      {
        question: 'Pot cere modificări după ce văd site-ul live?',
        answer:
          'Da. Prima rundă de modificări este inclusă în preț, exact pentru că vrem să vezi rezultatul înainte să plătești restul sumei.',
      },
      {
        question: 'Site-ul e optimizat pentru Google?',
        answer:
          'Da, primești optimizare SEO de bază: titluri corecte, viteză de încărcare bună și structură citibilă pentru motoarele de căutare. SEO avansat sau campanii de promovare sunt servicii separate.',
      },
    ],
    relatedSlugs: ['magazin-online', 'mentenanta', 'automatizari-whatsapp'],
    relatedPosts: [
      'cat-costa-un-site-in-romania',
      'cat-dureaza-constructia-unui-site',
      'conversie-site-prezentare',
      'cum-alegi-firma-web-design',
      'site-prezentare-sau-magazin-online',
    ],
    projectSlugs: ['veterinaria-timisoara', 'agd-innerpath-consulting', 'painea-casei'],
    waMessage: 'Salut! Vreau un site de prezentare, livrat în 48 de ore. Îmi poți face o ofertă?',
    serviceType: 'Creare site de prezentare',
    updatedAt: '2026-10-02',
  },
  {
    slug: 'magazin-online',
    group: 'web',
    name: 'Magazin online',
    shortName: 'Magazin online',
    h1: 'Creare magazin online',
    seoTitle: 'Creare magazin online, de la 900 EUR',
    metaDescription:
      'Creare magazin online cu plată cu cardul, gestionare comenzi, facturare și curieri. De la 900 EUR, livrat în 7 zile după materiale. Avans 50 EUR.',
    answerCapsule:
      'Un magazin online la MAST Studio costă de la 900 EUR și este livrat în 7 zile. Include catalog de produse, plată cu cardul, gestionare comenzi și integrare cu programul de facturare. Plătești un avans de 50 EUR, restul doar dacă ești mulțumit.',
    priceFrom: 900,
    priceLabel: 'de la 900 EUR',
    deliveryLabel: 'Termen de livrare',
    deliveryTime: '7 zile după materiale',
    intro:
      'Un magazin online bun vinde și când tu dormi. Construim catalogul de produse, plățile online și fluxul de comenzi ca să nu mai gestionezi manual nimic din partea tehnică, doar coletele.',
    includes: [
      'catalog de produse cu categorii și filtre',
      'coș de cumpărături și finalizarea comenzii optimizată',
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
        answer:
          'De la 900 EUR pentru un catalog cu plăți integrate și gestionare de comenzi. Prețul final depinde de numărul de produse și de integrările necesare (facturare, curieri, ERP).',
      },
      {
        question: 'Ce metode de plată pot avea clienții mei?',
        answer:
          'Plată cu cardul integrată direct în magazin, prin procesatorii de plăți disponibili în România. Putem adăuga și plata la livrare sau transfer bancar, la cerere.',
      },
      {
        question: 'Magazinul se integrează cu facturarea mea?',
        answer:
          'Da, integrăm magazinul cu programe de facturare precum SmartBill sau Oblio, astfel încât facturile să se emită automat la fiecare comandă.',
      },
      {
        question: 'Câte produse pot avea în magazin?',
        answer:
          'Nu există o limită fixă în platformă. Numărul de produse afectează timpul de populare a catalogului, care poate crește termenul de livrare peste cele 7 zile standard.',
      },
      {
        question: 'Pot să-mi administrez singur magazinul după predare?',
        answer:
          'Da. Primești acces la un panou de administrare din care adaugi produse, urmărești comenzile și gestionezi stocul, plus un instructaj complet la predare.',
      },
    ],
    relatedSlugs: ['site-de-prezentare', 'automatizari-whatsapp', 'mentenanta'],
    relatedPosts: [
      'cat-costa-magazin-online',
      'ce-e-efactura-magazin-online',
      'magazin-online-vs-instagram',
      'site-prezentare-sau-magazin-online',
    ],
    projectSlugs: [],
    waMessage: 'Salut! Vreau un magazin online. Îmi poți face o ofertă?',
    serviceType: 'Creare magazin online',
    updatedAt: '2026-10-02',
  },
  {
    slug: 'aplicatii-web',
    group: 'software',
    name: 'Aplicații web și mobile',
    shortName: 'Aplicații web și mobile',
    h1: 'Dezvoltare aplicații web și mobile',
    seoTitle: 'Dezvoltare aplicații web și mobile',
    metaDescription:
      'Aplicații web și mobile pentru procese interne, portaluri de clienți și programări. Ofertă cu preț fix în 24 de ore, construcție în etape, predare completă.',
    answerCapsule:
      'Aplicațiile web și mobile se estimează individual, iar oferta cu preț fix vine în 24 de ore de la prima discuție. Construim instrumente interne care automatizează procese repetitive, portaluri pentru clienți și sisteme de programări, în etape, cu acces la progres.',
    priceFrom: null,
    priceLabel: 'ofertă personalizată',
    deliveryLabel: 'Termen de livrare',
    deliveryTime: 'estimat în ofertă',
    intro:
      'Dacă un proces din afacerea ta se repetă manual de prea multe ori — oferte, programări, evidențe ținute în Excel — îl transformăm într-o aplicație pe care echipa ta chiar o folosește, de pe calculator sau de pe telefon.',
    includes: [
      'analiză a cerințelor și a fluxului de lucru',
      'design de interfață personalizat',
      'conturi de utilizator și roluri',
      'integrări cu alte sisteme (facturare, plăți, API-uri externe)',
      'panou de administrare',
      'interfață gândită pentru telefon și calculator',
      'testare și lansare',
      'instructaj la predare',
    ],
    notIncluded: [
      'domeniul și găzduirea (cost variabil, în funcție de infrastructură)',
      'costurile serviciilor terțe integrate (plăți, SMS, e-mail)',
      'mentenanța continuă după perioada de garanție',
    ],
    process: [
      { step: 'Ne scrii pe WhatsApp sau e-mail', description: 'Descrii procesul pe care vrei să-l rezolvi. Programăm o discuție scurtă de 30 de minute.' },
      { step: 'Primești oferta în 24 de ore', description: 'Preț fix, termen estimat și scopul exact al primei versiuni.' },
      { step: 'Construim în etape, cu acces la progres', description: 'Vezi aplicația funcțională pe măsură ce avansăm, nu doar la final.' },
      { step: 'Lansare și predare completă', description: 'Accesele, documentația tehnică și instructajul pentru echipa ta.' },
    ],
    forWho: [
      'afaceri cu procese interne repetitive',
      'echipe care au nevoie de un portal pentru clienți',
      'companii care vor un sistem de programări sau rezervări',
      'organizații care au nevoie de integrări între sisteme existente',
      'firme care țin evidențe importante în Excel sau pe hârtie',
    ],
    faq: [
      {
        question: 'De ce nu are un preț fix afișat?',
        answer:
          'Pentru că fiecare aplicație e diferită ca scop și complexitate. Un instrument intern simplu costă mult mai puțin decât un sistem cu multe roluri și integrări, așa că prețul se stabilește după ce înțelegem exact ce trebuie construit.',
      },
      {
        question: 'Cât durează construcția unei aplicații?',
        answer:
          'Depinde de complexitate: de la câteva săptămâni pentru un instrument intern simplu, până la câteva luni pentru un sistem cu multe roluri și integrări. Termenul exact vine cu oferta.',
      },
      {
        question: 'Ce se întâmplă la prima discuție?',
        answer:
          'Ne descrii procesul, punem întrebări despre fluxul real de lucru și despre ce ar trebui să facă aplicația. Nu durează mai mult de 30 de minute și nu implică niciun cost.',
      },
      {
        question: 'Pot cere modificări în timpul construcției?',
        answer:
          'Da. Construim în etape și îți dăm acces la progres pe măsură ce avansăm, exact pentru a putea ajusta direcția din timp, nu doar la final.',
      },
      {
        question: 'Oferiți mentenanță după lansare?',
        answer:
          'Da, la cerere. Poți opta pentru un abonament de mentenanță și dezvoltare continuă, discutat separat, sau poți continua cu echipa ta folosind documentația primită la predare.',
      },
    ],
    relatedSlugs: ['platforme-saas', 'automatizari-whatsapp', 'mentenanta'],
    relatedPosts: ['cat-costa-aplicatie-web', 'automatizari-whatsapp-afacere-mica'],
    projectSlugs: [],
    waMessage: 'Salut! Am nevoie de o aplicație web sau mobilă. Putem discuta?',
    serviceType: 'Dezvoltare aplicații web',
    updatedAt: '2026-10-02',
  },
  {
    slug: 'platforme-saas',
    group: 'software',
    name: 'Platforme SaaS',
    shortName: 'Platforme SaaS',
    h1: 'Platforme SaaS custom',
    seoTitle: 'Platformă SaaS custom: de la idee la lansare',
    metaDescription:
      'Platforme SaaS custom: conturi, abonamente și plăți online, construite în etape de la prima versiune la primii clienți. Ofertă cu preț fix în 24 de ore.',
    answerCapsule:
      'O platformă SaaS custom se estimează individual, cu ofertă în 24 de ore de la prima discuție. Pornim de la o primă versiune clară, cu conturi, abonamente și plăți online, și o construim în etape, cu acces la progres, până la primii utilizatori care plătesc.',
    priceFrom: null,
    priceLabel: 'ofertă personalizată',
    deliveryLabel: 'Termen de livrare',
    deliveryTime: 'estimat în ofertă',
    intro:
      'Ai o idee de produs digital pentru care clienții să plătească lunar? Te ajutăm să o transformi ����ntr-o platformă reală: stabilim împreună ce intră în prima versiune, o construim în etape și o lansăm fără funcții inutile care întârzie primii clienți.',
    includes: [
      'definirea primei versiuni (MVP) și a priorităților',
      'design de interfață personalizat',
      'conturi de utilizator, roluri și permisiuni',
      'abonamente și plăți online recurente',
      'panou de administrare pentru tine și echipa ta',
      'integrări cu servicii externe (facturare, e-mail, SMS)',
      'testare și lansare',
      'documentație tehnică la predare',
    ],
    notIncluded: [
      'găzduirea și infrastructura (cost variabil, în funcție de numărul de utilizatori)',
      'costurile serviciilor terțe (procesator de plăți, e-mail, SMS)',
      'marketingul și campaniile de lansare',
    ],
    process: [
      { step: 'Ne descrii ideea', description: 'Pe WhatsApp sau e-mail, apoi într-o discuție scurtă de 30 de minute despre clienți, problemă și modelul de abonament.' },
      { step: 'Primești oferta în 24 de ore', description: 'Preț fix pentru prima versiune, termen estimat și lista exactă a funcțiilor incluse.' },
      { step: 'Construim în etape, cu acces la progres', description: 'Vezi platforma funcțională pe măsură ce avansăm și ajustăm direcția din timp.' },
      { step: 'Lansare și predare completă', description: 'Accesele, documentația tehnică și un plan pentru versiunile următoare.' },
    ],
    forWho: [
      'fondatori cu o idee de produs digital',
      'afaceri care vor să-și transforme experiența într-un abonament',
      'firme care vor să vândă un instrument intern și altor companii',
      'proiecte care au nevoie de conturi, abonamente și plăți',
    ],
    faq: [
      {
        question: 'Cât costă o platformă SaaS custom?',
        answer:
          'Depinde de ce intră în prima versiune, de aceea nu afișăm un preț fix. După o discuție scurtă primești în 24 de ore o ofertă cu preț fix pentru prima versiune și un termen estimat.',
      },
      {
        question: 'Ce este un MVP și de ce începem cu el?',
        answer:
          'MVP înseamnă prima versiune pe care o pot folosi clienți reali, cu funcțiile strict necesare. Afli repede dacă oamenii plătesc pentru produs, înainte să investești în funcții pe care poate nu le folosește nimeni.',
      },
      {
        question: 'Cine deține codul platformei?',
        answer:
          'Tu. La predare primești accesele și documentația tehnică, la fel ca la orice proiect MAST Studio, și poți continua dezvoltarea cu noi sau cu altă echipă.',
      },
      {
        question: 'Pot cere modificări în timpul construcției?',
        answer:
          'Da. Construim în etape și îți dăm acces la progres pe măsură ce avansăm, exact pentru a putea ajusta direcția din timp, nu doar la final.',
      },
      {
        question: 'Ce se întâmplă după lansare?',
        answer:
          'Poți continua cu un abonament de mentenanță și dezvoltare, discutat separat, sau poți merge mai departe cu echipa ta, folosind documentația primită la predare.',
      },
    ],
    relatedSlugs: ['aplicatii-web', 'mentenanta', 'automatizari-whatsapp'],
    relatedPosts: ['cat-costa-aplicatie-web'],
    projectSlugs: ['asesor'],
    waMessage: 'Salut! Vreau să construim o platformă personalizată. Putem discuta?',
    serviceType: 'Dezvoltare platforme SaaS',
    updatedAt: '2026-10-02',
  },
  {
    slug: 'design-ux-ui',
    group: 'web',
    name: 'Design UX/UI',
    shortName: 'Design UX/UI',
    h1: 'Design UX/UI pentru aplicații și platforme',
    seoTitle: 'Design UX/UI pentru aplicații, de la 250 EUR',
    metaDescription:
      'Design UX/UI pentru aplicații, platforme și SaaS. Audit de la 250 EUR, design de produs de la 1.200 EUR, prototip interactiv în Figma și predare către programator.',
    answerCapsule:
      'La MAST Studio, designul UX/UI pornește de la 250 EUR pentru auditul unui site sau al unei aplicații existente și de la 1.200 EUR pentru designul unui MVP (până la 12 ecrane cheie) în aproximativ 2 săptămâni. Primești fluxuri de utilizare, wireframe-uri, UI high-fidelity pentru desktop și mobil, prototip interactiv în Figma, un mini design system și predarea către programator.',
    priceFrom: 250,
    priceLabel: 'de la 250 EUR',
    deliveryLabel: 'Termen de livrare',
    deliveryTime: '3 zile (audit) · ~2 săptămâni (sprint)',
    intro:
      'Designul UX/UI e pentru aplicații, platforme și SaaS, pentru redesign-uri și pentru echipe care au deja programator și le lipsește designul. Pentru un site de prezentare simplu, designul e deja inclus în serviciul „Site de prezentare”. Aici lucrăm pe produs: fluxuri, ecrane, prototip și un design system pe care programatorul îl poate urma fără interpretări.',
    includes: [
      'apel de descoperire și brief',
      'fluxuri de utilizare',
      'wireframe-uri',
      'UI high-fidelity pentru desktop și mobil',
      'prototip interactiv în Figma',
      'mini design system: culori, tipografie, componente cu stări',
      'verificare de accesibilitate (WCAG AA)',
      'predare către programator: Figma Dev Mode, asset-uri exportate, specificație',
      '2 runde de modificări',
      '30 de zile de suport pentru programator',
    ],
    notIncluded: [
      'programarea (ofertată separat; dacă o construim noi, designul se scade din preț)',
      'testarea cu utilizatori (+300 EUR)',
      'logo și branding',
      'ilustrații și 3D',
    ],
    packages: [
      { name: 'Audit UX/UI', price: '250 EUR', time: '3 zile lucrătoare', forWho: 'Afli exact ce blochează utilizatorii înainte să investești în redesign' },
      { name: 'Sprint de design de produs', price: 'de la 1.200 EUR', time: '~2 săptămâni', forWho: 'MVP-uri și produse noi care trebuie lansate repede' },
      { name: 'Design complet de produs', price: 'de la 2.500 EUR', time: '3-6 săptămâni', forWho: 'Platforme și produse care cresc în timp' },
      { name: 'Retainer de design', price: 'de la 600 EUR/lună', time: 'lunar', forWho: 'Echipe care iterează la produs în fiecare lună' },
    ],
    process: [
      { step: 'Apel și brief', description: 'Discutăm produsul, utilizatorii și ce ecrane contează cel mai mult. Primești o ofertă cu preț fix.' },
      { step: 'Fluxuri și wireframe-uri', description: 'Desenăm drumul utilizatorului și structura ecranelor, înainte de orice culoare și stil.' },
      { step: 'UI și prototip, cu feedback', description: 'Design high-fidelity pentru desktop și mobil, legat într-un prototip interactiv în Figma. Ajustăm pe parcurs, în cele 2 runde incluse.' },
      { step: 'Predarea către programator', description: 'Figma Dev Mode, asset-uri exportate, specificație și 30 de zile de suport pentru echipa care construiește.' },
    ],
    forWho: [
      'startup-uri care construiesc un MVP',
      'platforme SaaS și aplicații B2B',
      'firme cu o aplicație sau un site care nu convertește',
      'echipe de programatori fără designer',
      'agenții care au nevoie de design în outsourcing',
    ],
    faq: [
      {
        question: 'Cât costă designul UX/UI?',
        answer:
          'Avem patru pachete: auditul UX/UI costă 250 EUR, sprintul de design de produs pornește de la 1.200 EUR, designul complet de produs de la 2.500 EUR, iar retainerul de design de la 600 EUR pe lună.',
      },
      {
        question: 'Care e diferența dintre UX și UI?',
        answer:
          'UX e fluxul și structura: ce face utilizatorul, în ce ordine și de ce. UI e cum arată: culori, tipografie, componente. Le facem pe amândouă, în această ordine.',
      },
      {
        question: 'Primesc fișierele Figma?',
        answer:
          'Da. La predare, fișierele Figma devin integral ale tale, împreună cu asset-urile exportate și specificația pentru programator.',
      },
      {
        question: 'Îl puteți și construi?',
        answer:
          'Da, cu ofertă separată pentru programare. Dacă construim noi aplicația, designul se scade din prețul construcției.',
      },
      {
        question: 'Cum plătesc?',
        answer:
          '50% avans și 50% la predare. Auditul se plătește în avans și se scade integral dintr-un proiect de design care urmează.',
      },
    ],
    relatedSlugs: ['aplicatii-web', 'platforme-saas', 'site-de-prezentare'],
    relatedPosts: [],
    projectSlugs: ['asesor', 'lumora', 'mostar', 'lithos'],
    waMessage: 'Salut! Mă interesează design UX/UI pentru un proiect. Putem vorbi?',
    serviceType: 'Design UX/UI',
    updatedAt: '2026-10-24',
  },
  {
    slug: 'mentenanta',
    group: 'crestere',
    name: 'Mentenanță și creștere',
    shortName: 'Mentenanță',
    h1: 'Mentenanță site web',
    seoTitle: 'Mentenanță site web, de la 90 EUR pe lună',
    metaDescription:
      'Mentenanță site de la 90 EUR pe lună, fără contract pe termen lung: actualizări, backup, monitorizare și mici modificări. Preluăm și site-uri făcute de alții.',
    answerCapsule:
      'Mentenanța unui site la MAST Studio pornește de la 90 EUR pe lună, fără contract pe termen lung. Include actualizări, backup-uri, monitorizare de bază și mici modificări de conținut. Hostingul și domeniul rămân separate, pe numele firmei tale.',
    priceFrom: 90,
    priceUnit: 'MON',
    priceLabel: 'de la 90 EUR/lună',
    deliveryLabel: 'Contract',
    deliveryTime: 'lunar, fără angajament pe termen lung',
    intro:
      'Un site lăsat nestânjenit luni de zile devine lent, vulnerabil sau pur și simplu neactualizat. Ne ocupăm noi de grija lui curentă, ca să nu afli de probleme de la clienți și să ai mereu pe cineva care răspunde când vrei o modificare.',
    includes: [
      'actualizări de platformă și dependențe, când e cazul',
      'backup-uri periodice',
      'monitorizare de bază: verificăm că site-ul răspunde',
      'mici ajustări de conținut și corecturi punctuale',
      'optimizare lunară pentru viteză și SEO de bază',
      'un interlocutor clar când ceva nu merge',
    ],
    notIncluded: [
      'redesign complet sau rebranding',
      'magazin online nou de la zero',
      'campanii de promovare (Google Ads, Meta Ads)',
      'conținut de blog sau social media nelimitat',
      'aplicații noi sau integrări mari (ERP, marketplace-uri)',
      'domeniul și găzduirea (50-120 EUR pe an, pe numele firmei tale)',
    ],
    process: [
      { step: 'Ne scrii pe WhatsApp sau e-mail', description: 'Ne spui dacă site-ul e făcut de noi sau de altcineva și ce probleme ai observat.' },
      { step: 'Verificăm accesul și starea site-ului', description: 'Domeniu, găzduire, cod sau panou de administrare: fără acces, nimeni nu poate face mentenanță serioasă.' },
      { step: 'Confirmăm ce intră în abonament', description: 'Primești lista clară cu ce acoperă abonamentul pentru site-ul tău, înainte să plătești ceva.' },
      { step: 'Pornim lunar', description: 'Plătești lunar și te oprești când nu mai ai nevoie, fără contract pe ani.' },
    ],
    forWho: [
      'afaceri al căror site aduce apeluri, programări sau comenzi',
      'patroni care nu au timp de actualizări și backup-uri',
      'firme care au trecut prin „s-a stricat și nu știu pe cine să sun”',
      'site-uri făcute de alte firme, după o verificare a accesurilor',
    ],
    faq: [
      {
        question: 'Cât costă mentenanța unui site?',
        answer:
          'De la 90 EUR pe lună, fără contract pe termen lung. Prețul acoperă îngrijirea curentă a site-ului, nu un redesign major sau campanii de promovare.',
      },
      {
        question: 'Pot opri mentenanța când vreau?',
        answer:
          'Da. Modelul e lunar, fără angajament pe termen lung. Ne anunți că oprești și nu rămâi legat de pachete anuale ascunse.',
      },
      {
        question: 'Mentenanța e același lucru cu hostingul?',
        answer:
          'Nu. Hostingul ține site-ul pe un server, iar domeniul e adresa lui; amândouă se plătesc separat, pe numele firmei tale, orientativ 50-120 EUR pe an. Mentenanța înseamnă actualizări, backup, monitorizare de bază și suport pentru problemele curente.',
      },
      {
        question: 'Puteți prelua un site făcut de altcineva?',
        answer:
          'De obicei da, după o verificare rapidă a accesurilor și a stării tehnice. Dacă site-ul are probleme mari, îți spunem dinainte ce e realist în abonamentul lunar și ce cere refacere.',
      },
      {
        question: 'Cât durează o intervenție când ceva nu merge?',
        answer:
          'Depinde de problemă: o corectură de text e rapidă, iar o cădere legată de găzduire sau de domeniu poate cere pași la furnizorul respectiv. Nu promitem un termen pe care nu îl putem garanta; îți spunem ce vedem și ce urmează, pe WhatsApp sau e-mail.',
      },
      {
        question: 'Am nevoie de mentenanță dacă site-ul e nou?',
        answer:
          'Nu obligatoriu din prima zi, dar e utilă dacă nu vrei să te ocupi tu de actualizări și backup. Poți începe oricând simți că nu mai ai timp pentru partea tehnică.',
      },
    ],
    relatedSlugs: ['site-de-prezentare', 'magazin-online', 'automatizari-whatsapp'],
    relatedPosts: ['cat-costa-mentenanta-site', 'de-ce-sunt-lente-temele-wordpress', 'ce-inseamna-pagespeed'],
    projectSlugs: ['decodex'],
    waMessage: 'Salut! Mă interesează mentenanță și creștere pentru site-ul meu.',
    serviceType: 'Mentenanță site web',
    updatedAt: '2026-10-02',
  },
  {
    slug: 'automatizari-whatsapp',
    group: 'ai',
    name: 'Automatizări WhatsApp',
    shortName: 'Automatizări WhatsApp',
    h1: 'Automatizări WhatsApp pentru afaceri mici',
    seoTitle: 'Automatizări WhatsApp pentru afaceri mici',
    metaDescription:
      'Automatizări WhatsApp de la 250 EUR: răspunsuri după program, confirmări de programare și informații despre servicii. Tu aprobi fiecare mesaj trimis.',
    answerCapsule:
      'Automatizările WhatsApp de la MAST Studio pornesc de la 250 EUR: răspunsuri în afara programului, confirmări de programare, informații despre servicii și status de comandă. Stabilim împreună 2-4 fluxuri utile, tu aprobi fiecare text, iar deciziile rămân la tine.',
    priceFrom: 250,
    priceLabel: 'de la 250 EUR',
    deliveryLabel: 'Termen',
    deliveryTime: 'stabilit în ofertă, după numărul de fluxuri',
    intro:
      'Primești aceleași mesaje de zeci de ori pe săptămână: „sunteți deschiși?”, „cât costă?”, „confirmați ora?”. Le automatizăm pe cele repetitive, ca să nu pierzi clienți noaptea sau în weekend și să ai timp pentru cei care chiar au nevoie de tine.',
    includes: [
      'analiza mesajelor pe care le repeți cel mai des',
      '2-4 fluxuri de răspuns setate dinainte',
      'răspuns automat în afara programului',
      'confirmări și remindere de programare',
      'informații aprobate de tine: program, prețuri orientative, zonă de acoperire',
      'predarea conversației către un om când clientul cere',
      'testare pe numere reale înainte de lansare',
    ],
    notIncluded: [
      'chatbot care inventează răspunsuri, prețuri sau sfaturi',
      'înlocuirea completă a recepției sau a vânzărilor',
      'fluxuri complexe legate de un ERP sau de o aplicație mare (ofertă separată)',
      'costurile serviciilor terțe, dacă fluxurile le folosesc',
    ],
    process: [
      { step: 'Ne scrii ce mesaje repeți', description: 'Lista scurtă de întrebări pe care le primești des, programul tău și contul de WhatsApp Business pe care îl folosești.' },
      { step: 'Stabilim 2-4 fluxuri utile', description: 'Nu 20. Începem cu ce îți mănâncă cel mai mult timp și scriem în ofertă exact ce automatizăm.' },
      { step: 'Tu aprobi textele', description: 'Nimic nu pleacă spre clienți fără să fi citit și aprobat tu mesajul.' },
      { step: 'Testăm și lansăm', description: 'Verificăm fluxurile pe numere reale, apoi le lăsăm live și le actualizăm când se schimbă programul sau prețurile.' },
    ],
    forWho: [
      'cabinete și saloane care confirmă programări pe WhatsApp',
      'magazine care primesc des întrebări despre comenzi',
      'firme de servicii care răspund la aceleași întrebări de preț',
      'afaceri care pierd mesaje după program sau în weekend',
    ],
    faq: [
      {
        question: 'Cât costă automatizările WhatsApp?',
        answer:
          'Pornesc de la 250 EUR, pentru scenarii de tip răspunsuri automate și confirmări. Numărul exact de fluxuri și eventualele integrări se stabilesc înainte de start, pe WhatsApp sau e-mail.',
      },
      {
        question: 'Ce pot automatiza pe WhatsApp?',
        answer:
          'Confirmări de programare, răspunsuri în afara orelor de lucru, informații despre prețuri sau servicii și actualizări de comandă. Scopul e să nu pierzi clienți când ești ocupat sau închis.',
      },
      {
        question: 'Am nevoie de site ca să am automatizări WhatsApp?',
        answer:
          'Nu obligatoriu. Un site de prezentare cu buton clar de WhatsApp crește însă șansele să te contacteze oameni noi, așa că cele două se completează.',
      },
      {
        question: 'Înlocuiesc automatizările recepția sau vânzările?',
        answer:
          'Nu. Ele acoperă întrebările repetitive și confirmările, iar deciziile, consultanța și relația cu clientul rămân la tine sau la echipa ta.',
      },
      {
        question: 'Cât durează configurarea?',
        answer:
          'Depinde de câte fluxuri vrei și de cât de clare sunt textele. Nu avem un termen standard ca la site-ul de prezentare; îl stabilim în ofertă, după ce știm exact ce automatizăm.',
      },
    ],
    relatedSlugs: ['asistent-ai', 'automatizari-ai', 'site-de-prezentare'],
    relatedPosts: ['automatizari-whatsapp-afacere-mica', 'conversie-site-prezentare'],
    projectSlugs: [],
    waMessage: 'Salut! Mă interesează automatizări și WhatsApp pentru afacerea mea.',
    serviceType: 'Automatizări WhatsApp',
    updatedAt: '2026-10-02',
  },
  {
    slug: 'asistent-ai',
    group: 'ai',
    name: 'Asistent AI pentru clienți',
    shortName: 'Asistent AI',
    h1: 'Asistent AI pentru site și WhatsApp',
    seoTitle: 'Asistent AI pentru site și WhatsApp',
    metaDescription:
      'Asistent AI care răspunde clienților pe site și WhatsApp din informațiile firmei tale, preia programări și predă conversația unui om. De la 790 EUR.',
    answerCapsule:
      'Asistentul AI de la MAST Studio răspunde clienților pe site și pe WhatsApp, zi și noapte, doar din informațiile aprobate de tine: servicii, prețuri, program, politici. Preia cereri și programări și predă conversația unui om când e nevoie. Pornește de la 790 EUR, plus costurile lunare de rulare, stabilite în ofertă.',
    priceFrom: 790,
    priceLabel: 'de la 790 EUR',
    deliveryLabel: 'Termen',
    deliveryTime: '2-3 săptămâni',
    intro:
      'Clienții tăi pun aceleași întrebări la orice oră, iar cine nu primește răspuns în câteva minute merge la următorul din listă. Un asistent AI bine construit răspunde imediat, corect și pe tonul firmei tale, pentru că știe doar ce l-ai învățat tu. Nu inventează prețuri, nu promite lucruri pe care nu le faci și îți lasă ție deciziile importante.',
    includes: [
      'analiza întrebărilor pe care le primești cel mai des',
      'bază de cunoștințe construită din informațiile firmei: servicii, prețuri, program, politici, FAQ',
      'asistent pe site și, la cerere, pe WhatsApp Business',
      'preluarea cererilor de ofertă și a programărilor',
      'predarea conversației către un om, cu tot istoricul',
      'mesaj clar că persoana vorbește cu un asistent AI',
      'testare pe întrebări reale înainte de lansare',
      'raport lunar cu întrebările primite și răspunsurile date',
    ],
    notIncluded: [
      'costurile lunare ale modelului AI și ale WhatsApp Business, plătite separat, la vedere',
      'sfaturi medicale, juridice sau financiare date de AI în locul unui specialist',
      'integrări complexe cu ERP sau CRM (ofertă separată)',
    ],
    process: [
      { step: 'Strângem ce trebuie să știe asistentul', description: 'Întrebările frecvente, prețurile, programul și regulile tale. Tot ce nu e scris aici, asistentul nu spune.' },
      { step: 'Construim și antrenăm baza de cunoștințe', description: 'Asistentul răspunde doar din sursele aprobate și spune „nu știu, vă pun în legătură cu un coleg” când nu are răspunsul.' },
      { step: 'Testăm cu întrebările tale reale', description: 'Îl punem la încercare cu zeci de întrebări, inclusiv cele dificile, și corectăm până răspunde cum ai răspunde tu.' },
      { step: 'Lansăm și urmărim', description: 'Îl punem pe site și pe WhatsApp, iar în prima lună verificăm conversațiile și ajustăm răspunsurile.' },
    ],
    forWho: [
      'cabinete medicale, stomatologice și veterinare cu multe întrebări repetitive',
      'saloane și clinici care fac programări',
      'magazine online cu întrebări despre produse, livrare și retur',
      'firme de servicii care primesc cereri de ofertă după program',
    ],
    faq: [
      {
        question: 'Ce e un asistent AI pentru clienți?',
        answer:
          'Un program care înțelege întrebările scrise de clienți și răspunde în limbaj natural, din informațiile firmei tale. Spre deosebire de un chatbot cu butoane, înțelege și întrebări formulate în felul fiecăruia.',
      },
      {
        question: 'Poate inventa răspunsuri sau prețuri?',
        answer:
          'Îl construim să răspundă doar din informațiile aprobate de tine. Când nu știe, spune asta și trimite conversația unui om. Testăm exact acest lucru înainte de lansare.',
      },
      {
        question: 'Cât costă un asistent AI?',
        answer:
          'Construcția pornește de la 790 EUR. Separat plătești costul lunar al modelului AI și, dacă îl folosești, al WhatsApp Business. Ambele depind de numărul de conversații și le estimăm în ofertă.',
      },
      {
        question: 'E conform cu GDPR și cu regulile europene privind AI?',
        answer:
          'Da. Clientul este anunțat de la început că vorbește cu un asistent AI, cum cer regulile europene, datele sunt prelucrate doar pentru conversație, iar politica de confidențialitate se actualizează în consecință.',
      },
      {
        question: 'Care e diferența față de automatizările WhatsApp?',
        answer:
          'Automatizările WhatsApp trimit mesaje fixe, scrise dinainte. Asistentul AI poartă o conversație: înțelege întrebarea și formulează răspunsul din informațiile tale. Multe afaceri pornesc cu automatizări și trec apoi la asistent.',
      },
    ],
    relatedSlugs: ['automatizari-whatsapp', 'automatizari-ai', 'site-de-prezentare'],
    relatedPosts: ['automatizari-whatsapp-afacere-mica', 'conversie-site-prezentare', 'cat-costa-aplicatie-web'],
    projectSlugs: [],
    waMessage: 'Salut! Mă interesează un asistent AI pentru clienți, pe site și WhatsApp.',
    serviceType: 'Asistent AI pentru clienți',
    updatedAt: '2026-11-03',
  },
  {
    slug: 'automatizari-ai',
    group: 'ai',
    name: 'Automatizări AI pentru procese',
    shortName: 'Automatizări AI',
    h1: 'Automatizări AI pentru procesele firmei tale',
    seoTitle: 'Automatizări AI pentru firme, de la 990 EUR',
    metaDescription:
      'Automatizări AI pentru documente, oferte, e-mailuri și rapoarte: preiau munca repetitivă a echipei, iar un om validează ce contează. De la 990 EUR.',
    answerCapsule:
      'Automatizările AI de la MAST Studio preiau munca repetitivă din firmă: citesc și sortează e-mailuri, extrag date din facturi și documente, pregătesc oferte și rapoarte. Pornesc de la 990 EUR pentru un proces, iar un om din echipa ta validează fiecare pas important.',
    priceFrom: 990,
    priceLabel: 'de la 990 EUR',
    deliveryLabel: 'Termen',
    deliveryTime: '2-4 săptămâni, după proces',
    intro:
      'În aproape orice firmă există ore pierdute săptăm��nal pe aceleași lucruri: copiat date dintr-un document în altul, răspuns la e-mailuri asemănătoare, făcut aceeași ofertă cu alte cifre. Inteligența artificială face astăzi aceste lucruri bine și repede. Noi alegem procesul care îți mănâncă cel mai mult timp, îl automatizăm și lăsăm omul acolo unde e nevoie de judecată.',
    includes: [
      'analiza procesului și calculul timpului economisit, înainte de start',
      'automatizarea unui proces complet, cap-coadă',
      'extragere de date din documente, facturi, PDF-uri și e-mailuri',
      'generare de oferte, rapoarte și răspunsuri pe baza șabloanelor tale',
      'legătură cu instrumentele pe care le folosești deja: e-mail, Google Workspace, Excel, CRM',
      'pas de validare umană pentru deciziile importante',
      'documentație și instruirea echipei',
    ],
    notIncluded: [
      'costurile lunare ale modelelor AI și ale serviciilor terțe, estimate în ofertă',
      'automatizarea mai multor procese odată (fiecare se ofertează separat)',
      'decizii luate de AI fără control uman în zone sensibile',
    ],
    process: [
      { step: 'Alegem procesul', description: 'Ne arăți cum lucrați azi. Alegem procesul cu cel mai mult timp pierdut și calculăm câte ore pe lună poate economisi.' },
      { step: 'Construim o primă versiune', description: 'În prima săptămână vezi automatizarea lucrând pe exemple reale din firma ta.' },
      { step: 'Testăm pe date reale', description: 'O rulăm în paralel cu felul vostru de lucru și corectăm până rezultatele sunt sigure.' },
      { step: 'Predăm și instruim', description: 'Echipa primește documentația, știe cum validează rezultatele și ce face când ceva nu e în regulă.' },
    ],
    forWho: [
      'firme de contabilitate și birouri care lucrează mult cu documente',
      'firme de distribuție și producție care fac multe oferte',
      'cabinete și clinici cu multă administrație',
      'echipe de vânzări și suport care răspund la e-mailuri similare',
    ],
    faq: [
      {
        question: 'Ce procese se pot automatiza cu AI?',
        answer:
          'Orice proces repetitiv bazat pe text sau documente: sortarea e-mailurilor, extragerea datelor din facturi și contracte, pregătirea ofertelor, rezumate de ședințe, rapoarte periodice, răspunsuri standard. Le alegem pe cele cu cel mai mult timp economisit.',
      },
      {
        question: 'Cât costă o automatizare AI?',
        answer:
          'Pornește de la 990 EUR pentru un proces. Prețul final depinde de numărul de pași, de sursele de date și de integrări. Costurile lunare ale modelelor AI sunt separate și le estimăm în ofertă.',
      },
      {
        question: 'Datele firmei rămân în siguranță?',
        answer:
          'Lucrăm doar cu furnizori AI care nu folosesc datele tale pentru antrenare, limităm accesul la ce e strict necesar și documentăm prelucrarea pentru GDPR.',
      },
      {
        question: 'Înlocuiește AI-ul angajații?',
        answer:
          'Nu. Preia partea repetitivă, iar oamenii rămân pe ce cere judecată: validare, relația cu clienții, decizii. Scopul e ca echipa să aibă timp pentru munca care contează.',
      },
      {
        question: 'Nu știu ce să automatizez. De unde încep?',
        answer:
          'Cu un audit AI: în 7-10 zile îți arătăm ce procese merită automatizate, cât timp economisești și în ce ordine. Costul auditului se scade din prima implementare.',
      },
    ],
    relatedSlugs: ['audit-strategie-ai', 'asistent-ai', 'aplicatii-web'],
    relatedPosts: ['automatizari-whatsapp-afacere-mica', 'conversie-site-prezentare', 'cat-costa-aplicatie-web'],
    projectSlugs: [],
    waMessage: 'Salut! Vreau să automatizez un proces din firmă cu AI. Putem discuta?',
    serviceType: 'Automatizări cu inteligență artificială',
    updatedAt: '2026-11-03',
  },
  {
    slug: 'solutii-ai-personalizate',
    group: 'ai',
    name: 'Soluții AI personalizate',
    shortName: 'Soluții AI',
    h1: 'Dezvoltare soluții AI personalizate',
    seoTitle: 'Dezvoltare soluții AI personalizate',
    metaDescription:
      'Dezvoltăm soluții AI pe datele tale: recunoaștere de imagini, analiză de date, recomandări personalizate și AI integrat în aplicații. Ofertă în 24 de ore.',
    answerCapsule:
      'MAST Studio dezvoltă soluții de inteligență artificială pe măsură: recunoaștere de imagini, analiză de date complexe, recomandări personalizate și AI integrat în aplicații existente. Am construit sisteme pentru supraveghere cu drone, nutriție personalizată și cercetare medicală. Oferta vine în 24 de ore de la prima discuție.',
    priceFrom: null,
    priceLabel: 'ofertă în 24 de ore',
    deliveryLabel: 'Termen',
    deliveryTime: 'în etape, stabilite în ofertă',
    intro:
      'Unele probleme nu se rezolvă cu un instrument gata făcut. Ai date proprii, un proces unic sau o idee de produs în care AI-ul e miezul, nu un accesoriu. Pentru astfel de proiecte construim soluția de la zero, în etape, cu o primă versiune funcțională devreme și cu decizii de arhitectură, securitate și date luate de oameni.',
    includes: [
      'descoperire tehnică: ce date ai, ce trebuie să facă sistemul, ce e realist',
      'recunoaștere de imagini și documente (computer vision)',
      'analiză de date și modele de recomandare personalizate',
      'integrarea modelelor AI în aplicații, platforme și fluxuri existente',
      'panouri de control și vizualizare de date în timp real',
      'securitate și protecția datelor gândite de la început',
      'construcție în etape, cu acces la progres',
      'cod, date și conturi pe numele tău, documentație completă',
    ],
    notIncluded: [
      'promisiuni de acuratețe înainte de testul pe datele tale',
      'hardware specializat (drone, senzori, servere), dacă proiectul îl cere',
      'costurile de rulare a modelelor și a infrastructurii, estimate în ofertă',
    ],
    process: [
      { step: 'Discuție de descoperire', description: 'Înțelegem problema, datele și constrângerile. Primești o ofertă cu etape și preț în 24 de ore.' },
      { step: 'Dovada de concept', description: 'Testăm ideea pe datele tale reale, ca să știm ce acuratețe e posibilă înainte de investiția mare.' },
      { step: 'Construcție în etape', description: 'Fiecare etapă se încheie cu ceva ce poți folosi și testa, nu cu un raport.' },
      { step: 'Lansare și predare', description: 'Sistemul intră în folosire, iar tu primești codul, documentația și instruirea echipei.' },
    ],
    forWho: [
      'firme cu date proprii pe care vor să le transforme în decizii',
      'clinici și centre de cercetare',
      'startup-uri care construiesc un produs bazat pe AI',
      'proiecte cu finanțare europeană care includ o componentă de inteligență artificială',
    ],
    faq: [
      {
        question: 'Ce fel de soluții AI ați construit?',
        answer:
          'Un centru de comandă pentru drone care cartografiază ambrozia în jurul Timișoarei, o platformă care analizează datele de microbiom pentru nutriție personalizată, un instrument care recunoaște valorile nutritive dintr-o fotografie și o platformă securizată de management clinic și cercetare.',
      },
      {
        question: 'Cât costă o soluție AI personalizată?',
        answer:
          'Depinde de date, de complexitate și de integrări, așa că facem o ofertă după prima discuție, în 24 de ore. Recomandăm să pornim cu o dovadă de concept, ca să știi ce funcționează înainte de investiția mare.',
      },
      {
        question: 'Am nevoie de multe date?',
        answer:
          'Nu întotdeauna. Modelele AI actuale pot face multe cu puține exemple, iar unde e nevoie de mai multe date te ajutăm să le colectezi corect. Răspunsul cinstit vine după ce vedem datele tale.',
      },
      {
        question: 'Se pot finanța astfel de proiecte din fonduri europene?',
        answer:
          'Da, multe programe de digitalizare și cercetare finanțează componente de inteligență artificială. Oferta și planul de etape pe care le primești de la noi pot fi folosite în documentația cererii.',
      },
      {
        question: 'Cine deține soluția la final?',
        answer:
          'Tu. Codul, datele și conturile sunt pe numele firmei tale, iar documentația îți permite să lucrezi mai departe cu orice echipă.',
      },
    ],
    relatedSlugs: ['aplicatii-web', 'platforme-saas', 'audit-strategie-ai'],
    relatedPosts: ['automatizari-whatsapp-afacere-mica', 'conversie-site-prezentare', 'cat-costa-aplicatie-web'],
    projectSlugs: [],
    waMessage: 'Salut! Am o idee de proiect cu inteligență artificială. Putem discuta?',
    serviceType: 'Dezvoltare soluții de inteligență artificială',
    updatedAt: '2026-11-03',
  },
  {
    slug: 'audit-strategie-ai',
    group: 'ai',
    name: 'Audit și strategie AI',
    shortName: 'Audit AI',
    h1: 'Audit și strategie AI pentru firme',
    seoTitle: 'Audit și strategie AI, de la 490 EUR',
    metaDescription:
      'Audit AI pentru firme: aflăm unde îți economisește AI timp și bani, ce riscuri ai și în ce ordine să implementezi. De la 490 EUR, în 7-10 zile.',
    answerCapsule:
      'Auditul AI de la MAST Studio îți arată, în 7-10 zile, unde poate economisi inteligența artificială timp și bani în firma ta, ce riscuri de date și de conformitate ai și în ce ordine merită implementat fiecare pas. Costă de la 490 EUR, iar suma se scade din prima implementare făcută cu noi.',
    priceFrom: 490,
    priceLabel: 'de la 490 EUR',
    deliveryLabel: 'Termen',
    deliveryTime: '7-10 zile',
    intro:
      'Toată lumea vorbește despre AI, dar puțini patroni știu de unde să înceapă și ce merită cu adevărat. Auditul răspunde concret: ne uităm la cum lucrează firma ta, măsurăm unde se pierde timp și îți dăm un plan cu 3-5 oportunități, cu costuri, economii estimate și riscuri, nu o prezentare despre viitor.',
    includes: [
      'interviuri scurte cu oamenii care fac munca',
      'harta proceselor repetitive din firmă',
      '3-5 oportunități AI, ordonate după timpul economisit și efort',
      'estimare de cost și de economie pentru fiecare',
      'verificarea riscurilor: date personale, GDPR, regulile europene privind AI',
      'recomandări de instrumente, cu prețurile lor reale',
      'plan de implementare pe 90 de zile',
      'prezentare și discuție de o oră cu echipa de conducere',
    ],
    notIncluded: [
      'implementarea propriu-zisă (ofertată separat, auditul se scade din preț)',
      'consultanță juridică (recomandările de conformitate nu înlocuiesc un avocat)',
    ],
    process: [
      { step: 'Discuție de pornire', description: 'Aflăm ce face firma, unde simți că pierzi timp și ce ai încercat deja.' },
      { step: 'Analiză în firmă', description: 'Vorbim cu oamenii care fac munca și ne uităm la documentele și instrumentele folosite.' },
      { step: 'Planul', description: 'Primești raportul cu oportunitățile, costurile, economiile și riscurile, pe înțelesul tuturor.' },
      { step: 'Prezentare și pași următori', description: 'Îl discutăm împreună. Dacă vrei să implementăm, costul auditului se scade din prima etapă.' },
    ],
    forWho: [
      'patroni care vor să înțeleagă ce poate face AI concret pentru firma lor',
      'firme cu 5-100 de angajați și multă muncă administrativă',
      'echipe care folosesc deja ChatGPT, dar fără reguli și fără un plan',
      'firme care pregătesc o cerere de finanțare pentru digitalizare',
    ],
    faq: [
      {
        question: 'Ce primesc concret după auditul AI?',
        answer:
          'Un raport cu 3-5 oportunități ordonate după impact, cu estimări de cost și de timp economisit, riscurile de date și conformitate și un plan pe 90 de zile. Plus o discuție de o oră în care îl trecem în revistă.',
      },
      {
        question: 'Cât costă un audit AI?',
        answer:
          'De la 490 EUR pentru o firmă mică, cu un singur departament. Dacă alegi să implementezi cu noi, suma se scade din prima etapă.',
      },
      {
        question: 'Trebuie să știu ceva despre AI înainte?',
        answer:
          'Nu. Auditul e făcut tocmai pentru cine nu are timp să urmărească tot ce apare. Îți explicăm totul pe limba afacerii, nu în termeni tehnici.',
      },
      {
        question: 'Ce înseamnă regulile europene privind AI pentru firma mea?',
        answer:
          'Pentru majoritatea firmelor mici, obligațiile sunt simple: oamenii trebuie anunțați când vorbesc cu un AI, iar datele personale se prelucrează conform GDPR. În audit verificăm exact ce se aplică la tine.',
      },
      {
        question: 'Ajută auditul la o cerere de finanțare?',
        answer:
          'Da. Planul de digitalizare din audit, cu costuri și pași, e o bază bună pentru o cerere de finanțare pentru digitalizare.',
      },
    ],
    relatedSlugs: ['automatizari-ai', 'asistent-ai', 'training-ai'],
    relatedPosts: [],
    projectSlugs: [],
    waMessage: 'Salut! Mă interesează un audit AI pentru firma mea.',
    serviceType: 'Consultanță și strategie AI',
    updatedAt: '2026-11-03',
  },
  {
    slug: 'vizibilitate-ai',
    group: 'ai',
    name: 'Vizibilitate în ChatGPT și AI',
    shortName: 'Vizibilitate AI',
    h1: 'Vizibilitate în ChatGPT, Gemini și căutarea cu AI',
    seoTitle: 'Cum apari în ChatGPT: vizibilitate AI (GEO)',
    metaDescription:
      'Te pregătim să fii recomandat de ChatGPT, Gemini și Google AI: profil Google, directoare, date structurate și conținut clar. De la 390 EUR, în 10 zile.',
    answerCapsule:
      'Tot mai mulți clienți cer recomandări direct de la ChatGPT sau Gemini, nu de la Google. Serviciul de vizibilitate AI de la MAST Studio pregătește afacerea ta să apară în aceste răspunsuri: profil Google complet, prezență în directoare, date structurate pe site și conținut pe care AI-ul îl poate cita. Pornește de la 390 EUR și durează 10 zile.',
    priceFrom: 390,
    priceLabel: 'de la 390 EUR',
    deliveryLabel: 'Termen',
    deliveryTime: '10 zile',
    intro:
      'Când am întrebat ChatGPT care e cel mai bun dentist, veterinar sau avocat din Timișoara, 90% dintre firmele recomandate aveau site propriu, dar sursele citate erau mai ales Google Maps, directoare și site-uri de recenzii. Asta înseamnă că AI-ul află despre tine din tot ce scrie internetul despre tine, nu doar din site. Noi punem ordine în toate aceste locuri, ca să fii ușor de găsit și de recomandat.',
    includes: [
      'test inițial: ce spun ChatGPT, Gemini și Perplexity despre firma ta și despre concurenți',
      'optimizarea profilului Google Business',
      'listare și corectare în directoarele relevante pentru domeniul tău',
      'date identice peste tot: nume, adresă, telefon, program',
      'date structurate pe site (schema.org) și fișier llms.txt',
      'pagini și răspunsuri scrise ca AI-ul să le poată cita',
      'plan pentru recenzii constante',
      'raport final și un nou test după 30 de zile',
    ],
    notIncluded: [
      'garanția că vei fi recomandat (nimeni nu o poate da cinstit)',
      'recenzii false sau cumpărate',
      'reconstruirea completă a site-ului (dacă e nevoie, ofertă separată)',
    ],
    process: [
      { step: 'Testul de pornire', description: 'Punem asistenților AI întrebările pe care le pun clienții tăi și notăm cine apare și de unde își iau informațiile.' },
      { step: 'Punem ordine în surse', description: 'Profil Google, directoare, date de contact identice peste tot.' },
      { step: 'Optimizăm site-ul', description: 'Date structurate, răspunsuri clare la întrebările clienților și conținut ușor de citat.' },
      { step: 'Testăm din nou', description: 'După 30 de zile repetăm testul și îți arătăm ce s-a schimbat.' },
    ],
    forWho: [
      'afaceri locale: cabinete, clinici, saloane, restaurante, meseriași',
      'firme de servicii profesionale: avocați, contabili, consultanți',
      'magazine online care vor să apară în recomandările de produse',
      'oricine a observat că clienții spun „am găsit pe ChatGPT”',
    ],
    faq: [
      {
        question: 'Ce este GEO (optimizarea pentru căutarea cu AI)?',
        answer:
          'GEO înseamnă pregătirea informațiilor despre firma ta ca asistenții AI, precum ChatGPT, Gemini sau Google AI Overviews, să le găsească, să le înțeleagă și să le citeze când cineva cere o recomandare.',
      },
      {
        question: 'Poți garanta că ChatGPT mă va recomanda?',
        answer:
          'Nu, și cine îți garantează asta nu spune adevărul. Putem însă să te facem prezent, corect și consecvent în toate sursele din care AI-ul își ia informațiile, iar testul de la 30 de zile arată concret ce s-a schimbat.',
      },
      {
        question: 'Care e diferența față de SEO?',
        answer:
          'SEO te ajută să apari în lista de rezultate Google. GEO te ajută să apari în răspunsul scris de un AI. Se completează: multe dintre lucrurile care ajută la una ajută și la cealaltă.',
      },
      {
        question: 'De unde își iau asistenții AI informațiile despre firme locale?',
        answer:
          'În testul nostru din Timișoara, ChatGPT a citat cel mai des Google Maps, directoare de firme, site-uri de recenzii și articole de tip top. Site-urile firmelor au fost citate direct doar rar, dar aproape toate firmele recomandate aveau site.',
      },
      {
        question: 'Cât costă și cât durează?',
        answer:
          'De la 390 EUR, în aproximativ 10 zile, plus testul de verificare după 30 de zile. Dacă vrei urmărire lunară, se poate adăuga la mentenanță.',
      },
    ],
    relatedSlugs: ['site-de-prezentare', 'mentenanta', 'asistent-ai'],
    relatedPosts: ['ce-inseamna-pagespeed'],
    projectSlugs: [],
    waMessage: 'Salut! Vreau să apar în recomandările ChatGPT și Google AI.',
    serviceType: 'Optimizare pentru căutarea cu AI (GEO)',
    updatedAt: '2026-11-03',
  },
  {
    slug: 'training-ai',
    group: 'ai',
    name: 'Training AI pentru echipe',
    shortName: 'Training AI',
    h1: 'Training AI pentru echipe și firme',
    seoTitle: 'Training AI pentru echipe, de la 450 EUR',
    metaDescription:
      'Atelier practic de AI pentru echipe: ChatGPT, Claude și Gemini folosite corect, pe sarcinile voastre reale, cu reguli clare pentru date. De la 450 EUR.',
    answerCapsule:
      'Trainingul AI de la MAST Studio e un atelier practic de o jumătate de zi, la sediul tău sau online, pentru până la 12 oameni. Echipa învață să folosească ChatGPT, Claude și Gemini pe sarcinile ei reale, să verifice ce produce AI-ul și ce date nu are voie să introducă. Costă de la 450 EUR pe atelier.',
    priceFrom: 450,
    priceLabel: 'de la 450 EUR / atelier',
    deliveryLabel: 'Durată',
    deliveryTime: 'o jumătate de zi, la sediul tău sau online',
    intro:
      'Echipa ta folosește probabil deja AI, fiecare în felul lui, unii bine, alții riscant. Un atelier bun face din obiceiuri individuale o practică a firmei: aceleași instrumente, aceleași reguli pentru date, prompt-uri care chiar funcționează pe munca voastră, nu exemple generice de pe internet.',
    includes: [
      'discuție înainte, ca exercițiile să fie pe sarcinile reale ale echipei',
      'atelier practic de o jumătate de zi, pentru până la 12 participanți',
      'ChatGPT, Claude și Gemini: când folosești fiecare',
      'scrierea de prompt-uri bune și verificarea rezultatelor',
      'reguli de siguranță: ce date nu se introduc niciodată în AI',
      'o bibliotecă de prompt-uri pentru firma ta, de folosit după atelier',
      'regulament intern scurt de folosire a AI, gata de adoptat',
    ],
    notIncluded: ['abonamentele la instrumentele AI', 'certificare oficială acreditată'],
    process: [
      { step: 'Aflăm ce face echipa', description: 'O discuție scurtă despre sarcinile zilnice, ca exemplele din atelier să fie despre munca voastră.' },
      { step: 'Pregătim atelierul', description: 'Exerciții, prompt-uri și reguli adaptate domeniului vostru.' },
      { step: 'Atelierul', description: 'Patru ore practice: fiecare participant lucrează pe calculatorul lui, pe sarcini reale.' },
      { step: 'După atelier', description: 'Primiți biblioteca de prompt-uri și regulamentul intern. Răspundem la întrebări încă două săptămâni.' },
    ],
    forWho: [
      'echipe de birou, vânzări, marketing și suport',
      'firme care vor reguli clare înainte ca AI-ul să fie folosit peste tot',
      'cabinete și clinici care lucrează cu date sensibile',
      'asociații și camere de comerț care organizează instruiri pentru membri',
    ],
    faq: [
      {
        question: 'Pentru cine este trainingul AI?',
        answer:
          'Pentru orice echipă care lucrează la calculator: birou, vânzări, marketing, suport, administrație. Nu e nevoie de cunoștințe tehnice, doar de un laptop și de sarcinile de zi cu zi.',
      },
      {
        question: 'Ce instrumente AI învățăm?',
        answer:
          'ChatGPT, Claude și Gemini, cu accent pe ce face fiecare cel mai bine. Dacă firma folosește deja un instrument anume, construim atelierul în jurul lui.',
      },
      {
        question: 'Cât costă trainingul AI?',
        answer:
          'De la 450 EUR pentru un atelier de o jumătate de zi cu până la 12 participanți, online sau în Timișoara. Pentru alte orașe se adaugă costurile de deplasare.',
      },
      {
        question: 'Echipa mea folosește deja ChatGPT. Mai are sens?',
        answer:
          'Da, de obicei chiar mai mult. Atelierul aduce reguli comune pentru date, verificarea rezultatelor și prompt-uri care economisesc timp real, nu doar curiozitate.',
      },
      {
        question: 'Se poate deconta trainingul din fonduri?',
        answer:
          'Multe programe de digitalizare finanțează și instruirea personalului. Îți dăm toate documentele de care ai nevoie: program, durată, participanți și factură.',
      },
    ],
    relatedSlugs: ['audit-strategie-ai', 'automatizari-ai', 'asistent-ai'],
    relatedPosts: [],
    projectSlugs: [],
    waMessage: 'Salut! Mă interesează un training AI pentru echipa mea.',
    serviceType: 'Training de inteligență artificială pentru echipe',
    updatedAt: '2026-11-03',
  },
]

/** The four service families, in the order they appear on /servicii. */
export const serviceGroups: {
  id: ServiceGroup
  name: Record<Locale, string>
  line: Record<Locale, string>
}[] = [
  {
    id: 'web',
    name: { ro: 'Site-uri și magazine online', en: 'Websites and online stores' },
    line: {
      ro: 'Prezența ta online: un site care convinge și un magazin care vinde.',
      en: 'Your online presence: a site that convinces and a store that sells.',
    },
  },
  {
    id: 'software',
    name: { ro: 'Aplicații și software', en: 'Apps and software' },
    line: {
      ro: 'Instrumente construite pe măsura afacerii tale, de la portaluri la platforme SaaS.',
      en: 'Tools built around your business, from client portals to SaaS platforms.',
    },
  },
  {
    id: 'ai',
    name: { ro: 'Inteligență artificială și automatizări', en: 'AI and automation' },
    line: {
      ro: 'AI care lucrează pentru tine: răspunde clienților, preia munca repetitivă și te face vizibil în ChatGPT.',
      en: 'AI that works for you: it answers customers, takes over repetitive work and makes you visible in ChatGPT.',
    },
  },
  {
    id: 'crestere',
    name: { ro: 'Creștere și suport', en: 'Growth and support' },
    line: {
      ro: 'După lansare: mentenanță, vizibilitate și clienți noi, lună de lună.',
      en: 'After launch: maintenance, visibility and new customers, month after month.',
    },
  },
]

/** Groups in display order, each with its localized services (offer copy included). */
export function getServicesByGroup(locale: Locale = 'ro') {
  const services = getAllServicePages(locale)
  return serviceGroups.map((group) => ({
    ...group,
    services: services.filter((service) => service.group === group.id),
  }))
}

function localizeService(service: ServicePage, locale: Locale): ServicePage {
  if (locale === 'ro') return service
  const text = serviceTextEn[service.slug]
  return text ? { ...service, ...text } : service
}

// Deposit copy switches to the no-deposit offer variant while it is active;
// evaluated per call so ISR revalidation flips the copy without a redeploy.
function applyOfferCopy(service: ServicePage, locale: Locale): ServicePage {
  if (!isNoDepositActive()) return service
  const override = serviceOfferCopy[locale][service.slug]
  return override ? { ...service, ...override } : service
}

export function getAllServicePages(locale: Locale = 'ro') {
  return servicePages.map((service) => applyOfferCopy(localizeService(service, locale), locale))
}

export function getServicePageBySlug(slug: string, locale: Locale = 'ro') {
  const id = canonicalServiceSlug(slug) ?? slug
  const service = servicePages.find((item) => item.slug === id)
  return service ? applyOfferCopy(localizeService(service, locale), locale) : undefined
}

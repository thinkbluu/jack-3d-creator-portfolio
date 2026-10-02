export type ServicePage = {
  slug: string
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
      'ce-include-pretul-unui-site',
      'livrare-site-48-ore',
      'conversie-site-prezentare',
      'avans-50-eur-cum-functioneaza',
    ],
    projectSlugs: ['veterinaria-timisoara', 'agd-innerpath-consulting', 'painea-casei'],
    waMessage: 'Salut! Vreau un site de prezentare, livrat în 48 de ore. Îmi poți face o ofertă?',
    serviceType: 'Creare site de prezentare',
    updatedAt: '2026-10-02',
  },
  {
    slug: 'magazin-online',
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
      'Ai o idee de produs digital pentru care clienții să plătească lunar? Te ajutăm să o transformi într-o platformă reală: stabilim împreună ce intră în prima versiune, o construim în etape și o lansăm fără funcții inutile care întârzie primii clienți.',
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
    slug: 'mentenanta',
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
    relatedSlugs: ['site-de-prezentare', 'aplicatii-web', 'mentenanta'],
    relatedPosts: ['automatizari-whatsapp-afacere-mica', 'conversie-site-prezentare'],
    projectSlugs: [],
    waMessage: 'Salut! Mă interesează automatizări și WhatsApp pentru afacerea mea.',
    serviceType: 'Automatizări WhatsApp',
    updatedAt: '2026-10-02',
  },
]

export function getAllServicePages() {
  return servicePages
}

export function getServicePageBySlug(slug: string) {
  return servicePages.find((service) => service.slug === slug)
}

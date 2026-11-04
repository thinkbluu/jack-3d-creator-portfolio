import type { CategoryKey, CategoryVerdict } from './types'

/**
 * Every sentence the checker can show, written once per language. The checker
 * never generates prose: it only picks from these templates and fills numbers
 * into `{n}`-style placeholders.
 */

export type SubCopy = { pass: string; warn: string; fail: string }

export type PlanEntry = {
  impact: 'high' | 'medium' | 'low'
  effort: 'under1h' | 'hours' | 'days'
  steps: string[]
}

export type GlossaryEntry = { term: string; text: string }

/** Every fixed sentence the PDF report can contain. */
export type PdfCopy = {
  title: string
  reportFor: string
  date: string
  overall: string
  categories: string
  topFixes: string
  footer: string
  labNote: string
  unverified: string
  what: string
  why: string
  who: string
  pageOf: string
  footerSite: string
  summaryBest: string
  summaryWorst: string
  summaryProblems: string
  howToReadTitle: string
  howToRead: string[]
  thresholds: { good: string; fair: string; poor: string }
  planTitle: string
  planIntro: string
  buckets: { week: string; month: string; later: string }
  planLabels: { problem: string; why: string; how: string; who: string; effort: string; impact: string }
  efforts: Record<PlanEntry['effort'], string>
  impacts: Record<PlanEntry['impact'], string>
  plan: Record<string, PlanEntry>
  deviceMobile: string
  deviceDesktop: string
  metricLabels: Record<'fcp' | 'lcp' | 'tbt' | 'cls' | 'si', string>
  metricExplanations: Record<'fcp' | 'lcp' | 'tbt' | 'cls' | 'si', string>
  metricScale: Record<'fcp' | 'lcp' | 'tbt' | 'cls' | 'si', { good: string; poor: string }>
  performanceScale: { good: string; fair: string; poor: string }
  scaleWords: { thresholds: string; good: string; poor: string }
  detailTitleRow: string
  detailDescriptionRow: string
  detailChars: string
  opportunitiesTitle: string
  opportunityFallback: string
  opportunities: Record<string, string>
  psiFailed: string
  detailNotFound: string
  detailRedirects: string
  detailNoRedirects: string
  detailRedirectHop: string
  detailLinkFound: string
  detailCompanyFound: string
  detailCookieBanner: Record<'strong' | 'hint' | 'none', string>
  detailTrackersFound: string
  detailTrackersNone: string
  detailCookiesTitle: string
  detailCookiesNone: string
  detailCookiesNote: string
  detailTitleText: string
  detailDescriptionText: string
  detailH1Text: string
  detailH1None: string
  detailJsonLd: string
  detailJsonLdNone: string
  detailLang: string
  detailImagesNoAlt: string
  detailImagesAllAlt: string
  detailFieldsNoLabel: string
  detailFieldsAllLabeled: string
  detailPhone: string
  detailWhatsapp: string
  detailEmail: string
  detailForm: string
  detailFormNone: string
  detailAddress: string
  detailHours: string
  techTitle: string
  techNote: string
  techLabels: { serverTime: string; htmlSize: string; scripts: string; stylesheets: string; compression: string; finalUrl: string; userAgent: string }
  compressionValues: Record<'gzip' | 'br' | 'none' | 'unknown', string>
  benchmarkTitle: string
  benchmarkIntro: string
  benchmarkLines: string[]
  benchmarkSource: string
  checklistTitle: string
  checklistIntro: string
  glossaryTitle: string
  glossary: GlossaryEntry[]
  nextTitle: string
  nextIntro: string
  nextServices: string
  nextWhatsapp: string
  nextEmail: string
  nextRecheck: string
  nextGenerated: string
}

export type CheckerCopy = {
  categories: Record<CategoryKey, { name: string; note?: string }>
  verdicts: Record<CategoryVerdict, string>
  verdictIntro: string
  overallLabel: string
  overallOf: string
  sub: Record<string, SubCopy>
  speedMetrics: { lcp: string; cls: string; good: string; fair: string; poor: string }
  fixesTitle: string
  fixesIntro: string
  fixWho: string
  unverified: string
  fixes: Record<string, { title: string; what: string; why: string; who: string }>
  // page UI
  ui: {
    kicker: string
    h1: string
    lead: string
    navLabel: string
    intro: string
    urlLabel: string
    urlPlaceholder: string
    submit: string
    checking: string
    progressTitle: string
    resultTitle: string
    resultFor: string
    again: string
    errorInvalid: string
    errorUnreachable: string
    errorRate: string
    errorGeneric: string
    labNote: string
    emailTitle: string
    emailIntro: string
    nameLabel: string
    emailLabel: string
    phoneLabel: string
    consentLabel: string
    privacyNoticeBefore: string
    privacyNoticeLink: string
    sendReport: string
    sendingReport: string
    reportSent: string
    reportError: string
    fixTitle: string
    fixIntro: string
    whatsappCta: string
    servicesTitle: string
    servicesIntro: string
    what: string
    why: string
    who: string
    pdfLine: string
  }
  pdf: PdfCopy
  homeBlock: { title: string; text: string; link: string }
  servicesLink: string
}

const pdfRo: PdfCopy = {
  title: 'Raport verificare site',
  reportFor: 'Site verificat',
  date: 'Data verificării',
  overall: 'Scor general',
  categories: 'Rezultate pe categorii',
  topFixes: 'Primele reparatții, în ordinea impactului',
  footer: 'Raport generat automat de verificatorul gratuit MAST Studio. Valorile de viteză sunt din testul de laborator Google PageSpeed. Verificarea legală și de cookie-uri privește HTML-ul inițial al paginii, nu un audit complet de browser.',
  labNote: 'Test de laborator',
  unverified: 'nu am putut verifica',
  what: 'Ce e greșit',
  why: 'De ce contează',
  who: 'Cine o repară de obicei',
  pageOf: 'Pagina {x} din {y}',
  footerSite: 'maststudio.ro',
  summaryBest: 'Cel mai bun la: {name} ({score}/100).',
  summaryWorst: 'Cel mai slab la: {name} ({score}/100).',
  summaryProblems: 'Probleme găsite: {n}, din care {urgent} urgente.',
  howToReadTitle: 'Cum să citești raportul',
  howToRead: [
    'Scorul merge de la 0 la 100 și este media categoriilor care au putut fi verificate. Fiecare verificare primește un marcaj: verde (în regulă), galben (de îmbunătățit) sau roșu (problemă).',
    'Pragurile scorului: 80–100 înseamnă bine, 50–79 înseamnă de îmbunătățit, sub 50 înseamnă probleme grave.',
    'Viteza este un test de laborator făcut de Google (PageSpeed), nu o măsurătoare la vizitatori reali. Scorul poate varia cu câteva puncte între două rulări, la același site.',
    'Verificările legale și de cookie-uri privesc HTML-ul inițial al paginii principale, nu un audit complet de browser. Un script de măsurare prezent, dar blocat până la acord, contează ca avertisment, nu ca problemă.',
  ],
  thresholds: { good: '80–100: bine', fair: '50–79: de îmbunătățit', poor: '0–49: probleme grave' },
  planTitle: 'Plan de lucru',
  planIntro: 'Toate verificările cu problemă sau de îmbunătățit, grupate după cât de repede merită rezolvate. Fiecare are problema, de ce contează pentru un client, pașii concreți, cine o repară de obicei și efortul estimat.',
  buckets: { week: 'Săptămâna asta', month: 'Luna asta', later: 'Când ai timp' },
  planLabels: { problem: 'Problema', why: 'De ce contează', how: 'Cum o repari', who: 'Cine o repară de obicei', effort: 'Efort', impact: 'Impact' },
  efforts: { under1h: 'sub 1 oră', hours: 'câteva ore', days: '1–2 zile' },
  impacts: { high: 'mare', medium: 'mediu', low: 'mic' },
  plan: {
    speed: {
      impact: 'high',
      effort: 'days',
      steps: [
        'Notează valorile LCP și CLS din raport, apoi compară-le cu pragurile din secțiunea de viteză.',
        'Comprimă și redimensionează imaginile mari (format WebP sau AVIF, la lățimea reală de afișare).',
        'Amână încărcarea scripturilor nefolositoare sau renunță la ele.',
        'Dacă valorile rămân mari, discută cu firma de găzduire sau cu programatorul.',
      ],
    },
    https: {
      impact: 'high',
      effort: 'under1h',
      steps: [
        'Activează certificatul SSL gratuit din panoul găzduirii (de exemplu Let\u2019s Encrypt).',
        'Redirecționează tot traficul de pe http:// pe https://.',
        'Deschide site-ul și verifică că browserul nu afișează avertisment de securitate.',
      ],
    },
    trackers: {
      impact: 'high',
      effort: 'hours',
      steps: [
        'Notează ce scripturi de măsurare sunt în pagină (raportul le listează la secțiunea de legal).',
        'Instalează o soluție de consimțământ care blochează scripturile până la accept.',
        'Testează în fereastră incognito: niciun cookie de măsurare înainte de a apăsa Accept.',
      ],
    },
    anpc: {
      impact: 'high',
      effort: 'under1h',
      steps: [
        'Ia linkurile oficiale de pe site-ul ANPC.',
        'Adaugă-le în subsolul site-ului, vizibile pe toate paginile.',
        'Verifică că linkurile deschid paginile oficiale ANPC.',
      ],
    },
    sal: {
      impact: 'high',
      effort: 'under1h',
      steps: [
        'Ia linkul oficial al platformei SAL de pe site-ul ANPC.',
        'Adaugă-l în subsolul site-ului, lângă linkul ANPC.',
        'Verifică că linkul deschide platforma de soluționare.',
      ],
    },
    company: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Adaugă în subsol: denumirea firmei, CUI, numărul de registru comerțului, sediul social.',
        'Verifică că datele coincid cu cele din Registrul Comerțului.',
      ],
    },
    privacy: {
      impact: 'high',
      effort: 'hours',
      steps: [
        'Scrie politica de confidențialitate; un jurist o poate adapta la activitatea ta.',
        'Publică-o la o adresă stabilă, de exemplu /confidentialitate.',
        'Adaugă linkul în subsol și în formularele care colectează date.',
      ],
    },
    cookieBanner: {
      impact: 'high',
      effort: 'hours',
      steps: [
        'Alege o soluție de consimțământ (Cookiebot, Complianz, iubenda sau echivalent).',
        'Configureaz-o cu buton de accept și buton egal de refuz, fără consimțământ bifat din start.',
        'Blochează scripturile de măsurare până la alegerea vizitatorului.',
      ],
    },
    title: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Scrie un titlu de 15–60 de caractere, cu serviciul principal și orașul.',
        'Pune-l în elementul title al paginii principale.',
        'Caută firma în Google și verifică cum arată titlul în rezultate.',
      ],
    },
    description: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Scrie o descriere de 70–160 de caractere: ce oferi și de ce să te aleagă.',
        'Pune-o în elementul meta description.',
        'Verifică preview-ul paginii în rezultatele Google.',
      ],
    },
    h1: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Lasă un singur H1 pe pagină, cu mesajul principal.',
        'Coboară restul titlurilor pe H2 sau H3.',
      ],
    },
    robots: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Creează un fișier robots.txt simplu la rădăcina site-ului.',
        'Adaugă linia care indică adresa sitemap.xml.',
        'Deschide /robots.txt și verifică că răspunde.',
      ],
    },
    sitemap: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Generează sitemap.xml; majoritatea platformelor o fac din setări.',
        'Trimite adresa hărții în Google Search Console.',
      ],
    },
    jsonld: {
      impact: 'medium',
      effort: 'hours',
      steps: [
        'Adaugă date structurate schema.org de tip LocalBusiness sau Organization, cu nume, adresă, telefon și program.',
        'Validează-le cu Rich Results Test al Google.',
      ],
    },
    maps: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Deschide profilul Google Business al firmei.',
        'Adaugă linkul către profil sau către hartă în pagina de contact.',
      ],
    },
    phone: {
      impact: 'high',
      effort: 'under1h',
      steps: [
        'Adaugă numărul ca link tel: în antet sau subsol.',
        'Deschide site-ul pe telefon și verifică că apelul pornește la atingere.',
      ],
    },
    whatsapp: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Creează linkul wa.me cu numărul firmei.',
        'Pune-l vizibil, de preferat și ca buton plutitor pe telefon.',
      ],
    },
    emailForm: {
      impact: 'high',
      effort: 'hours',
      steps: [
        'Adaugă un formular de contact simplu (nume, e-mail, mesaj) sau o adresă de e-mail vizibilă.',
        'Trimite un mesaj de probă și verifică că ajunge la tine, nu în spam.',
      ],
    },
    address: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Scrie adresa completă în pagina de contact și în subsol.',
        'Adaugă harta Google lângă adresă.',
      ],
    },
    hours: {
      impact: 'low',
      effort: 'under1h',
      steps: [
        'Adaugă programul de funcționare în pagina de contact și în subsol.',
        'Pune-l și în profilul Google Business.',
      ],
    },
    alt: {
      impact: 'medium',
      effort: 'hours',
      steps: [
        'Notează imaginile fără text alternativ; raportul le listează cu numele fișierului.',
        'Scrie pentru fiecare o descriere scurtă a ceea ce se vede în imagine.',
        'Completează textul în CMS sau în cod.',
      ],
    },
    labels: {
      impact: 'medium',
      effort: 'hours',
      steps: [
        'Notează câmpurile fără etichetă; raportul le listează cu numele.',
        'Adaugă pentru fiecare un label cu for= sau un aria-label.',
      ],
    },
    lang: {
      impact: 'low',
      effort: 'under1h',
      steps: [
        'Adaugă atributul lang pe elementul html, de exemplu lang="ro".',
        'Verifică în cod că atributul a rămas după publicare.',
      ],
    },
  },
  deviceMobile: 'Mobil',
  deviceDesktop: 'Desktop',
  metricLabels: { fcp: 'FCP', lcp: 'LCP', tbt: 'TBT', cls: 'CLS', si: 'Speed Index' },
  metricExplanations: {
    fcp: 'Cât durează până apare primul conținut pe ecran.',
    lcp: 'Cât durează până se afișează conținutul principal.',
    tbt: 'Cât timp pagina e blocată și nu răspunde la atingere în timpul încărcării.',
    cls: 'Cât de mult se mișcă pagina în timp ce se încarcă.',
    si: 'Cât de repede se umple vizual pagina.',
  },
  metricScale: {
    fcp: { good: 'până la 1,8 s', poor: 'peste 3 s' },
    lcp: { good: 'până la 2,5 s', poor: 'peste 4 s' },
    tbt: { good: 'până la 200 ms', poor: 'peste 600 ms' },
    cls: { good: 'până la 0,1', poor: 'peste 0,25' },
    si: { good: 'până la 3,4 s', poor: 'peste 5,8 s' },
  },
  performanceScale: { good: '90–100: rapid', fair: '50–89: acceptabil', poor: '0–49: lent' },
  scaleWords: { thresholds: 'Praguri', good: 'bine', poor: 'problemă' },
  detailTitleRow: 'Titlu',
  detailDescriptionRow: 'Descriere meta',
  detailChars: 'caractere',
  opportunitiesTitle: 'Cele mai mari oportunități de accelerare, după estimarea Google',
  opportunityFallback: '{title} (detaliu tehnic)',
  opportunities: {
    'render-blocking-resources': 'Fișiere de stil și scripturi blochează prima afișare: încarcă-le mai târziu sau mai puține.',
    'unused-javascript': 'Cod JavaScript nefolosit se încarcă degeaba: renunță la el sau încarcă-l doar când e nevoie.',
    'unused-css-rules': 'Stiluri CSS nefolosite se încarcă degeaba: curăță fișierele de stil.',
    'uses-responsive-images': 'Imaginile sunt mai mari decât ecranul: servește-le la mărimea la care se afișează.',
    'modern-image-formats': 'Imaginile nu sunt în format modern comprimat (WebP sau AVIF).',
    'uses-webp-images': 'Imaginile nu sunt în format modern comprimat (WebP sau AVIF).',
    'uses-optimized-images': 'Imaginile nu sunt comprimate eficient.',
    'offscreen-images': 'Imaginile de sub ecran se încarcă degeaba la deschidere: încarcă-le când ajunge vizitatorul la ele.',
    'unminified-css': 'Fișierele de stil nu sunt comprimate (minimizate).',
    'unminified-javascript': 'Fișierele JavaScript nu sunt comprimate (minimizate).',
    'uses-text-compression': 'Răspunsurile serverului nu sunt comprimate cu gzip sau brotli.',
    'total-byte-weight': 'Pagina trimite prea mulți bytes la prima încărcare.',
    'dom-size': 'Pagina are prea multe elemente în cod.',
    'mainthread-work-breakdown': 'JavaScriptul ocupă prea mult firul principal al telefonului.',
    'bootup-time': 'JavaScriptul durează prea mult până se execută.',
    'server-response-time': 'Serverul răspunde lent la prima cerere.',
    'redirect-redirects': 'Redirecționările adaugă întârziere: scurtează lanțul de redirecționări.',
    'uses-long-cache-ttl': 'Fișierele statice nu sunt păstrate în cache pe termen lung.',
    'efficient-animated-content': 'Animațiile mari (GIF) ar merge mai bine ca video.',
    'legacy-javascript': 'Cod vechi pentru browsere depășite se trimite și browserelor moderne.',
    'prioritize-lcp-image': 'Imaginea principală se încarcă prea târziu: dă-i prioritate.',
    'preload-lcp-image': 'Imaginea principală se încarcă prea târziu: dă-i prioritate.',
    'font-display': 'Fonturile blochează afișarea textului.',
    'duplicated-javascript': 'Pachete JavaScript duplicate se încarcă de mai multe ori.',
  },
  psiFailed: 'nu am putut verifica',
  detailNotFound: 'negăsit',
  detailRedirects: 'Lanțul de redirecționări',
  detailNoRedirects: 'Fără redirecționări: prima adresă răspunde direct.',
  detailRedirectHop: '{from} → {to} (HTTP {status})',
  detailLinkFound: 'găsit: {url}',
  detailCompanyFound: 'text găsit: „{text}"',
  detailCookieBanner: {
    strong: 'Banner de cookie-uri detectat în pagină.',
    hint: 'Indicii de banner de cookie-uri, dar nu sunt clare.',
    none: 'Niciun indiciu de banner de cookie-uri în HTML-ul inițial.',
  },
  detailTrackersFound: 'Instrumente de măsurare văzute în HTML-ul inițial: {list}.',
  detailTrackersNone: 'Niciun instrument de măsurare cunoscut în HTML-ul inițial.',
  detailCookiesTitle: 'Cookie-uri scrise înainte de consimțământ (din răspunsul serverului)',
  detailCookiesNone: 'Niciun cookie scris de server la prima încărcare.',
  detailCookiesNote: 'Lista privește doar răspunsul HTTP inițial; cookie-urile scrise de JavaScript nu pot fi văzute fără un browser real.',
  detailTitleText: 'Titlul paginii ({n} caractere; ideal 15–60)',
  detailDescriptionText: 'Descrierea meta ({n} caractere; ideal 70–160)',
  detailH1Text: 'Titluri H1 găsite: {n}',
  detailH1None: 'Niciun titlu H1 în pagină.',
  detailJsonLd: 'Tipuri de date structurate găsite: {list}.',
  detailJsonLdNone: 'Nicio dată structurată (JSON-LD) în pagină.',
  detailLang: 'Limba declarată în cod: {lang}.',
  detailImagesNoAlt: 'Imagini fără text alternativ: {n} din {m}. Fișierele:',
  detailImagesAllAlt: 'Toate cele {m} imagini au text alternativ.',
  detailFieldsNoLabel: 'Câmpuri de formular fără etichetă: {n} din {m}. Câmpurile:',
  detailFieldsAllLabeled: 'Toate cele {m} câmpuri de formular au etichetă.',
  detailPhone: 'Telefon (link tel:)',
  detailWhatsapp: 'WhatsApp',
  detailEmail: 'E-mail',
  detailForm: 'Formular de contact prezent în pagină.',
  detailFormNone: 'Niciun formular de contact în pagină.',
  detailAddress: 'Adresă (text găsit în pagină)',
  detailHours: 'Program (text găsit în pagină)',
  techTitle: 'Tehnic (informativ, nu intră în scor)',
  techNote: 'Valorile de mai jos descriu cum răspunde serverul la prima cerere. Nu influențează scorul.',
  techLabels: {
    serverTime: 'Timp de răspuns al serverului',
    htmlSize: 'Mărimea HTML-ului',
    scripts: 'Scripturi în pagină',
    stylesheets: 'Fișiere de stil',
    compression: 'Compresie a răspunsului',
    finalUrl: 'Adresa finală după redirecționări',
    userAgent: 'Agentul folosit de verificare',
  },
  compressionValues: { gzip: 'gzip (da)', br: 'brotli (da)', none: 'nu', unknown: 'necunoscut' },
  benchmarkTitle: 'Cum stai față de alții',
  benchmarkIntro: 'Cifrele de mai jos vin din studiile noastre pe firme românești, nu din estimări.',
  benchmarkLines: [
    'Am analizat 200 de afaceri din Timișoara: rata celor cu site propriu diferă mult de la un domeniu la altul.',
    'Am testat 50 de magazine online românești pe telefon: toate aveau cel puțin o problemă, iar doar 48% arătau costul transportului înainte de finalizarea comenzii.',
    'Dintre aceleași 50 de magazine, 15 nu aveau buton de refuz pentru cookie-uri, iar 8 bifau din start consimțământul de marketing.',
  ],
  benchmarkSource: 'Sursa: Studiu MAST Studio, octombrie 2026.',
  checklistTitle: 'Listă de verificare',
  checklistIntro: 'Bifează pe măsură ce repari. Aceeași listă ca în raport, cu casete goale.',
  glossaryTitle: 'Glosar',
  glossary: [
    { term: 'LCP', text: 'Cât durează până se afișează cel mai mare element vizibil din pagină.' },
    { term: 'CLS', text: 'Cât de mult se mișcă elementele paginii în timp ce se încarcă.' },
    { term: 'TBT', text: 'Cât timp pagina e blocată și nu răspunde la atingere în timpul încărcării.' },
    { term: 'HTTPS', text: 'Conexiunea criptată dintre browser și site; adresa începe cu https://.' },
    { term: 'Redirecționare', text: 'Când o adresă trimite automat browserul către o altă adresă.' },
    { term: 'Meta description', text: 'Textul scurt care apare sub titlu în rezultatele Google.' },
    { term: 'H1', text: 'Titlul principal al paginii, cel mai important titlu din cod.' },
    { term: 'JSON-LD', text: 'Date structurate scrise în codul paginii, pe care Google le citește direct.' },
    { term: 'Sitemap', text: 'Lista paginilor site-ului, la adresa /sitemap.xml, dată Google.' },
    { term: 'robots.txt', text: 'Fișierul care spune motoarelor de căutare ce pot și ce nu pot vizita.' },
    { term: 'Cookie', text: 'Un mic fișier pe care site-ul îl salvează în browserul vizitatorului.' },
    { term: 'Tracker', text: 'Script care măsoară ce face vizitatorul (Analytics, Meta Pixel, TikTok).' },
    { term: 'Consimțământ', text: 'Acordul dat de vizitator înainte să fie urmărit sau să i se salveze cookie-uri.' },
    { term: 'ANPC/SAL', text: 'Autoritatea pentru protecția consumatorilor și platforma ei de soluționare a litigiilor.' },
    { term: 'Alt text', text: 'Textul care descrie o imagine pentru cititoarele de ecran și pentru Google.' },
  ],
  nextTitle: 'Ce urmează',
  nextIntro: 'Dacă vrei să rezolvăm noi problemele, serviciile care se potrivesc cu ce am găsit:',
  nextServices: 'Servicii potrivite',
  nextWhatsapp: 'WhatsApp: +40 746 382 204',
  nextEmail: 'E-mail: contact@maststudio.ro',
  nextRecheck: 'Verifică din nou site-ul: {url}',
  nextGenerated: 'Raport generat automat. Verifică din nou după modificări.',
}

const ro: CheckerCopy = {
  categories: {
    speed: { name: 'Viteză pe mobil', note: 'test de laborator' },
    legal: { name: 'Încredere și legal' },
    google: { name: 'Găsit pe Google' },
    contact: { name: 'Contact și conversie' },
    accessibility: { name: 'Accesibilitate de bază' },
  },
  verdicts: { good: 'Bine', fair: 'De îmbunătățit', poor: 'Probleme grave', unverified: 'Nu am putut verifica' },
  verdictIntro: 'Media categoriilor care au putut fi verificate.',
  overallLabel: 'Scor general',
  overallOf: 'din 100',
  sub: {
    performance: { pass: 'Site-ul se încarcă rapid pe telefon', warn: 'Site-ul se încarcă acceptabil, dar poate fi mai rapid', fail: 'Site-ul se încarcă lent pe telefon' },
    https: { pass: 'Site-ul funcționează pe HTTPS (adresa începe cu https://)', warn: '', fail: 'Site-ul nu funcționează pe HTTPS. Adresa se deschide pe http://, nesigur' },
    anpc: { pass: 'Link către ANPC prezent', warn: '', fail: 'Lipsește linkul către ANPC' },
    sal: { pass: 'Link către platforma de soluționare SAL prezent', warn: '', fail: 'Lipsește linkul către platforma SAL de soluționare a litigiilor' },
    company: { pass: 'Datele firmei (CUI sau număr de registru comerțului) apar pe site', warn: '', fail: 'Nu am găsit CUI-ul sau numărul de registru comerțului în pagina principală' },
    privacy: { pass: 'Link către politica de confidențialitate prezent', warn: '', fail: 'Lipsește linkul către politica de confidențialitate' },
    cookieBanner: { pass: 'Am găsit un banner de cookie-uri', warn: 'Am găsit indicii de banner de cookie-uri, dar nu sunt clare', fail: 'Nu am găsit un banner de cookie-uri în pagina principală' },
    trackers: { pass: 'Niciun instrument de măsurare nu pornește înainte de acordul vizitatorului', warn: 'Am găsit indicii de măsurare care ar putea porni înainte de acord', fail: 'Instrumente de măsurare (Google Analytics, Meta Pixel sau TikTok) pornesc sau scriu cookie-uri înainte de acordul vizitatorului' },
    title: { pass: 'Titlul paginii există și are o lungime bună ({n} de caractere)', warn: 'Titlul paginii are o lungime nepotrivită ({n} de caractere; ideal între 15 și 60)', fail: 'Pagina nu are titlu (elementul title)' },
    description: { pass: 'Descrierea meta există și are o lungime bună ({n} de caractere)', warn: 'Descrierea meta are o lungime nepotrivită ({n} de caractere; ideal între 70 și 160)', fail: 'Pagina nu are descriere meta' },
    h1: { pass: 'Exact un titlu principal (H1) pe pagină', warn: '', fail: 'Am găsit {n} titluri principale (H1) în loc de unul singur' },
    robots: { pass: 'Fișierul robots.txt există și e accesibil', warn: '', fail: 'Fișierul robots.txt lipsește sau nu e accesibil' },
    sitemap: { pass: 'Harta site-ului (sitemap.xml) există și e accesibilă', warn: '', fail: 'Harta site-ului (sitemap.xml) lipsește sau nu e accesibilă' },
    jsonld: { pass: 'Date structurate pentru firmă (schema.org) prezente', warn: '', fail: 'Lipsesc datele structurate cu datele firmei (schema.org, LocalBusiness sau Organization)' },
    maps: { pass: 'Link către harta sau profilul Google al firmei prezent', warn: '', fail: 'Lipsește linkul către harta Google sau profilul firmei de pe Google' },
    phone: { pass: 'Link de telefon (tel:) prezent', warn: '', fail: 'Lipsește linkul de telefon pe care clientul să-l poată apăsa' },
    whatsapp: { pass: 'Link de WhatsApp prezent', warn: '', fail: 'Lipsește linkul de WhatsApp' },
    emailForm: { pass: 'Adresă de e-mail sau formular de contact prezent', warn: '', fail: 'Nu am găsit nici o adresă de e-mail și niciun formular de contact' },
    address: { pass: 'Adresa firmei apare în pagină', warn: '', fail: 'Nu am găsit o adresă în textul paginii' },
    hours: { pass: 'Programul de funcționare apare în pagină', warn: '', fail: 'Nu am găsit programul de funcționare în textul paginii' },
    alt: { pass: 'Toate imaginile au text alternativ', warn: '{n} din {m} imagini nu au text alternativ', fail: '{n} din {m} imagini nu au text alternativ' },
    labels: { pass: 'Câmpurile formularelor au etichete', warn: '{n} din {m} câmpuri de formular nu au etichetă', fail: '{n} din {m} câmpuri de formular nu au etichetă' },
    lang: { pass: 'Limba paginii este declarată (atributul lang)', warn: '', fail: 'Limba paginii nu este declarată în cod (atributul lang pe html)' },
  },
  speedMetrics: {
    lcp: 'Cât durează până se vede conținutul principal (LCP)',
    cls: 'Cât de mult se mișcă pagina în timp ce se încarcă (CLS)',
    good: 'rapid',
    fair: 'acceptabil',
    poor: 'lent',
  },
  fixesTitle: 'Primele 5 reparatții, în ordinea impactului',
  fixesIntro: 'Ce e greșit, de ce contează pentru un client și cine o repară de obicei.',
  fixWho: 'Cine o repară de obicei',
  unverified: 'nu am putut verifica',
  fixes: {
    speed: {
      title: 'Site-ul e lent pe telefon',
      what: 'Testul PageSpeed pe mobil dă scor {n} din 100.',
      why: 'Un client pe telefon așteaptă câteva secunde și apoi pleacă. Fiecare secundă de așteptare pierde cereri de ofertă.',
      who: 'firma care a construit sau întreține site-ul: optimizare de imagini, cod și găzduire',
    },
    https: {
      title: 'Site-ul nu funcționează pe HTTPS',
      what: 'Adresa se deschide pe http://, iar browserele afișează „Nesigur” lângă numele site-ului.',
      why: 'Avertismentul de securitate alungește clienții înainte să vadă ce oferi, iar datele din formulare nu sunt protejate.',
      who: 'firma de găzduire sau programatorul site-ului; certificatul SSL e gratuit la majoritatea găzduirilor',
    },
    trackers: {
      title: 'Măsurarea pornește înainte de acordul vizitatorului',
      what: 'Google Analytics, Meta Pixel sau TikTok sunt încărcate sau scriu cookie-uri din prima încărcare, înainte de consimțământ.',
      why: 'Fără acordul vizitatorului e o încălcare a regulilor GDPR, cu risc de amendă, iar clienții atenți observă.',
      who: 'programatorul site-ului sau firma care l-a făcut: scripturile se blochează până la accept',
    },
    anpc: {
      title: 'Lipsește linkul ANPC',
      what: 'Nu există link către ANPC în pagina principală.',
      why: 'Pentru firmele care vând, linkul ANPC e cerut de lege, iar clienții atenți îl caută înainte să cumpere.',
      who: 'tu sau firma care întreține site-ul; linkurile oficiale se iau de pe site-ul ANPC',
    },
    sal: {
      title: 'Lipsește linkul de soluționare a litigiilor (SAL)',
      what: 'Nu există link către platforma SAL a ANPC sau platforma europeană de soluționare.',
      why: 'Linkul e cerut de legea protecției consumatorilor și arată clienților că ai ceva de ascuns? Nu. Arată că ești pe lista firmelor serioase.',
      who: 'tu sau firma care întreține site-ul; linkul oficial se ia de pe site-ul ANPC',
    },
    company: {
      title: 'Datele firmei nu apar pe site',
      what: 'Nu am găsit CUI-ul sau numărul de registru comerțului în pagina principală.',
      why: 'Datele firmei la vedere cresc încrederea; mulți clienți le caută înainte de prima comandă.',
      who: 'tu, cu o mică modificare în subsolul site-ului',
    },
    privacy: {
      title: 'Lipsește politica de confidențialitate',
      what: 'Nu există link către politica de confidențialitate.',
      why: 'E obligatorie de îndată ce colectezi date (formular, telefon, newsletter) și e primul document căutat de clienții prudenți.',
      who: 'un jurist scrie textul, iar firma care întreține site-ul o publică',
    },
    cookieBanner: {
      title: 'Lipsește bannerul de cookie-uri',
      what: 'Nu am găsit un banner de consimțământ pentru cookie-uri în pagina principală.',
      why: 'Dacă site-ul folosește cookie-uri de măsurare sau publicitate, acordul vizitatorului e obligatoriu în Uniunea Europeană.',
      who: 'firma care întreține site-ul, cu o soluție de consimțământ configurată corect',
    },
    title: {
      title: 'Titlul paginii lipsește sau are lungime nepotrivită',
      what: 'Titlul (elementul title) lipsește sau are o lungime pe care Google o taie.',
      why: 'Titlul e prima linie pe care un client o vede în Google; fără el, pagina nu primește clickuri.',
      who: 'firma care întreține site-ul sau un specialist SEO',
    },
    description: {
      title: 'Descrierea meta lipsește sau are lungime nepotrivită',
      what: 'Descrierea meta lipsește sau are o lungime pe care Google o taie.',
      why: 'Descrierea e textul de sub titlu în Google; ea decide dacă clientul intră pe site-ul tău sau pe al concurenței.',
      who: 'firma care întreține site-ul sau un specialist SEO',
    },
    h1: {
      title: 'Prea multe titluri principale (H1)',
      what: 'Am găsit {n} titluri H1 în loc de unul singur.',
      why: 'Google folosește H1 ca să înțeleagă despre ce e pagina; mai multe îl încurcă și slăbesc poziția.',
      who: 'firma care întreține site-ul',
    },
    robots: {
      title: 'Fișierul robots.txt lipsește',
      what: 'Adresa /robots.txt nu răspunde.',
      why: 'Fără el, Google nu are instrucțiuni clare despre ce pagini să indexeze și ce să ignore.',
      who: 'programatorul site-ului sau firma de găzduire',
    },
    sitemap: {
      title: 'Harta site-ului (sitemap.xml) lipsește',
      what: 'Adresa /sitemap.xml nu răspunde.',
      why: 'Harta site-ului ajută Google să găsească toate paginile mai repede, inclusiv cele noi.',
      who: 'firma care întreține site-ul',
    },
    jsonld: {
      title: 'Lipsesc datele structurate ale firmei',
      what: 'Nu există date structurate schema.org cu datele firmei (LocalBusiness sau Organization).',
      why: 'Fără ele, Google afișează mai puține informații despre firma ta, iar asistenții AI te găsesc mai greu.',
      who: 'programatorul site-ului',
    },
    maps: {
      title: 'Lipsește linkul către harta sau profilul Google',
      what: 'Nu există link către Google Maps sau profilul firmei de pe Google.',
      why: 'Clienții locali te caută pe harta Google; linkul îi duce direct la recenzii și indicații de drum.',
      who: 'tu, dacă profilul Google Business există deja, sau firma care întreține site-ul',
    },
    phone: {
      title: 'Lipsește linkul de telefon',
      what: 'Nu există un link tel: pe care clientul să-l poată apăsa.',
      why: 'Pe telefon, un apel e un singur click; fără link, clientul trebuie să copieze numărul, iar mulți renunță.',
      who: 'firma care întreține site-ul',
    },
    whatsapp: {
      title: 'Lipsește linkul de WhatsApp',
      what: 'Nu există link către WhatsApp pe site.',
      why: 'Mulți clienți preferă să scrie pe WhatsApp în loc să sune; fără link, conversația nu începe.',
      who: 'firma care întreține site-ul',
    },
    emailForm: {
      title: 'Nu există e-mail sau formular de contact',
      what: 'Nu am găsit nici o adresă de e-mail și niciun formular de contact.',
      why: 'Dacă clientul nu găsește în câteva secunde cum te contactează, pleacă la concurență.',
      who: 'firma care întreține site-ul',
    },
    address: {
      title: 'Adresa nu apare în pagină',
      what: 'Nu am găsit o adresă în textul paginii.',
      why: 'O adresă clară crește încrederea și te ajută în căutările locale pe Google.',
      who: 'tu, cu o mică modificare de conținut',
    },
    hours: {
      title: 'Programul de funcționare nu apare',
      what: 'Nu am găsit programul de funcționare în textul paginii.',
      why: 'Clienții vor să știe când te găsesc; fără program, o parte nu te sună deloc.',
      who: 'tu, cu o mică modificare de conținut',
    },
    alt: {
      title: 'Imagini fără text alternativ',
      what: '{n} din {m} imagini nu au text alternativ (atributul alt).',
      why: 'Textul alternativ ajută clienții care folosesc cititoare de ecran și ajută Google să înțeleagă imaginile.',
      who: 'firma care întreține site-ul',
    },
    labels: {
      title: 'Câmpuri de formular fără etichetă',
      what: '{n} din {m} câmpuri de formular nu au etichetă.',
      why: 'Fără etichete, formularele sunt greu de completat pentru clienții cu cititor de ecran, și pierzi cereri.',
      who: 'programatorul site-ului',
    },
    lang: {
      title: 'Limba paginii nu e declarată',
      what: 'Elementul html nu are atributul lang.',
      why: 'Atributul lang ajută Google și cititoarele de ecran să folosească limba corectă.',
      who: 'programatorul site-ului',
    },
  },
  ui: {
    kicker: 'Verificare gratuită',
    h1: 'Verifică-ți site-ul gratuit',
    lead: 'Rezultatul pe ecran, raportul PDF pe email.',
    navLabel: 'Verificare site',
    intro:
      'Află în aproximativ 15 secunde cum arată site-ul firmei tale prin ochii unui client: viteză pe telefon, încredere și legal, prezență pe Google, contact și accesibilitate. Vezi rezultatul aici, pe ecran. Abia apoi, dacă vrei raportul complet în PDF, ne dai adresa de e-mail.',
    urlLabel: 'Adresa site-ului tău',
    urlPlaceholder: 'ex: firmata.ro',
    submit: 'Verifică gratuit',
    checking: 'Se verifică...',
    progressTitle: 'Verificările în curs',
    resultTitle: 'Rezultatul verificării',
    resultFor: 'pentru',
    again: 'Verifică alt site',
    errorInvalid: 'Scrie o adresă validă, de exemplu firmata.ro.',
    errorUnreachable: 'Nu am putut deschide site-ul. Verifică adresa și încearcă din nou.',
    errorRate: 'Ai depășit 10 verificări într-o oră. Reveniți puțin mai târziu, verificările rămân gratuite.',
    errorGeneric: 'Verificarea nu a reușit. Mai încearcă o dată.',
    labNote: 'Viteza e un test de laborator (Google PageSpeed, pe mobil), nu o măsurătoare la vizitatori reali.',
    emailTitle: 'Primește raportul complet PDF pe email',
    emailIntro: 'Îți trimitem raportul cu toate verificările și lista completă de reparatții.',
    nameLabel: 'Nume',
    emailLabel: 'Email',
    phoneLabel: 'Telefon (opțional)',
    consentLabel: 'Vreau să primesc vești de la MAST Studio pe email (opțional)',
    privacyNoticeBefore: 'Trimiteți înseamnă că sunteți de acord cu',
    privacyNoticeLink: 'politica de confidențialitate',
    sendReport: 'Trimite-mi raportul PDF',
    sendingReport: 'Se trimite...',
    reportSent: 'Gata. Raportul PDF pleacă spre adresa ta în câteva minute. Verifică și folderul Spam.',
    reportError: 'Raportul nu a putut fi trimis. Încearcă din nou sau scrie-ne la contact@maststudio.ro.',
    fixTitle: 'Vrei să le rezolvăm noi?',
    fixIntro: 'Ne poți scrie direct cu rezultatul de mai sus și îți spunem ce se poate face și cât costă.',
    whatsappCta: 'Scrie-ne pe WhatsApp cu rezultatul',
    servicesTitle: 'Servicii potrivite pentru ce am găsit',
    servicesIntro: 'Dacă vrei să rezolvăm noi problemele, aici sunt serviciile care se potrivesc.',
    what: 'Ce e greșit',
    why: 'De ce contează',
    who: 'Cine o repară de obicei',
    pdfLine: 'Raportul PDF conține toate cele {n} probleme găsite, valorile măsurate și un plan de lucru.',
  },
  pdf: pdfRo,
  homeBlock: {
    title: 'Verifică-ți site-ul gratuit.',
    text: 'Viteză, legal, Google, contact, accesibilitate: rezultatul pe ecran în 15 secunde, raportul PDF pe email dacă îl vrei.',
    link: 'Verifică-ți site-ul →',
  },
  servicesLink: 'Sau verifică-ți site-ul gratuit, în 15 secunde →',
}

const pdfEn: PdfCopy = {
  title: 'Website check report',
  reportFor: 'Checked site',
  date: 'Check date',
  overall: 'Overall score',
  categories: 'Results by category',
  topFixes: 'Top fixes, by impact',
  footer: 'Report generated automatically by the free MAST Studio website checker. Speed values come from the Google PageSpeed lab test. The legal and cookie checks look at the page’s initial HTML, not a full browser audit.',
  labNote: 'Lab test',
  unverified: 'we couldn’t check this',
  what: 'What’s wrong',
  why: 'Why it matters',
  who: 'Who usually fixes it',
  pageOf: 'Page {x} of {y}',
  footerSite: 'maststudio.ro',
  summaryBest: 'Strongest area: {name} ({score}/100).',
  summaryWorst: 'Weakest area: {name} ({score}/100).',
  summaryProblems: 'Issues found: {n}, of which {urgent} serious.',
  howToReadTitle: 'How to read this report',
  howToRead: [
    'The score runs from 0 to 100 and is the average of the categories we could check. Each check gets a mark: green (fine), amber (could be better) or red (a problem).',
    'The score thresholds: 80–100 means good, 50–79 means could be better, below 50 means serious problems.',
    'Speed is a lab test run by Google (PageSpeed), not a measurement of real visitors. The score can shift by a few points between two runs of the same site.',
    'The legal and cookie checks look at the initial HTML of the homepage, not a full browser audit. A measurement script that is present but blocked until consent counts as a warning, not a problem.',
  ],
  thresholds: { good: '80–100: good', fair: '50–79: could be better', poor: '0–49: serious problems' },
  planTitle: 'Work plan',
  planIntro: 'Every check with a problem or room for improvement, grouped by how soon it is worth fixing. Each one has the problem, why it matters to a customer, the concrete steps, who usually fixes it and the estimated effort.',
  buckets: { week: 'This week', month: 'This month', later: 'When you have time' },
  planLabels: { problem: 'The problem', why: 'Why it matters', how: 'How to fix it', who: 'Who usually fixes it', effort: 'Effort', impact: 'Impact' },
  efforts: { under1h: 'under 1 hour', hours: 'a few hours', days: '1–2 days' },
  impacts: { high: 'high', medium: 'medium', low: 'low' },
  plan: {
    speed: {
      impact: 'high',
      effort: 'days',
      steps: [
        'Note the LCP and CLS values from the report, then compare them with the thresholds in the speed section.',
        'Compress and resize the large images (WebP or AVIF, at the width they actually display).',
        'Defer unused scripts or drop them.',
        'If the values stay high, talk to the hosting provider or the developer.',
      ],
    },
    https: {
      impact: 'high',
      effort: 'under1h',
      steps: [
        'Enable the free SSL certificate in the hosting panel (for example Let’s Encrypt).',
        'Redirect all traffic from http:// to https://.',
        'Open the site and check the browser shows no security warning.',
      ],
    },
    trackers: {
      impact: 'high',
      effort: 'hours',
      steps: [
        'Note which measurement scripts are on the page (the report lists them in the legal section).',
        'Install a consent solution that blocks the scripts until the visitor accepts.',
        'Test in an incognito window: no measurement cookies before pressing Accept.',
      ],
    },
    anpc: {
      impact: 'high',
      effort: 'under1h',
      steps: [
        'Take the official links from the ANPC website.',
        'Add them to the site footer, visible on every page.',
        'Check the links open the official ANPC pages.',
      ],
    },
    sal: {
      impact: 'high',
      effort: 'under1h',
      steps: [
        'Take the official SAL platform link from the ANPC website.',
        'Add it to the site footer, next to the ANPC link.',
        'Check the link opens the dispute-resolution platform.',
      ],
    },
    company: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Add to the footer: the company name, tax ID, trade register number and registered office.',
        'Check the details match the trade register.',
      ],
    },
    privacy: {
      impact: 'high',
      effort: 'hours',
      steps: [
        'Write the privacy policy; a lawyer can adapt it to your activity.',
        'Publish it at a stable address, for example /privacy.',
        'Add the link to the footer and to every form that collects data.',
      ],
    },
    cookieBanner: {
      impact: 'high',
      effort: 'hours',
      steps: [
        'Pick a consent solution (Cookiebot, Complianz, iubenda or equivalent).',
        'Configure it with an accept button and an equally easy reject button, no pre-ticked consent.',
        'Block the measurement scripts until the visitor makes a choice.',
      ],
    },
    title: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Write a title of 15–60 characters, with the main service and the city.',
        'Put it in the title element of the homepage.',
        'Search for the business in Google and check how the title looks.',
      ],
    },
    description: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Write a description of 70–160 characters: what you offer and why choose you.',
        'Put it in the meta description element.',
        'Check the page preview in the Google results.',
      ],
    },
    h1: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Keep a single H1 on the page, with the main message.',
        'Move the other headings down to H2 or H3.',
      ],
    },
    robots: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Create a simple robots.txt file at the root of the site.',
        'Add the line that points to the sitemap.xml address.',
        'Open /robots.txt and check it responds.',
      ],
    },
    sitemap: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Generate the sitemap.xml; most platforms do it from settings.',
        'Submit the sitemap address in Google Search Console.',
      ],
    },
    jsonld: {
      impact: 'medium',
      effort: 'hours',
      steps: [
        'Add schema.org structured data of type LocalBusiness or Organization, with name, address, phone and hours.',
        'Validate it with Google’s Rich Results Test.',
      ],
    },
    maps: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Open the business’s Google Business profile.',
        'Add the link to the profile or the map on the contact page.',
      ],
    },
    phone: {
      impact: 'high',
      effort: 'under1h',
      steps: [
        'Add the number as a tel: link in the header or footer.',
        'Open the site on a phone and check a tap starts the call.',
      ],
    },
    whatsapp: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Create the wa.me link with the business number.',
        'Make it visible, ideally also as a floating button on mobile.',
      ],
    },
    emailForm: {
      impact: 'high',
      effort: 'hours',
      steps: [
        'Add a simple contact form (name, email, message) or a visible email address.',
        'Send a test message and check it reaches you, not the spam folder.',
      ],
    },
    address: {
      impact: 'medium',
      effort: 'under1h',
      steps: [
        'Write the full address on the contact page and in the footer.',
        'Add the Google map next to it.',
      ],
    },
    hours: {
      impact: 'low',
      effort: 'under1h',
      steps: [
        'Add the opening hours to the contact page and the footer.',
        'Add them to the Google Business profile too.',
      ],
    },
    alt: {
      impact: 'medium',
      effort: 'hours',
      steps: [
        'Note the images without alternative text; the report lists them by file name.',
        'Write a short description of what each image shows.',
        'Fill the text in the CMS or in the code.',
      ],
    },
    labels: {
      impact: 'medium',
      effort: 'hours',
      steps: [
        'Note the fields without labels; the report lists them by name.',
        'Add a label with for= or an aria-label to each one.',
      ],
    },
    lang: {
      impact: 'low',
      effort: 'under1h',
      steps: [
        'Add the lang attribute to the html element, for example lang="en".',
        'Check in the code that the attribute survived publishing.',
      ],
    },
  },
  deviceMobile: 'Mobile',
  deviceDesktop: 'Desktop',
  metricLabels: { fcp: 'FCP', lcp: 'LCP', tbt: 'TBT', cls: 'CLS', si: 'Speed Index' },
  metricExplanations: {
    fcp: 'How long until the first content appears on screen.',
    lcp: 'How long until the main content is displayed.',
    tbt: 'How long the page is blocked and unresponsive while loading.',
    cls: 'How much the page moves while loading.',
    si: 'How quickly the page fills in visually.',
  },
  metricScale: {
    fcp: { good: 'up to 1.8 s', poor: 'over 3 s' },
    lcp: { good: 'up to 2.5 s', poor: 'over 4 s' },
    tbt: { good: 'up to 200 ms', poor: 'over 600 ms' },
    cls: { good: 'up to 0.1', poor: 'over 0.25' },
    si: { good: 'up to 3.4 s', poor: 'over 5.8 s' },
  },
  performanceScale: { good: '90–100: fast', fair: '50–89: acceptable', poor: '0–49: slow' },
  scaleWords: { thresholds: 'Thresholds', good: 'good', poor: 'a problem' },
  detailTitleRow: 'Title',
  detailDescriptionRow: 'Meta description',
  detailChars: 'characters',
  opportunitiesTitle: 'Biggest speed opportunities, by Google’s estimate',
  opportunityFallback: '{title} (technical detail)',
  opportunities: {
    'render-blocking-resources': 'Stylesheets and scripts block the first paint: load them later or fewer of them.',
    'unused-javascript': 'Unused JavaScript loads for nothing: drop it or load it only when needed.',
    'unused-css-rules': 'Unused CSS rules load for nothing: clean up the stylesheets.',
    'uses-responsive-images': 'Images are larger than the screen: serve them at the size they display.',
    'modern-image-formats': 'Images are not in a modern compressed format (WebP or AVIF).',
    'uses-webp-images': 'Images are not in a modern compressed format (WebP or AVIF).',
    'uses-optimized-images': 'Images are not compressed efficiently.',
    'offscreen-images': 'Off-screen images load for nothing on open: load them when the visitor reaches them.',
    'unminified-css': 'Stylesheets are not minified.',
    'unminified-javascript': 'JavaScript files are not minified.',
    'uses-text-compression': 'Server responses are not compressed with gzip or brotli.',
    'total-byte-weight': 'The page sends too many bytes on first load.',
    'dom-size': 'The page has too many elements in the code.',
    'mainthread-work-breakdown': 'JavaScript occupies the phone’s main thread for too long.',
    'bootup-time': 'JavaScript takes too long to execute.',
    'server-response-time': 'The server responds slowly to the first request.',
    'redirect-redirects': 'Redirects add delay: shorten the redirect chain.',
    'uses-long-cache-ttl': 'Static files are not cached for long.',
    'efficient-animated-content': 'Large animations (GIF) would work better as video.',
    'legacy-javascript': 'Outdated code for legacy browsers is sent to modern ones too.',
    'prioritize-lcp-image': 'The main image loads too late: give it priority.',
    'preload-lcp-image': 'The main image loads too late: give it priority.',
    'font-display': 'Fonts block the text from showing.',
    'duplicated-javascript': 'Duplicate JavaScript bundles load more than once.',
  },
  psiFailed: 'we couldn’t check this',
  detailNotFound: 'not found',
  detailRedirects: 'Redirect chain',
  detailNoRedirects: 'No redirects: the first address responds directly.',
  detailRedirectHop: '{from} → {to} (HTTP {status})',
  detailLinkFound: 'found: {url}',
  detailCompanyFound: 'text found: “{text}”',
  detailCookieBanner: {
    strong: 'Cookie banner detected on the page.',
    hint: 'Hints of a cookie banner, but it isn’t clear.',
    none: 'No hint of a cookie banner in the initial HTML.',
  },
  detailTrackersFound: 'Measurement tools seen in the initial HTML: {list}.',
  detailTrackersNone: 'No known measurement tool in the initial HTML.',
  detailCookiesTitle: 'Cookies set before consent (from the server response)',
  detailCookiesNone: 'No cookie set by the server on first load.',
  detailCookiesNote: 'The list covers only the initial HTTP response; cookies set by JavaScript can’t be seen without a real browser.',
  detailTitleText: 'Page title ({n} characters; ideally 15–60)',
  detailDescriptionText: 'Meta description ({n} characters; ideally 70–160)',
  detailH1Text: 'H1 headings found: {n}',
  detailH1None: 'No H1 heading on the page.',
  detailJsonLd: 'Structured data types found: {list}.',
  detailJsonLdNone: 'No structured data (JSON-LD) on the page.',
  detailLang: 'Language declared in the code: {lang}.',
  detailImagesNoAlt: 'Images without alternative text: {n} of {m}. Files:',
  detailImagesAllAlt: 'All {m} images have alternative text.',
  detailFieldsNoLabel: 'Form fields without a label: {n} of {m}. Fields:',
  detailFieldsAllLabeled: 'All {m} form fields have a label.',
  detailPhone: 'Phone (tel: link)',
  detailWhatsapp: 'WhatsApp',
  detailEmail: 'Email',
  detailForm: 'Contact form present on the page.',
  detailFormNone: 'No contact form on the page.',
  detailAddress: 'Address (text found on the page)',
  detailHours: 'Hours (text found on the page)',
  techTitle: 'Technical (informational, not scored)',
  techNote: 'The values below describe how the server responds to the first request. They don’t affect the score.',
  techLabels: {
    serverTime: 'Server response time',
    htmlSize: 'HTML size',
    scripts: 'Scripts on the page',
    stylesheets: 'Stylesheets',
    compression: 'Response compression',
    finalUrl: 'Final address after redirects',
    userAgent: 'User agent used for the check',
  },
  compressionValues: { gzip: 'gzip (yes)', br: 'brotli (yes)', none: 'no', unknown: 'unknown' },
  benchmarkTitle: 'How you compare',
  benchmarkIntro: 'The figures below come from our studies of Romanian businesses, not from estimates.',
  benchmarkLines: [
    'We analysed 200 businesses in Timișoara: the share with their own website differs a lot from one industry to another.',
    'We tested 50 Romanian online stores on mobile: every one had at least one problem, and only 48% showed the shipping cost before checkout.',
    'Of those same 50 stores, 15 had no cookie reject button, and 8 pre-ticked the marketing consent.',
  ],
  benchmarkSource: 'Source: MAST Studio study, October 2026.',
  checklistTitle: 'Checklist',
  checklistIntro: 'Tick as you fix. The same list as in the report, with empty boxes.',
  glossaryTitle: 'Glossary',
  glossary: [
    { term: 'LCP', text: 'How long until the largest visible element on the page is displayed.' },
    { term: 'CLS', text: 'How much the page elements move while the page loads.' },
    { term: 'TBT', text: 'How long the page is blocked and unresponsive while loading.' },
    { term: 'HTTPS', text: 'The encrypted connection between browser and site; the address starts with https://.' },
    { term: 'Redirect', text: 'When one address automatically sends the browser to another address.' },
    { term: 'Meta description', text: 'The short text shown under the title in the Google results.' },
    { term: 'H1', text: 'The main heading of the page, the most important heading in the code.' },
    { term: 'JSON-LD', text: 'Structured data written in the page code, which Google reads directly.' },
    { term: 'Sitemap', text: 'The list of the site’s pages, at the /sitemap.xml address, given to Google.' },
    { term: 'robots.txt', text: 'The file that tells search engines what they may and may not visit.' },
    { term: 'Cookie', text: 'A small file the site saves in the visitor’s browser.' },
    { term: 'Tracker', text: 'A script that measures what the visitor does (Analytics, Meta Pixel, TikTok).' },
    { term: 'Consent', text: 'The agreement the visitor gives before being tracked or having cookies saved.' },
    { term: 'ANPC/SAL', text: 'The Romanian consumer protection authority and its dispute-resolution platform.' },
    { term: 'Alt text', text: 'The text describing an image for screen readers and for Google.' },
  ],
  nextTitle: 'What comes next',
  nextIntro: 'If you’d rather have us fix the problems, these services match what we found:',
  nextServices: 'Matching services',
  nextWhatsapp: 'WhatsApp: +40 746 382 204',
  nextEmail: 'Email: contact@maststudio.ro',
  nextRecheck: 'Check the site again: {url}',
  nextGenerated: 'Report generated automatically. Check again after changes.',
}

const en: CheckerCopy = {
  categories: {
    speed: { name: 'Mobile speed', note: 'lab test' },
    legal: { name: 'Trust and legal' },
    google: { name: 'Found on Google' },
    contact: { name: 'Contact and conversion' },
    accessibility: { name: 'Basic accessibility' },
  },
  verdicts: { good: 'Good', fair: 'Could be better', poor: 'Serious problems', unverified: 'We couldn’t check this' },
  verdictIntro: 'Average of the categories we could check.',
  overallLabel: 'Overall score',
  overallOf: 'out of 100',
  sub: {
    performance: { pass: 'The site loads fast on mobile', warn: 'The site loads acceptably, but could be faster', fail: 'The site loads slowly on mobile' },
    https: { pass: 'The site runs on HTTPS (the address starts with https://)', warn: '', fail: 'The site doesn’t run on HTTPS. The address opens over insecure http://' },
    anpc: { pass: 'ANPC link present', warn: '', fail: 'The ANPC link is missing' },
    sal: { pass: 'Link to the SAL dispute-resolution platform present', warn: '', fail: 'The link to the SAL dispute-resolution platform is missing' },
    company: { pass: 'Company details (tax ID or trade register number) appear on the site', warn: '', fail: 'We couldn’t find a tax ID or trade register number on the homepage' },
    privacy: { pass: 'Privacy policy link present', warn: '', fail: 'The privacy policy link is missing' },
    cookieBanner: { pass: 'We found a cookie banner', warn: 'We found hints of a cookie banner, but it isn’t clear', fail: 'We couldn’t find a cookie banner on the homepage' },
    trackers: { pass: 'No measurement tool starts before the visitor consents', warn: 'We found hints of measurement that may start before consent', fail: 'Measurement tools (Google Analytics, Meta Pixel or TikTok) start or set cookies before the visitor consents' },
    title: { pass: 'The page title exists and has a good length ({n} characters)', warn: 'The page title has an awkward length ({n} characters; ideally between 15 and 60)', fail: 'The page has no title (the title element)' },
    description: { pass: 'The meta description exists and has a good length ({n} characters)', warn: 'The meta description has an awkward length ({n} characters; ideally between 70 and 160)', fail: 'The page has no meta description' },
    h1: { pass: 'Exactly one main heading (H1) on the page', warn: '', fail: 'We found {n} main headings (H1) instead of one' },
    robots: { pass: 'The robots.txt file exists and is reachable', warn: '', fail: 'The robots.txt file is missing or unreachable' },
    sitemap: { pass: 'The sitemap.xml exists and is reachable', warn: '', fail: 'The sitemap.xml is missing or unreachable' },
    jsonld: { pass: 'Structured business data (schema.org) present', warn: '', fail: 'Structured business data is missing (schema.org, LocalBusiness or Organization)' },
    maps: { pass: 'Link to the business’s Google map or profile present', warn: '', fail: 'The link to Google Maps or the business’s Google profile is missing' },
    phone: { pass: 'Phone link (tel:) present', warn: '', fail: 'The tappable phone link is missing' },
    whatsapp: { pass: 'WhatsApp link present', warn: '', fail: 'The WhatsApp link is missing' },
    emailForm: { pass: 'Email address or contact form present', warn: '', fail: 'We found neither an email address nor a contact form' },
    address: { pass: 'The business address appears on the page', warn: '', fail: 'We couldn’t find an address in the page text' },
    hours: { pass: 'Opening hours appear on the page', warn: '', fail: 'We couldn’t find opening hours in the page text' },
    alt: { pass: 'All images have alternative text', warn: '{n} of {m} images have no alternative text', fail: '{n} of {m} images have no alternative text' },
    labels: { pass: 'Form fields have labels', warn: '{n} of {m} form fields have no label', fail: '{n} of {m} form fields have no label' },
    lang: { pass: 'The page language is declared (the lang attribute)', warn: '', fail: 'The page language isn’t declared in the code (the lang attribute on html)' },
  },
  speedMetrics: {
    lcp: 'How long until the main content shows up (LCP)',
    cls: 'How much the page moves while loading (CLS)',
    good: 'fast',
    fair: 'acceptable',
    poor: 'slow',
  },
  fixesTitle: 'Top 5 fixes, by impact',
  fixesIntro: 'What’s wrong, why it matters to a customer, and who usually fixes it.',
  fixWho: 'Who usually fixes it',
  unverified: 'we couldn’t check this',
  fixes: {
    speed: {
      title: 'The site is slow on mobile',
      what: 'The mobile PageSpeed test scores {n} out of 100.',
      why: 'A customer on a phone waits a few seconds and then leaves. Every second of waiting loses enquiries.',
      who: 'the firm that built or maintains the site: image, code and hosting optimisation',
    },
    https: {
      title: 'The site doesn’t run on HTTPS',
      what: 'The address opens over http://, and browsers show “Not secure” next to the site name.',
      why: 'The security warning scares customers away before they see what you offer, and form data isn’t protected.',
      who: 'the hosting provider or the site’s developer; an SSL certificate is free at most hosts',
    },
    trackers: {
      title: 'Measurement starts before the visitor consents',
      what: 'Google Analytics, Meta Pixel or TikTok load or set cookies on the first load, before consent.',
      why: 'Without the visitor’s consent this breaks GDPR rules, with a risk of fines, and careful customers notice.',
      who: 'the site’s developer or the firm that built it: scripts are blocked until the visitor accepts',
    },
    anpc: {
      title: 'The ANPC link is missing',
      what: 'There is no ANPC link on the homepage.',
      why: 'For businesses that sell, Romanian law requires the ANPC link, and careful customers look for it before buying.',
      who: 'you or the firm maintaining the site; the official links come from the ANPC website',
    },
    sal: {
      title: 'The dispute-resolution (SAL) link is missing',
      what: 'There is no link to the ANPC SAL platform or the European dispute-resolution platform.',
      why: 'The link is required by consumer law and shows customers you play by the rules.',
      who: 'you or the firm maintaining the site; the official link comes from the ANPC website',
    },
    company: {
      title: 'Company details don’t appear on the site',
      what: 'We couldn’t find a tax ID or trade register number on the homepage.',
      why: 'Visible company details build trust; many customers look for them before the first order.',
      who: 'you, with a small edit in the site footer',
    },
    privacy: {
      title: 'The privacy policy is missing',
      what: 'There is no link to a privacy policy.',
      why: 'It’s mandatory as soon as you collect data (forms, phone, newsletter) and it’s the first document careful customers look for.',
      who: 'a lawyer writes the text; the firm maintaining the site publishes it',
    },
    cookieBanner: {
      title: 'The cookie banner is missing',
      what: 'We couldn’t find a cookie-consent banner on the homepage.',
      why: 'If the site uses measurement or advertising cookies, the visitor’s consent is mandatory in the European Union.',
      who: 'the firm maintaining the site, with a consent solution configured correctly',
    },
    title: {
      title: 'The page title is missing or has an awkward length',
      what: 'The title element is missing, or Google would cut it off.',
      why: 'The title is the first line a customer sees in Google; without it, the page gets no clicks.',
      who: 'the firm maintaining the site or an SEO specialist',
    },
    description: {
      title: 'The meta description is missing or has an awkward length',
      what: 'The meta description is missing, or Google would cut it off.',
      why: 'The description is the text under the title in Google; it decides whether the customer opens your site or a competitor’s.',
      who: 'the firm maintaining the site or an SEO specialist',
    },
    h1: {
      title: 'Too many main headings (H1)',
      what: 'We found {n} H1 headings instead of one.',
      why: 'Google uses the H1 to understand what the page is about; several confuse it and weaken the ranking.',
      who: 'the firm maintaining the site',
    },
    robots: {
      title: 'The robots.txt file is missing',
      what: 'The /robots.txt address doesn’t respond.',
      why: 'Without it, Google has no clear instructions about which pages to index and which to ignore.',
      who: 'the site’s developer or the hosting provider',
    },
    sitemap: {
      title: 'The sitemap.xml is missing',
      what: 'The /sitemap.xml address doesn’t respond.',
      why: 'The sitemap helps Google find all your pages faster, including new ones.',
      who: 'the firm maintaining the site',
    },
    jsonld: {
      title: 'Structured business data is missing',
      what: 'There is no schema.org structured data with the business details (LocalBusiness or Organization).',
      why: 'Without it, Google shows less about your business, and AI assistants find you with more difficulty.',
      who: 'the site’s developer',
    },
    maps: {
      title: 'The Google map or profile link is missing',
      what: 'There is no link to Google Maps or the business’s Google profile.',
      why: 'Local customers search for you on Google Maps; the link takes them straight to reviews and directions.',
      who: 'you, if the Google Business profile already exists, or the firm maintaining the site',
    },
    phone: {
      title: 'The phone link is missing',
      what: 'There is no tel: link the customer can tap.',
      why: 'On a phone, a call is one tap; without the link the customer has to copy the number, and many give up.',
      who: 'the firm maintaining the site',
    },
    whatsapp: {
      title: 'The WhatsApp link is missing',
      what: 'There is no WhatsApp link on the site.',
      why: 'Many customers prefer writing on WhatsApp over calling; without the link, the conversation never starts.',
      who: 'the firm maintaining the site',
    },
    emailForm: {
      title: 'No email address or contact form',
      what: 'We found neither an email address nor a contact form.',
      why: 'If the customer can’t find within seconds how to reach you, they leave for a competitor.',
      who: 'the firm maintaining the site',
    },
    address: {
      title: 'The address doesn’t appear on the page',
      what: 'We couldn’t find an address in the page text.',
      why: 'A clear address builds trust and helps you in local Google searches.',
      who: 'you, with a small content edit',
    },
    hours: {
      title: 'Opening hours don’t appear',
      what: 'We couldn’t find opening hours in the page text.',
      why: 'Customers want to know when they can reach you; without hours, some never call at all.',
      who: 'you, with a small content edit',
    },
    alt: {
      title: 'Images without alternative text',
      what: '{n} of {m} images have no alternative text (the alt attribute).',
      why: 'Alternative text helps customers using screen readers and helps Google understand the images.',
      who: 'the firm maintaining the site',
    },
    labels: {
      title: 'Form fields without labels',
      what: '{n} of {m} form fields have no label.',
      why: 'Without labels, forms are hard to fill in for customers using screen readers, and you lose enquiries.',
      who: 'the site’s developer',
    },
    lang: {
      title: 'The page language isn’t declared',
      what: 'The html element has no lang attribute.',
      why: 'The lang attribute helps Google and screen readers use the right language.',
      who: 'the site’s developer',
    },
  },
  ui: {
    kicker: 'Free check',
    h1: 'Check your website for free',
    lead: 'The result on screen, the PDF report by email.',
    navLabel: 'Website checker',
    intro:
      'In about 15 seconds you see your business’s website the way a customer does: mobile speed, trust and legal, Google presence, contact and accessibility. The result appears right here on screen. Only if you want the full PDF report do we ask for your email.',
    urlLabel: 'Your website address',
    urlPlaceholder: 'e.g. yourfirm.com',
    submit: 'Check for free',
    checking: 'Checking...',
    progressTitle: 'Checks running',
    resultTitle: 'Check result',
    resultFor: 'for',
    again: 'Check another site',
    errorInvalid: 'Enter a valid address, e.g. yourfirm.com.',
    errorUnreachable: 'We couldn’t open the site. Check the address and try again.',
    errorRate: 'You’ve passed 10 checks in an hour. Come back a little later; checks stay free.',
    errorGeneric: 'The check didn’t go through. Please try again.',
    labNote: 'Speed is a lab test (Google PageSpeed, on mobile), not a measurement of real visitors.',
    emailTitle: 'Get the full PDF report by email',
    emailIntro: 'We’ll email you the report with every check and the complete list of fixes.',
    nameLabel: 'Name',
    emailLabel: 'Email',
    phoneLabel: 'Phone (optional)',
    consentLabel: 'I’d like to hear news from MAST Studio by email (optional)',
    privacyNoticeBefore: 'By sending you agree to our',
    privacyNoticeLink: 'privacy policy',
    sendReport: 'Email me the PDF report',
    sendingReport: 'Sending...',
    reportSent: 'Done. The PDF report is on its way to your address; it may take a few minutes. Check your Spam folder too.',
    reportError: 'The report couldn’t be sent. Try again or write to us at contact@maststudio.ro.',
    fixTitle: 'Want us to fix them?',
    fixIntro: 'Write to us with the result above and we’ll tell you what can be done and what it costs.',
    whatsappCta: 'Message us on WhatsApp with the result',
    servicesTitle: 'Services that match what we found',
    servicesIntro: 'If you’d rather have us fix the problems, these are the services that fit.',
    what: 'What’s wrong',
    why: 'Why it matters',
    who: 'Who usually fixes it',
    pdfLine: 'The PDF report contains all {n} issues found, the measured values and a work plan.',
  },
  pdf: pdfEn,
  homeBlock: {
    title: 'Check your website for free.',
    text: 'Speed, legal, Google, contact, accessibility: the result on screen in 15 seconds, the PDF report by email if you want it.',
    link: 'Check your website →',
  },
  servicesLink: 'Or check your website for free, in 15 seconds →',
}

export const checkerCopy: Record<'ro' | 'en', CheckerCopy> = { ro, en }

/** Fills `{n}`-style placeholders in a template. */
export function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match))
}

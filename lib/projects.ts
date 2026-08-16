export type Project = {
  slug: string
  name: string
  client: string
  type: 'client' | 'concept'
  status?: 'live' | 'in-lucru'
  category: 'site-prezentare' | 'site-institutional' | 'magazin-online' | 'aplicatie' | 'platforma' | 'concept-design'
  categoryLabel: string
  year: number
  summary: string
  challenge: string
  solution: string
  result?: string
  conceptNote?: string
  stack: string[]
  liveUrl?: string
  cover: string
  gallery?: string[]
  testimonial?: { quote: string; author: string; role: string }
  featured: boolean
}

export const projects: Project[] = [
  {
    slug: 'veterinaria-timisoara',
    name: 'Veterinaria Timișoara',
    client: 'Cabinet veterinar',
    type: 'client',
    status: 'live',
    category: 'site-prezentare',
    categoryLabel: 'Site de prezentare',
    year: 2026,
    summary:
      'Primul site pentru un cabinet veterinar din Timișoara. Rezultat: cu 80% mai mulți clienți noi.',
    challenge:
      'Cabinetul funcționa de ani buni exclusiv pe recomandări și pe trecători, fără nicio prezență online. Clienții potențiali care căutau „veterinar Timișoara" pe telefon nu îl găseau, iar cei care auzeau de el nu aveau unde să verifice programul, adresa sau serviciile înainte să sune.',
    solution:
      'Am construit site-ul integral, centrat pe cele trei informații pe care le caută un stăpân de animal în criză: ce servicii se oferă, unde e cabinetul și cum se ajunge rapid la un medic. Programul, urgențele non-stop și locația sunt vizibile din primul ecran, iar butonul de programare și cel de apel direct sunt prezente pe toată lungimea paginii. Totul construit mobile-first, pentru că majoritatea căutărilor de acest tip se fac de pe telefon, adesea în situații urgente.',
    result:
      'La câteva luni de la lansare, cabinetul a raportat o creștere de aproximativ 80% a numărului de clienți noi, majoritatea ajungând prin căutări locale pe Google.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'SEO local'],
    liveUrl: 'https://veterinartim.ro',
    cover: '/images/proj-veterinartim.webp',
    featured: true,
  },
  {
    slug: 'agd-innerpath-consulting',
    name: 'AGD Innerpath Consulting',
    client: 'Consultanță juridică și strategică',
    type: 'client',
    status: 'live',
    category: 'site-prezentare',
    categoryLabel: 'Site de prezentare',
    year: 2026,
    summary:
      'Prezență digitală bilingvă pentru o firmă de consultanță la intersecția dintre drept, guvernanță corporativă și afaceri.',
    challenge:
      'Firma consiliază executivi, instituții și autorități publice în piețe emergente și consacrate. Avea nevoie de un site care să transmită autoritate și discreție simultan, fără să pară o agenție de marketing, și care să funcționeze în două limbi pentru clienții internaționali.',
    solution:
      'Am construit site-ul de la zero, cu o direcție vizuală sobră: bleumarin profund, accente aurii, tipografie serif pentru titluri și fotografie de portret ca ancoră de încredere. Structura urmează logica unei conversații de business: cine suntem, ce valori ne ghidează, în ce domenii lucrăm, cine e echipa. Cifrele cheie, ani de experiență, contracte finalizate, piețe acoperite, apar imediat sub titlu, ca dovadă înainte de argument. Întregul site funcționează identic în română și engleză.',
    result:
      'Firma are o prezență digitală care susține poziționarea de consultanță de nivel înalt, în ambele limbi de lucru.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Bilingv RO/EN'],
    liveUrl: 'https://agdmanagement.ro',
    cover: '/images/proj-agd.webp',
    featured: true,
  },
  {
    slug: 'decodex',
    name: 'DECODEX',
    client: 'Proiect co-finanțat prin PoCIDIF 2021-2027',
    type: 'client',
    status: 'live',
    category: 'site-institutional',
    categoryLabel: 'Site instituțional',
    year: 2026,
    summary:
      'Site instituțional complet pentru un proiect de cercetare finanțat din fonduri europene, în domeniul terapiilor celulare personalizate.',
    challenge:
      'Proiectele finanțate din fonduri europene au cerințe stricte de vizibilitate: elemente obligatorii de identitate vizuală, cod SMIS, număr de contract, secțiuni pentru rezultate, echipă, parteneri și noutăți. În același timp, site-ul trebuia să comunice inteligibil un subiect științific complex, pentru un public mixt de cercetători, parteneri instituționali și evaluatori ai finanțatorului.',
    solution:
      'Am construit site-ul integral, de la arhitectura de informație până la implementare. Bara superioară conține permanent identificatorii obligatorii ai finanțării, ceruți de regulile de vizibilitate PoCIDIF. Conținutul științific e organizat pe secțiuni parcurgibile independent, fiecare cu un limbaj adaptat publicului ei. Direcția vizuală, imagistică celulară și accente magenta pe fond întunecat, transmite cercetare de vârf fără să devină aridă. Am gestionat și componenta IT a proiectului, de la specificații tehnice până la livrare și mentenanță.',
    result:
      'Site-ul funcționează ca punct oficial de comunicare al proiectului, atât pentru evaluatorii finanțatorului, cât și pentru comunitatea științifică și partenerii instituționali.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Conformitate PoCIDIF'],
    liveUrl: 'https://decodex.ro',
    cover: '/images/proj-decodex.webp',
    featured: true,
  },
  {
    slug: 'oncogen',
    name: 'OncoGen',
    client: 'Centru de excelență în cercetare',
    type: 'client',
    status: 'live',
    category: 'site-institutional',
    categoryLabel: 'Site instituțional',
    year: 2026,
    summary:
      'Site instituțional pentru un centru de excelență în cercetare oncologică și medicină regenerativă din Timișoara.',
    challenge:
      'Un centru cu activitate de cercetare intensă, publicații internaționale și participare în consorții europene, dar cu o prezență online care nu reflecta amploarea muncii. Provocarea principală: să organizezi un volum mare de conținut științific, proiecte, colaborări, știri, astfel încât fiecare public, de la cercetători la parteneri și presă, să găsească rapid ce caută.',
    solution:
      'Am proiectat și construit site-ul de la zero. Arhitectura de informație are intrări multiple, cercetare, proiecte, colaborări, hub de biotehnologii, noutăți, astfel încât fiecare public să ajungă în două clicuri la ce caută. Bara de știri din partea superioară menține site-ul viu și semnalează activitatea curentă a centrului. Secțiunile de acreditări și certificări sunt accesibile din primul ecran, pentru că sunt argumentul principal în relația cu partenerii instituționali și cu consorțiile europene.',
    result:
      'Centrul are acum o prezență digitală pe măsura activității sale de cercetare, folosită activ în relația cu partenerii internaționali.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Arhitectură de conținut'],
    liveUrl: 'https://oncogen.ro',
    cover: '/images/proj-oncogen.webp',
    featured: false,
  },
  {
    slug: 'painea-casei',
    name: 'Pâinea Casei',
    client: 'Distribuitor oficial DADEX România',
    type: 'client',
    status: 'live',
    category: 'site-prezentare',
    categoryLabel: 'Site de prezentare',
    year: 2026,
    summary:
      'Site de prezentare pentru distribuitorul oficial al unui producător internațional de echipamente de brutărie.',
    challenge:
      'Clientul vinde echipamente profesionale pentru brutării și patiserii, produse cu preț mare și ciclu lung de decizie. Cumpărătorii, patroni de brutării, nu comandă online: cer catalog, specificații și o discuție. Site-ul trebuia să inspire încredere într-un brand internațional și să genereze cereri de catalog, nu vânzări directe.',
    solution:
      'Am construit pagina în jurul unui singur obiectiv de conversie: descărcarea catalogului. Cifrele care contează pentru un cumpărător din industrie, numărul de cuptoare produse, anii de experiență ai producătorului, vechimea distribuției în România, apar imediat sub titlu ca argument de soliditate. Catalogul de produse e structurat pe categorii, cu specificații clare, iar contactul direct e prezent în bara superioară pe toată lungimea site-ului.',
    result:
      'Distribuitorul are acum un canal propriu prin care cumpărătorii ajung direct la catalog și la contact, fără să depindă exclusiv de relații și recomandări.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Catalog produse'],
    liveUrl: 'https://paineacasei.ro',
    cover: '/images/proj-paineacasei.webp',
    featured: false,
  },
  {
    slug: 'asesor',
    name: 'ASESOR',
    client: 'Produs propriu MAST Studio',
    type: 'client',
    status: 'in-lucru',
    category: 'platforma',
    categoryLabel: 'Platformă SaaS',
    year: 2026,
    summary:
      'Platformă de gestiune pentru saloane: programări, clienți, echipă, stocuri și venituri, într-un singur loc.',
    challenge:
      'Saloanele mici își gestionează programările pe hârtie sau în telefon, iar stocurile și veniturile în caiete sau fișiere separate. Rezultatul: programări ratate, produse terminate fără să observe cineva și zero vizibilitate asupra profitului real. Instrumentele existente pe piață sunt fie prea scumpe, fie construite pentru lanțuri mari.',
    solution:
      'Construim o platformă care centralizează exact ce are nevoie un salon mic și mediu, fără funcții inutile: calendar de programări, fișe de client cu istoric, gestiune de echipă, urmărire de stocuri și raportare de venituri. Interfața e gândită pentru a fi folosită de la telefon, între doi clienți, nu de la birou.',
    stack: ['Next.js', 'React', 'PostgreSQL', 'Tailwind CSS'],
    liveUrl: 'https://asesor.ro',
    cover: '/images/proj-asesor.webp',
    featured: true,
  },
  {
    slug: 'lumora',
    name: 'Lumora',
    client: 'Concept de design',
    type: 'concept',
    status: 'live',
    category: 'concept-design',
    categoryLabel: 'Concept de design',
    year: 2026,
    summary:
      'Landing page pentru un produs digital de wellness, construit ca exercițiu de atmosferă și tipografie.',
    challenge:
      'Un produs care vinde liniște are nevoie de o pagină care o și transmite, nu doar o descrie. Provocarea: să construiești o senzație de calm fără să pierzi claritatea comercială, într-o categorie în care majoritatea site-urilor arată identic.',
    solution:
      'Am construit pagina în jurul unei singure imagini de atmosferă la scară completă, cu tipografie mare și aerisită suprapusă. Formularul de înscriere e integrat direct în hero, cu un singur câmp, iar variantele de ambianță se schimbă din patru opțiuni fără reîncărcarea paginii. Totul rămâne lizibil peste fundal datorită unui strat de contrast calculat, nu unui panou opac.',
    conceptNote:
      'Concept demonstrativ, nu un produs real. Construit pentru a testa lizibilitatea tipografiei mari peste imagine la scară completă.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://demo1.maststudio.ro',
    cover: '/images/concept-lumora.webp',
    featured: false,
  },
  {
    slug: 'mostar',
    name: 'Mostar',
    client: 'Concept de design',
    type: 'concept',
    status: 'live',
    category: 'concept-design',
    categoryLabel: 'Concept de design',
    year: 2026,
    summary:
      'Pagină de destinație turistică, construită ca exercițiu de narațiune vizuală pe scroll.',
    challenge:
      'O destinație se vinde prin imagine, dar imaginile singure nu construiesc o poveste. Provocarea: să folosești scroll-ul ca instrument de regie, astfel încât vizitatorul să parcurgă locul, nu doar o galerie.',
    solution:
      'Am construit o secvență în care straturile imaginii se mișcă independent pe scroll, creând adâncime reală în loc de parallax decorativ. Conținutul apare în ritmul mișcării, iar navigarea între secțiuni păstrează continuitatea vizuală. Pagina funcționează bilingv, cu comutare instantanee.',
    conceptNote:
      'Concept demonstrativ, nu o pagină oficială. Construit pentru a testa narațiunea vizuală controlată prin scroll.',
    stack: ['Next.js', 'React', 'Tailwind CSS', 'Scroll-driven animation'],
    liveUrl: 'https://demo2.maststudio.ro',
    cover: '/images/concept-mostar.webp',
    featured: false,
  },
  {
    slug: 'lithos',
    name: 'Lithos',
    client: 'Concept de design',
    type: 'concept',
    status: 'live',
    category: 'concept-design',
    categoryLabel: 'Concept de design',
    year: 2026,
    summary:
      'Platformă educațională de geologie, construită ca exercițiu de interacțiune și profunzime vizuală.',
    challenge:
      'Conținutul științific are nevoie de o interfață care să invite la explorare, nu la lectură pasivă. Provocarea: să construiești o pagină care să transmită scară și profunzime, fără să sacrifici performanța.',
    solution:
      'Am construit un hero cu reveal controlat de cursor, în care o a doua imagine se descoperă printr-o mască circulară care urmărește mișcarea, cu netezire aplicată pentru a evita senzația de sacadare. Navigarea e concentrată într-o singură pastilă centrală, iar întreaga interacțiune se dezactivează elegant pe dispozitivele fără cursor.',
    conceptNote:
      'Concept demonstrativ, nu o platformă reală. Construit pentru a testa interacțiunile bazate pe cursor și mască.',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Canvas API'],
    liveUrl: 'https://demo3.maststudio.ro',
    cover: '/images/concept-lithos.webp',
    featured: false,
  },
]

export function getAllProjects(): Project[] {
  return [...projects].sort((a, b) => Number(b.featured) - Number(a.featured))
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getFeaturedProjects(limit: number): Project[] {
  return projects.filter((project) => project.featured).slice(0, limit)
}

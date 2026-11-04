import { industryTextEn } from './i18n/content/industries.en'
import type { Locale } from './i18n/locale'
import { canonicalIndustrySlug } from './i18n/paths'

/**
 * Commercial pages that bundle the right services per type of business.
 * Unlike the blog guides (which inform), these pages sell: every industry
 * points at the services, projects and guide posts that fit it.
 */
export type Industry = {
  /** Canonical Romanian slug, also the route id. */
  slug: string
  enSlug: string
  name: string
  /** Visible H1. */
  h1: string
  /** Title tag without the brand suffix (keep it under 46 characters). */
  seoTitle: string
  /** Meta description, 120-158 characters. */
  metaDescription: string
  answerCapsule: string
  intro: string
  problems: string[]
  dataPoint: { text: string; source: string }
  /** Service slugs from lib/services, shown as rows with their starting price. */
  recommendedServices: string[]
  /** Portfolio projects from lib/projects; missing slugs are skipped at render time. */
  projectSlugs: string[]
  /** Blog guide that goes deeper; missing slugs are skipped at render time. */
  guidePost?: string
  faq: { question: string; answer: string }[]
  /** Prefilled WhatsApp message for the contact block. */
  waMessage: string
}

const industries: Industry[] = [
  {
    slug: 'clinici-medicale',
    enSlug: 'medical-clinics',
    name: 'Clinici și cabinete medicale',
    h1: 'Site și soluții digitale pentru clinici medicale',
    seoTitle: 'Site pentru clinici și cabinete medicale',
    metaDescription:
      'Site, programări online și asistent AI pentru clinici medicale și stomatologice: pacienții află repede ce oferi, cât costă și cum se programează.',
    answerCapsule:
      'Pentru o clinică medicală sau stomatologică construim un site clar, gândit pentru telefon, cu servicii, medici, prețuri orientative și programare online, plus un asistent AI care răspunde pacienților la orice oră. Toate respectă regulile de publicitate medicală și GDPR.',
    intro:
      'Pacienții compară clinicile pe telefon, de obicei seara, și sună unde găsesc repede ce caută: serviciul, medicul, prețul și o oră liberă. Un site bun face toate astea în primul ecran și răspunde la întrebări fără să mai fie nevoie de un telefon.',
    problems: [
      'pacienții sună doar ca să afle programul sau prețul',
      'programările se fac doar telefonic, în orele de lucru',
      'neprezentările costă ore de cabinet',
      'site-ul nu arată medicii și specializările',
    ],
    dataPoint: {
      text: 'În studiul nostru pe 200 de afaceri din Timișoara, 88% dintre clinicile medicale și 84% dintre cabinetele stomatologice din primele rezultate Google aveau site propriu. Fără site, ești în minoritatea care pierde pacienți.',
      source: 'Studiu MAST Studio, octombrie 2026',
    },
    recommendedServices: ['site-de-prezentare', 'sistem-programari-online', 'asistent-ai', 'audit-securitate-gdpr', 'seo-local'],
    projectSlugs: ['platforma-clinica'],
    guidePost: 'site-clinica-medicala',
    faq: [
      {
        question: 'Ce trebuie să conțină site-ul unei clinici?',
        answer:
          'Serviciile, medicii și specializările, prețuri orientative, programul, adresa cu hartă și o programare simplă, totul ușor de găsit pe telefon.',
      },
      {
        question: 'Poate asistentul AI să dea sfaturi medicale?',
        answer:
          'Nu. Răspunde doar la întrebări administrative din informațiile aprobate de voi, cum ar fi program, prețuri și pregătirea pentru o investigație, și trimite orice întrebare medicală către un om.',
      },
    ],
    waMessage: 'Salut! Am o clinică medicală și vreau să discutăm despre site.',
  },
  {
    slug: 'cabinete-veterinare',
    enSlug: 'veterinary-practices',
    name: 'Cabinete veterinare',
    h1: 'Site și soluții digitale pentru cabinete veterinare',
    seoTitle: 'Site pentru cabinet veterinar',
    metaDescription:
      'Site pentru cabinete veterinare cu urgențe, program și apel direct în primul ecran, plus programări online și remindere pentru vaccinuri și controale.',
    answerCapsule:
      'Pentru un cabinet veterinar construim un site în care stăpânul grăbit găsește în primul ecran urgențele, programul, adresa și butonul de apel. Adăugăm programări online și remindere automate pentru vaccinuri și controale.',
    intro:
      'Un stăpân care caută veterinar e adesea speriat și pe telefon. Nu citește, caută: e deschis, unde e, cum sun. Site-ul trebuie să-i răspundă în trei secunde.',
    problems: [
      'urgențele și programul nu se văd repede pe telefon',
      'reminderele pentru vaccinuri se fac manual sau deloc',
      'mulți clienți noi nu găsesc cabinetul pe Google',
      'întrebările repetitive ocupă telefonul',
    ],
    dataPoint: {
      text: 'În studiul nostru, doar 12 din 25 de cabinete veterinare din primele rezultate Google din Timișoara aveau un site propriu.',
      source: 'Studiu MAST Studio, octombrie 2026',
    },
    recommendedServices: ['site-de-prezentare', 'sistem-programari-online', 'automatizari-whatsapp', 'seo-local'],
    projectSlugs: ['veterinaria-timisoara'],
    guidePost: 'site-cabinet-veterinar',
    faq: [
      {
        question: 'Ce e cel mai important pe site-ul unui cabinet veterinar?',
        answer: 'Urgențele, programul, adresa și butonul de apel, vizibile imediat pe telefon. Restul vine după.',
      },
      {
        question: 'Se pot trimite automat remindere pentru vaccinuri?',
        answer: 'Da, prin sistemul de programări sau prin automatizări WhatsApp, cu mesaje aprobate de voi.',
      },
    ],
    waMessage: 'Salut! Am un cabinet veterinar și vreau să discutăm despre site.',
  },
  {
    slug: 'saloane-infrumusetare',
    enSlug: 'beauty-salons',
    name: 'Saloane și clinici estetice',
    h1: 'Site și programări online pentru saloane de înfrumusețare',
    seoTitle: 'Site și programări pentru saloane',
    metaDescription:
      'Site pentru saloane și clinici estetice cu servicii, prețuri, galerie reală și programare online fără comision, legat de Instagram și WhatsApp.',
    answerCapsule:
      'Pentru saloane și clinici estetice construim un site cu servicii și prețuri ușor de citit, galerie reală, programare online fără comision și legătură cu Instagram și WhatsApp, ca să nu mai depinzi doar de algoritm.',
    intro:
      'Instagramul aduce atenție, dar nu e al tău: algoritmul se schimbă, iar clientul care te caută pe Google nu te găsește. Un site propriu, cu programare online, transformă atenția în programări.',
    problems: [
      'programările vin doar în mesaje, la orice oră',
      'prețurile se dau de zeci de ori pe zi în privat',
      'platformele de programări iau comision și te pun lângă concurenți',
      'pe Google apare doar profilul de pe hartă',
    ],
    dataPoint: {
      text: 'În studiul nostru pe 25 de saloane din primele rezultate Google din Timișoara, doar 5 aveau un site propriu. Este domeniul cu cel mai mare gol din oraș.',
      source: 'Studiu MAST Studio, octombrie 2026',
    },
    recommendedServices: ['site-de-prezentare', 'sistem-programari-online', 'asistent-ai', 'campanii-reclame'],
    projectSlugs: ['dragana-lorelei-nail-art-academy', 'asesor'],
    guidePost: 'site-salon-infrumusetare',
    faq: [
      {
        question: 'Am nevoie de site dacă am Instagram?',
        answer:
          'Da, dacă vrei să te găsească și cei care nu te urmăresc deja. Instagramul arată lucrările, site-ul aduce clienți din Google și face programarea simplă.',
      },
      {
        question: 'Programarea online înlocuiește mesajele?',
        answer:
          'Pentru cei mai mulți clienți, da. Cine preferă să scrie poate scrie în continuare, iar asistentul AI poate prelua și programări din conversație.',
      },
    ],
    waMessage: 'Salut! Am un salon de înfrumusețare și vreau să discutăm despre site.',
  },
  {
    slug: 'avocati-contabili',
    enSlug: 'lawyers-accountants',
    name: 'Avocați, contabili și consultanți',
    h1: 'Site pentru avocați, contabili și consultanți',
    seoTitle: 'Site pentru avocați și contabili',
    metaDescription:
      'Site sobru pentru avocați, firme de contabilitate și consultanți: domenii de practică, echipă, încredere și contact discret, în română și engleză.',
    answerCapsule:
      'Pentru avocați, contabili și consultanți construim site-uri sobre, care transmit încredere: domenii de practică clare, echipa cu experiența ei, articole care răspund la întrebările clienților și un contact discret. La cerere, în română și engleză.',
    intro:
      'Clienții profesiilor liberale aleg pe încredere, iar încrederea se formează înainte de primul telefon. Un site clar, sobru și actualizat spune mai mult despre seriozitatea ta decât orice slogan.',
    problems: [
      'site-ul nu explică pe înțeles domeniile de practică',
      'puține recenzii, deci clienții noi nu au dovezi',
      'clienții străini nu găsesc informații în engleză',
      'întrebările de bază ocupă timp facturabil',
    ],
    dataPoint: {
      text: 'În studiul nostru, firmele de contabilitate din primele rezultate Google din Timișoara aveau în mediană doar 8 recenzii, iar doar 13 din 25 aveau site propriu.',
      source: 'Studiu MAST Studio, octombrie 2026',
    },
    recommendedServices: ['site-de-prezentare', 'continut-seo', 'vizibilitate-ai', 'conformitate-legala-site'],
    projectSlugs: ['agd-innerpath-consulting'],
    guidePost: 'site-cabinet-avocatura',
    faq: [
      {
        question: 'Ce trebuie să aibă site-ul unui avocat?',
        answer:
          'Domeniile de practică explicate clar, prezentarea avocaților, articole utile și un contact discret, cu respectarea regulilor profesiei privind publicitatea.',
      },
      {
        question: 'Merită un site în două limbi?',
        answer: 'Da, dacă lucrezi cu clienți sau parteneri străini. Îl construim cu aceeași structură în română și engleză.',
      },
    ],
    waMessage: 'Salut! Am un cabinet de avocatură sau contabilitate și vreau să discutăm despre site.',
  },
  {
    slug: 'meseriasi',
    enSlug: 'trades',
    name: 'Meseriași și servicii la domiciliu',
    h1: 'Site pentru meseriași și firme de servicii',
    seoTitle: 'Site pentru meseriași și firme de servicii',
    metaDescription:
      'Site pentru instalatori, electricieni și firme de renovări: zonele în care lucrezi, lucrări reale, buton de apel mereu vizibil și profil Google îngrijit.',
    answerCapsule:
      'Pentru meseriași și firmele de servicii la domiciliu construim un site simplu și rapid pe telefon, cu zonele în care lucrezi, poze cu lucrări reale și butonul de apel mereu vizibil, plus un profil Google îngrijit care aduce telefoane din cartierele tale.',
    intro:
      'Cine are o țeavă spartă nu citește, sună. Primul meseriaș care apare pe hartă, are poze cu lucrări și un număr pe care poți apăsa primește lucrarea. Restul nici nu află că a existat.',
    problems: [
      'site-ul vechi nu se deschide sau duce în altă parte',
      'puține recenzii pe Google',
      'nu se vede în ce zone lucrezi',
      'pozele cu lucrări stau doar în telefon',
    ],
    dataPoint: {
      text: 'În studiul nostru, 3 din cele 16 site-uri proprii ale meseriașilor din Timișoara nu se deschideau sau trimiteau vizitatorul la altă firmă, iar mediana recenziilor era 14.',
      source: 'Studiu MAST Studio, octombrie 2026',
    },
    recommendedServices: ['site-de-prezentare', 'seo-local', 'refacere-site', 'campanii-reclame'],
    projectSlugs: [],
    faq: [
      {
        question: 'Am nevoie de site dacă am profil pe Google?',
        answer:
          'Profilul aduce telefoanele, iar site-ul le confirmă: oamenii verifică lucrările și zonele înainte să sune. Împreună funcționează mult mai bine.',
      },
      {
        question: 'Ce poze să pun pe site?',
        answer: 'Lucrări reale, înainte și după, făcute cu telefonul, sunt mai convingătoare decât orice poză de stoc.',
      },
    ],
    waMessage: 'Salut! Am o firmă de meseriași și vreau să discutăm despre site.',
  },
  {
    slug: 'magazine-online',
    enSlug: 'online-stores',
    name: 'Magazine online',
    h1: 'Magazin online care vinde pe telefon',
    seoTitle: 'Magazin online care vinde pe telefon',
    metaDescription:
      'Magazin online construit pentru finalizarea comenzii pe telefon: transport vizibil în coș, ramburs și card, fără ferestre peste butoane, conform legal.',
    answerCapsule:
      'Pentru magazinele online construim totul în jurul finalizării comenzii pe telefon, acolo unde se câștigă sau se pierd vânzările: costul transportului vizibil în coș, plată cu cardul și ramburs, fără ferestre care acoperă butonul de cumpărare și cu toate elementele legale.',
    intro:
      'Majoritatea vizitatorilor unui magazin românesc vin de pe telefon, iar cei mai mulți pleacă în ultimii doi pași. Un magazin bun nu e doar frumos, e construit ca nimic să nu stea între client și butonul de comandă.',
    problems: [
      'costul transportului apare abia la final',
      'ferestre și butoane plutitoare acoperă butonul de coș',
      'banner de cookie-uri fără refuz',
      'magazinul e lent pe telefon',
    ],
    dataPoint: {
      text: 'Când am testat 50 de magazine online românești pe telefon, toate aveau cel puțin o problemă, iar doar 48% arătau costul transportului înainte de finalizarea comenzii.',
      source: 'Studiu MAST Studio, octombrie 2026',
    },
    recommendedServices: ['magazin-online', 'conformitate-legala-site', 'asistent-ai', 'campanii-reclame', 'continut-seo'],
    projectSlugs: [],
    guidePost: 'cat-costa-magazin-online',
    faq: [
      {
        question: 'De ce pierd clienți la finalizarea comenzii?',
        answer:
          'Cel mai des din cauza costurilor apărute la final, a pașilor prea mulți și a elementelor care acoperă butoanele pe telefon. Le eliminăm din construcție.',
      },
      {
        question: 'Pot avea și ramburs, și card?',
        answer: 'Da. În România, plata ramburs rămâne foarte cerută, așa că le oferim pe amândouă.',
      },
    ],
    waMessage: 'Salut! Am un magazin online și vreau să discutăm despre site.',
  },
]

function localizeIndustry(industry: Industry, locale: Locale): Industry {
  if (locale === 'ro') return industry
  const text = industryTextEn[industry.slug]
  return text ? { ...industry, ...text } : industry
}

export function getAllIndustries(locale: Locale = 'ro') {
  return industries.map((industry) => localizeIndustry(industry, locale))
}

export function getIndustryBySlug(slug: string, locale: Locale = 'ro') {
  const id = canonicalIndustrySlug(slug) ?? slug
  const industry = industries.find((item) => item.slug === id)
  return industry ? localizeIndustry(industry, locale) : undefined
}

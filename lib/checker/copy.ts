import type { CategoryKey, CategoryVerdict } from './types'

/**
 * Every sentence the checker can show, written once per language. The checker
 * never generates prose: it only picks from these templates and fills numbers
 * into `{n}`-style placeholders.
 */

export type SubCopy = { pass: string; warn: string; fail: string }

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
  }
  pdf: {
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
  }
  homeBlock: { title: string; text: string; link: string }
  servicesLink: string
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
  },
  pdf: {
    title: 'Raport verificare site',
    reportFor: 'Site verificat',
    date: 'Data verificării',
    overall: 'Scor general',
    categories: 'Rezultate pe categorii',
    topFixes: 'Primele reparatții, în ordinea impactului',
    footer: 'Raport generat automat de verificatorul gratuit MAST Studio. Valorile de viteză sunt din testul de laborator Google PageSpeed (mobil). Verificarea legală și de cookie-uri privește HTML-ul inițial al paginii, nu un audit complet de browser.',
    labNote: 'Test de laborator',
    unverified: 'nu am putut verifica',
    what: 'Ce e greșit',
    why: 'De ce contează',
    who: 'Cine o repară de obicei',
  },
  homeBlock: {
    title: 'Verifică-ți site-ul gratuit.',
    text: 'Viteză, legal, Google, contact, accesibilitate: rezultatul pe ecran în 15 secunde, raportul PDF pe email dacă îl vrei.',
    link: 'Verifică-ți site-ul →',
  },
  servicesLink: 'Sau verifică-ți site-ul gratuit, în 15 secunde →',
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
  },
  pdf: {
    title: 'Website check report',
    reportFor: 'Checked site',
    date: 'Check date',
    overall: 'Overall score',
    categories: 'Results by category',
    topFixes: 'Top fixes, by impact',
    footer: 'Report generated automatically by the free MAST Studio website checker. Speed values come from the Google PageSpeed lab test (mobile). The legal and cookie checks look at the page’s initial HTML, not a full browser audit.',
    labNote: 'Lab test',
    unverified: 'we couldn’t check this',
    what: 'What’s wrong',
    why: 'Why it matters',
    who: 'Who usually fixes it',
  },
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

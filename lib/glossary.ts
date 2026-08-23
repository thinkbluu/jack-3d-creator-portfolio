export type GlossaryCategory = 'tehnic' | 'design' | 'marketing' | 'legal'

export type GlossaryTerm = {
  slug: string
  term: string
  category: GlossaryCategory
  definition: string
  extra?: string
  related?: string[]
}

export const glossaryCategoryLabels: Record<GlossaryCategory, string> = {
  tehnic: 'Tehnic',
  design: 'Design',
  marketing: 'Marketing',
  legal: 'Legal',
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: 'pagespeed',
    term: 'PageSpeed',
    category: 'tehnic',
    definition:
      'PageSpeed este scorul dat de Google unui site în funcție de cât de repede se încarcă și cât de repede devine utilizabil. Se măsoară de la 0 la 100, separat pentru mobil și desktop. Un scor sub 50 pe mobil înseamnă că site-ul pierde vizitatori și coboară în rezultatele căutării.',
    extra: 'Se verifică gratuit cu instrumentul PageSpeed Insights al Google.',
    related: ['hosting', 'responsive'],
  },
  {
    slug: 'domeniu',
    term: 'Domeniu',
    category: 'tehnic',
    definition:
      'Domeniul este adresa site-ului tău pe internet, de exemplu firmata.ro. Se cumpără pe un an sau mai mulți, costă între 10 și 40 EUR pe an pentru extensia .ro, și trebuie înregistrat pe numele firmei tale, nu al furnizorului care îți face site-ul.',
    related: ['hosting'],
  },
  {
    slug: 'hosting',
    term: 'Găzduire (hosting)',
    category: 'tehnic',
    definition:
      'Găzduirea este serviciul care ține site-ul tău accesibil pe internet, 24 de ore din 24. Costă între 40 și 100 EUR pe an pentru un site de prezentare. Fără găzduire, site-ul există doar pe calculatorul celui care l-a construit.',
    related: ['domeniu', 'pagespeed'],
  },
  {
    slug: 'responsive',
    term: 'Responsive',
    category: 'tehnic',
    definition:
      'Responsive înseamnă că un site își adaptează automat aspectul la mărimea ecranului, de la telefon la monitor mare. Fără design responsive, textul e minuscul pe telefon și trebuie dat zoom, iar Google penalizează astfel de site-uri în rezultatele de căutare pe mobil.',
    related: ['pagespeed', 'wireframe'],
  },
  {
    slug: 'cms',
    term: 'CMS',
    category: 'tehnic',
    definition:
      'Un CMS (Content Management System) este un sistem care îți permite să modifici singur textele și pozele de pe site, fără să știi să scrii cod. WordPress este cel mai folosit CMS din lume, dar există și alternative construite pe măsură pentru nevoi specifice.',
    related: ['wordpress', 'front-end'],
  },
  {
    slug: 'wordpress',
    term: 'WordPress',
    category: 'tehnic',
    definition:
      'WordPress este cel mai folosit sistem de administrare a site-urilor din lume, folosit de aproximativ 40% din toate site-urile de pe internet. Este flexibil și ieftin de pornit, dar necesită mentenanță regulată (actualizări, securitate) pentru a rămâne sigur și rapid.',
    related: ['cms', 'ssl'],
  },
  {
    slug: 'ssl',
    term: 'SSL',
    category: 'tehnic',
    definition:
      'SSL este certificatul care criptează datele trimise între vizitator și site-ul tău, vizibil prin lacătul din bara de adrese și adresa care începe cu https. Fără el, browserele marchează site-ul ca „nesigur”, iar Google îl penalizează în clasament.',
    related: ['hosting', 'domeniu'],
  },
  {
    slug: 'seo',
    term: 'SEO',
    category: 'marketing',
    definition:
      'SEO (Search Engine Optimization) este ansamblul de tehnici prin care un site apare mai sus în rezultatele Google pentru căutări relevante, fără să plătești pentru reclame. Include viteza site-ului, structura textului, cuvintele-cheie și legăturile primite de la alte site-uri.',
    related: ['seo-local', 'meta-description', 'backlink'],
  },
  {
    slug: 'seo-local',
    term: 'SEO local',
    category: 'marketing',
    definition:
      'SEO local este optimizarea unui site și a profilului de afacere pentru ca acesta să apară în căutări cu specific geografic, de exemplu „instalator Timișoara”. Se bazează pe Google Business Profile, recenzii, adresa consecventă online și mențiuni locale.',
    related: ['seo', 'google-business-profile'],
  },
  {
    slug: 'google-business-profile',
    term: 'Google Business Profile',
    category: 'marketing',
    definition:
      'Google Business Profile este profilul gratuit al afacerii tale care apare pe Google Maps și în panoul din dreapta căutărilor Google, cu program, adresă, recenzii și fotografii. Este esențial pentru orice afacere cu locație fizică sau zonă de servicii locală.',
    related: ['seo-local'],
  },
  {
    slug: 'landing-page',
    term: 'Landing page',
    category: 'marketing',
    definition:
      'O landing page este o pagină unică, dedicată unui singur scop, de obicei folosită pentru o campanie de reclame sau lansarea unui produs. Are un singur buton de acțiune și evită linkurile care distrag vizitatorul de la conversie.',
    related: ['conversie', 'cta'],
  },
  {
    slug: 'conversie',
    term: 'Conversie',
    category: 'marketing',
    definition:
      'O conversie este momentul în care un vizitator face acțiunea pe care o urmărești: trimite un mesaj, completează un formular sau cumpără un produs. Numărul de conversii, nu numărul de vizite, arată dacă un site își face treaba.',
    related: ['rata-de-conversie', 'cta'],
  },
  {
    slug: 'rata-de-conversie',
    term: 'Rată de conversie',
    category: 'marketing',
    definition:
      'Rata de conversie este procentul de vizitatori care fac acțiunea dorită, calculat ca număr de conversii împărțit la numărul total de vizitatori. O rată de 2-3% este obișnuită pentru un site de prezentare; peste 5% este considerat foarte bun.',
    related: ['conversie', 'landing-page'],
  },
  {
    slug: 'cta',
    term: 'CTA',
    category: 'marketing',
    definition:
      'CTA (Call to Action) este butonul sau textul care spune vizitatorului exact ce să facă în continuare, de exemplu „Cere ofertă” sau „Scrie-ne pe WhatsApp”. Un site fără un CTA clar lasă vizitatorul să plece fără să acționeze, indiferent cât de bun e conținutul.',
    related: ['conversie', 'landing-page'],
  },
  {
    slug: 'mockup',
    term: 'Mockup',
    category: 'design',
    definition:
      'Un mockup este o reprezentare vizuală, statică, a unui site sau ecran de aplicație, arătând exact cum va apărea la final: culori, fonturi, imagini reale. Diferă de wireframe prin faptul că e complet stilizat, nu doar schematic.',
    related: ['wireframe', 'front-end'],
  },
  {
    slug: 'wireframe',
    term: 'Wireframe',
    category: 'design',
    definition:
      'Un wireframe este o schiță simplă, fără culori sau stil final, care arată doar structura și poziția elementelor de pe o pagină: unde e titlul, unde e butonul, unde e imaginea. Se folosește la începutul proiectului, înainte de design-ul final.',
    related: ['mockup', 'responsive'],
  },
  {
    slug: 'front-end',
    term: 'Front-end',
    category: 'tehnic',
    definition:
      'Front-end-ul este partea unui site sau aplicații pe care o vede și o folosește direct vizitatorul: layout, culori, butoane, animații. Este construit cu tehnologii precum HTML, CSS și JavaScript și rulează în browserul utilizatorului.',
    related: ['back-end', 'api'],
  },
  {
    slug: 'back-end',
    term: 'Back-end',
    category: 'tehnic',
    definition:
      'Back-end-ul este partea invizibilă a unei aplicații care gestionează datele, logica de business și securitatea, de exemplu procesarea unei comenzi sau salvarea unui cont de utilizator. Rulează pe un server, nu în browserul vizitatorului.',
    related: ['front-end', 'api'],
  },
  {
    slug: 'api',
    term: 'API',
    category: 'tehnic',
    definition:
      'Un API (Application Programming Interface) este modul standardizat prin care două programe comunică între ele, de exemplu site-ul tău și sistemul de facturare sau cel de curierat. Fără API-uri, fiecare integrare ar trebui construită manual, de la zero.',
    related: ['back-end', 'e-factura'],
  },
  {
    slug: 'e-factura',
    term: 'e-Factura',
    category: 'legal',
    definition:
      'e-Factura este sistemul național obligatoriu prin care firmele din România trimit facturile electronic către ANAF, în format standardizat. Un magazin online sau o platformă de facturare trebuie integrată cu acest sistem pentru a emite facturi valide.',
    related: ['api', 'gdpr'],
  },
  {
    slug: 'gdpr',
    term: 'GDPR',
    category: 'legal',
    definition:
      'GDPR este regulamentul european care obligă orice site care colectează date personale (nume, e-mail, telefon) să le protejeze, să explice clar cum le folosește și să permită ștergerea lor la cerere. Se aplică oricărui site cu formular de contact sau cont de utilizator.',
    related: ['cookie-banner'],
  },
  {
    slug: 'cookie-banner',
    term: 'Cookie banner',
    category: 'legal',
    definition:
      'Cookie banner-ul este bannerul care apare la prima vizită pe un site și cere acordul vizitatorului pentru folosirea cookie-urilor de analiză sau marketing. Este obligatoriu prin lege dacă site-ul folosește astfel de cookie-uri, iar refuzul trebuie să fie la fel de simplu ca acceptul.',
    related: ['gdpr'],
  },
  {
    slug: 'backlink',
    term: 'Backlink',
    category: 'marketing',
    definition:
      'Un backlink este un link de pe alt site care trimite către site-ul tău. Google le tratează ca „voturi de încredere”: cu cât mai multe backlink-uri de calitate primești, cu atât crește șansa să apari mai sus în rezultatele de căutare.',
    related: ['seo'],
  },
  {
    slug: 'meta-description',
    term: 'Meta description',
    category: 'marketing',
    definition:
      'Meta description este textul scurt care apare sub titlul unui site în rezultatele Google, menit să convingă utilizatorul să dea click. Nu influențează direct clasarea, dar o descriere slabă scade rata de click chiar dacă site-ul apare pe prima poziție.',
    related: ['seo', 'sitemap'],
  },
  {
    slug: 'sitemap',
    term: 'Sitemap',
    category: 'tehnic',
    definition:
      'Un sitemap este un fișier care listează toate paginile importante ale unui site, folosit de Google pentru a le descoperi și indexa mai rapid și mai complet. Este diferit de meniul de navigare, fiind destinat motoarelor de căutare, nu vizitatorilor.',
    related: ['favicon', 'seo'],
  },
  {
    slug: 'favicon',
    term: 'Favicon',
    category: 'design',
    definition:
      'Favicon-ul este iconița mică a site-ului care apare în tab-ul browserului, în marcaje și în rezultatele de căutare de pe mobil. Un site fără favicon arată neterminat și e mai greu de identificat printre mai multe tab-uri deschise.',
    related: ['mockup'],
  },
]

export function getAllGlossaryTerms() {
  return glossaryTerms
}

export function getGlossaryTermBySlug(slug: string) {
  return glossaryTerms.find((item) => item.slug === slug)
}

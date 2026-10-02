# Contribuții la blogul MAST Studio

## Adăugarea unui articol

1. Copiază `content/TEMPLATE.mdx` în `content/blog/<slug>.mdx`.
2. Folosește un slug cu litere mici, cifre și cratime, fără diacritice. Valoarea `slug` din frontmatter trebuie să fie identică cu numele fișierului.
3. Completează toate câmpurile obligatorii și elimină câmpurile opționale nefolosite.
4. Scrie corpul în Markdown sau MDX, fără un al doilea titlu H1.

Un fișier valid este descoperit automat de lista blogului, ruta `/blog/<slug>`, sitemap și feed-ul RSS. Nu modifica codul pentru a înregistra articolul.

## Frontmatter obligatoriu

- `slug`: identic cu numele fișierului.
- `title`: titlul editorial complet.
- `excerpt`: rezumat clar și autonom.
- `category`: una dintre `ghid`, `comparatie`, `sfat`.
- `categoryLabel`: eticheta vizibilă, de exemplu `Ghid`.
- `readMin`: număr întreg pozitiv.
- `publishedAt`: dată ISO în format `YYYY-MM-DD`.
- `answerCapsule`: răspuns direct în 2-4 propoziții, inteligibil fără restul articolului.

Câmpurile opționale sunt `updatedAt`, `seoTitle`, `seoDescription`, `faqItems` și `howToSteps`. Adaugă `updatedAt` doar când conținutul a fost modificat semnificativ și folosește tot formatul `YYYY-MM-DD`. `updatedAt` nu poate fi mai vechi decât `publishedAt`; build-ul se oprește dacă se întâmplă.

## Reguli editoriale și SEO

- Răspunde concret la intenția de căutare și evită introducerile generale.
- Un singur articol pe intenție de căutare. Înainte de un articol nou, verifică dacă subiectul nu e deja acoperit de un articol, de o pagină de serviciu (`/servicii/...`) sau de `/comparatie`. Dacă e, actualizează pagina existentă în loc să publici una nouă.
- Nu repeta `answerCapsule` ca prim paragraf și nu scrie o secțiune „Întrebări frecvente” în corp: pagina le afișează automat din frontmatter.
- Scrie natural în română, fără anglicisme de agenție: „afaceri mici” (nu SMB), „actualizări” (nu update-uri), „lansare” (nu go-live), „buton de contact” (nu CTA), „magazin” (nu shop), „finalizarea comenzii” (nu checkout), „reclame” (nu ads).
- Nu repeta în fiecare articol telefonul și e-mailul: blocul de contact de la finalul paginii este generat automat.
- Folosește subtitluri H2 (`##`) pentru secțiunile principale și H3 (`###`) doar în interiorul lor.
- Nu repeta titlul articolului în corp; pagina generează deja H1.
- Scrie linkurile interne cu rute absolute, de exemplu `[site de prezentare](/servicii/site-de-prezentare)`.
- `seoTitle` are cel mult 46 de caractere și nu conține „MAST Studio”: site-ul adaugă automat „ | MAST Studio”. `seoDescription` are între 120 și 158 de caractere.
- Linkurile interne trebuie să ducă la pagini existente: servicii (`/servicii/site-de-prezentare`, `/servicii/magazin-online`, `/servicii/aplicatii-web`, `/servicii/platforme-saas`, `/servicii/mentenanta`, `/servicii/automatizari-whatsapp`), articole, portofoliu sau paginile principale.
- Pentru expresia „web design Timișoara” leagă pagina principală (`/`), nu un articol.
- Întrebările FAQ trebuie să aibă răspunsuri complete și să fie susținute de conținutul articolului.
- Folosește `howToSteps` numai pentru procese reale, ordonate; fiecare pas are `name` și `text`.
- Tabelele trebuie scrise în sintaxă Markdown, cu antet și separatoare. Verifică lizibilitatea pe mobil.
- Imaginile se păstrează în `public/images/`, au text alternativ descriptiv și se referă printr-o cale locală: `![Descriere](/images/fisier.webp)`.

## Verificare înainte de publicare

- Frontmatter-ul este YAML valid, iar slug-ul coincide cu numele fișierului.
- Datele sunt ISO, categoria este acceptată și `readMin` este un număr întreg pozitiv.
- Articolul apare în `/blog`, se deschide la ruta lui și apare în `/sitemap.xml` și `/feed.xml`.
- Titlul din tab are cel mult 60 de caractere, iar previzualizarea la distribuire (`/blog/<slug>/og.png`) se generează corect.
- Answer capsule, corpul `.prose`, FAQ-ul și eventualele tabele se afișează corect pe desktop și mobil.
- Linkurile interne, diacriticele și metadatele SEO sunt verificate.

## URL-uri redirecționate

Aceste articole au fost comasate în pagini mai puternice. Nu le republica cu același slug:

- `/blog/agentie-vs-freelancer-vs-studio` → `/comparatie`
- `/blog/web-design-timisoara` → `/blog/cum-alegi-firma-web-design`
- `/blog/lectii-veterinaria-timisoara` → `/portofoliu/veterinaria-timisoara`
- `/blog/faq-mentenanta-site` → `/servicii/mentenanta`

Redirecționările sunt în `next.config.mjs`.

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

Câmpurile opționale sunt `updatedAt`, `seoTitle`, `seoDescription`, `faqItems` și `howToSteps`. Adaugă `updatedAt` doar când conținutul a fost modificat semnificativ și folosește tot formatul `YYYY-MM-DD`.

## Reguli editoriale și SEO

- Răspunde concret la intenția de căutare și evită introducerile generale.
- Folosește subtitluri H2 (`##`) pentru secțiunile principale și H3 (`###`) doar în interiorul lor.
- Nu repeta titlul articolului în corp; pagina generează deja H1.
- Scrie linkurile interne cu rute absolute, de exemplu `[site de prezentare](/servicii/site-de-prezentare)`.
- Folosește `seoTitle` și `seoDescription` doar când variantele implicite nu sunt suficient de clare.
- Întrebările FAQ trebuie să aibă răspunsuri complete și să fie susținute de conținutul articolului.
- Folosește `howToSteps` numai pentru procese reale, ordonate; fiecare pas are `name` și `text`.
- Tabelele trebuie scrise în sintaxă Markdown, cu antet și separatoare. Verifică lizibilitatea pe mobil.
- Imaginile se păstrează în `public/images/`, au text alternativ descriptiv și se referă printr-o cale locală: `![Descriere](/images/fisier.webp)`.

## Verificare înainte de publicare

- Frontmatter-ul este YAML valid, iar slug-ul coincide cu numele fișierului.
- Datele sunt ISO, categoria este acceptată și `readMin` este un număr întreg pozitiv.
- Articolul apare în `/blog`, se deschide la ruta lui și apare în `/sitemap.xml` și `/feed.xml`.
- Answer capsule, corpul `.prose`, FAQ-ul și eventualele tabele se afișează corect pe desktop și mobil.
- Linkurile interne, diacriticele și metadatele SEO sunt verificate.

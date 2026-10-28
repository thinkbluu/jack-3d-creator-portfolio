# MAST Studio — site and brand brief

Current as of 27 October 2026, on `main` plus the open blog dates and Cercetare work. For people who need the live site, not the history of every experiment.

MAST Studio is the web design studio of MAST Consult S.R.L. (Timișoara). The public site is [maststudio.ro](https://maststudio.ro), a Next.js app on Vercel. Romanian is the canonical language. English lives under `/en` and mirrors the structure. Blog articles are Romanian only.

## Pages and routes

Romanian paths are canonical. English is the same page with the translated segment.

| Romanian | English | What it is |
| --- | --- | --- |
| `/` | `/en` | Home. Time-of-day greeting, 3D mark, service paths, proof, FAQ |
| `/servicii` | `/en/services` | Service index |
| `/servicii/[slug]` | `/en/services/[slug]` | One page per service |
| `/preturi` | `/en/pricing` | Prices written out, plus payment rules |
| `/portofoliu` | `/en/work` | Work index |
| `/portofoliu/[slug]` | `/en/work/[slug]` | Case study |
| `/despre` | `/en/about` | Studio |
| `/echipa/[nume]` | `/en/team/[nume]` | Person page. The team list is empty, so none are linked until someone is added in `lib/team.ts` |
| `/cum-lucram` | `/en/approach` | How the work runs |
| `/blog` | `/en/blog` | Guides (“Idei”). English index is empty and points back to Romanian |
| `/blog/cercetare` | `/en/blog/research` | Research listing. Studies are a separate section of the blog |
| `/blog/[slug]` | `/en/blog/[slug]` | Article. English renders only if `content/blog/en/<slug>.mdx` exists |
| `/contact` | `/en/contact` | Contact |
| `/cerere-oferta` | `/en/request-a-quote` | Quote request |
| `/cere-oferta` | `/en/get-a-quote` | Quote flow, noindex |
| `/comparatie` | `/en/compare` | Freelancer, studio or agency |
| `/glosar` | `/en/glossary` | Web design glossary |
| `/cariere`, `/cariere/[slug]` | `/en/careers`, `/en/careers/[slug]` | Jobs |
| `/newsletter` | `/en/newsletter` | Letter sign-up |
| `/mockup` | — | Romanian campaign landing |
| `/confidentialitate` | `/en/privacy` | Privacy |
| `/cookies` | `/en/cookies` | Cookies |
| `/termeni` | `/en/terms` | Terms |
| `/multumim` | `/en/thank-you` | Lead thank-you, noindex |
| `/feed.xml` | — | RSS for the Romanian blog |
| `/sitemap.xml` | — | Both languages |

Old blog slugs in `next.config.mjs` redirect into the stronger page (comparison, a guide, a case study, or maintenance). Do not republish those slugs.

## Navigation

Header, left to right on large screens: Lucrări, Servicii, Prețuri, Studio, Idei, Contact, then the quote pill “Cere ofertă”. The full-screen menu adds Cum lucrăm, Cercetare, and Cariere. The wordmark links home. RO / EN switches the current page; a blog article with no translation switches to the other blog index. The research listing switches between `/blog/cercetare` and `/en/blog/research`.

Footer columns: services (generated from `lib/services.ts`), guides (four articles, all guides, then Cercetare), studio (about, work, approach, prices, newsletter, comparison, glossary, careers, contact, quote). Legal: privacy, cookies, terms. A WhatsApp bar sticks on small screens.

## Services and prices

Prices below are the starting prices in `lib/services.ts` and on `/preturi`. The quote is fixed. Domain, hosting and ad budgets are never inside the price.

| Service | From | Time |
| --- | --- | --- |
| Site de prezentare | 300 EUR | 48 de ore după materiale |
| Magazin online | 900 EUR | 7 zile după materiale |
| Design UX/UI | 250 EUR audit; sprint de la 1.200 EUR; design complet de la 2.500 EUR; retainer de la 600 EUR/lună | 3 zile (audit), about 2 weeks (sprint), 3–6 weeks (full) |
| Aplicații web și mobile | ofertă personalizată | estimated in the quote |
| Platforme SaaS | ofertă personalizată | estimated in the quote |
| Mentenanță și creștere | 90 EUR/lună | monthly, no long lock-in |
| Automatizări WhatsApp | 250 EUR | set in the quote, by number of flows |

Payment, outside the November offer: 50 EUR to start a presentation site or store, the rest only after the site is live and the client is happy. Apps and platforms are a fixed price paid in stages.

Until 30 November 2026 (`NO_DEPOSIT_UNTIL` in `lib/offer.ts`) the deposit is waived. The bar reads “Fără avans în noiembrie. Plătești doar dacă îți place.” Conditions: work starts when materials are complete, the site stays on a test address until payment, and the client decides within 7 days of delivery. Copy switches at render time, not at build time.

## Colour

Set on `:root` in `app/globals.css`. Do not invent a second palette.

| Token | Hex / value | Use |
| --- | --- | --- |
| `--shell` | `#faf7f2` | Page cream |
| `--shell-warm` | `#f2ece3` | Warm panels, table heads, method block |
| `--ink` | `#1a1714` | Text and filled buttons |
| `--brass` | `#a3823a` | Rules, markers, large accent. 3:1 for large text |
| `--brass-ink` | `#80672e` | Small brass text. 4.5:1 |
| `--brass-lite` | `#d4b267` | Brass on dark surfaces |
| `--harbor` | `#2e5266` | Older blue, still in the file |
| `--night` | `#0b0f16` | Dark page ground |
| `--navy` | `#0f1b2b` | Dark sections, empty covers |
| `--navy-2` | `#172a41` | Hover on filled buttons, compass plate |
| `--on-dark` | `#faf7f2` | Text on night and navy |

`--ink-2` and `--ink-3` are ink at 70% and 62%. Hairlines are ink at 10%, or cream at 12% on dark. Dark sections reassign `--ink` to cream so the same components work on both.

## Type

Loaded in `lib/fonts.ts` from Google fonts, with `latin` and `latin-ext` (diacritics).

- **Fraunces** (`--font-display`): headlines, the big page word, the wordmark. Italic for the accent word (“Studio”, and the italic line in the menu).
- **DM Sans** (`--font-sans`): body, UI, forms.
- **DM Mono** (`--font-mono`): `.mono-label`. Small, uppercase, tracked out. Kickers, meta, dates, filter counts.

Big inner pages open with `PageOpen`: a mono h1 (the searchable title) and a screen-sized word with a full stop (“Idei.”, “Prețuri.”, “Cercetare.”). Article pages use `PageHero`: dark, grain, compass watermark, display h1.

## Logo

The header mark is not an `<img>` of the wordmark. It is the compass SVG `/icons/mast-mark.svg` used as a CSS mask, 22px, brass on light and `--brass-lite` on dark, followed by the wordmark “MAST” and italic “Studio”.

Other mark files: `mast-mark-badge.svg`, `mast-mark-brass.svg`, `mast-mark-inverse.svg`. Schema and the publisher logo use `https://maststudio.ro/logo.png`. Do not put the registered-office street on marketing pages. The site names the city only. The street appears in terms, privacy and cookies.

## Voice

Romanian, with full diacritics. Short sentences. Prices and deadlines in the open. No agency English: say “afaceri mici”, “actualizări”, “lansare”, “buton de contact”, “magazin”, “finalizarea comenzii”, “reclame”. Do not imply a public office. The studio works remotely from Timișoara, for the whole country.

Lines worth keeping intact:

- “Site-ul tău, live în 48 de ore.”
- “Studio de web design · Timișoara”
- “Plătești 50 EUR ca să rezervăm locul. Restul, doar dacă îți place rezultatul.”
- “Mai puține site-uri urâte pe internet, din 2026.”
- “Ce am învățat construind site-uri, scris pentru cei care urmează să-și facă unul.”
- “Primești oferta azi.”
- Footer: “Studio de web design din Timișoara. Site-uri de prezentare de la 300 EUR, live în 48 de ore…”

The 404 keeps the same voice: “Pagina asta nu există. Sincer, nici Google n-o găsește.”

## Pieces you will reuse

There is no separate component library page. The system is the CSS in `app/globals.css` and `app/pages.css`, plus:

- `SiteHeader`, `MenuOverlay`, `Footer`, `LanguageSwitcher`
- `PageOpen`, `PageHero`, `IdeasIndex` (blog and research cards)
- `.big-row` for a full-width link, `.mono-label`, `.display-xl`, `.wordmark`, `.kicker`
- `.tone-dark`, `.tone-navy`, `.tone-cream`, `.tone-warm`
- `.prose` for article text, including Markdown tables that scroll inside the page
- `MdxContent` for MDX. Research posts can also use `<Figure>` and `<BarChart>`

Match these. Do not introduce a new typeface, a new accent colour, or a card style that ignores the hairline and the display face.

## Blog and MDX

Posts live in `content/blog/<slug>.mdx`. English, when it exists, is `content/blog/en/<slug>.mdx`. A valid file is picked up by the list, `/blog/<slug>`, the sitemap and `/feed.xml`. No registration step.

Required frontmatter: `slug` (must match the filename), `title`, `excerpt`, `category` (`ghid`, `comparatie`, `sfat`, or `studiu`), `categoryLabel`, `readMin`, `publishedAt` (`YYYY-MM-DD`), `answerCapsule`.

Optional: `updatedAt`, `seoTitle` (max 46 characters, no “MAST Studio”), `seoDescription` (120–158 characters), `faqItems`, `howToSteps`, `author`, `cover` + `coverAlt`, `section`, `draft`, and for a study `methodology`, `sources`, `dataset`.

`publishedAt` is the day the article went live on `main`. `updatedAt` is only for a real later edit of that article. The page, the RSS `pubDate`, JSON-LD `datePublished` and `article:published_time` all read `publishedAt`. Sitemap `lastmod`, JSON-LD `dateModified` and `article:modified_time` read `updatedAt`, or `publishedAt` when there is no later edit. Dates are formatted as a calendar day in Europe/Bucharest, not with `new Date("YYYY-MM-DD")`, which can slip a day west of UTC.

`section: cercetare` with `category: studiu` marks a study. It is listed on `/blog/cercetare`, badged “Cercetare”, and kept out of the guide index. The article schema is `Article`, plus `Dataset` when `dataset` is set. Guides stay `BlogPosting`.

The listing is not a separate `page.tsx` next to `blog/[slug]`. That dynamic segment matches first, and with `dynamicParams: false` a soft navigation to an unknown segment renders the root 404 inside the current page. `cercetare` (and `research` in English) is a reserved slug, included in `generateStaticParams`, and the article route renders the listing for it. Do not publish a post under either slug.

`draft: true` drops the file from the list, the sitemap, the feed and the production route. `content/blog/model-studiu-cercetare.mdx` is that kind of file: a layout sample with an empty CSV header and no measurements. Do not publish it, and do not invent figures to fill a study.

Authoring rules in full: `CONTRIBUTING.md`. The empty template is `content/TEMPLATE.mdx`.

## What changed recently

The last stretch of `main` (about 11–27 October 2026) is a brand and product refresh, not a new site. Merges onto `main`, newest first:

- **#95, #94** (25 Oct) — UX/UI service page and the time-limited no-deposit offer. Lenis scroll no longer jumps.
- **#93** (25 Oct) — Brand voice pass on the edges of the UI.
- **#92** (24 Oct) — SEO and AI discoverability: IndexNow, Bing check, authorship in schema, an agent resource manifest, WebMCP notes on the forms. Blog posts gained `author: paul` here. That is not a content rewrite.
- **#91** (24 Oct) — Performance: the hero 3D mark renders on demand, the Lenis loop idles.
- **#90** (24 Oct) — Brand content. The rotating last word of the hero became “tine” / “you” instead of “Timișoara”. Hero calls to action, project thumbnails, the pricing page, and the Design UX/UI service. The monthly free-website contest was removed.
- **#89** (22 Oct) — Lead thank-you pages and conversion tracking.
- **#88** (17 Oct) — Every contact form can go to WhatsApp or email.
- **#87** (12 Oct) — Inner pages rebuilt in the current display style, with page transitions.
- **#86, #85, #84** (11–12 Oct) — Reviews, case studies, footer. The oversized footer wordmark came out. The review ring sits on the dark section.
- **#82** (12 Oct) — “Salut” homepage: type-led, greets by time of day.
- **#74** (11 Oct) — The 2026 redesign, landed in stages.
- **#70** (5 Oct) — English under `/en` without moving Romanian URLs.
- **#67** (2 Oct) — Blog articles rewritten in one pass (shorter, tighter). That day is `updatedAt` on the guides. It is a real edit, not a clock stamped at build. `dateModified` matches across those posts because the pass landed together. Publishing dates do not.

Earlier in September the guides were added one file at a time. `publishedAt` matches the day the file first reached `main`, with four deliberate exceptions kept on purpose:

- `cat-costa-un-site-in-romania` is 14 August 2026. The article went live on 15 August in PR #20, before the MDX migration on 5 September. The August date was in the original source.
- `de-ce-sunt-lente-temele-wordpress` is 10 September. The squash landed on 11 September; the commit subject says Sep 10.
- `wordpress-vs-personalizat` is 17 September. It landed on 19 September; the commit subject says Sep 17.
- `magazin-online-vs-instagram` is 18 September. It landed on 19 September; the commit subject says Sep 18.

`cat-costa-magazin-online` was dated 7 September in the file but reached `main` on 5 September (commit `9fd8f56`), with no note explaining the later day. Its publish date is 5 September.

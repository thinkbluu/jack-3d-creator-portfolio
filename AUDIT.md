# Full Site & SEO Audit — maststudio.ro

Date: 2026-10-06 · Scope: all RO + EN routes, verified against the running site (not just source code).

## Verdict

The site is in excellent shape. Every critical SEO system works end-to-end: unique titles with smart brand-suffix truncation, correct canonicals, a complete hreflang graph (including correct handling of RO-only blog posts), a clean 77-URL sitemap with xhtml:link alternates, granular robots rules for AI crawlers, a valid JSON-LD graph on every page type, dynamic OG images that all render, working 308 redirects, full security headers, and Consent Mode v2. Accessibility and mobile checks passed on every page tested. **No critical issues were found.** The list below is real but secondary.

---

## High priority

### H1. Desktop homepage downloads ~7.6 MB of hero video upfront
- **Where:** `components/ScrubStage.tsx` (used by `CinematicHero` on `/` and `/en`)
- **Evidence:** Both clips render with `preload="auto"`. Measured resource transfer on a fresh desktop load: `hero-01-exit.mp4` 3,587 KB + `hero-02-arrival.mp4` 4,060 KB. The second clip is only needed once the visitor scrolls halfway through the intro, yet it competes for bandwidth with the LCP image on the money page. (The scene videos further down correctly transfer 0 KB until scrolled into view.)
- **Fix:** Keep `preload="auto"` on clip 1 (frame extraction needs it); give clip 2 `preload="metadata"` and switch it to `auto` after clip 1's extraction completes (or after first scroll). Saves ~4 MB on first load with no visual change.

### H2. `/en/blog` is an empty, indexed page
- **Where:** `app/en/blog/page.tsx`, `content/blog/en/` (empty directory)
- **Evidence:** The EN blog index returns 200, is in the sitemap, and renders an empty `ItemList` — 0 posts vs 20 RO posts. It is a thin-content page eligible to rank where the RO blog should rank.
- **Fix (pick one):**
  1. Translate posts into EN over time (best long-term), or
  2. Until then: `noindex` `/en/blog`, drop it from the sitemap, and remove the `en` hreflang alternate that `/blog` and every RO page emit toward it (the `alternatePublicPath` fallback routes blog URLs to the other index).

---

## Medium priority

### M1. Unmatched `/en/*` URLs show the Romanian 404
- **Where:** `app/not-found.tsx` (root) vs `app/en/not-found.tsx`
- **Evidence:** `/en/nonexistent-xyz` returns 404 with `<title>Pagina nu a fost găsită | MAST Studio</title>`. Next.js routes unmatched paths to the root not-found boundary, so the EN variant never renders.
- **Fix:** In `proxy.ts`/middleware, detect unmatched `/en/*` paths (checker header `x-nextjs-data` or a catch route) and rewrite to a locale-aware 404 — or accept it: 404s aren't indexed, so impact is UX-only for EN visitors following dead links.

### M2. 5 ESLint errors: `react-hooks/set-state-in-effect`
- **Where:** `components/CinematicHero.tsx` (×3), `components/SceneLayer.tsx` (×1), `components/SegmentContext.tsx` (×1)
- **Evidence:** `pnpm exec eslint .` → 5 errors. TypeScript is clean. These are the new React Compiler-era rules; the patterns (capability detection, URL-param sync) are common but will matter when enabling `reactCompiler`.
- **Fix:** Move the sync to event handlers / `useSyncExternalStore`, or use the effect-event pattern. Low urgency unless React Compiler is on the roadmap.

### M3. Four unused JPGs ship in `public/images` (~460 KB)
- **Evidence:** `harbor-final.jpg` (118 KB), `hero-poster.jpg` (113 KB), `scene-compass-poster.jpg` (128 KB), `scene-table-poster.jpg` (173 KB) have zero references in code — the `.webp` versions are used.
- **Fix:** Delete them (or move to a design-source folder outside `public/`).

---

## Low priority / notes

- **`/cere-oferta` (noindex funnel page) has a self-canonical** — harmless; Google ignores canonicals on noindexed pages. Cosmetic only.
- **GA4 ID fallback is hardcoded** (`G-WT5MMP4M9D` in `LocaleDocument`) — Consent Mode gates it correctly, but staging/dev traffic counts toward the GA property unless `NEXT_PUBLIC_GTAG_ID` is overridden per environment.
- **hreflang renders as `hrefLang`** in raw HTML — valid (HTML attributes are case-insensitive; Google parses it fine). Some third-party validators flag it; no action needed.
- **`/en/get-a-quote` + `/cere-oferta` funnel pair** is correctly noindex,follow in both languages and excluded from the sitemap — verified working.
- **robots.txt is functionally correct but bloated (~110 lines)** — all 11 per-bot groups are byte-identical to `User-Agent: *`, so they change nothing (a bot falls back to `*` when no group names it). Two tokens are dead: `Claude-Web` (deprecated by Anthropic) and `Google-Extended` (retired by Google). `Allow: /` is redundant — allow is the default, it only means something as an exception inside a broader `Disallow`. The trailing-slash asymmetry (`/site-gratuit/admin/` keeps its slash, `/en/free-website/admin` loses it) comes from `localizePath` dropping trailing slashes via `filter(Boolean)`. Every private route is covered in both languages either way, the sitemap contains no private URLs, and production matches local byte-for-byte. Fix: collapse to one `User-Agent: *` group + the Sitemap line; keep explicit per-bot groups only if their rules ever need to diverge.

---

## Verified working (do not "fix" these)

| Area | Status |
| --- | --- |
| Titles | Unique everywhere, 30–60 chars, brand suffix auto-dropped when it would truncate |
| Descriptions | 134–159 chars, benefit-led, on every indexable page |
| Canonicals | Correct self-canonicals on all pages incl. EN slug mirrors |
| hreflang | ro/en/x-default correct; RO-only posts emit only ro+x-default (no EN pointer to a 404); service slugs map correctly (`/servicii/aplicatii-web` ↔ `/en/services/web-and-mobile-apps`) |
| Sitemap | 77 URLs, zero duplicates, no noindex/private URLs, lastmod maintained per page |
| robots.txt | Private contest paths blocked in both languages (all 10 real routes covered), sitemap declared; see Low note for bloat/dead tokens |
| JSON-LD | Valid graph on every page type (WebPage, BreadcrumbList, Service, BlogPosting, FAQPage, ItemList, ContactPage, AboutPage, CollectionPage, WebSite, ProfessionalService); all required fields present; no self-serving reviews |
| OG/Twitter | Per-page dynamic OG images all render (200 image/png); article:published/modified present |
| Redirects | All 308s work (`/ro/*` → `/*`, merged blog posts → canonical pages) |
| Feeds/assets | feed.xml (correct content-type), manifest, favicon, apple-icon, logo.png all resolve |
| Security | CSP (GA4-scoped), HSTS preload, XFO DENY, nosniff, Referrer-Policy, Permissions-Policy |
| Privacy | Consent Mode v2 denied-by-default, banner is a labelled dialog with 44px targets |
| Access control | Contest admin pages/APIs are signed-token gated, robots-disallowed and noindex |
| Performance | FCP 752 ms, CLS 0.00, hydration 240 ms (dev-mode desktop); LCP image 57 KB with responsive variants + mobile/tablet preloads; SceneLayer defers video until in view, respects reduced-motion/saveData |
| Accessibility | Landmarks, single h1, logical heading order, alt text on all images, labelled inputs with autocomplete, visible 3px focus outlines, contrast passes, no zoom blocking, no horizontal overflow at 375 px |

## Suggested order of work
1. H1 (video preload) — biggest measurable win, small diff
2. H2 (EN blog strategy) — needs your call: translate vs noindex
3. M3 (delete unused JPGs) — trivial
4. M2 (lint errors) — mechanical cleanup
5. M1 (EN 404) — optional polish

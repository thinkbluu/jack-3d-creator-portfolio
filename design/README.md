# Street art for the "Lights on" concept

Source illustrations (Recraft, vector) and the script that prepares them for the site.

- `street-src/` – the SVGs as exported, with the C2PA metadata block removed. `backdrop-3.svg` has its white columns recoloured to brass.
- `street-preview.png` – every shop placed on one ground line in front of the backdrop, for a quick visual check.
- `street-tools/` – `render.mjs` renders each SVG to PNG at 2x with Playwright; `process.py` cuts the shops and signs out of their dark background, builds the colour-key masks and writes `public/street/manifest.json`.

## What ends up in `public/street/`

| Path | What it is |
| --- | --- |
| `<shop>/facade.webp` | The shopfront at 2x, transparent outside its silhouette; the dark body of the building stays opaque so particles cannot show through walls |
| `<shop>/mask-sign.png` | White where the empty sign board is (colour key `#F2ECE3`): draw lettering and the "lit" glow here |
| `<shop>/mask-window.png` | White where the glass is (colour key `#172A41`): put the video texture and the window glow here |
| `hero/lit.webp` | The lit MAST shop, opaque, for reduced-motion and no-WebGL fallbacks |
| `old-signs/<name>/sign.webp` | The generic signs that peel off, transparent background |
| `backdrop/backdrop-1..3.webp` | Upper-floor building tiles placed side by side behind the shops |
| `manifest.json` | Per shop: width, height, `groundY` (bottom of the building, in px), the sign board rectangle and the window rectangles, all in facade pixels |

Shops: `hero` (MAST Studio), `veterinaria-timisoara`, `agd-innerpath-consulting`, `decodex`, `oncogen`, `painea-casei`, `asesor`, `visitor` (the dark shop the visitor names), `empty-lot` ("Spațiu disponibil").

All facades come from the same 1006 × 1365 canvas, so their relative scale is already correct: scale every facade by the same factor and align their `groundY`.

## Known gaps

- The old signs are still as ornate as the shops; for the peel to read as before/after they should be regenerated as cheap, faded 1990s signs, each in the proportions of its shop's sign board.
- Backdrop tiles do not repeat seamlessly; hide the seams behind shops or with a slow parallax.

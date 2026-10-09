# jack-3d-creator-portfolio

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_g9mRcu5fldMAdJxR0EgkpK68vS4l)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more, take a look at the following resources:
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.

## Google Ads tracking (Consent Mode v2)

Conversion tracking loads **only on production deployments** (`VERCEL_ENV=production`) and only when the IDs below are set. Nothing loads in development or previews.

| Env var | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads conversion ID, e.g. `AW-XXXXXXXXX` |
| `NEXT_PUBLIC_ADS_LEAD_LABEL` | Full `send_to` for the mockup lead conversion, e.g. `AW-XXXXXXXXX/AbC123` |
| `NEXT_PUBLIC_ADS_WHATSAPP_LABEL` | Full `send_to` for WhatsApp click conversions |
| `NEXT_PUBLIC_GA4_ID` | Optional GA4 property; falls back to the existing `NEXT_PUBLIC_GTAG_ID` |

How it works:

- **Consent Mode v2** — `ad_storage`, `ad_user_data`, `ad_personalization` and `analytics_storage` default to `denied` (with `wait_for_update: 500`, `url_passthrough: true`, `ads_data_redaction: true`) before gtag.js loads. The existing cookie banner updates consent via `gtag('consent', 'update', …)` and stores the choice in `localStorage` under `mast-consent`.
- **Click IDs** — `gclid`, `gbraid`, `wbraid` and `utm_*` parameters are saved to `localStorage` under `ms_attribution` (90-day TTL) on every page. The `/mockup` form fills its hidden tracking fields from the URL first, then from this storage.
- **Lead conversion** — on `/mockup/multumim`, one `conversion` event fires per submitted lead (`value: 50, currency: RON`, `transaction_id` = submission id) with enhanced conversions (`user_data`: phone in E.164 + email when given). Fires only when `ms_lead` exists in sessionStorage, so direct visits and refreshes never count.
- **WhatsApp clicks** — one delegated listener covers every `wa.me` / `api.whatsapp.com` link sitewide and fires the Ads conversion plus a GA4 `whatsapp_click` event. `tel:` links fire a GA4 `phone_click` event.

### Testing with Google Tag Assistant

1. Install the [Google Tag Assistant](https://chromewebstore.google.com/detail/google-tag-assistant/anjfknjpenbpkckfmmfkpiodpfkjloae) Chrome extension.
2. Open the production site with Tag Assistant enabled and start a recording.
3. Submit the mockup form (or click a WhatsApp link) and check that the `conversion` event fires with the expected `send_to`, and that consent states match the banner choice.
4. To test before production, temporarily set the env vars and deploy a preview — tracking stays off on previews by design, so use a production deployment for verification.

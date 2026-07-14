# MindCan™ — Local-First Spatial Canvas (SaaS Package)

A complete, sellable, frontend-only SaaS: infinite spatial canvas app + landing page + legal pages + freemium licensing. No backend required — deploy to any static host.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Marketing landing page (hero, features, pricing, FAQ) — mobile-first |
| `app.html` | The MindCan app: canvas, cards, connections, AI synthesis, settings, licensing |
| `config.js` | **The only file you edit.** Product name, pricing, and your payment keys |
| `consent.js` | Storage-consent banner (shared by all pages) |
| `reporter.js` | Crash reporter — optional one-click, redacted error reports (shared by all pages) |
| `privacy.html` | Privacy policy (local-first, honest, no boilerplate fiction) |
| `terms.html` | Terms of use (license, refunds, disclaimers) |

---

## Quick start

1. Open `config.js` and replace the `YOUR_*` placeholders (details below).
2. Upload the folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, shared hosting — anything that serves files).
3. Done. There is no build step, no server, no database.

Everything works before you add keys — buy buttons show a helpful notice instead of dead-linking until configured.

---

## Where to drop your keys (`config.js`)

```js
STRIPE_PAYMENT_LINK: "YOUR_STRIPE_PAYMENT_LINK_HERE",
GUMROAD_PRODUCT_URL: "YOUR_GUMROAD_PRODUCT_URL_HERE",
GUMROAD_PRODUCT_ID:  "YOUR_GUMROAD_PRODUCT_ID_HERE",
SITE_UNLOCK_CODE:    "YOUR_UNLOCK_CODE_HERE",
SUPPORT_EMAIL:       "YOUR_SUPPORT_EMAIL_HERE",
```

### Gumroad setup (recommended — full license automation)

1. Create a product on Gumroad and enable **“Generate a unique license key per sale.”**
2. Put the product URL in `GUMROAD_PRODUCT_URL`.
3. Put the product ID (Gumroad product settings → advanced) in `GUMROAD_PRODUCT_ID`.
4. Buyers paste their license key into **⚙ Settings → License key** in the app. The app verifies it directly against Gumroad's public license API (`api.gumroad.com/v2/licenses/verify`, CORS-enabled — no server needed). Refunded/charged-back keys are rejected.

### Stripe setup (Payment Link + unlock code)

Stripe has no client-side license API, so this package uses a Payment Link plus an unlock code:

1. Create a **Payment Link** in Stripe for your Pro price; paste it into `STRIPE_PAYMENT_LINK`.
2. Choose a secret unlock code (e.g. `MINDCAN-PRO-8F2K`) and put it in `SITE_UNLOCK_CODE`.
3. In the Payment Link settings → **Confirmation page**, show a custom message containing the unlock code (and/or send it via Stripe's receipt email).
4. Buyers paste the code into **⚙ Settings → License key**.

> **Honest tradeoff:** with no backend, license checks run in the client. This deters casual sharing, not determined pirates — the standard tradeoff for backend-free products on Gumroad/itch/etc. If you later want per-seat enforcement, add a tiny serverless function that proxies Gumroad verification and rate-limits keys; the app's `activateLicense()` is the single place to point at it.

### Error reports (crash reporter)

If a page ever hits a genuinely unhandled error, a small card offers **“Report this issue.”** Only when the user clicks it, a redacted JSON report — error message/stack (secrets, emails, and URL params scrubbed), browser/viewport info, feature flags as booleans, and a hidden AI-executable repair prompt — is POSTed (`sendBeacon`, `fetch keepalive` fallback) to `ERROR_REPORT_ENDPOINT` in `config.js` (default: `https://bndr.labs.com/api/mindcan/report`). It never includes canvas content, API keys, or license keys. The user sees only: *“Message sent. Thank you for notifying us. We’ll address it as soon as possible.”* Dismissing sends nothing. Point the endpoint at any collector that accepts a JSON POST.

---

## Pricing (and why $19)

Default: **Free** (12 cards per canvas, all features) / **Pro $19 one-time** (unlimited cards).

Researched comparables:
- **Scapple** (freeform mind-mapping, one-time): **$21.99**
- **MindMeister** (subscription): from **$7.50/month**
- **SimpleMind** (one-time purchase model, widely praised for it)

$19 undercuts Scapple while staying a serious price; "one-time vs $7.50/mo" is the conversion angle used on the pricing page. Change `PRICE_PRO`, `PRICE_PRO_NOTE`, and `FREE_CARD_LIMIT` in `config.js` — the landing page and app both read them.

---

## Feature flags (`config.js`)

| Key | Default | Effect |
|---|---|---|
| `FREE_CARD_LIMIT` | `12` | Cards per canvas on Free. Import/undo/restore are never gated — only creating new cards |
| `AUTOSAVE` | `true` | Debounced silent autosave (1.5s) after any change |
| `ERROR_REPORT_ENDPOINT` | BNDR Labs collector URL | Where optional one-click crash reports are POSTed |
| `DEEPSEEK_MODEL` | `deepseek-v4-flash` | Model for AI Synthesis (`deepseek-chat` is deprecated 2026-07-24) |

---

## What's inside the app

- Infinite pan/zoom canvas, free-form + snap-to-grid modes with overlap resolution
- Cards with live-rendering Markdown, 5 semantic color themes + editable legend
- Fluid bezier connections (color follows source card; click again to unlink)
- **AI Synthesis (BYOK):** users add their own DeepSeek key in ⚙ Settings — stored locally, sent only to DeepSeek. You carry zero API cost. Requests `deepseek-v4-flash` by default (`DEEPSEEK_MODEL` in `config.js`; `deepseek-v4-pro` for max quality) — verified against DeepSeek’s live docs; the old `deepseek-chat` alias is **deprecated 2026-07-24** and is not used
- Exports: JSON (re-importable), TXT, copy-paste AI prompt, PDF (synthesis)
- **Import JSON** restores a full canvas across devices
- Undo (50 deep, Ctrl/Cmd+Z), Escape closes panels in priority order
- Autosave + manual save; Save & Reset correctly preserves the save (fixed a defect where it erased its own save)
- Dark/light theme, font scaling, mode — all persisted
- **Mobile-first:** touch drag, two-finger pinch-zoom, swipe-down panel dismiss, adaptive dock (shrinks → icon-only → vertical), 44px touch targets, safe-area insets, 16px inputs (no iOS zoom)
- Consent banner gates all persistence; declining keeps the app fully usable (session-only)
- **Hardened:** imported/AI content is HTML-sanitized (no script/event-handler injection), pasted content is inserted as plain text, restored canvases are structurally validated before touching live state, pointer capture is crash-proofed on mobile, toasts/modals carry ARIA roles, and a crash reporter catches anything genuinely unhandled

## Privacy model (what makes this sellable as "local-first")

- No server, no account, no cookies, no analytics. All data in browser localStorage, only after consent
- Only user-initiated external calls: DeepSeek (their key), Gumroad license verify, Stripe/Gumroad checkout, Google Fonts
- Optional, user-initiated crash reports only (redacted — see `privacy.html` and the crash-reporter section above)
- `privacy.html` and `terms.html` state exactly this — no fictional claims

---

## Troubleshooting

- **Buy buttons show a notice instead of checkout** → the keys in `config.js` are still `YOUR_*` placeholders. This is intentional (no dead links pre-configuration).
- **“License not recognized”** → wrong `GUMROAD_PRODUCT_ID`, a refunded/charged-back key, or a typo. The unlock-code path requires an exact match with `SITE_UNLOCK_CODE`.
- **AI Synthesis fails** → “Synthesis failed: …” means DeepSeek rejected the request (invalid key, no credit) — the exact API reason is shown. “Couldn’t reach DeepSeek” means a network problem.
- **Offline / blocked CDNs** → fonts fall back to system fonts and Markdown falls back to the built-in renderer; the app stays fully functional.
- **PDF export blocked (desktop)** → allow popups for your domain; on iOS the flow is Share → Print by design.
- **Nothing persists between visits** → the consent banner was declined (session-only mode, by design). A new tab/session re-prompts.
- **Setup expectations** → there is no `.env`, no build step, no database, and no migrations — the deployment surface is exactly these static files. If your host serves the folder, the product runs.

---

© BNDR LLC · MindCan™

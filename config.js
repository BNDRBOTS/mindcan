/* ============================================================
   MindCan™ — Site & Commerce Configuration
   ------------------------------------------------------------
   This is the ONLY file you need to edit before selling.
   Drop your keys/links below. Placeholders are detected
   automatically: any button whose key is not configured yet
   will tell the visitor checkout is coming soon instead of
   dead-linking.
   ============================================================ */

window.MINDCAN_CONFIG = {
	/* ---------- PRODUCT ---------- */
	PRODUCT_NAME: "MindCan™",
	COMPANY: "BNDR LLC",

	/* ---------- PRICING (display only — set actual price in Stripe/Gumroad) ---------- */
	PRICE_PRO: "$19",
	PRICE_PRO_NOTE: "one-time · yours forever",

	/* ---------- STRIPE ----------
	   Create a Payment Link in your Stripe Dashboard
	   (Products → Payment Links) and paste the full URL here.
	   Example: "https://buy.stripe.com/xxxxxxxxxxxxx" */
	STRIPE_PAYMENT_LINK: "YOUR_STRIPE_PAYMENT_LINK_HERE",

	/* ---------- GUMROAD ----------
	   1) GUMROAD_PRODUCT_URL: your product page, e.g. "https://bndr.gumroad.com/l/mindcan"
	   2) GUMROAD_PRODUCT_ID: found in Gumroad → Product → Advanced
	      (used to verify license keys entered in the app). */
	GUMROAD_PRODUCT_URL: "YOUR_GUMROAD_PRODUCT_URL_HERE",
	GUMROAD_PRODUCT_ID: "YOUR_GUMROAD_PRODUCT_ID_HERE",

	/* ---------- STRIPE BUYERS' UNLOCK CODE ----------
	   Stripe Payment Links can show a custom confirmation message
	   after purchase. Put a secret code of your choosing there AND
	   here — Stripe buyers paste it in the app to unlock Pro.
	   Leave as placeholder to disable this unlock path. */
	SITE_UNLOCK_CODE: "YOUR_SECRET_UNLOCK_CODE_HERE",

	/* ---------- SUPPORT ---------- */
	SUPPORT_EMAIL: "YOUR_SUPPORT_EMAIL_HERE",

	/* ---------- ERROR REPORTS ----------
	   Where the optional one-click crash report is sent. Reports are
	   redacted (never canvas content, API keys, or license keys) and
	   transmitted ONLY when the user explicitly clicks “Report this
	   issue.” Point this at your own BNDR Labs collector. */
	ERROR_REPORT_ENDPOINT: "https://bndr.labs.com/api/mindcan/report",

	/* ---------- APP BEHAVIOR ---------- */
	FREE_CARD_LIMIT: 12, // cards allowed on the Free plan
	AUTOSAVE: true, // silent autosave to this device

	/* ---------- AI SYNTHESIS ----------
	   Model requested from DeepSeek (verified against live docs, Jul 2026).
	   "deepseek-chat" is deprecated 2026-07-24 — do not use it.
	   Options: "deepseek-v4-flash" (fast, economical — default) or
	   "deepseek-v4-pro" (highest quality, costs more per token). */
	DEEPSEEK_MODEL: "deepseek-v4-flash",
};

/* Helper: is a config value still a placeholder? */
window.MINDCAN_CONFIG.isSet = function (key) {
	const v = window.MINDCAN_CONFIG[key];
	return typeof v === "string" && v.length > 0 && !/^YOUR_/.test(v);
};

/* ============================================================
   MindCan™ — Crash Reporter (shared by all pages)
   ------------------------------------------------------------
   If the page hits a genuinely unhandled error, a small card
   offers a ONE-CLICK “Report this issue” control. Only when the
   user clicks it, a REDACTED technical report (never canvas
   content, API keys, or license keys) is sent to the endpoint
   configured in config.js → ERROR_REPORT_ENDPOINT.
   The user sees only a confirmation message — no internal data
   or logic is exposed.
   ============================================================ */
(function () {
	"use strict";

	var APP_VERSION = "1.1.0";
	var shown = false;
	var lastError = null;

	function endpoint() {
		var cfg = window.MINDCAN_CONFIG || {};
		var url = cfg.ERROR_REPORT_ENDPOINT;
		return typeof url === "string" && /^https?:\/\//.test(url)
			? url
			: "https://bndr.labs.com/api/mindcan/report";
	}

	/* Strip anything secret-shaped or personal from error text. */
	function scrub(text) {
		if (!text) return "";
		return String(text)
			.slice(0, 4000)
			.replace(/sk-[A-Za-z0-9_-]{4,}/g, "[REDACTED_KEY]")
			.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[REDACTED_EMAIL]")
			.replace(/([?#])[^\s'")]+/g, "$1[REDACTED]")
			.replace(/[A-Fa-f0-9]{24,}/g, "[REDACTED_TOKEN]");
	}

	function flag(fn) {
		try { return !!fn(); } catch (e) { return false; }
	}

	function buildPayload() {
		var err = lastError || {};
		return {
			product: "MindCan",
			version: APP_VERSION,
			page: location.pathname.split("/").pop() || "index.html",
			when: new Date().toISOString(),
			userAgent: navigator.userAgent,
			viewport: { w: window.innerWidth, h: window.innerHeight, dpr: window.devicePixelRatio || 1 },
			online: navigator.onLine,
			flags: {
				consented: flag(function () { return localStorage.getItem("mindcan_consent") === "accepted"; }),
				pro: flag(function () { return localStorage.getItem("mindcan_license_status") === "pro"; }),
				hasApiKey: flag(function () { return !!localStorage.getItem("mindcan_deepseek_key"); }),
				theme: (function () {
					try { return document.documentElement.getAttribute("data-theme") || "default"; }
					catch (e) { return "unknown"; }
				})()
			},
			error: {
				name: scrub(err.name),
				message: scrub(err.message),
				stack: scrub(err.stack),
				source: scrub(err.source),
				line: err.line || null,
				col: err.col || null,
				type: err.type || "error"
			},
			/* Hidden AI-executable repair prompt — consumed server-side, never shown to the user. */
			ai_repair_prompt: [
				"You are a senior front-end engineer. A production copy of MindCan (a single-file, local-first spatial canvas app: vanilla JS, pointer events, consent-gated localStorage via an MCStore wrapper, DeepSeek BYOK synthesis, Gumroad/Stripe licensing, no build step) threw the uncaught error described in the `error` field of this report.",
				"Using the stack, source file, and line/column, identify the root cause and produce the smallest complete, non-regressive patch to the named page that fixes it without changing product behavior or adding dependencies.",
				"Constraints: preserve all existing features and code style, wrap risky DOM/pointer/storage calls defensively, and keep the app fully static.",
				"Return: (1) root cause, (2) exact old/new code patch, (3) regression test plan covering the affected flows."
			].join(" ")
		};
	}

	function send() {
		var url = endpoint();
		var body = JSON.stringify(buildPayload());
		try {
			if (navigator.sendBeacon) {
				var blob = new Blob([body], { type: "application/json" });
				if (navigator.sendBeacon(url, blob)) return;
			}
		} catch (e) {}
		try {
			fetch(url, {
				method: "POST",
				mode: "no-cors",
				keepalive: true,
				headers: { "Content-Type": "application/json" },
				body: body
			}).catch(function () {});
		} catch (e) {}
	}

	function buildCard() {
		var wrap = document.createElement("div");
		wrap.id = "mc-crash";
		wrap.setAttribute("role", "alertdialog");
		wrap.setAttribute("aria-label", "Unexpected error");
		wrap.innerHTML =
			'<style>' +
			'#mc-crash{position:fixed;right:16px;bottom:calc(env(safe-area-inset-bottom,0px) + 16px);z-index:99998;' +
			'max-width:340px;width:calc(100vw - 32px);}' +
			'#mc-crash .mcc-box{background:linear-gradient(180deg,rgba(255,255,255,.97),rgba(245,242,238,.94));' +
			'color:#161311;border:1px solid rgba(22,19,17,.12);border-radius:14px;padding:14px 16px;' +
			'box-shadow:0 16px 40px rgba(40,30,25,.2);font-family:"Figtree",system-ui,-apple-system,sans-serif;' +
			'font-size:13.5px;line-height:1.5;backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);}' +
			'html[data-theme="dark"] #mc-crash .mcc-box{background:linear-gradient(180deg,rgba(30,26,24,.97),rgba(20,17,15,.94));' +
			'color:#EFECE7;border-color:rgba(239,236,231,.14);}' +
			'#mc-crash strong{font-weight:800;}' +
			'#mc-crash .mcc-actions{display:flex;gap:8px;margin-top:10px;}' +
			'#mc-crash button{min-height:44px;padding:0 14px;border-radius:9px;border:none;font:inherit;' +
			'font-weight:700;cursor:pointer;flex:1 1 auto;}' +
			'#mc-crash .mcc-report{background:linear-gradient(180deg,#E26E54,#D95A40);color:#fff;' +
			'box-shadow:0 4px 12px rgba(217,90,64,.25);}' +
			'#mc-crash .mcc-dismiss{background:transparent;color:inherit;border:1px solid rgba(128,128,128,.35);}' +
			'</style>' +
			'<div class="mcc-box">' +
			'<strong>Something went wrong.</strong> MindCan hit an unexpected error. ' +
			'Your work on this canvas is unaffected — you can keep going, or send us a technical report so we can fix it.' +
			'<div class="mcc-actions">' +
			'<button type="button" class="mcc-report">Report this issue</button>' +
			'<button type="button" class="mcc-dismiss">Dismiss</button>' +
			'</div></div>';

		wrap.querySelector(".mcc-report").addEventListener("click", function () {
			send();
			wrap.querySelector(".mcc-box").innerHTML =
				"Message sent. Thank you for notifying us. We\u2019ll address it as soon as possible.";
			setTimeout(function () { wrap.remove(); }, 6000);
		});
		wrap.querySelector(".mcc-dismiss").addEventListener("click", function () {
			wrap.remove();
		});
		return wrap;
	}

	function show(errInfo) {
		if (shown) return; /* one card per session — never nag */
		shown = true;
		lastError = errInfo;
		function mount() {
			try { document.body.appendChild(buildCard()); } catch (e) {}
		}
		if (document.body) mount();
		else document.addEventListener("DOMContentLoaded", mount);
	}

	/* Uncaught exceptions (resource-load errors don't bubble to window, so
	   they never trigger this — the app already degrades gracefully offline). */
	window.addEventListener("error", function (e) {
		if (!e || (!e.error && !e.message)) return;
		show({
			name: e.error && e.error.name,
			message: e.message || (e.error && e.error.message),
			stack: e.error && e.error.stack,
			source: e.filename,
			line: e.lineno,
			col: e.colno,
			type: "error"
		});
	});

	window.addEventListener("unhandledrejection", function (e) {
		var r = e && e.reason;
		show({
			name: r && r.name,
			message: (r && (r.message || String(r))) || "Unhandled promise rejection",
			stack: r && r.stack,
			type: "unhandledrejection"
		});
	});
})();

/* ============================================================
   MindCan™ — Storage Consent Banner (shared by all pages)
   ------------------------------------------------------------
   MindCan uses NO cookies, NO analytics, and NO tracking.
   It stores your canvas, preferences, and (optionally) your
   own API key in this browser's localStorage only.
   This banner discloses that, once, per applicable e-privacy
   rules, and records acceptance locally.
   Decline = the app still works, but nothing persists between
   visits (save/load/legend/settings are disabled gracefully).
   ============================================================ */
(function () {
	"use strict";

	var KEY = "mindcan_consent";

	function consentState() {
		try {
			return localStorage.getItem(KEY);
		} catch (e) {
			return null; // storage blocked — treat as undecided, banner still shows
		}
	}

	window.mindcanHasConsent = function () {
		return consentState() === "accepted";
	};

	function setConsent(value) {
		try {
			if (value === "accepted") {
				localStorage.setItem(KEY, "accepted");
			} else {
				/* Declined: honor it by clearing anything already stored,
				   then remember the choice for this session only. */
				localStorage.clear();
				sessionStorage.setItem(KEY, "declined");
			}
		} catch (e) {
			/* storage unavailable — nothing to persist anyway */
		}
	}

	function alreadyDecided() {
		try {
			if (localStorage.getItem(KEY) === "accepted") return true;
			if (sessionStorage.getItem(KEY) === "declined") return true;
		} catch (e) {}
		return false;
	}

	function buildBanner() {
		var wrap = document.createElement("div");
		wrap.id = "mc-consent";
		wrap.setAttribute("role", "dialog");
		wrap.setAttribute("aria-label", "Storage notice");
		wrap.innerHTML =
			'<style>' +
			'#mc-consent{position:fixed;left:0;right:0;bottom:0;z-index:99999;' +
			'padding:16px;padding-bottom:calc(env(safe-area-inset-bottom,0px) + 16px);' +
			'display:flex;justify-content:center;pointer-events:none;}' +
			'#mc-consent .mc-box{pointer-events:auto;max-width:560px;width:100%;' +
			'background:linear-gradient(180deg,rgba(255,255,255,.97),rgba(245,242,238,.94));' +
			'color:#161311;border:1px solid rgba(22,19,17,.1);border-radius:16px;' +
			'box-shadow:0 16px 40px rgba(40,30,25,.18);padding:16px;' +
			'font-family:"Figtree",system-ui,-apple-system,sans-serif;font-size:14px;line-height:1.5;' +
			'backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);}' +
			'@media (prefers-color-scheme: dark){#mc-consent .mc-box{' +
			'background:linear-gradient(180deg,rgba(30,26,24,.97),rgba(20,17,15,.94));color:#EFECE7;' +
			'border-color:rgba(239,236,231,.14);}}' +
			'html[data-theme="dark"] #mc-consent .mc-box{' +
			'background:linear-gradient(180deg,rgba(30,26,24,.97),rgba(20,17,15,.94));color:#EFECE7;' +
			'border-color:rgba(239,236,231,.14);}' +
			'html[data-theme="light"] #mc-consent .mc-box{' +
			'background:linear-gradient(180deg,rgba(255,255,255,.97),rgba(245,242,238,.94));color:#161311;' +
			'border-color:rgba(22,19,17,.1);}' +
			'#mc-consent strong{font-weight:800;}' +
			'#mc-consent .mc-actions{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;}' +
			'#mc-consent button{min-height:44px;padding:0 18px;border-radius:10px;border:none;' +
			'font:inherit;font-weight:700;cursor:pointer;flex:1 1 auto;}' +
			'#mc-consent .mc-accept{background:linear-gradient(180deg,#E26E54,#D95A40);color:#fff;' +
			'box-shadow:0 4px 12px rgba(217,90,64,.25);}' +
			'#mc-consent .mc-accept:hover{filter:brightness(1.05);}' +
			'#mc-consent .mc-decline{background:transparent;color:inherit;' +
			'border:1px solid rgba(128,128,128,.35);}' +
			'#mc-consent a{color:#D95A40;font-weight:600;}' +
			'</style>' +
			'<div class="mc-box">' +
			'<strong>MindCan stores data on your device only.</strong> ' +
			'No cookies, no analytics, no tracking — your canvases, preferences, and optional API key ' +
			'live in this browser\u2019s local storage and never touch our servers (we don\u2019t have any). ' +
			'See the <a href="privacy.html">Privacy Policy</a>.' +
			'<div class="mc-actions">' +
			'<button type="button" class="mc-accept">Accept local storage</button>' +
			'<button type="button" class="mc-decline">Decline (session only)</button>' +
			'</div></div>';

		wrap.querySelector(".mc-accept").addEventListener("click", function () {
			setConsent("accepted");
			wrap.remove();
			document.dispatchEvent(new CustomEvent("mindcan-consent", { detail: "accepted" }));
		});
		wrap.querySelector(".mc-decline").addEventListener("click", function () {
			setConsent("declined");
			wrap.remove();
			document.dispatchEvent(new CustomEvent("mindcan-consent", { detail: "declined" }));
		});
		return wrap;
	}

	function init() {
		if (alreadyDecided()) return;
		document.body.appendChild(buildBanner());
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();

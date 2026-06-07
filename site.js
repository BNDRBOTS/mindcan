(() => {
  const stripeLink = "https://donate.stripe.com/28E28r1JN7cm5VW0Ag0oM04";
  const dialog = document.querySelector(".stripe-dialog");
  const toast = document.querySelector(".toast");

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2400);
  };

  const openStripeDialog = () => {
    if (dialog && typeof dialog.showModal === "function") {
      dialog.showModal();
      return;
    }
    window.open(stripeLink, "_blank", "noopener,noreferrer");
  };

  document.querySelectorAll("[data-open-stripe]").forEach((button) => {
    button.addEventListener("click", openStripeDialog);
  });

  document.querySelectorAll("[data-stripe-link]").forEach((link) => {
    link.addEventListener("click", () => {
      if (dialog && dialog.open) dialog.close();
      showToast("Opening Stripe support page.");
    });
  });

  document.querySelectorAll("[data-copy-stripe]").forEach((button) => {
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(stripeLink);
        showToast("Stripe support link copied.");
      } catch (error) {
        showToast(stripeLink);
      }
    });
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = Array.from(document.querySelectorAll(".reveal"));

  const showAll = () => revealItems.forEach((item) => item.classList.add("is-visible"));

  if (reduceMotion) {
    showAll();
    return;
  }

  const scanReveals = () => {
    const trigger = window.innerHeight * 0.88;
    revealItems.forEach((item, index) => {
      if (item.classList.contains("is-visible")) return;
      const rect = item.getBoundingClientRect();
      if (rect.top <= trigger) {
        item.style.transitionDelay = `${Math.min(index % 3, 2) * 60}ms`;
        item.classList.add("is-visible");
      }
    });
  };

  window.addEventListener("scroll", scanReveals, { passive: true });
  window.addEventListener("resize", scanReveals);
  scanReveals();
})();

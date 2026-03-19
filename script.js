document.querySelectorAll("[data-checkout-link]").forEach((link) => {
  link.setAttribute("href", window.APP_CONFIG.STRIPE_CHECKOUT_URL);
});

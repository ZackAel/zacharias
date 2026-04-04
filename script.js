const checkoutUrl = window.APP_CONFIG?.STRIPE_CHECKOUT_URL || "#";

document.querySelectorAll("[data-checkout-link]").forEach((link) => {
  link.setAttribute("href", checkoutUrl);
});

const stickyCta = document.querySelector(".sticky-cta");
const desktopMedia = window.matchMedia("(min-width: 1024px)");

if (stickyCta) {
  const setStickyVisibility = () => {
    if (desktopMedia.matches) {
      stickyCta.hidden = true;
      return;
    }

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDepth = scrollable > 0 ? window.scrollY / scrollable : 0;
    const shouldShow = scrollDepth >= 0.45;

    stickyCta.hidden = !shouldShow;
  };

  window.addEventListener("scroll", setStickyVisibility, { passive: true });
  window.addEventListener("resize", setStickyVisibility);
  setStickyVisibility();
}

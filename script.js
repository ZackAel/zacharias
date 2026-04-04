const checkoutUrl = window.APP_CONFIG?.STRIPE_CHECKOUT_URL || "#";

document.querySelectorAll("[data-checkout-link]").forEach((link) => {
  link.setAttribute("href", checkoutUrl);
});

const stickyCta = document.querySelector(".sticky-cta");
const mechanismSection = document.querySelector("#mechanism");
const desktopMedia = window.matchMedia("(min-width: 1024px)");

if (stickyCta) {
  let showFromMechanism = false;

  const setStickyVisibility = () => {
    if (desktopMedia.matches) {
      stickyCta.hidden = true;
      return;
    }

    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrollDepth = scrollable > 0 ? window.scrollY / scrollable : 0;
    const shouldShow = showFromMechanism || scrollDepth >= 0.45;

    stickyCta.hidden = !shouldShow;
  };

  if (mechanismSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && window.scrollY > entry.target.offsetTop) {
            showFromMechanism = true;
          }
        });
        setStickyVisibility();
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(mechanismSection);
  }

  window.addEventListener("scroll", setStickyVisibility, { passive: true });
  window.addEventListener("resize", setStickyVisibility);
  setStickyVisibility();
}

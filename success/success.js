// Replace PDF_DOWNLOAD_URL in /config.js with your real hosted PDF file URL.
document.querySelectorAll("[data-download-link]").forEach((link) => {
  link.setAttribute("href", window.APP_CONFIG.PDF_DOWNLOAD_URL);
  link.setAttribute("download", "10-Minute-Clarity-Reset.pdf");
});

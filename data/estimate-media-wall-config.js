/* Sonor Media Wall Estimate — static config (v0.1.0 · 2026-11-09 · B-809)
   The kind's template lives in estimate_templates (Supabase) with data/sonor-estimate-templates.js as the offline tier — NOT here.
   This file only carries per-app switches. */
(function () {
  window.__ESTIMATE_APP_CONFIG__ = {
    version: '0.1.0',
    kind: 'media-wall',
    // WeQuote product that carries ONE priced line per section ("Supply & install per estimate") — WQ-PRODUCTS-NEEDED #30.
    // Until it exists the Push to WeQuote button explains why it cannot push.
    wqSingleLineProduct: null
  };
})();

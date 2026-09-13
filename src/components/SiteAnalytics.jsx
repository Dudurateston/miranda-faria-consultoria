import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackWhatsApp } from "@/lib/siteAnalytics";
import { initGA, gaPageView } from "@/lib/ga";

/**
 * Olhos do site — invisivel: pageview a cada rota, clique de WhatsApp
 * por delegacao. So grava com consentimento (ver siteAnalytics.js).
 */
export default function SiteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics: carrega uma vez e conta a rota (sempre,
    // por decisão do titular — ver ga.js). A medição própria
    // continua regida pelo consentimento LGPD.
    initGA();
    gaPageView(location.pathname);
    trackPageView();
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href*="wa.me"]');
      if (a) {
        trackWhatsApp(
          (a.dataset && a.dataset.trackId) || a.className || "whatsapp"
        );
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
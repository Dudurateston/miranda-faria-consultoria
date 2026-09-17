import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackWhatsApp, track } from "@/lib/siteAnalytics";
import { initGA, gaPageView } from "@/lib/ga";

/**
 * Olhos do site (v2, 17/09) — coleta automática de KPIs p/ BI:
 *  - pageview por rota (+ GA4) e 404
 *  - milestones de scroll 25/50/75/100 (uma vez cada, rAF)
 *  - seções vistas (IntersectionObserver 55%)
 *  - vídeo tocado (playing, 1x por src)
 *  - cliques por DELEGAÇÃO (registro de seletores → taxonomia)
 *  - funil do formulário: focus= form_start, submit= form_submit
 *  - web vitals (LCP/CLS/INP/FCP/TTFB) 1x por página
 *  - erros JS (cap 5)
 *  - tempo engajado (ticks de 15s com aba visível)
 * Tudo consentido (LGPD) e em lote — ver siteAnalytics.js.
 */

/** Registro de seletores → (tipo, elemento). Ordem importa. */
const CLICK_MAP = [
  [".mf-nav__burger", "menu_toggle", "burger"],
  [".mf-mnav__lang", "lang_toggle", "menu"],
  [".mf-theme-toggle", "theme_toggle", "toggle"],
  ["a[href*='wa.me']", "cta_whatsapp", ""],
  ["a[href*='linkedin.com']", "outbound", "linkedin"],
  ["a[href*='calendly.com']", "cta_click", "calendly"],
  [".mf-hero__cta", "cta_click", "hero"],
  [".mf-contact__primary", "cta_click", "contact_primary"],
  [".mf-cta__btn", "cta_click", "home_final"],
  [".mf-404__cta--pri", "cta_click", "404_home"],
  [".mf-404__cta--sec", "cta_click", "404_back"],
  [".mf-nav__brand, .mf-mnav__wm ~ *", "nav_brand", ""],
  [".mf-work__chip", "filter_chip", ""],
  [".mf-work__item, .mf-workcard, a[href*='/work/']", "case_open", ""],
  [".mf-faq__q, [class*='faq'] button", "faq_open", ""],
  [".mf-egg, [data-egg]", "easter_egg", "m"],
];

function page404() {
  const p = window.location.pathname;
  return /\/(404|nao-encontrado|not-found)$/.test(p);
}

export default function SiteAnalytics() {
  const location = useLocation();
  const cleaned = useRef(false);
  const pathRef = useRef(location.pathname);

  /* rota → page_view (+ GA) + 404 */
  useEffect(() => {
    pathRef.current = location.pathname;
    initGA();
    gaPageView(location.pathname);
    trackPageView(location.pathname);
    if (page404()) track("404_view", { page: location.pathname });
    // rotas lazy: o chunk renderiza depois do mount — observa depois
    scheduleSectionsRef.current && scheduleSectionsRef.current();
  }, [location.pathname]);

  const scheduleSectionsRef = useRef(null);

  useEffect(() => {
    if (cleaned.current) return;
    cleaned.current = true;

    const onerr = (e) => track("error_js", { extra_data: { m: String(e.message || "").slice(0, 200) } });
    const onrej = (e) => track("error_js", { extra_data: { m: "unhandled:" + String(e.reason).slice(0, 160) } });

    /* milestones de scroll */
    const seen = new Set();
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? Math.min(100, Math.round(((window.scrollY + window.innerHeight) / h.scrollHeight) * 100)) : 100;
        [25, 50, 75, 100].forEach((m) => {
          if (pct >= m && !seen.has(m)) {
            seen.add(m);
            track("scroll_depth", { extra_data: { pct: m } });
          }
        });
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* seções vistas */
    const viewed = new WeakSet();
    const io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting && !viewed.has(en.target)) {
          viewed.add(en.target);
          const id = (en.target.className || "").toString().split(" ")[0] || en.target.tagName.toLowerCase();
          track("section_view", { element: id.slice(0, 60) });
        }
      });
    }, { threshold: 0.55 });
    const scheduleSections = () => {
      requestIdleSafe(() =>
        document.querySelectorAll("section, .mf-h").forEach((s) => {
          if (!viewed.has(s)) io.observe(s);
        })
      );
    };
    scheduleSectionsRef.current = scheduleSections;
    scheduleSections();

    /* vídeo tocou (playing não borbulha — usa captura) */
    const played = new Set();
    const onPlaying = (e) => {
      const v = e.target;
      if (!v || v.tagName !== "VIDEO" || played.has(v)) return;
      played.add(v);
      const src = (v.currentSrc || v.src || "").split("/").pop().slice(0, 60);
      track("video_play", { element: src });
    };
    document.addEventListener("playing", onPlaying, true);

    /* cliques por delegação */
    const onClick = (e) => {
      for (const [sel, type, fixedEl] of CLICK_MAP) {
        const el = e.target.closest && e.target.closest(sel);
        if (!el) continue;
        if (sel === "a[href*='wa.me']") {
          trackWhatsApp((el.dataset && el.dataset.trackId) || el.className || "whatsapp");
          return;
        }
        const label =
          el.textContent && el.textContent.trim ? el.textContent.trim().slice(0, 60) : "";
        track(type, { element: fixedEl || label, page: pathRef.current });
        return;
      }
    };
    document.addEventListener("click", onClick, { passive: true });

    /* menu mobile abre/fecha (estado do overlay) */
    let menuWas = false;
    const onMenu = () => {
      const mnav = document.querySelector(".mf-mnav");
      const open = mnav && mnav.getAttribute("data-open") === "true";
      if (open !== menuWas) {
        menuWas = open;
        track(open ? "menu_open" : "menu_close", {});
      }
    };
    const mo = new MutationObserver(onMenu);
    const mnav = document.querySelector(".mf-mnav");
    if (mnav) mo.observe(mnav, { attributes: true, attributeFilter: ["data-open"] });

    /* funil do formulário de contato */
    const onFormFocus = (e) => {
      const f = e.target.closest && e.target.closest(".mf-form");
      if (f && !f.dataset.kpiStarted) {
        f.dataset.kpiStarted = "1";
        track("form_start", { page: pathRef.current });
      }
    };
    document.addEventListener("focusin", onFormFocus, { passive: true });
    const onFormSubmit = (e) => {
      const f = e.target;
      if (f && f.matches && f.matches(".mf-form")) track("form_submit", { page: pathRef.current });
    };
    document.addEventListener("submit", onFormSubmit, true);

    /* dropdown desktop aberto (hover) */
    let dropTimer = null;
    const onHover = (e) => {
      const el = e.target.closest && e.target.closest(".mf-nav__drop");
      if (el && !dropTimer) {
        dropTimer = setTimeout(() => { track("dropdown_open", {}); dropTimer = null; }, 400);
      } else if (!el && dropTimer) {
        clearTimeout(dropTimer); dropTimer = null;
      }
    };
    document.addEventListener("mouseover", onHover, { passive: true });

    /* tempo engajado: 15s visível (fonte p/ tempo médio na página) */
    let engaged = 0;
    setInterval(() => {
      if (document.visibilityState === "visible") {
        engaged += 15;
        track("engaged_time", { extra_data: { s: engaged } });
      }
    }, 15000);

    /* web vitals — 1x por página, enviados após estabilizar */
    const vit = { lcp: 0, cls: 0, inp: 0, fcp: 0, ttfb: 0, lt: 0 };
    try {
      new PerformanceObserver((l) => {
        const es = l.getEntries();
        if (es.length) vit.lcp = Math.round(es[es.length - 1].startTime);
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver((l) => {
        l.getEntries().forEach((e) => { if (!e.hadRecentInput) vit.cls += e.value; });
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver((l) => {
        l.getEntries().forEach((e) => {
          if (e.duration > vit.inp) vit.inp = Math.round(e.duration);
        });
      }).observe({ type: "event", buffered: true, durationThreshold: 40 });
      new PerformanceObserver((l) => {
        l.getEntries().forEach((e) => { if (e.name === "longtask") vit.lt++; });
      }).observe({ type: "longtask", buffered: true });
      const nav = performance.getEntriesByType("navigation")[0];
      if (nav) vit.ttfb = Math.round(nav.responseStart);
      const paint = performance.getEntriesByType("paint").find((p) => p.name === "first-contentful-paint");
      if (paint) vit.fcp = Math.round(paint.startTime);
      setTimeout(() => {
        if (document.visibilityState === "visible" && (vit.lcp || vit.cls || vit.fcp))
          track("web_vitals", {
            page: pathRef.current,
            extra_data: {
              lcp: vit.lcp, cls: +vit.cls.toFixed(3), inp: vit.inp,
              fcp: vit.fcp, ttfb: vit.ttfb, lt: vit.lt,
            },
          });
      }, 9000);
    } catch { /* Safari velho: sem vitals */ }

    window.addEventListener("error", onerr, { passive: true });
    window.addEventListener("unhandledrejection", onrej, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect(); mo.disconnect();
      document.removeEventListener("playing", onPlaying, true);
      document.removeEventListener("click", onClick);
      document.removeEventListener("focusin", onFormFocus);
      document.removeEventListener("submit", onFormSubmit, true);
      document.removeEventListener("mouseover", onHover);
      window.removeEventListener("error", onerr);
      window.removeEventListener("unhandledrejection", onrej);
    };
  }, []);

  return null;
}

function requestIdleSafe(f) {
  const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 400));
  idle(f);
}

import { base44 } from "@/api/base44Client";
import { appParams } from "@/lib/app-params";


/**
 * Medição própria do site — first-party, sem terceiros. (v2, 17/09)
 *
 * CATÁLOGO DE KPIs (Eduardo: "máximo de dados p/ BI sem atrapalhar o
 * desempenho"). Taxonomia estilo HEART (Google) + AARRR adaptada a
 * um portfólio/lead-gen:
 *
 *   AQUISIÇÃO   session_start, page_view, 404_view, referrer, utm_*
 *   ENGAJAMENTO scroll_depth (25/50/75/100), engaged_time (ticks 15s
 *               visíveis), section_view, video_play, hero_drag,
 *               node_click, menu_open, menu_close, dropdown_open
 *   CONVERSÃO   cta_whatsapp, cta_click (hero/contato/rodapé),
 *               form_start, form_submit, form_error, case_open,
 *               filter_chip, faq_open, diag_complete, outbound
 *   PREFERÊNCIA theme_toggle, lang_toggle, skin escolhido
 *   TÉCNICO/SLI web_vitals (LCP/CLS/INP/FCP/TTFB/longtasks),
 *               error_js, consent, device/lang/skin por evento
 *
 * REGRAS DE DESEMPENHO (o site nunca espera por analítica):
 *  - LOTE, não por evento: fila em memória → flush a cada 8s, 20
 *    eventos, ou pagehide/hidden (sendBeacon-like, keepalive).
 *  - Um único listener de clique por delegação + registro de seletores.
 *  - IntersectionObserver p/ seções; milestones de scroll em rAF.
 *  - Web vitals via PerformanceObserver (LCP/CLS/INP), enviados 1x.
 *  - Espelho em window.dataLayer (gtag-ready): quando o ID G- entrar
 *    em ga.js, TODO este catálogo flui pro GA4 sem tocar mais nada.
 *  - Sem dados pessoais: sem IP, sem fingerprint, sem cookies de
 *    terceiros. Sessão anônima 30min. DNT = recusa. Falha silenciosa.
 */

const CONSENT_KEY = "mf_analytics_consent";
const SID_KEY = "mf_sid";
const SID_TS_KEY = "mf_sid_ts";
const UTM_KEY = "mf_utm";
const VISITS_KEY = "mf_visits";
const SESSION_MS = 30 * 60 * 1000;

const FLUSH_MS = 8000;
const FLUSH_MAX = 20;

/* ───────────────────────── fila + transporte ───────────────────────── */

const queue = [];
let flushTimer = null;

function dnt() {
  try {
    return navigator.doNotTrack === "1" || window.doNotTrack === "1";
  } catch { return false; }
}

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* privado */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* nada */ } },
};

export function getConsent() {
  if (dnt()) return "denied";
  return store.get(CONSENT_KEY);
}

export function setConsent(v) {
  store.set(CONSENT_KEY, v);
  enqueue({ event_type: "consent", extra_data: { granted: v === "granted" } });
}

export function revokeConsent() {
  store.set(CONSENT_KEY, "denied");
  store.del(SID_KEY); store.del(SID_TS_KEY);
}

/* ───────────────────────── contexto ───────────────────────── */

function detectDevice() {
  try {
    const w = window.innerWidth;
    const coarse = window.matchMedia("(pointer:coarse)").matches;
    if (w < 700 && coarse) return "mobile";
    if (w < 1100 && coarse) return "tablet";
    return "desktop";
  } catch { return "unknown"; }
}

function detectLang() {
  try { return document.documentElement.lang === "en" ? "en" : "pt"; }
  catch { return "pt"; }
}

function skin() {
  try { return document.documentElement.getAttribute("data-skin") || "light"; }
  catch { return "light"; }
}

function vwBucket() {
  const w = window.innerWidth || 0;
  if (w < 400) return "<400";
  if (w < 700) return "400-699";
  if (w < 1100) return "700-1099";
  return ">=1100";
}

function conn() {
  try { return navigator.connection?.effectiveType || ""; } catch { return ""; }
}

function dpr() {
  try { return Math.min(2, Math.round((window.devicePixelRatio || 1) * 10) / 10); }
  catch { return 1; }
}

function reducedMotion() {
  try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  catch { return false; }
}

/** Sessão anônima: id local, nova a cada 30min de inatividade. */
function session() {
  let sid = store.get(SID_KEY);
  let ts = Number(store.get(SID_TS_KEY) || 0);
  const now = Date.now();
  let isNew = false;
  if (!sid || now - ts > SESSION_MS) {
    sid = "s" + now.toString(36) + Math.random().toString(36).slice(2, 8);
    isNew = true;
    store.set(SID_KEY, sid);
    if (isNew) {
      try {
        const visits = (Number(store.get(VISITS_KEY)) || 0) + 1;
        store.set(VISITS_KEY, String(visits));
      } catch { /* nada */ }
    }
  }
  store.set(SID_TS_KEY, String(now));
  return { sid, isNew };
}

function utms() {
  try {
    let utm = sessionStorage.getItem(UTM_KEY);
    if (utm) return JSON.parse(utm);
    const p = new URLSearchParams(window.location.search);
    const captured = {
      utm_source: p.get("utm_source") || "",
      utm_medium: p.get("utm_medium") || "",
      utm_campaign: p.get("utm_campaign") || "",
      utm_term: p.get("utm_term") || "",
      utm_content: p.get("utm_content") || "",
    };
    sessionStorage.setItem(UTM_KEY, JSON.stringify(captured));
    return captured;
  } catch {
    return { utm_source: "", utm_medium: "", utm_campaign: "", utm_term: "", utm_content: "" };
  }
}

/* ───────────────────────── evento base ───────────────────────── */

function normalizeExtra(extra) {
  if (!extra) return "";
  if (typeof extra === "string") return extra.slice(0, 900);
  try { return JSON.stringify(extra).slice(0, 900); } catch { return ""; }
}

/** Espelho gtag/dataLayer: tudo o que sai vai também pro GA4 quando
 *  houver ID configurado em ga.js (sem ID, é um no-op barato). */
function gaMirror(type, fields) {
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", type, {
        content_group: (type === "session_start" || type === "page_view") ? routeTags(fields.page)[0] : undefined,
        page_path: fields.page,
        session_id: fields.session_id,
        lang: fields.lang,
        device: fields.device,
        element: fields.element || undefined,
        ...JSON.parse(fields.extra_data || "{}"),
      });
    }
  } catch { /* nunca quebra por GA */ }
}

function buildRec(event_type, opts) {
  const { sid } = session();
  const u = utms();
  const rec = {
    event_type,
    page: opts.page || window.location.pathname,
    element: (opts.element || "").slice(0, 120),
    session_id: sid,
    lang: detectLang(),
    device: detectDevice(),
    referrer: "",
    ...u,
    extra_data: normalizeExtra(opts.extra_data),
  };
  return rec;
}

function enqueue(opts) {
  const rec = buildRec(opts.event_type, opts);
  if (rec.event_type === "session_start" || rec.event_type === "page_view") mergeTags(rec);
  // contexto técnico vai no extra_data (sem migrar a entidade SiteEvent)
  const ctx = {};
  const sk = skin(); if (sk) ctx.skin = sk;
  const vw = vwBucket(); if (vw) ctx.vw = vw;
  const cn = conn(); if (cn) ctx.conn = cn;
  const dp = dpr(); if (dp && dp !== 1) ctx.dpr = dp;
  if (reducedMotion()) ctx.rm = 1;
  const visits = Number(store.get(VISITS_KEY) || 0);
  if (visits > 0) ctx.n_visit = visits;
  if (Object.keys(ctx).length) {
    try {
      const prev = rec.extra_data ? JSON.parse(rec.extra_data) : {};
      rec.extra_data = JSON.stringify({ ...prev, ...ctx }).slice(0, 900);
    } catch { /* mantém como estava */ }
  }
  gaMirror(rec.event_type, rec);
  queue.push(rec);
  if (queue.length >= FLUSH_MAX) flush();
  else if (!flushTimer) flushTimer = setTimeout(flush, FLUSH_MS);
}

/** API pública de KPI — usada por componentes e pela delegação. */
export function track(event_type, opts = {}) {
  try {
    if (event_type !== "consent" && getConsent() !== "granted") return;
    if (event_type === "session_start") return; // interno, ver flush
    enqueue({ event_type, ...opts });
  } catch { /* analítica nunca quebra a navegação */ }
}

let sessionStarted = false;

async function flush() {
  try {
    if (flushTimer) { clearTimeout(flushTimer); flushTimer = null; }
    if (!queue.length) return;
    // a decisão de consentimento SEMPRE sai (prova LGPD, sem
    // identificação); eventos de navegação só saem com granted
    const consentEvts = queue.filter((r) => r.event_type === "consent");
    if (getConsent() !== "granted") {
      queue.length = 0;
      if (!consentEvts.length) return;
      consentEvts.forEach((r) => base44.entities.SiteEvent.create(r).catch(() => {}));
      return;
    }

    const batch = queue.splice(0, queue.length);
    const first = batch[0];
    const { isNew } = session();
    const out = [];
    if (isNew && !sessionStarted) {
      sessionStarted = true;
      out.push({ ...first, event_type: "session_start", referrer: document.referrer || "", element: "" });
    } else if (!isNew) {
      sessionStarted = true;
    }
    out.push(...batch);

    // envio: um POST por registro, mas TODOS em paralelo dentro de um
    // idle callback — fora do caminho crítico do usuário. (Bulk por
    // array não é garantido no endpoint; dados perdidos são piores
    // que N mini-POSTs a cada 8s.)
    const send = () =>
      Promise.allSettled(out.map((r) => base44.entities.SiteEvent.create(r).catch(() => {})));
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 300));
    idle(() => { send(); });
  } catch { /* silencioso */ }
}

/* pagehide/hidden: envio keepalive sobrevive a navegacao/reload —
   o axios do SDK morre junto com a pagina, o fetch keepalive nao. */
if (typeof window !== "undefined") {
  const flushBeacon = () => {
    try {
      if (!queue.length) return;
      if (getConsent() !== "granted") {
        queue.length = 0;
        return;
      }
      const { isNew } = session();
      const batch = queue.splice(0, queue.length);
      const first = batch[0];
      const out = [];
      if (isNew && !sessionStarted) {
        sessionStarted = true;
        out.push({ ...first, event_type: "session_start", referrer: document.referrer || "", element: "" });
      } else if (!isNew) sessionStarted = true;
      out.push(...batch);
      const url = `/api/apps/${appParams.appId}/entities/SiteEvent`;
      out.forEach((r) => {
        try {
          fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(r),
            keepalive: true,
          }).catch(() => {});
        } catch { /* nada */ }
      });
    } catch { /* silencioso */ }
  };
  window.addEventListener("pagehide", flushBeacon, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushBeacon();
  }, { passive: true });
}

/* ─────────── palavras-chave/tags por rota (fatiamento no BI) ─────────── */

const ROUTE_TAGS = {
  "/pt": ["home", "consultoria", "design-engineer", "tecnologia", "mg"],
  "/en": ["home", "consulting", "design-engineer", "technology", "brazil"],
  servicos: ["servicos", "solucoes", "sistemas", "gestao", "automacao"],
  gestao: ["gestao", "sistemas", "erp", "processos"],
  desenvolvimento: ["desenvolvimento", "web", "software", "aplicativos"],
  design: ["design", "branding", "identidade", "ui"],
  automacao: ["automacao", "ia", "inteligencia-artificial", "whatsapp"],
  work: ["portfolio", "cases", "projetos"],
  about: ["sobre", "eduardo-miranda", "piumhi", "belo-horizonte"],
  "how-i-work": ["processo", "diagnostico", "metodo"],
  insights: ["insights", "diagnostico", "calculadora", "faq"],
  contact: ["contato", "whatsapp", "orcamento", "briefing"],
};

function routeTags(page) {
  const p = (page || window.location.pathname || "/").toLowerCase();
  const parts = p.split("/").filter(Boolean);
  const seg = parts[1] || p.replace(/^\/(pt|en)?\/?$/, "") || "home";
  const t = ROUTE_TAGS[parts[0] && parts[1] === undefined ? "/pt" : seg] || ROUTE_TAGS[seg] ||
    (parts.length ? parts.map((x) => x.replace(/[^a-z0-9-]/g, "")).filter(Boolean).slice(0, 3) : ROUTE_TAGS["/pt"]);
  return t.slice(0, 6);
}

function mergeTags(rec, extra) {
  try {
    const prev = rec.extra_data ? JSON.parse(rec.extra_data) : {};
    const tags = routeTags(rec.page);
    if (tags.length) prev.tags = tags;
    if (extra) Object.assign(prev, extra);
    rec.extra_data = JSON.stringify(prev).slice(0, 900);
  } catch { /* mantém */ }
}

/* ───────────────────────── helpers de domínio ───────────────────────── */

export function trackPageView(page) {
  track("page_view", { page });
}

export function trackWhatsApp(element) {
  track("cta_whatsapp", { element: element || "" });
}

export function trackDiagnosis(extra) {
  track("diag_complete", { extra_data: extra || "" });
}

export default {
  track,
  trackPageView,
  trackWhatsApp,
  trackDiagnosis,
  setConsent,
  revokeConsent,
  getConsent,
};

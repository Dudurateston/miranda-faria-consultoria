import { base44 } from "@/api/base44Client";

/**
 * Medição própria do site — first-party, sem terceiros.
 *
 * Regras:
 *  - Nada é gravado antes do consentimento (banner LGPD), exceto a
 *    própria decisão de consentir/recusar — que é a prova de
 *    conformidade e não carrega identificação.
 *  - Nenhum dado pessoal: sem IP, sem cookie de terceiros, sem
 *    fingerprint. Sessão anônima em localStorage, renovada a cada
 *    30 min de inatividade.
 *  - "Do Not Track" do navegador é respeitado como recusa.
 *  - Falhas de rede nunca derrubam o site (try/catch silencioso).
 */

const CONSENT_KEY = "mf_analytics_consent";
const SID_KEY = "mf_sid";
const SID_TS_KEY = "mf_sid_ts";
const UTM_KEY = "mf_utm";
const SESSION_MS = 30 * 60 * 1000; // 30 min de inatividade = nova sessao

const store = {
  get(k) {
    try { return localStorage.getItem(k); } catch { return null; }
  },
  set(k, v) {
    try { localStorage.setItem(k, v); } catch { /* modo privado */ }
  },
};

function dnt() {
  try {
    return navigator.doNotTrack === "1" || window.doNotTrack === "1";
  } catch { return false; }
}

export function getConsent() {
  if (dnt()) return "denied";
  return store.get(CONSENT_KEY); // "granted" | "denied" | null (ainda nao decidiu)
}

export function setConsent(v) {
  store.set(CONSENT_KEY, v);
  // a decisao em si e registrada sempre (prova LGPD, sem identificacao)
  track("consent", { extra_data: JSON.stringify({ granted: v === "granted" }) });
}

export function revokeConsent() {
  store.set(CONSENT_KEY, "denied");
  try {
    localStorage.removeItem(SID_KEY);
    localStorage.removeItem(SID_TS_KEY);
  } catch { /* nada */ }
}

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
  try {
    return document.documentElement.lang === "en" ? "en" : "pt";
  } catch { return "pt"; }
}

/** Sessao anonima: id aleatorio guardado localmente, expira em 30min. */
function session() {
  let sid = store.get(SID_KEY);
  let ts = Number(store.get(SID_TS_KEY) || 0);
  const now = Date.now();
  let isNew = false;
  if (!sid || now - ts > SESSION_MS) {
    sid = "s" + now.toString(36) + Math.random().toString(36).slice(2, 8);
    isNew = true;
    store.set(SID_KEY, sid);
  }
  store.set(SID_TS_KEY, String(now));
  return { sid, isNew };
}

/** UTMs da entrada: guardados por aba e anexados aos eventos. */
function utms() {
  try {
    let utm = sessionStorage.getItem(UTM_KEY);
    if (utm) return JSON.parse(utm);
    const p = new URLSearchParams(window.location.search);
    const captured = {
      utm_source: p.get("utm_source") || "",
      utm_medium: p.get("utm_medium") || "",
      utm_campaign: p.get("utm_campaign") || "",
    };
    sessionStorage.setItem(UTM_KEY, JSON.stringify(captured));
    return captured;
  } catch { return { utm_source: "", utm_medium: "", utm_campaign: "" }; }
}

export async function track(event_type, opts = {}) {
  try {
    if (event_type !== "consent" && getConsent() !== "granted") return;
    const { sid, isNew } = session();
    const u = utms();
    const rec = {
      event_type,
      page: opts.page || window.location.pathname,
      element: opts.element || "",
      session_id: sid,
      lang: detectLang(),
      device: detectDevice(),
      referrer: isNew ? document.referrer || "" : "",
      ...u,
      extra_data: opts.extra_data || "",
    };
    // primeira acao da sessao gera o marcador de entrada
    if (isNew && event_type !== "consent") {
      base44.entities.SiteEvent.create({ ...rec, event_type: "session_start" })
        .catch(() => {});
    }
    await base44.entities.SiteEvent.create(rec);
  } catch { /* analitica nunca quebra a navegacao */ }
}

export function trackPageView() {
  track("page_view");
}

export function trackWhatsApp(element) {
  track("cta_whatsapp", { element: element || "" });
}

export function trackDiagnosis(extra) {
  track("diag_complete", { extra_data: extra || "" });
}

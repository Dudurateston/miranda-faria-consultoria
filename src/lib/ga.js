/**
 * Google Analytics 4 — medição de visitas e comportamento do portfólio.
 *
 * COMO ATIVAR: crie a propriedade em analytics.google.com (Admin →
 * Criar propriedade → Fluxo de dados "Web") e cole o ID de medição
 * "G-…" no GA_MEASUREMENT_ID abaixo. Nada mais precisa mudar: com o
 * ID no lugar, o script carrega para todo visitante (decisão do
 * titular: "sempre carregar") e envia um page_view a cada rota da SPA.
 *
 * Enquanto o ID estiver vazio, nenhuma chamada sai do navegador.
 */

export const GA_MEASUREMENT_ID = ""; // cole aqui o ID "G-…" da propriedade

const ID_RE = /^G-[A-Z0-9]{6,}$/;
let loaded = false;

function configured() {
  return ID_RE.test(GA_MEASUREMENT_ID);
}

/** Injeta o gtag.js uma única vez, em qualquer página. */
export function initGA() {
  if (!configured() || loaded) return;
  loaded = true;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  window.gtag("js", new Date());
  // send_page_view: false — o page_view é disparado manualmente pelo
  // roteador a cada troca de rota; o automático contaria a entrada 2x.
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

/** Pageview da rota atual — chamado a cada navegação interna. */
export function gaPageView(path) {
  if (!configured() || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path || window.location.pathname,
  });
}
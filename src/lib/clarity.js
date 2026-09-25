/**
 * Microsoft Clarity — mapas de calor e gravações de sessão (grátis).
 *
 * COMO ATIVAR: crie a conta em clarity.microsoft.com (login com conta
 * Microsoft/Google), adicione o site mirandafaria.com.br e cole o
 * "Project ID" (hexadecimal) no CLARITY_ID abaixo. Enquanto vazio,
 * nenhuma chamada sai do navegador — mesmo contrato do ga.js.
 *
 * LGPD: o script só carrega com consentimento concedido (mesmo gatilho
 * do GA4, em SiteAnalytics.jsx); sem consentimento, zero coleta.
 */

export const CLARITY_ID = ""; // cole aqui o Project ID do Clarity

const ID_RE = /^[a-z0-9]{10,20}$/i;
let loaded = false;

function configured() {
  return ID_RE.test(CLARITY_ID);
}

/** Injeta o tag do Clarity uma única vez, com consentimento concedido. */
export function initClarity() {
  if (!configured() || loaded) return;
  loaded = true;
  window.clarity =
    window.clarity ||
    function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
  const s = document.createElement("script");
  s.async = 1;
  s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  document.head.appendChild(s);
}

import { useEffect } from "react";
import { useLang } from "@/lib/i18n";
import { copy } from "@/content/copy";

/**
 * Define o <title> da pagina corrente e, junto, os metadados que
 * compartilhamento e buscadores leem: description, canonical e as
 * tags Open Graph. O `pageKey` indexa meta.pages no copy; Home usa o
 * texto institucional inteiro.
 *
 * O titulo mora nas paginas, e nao no SiteLayout, por causa da ordem de
 * efeitos do React: o efeito do filho roda antes do efeito do pai, entao
 * um title escrito pela pagina seria sobrescrito pelo layout logo em
 * seguida. Cada pagina de conteudo chama este hook.
 */
function upsert(selector, attrs, content) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(attrs.tag);
    if (attrs.rel) el.setAttribute("rel", attrs.rel);
    if (attrs.property) el.setAttribute("property", attrs.property);
    if (attrs.name) el.setAttribute("name", attrs.name);
    document.head.appendChild(el);
  }
  if (content) el.setAttribute("content", content);
  if (attrs.href) el.setAttribute("href", attrs.href);
}

/* Palavras-chave por pagina (Eduardo 17/09: "coloque palavras chaves,
   tags"). Base institucional + tags da rota — leves, sem stuffing. */
const BASE_KEYWORDS = {
  en: [
    "design engineer", "creative technologist", "web consultancy",
    "web design brazil", "systems development", "automation", "AI workflow",
  ],
  pt: [
    "design engineer", "consultoria de tecnologia", "desenvolvimento web",
    "sistemas de gestão", "automação", "design e identidade visual",
    "inteligência artificial", "Minas Gerais",
  ],
};
const PAGE_KEYWORDS = {
  home: null,
  servicos: ["soluções digitais", "sistemas para empresas"],
  gestao: ["ERP sob medida", "gestão de processos"],
  desenvolvimento: ["aplicativos", "software sob medida", "sites profissionais"],
  design: ["identidade visual", "branding", "UI design"],
  automacao: ["automação de processos", "automação WhatsApp", "IA nas empresas"],
  work: ["portfólio de projetos", "cases de tecnologia"],
  about: ["quem faz", "Eduardo Miranda"],
  "how-i-work": ["método de diagnóstico", "como trabalhar comigo"],
  insights: ["diagnóstico gratuito", "calculadora de economia", "FAQ"],
  contact: ["contato", "orçamento", "WhatsApp"],
};
const PAGE_KEYWORDS_EN = {
  servicos: ["digital solutions", "business systems"],
  gestao: ["custom ERP", "process management"],
  desenvolvimento: ["custom software", "professional websites"],
  design: ["visual identity", "branding", "UI design"],
  automacao: ["process automation", "WhatsApp automation", "AI for business"],
  work: ["project portfolio", "tech case studies"],
  about: ["who runs it", "Eduardo Miranda"],
  "how-i-work": ["diagnostic method", "how to work with me"],
  insights: ["free diagnosis", "savings calculator", "FAQ"],
  contact: ["contact", "quote", "WhatsApp"],
};

export function usePageTitle(pageTitle, pageKey) {
  const { lang } = useLang();

  useEffect(() => {
    const m = copy[lang].meta;
    document.title = pageTitle ? `${pageTitle} — ${copy[lang].home.wordmark}` : m.title;

    const desc = (pageKey && m.pages[pageKey]) || m.description;
    const url = `${window.location.origin}${window.location.pathname}`;
    const base = BASE_KEYWORDS[lang] || BASE_KEYWORDS.pt;
    const map = lang === "en" ? PAGE_KEYWORDS_EN : PAGE_KEYWORDS;
    const kw = [...base, ...(map[pageKey] || [])].slice(0, 12).join(", ");

    upsert('meta[name="description"]', { tag: "meta", name: "description" }, desc);
    upsert('meta[name="keywords"]', { tag: "meta", name: "keywords" }, kw);
    upsert('meta[property="og:title"]', { tag: "meta", property: "og:title" }, document.title);
    upsert('meta[property="og:description"]', { tag: "meta", property: "og:description" }, desc);
    upsert('meta[property="og:url"]', { tag: "meta", property: "og:url" }, url);
    upsert('link[rel="canonical"]', { tag: "link", rel: "canonical", href: url }, null);

    /* Twitter card — espelho do OG, tags proprias */
    upsert('meta[name="twitter:card"]', { tag: "meta", name: "twitter:card" }, "summary_large_image");
    upsert('meta[name="twitter:title"]', { tag: "meta", name: "twitter:title" }, document.title);
    upsert('meta[name="twitter:description"]', { tag: "meta", name: "twitter:description" }, desc);

    /* hreflang: PT/EN da mesma rota + x-default */
    const path = window.location.pathname.replace(/^\/(pt|en)(?=\/|$)/, "");
    const other = lang === "pt" ? "en" : "pt";
    upsert('link[rel="alternate"][hreflang="pt"]', { tag: "link", rel: "alternate", hreflang: "pt", href: `${window.location.origin}/pt${path}` }, null);
    upsert('link[rel="alternate"][hreflang="en"]', { tag: "link", rel: "alternate", hreflang: "en", href: `${window.location.origin}/en${path}` }, null);
    upsert('link[rel="alternate"][hreflang="x-default"]', { tag: "link", rel: "alternate", hreflang: "x-default", href: `${window.location.origin}/pt${path}` }, null);
  }, [lang, pageTitle, pageKey]);
}

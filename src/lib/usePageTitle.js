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

export function usePageTitle(pageTitle, pageKey) {
  const { lang } = useLang();

  useEffect(() => {
    const m = copy[lang].meta;
    document.title = pageTitle ? `${pageTitle} — ${copy[lang].home.wordmark}` : m.title;

    const desc = (pageKey && m.pages[pageKey]) || m.description;
    const url = `${window.location.origin}${window.location.pathname}`;

    upsert('meta[name="description"]', { tag: "meta", name: "description" }, desc);
    upsert('meta[property="og:title"]', { tag: "meta", property: "og:title" }, document.title);
    upsert('meta[property="og:description"]', { tag: "meta", property: "og:description" }, desc);
    upsert('meta[property="og:url"]', { tag: "meta", property: "og:url" }, url);
    upsert('link[rel="canonical"]', { tag: "link", rel: "canonical", href: url }, null);
  }, [lang, pageTitle, pageKey]);
}

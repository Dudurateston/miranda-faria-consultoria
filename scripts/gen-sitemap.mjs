/**
 * Gera public/sitemap.xml a partir das rotas reais.
 *
 * Roda no `npm run build`, de proposito: sitemap escrito a mao
 * desatualiza no primeiro case novo, e um sitemap errado e pior que
 * nenhum — manda o buscador para 404.
 */
import { writeFileSync } from "node:fs";
import { CASE_SLUGS, PRACTICE_SLUGS } from "../src/content/copy.js";
import { MONO_LANG_PAGES } from "../src/content/produtos.js";

// TODO(dominio): trocar quando o dominio proprio for registrado.
const ORIGIN = process.env.SITE_URL || "https://mirandafaria.com.br";
const LANGS = ["en", "pt"];
/* 15/10 (site-seo): servicos e insights existem nas rotas e faltavam aqui. */
const PAGES = ["", ...PRACTICE_SLUGS, "servicos", "insights", "work", "how-i-work", "about", "contact"];

const paths = [];
for (const lang of LANGS) {
  for (const page of PAGES) paths.push(`/${lang}${page ? `/${page}` : ""}`);
  for (const slug of CASE_SLUGS) paths.push(`/${lang}/work/${slug}`);
}
/* Paginas de um idioma so: entram uma vez, sem par no outro idioma. */
const monoPaths = Object.entries(MONO_LANG_PAGES).map(([slug, lang]) => `/${lang}/${slug}`);

const today = new Date().toISOString().slice(0, 10);

/** Cada URL declara seus equivalentes de idioma, como manda o hreflang. */
const entry = (p) => {
  const alt = LANGS.map(
    (l) =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="${ORIGIN}${p.replace(/^\/(en|pt)/, `/${l}`)}"/>`
  ).join("\n");
  const xdefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${p.replace(/^\/(en|pt)/, "/pt")}"/>`;
  return `  <url>
    <loc>${ORIGIN}${p}</loc>
    <lastmod>${today}</lastmod>
${alt}
${xdefault}
  </url>`;
};

const monoEntry = (p) => `  <url>
    <loc>${ORIGIN}${p}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="${p.split("/")[1]}" href="${ORIGIN}${p}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${p}"/>
  </url>`;

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...paths.map(entry), ...monoPaths.map(monoEntry)].join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml — ${paths.length + monoPaths.length} URLs`);

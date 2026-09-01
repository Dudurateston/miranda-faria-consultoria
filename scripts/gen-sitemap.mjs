/**
 * Gera public/sitemap.xml E public/robots.txt a partir das rotas reais.
 *
 * Roda no `npm run build`, de proposito: sitemap escrito a mao
 * desatualiza no primeiro case novo, e um sitemap errado e pior que
 * nenhum — manda o buscador para 404.
 *
 * O robots.txt vem junto porque os dois precisam concordar sobre UM
 * endereco. Escritos a mao, separados, eles divergem: o robots apontava
 * para um sitemap em mirandafaria.com.br, dominio que ainda nao esta
 * registrado. Publicado em qualquer outro endereco — uma URL de
 * previa, por exemplo — isso manda o buscador para um sitemap que nao
 * existe, o que e pior do que nao anunciar sitemap nenhum.
 *
 * Regra: sem SITE_URL definido, o robots sai SEM a linha `Sitemap:`.
 * Ele so anuncia um endereco quando alguem afirmou qual e.
 *
 *   npm run build                          # sem anunciar sitemap
 *   SITE_URL=https://exemplo.com npm run build
 */
import { writeFileSync } from "node:fs";
import { CASE_SLUGS, PRACTICE_SLUGS } from "../src/content/copy.js";

// Sem SITE_URL nao ha endereco confirmado. O sitemap ainda e gerado com
// o dominio pretendido — ele precisa de alguma origem para existir —,
// mas o robots nao o anuncia. Assim nada aponta o buscador para um
// lugar que talvez nao responda.
const SITE_URL = process.env.SITE_URL;
const ORIGIN = SITE_URL || "https://mirandafaria.com.br";
const LANGS = ["en", "pt"];
const PAGES = ["", ...PRACTICE_SLUGS, "work", "how-i-work", "about", "contact", "x-ray"];

const paths = [];
for (const lang of LANGS) {
  for (const page of PAGES) paths.push(`/${lang}${page ? `/${page}` : ""}`);
  for (const slug of CASE_SLUGS) paths.push(`/${lang}/work/${slug}`);
}

const today = new Date().toISOString().slice(0, 10);

/** Cada URL declara seus equivalentes de idioma, como manda o hreflang. */
const entry = (p) => {
  const alt = LANGS.map(
    (l) =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="${ORIGIN}${p.replace(/^\/(en|pt)/, `/${l}`)}"/>`
  ).join("\n");
  const xdefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${p.replace(/^\/(en|pt)/, "/en")}"/>`;
  return `  <url>
    <loc>${ORIGIN}${p}</loc>
    <lastmod>${today}</lastmod>
${alt}
${xdefault}
  </url>`;
};

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${paths.map(entry).join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml — ${paths.length} URLs (origem: ${ORIGIN})`);

/* ---------------- robots.txt ---------------- */

const robots = `User-agent: *
Allow: /

# Rotas de infraestrutura do Base44 nao tem valor de busca
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /oauth/
Disallow: /connect

# Comparacao temporaria de intensidade do terreno — nao e conteudo
Disallow: /lab/
${SITE_URL ? `\nSitemap: ${SITE_URL}/sitemap.xml\n` : ""}`;

writeFileSync("public/robots.txt", robots);
console.log(
  SITE_URL
    ? `robots.txt — anunciando o sitemap em ${SITE_URL}`
    : "robots.txt — sem anunciar sitemap (defina SITE_URL para anunciar)"
);

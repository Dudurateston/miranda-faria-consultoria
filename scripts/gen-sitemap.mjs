/**
 * Gera public/sitemap.xml a partir das rotas reais.
 *
 * Roda no `npm run build`, de proposito: sitemap escrito a mao
 * desatualiza no primeiro case novo, e um sitemap errado e pior que
 * nenhum — manda o buscador para 404.
 */
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
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

/* 20/10 (site-seo): lastmod = data do ultimo commit que mexeu em conteudo,
   nao a data do build. lastmod que muda todo dia sem a pagina mudar faz o
   Google passar a ignorar o campo. Sem git no ambiente de build, cai para
   a data de hoje (comportamento anterior). */
let today = new Date().toISOString().slice(0, 10);
try {
  const d = execSync(
    "git log -1 --format=%cs -- src public/guias public/guides public/fatos public/facts",
    { stdio: ["ignore", "pipe", "ignore"] }
  )
    .toString()
    .trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) today = d;
} catch {
  /* mantem hoje */
}

/* 20/10 (site-seo/GEO): paginas estaticas em public/ — HTML completo, FAQ e
   JSON-LD no HTML bruto, legiveis por robos que nao rodam JavaScript. */
const STATIC_PAIRS = [{ pt: "/fatos/", en: "/facts/" }];
const STATIC_MONO = [
  { path: "/guias/afd-absenteismo.html", lang: "pt" },
  { path: "/guides/ireland-attendance-rules.html", lang: "en" },
];

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

const staticPairEntries = ({ pt, en }) =>
  [pt, en].map(
    (p) => `  <url>
    <loc>${ORIGIN}${p}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="pt" href="${ORIGIN}${pt}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}${en}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${pt}"/>
  </url>`
  );

const staticMonoEntry = ({ path, lang }) => `  <url>
    <loc>${ORIGIN}${path}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="${lang}" href="${ORIGIN}${path}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${path}"/>
  </url>`;

const all = [
  ...paths.map(entry),
  ...monoPaths.map(monoEntry),
  ...STATIC_PAIRS.flatMap(staticPairEntries),
  ...STATIC_MONO.map(staticMonoEntry),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${all.join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap.xml — ${all.length} URLs (lastmod ${today})`);

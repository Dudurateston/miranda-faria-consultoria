/**
 * VERIFICAÇÃO DO SITE — a auditoria que descobriu os erros que importam.
 *
 * Este arquivo existe porque duas falhas sérias deste projeto eram
 * invisíveis em captura de tela e só apareceram quando medidas:
 *
 * 1. O texto do corpo da Home chegava a 1,02:1 de contraste em certo
 *    ponto do scroll — praticamente invisível. A causa era uma faixa
 *    cega na rampa de cor onde NENHUMA das duas cores de texto
 *    alcançava 4,5:1.
 * 2. O cobre da marca dá 4,49:1 sobre branco-osso e reprova WCAG AA por
 *    um centésimo. Não pode ser cor de texto pequeno em lugar nenhum.
 *
 * Rode depois de qualquer mudança visual. Olhar não basta.
 *
 *   npm run verify              # contra o build de produção
 *   npm run verify -- --url=…   # contra outro endereço
 *   npm run verify -- --quick   # só rotas e contraste
 */
import { chromium } from "playwright";
import { existsSync } from "node:fs";

const arg = (n, d) => {
  const hit = process.argv.find((a) => a.startsWith(`--${n}=`));
  return hit ? hit.split("=")[1] : d;
};
const has = (n) => process.argv.includes(`--${n}`);

const BASE = arg("url", "http://localhost:4173");
const QUICK = has("quick");

// O Chromium da imagem nem sempre bate com o que o Playwright espera.
const CHROME = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome"].find(existsSync);

const LANGS = ["en", "pt"];
const PAGES = ["", "systems", "design", "business", "work", "how-i-work", "about", "contact"];
const CASES = [
  "queijos-santana", "roda-agro", "paulo-henrique", "motormoura",
  "1000-pecas", "rota-forte", "dj-jotave", "miranda-faria",
];

const found = [];
const flag = (sev, area, msg) => found.push({ sev, area, msg });

const browser = await chromium.launch(CHROME ? { executablePath: CHROME } : {});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

// As fontes externas travam em rede restrita e não afetam o que se mede.
await ctx.route("**://fonts.googleapis.com/**", (r) => r.abort());
await ctx.route("**://fonts.gstatic.com/**", (r) => r.abort());

const page = await ctx.newPage();
const jsErrors = [];
const badAssets = new Set();
page.on("pageerror", (e) => jsErrors.push(`${page.url()} :: ${e.message}`));
page.on("response", (r) => {
  if (r.status() >= 400 && /\.(webp|png|jpg|mp4|svg|woff2?|json|xml|txt)/.test(r.url()))
    badAssets.add(`${r.status()} ${new URL(r.url()).pathname}`);
});

const routes = LANGS.flatMap((l) => [
  ...PAGES.map((p) => `/${l}${p ? "/" + p : ""}`),
  ...CASES.map((c) => `/${l}/work/${c}`),
]);

/* ---------- 1. rotas, estrutura, meta ---------- */
console.log(`\nverificando ${routes.length} rotas em ${BASE}`);
const titles = new Map();

for (const r of routes) {
  let resp;
  try {
    resp = await page.goto(BASE + r, { waitUntil: "domcontentloaded", timeout: 15000 });
  } catch (e) {
    flag("ALTO", "rota", `${r} não carregou: ${e.message.slice(0, 60)}`);
    continue;
  }
  await page.waitForTimeout(220);
  if (!resp || resp.status() >= 400) flag("ALTO", "rota", `${r} respondeu ${resp?.status()}`);

  const info = await page.evaluate(() => ({
    title: document.title,
    lang: document.documentElement.lang,
    h1: document.querySelectorAll("h1").length,
    semAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
    quebradas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
    main: document.querySelectorAll("main").length,
    alternates: document.querySelectorAll('link[rel="alternate"]').length,
    canonical: !!document.querySelector('link[rel="canonical"]'),
    mudos: [...document.querySelectorAll("a,button")]
      .filter((e) => !e.textContent.trim() && !e.getAttribute("aria-label")).length,
    internos: [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")),
  }));

  if (info.h1 !== 1) flag(info.h1 ? "MEDIO" : "ALTO", "a11y", `${r}: ${info.h1} elementos h1`);
  if (info.semAlt) flag("MEDIO", "a11y", `${r}: ${info.semAlt} imagem(ns) sem alt`);
  if (info.quebradas) flag("ALTO", "midia", `${r}: ${info.quebradas} imagem(ns) quebrada(s)`);
  if (info.main !== 1) flag("MEDIO", "a11y", `${r}: ${info.main} landmark <main>`);
  if (info.mudos) flag("MEDIO", "a11y", `${r}: ${info.mudos} link/botão sem texto acessível`);
  if (info.alternates < 3) flag("MEDIO", "seo", `${r}: ${info.alternates} tags hreflang`);
  if (!info.canonical) flag("MEDIO", "seo", `${r}: sem canonical`);
  const esperado = r.startsWith("/pt") ? "pt-BR" : "en";
  if (info.lang !== esperado) flag("MEDIO", "seo", `${r}: html lang="${info.lang}", esperado "${esperado}"`);
  if (titles.has(info.title) && !info.title.includes("—")) {
    flag("BAIXO", "seo", `título repetido: ${titles.get(info.title)} e ${r}`);
  }
  titles.set(info.title, r);

  const conhecidas = new Set([...routes, "/privacidade", "/connect", "/login"]);
  for (const href of info.internos) {
    if (!conhecidas.has(href)) flag("ALTO", "link", `${r} aponta para ${href}, rota desconhecida`);
  }
  process.stdout.write(".");
}
console.log();

/* ---------- 2. contraste, medido sobre o fundo REAL ---------- */
const MEASURE = () => {
  const srgb = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const L = ([r, g, b]) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
  const nums = (s) => s.match(/[\d.]+/g).map(Number);
  const ratio = (f, b) => { const [a, c] = [L(f), L(b)].sort((x, y) => y - x); return (a + 0.05) / (c + 0.05); };
  const pageBg = nums(getComputedStyle(document.body).backgroundColor).slice(0, 3);

  const out = [];
  const seen = new Set();
  for (const el of document.querySelectorAll("h1,h2,h3,p,a,li,span,.mf-label,figcaption,button")) {
    if (el.children.length || !el.textContent.trim()) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none" || +cs.opacity < 0.1) continue;
    const rect = el.getBoundingClientRect();
    if (rect.height === 0 || rect.bottom < 0 || rect.top > innerHeight) continue;
    const key = el.className + "|" + cs.fontSize;
    if (seen.has(key)) continue;
    seen.add(key);

    // Cor efetiva: alfa do texto composto sobre o primeiro fundo opaco.
    const m = nums(cs.color);
    const a = m.length > 3 ? m[3] : 1;
    let bg = pageBg, node = el;
    while (node && node !== document.documentElement) {
      const p = nums(getComputedStyle(node).backgroundColor);
      if (p && (p.length < 4 || p[3] > 0.9)) { bg = p.slice(0, 3); break; }
      node = node.parentElement;
    }
    const fg = m.slice(0, 3).map((c, i) => Math.round(c * a + bg[i] * (1 - a)));
    const size = parseFloat(cs.fontSize);
    const grande = size >= 24 || (size >= 18.66 && +cs.fontWeight >= 700);
    out.push({
      alvo: (el.className || el.tagName).toString().slice(0, 30),
      razao: +ratio(fg, bg).toFixed(2),
      min: grande ? 3 : 4.5,
      texto: el.textContent.trim().slice(0, 26),
    });
  }
  return out;
};

const alvos = ["/en", "/en/systems", "/en/business", "/en/how-i-work", "/en/about", "/en/contact", "/pt"];
let medicoes = 0;
console.log(`medindo contraste em ${alvos.length} páginas × 6 posições de scroll`);

for (const r of alvos) {
  await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(800);
  for (const f of [0, 0.25, 0.5, 0.7, 0.85, 1]) {
    await page.evaluate((x) => scrollTo(0, (document.body.scrollHeight - innerHeight) * x), f);
    await page.waitForTimeout(QUICK ? 500 : 900);
    for (const row of await page.evaluate(MEASURE)) {
      medicoes++;
      if (row.razao < row.min) {
        flag("ALTO", "contraste",
          `${r} @${Math.round(f * 100)}%  ${row.razao}:1 (mín ${row.min})  .${row.alvo}  "${row.texto}"`);
      }
    }
  }
  process.stdout.write(".");
}
console.log();

/* ---------- 3. o primeiro quadro, e o texto fantasma ----------

   Duas coisas que a medicao de contraste acima NAO pega, e que ja
   custaram caro neste projeto:

   a) A home chegou a ter UM unico elemento de texto legivel antes de
      qualquer scroll — a palavra "Scroll", em 10px. O h1 existia no
      HTML (entao nenhuma checagem estrutural reclamava) mas estava em
      opacity 0 ate 72% de uma abertura de quase cinco telas. Um
      recrutador da a uma home 10 a 15 segundos; era a conta inteira
      gasta sem dizer o nome de quem assina.

   b) A medicao de contraste le a cor CALCULADA do elemento. Ela nao
      enxerga `opacity` herdada de um ancestral. Um paragrafo dentro de
      um bloco em opacity 0.3 e medido como se estivesse cheio: passa em
      AA na auditoria e some para quem le. Por isso texto em opacidade
      parcial e proibido, e por isso e verificado aqui.
   ---------------------------------------------------------------- */
const LEGIVEL = () => {
  const out = [];
  for (const el of document.querySelectorAll("h1,h2,h3,p,a,li,span,button")) {
    if (el.children.length || !el.textContent.trim()) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    const r = el.getBoundingClientRect();
    if (r.height === 0 || r.bottom < 0 || r.top > innerHeight) continue;
    let op = 1, n = el;
    while (n && n !== document.documentElement) { op *= +getComputedStyle(n).opacity; n = n.parentElement; }
    out.push({
      t: el.textContent.trim().slice(0, 34),
      op: +op.toFixed(2),
      px: Math.round(parseFloat(cs.fontSize)),
    });
  }
  return out;
};

console.log("checando o primeiro quadro e texto fantasma");
for (const r of ["/en", "/pt", "/en/work", "/en/about", "/en/contact"]) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(900);
  const itens = await page.evaluate(LEGIVEL);

  // Fantasmas: nem apagado de proposito (<0.06, invisivel para todos) nem
  // cheio. A faixa do meio e a perigosa — parece texto, mede como texto,
  // e nao se le.
  for (const i of itens.filter((i) => i.op > 0.06 && i.op < 0.85)) {
    flag("ALTO", "fantasma", `${r}: texto em opacidade ${i.op} — "${i.t}" (${i.px}px)`);
  }

  const visiveis = itens.filter((i) => i.op >= 0.85);
  if (visiveis.length < 6) {
    flag("ALTO", "abertura",
      `${r}: so ${visiveis.length} elemento(s) de texto legivel(is) sem rolar — ` +
      `${visiveis.map((i) => JSON.stringify(i.t)).join(", ") || "nenhum"}`);
  }
  // Sem um titulo de verdade na primeira tela, a pagina nao diz o que e.
  if (!visiveis.some((i) => i.px >= 28)) {
    flag("ALTO", "abertura", `${r}: nenhum texto grande (>=28px) na primeira tela`);
  }
  process.stdout.write(".");
}
console.log();

/* ---------- 4. responsivo ---------- */
if (!QUICK) {
  console.log("checando overflow horizontal em 3 larguras");
  for (const [w, h] of [[390, 844], [768, 1024], [1440, 900]]) {
    await page.setViewportSize({ width: w, height: h });
    for (const r of ["/en", "/en/systems", "/en/work", "/en/about", "/en/contact"]) {
      await page.goto(BASE + r, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(400);
      const o = await page.evaluate(() => {
        const de = document.documentElement;
        const largos = [...document.querySelectorAll("body *")]
          .filter((e) => e.getBoundingClientRect().right > de.clientWidth + 2)
          .map((e) => e.className?.toString?.().slice(0, 32) || e.tagName).slice(0, 3);
        return { s: de.scrollWidth, c: de.clientWidth, largos };
      });
      if (o.s > o.c + 2) {
        flag("ALTO", "responsivo", `${w}px em ${r}: rola na horizontal (${o.s} > ${o.c}) — ${o.largos.join(" | ")}`);
      }
    }
    process.stdout.write(".");
  }
  console.log();
}

/* ---------- relatório ---------- */
jsErrors.slice(0, 8).forEach((e) => flag("ALTO", "runtime", e));
[...badAssets].forEach((a) => flag("ALTO", "midia", `asset ${a}`));

const ordem = { ALTO: 0, MEDIO: 1, BAIXO: 2 };
found.sort((a, b) => ordem[a.sev] - ordem[b.sev]);
const conta = found.reduce((m, f) => ({ ...m, [f.sev]: (m[f.sev] || 0) + 1 }), {});

console.log("\n" + "=".repeat(70));
console.log(`${routes.length} rotas · ${medicoes} medições de contraste · ${jsErrors.length} erros de JS · ${badAssets.size} assets 4xx`);
console.log(`ACHADOS: ${found.length}  (alto ${conta.ALTO || 0} · médio ${conta.MEDIO || 0} · baixo ${conta.BAIXO || 0})`);
console.log("=".repeat(70));

const vistos = new Set();
for (const f of found) {
  const k = `${f.sev}|${f.area}|${f.msg.replace(/\/(en|pt)\S*/, "…")}`;
  if (vistos.has(k)) continue;
  vistos.add(k);
  console.log(`[${f.sev.padEnd(5)}] ${f.area.padEnd(11)} ${f.msg}`);
}
if (!found.length) console.log("Nada a corrigir.");

await browser.close();
process.exit(conta.ALTO ? 1 : 0);

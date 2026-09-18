/**
 * verify.mjs — o que o cliente realmente vê, medido.
 *
 * Roda sobre o site BUILDADO (dist/), não sobre a preview do builder.
 * Abre cada rota em cada largura, em várias posições de rolagem, e mede:
 *
 *   contraste real sobre o fundo composto · texto fantasma (opacidade
 *   herdada parada) · estouro horizontal · erro de JS · asset 4xx ·
 *   alvo de toque · hierarquia de títulos · imagem sem alt ou sem
 *   dimensão · link/botão sem nome acessível · title e description ·
 *   lang da rota · link interno quebrado
 *
 * Sai com código 1 se houver qualquer achado bloqueador.
 *
 *   npm run verify              todas as rotas
 *   npm run verify -- --fast    só as rotas principais
 *   npm run verify -- --json    relatório em JSON no stdout
 */

import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const PORT = 4183;
const BASE = `http://127.0.0.1:${PORT}`;
const CHROME = "/opt/pw-browsers/chromium";

const FAST = process.argv.includes("--fast");
const AS_JSON = process.argv.includes("--json");

const PRACTICE = ["gestao", "desenvolvimento", "design", "automacao"];
const PAGES = ["", "servicos", "insights", "work", "how-i-work", "about", "contact"];
const CASES = [
  "queijos-serra", "roda-agro", "paulo-henrique", "motormoura", "1000-pecas",
  "rota-forte", "miranda-faria", "motormoura-marca", "1000-pecas-marca",
  "roda-agro-marca", "uaiso-travel", "advogados-lco", "sevalho-controladoria",
  "vaf-global",
];

function routes() {
  const out = [];
  for (const lang of ["pt", "en"]) {
    for (const p of PAGES) out.push(`/${lang}${p ? "/" + p : ""}`);
    for (const p of PRACTICE) out.push(`/${lang}/${p}`);
    const cases = FAST ? CASES.slice(0, 2) : CASES;
    for (const c of cases) out.push(`/${lang}/work/${c}`);
  }
  out.push("/privacidade");
  return out;
}

const WIDTHS = FAST ? [390, 1440] : [390, 768, 1440];
const SCROLLS = [0, 0.25, 0.55, 0.85];

/* ---------- o que roda dentro da página ---------- */

const PROBE = `(() => {
  const R = { contrast: [], overMedia: [], ghost: [], targets: [], headings: [],
              images: [], names: [], overflow: null, meta: null, links: [] };

  const px = (v) => parseFloat(v) || 0;

  function parseColor(c) {
    const m = c && c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const p = m[1].split(",").map((s) => parseFloat(s));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }

  function over(fg, bg) {
    const a = fg.a;
    return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a),
             b: fg.b * a + bg.b * (1 - a), a: 1 };
  }

  function lum(c) {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  }

  function ratio(a, b) {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  }

  // Texto sobre vídeo/imagem não tem contraste calculável: o fundo muda
  // a cada quadro. Vai para um balde próprio, não reprova como cor.
  function coversRect(media, r) {
    const cs = getComputedStyle(media);
    if (cs.position !== "absolute" && cs.position !== "fixed") return false;
    const m = media.getBoundingClientRect();
    return m.left <= r.left + 2 && m.right >= r.right - 2 &&
           m.top <= r.top + 2 && m.bottom >= r.bottom - 2;
  }

  function mediaBehind(el, r) {
    let n = el;
    while (n && n.nodeType === 1) {
      if (getComputedStyle(n).backgroundImage !== "none") return "background-image";
      // Descendente em qualquer profundidade: a mídia costuma estar dentro
      // de um <figure> irmão do texto, não como filho direto da seção.
      for (const m of n.querySelectorAll("video, img, canvas, svg")) {
        if (m.contains(el)) continue;
        if (coversRect(m, r)) return m.tagName.toLowerCase();
      }
      n = n.parentElement;
      if (n === document.body) break;
    }
    return null;
  }

  // fundo efetivo: sobe a árvore compondo até achar cor opaca
  function bgOf(el) {
    let acc = null, n = el;
    while (n && n.nodeType === 1) {
      const c = parseColor(getComputedStyle(n).backgroundColor);
      if (c && c.a > 0) acc = acc ? over(acc, c) : c;
      if (acc && acc.a >= 0.999) return acc;
      n = n.parentElement;
    }
    const base = { r: 245, g: 241, b: 234, a: 1 }; // --bone
    return acc ? over(acc, base) : base;
  }

  // opacidade herdada: multiplica a cadeia de pais
  function effOpacity(el) {
    let o = 1, n = el;
    while (n && n.nodeType === 1) {
      o *= px(getComputedStyle(n).opacity) || (getComputedStyle(n).opacity === "0" ? 0 : 1);
      n = n.parentElement;
    }
    return o;
  }

  function path(el) {
    const bits = [];
    let n = el;
    for (let i = 0; n && n.nodeType === 1 && i < 4; i++) {
      let s = n.tagName.toLowerCase();
      if (n.id) { bits.unshift(s + "#" + n.id); break; }
      const cls = (n.getAttribute("class") || "").trim().split(/\\s+/).filter(Boolean).slice(0, 2);
      if (cls.length) s += "." + cls.join(".");
      bits.unshift(s);
      n = n.parentElement;
    }
    return bits.join(" > ");
  }

  const inView = (r) => r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth && r.width > 0 && r.height > 0;

  // --- texto: contraste + fantasma ---
  const seen = new Set();
  document.querySelectorAll("body *").forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return;

    // só o nó que carrega texto direto, não o contêiner
    let txt = "";
    for (const n of el.childNodes) if (n.nodeType === 3) txt += n.textContent;
    txt = txt.replace(/\\s+/g, " ").trim();
    if (!txt) return;

    const r = el.getBoundingClientRect();
    if (!inView(r)) return;

    const key = path(el) + "|" + txt.slice(0, 40);
    if (seen.has(key)) return;
    seen.add(key);

    const o = effOpacity(el);

    // As revelações deste site são dirigidas por SCROLL (animation-timeline:
    // view()), não por tempo — esperar não as termina. O filtro tem de ser
    // geométrico.
    //
    // CUIDADO, e o motivo desta linha existir: a primeira versão usava
    // 12%–88% da altura e chamava isso de "miolo da tela". NÃO É. Uma
    // varredura de 1% em 1% em /pt/work mostrou 66 medições abaixo de
    // 4,5:1, TODAS entre 68% e 97% da altura — o terço de baixo, onde o
    // fade-in de entrada legitimamente acontece. Nenhuma acima da linha do
    // meio. Aquele filtro transformou uma animação correta em 99 defeitos.
    //
    // A zona de leitura de verdade é o miolo: 25%–75%. Texto que ainda
    // está subindo pela borda inferior não é fantasma, é revelação.
    const settled = r.top > innerHeight * 0.25 && r.bottom < innerHeight * 0.75;

    if (o > 0.06 && o < 0.85) {
      if (settled) {
        // Diagnóstico junto do achado: de quem é a opacidade e por quê.
        let owner = el, ow = 1;
        for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
          const v = parseFloat(getComputedStyle(n).opacity);
          if (!isNaN(v) && v < 0.999) { owner = n; ow = v; break; }
        }
        let anim = "nenhuma";
        try {
          const as = owner.getAnimations ? owner.getAnimations() : [];
          if (as.length) {
            anim = as.map((a) => {
              const name = (a.animationName || "?");
              const tl = a.timeline && a.timeline.constructor ? a.timeline.constructor.name : "?";
              return name + "@" + tl + ":" + a.playState;
            }).join(" ");
          }
        } catch { anim = "erro"; }
        R.ghost.push({ sel: path(el), text: txt.slice(0, 60), opacity: +o.toFixed(3),
          dono: path(owner), donoOpacity: +ow.toFixed(3), anim,
          // sem isto o achado não é auditável: opacidade parcial no terço
          // de baixo é revelação, no miolo é defeito.
          telaPct: Math.round(100 * ((r.top + r.bottom) / 2) / innerHeight) });
      }
      return; // fantasma já é o achado; contraste dele não acrescenta
    }
    if (o <= 0.06) return; // deliberadamente invisível

    const fg = parseColor(cs.color);
    if (!fg) return;

    const media = mediaBehind(el, r);
    if (media) {
      R.overMedia.push({ sel: path(el), text: txt.slice(0, 60), media,
        color: cs.color, size: +px(cs.fontSize).toFixed(1) });
      return;
    }

    const bg = bgOf(el);
    const composed = fg.a < 1 ? over(fg, bg) : fg;
    const cr = ratio(composed, bg);

    const size = px(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;

    if (cr < need) {
      R.contrast.push({ sel: path(el), text: txt.slice(0, 60),
        ratio: +cr.toFixed(2), need, size: +size.toFixed(1),
        color: cs.color, bg: "rgb(" + Math.round(bg.r) + "," + Math.round(bg.g) + "," + Math.round(bg.b) + ")" });
    }
  });

  // --- alvo de toque ---
  document.querySelectorAll('a[href], button, input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return;
    const r = el.getBoundingClientRect();
    if (!inView(r)) return;
    if (r.width < 1 || r.height < 1) return;
    if (r.width < 24 || r.height < 24) {
      R.targets.push({ sel: path(el), w: +r.width.toFixed(1), h: +r.height.toFixed(1),
        text: (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 40) });
    }
  });

  // --- nome acessível ---
  document.querySelectorAll('a[href], button, [role="button"]').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return;
    const name = (el.innerText || "").trim() || el.getAttribute("aria-label") ||
      el.getAttribute("title") || (el.querySelector("img") && el.querySelector("img").alt) || "";
    if (!name.trim()) R.names.push({ sel: path(el), href: el.getAttribute("href") || "" });
  });

  // --- imagens ---
  document.querySelectorAll("img").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 && r.height < 1) return;
    const issues = [];
    if (el.getAttribute("alt") === null) issues.push("sem alt");
    if (!el.getAttribute("width") || !el.getAttribute("height")) issues.push("sem width/height");
    if (issues.length) R.images.push({ sel: path(el), src: (el.currentSrc || el.src || "").split("/").pop(), issues });
  });

  // --- títulos ---
  const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) => ({
    level: +h.tagName[1], text: (h.innerText || "").trim().slice(0, 50),
  }));
  R.headings = hs;

  // --- estouro horizontal ---
  const se = document.scrollingElement || document.documentElement;
  R.overflow = { scrollWidth: se.scrollWidth, inner: innerWidth };

  // --- meta ---
  const d = document.querySelector('meta[name="description"]');
  R.meta = { title: document.title, description: d ? d.content : null,
             lang: document.documentElement.lang };

  // --- links internos ---
  R.links = [...new Set([...document.querySelectorAll('a[href^="/"]')].map((a) => a.getAttribute("href")))];

  return R;
})()`;

/* ---------- orquestração ---------- */

async function startServer() {
  const p = spawn("npx", ["vite", "preview", "--port", String(PORT), "--strictPort"], {
    cwd: process.cwd(), stdio: ["ignore", "pipe", "pipe"], detached: false,
  });
  let log = "";
  p.stdout.on("data", (d) => (log += d));
  p.stderr.on("data", (d) => (log += d));

  // Espera a porta responder de verdade, em vez de adivinhar pelo stdout.
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE + "/", { signal: AbortSignal.timeout(1500) });
      if (r.ok || r.status === 404) return p;
    } catch { /* ainda subindo */ }
    await new Promise((r) => setTimeout(r, 500));
  }
  p.kill();
  throw new Error(`preview não subiu em 30s. Saída:\n${log.slice(-800)}`);
}

const ALL = { contrast: [], overMedia: [], ghost: [], targets: [], names: [],
              images: [], overflow: [], jsErrors: [], badAssets: [], headings: [],
              meta: [], badLinks: [] };

function push(list, route, width, scroll, items) {
  for (const it of items) list.push({ route, width, scroll, ...it });
}

async function run() {
  const server = await startServer();
  const browser = await chromium.launch({ executablePath: CHROME });
  const ROUTES = routes();
  // O conjunto de rotas VÁLIDAS é sempre o completo, mesmo em --fast:
  // senão o amostrador acusa como quebrado o link que ele só não visitou.
  const known = new Set();
  for (const lang of ["pt", "en"]) {
    for (const p of PAGES) known.add(`/${lang}${p ? "/" + p : ""}`);
    for (const p of PRACTICE) known.add(`/${lang}/${p}`);
    for (const c of CASES) known.add(`/${lang}/work/${c}`);
    known.add(`/${lang}/systems`); known.add(`/${lang}/business`); // redirecionam
  }
  known.add("/privacidade"); known.add("/pt"); known.add("/en");
  let n = 0;
  const total = ROUTES.length * WIDTHS.length;

  try {
    for (const width of WIDTHS) {
      const ctx = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: 1,
        userAgent: width < 500
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
          : undefined,
        hasTouch: width < 500,
      });
      const page = await ctx.newPage();

      const jsErr = [], bad = [];
      page.on("pageerror", (e) => jsErr.push(String(e.message).slice(0, 200)));
      page.on("console", (m) => { if (m.type() === "error") jsErr.push(String(m.text()).slice(0, 200)); });
      page.on("response", (r) => {
        if (r.status() >= 400) bad.push({ status: r.status(), url: r.url().replace(BASE, "") });
      });

      for (const route of ROUTES) {
        n++;
        if (!AS_JSON) process.stderr.write(`\r  ${n}/${total}  ${width}px  ${route}${" ".repeat(20)}`);
        jsErr.length = 0; bad.length = 0;

        try {
          await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
        } catch {
          ALL.jsErrors.push({ route, width, scroll: 0, message: "TIMEOUT ao carregar" });
          continue;
        }
        await page.waitForTimeout(900);

        let metaDone = false;
        for (const s of SCROLLS) {
          await page.evaluate((f) => {
            const se = document.scrollingElement || document.documentElement;
            se.scrollTop = (se.scrollHeight - innerHeight) * f;
          }, s);
          await page.waitForTimeout(850);

          // medir duas vezes: só vale o que está PARADO (mata falso
          // positivo de animação de entrada em voo)
          const a = await page.evaluate(PROBE);
          await page.waitForTimeout(420);
          const b = await page.evaluate(PROBE);

          const stable = (xs, ys, key) => {
            const set = new Set(ys.map((y) => y.sel + "|" + (key ? y[key] : "")));
            return xs.filter((x) => set.has(x.sel + "|" + (key ? x[key] : "")));
          };

          push(ALL.contrast, route, width, s, stable(a.contrast, b.contrast, "ratio"));
          push(ALL.overMedia, route, width, s, stable(a.overMedia, b.overMedia, "media"));
          push(ALL.ghost, route, width, s, stable(a.ghost, b.ghost, "opacity"));
          push(ALL.targets, route, width, s, stable(a.targets, b.targets));
          push(ALL.names, route, width, s, stable(a.names, b.names));

          if (b.overflow.scrollWidth > b.overflow.inner + 1) {
            ALL.overflow.push({ route, width, scroll: s, ...b.overflow });
          }
          if (!metaDone) {
            metaDone = true;
            push(ALL.images, route, width, s, b.images);
            ALL.meta.push({ route, width, ...b.meta });
            ALL.headings.push({ route, width, headings: b.headings });
            for (const href of b.links) {
              const clean = href.split("#")[0].split("?")[0].replace(/\/$/, "");
              if (clean && !known.has(clean) && clean !== "") {
                ALL.badLinks.push({ route, width, href });
              }
            }
          }
        }

        for (const m of new Set(jsErr)) ALL.jsErrors.push({ route, width, message: m });
        for (const x of bad) ALL.badAssets.push({ route, width, ...x });
      }
      await ctx.close();
    }
  } finally {
    await browser.close();
    server.kill();
  }
  if (!AS_JSON) process.stderr.write("\r" + " ".repeat(70) + "\r");
}

/* ---------- saída ---------- */

function dedupe(list, keyFn) {
  const m = new Map();
  for (const it of list) {
    const k = keyFn(it);
    if (!m.has(k)) m.set(k, { ...it, hits: 1, routes: new Set([it.route]), widths: new Set([it.width]) });
    else { const e = m.get(k); e.hits++; e.routes.add(it.route); e.widths.add(it.width); }
  }
  return [...m.values()].sort((a, b) => b.hits - a.hits);
}

function report() {
  const C = dedupe(ALL.contrast, (x) => x.sel + "|" + x.ratio);
  const M = dedupe(ALL.overMedia, (x) => x.sel + "|" + x.media);
  const G = dedupe(ALL.ghost, (x) => x.sel + "|" + x.opacity);
  const T = dedupe(ALL.targets, (x) => x.sel + "|" + x.w + "x" + x.h);
  const N = dedupe(ALL.names, (x) => x.sel + "|" + x.href);
  const I = dedupe(ALL.images, (x) => x.sel + "|" + x.issues.join(","));
  const O = dedupe(ALL.overflow, (x) => x.route + "|" + x.width);
  const J = dedupe(ALL.jsErrors, (x) => x.message);
  const A = dedupe(ALL.badAssets, (x) => x.status + "|" + x.url);
  const L = dedupe(ALL.badLinks, (x) => x.href);

  // títulos
  const headIssues = [];
  for (const h of ALL.headings) {
    if (h.width !== 1440) continue;
    const h1 = h.headings.filter((x) => x.level === 1);
    if (h1.length === 0) headIssues.push({ route: h.route, problema: "nenhum h1" });
    else if (h1.length > 1) headIssues.push({ route: h.route, problema: `${h1.length} h1`, quais: h1.map((x) => x.text) });
    let prev = 0;
    for (const x of h.headings) {
      if (prev && x.level > prev + 1) {
        headIssues.push({ route: h.route, problema: `salto h${prev} → h${x.level}`, em: x.text });
        break;
      }
      prev = x.level;
    }
  }

  // meta
  const metaIssues = [];
  const titles = new Map();
  for (const m of ALL.meta) {
    if (m.width !== 1440) continue;
    if (!m.title) metaIssues.push({ route: m.route, problema: "sem <title>" });
    if (!m.description) metaIssues.push({ route: m.route, problema: "sem meta description" });
    const wantLang = m.route.startsWith("/en") ? "en" : "pt";
    if (m.lang && m.lang.slice(0, 2) !== wantLang && m.route !== "/privacidade") {
      metaIssues.push({ route: m.route, problema: `lang="${m.lang}" mas a rota é ${wantLang}` });
    }
    if (m.title) titles.set(m.title, [...(titles.get(m.title) || []), m.route]);
  }
  for (const [t, rs] of titles) {
    if (rs.length > 1) metaIssues.push({ route: rs.join(", "), problema: `título repetido: "${t}"` });
  }

  const out = { contraste: C, sobreMidia: M, fantasma: G, alvos: T, semNome: N,
                imagens: I, estouro: O, erroJS: J, assets4xx: A,
                linksQuebrados: L, titulos: headIssues, meta: metaIssues };

  writeFileSync("verify-report.json", JSON.stringify(out, null, 2));

  if (AS_JSON) { console.log(JSON.stringify(out, null, 2)); }
  else {
    const line = (label, arr, fmt) => {
      console.log(`\n${label}  —  ${arr.length}`);
      if (!arr.length) return;
      for (const x of arr.slice(0, 14)) {
        console.log("   " + fmt(x));
        const rs = [...x.routes];
        console.log("      " + rs.slice(0, 3).join(" ") + (rs.length > 3 ? ` (+${rs.length - 3} rotas)` : "") +
                    "  @ " + [...x.widths].join("/") + "px");
      }
      if (arr.length > 14) console.log(`   … +${arr.length - 14}`);
    };

    console.log("\n" + "=".repeat(64));
    console.log("  VERIFY — o que o visitante vê, medido");
    console.log("=".repeat(64));

    line("CONTRASTE reprovado", C, (x) => `${x.ratio}:1 (precisa ${x.need}) ${x.size}px  ${x.color} sobre ${x.bg}\n      ${x.sel}\n      "${x.text}"`);
    line("TEXTO FANTASMA (opacidade parada no MIOLO da tela, 25%-75%)", G,
      (x) => `opacidade ${x.opacity}  a ${x.telaPct}% da altura da tela  ${x.sel}\n      "${x.text}"\n      dono da opacidade: ${x.dono} (${x.donoOpacity})  ·  animação: ${x.anim}`);
    line("ESTOURO HORIZONTAL", O, (x) => `${x.route} @${x.width}px — scrollWidth ${x.scrollWidth} > ${x.inner}`);
    line("ERRO DE JS", J, (x) => x.message);
    line("ASSET 4xx", A, (x) => `${x.status}  ${x.url}`);
    line("LINK INTERNO QUEBRADO", L, (x) => x.href);
    line("ALVO DE TOQUE < 24px", T, (x) => `${x.w}×${x.h}  ${x.sel}  "${x.text}"`);
    line("LINK/BOTÃO SEM NOME ACESSÍVEL", N, (x) => `${x.sel}  href=${x.href}`);
    line("IMAGEM", I, (x) => `${x.issues.join(" + ")}  ${x.src}  ${x.sel}`);
    line("TEXTO SOBRE MÍDIA (contraste não calculável — conferir o pior quadro)", M,
      (x) => `sobre <${x.media}>  ${x.size}px ${x.color}\n      ${x.sel}\n      "${x.text}"`);

    console.log(`\nHIERARQUIA DE TÍTULOS  —  ${headIssues.length}`);
    for (const x of headIssues.slice(0, 14)) console.log(`   ${x.route}: ${x.problema}${x.em ? ` (em "${x.em}")` : ""}${x.quais ? " → " + x.quais.join(" | ") : ""}`);

    console.log(`\nTITLE / DESCRIPTION / LANG  —  ${metaIssues.length}`);
    for (const x of metaIssues.slice(0, 14)) console.log(`   ${x.route}: ${x.problema}`);

    console.log("\n" + "=".repeat(64));
  }

  const blockers = C.length + G.length + O.length + J.length + A.length + L.length + N.length;
  if (!AS_JSON) {
    console.log(`  BLOQUEADORES: ${blockers}   ·   relatório completo em verify-report.json`);
    console.log("=".repeat(64) + "\n");
  }
  return blockers === 0 ? 0 : 1;
}

await run();
process.exit(report());

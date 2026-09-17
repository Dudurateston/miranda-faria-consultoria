/**
 * verify.mjs — medição de qualidade do Miranda Faria (PASSO 1+2 do Eduardo, 17/09).
 *
 * O que faz, por combinação de rota × idioma × viewport (390/768/1440) ×
 * 4 posições de rolagem:
 *   1. contraste WCAG: cor do texto × cor de fundo COMPOSTA (sobe a árvore
 *      até achar backgroundColor opaca). <24px reprova abaixo de 4,5:1;
 *      ≥24px abaixo de 3:1.
 *   2. opacidade herdada (cadeia multiplicada): texto parado entre 0,06 e
 *      0,80 reprova.
 *   3. FPS com ponteiro interagindo (home e work): abaixo de 55 reprova.
 *   mais: overflow horizontal, erro de JS, asset 4xx, alvo de toque <44px,
 *      h1 único, alt em toda img, nome acessível em link/botão.
 *
 * Baseline (PASSO 2): scripts/verify-baseline.json — npm run verify:baseline
 * grava; npm run verify REPROVA se mídias/elementos legíveis diminuírem,
 * FPS piorar ou bundle crescer >2%. "Otimizar" nunca pode tirar coisa da tela.
 *
 * Sai com 0 (limpo) ou 1 (achados). Nunca é editado para passar; se ele
 * apontar errado, o erro é discutido, não silenciado.
 */
import { chromium } from "playwright";
import { createServer } from "http";
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "fs";
import { join, extname } from "path";

const DIST = new URL("../dist", import.meta.url).pathname;
const PORT = 4511;
const BASE = `http://localhost:${PORT}`;
const DO_BASELINE = process.argv.includes("--baseline");
const BASELINE_PATH = new URL("./verify-baseline.json", import.meta.url).pathname;

// rotas do site público (as de auth ficam fora do escopo do redesign)
const LANGS = ["pt", "en"];
const ROTAS = [
  "", "servicos", "insights", "work", "about", "contact", "how-i-work",
  "gestao", "desenvolvimento", "design", "automacao", "work/roda-agro",
];
const VIEWPORTS = [
  { w: 390, h: 844, touch: true },
  { w: 768, h: 1024, touch: true },
  { w: 1440, h: 820, touch: false },
];
// tema escuro (spot-check de contraste/opacidade, rotas-chave)
const DARK_SPOT = ["", "servicos", "work", "about", "contact"];

const CSS_LUM = (r, g, b) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (fg, bg) => {
  const L1 = CSS_LUM(...fg), L2 = CSS_LUM(...bg);
  const [a, b] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (a + 0.05) / (b + 0.05);
};

// ── servidor estático do dist (sem fetch de file://) ────────────────────────
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".mp4": "video/mp4", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json", ".ico": "image/x-icon" };
const assets4xx = [];
const jsErrors = [];
const server = createServer((req, res) => {
  let p = req.url.split("?")[0].replace(/^\/+/, "");
  let file = p === "" ? "index.html" : p;
  if (!existsSync(join(DIST, file))) file = "index.html"; // SPA fallback
  const full = join(DIST, file);
  if (!existsSync(full)) { res.writeHead(404); return res.end(); }
  if (req.url.startsWith("/art/") || req.url.startsWith("/work/") || /\.(mp4|webp|png|jpg|woff2)$/.test(req.url)) {
    if (!existsSync(join(DIST, req.url.split("?")[0]))) assets4xx.push(req.url.split("?")[0]);
  }
  res.writeHead(200, { "content-type": MIME[extname(full)] || "application/octet-stream" });
  res.end(readFileSync(full));
});
await new Promise((r) => server.listen(PORT, r));

// ── audit DOM: roda na página, devolve achados + contagens ──────────────────
const contrastJs = `
  const rgba = (s)=>{const m=s.match(/[\\d.]+/g)||[];return m.length>=3?m.slice(0,3).map(Number):null;};
  const f=(c)=>{c/=255;return c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4;};
  const lum=(r,g,b)=>0.2126*f(r)+0.7152*f(g)+0.0722*f(b);
  const contrast=(a,b)=>{const L1=lum(...a),L2=lum(...b);const[x,y]=L1>L2?[L1,L2]:[L2,L1];return(x+0.05)/(y+0.05);};
`;
const FPS_SRC = `${contrastJs}
  return new Promise((resolve) => {
    const marks = [];
    let t0 = performance.now();
    const tick = (t) => { marks.push(t); if (t - t0 < ms) requestAnimationFrame(tick); else {
      const win = 700; let min = Infinity;
      for (let i = 0; i < marks.length; i++) {
        let j = i; while (j < marks.length && marks[j] - marks[i] < win) j++;
        if (marks[j] - marks[i] >= win * 0.9 || j < marks.length) {
          const fps = (j - i - 1) / ((marks[j - 1] - marks[i]) / 1000);
          if (isFinite(fps) && fps > 0) min = Math.min(min, fps);
        }
      }
      resolve(Math.round(isFinite(min) ? min : 0));
    }};
    requestAnimationFrame(tick);
  })`;

const AUDIT_SRC = `(args) => { const { portIn, isTouch } = args;
  const cLum = (r, g, b) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const contrast = (a, b) => { const L1 = cLum(...a), L2 = cLum(...b); const [x, y] = L1 > L2 ? [L1, L2] : [L2, L1]; return (x + 0.05) / (y + 0.05); };
  const out = { achados: [], midias: 0, legiveis1: 0, h1: 0 };
  const rgba = (s) => { const m = s.match(/[\\d.]+/g) || []; return m.length >= 3 ? m.slice(0, 3).map(Number) : null; };
  const alphaOf = (s) => { const m = s.match(/[\\d.]+/g) || []; return m.length === 4 ? Number(m[3]) : 1; };
  const sel = (el) => {
    const id = el.id ? '#' + el.id : '';
    const cls = (typeof el.className === 'string' && el.className) ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.') : '';
    return el.tagName.toLowerCase() + id + cls;
  };
  const visible = (el, cs, r) => cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0 && r.width >= 1 && r.height >= 1 && r.bottom > portIn.top && r.top < portIn.bottom && r.right > 0 && r.left < innerWidth;
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (!visible(el, cs, r)) continue;
    if (el.tagName === 'IMG' || el.tagName === 'VIDEO' || el.tagName === 'SOURCE') {
      out.midias++;
      if (el.tagName === 'IMG') {
        if (!el.hasAttribute('alt')) out.achados.push({ tipo: 'alt', sel: sel(el), valor: 'img sem alt', txt: el.getAttribute('src') || '' });
        if (el.naturalWidth === 0 && el.complete) out.achados.push({ tipo: 'asset4xx', sel: sel(el), valor: 'img quebrada', txt: el.getAttribute('src') || '' });
      }
    }
    if (el.tagName === 'H1') out.h1++;
    if ((el.tagName === 'A' || el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' || ['INPUT','SELECT','SUMMARY','TEXTAREA'].includes(el.tagName)) && isTouch) {
      if (el.tagName !== 'INPUT' || el.type !== 'hidden') {
        const minh = Math.min(...[el, ...el.children].filter(c => c.getBoundingClientRect().height > 0).map(c => c.getBoundingClientRect().height));
        const minw = Math.min(...[el, ...el.children].filter(c => c.getBoundingClientRect().width > 0).map(c => c.getBoundingClientRect().width));
        if (minh > 0 && (minh < 44 || minw < 44)) out.achados.push({ tipo: 'toque', sel: sel(el), valor: Math.round(minw) + 'x' + Math.round(minh), txt: el.textContent.trim().slice(0, 30) });
      }
    }
    if (el.tagName === 'A' || el.tagName === 'BUTTON') {
      const nome = el.textContent.trim() || el.getAttribute('aria-label') || el.getAttribute('title') || (el.querySelector('img[alt]') ? el.querySelector('img[alt]').alt : '');
      if (!nome) out.achados.push({ tipo: 'nome', sel: sel(el), valor: 'sem nome acessível', txt: '' });
    }
    // texto próprio (só filhos textuais diretos — evita dupla contagem pai/filho)
    let own = '';
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim()) { own += n.textContent.trim() + ' '; }
    if (!own) continue;
    out.legiveis1++;
    if (el.closest('script,style,template,noscript')) continue;
    // opacidade herdada
    let o = 1, e = el;
    while (e && e !== document.documentElement.parentElement) { o *= parseFloat(getComputedStyle(e).opacity || '1'); e = e.parentElement; }
    if (o > 0.06 && o < 0.80) out.achados.push({ tipo: 'opacidade', sel: sel(el), valor: o.toFixed(2), txt: own.slice(0, 30) });
    // fundo composto
    let bg = null, e2 = el;
    while (e2) {
      const c = getComputedStyle(e2).backgroundColor;
      if (alphaOf(c) === 1 && rgba(c)) { bg = rgba(c); break; }
      e2 = e2.parentElement;
    }
    if (!bg) bg = [255, 255, 255];
    const fg = rgba(cs.color) || [0, 0, 0];
    const px = parseFloat(cs.fontSize);
    const lim = px >= 24 ? 3 : 4.5;
    const ratio = contrast(fg, bg);
    if (ratio < lim) out.achados.push({ tipo: 'contraste', sel: sel(el), valor: ratio.toFixed(2) + ':1 (lim ' + lim + ')', txt: own.slice(0, 30), fg: cs.color, bg: 'rgb(' + bg.join(',') + ')', px: Math.round(px) });
  }
  return out;
}`;
const AUDIT_CALL = new Function("return " + AUDIT_SRC)();


// ── execução ────────────────────────────────────────────────────────────────
const browser = await chromium.launch({ args: ["--disable-dev-shm-usage"] });
const achados = [];
const contagens = { midias: {}, legiveis: {}, fpsMin: Infinity, bundleBytes: 0, homeTelas: {} };
let checks = 0;

async function varrer(page, rota, lang, vp, dark, tag) {
  const url = `${BASE}/${lang}/${rota}`.replace(/\/$/, "");
  assets4xx.length = 0; jsErrors.length = 0;
  const onErr = (e) => jsErrors.push(e.message.split("\n")[0]);
  const onPageErr = (e) => jsErrors.push(String(e).split("\n")[0]);
  page.on("pageerror", onPageErr);
  page.on("console", (m) => { if (m.type() === "error" && !m.text().includes("Failed to load resource")) jsErrors.push(m.text().slice(0, 120)); });
  page.on("response", (r) => { if (r.status() >= 400 && !r.url().includes("base44")) assets4xx.push(r.url().replace(BASE, "")); });
  await page.setViewportSize({ width: vp.w, height: vp.h });
  await page.goto(url, { waitUntil: "load", timeout: 45000 });
  await page.evaluate(() => { sessionStorage.setItem("mf-intro", "1"); localStorage.setItem("mf_analytics_consent", "1"); });
  await page.evaluate((d) => localStorage.setItem("mf-theme", d ? "dark" : "light"), dark);
  await page.goto(url, { waitUntil: "load", timeout: 45000 });
  await page.waitForTimeout(1600);

  const key = `${lang}/${rota || "home"}`;
  const heights = await page.evaluate(() => ({ doc: document.documentElement.scrollHeight, vh: innerHeight }));
  if (rota === "" && !dark) contagens.homeTelas[`${vp.w}`] = +(heights.doc / heights.vh).toFixed(1);

  const scrollPos = [0, 0.33, 0.66, 1].map((f) => Math.round((heights.doc - heights.vh) * f));
  let midiasRota = 0, legiveis1 = 0, h1Total = 0;
  for (let si = 0; si < scrollPos.length; si++) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollPos[si]);
    await page.waitForTimeout(1300); // settle: revelacoes GSAP 0.45-0.9s precisam terminar antes da medida
    const res = await page.evaluate(AUDIT_CALL, { portIn: { top: 0, bottom: vp.h }, isTouch: vp.touch });
    midiasRota = Math.max(midiasRota, res.midias);
    if (si === 0) legiveis1 = res.legiveis1;
    h1Total += res.h1;
    for (const a of res.achados) achados.push({ ...a, onde: `${tag} @scroll${si} [${vp.w}px]`, rota: key });
    const ovf = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (ovf > 1) achados.push({ tipo: "overflow", sel: "document", valor: ovf + "px", txt: "", onde: `${tag} @scroll${si} [${vp.w}px]`, rota: key });
    checks++;
  }
  if (h1Total === 0) achados.push({ tipo: "h1", sel: "page", valor: "0 h1 na rota", txt: "", onde: tag, rota: key });
  if (h1Total > 4) achados.push({ tipo: "h1", sel: "page", valor: h1Total + " h1 somados nos scrolls", txt: "", onde: tag, rota: key });
  for (const e of jsErrors) achados.push({ tipo: "js", sel: "console", valor: e, txt: "", onde: tag, rota: key });
  for (const a of [...new Set(assets4xx)]) achados.push({ tipo: "asset4xx", sel: "network", valor: a, txt: "", onde: tag, rota: key });
  contagens.midias[key] = Math.max(contagens.midias[key] || 0, midiasRota);
  if (vp.w === 1440 && !dark) contagens.legiveis[key] = Math.max(contagens.legiveis[key] || 0, legiveis1);
  page.removeAllListeners("pageerror"); page.removeAllListeners("console"); page.removeAllListeners("response");
}

// FPS: home (1440 e 390) e work (1440), ponteiro em movimento
async function medirFps(page, url, w, h) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(url, { waitUntil: "load", timeout: 45000 });
  await page.evaluate(() => { sessionStorage.setItem("mf-intro", "1"); localStorage.setItem("mf_analytics_consent", "1"); });
  await page.waitForTimeout(2500);
  const sampler = page.evaluate(new Function("ms", FPS_SRC), 2600);
  const mover = (async () => {
    const cx = w / 2, cy = h / 2.4;
    for (let i = 0; i < 40; i++) {
      await page.mouse.move(cx + 220 * Math.sin(i / 3.1), cy + 130 * Math.cos(i / 4.7));
      await page.mouse.down();
      await page.mouse.move(cx + 60 * Math.sin(i / 2.2), cy + 40 * Math.cos(i / 3.5));
      await page.mouse.up();
      await page.waitForTimeout(40);
    }
  })();
  const [fps] = await Promise.all([sampler, mover]);
  return fps;
}

const ctx = await browser.newContext({ isMobile: false, hasTouch: true, deviceScaleFactor: 1 });
const page = await ctx.newPage();

for (const lang of LANGS) {
  for (const rota of ROTAS) {
    for (const vp of VIEWPORTS) {
      await varrer(page, rota, lang, vp, false, `${lang}/${rota || "home"}`);
    }
  }
}
for (const rota of DARK_SPOT) {
  for (const w of [390, 1440]) {
    await varrer(page, rota, "pt", { w, h: w === 390 ? 844 : 820, touch: w === 390 }, true, `DARK pt/${rota || "home"}`);
  }
}
// privacidade (rota só em PT)
for (const vp of VIEWPORTS) await varrer(page, "privacidade", "pt", vp, false, "pt/privacidade");

contagens.fpsMin = Math.min(
  await medirFps(page, `${BASE}/pt`, 1440, 820),
  await medirFps(page, `${BASE}/pt`, 390, 844),
  await medirFps(page, `${BASE}/pt/work`, 1440, 820),
);
if (contagens.fpsMin < 55) achados.push({ tipo: "fps", sel: "render", valor: contagens.fpsMin + " fps mínimo", txt: "", onde: "home/work", rota: "fps" });

// bundle: soma dos JS do dist
const assetsDir = join(DIST, "assets");
for (const f of readdirSync(assetsDir)) {
  if (f.endsWith(".js")) contagens.bundleBytes += statSync(join(assetsDir, f)).size;
}

await browser.close();
server.close();

// ── PASSO 2: baseline / catraca ─────────────────────────────────────────────
const baseline = {
  gravadoEm: new Date().toISOString(),
  midias: contagens.midias,
  legiveis1Tela: contagens.legiveis,
  fpsMin: contagens.fpsMin,
  bundleBytes: contagens.bundleBytes,
  homeTelas: contagens.homeTelas,
};
if (DO_BASELINE) {
  writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2));
  console.log(`\nBASELINE gravado em scripts/verify-baseline.json (bundle ${(contagens.bundleBytes / 1024).toFixed(0)}KB, FPS min ${contagens.fpsMin}, ${checks} checagens)`);
} else if (existsSync(BASELINE_PATH)) {
  const prev = JSON.parse(readFileSync(BASELINE_PATH, "utf-8"));
  const piorou = [];
  for (const k of Object.keys(prev.midias)) {
    if ((contagens.midias[k] ?? 0) < prev.midias[k]) piorou.push(`mídias ${k}: ${prev.midias[k]} → ${contagens.midias[k] ?? 0}`);
  }
  for (const k of Object.keys(prev.legiveis1Tela)) {
    if ((contagens.legiveis[k] ?? 0) < prev.legiveis1Tela[k]) piorou.push(`legíveis 1ª tela ${k}: ${prev.legiveis1Tela[k]} → ${contagens.legiveis[k] ?? 0}`);
  }
  if (contagens.fpsMin < prev.fpsMin - 2) piorou.push(`FPS mínimo: ${prev.fpsMin} → ${contagens.fpsMin}`);
  if (contagens.bundleBytes > prev.bundleBytes * 1.02) piorou.push(`bundle: ${(prev.bundleBytes / 1024).toFixed(0)}KB → ${(contagens.bundleBytes / 1024).toFixed(0)}KB (+${(100 * (contagens.bundleBytes / prev.bundleBytes - 1)).toFixed(1)}%)`);
  for (const k of Object.keys(prev.homeTelas)) {
    if (contagens.homeTelas[k] < prev.homeTelas[k] - 0.05) piorou.push(`altura da home @${k}: ${prev.homeTelas[k]} → ${contagens.homeTelas[k]} telas`);
  }
  for (const p of piorou) achados.push({ tipo: "baseline", sel: "catraca", valor: p, txt: "", onde: "PASSO 2", rota: "baseline" });
  console.log(`\nCATRACA vs baseline: ${piorou.length === 0 ? "estável" : piorou.join(" | ")}`);
}

// ── relatório ────────────────────────────────────────────────────────────────
const ordem = { js: 0, asset4xx: 1, overflow: 2, contraste: 3, opacidade: 4, fps: 5, toque: 6, h1: 7, alt: 8, nome: 9, baseline: 10 };
achados.sort((a, b) => (ordem[a.tipo] ?? 99) - (ordem[b.tipo] ?? 99) || (a.valor > b.valor ? 1 : -1));
const vistos = new Set();
const unicos = achados.filter((a) => { const k = `${a.tipo}|${a.sel}|${a.valor}`; if (vistos.has(k)) return false; vistos.add(k); return true; });

console.log(`\n═══ VERIFY · ${checks} checagens de página · bundle ${(contagens.bundleBytes / 1024).toFixed(0)}KB · FPS min ${contagens.fpsMin} ═══`);
if (unicos.length === 0) {
  console.log("LIMPO — nenhum achado. Código 0.\n");
  process.exit(0);
}
for (const a of unicos) {
  console.log(`[${a.tipo}] ${a.valor}  →  ${a.sel}${a.txt ? '  "' + a.txt.slice(0, 32) + '"' : ""}${a.px ? " @" + a.px + "px" : ""}${a.fg ? " fg:" + a.fg + " bg:" + a.bg : ""}`);
  console.log(`           rota: ${a.rota} · ${a.onde}`);
}
console.log(`\n${unicos.length} achado(s) únicos (de ${achados.length} brutos). Código 1.\n`);
process.exit(1);

#!/usr/bin/env node
/* verify.mjs — Auditoria dupla (Parte 1 técnica) do documento "Auditoria dupla".
 * Mede, nao olha: contraste composto, opacidade herdada, overflow, erros JS/4xx,
 * alvos de toque, hierarquia, alt/dimensões, title/description, hreflang, video.
 * Uso: node scripts/verify.mjs [--base=http://localhost:4173] [--quick]
 * Saida: 0 = sem bloqueadores, 1 = com bloqueadores. imprime valor medido.
 */
import { chromium } from "playwright";

const BASE = (process.argv.find(a => a.startsWith("--base=")) || "--base=http://localhost:4173").split("=")[1];
const QUICK = process.argv.includes("--quick");
const ROUTES = ["", "servicos", "insights", "work", "how-i-work", "about", "contact"];
const LANGS = ["pt", "en"];
const WIDTHS = QUICK ? [1440, 390] : [390, 768, 1440];
const SCROLLS = [0, 0.33, 0.66, 1];

const findings = [];
const blocker = (cat, msg) => { findings.push({ cat, level: "BLOQUEADOR", msg }); };
const info = (cat, msg) => { findings.push({ cat, level: "info", msg }); };

const parseC = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
  const p = m[1].split(",").map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
const lum = (r, g, b) => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a, b) => { const [l1, l2] = [lum(a.r, a.g, a.b), lum(b.r, b.g, b.b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05); };
const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });

// dentro da pagina: cor efetiva do texto (cadeia de opacidade) + fundo composto
const AUDIT_FN = () => {
  const parseC = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
    const p = m[1].split(",").map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const blend = (fg, bg) => ({ r: fg.r * fg.a + bg.r * (1 - fg.a), g: fg.g * fg.a + bg.g * (1 - fg.a), b: fg.b * fg.a + bg.b * (1 - fg.a), a: 1 });
  const out = { texts: [], overflow: document.documentElement.scrollWidth > innerWidth + 1,
    h1: document.querySelectorAll("h1").length,
    headings: [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(h => +h.tagName[1]),
    imgs: [...document.querySelectorAll("img")].map(i => ({ src: (i.getAttribute("src") || "").slice(0, 60),
      alt: i.getAttribute("alt"), w: i.getAttribute("width"), h: i.getAttribute("height"),
      aria: i.getAttribute("aria-hidden") === "true" })),
    links: [...document.querySelectorAll("a:not([aria-hidden='true']),button:not([aria-hidden='true'])")]
      .filter(e => e.offsetHeight > 0 && e.offsetWidth > 0)
      .map(e => { const r = e.getBoundingClientRect();
        return { t: (e.innerText || e.getAttribute("aria-label") || "").trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) }; }),
    videos: document.querySelectorAll("video").length,
    title: document.title, desc: (document.querySelector('meta[name="description"]') || {}).content || null,
    htmlLang: document.documentElement.lang };
  const hasVideoAncestor = (el) => { let n = el;
    while (n && n !== document.body) { if (n.querySelector?.("video") && n.tagName !== "BODY") return true;
      if (n.tagName === "VIDEO") return true; n = n.parentElement; } return false; };
  const els = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6,p,span,a,button,li,label,strong,em,time,summary")]
    .filter(el => { if (!el.childNodes.length) return false;
      const direct = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const r = el.getBoundingClientRect();
      return direct && r.height > 0 && r.width > 0 && r.top >= 0 && r.top < innerHeight && r.bottom > 0; });
  for (const el of els) {
    const cs = getComputedStyle(el);
    let col = parseC(cs.color); if (!col) continue;
    let op = 1; let n = el;
    while (n && n !== document.documentElement) { op *= parseFloat(getComputedStyle(n).opacity || "1"); n = n.parentElement; }
    // fundo composto: sobe ate achar opaco
    let bg = null; n = el.parentElement;
    while (n && n !== document.documentElement) { const b = parseC(getComputedStyle(n).backgroundColor);
      if (b && b.a >= 0.999) { bg = b; break; } n = n.parentElement; }
    if (!bg) { const rb = parseC(getComputedStyle(document.body).backgroundColor);
      bg = rb && rb.a > 0 ? rb : { r: 245, g: 242, b: 237, a: 1 }; }
    const effCol = op < 1 ? blend({ ...col, a: op }, bg) : { ...col, a: col.a };
    const c1 = blend(effCol, bg); // cor efetiva do texto composta sobre o fundo
    out.texts.push({ txt: el.innerText.trim().slice(0, 28), cls: (el.className || el.tagName).toString().slice(0, 40),
      fs: parseFloat(cs.fontSize), fw: cs.fontWeight, overVideo: hasVideoAncestor(el),
      eff: Math.round(op * 100) / 100, ratio: null });
    const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    const lum = 0.2126 * f(c1.r) + 0.7152 * f(c1.g) + 0.0722 * f(c1.b);
    const fl = 0.2126 * f(bg.r) + 0.7152 * f(bg.g) + 0.0722 * f(bg.b);
    out.texts[out.texts.length - 1].ratio = Math.round(((Math.max(lum, fl) + 0.05) / (Math.min(lum, fl) + 0.05)) * 100) / 100;
  }
  return out;
};

const browser = await chromium.launch();
const titles = {};
for (const lang of LANGS) {
  for (const vw of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: vw === 390 ? 844 : 900 } });
    for (const route of ROUTES) {
      const url = `${BASE}/${lang}${route ? "/" + route : ""}`;
      const pg = await ctx.newPage();
      const errs = []; const bad = [];
      pg.on("console", m => {
        // localhost/copy: "Failed to load resource" sao os 404s de plataforma do SDK
        // (ja contados na categoria 4xx com allowlist documentada). Contra o dominio
        // oficial nada e filtrado. Excessoes de SCRIPT continuam contando sempre.
        const txt = m.text();
        if (m.type() === "error" && !(BASE.includes("localhost") &&
            (txt.startsWith("Failed to load resource") || txt.startsWith("App state check failed")))) errs.push(txt.slice(0, 90));
      });
      pg.on("response", r => {
        // Endpoints da PLATAFORMA que o SDK chama (nao sao do site). Medidos no
        // oficial 18/09: /analytics/track/batch responde 405 (existe). Na copy
        // local respondem 404 porque a copy nao tem analytics/logs habilitados
        // — ruido de ambiente, nao achado do site.
        if (r.url().includes("/analytics/track/") || r.url().includes("/log-user-in-app/") || r.url().includes("/prod/public-settings/")) return;
        if (r.status() >= 400 && r.request().resourceType() !== "manifest") bad.push(`${r.status()} ${r.url().slice(-52)}`);
      });
      try {
        await pg.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        await pg.waitForTimeout(2200);
        const auditAt = async (scrollFrac) => {
          await pg.evaluate(f => window.scrollTo(0, (document.body.scrollHeight - innerHeight) * f), scrollFrac);
          await pg.waitForTimeout(850);
          return pg.evaluate(AUDIT_FN);
        };
        let first = null;
        for (const sf of SCROLLS) {
          const a = await auditAt(sf);
          if (sf === 0) first = a;
          if (a.overflow) blocker("overflow", `${lang}/${route} @${vw}px scroll ${sf}: overflow-x scrollWidth=${await pg.evaluate(() => document.documentElement.scrollWidth)} > viewport=${vw}`);
        }
        if (errs.length) blocker("js", `${lang}/${route} @${vw}: ${errs.length} erro(s) JS — primeiro: "${errs[0]}"`);
        if (bad.length) blocker("4xx", `${lang}/${route} @${vw}: ${bad.length} resposta(s) >=400 — ${bad[0]}`);
        if (first) {
          if (first.h1 !== 1) blocker("h1", `${lang}/${route} @${vw}: ${first.h1} h1 na página (esperado 1)`);
          for (let i = 1; i < first.headings.length; i++) if (first.headings[i] - first.headings[i - 1] > 1)
            info("hierarquia", `${lang}/${route} @${vw}: salto h${first.headings[i - 1]}→h${first.headings[i]}`);
          for (const im of first.imgs) if (!im.alt && !im.aria) blocker("alt", `${lang}/${route} @${vw}: img sem alt — src="${im.src}"`);
          const key = first.title;
          if (titles[key] && titles[key] !== `${lang}/${route}`)
            blocker("title", `title duplicado: "${key.slice(0, 40)}" em ${titles[key]} e ${lang}/${route}`);
          titles[key] = `${lang}/${route}`;
          if (!first.desc) info("meta", `${lang}/${route}: sem meta description`);
          if (first.htmlLang && !first.htmlLang.startsWith(lang))
            blocker("lang", `${lang}/${route}: html lang="${first.htmlLang}"`);
          if (vw === 390) for (const l of first.links)
            if (l.w < 24 || l.h < 24) blocker("toque", `${lang}/${route}: alvo <24px (${Math.round(l.w)}x${Math.round(l.h)}) — "${l.t}"`);
          for (const t of first.texts) {
            const big = t.fs >= 24 || (t.fs >= 18.7 && +t.fw >= 700);
            if (t.overVideo) continue;
            if (t.eff >= 0.06 && t.eff < 0.80)
              info("opacidade", `${lang}/${route} @${vw}: texto estático com opacidade efetiva ${t.eff} — "${t.txt}" (${t.cls})`);
            if (t.ratio !== null && t.ratio < (big ? 3 : 4.5) && t.eff >= 0.06)
              blocker("contraste", `${lang}/${route} @${vw}: ${t.ratio}:1 (<${big ? 3 : 4.5}) ${Math.round(t.fs)}px — "${t.txt}" (${t.cls})`);
          }
        }
      } catch (e) { blocker("carga", `${lang}/${route} @${vw}: ${String(e).slice(0, 80)}`); }
      await pg.close();
    }
    await ctx.close();
  }
}
// video sob demanda: home carrega so o hero
{
  const pg = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  const vids = [];
  pg.on("response", r => { if (r.url().endsWith(".mp4") || r.url().includes(".webm")) vids.push(r.url().split("/").pop()); });
  await pg.goto(`${BASE}/pt`, { waitUntil: "domcontentloaded" });
  await pg.waitForTimeout(4000);
  if (vids.length > 1) info("video", `home carrega ${vids.length} vídeos no load inicial: ${vids.join(", ")}`);
  await pg.close();
}
await browser.close();

const blockers = findings.filter(f => f.level === "BLOQUEADOR");
const infos = findings.filter(f => f.level === "info");
for (const f of blockers) console.log(`[BLOQUEADOR] ${f.cat}: ${f.msg}`);
for (const f of infos) console.log(`[info] ${f.cat}: ${f.msg}`);
console.log(`\nverify: ${blockers.length} bloqueador(es), ${infos.length} info — ${BASE}`);
process.exit(blockers.length ? 1 : 0);

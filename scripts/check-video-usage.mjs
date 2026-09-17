#!/usr/bin/env node
/**
 * Lint de uso de vídeos — roda no prebuild (npm run build) e aborta
 * se qualquer mídia ultrapassar o limite de VIDEO_USE_LIMIT (src/lib/site.js).
 * Conta usos REAIS: resolve as constantes (CORTE_GIF, NAV_MEDIA.* etc.)
 * para os arquivos e conta as referências no código.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const site = fs.readFileSync(path.join(SRC, "lib", "site.js"), "utf-8");

// 1. limite por arquivo
const limitBlock = site.match(/export const VIDEO_USE_LIMIT = (\{[\s\S]*?\n\});/);
if (!limitBlock) { console.error("❌ VIDEO_USE_LIMIT não encontrado em src/lib/site.js"); process.exit(1); }
const LIMITS = eval(`(${limitBlock[1]})`);

// 2. símbolos -> URL: constantes simples export const X = "/art/y.mp4"
const symbols = {}; // "CORTE_GIF" -> "/art/corte.mp4"
for (const m of site.matchAll(/export const ([A-Z_0-9]+) = "(\/[^"]+\.mp4)";/g)) symbols[m[1]] = m[2];

// 3. NAV_MEDIA -> símbolos NAV_MEDIA.solutions.gestao etc.
const navBlock = site.match(/export const NAV_MEDIA = (\{[\s\S]*?\n\});/);
if (navBlock) {
  let ctx = "";
  for (const line of navBlock[1].split("\n")) {
    if (/solutions\s*:\s*\{/.test(line)) { ctx = "solutions."; continue; }
    if (ctx && /^\s*\}/.test(line)) { ctx = ""; continue; }
    const m = line.match(/([a-zA-Z]+)\s*:\s*"(\/[^"]+\.mp4)"/);
    if (m) symbols[`NAV_MEDIA.${ctx}${m[1]}`] = m[2];
  }
}

// 4. conta referências em src/ (exceto site.js, que só define)
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(js|jsx)$/.test(e.name) && !p.endsWith("lib/site.js")) files.push(p);
  }
})(SRC);

const usage = {};
const stripImports = (c) =>
  c.split("\n")
    .filter((l) => !/^\s*import\b/.test(l))          // linhas "import ..."
    .filter((l) => !/^\s*[A-Z_0-9]+\s*(,|as\b)\s*$/.test(l) && !/^\s*}\s*from\s/.test(l)) // membros de import
    .join("\n");
for (const f of files) {
  const c = stripImports(fs.readFileSync(f, "utf-8"));
  for (const [sym, url] of Object.entries(symbols)) {
    const re = new RegExp(sym.replace(/\./g, "\\.") + "\\b", "g");
    const n = (c.match(re) || []).length;
    if (n) usage[url] = (usage[url] || 0) + n;
  }
}

// 5. valida
let fail = false;
console.log("── Lint de uso de vídeos (limite por arquivo) ──");
for (const [url, limit] of Object.entries(LIMITS)) {
  const n = usage["/" + url] || 0;
  if (n > limit) { fail = true; console.error(`❌ ${url}: ${n} usos > limite ${limit}`); }
}
for (const [url, n] of Object.entries(usage)) {
  const key = url.replace(/^\//, "");
  if (!(key in LIMITS)) { fail = true; console.error(`❌ ${key}: ${n} usos — SEM REGISTRO no VIDEO_USE_LIMIT`); }
}
const reported = new Set(Object.entries(usage).map(([u]) => u.replace(/^\//, "")));
for (const [k] of Object.entries(LIMITS)) if (!reported.has(k)) console.log(`ℹ️  ${k}: 0 usos (reserva)`);
if (fail) { console.error("\n❌ DEPLOY ABORTADO: mídia fora do limite."); process.exit(1); }
console.log("✅ Todos os vídeos dentro dos limites.");

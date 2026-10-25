import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/* Sincronia da cortina de rota com a entrada da página (Eduardo, 25/10,
   revisão Codex): (1) o M termina de sair ANTES da cobertura perder os
   cantos; (2) a espera de conteúdo não tem teto cego — revela com o
   conteúdo ou cai no fallback de 2s já existente. */
const src = readFileSync(new URL('../src/components/layout/TransitionCurtain.jsx', import.meta.url), 'utf8');

/* power3.inOut do GSAP (Power3.easeInOut) — usado pelo círculo */
const pow3InOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
/* inversa da power3.inOut (ramo >= 0.5): dado o valor eased, o t */
const invPow3InOut = (y) => 1 - Math.cbrt(2 * (1 - y)) / 2;
/* quando o círculo (200vmax, scale 1->0) descobre o canto do viewport */
const tCornerMs = (vw, vh, durMs) => {
  const cornerDist = Math.hypot(vw / 2, vh / 2);
  const sClear = cornerDist / Math.max(vw, vh); /* raio = vmax * scale */
  return invPow3InOut(sClear) * durMs;
};

/* durações reais lidas da fonte (não hardcode) */
const durCircle = parseFloat(src.match(/to\(circle, \{ scale: 0, duration: ([\d.]+)/)[1]) * 1000;
const durM = parseFloat(src.match(/to\(m, \{ opacity: 0, scale: [\d.]+, duration: ([\d.]+)/)[1]) * 1000;

test('revelação espera o conteúdo commitado SEM teto cego (revisão Codex 2)', () => {
  assert.match(src, /if \(!document\.querySelector\("\.mf-route-load"\)\) return resolve\(true\)/, 'única via de liberação: suspense ausente');
  assert.doesNotMatch(src, /t0 > 400|400\)\)/, 'nenhum teto que libere com suspense na tela');
  assert.match(src, /revealSeq\.current !== seq \|\| !busy\.current\) return resolve\(false\)/, 'aborto cancelável por nova rota/unmount/fallback');
  assert.match(src, /if \(!go\) return;/, 'aborto não revela');
});

test('M termina de sair ANTES da cobertura perder os cantos (revisão Codex 1)', () => {
  assert.match(src, /to\(m, \{ opacity: 0[^}]*\}, 0\)/, 'fade do M começa em 0');
  assert.match(src, /to\(circle, \{ scale: 0[^}]*\}, 0\)/, 'círculo começa em 0');
  const viewports = [[1440, 900], [390, 844], [320, 568]];
  for (const [vw, vh] of viewports) {
    const tc = tCornerMs(vw, vh, durCircle);
    assert.ok(durM + 25 <= tc, `M (${durM}ms) precisa sumir 25ms antes dos cantos (${tc.toFixed(1)}ms) em ${vw}x${vh}`);
  }
  /* sanidade da matemática: power3.inOut é simétrica e monotônica */
  assert.ok(Math.abs(pow3InOut(invPow3InOut(0.75)) - 0.75) < 1e-9);
  assert.ok(invPow3InOut(0.55) > 0.5 && invPow3InOut(0.95) < 1);
});

test('fallback 2s, reduced-motion, rapid-click, popstate e cleanup preservados', () => {
  assert.match(src, /}, 2000\)/, 'fallback de segurança 2s mantido');
  assert.match(src, /stopImmediatePropagation/, 'captura do clique do Link mantida');
  assert.match(src, /pendingHref\.current = href;/, 'redirect de clique rápido mantido');
  assert.match(src, /prefers-reduced-motion/, 'reduced-motion respeitado');
  assert.match(src, /hardCleanup\(el\)/, 'hard-reset de unmount/fallback mantido');
  const waitIdx = src.indexOf('waitReady.then((go)');
  const clearIdx = src.indexOf('clearTimeout(fallback.current);', waitIdx);
  assert.ok(clearIdx > waitIdx, 'clearTimeout do fallback deve ficar após a espera (fallback vivo durante ela)');
});

test('saída da cobertura permanece breve (filete termina junto com os painéis)', () => {
  assert.doesNotMatch(src, /duration: 0\.42, ease: "expo\.inOut"/, 'saída de 420ms era o "demora a sair"');
  assert.match(src, /to\(pL, \{ xPercent: -101, duration: 0\.3/);
  assert.match(src, /to\(seam, \{ scaleY: 0, duration: 0\.18, ease: "power2\.in" \}, 0\.12\)/, 'filete termina junto (0.12+0.18=0.30)');
});

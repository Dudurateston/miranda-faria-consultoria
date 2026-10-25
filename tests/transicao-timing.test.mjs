import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

/* Sincronia da cortina de rota com a entrada da página (Eduardo, 25/10:
   "ela está um pouco fora do tempo" — os DOIS sintomas: página aparece
   antes e M/cobertura demora a sair). Invariantes do ajuste de tempo. */
const read = () => readFileSync(new URL('../src/components/layout/TransitionCurtain.jsx', import.meta.url), 'utf8');
const src = read();

test('revelação espera o conteúdo commitado antes de revelar (sem liberação prematura)', () => {
  assert.match(src, /mf-route-load/, 'deve consultar o fallback Suspense');
  assert.match(src, /performance\.now\(\) - t0 > 400/, 'espera precisa ter teto curto (400ms)');
  assert.match(src, /revealSeq\.current !== seq/, 'espera precisa ser cancelável por nova rota');
  assert.match(src, /if \(!go\) return;/, 'aborto não pode revelar');
});

test('a marca sai junto com a cobertura — gesto único, sem M sobrando no conteúdo', () => {
  /* copper: o M não pode mais sair DEPOIS da cobertura começar a
     retrair (era hold 150ms + fade separado sobre página já visível) */
  assert.doesNotMatch(src, /\}, 0\.15\)/, 'M não pode ter hold de 150ms pós-navigate');
  assert.match(src, /to\(m, \{ opacity: 0, scale: 0\.94, duration: 0\.24/, 'M sai em 240ms a partir do início');
  assert.match(src, /to\(circle, \{ scale: 0, duration: 0\.3/, 'círculo sai em 300ms no mesmo início (posição 0)');
  /* split: painéis e filete concluem juntos, breves */
  assert.doesNotMatch(src, /duration: 0\.42, ease: "expo\.inOut"/, 'saída de 420ms era o "demora a sair"');
  assert.match(src, /to\(pL, \{ xPercent: -101, duration: 0\.3/);
  assert.match(src, /to\(seam, \{ scaleY: 0, duration: 0\.18, ease: "power2\.in" \}, 0\.12\)/, 'filete termina junto (0.12+0.18=0.30)');
});

test('fallback de 2s, reduced-motion, rapid-click, popstate e cleanup seguem preservados', () => {
  assert.match(src, /}, 2000\)/, 'fallback de segurança 2s mantido');
  assert.match(src, /stopImmediatePropagation/, 'captura do clique do Link mantida');
  assert.match(src, /pendingHref\.current = href;/, 'redirect de clique rápido mantido');
  assert.match(src, /prefers-reduced-motion/, 'reduced-motion respeitado');
  assert.match(src, /hardCleanup\(el\)/, 'hard-reset de unmount/fallback mantido');
  /* o fallback só é limpo DEPOIS da espera de conteúdo resolver — se a
     rota lazy engolir a espera, o fallback continua vivo como segurança */
  const waitIdx = src.indexOf('waitReady.then((go)');
  const clearIdx = src.indexOf('clearTimeout(fallback.current);', waitIdx);
  assert.ok(clearIdx > waitIdx, 'clearTimeout do fallback deve ficar após a espera');
});

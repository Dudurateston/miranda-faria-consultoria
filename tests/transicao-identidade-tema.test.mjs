import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const s = readFileSync(new URL('../src/components/layout/TransitionCurtain.jsx', import.meta.url), 'utf8');

test('curtain frames the clean official logo reference without tracing or recolouring', () => {
  assert.match(s, /href="\/art\/mf-lockup-official\.png"/);
  assert.match(s, /viewBox="36 36 306 350"/);
  assert.equal(createHash('sha256').update(readFileSync(new URL('../public/art/mf-lockup-official.png', import.meta.url))).digest('hex'), 'dcc21431149b1aa39b3c9ec4a2de9fc2a6803af6d2e062ab36a4a2422d11261e');
  assert.doesNotMatch(s, /M_LOGO_BONE/);
  assert.match(s, /mf-curtain__brand/);
  assert.match(s, /place-items:center/);
  assert.doesNotMatch(s, /translate:-50% -52%/);
});

test('split curtain follows the active site skin instead of forcing light bone', () => {
  assert.doesNotMatch(s, /className="mf-curtain" data-theme="dark"/);
  assert.match(s, /background:var\(--bg-light, #F5F1EA\)/);
});

test('logo and theme adjustments preserve the approved timing and safeguards', () => {
  assert.match(s, /opacity: 0, scale: 0\.94, duration: 0\.1/);
  assert.match(s, /scale: 0, duration: 0\.3/);
  assert.match(s, /prefers-reduced-motion/);
  assert.match(s, /}, 2000\)/);
});

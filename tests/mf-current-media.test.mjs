import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { getCasePresentation, getCasePreviewMedia } from '../src/content/casePresentation.js';

const sha256 = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');

const EXPECTED = {
  '/work/miranda-faria/current-home.webp': { w: 1440, h: 900, sha: 'effb1d94409db444d2f977e105b043c7741408fe9fc150bea283dab45291322f' },
  '/work/miranda-faria/current-services.webp': { w: 1440, h: 1452, sha: 'a02aa1317bfd359371583257fc66fd668b03b61b6357157f1edb2e91e2c8f080' },
  '/work/miranda-faria/current-mobile.webp': { w: 780, h: 1688, sha: '7b235a79f2216d435f7a1888be44c7aaf953060d6cb62f49bfdf23b43dfb34ab' },
};
const LEGACY = ['01.webp', '02.webp', '03.webp', '04.webp', '05.webp', 'video.mp4', 'poster.webp'];

test('miranda-faria presentation uses only the current captures, with intact hashes and provenance', () => {
  for (const lang of ['pt', 'en']) {
    const p = getCasePresentation('miranda-faria', lang);
    assert.ok(p, `miranda-faria/${lang}`);
    assert.equal(p.media.length, 3);
    const srcs = p.media.map(m => m.src);
    for (const s of srcs) {
      assert.ok(EXPECTED[s], `midia inesperada: ${s}`);
      const file = new URL('../public' + s, import.meta.url);
      assert.ok(existsSync(file), `arquivo ausente: ${s}`);
      assert.equal(sha256(file), EXPECTED[s].sha, `hash divergente: ${s}`);
    }
    for (const m of p.media) {
      assert.ok(m.width > 0 && m.height > 0);
      assert.equal(m.width, EXPECTED[m.src].w, `largura: ${m.src}`);
      assert.equal(m.height, EXPECTED[m.src].h, `altura: ${m.src}`);
      assert.ok(m.alt && m.caption, 'alt/caption');
      assert.ok(m.capture?.url && m.capture?.viewport && m.capture?.source, 'proveniencia');
      assert.equal(m.capture.sha256, EXPECTED[m.src].sha, 'sha256 da fixture');
    }
    for (const leg of LEGACY) {
      assert.ok(!srcs.some(s => s.endsWith(leg)), `legado exposto na apresentacao: ${leg} (${lang})`);
      assert.ok(!p.media.some(m => m.poster?.endsWith(leg)), `poster legado: ${leg} (${lang})`);
    }
    assert.equal(p.leadMedia, 'miranda-faria-current-home');
      assert.equal(p.delivery, lang === 'en' ? 'Bilingual company website' : 'Site institucional bilíngue');
  }
});

test('miranda-faria mobile media renders at 390 CSS px in a mobile chapter, dimensions match', () => {
  const p = getCasePresentation('miranda-faria', 'pt');
  const mob = p.media.find(m => m.id === 'miranda-faria-current-mobile');
  assert.equal(mob.displayWidth, 390);
  assert.equal(mob.width, 780);
  const ch = p.chapters.find(c => c.id === 'mobile');
  assert.equal(ch.layout, 'mobile');
  const titulos = p.chapters.map(c => c.title).filter(Boolean);
  assert.equal(new Set(titulos).size, titulos.length, 'titulos de capitulos repetidos');
});

test('menu preview for miranda-faria is the new hero image, not legacy media', () => {
  const preview = getCasePreviewMedia('miranda-faria');
  assert.equal(preview?.type, 'image');
  assert.equal(preview?.src, '/work/miranda-faria/current-home.webp');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { getCasePresentation, getCasePreviewMedia } from '../src/content/casePresentation.js';

const sha256 = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');

const EXPECTED = {
  '/work/miranda-faria/current-home.webp': { w: 1440, h: 900, sha: 'afafc27f60e784099db28d2f033aa9713a9fb397daffbab582fbf9883d4e1c81' },
  '/work/miranda-faria/current-services.webp': { w: 1440, h: 857, sha: 'b97e6c971abdfffbe537bf9dac9ee1b558006a78ecdea8993ca87f3ba113077b' },
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
  }
});

test('menu preview for miranda-faria is the new hero image, not legacy media', () => {
  const preview = getCasePreviewMedia('miranda-faria');
  assert.equal(preview?.type, 'image');
  assert.equal(preview?.src, '/work/miranda-faria/current-home.webp');
});

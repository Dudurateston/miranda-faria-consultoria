import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { getCasePresentation } from '../src/content/casePresentation.js';
const manifest = JSON.parse(readFileSync(new URL('./fixtures/contextual-media.json', import.meta.url)));

test('selected contextual media matches its immutable provenance and real dimensions', () => {
  for (const m of manifest) {
    const b = readFileSync(new URL('../public' + m.path, import.meta.url));
    assert.equal(createHash('sha256').update(b).digest('hex'), m.sha256, m.path);
    assert.ok(m.sourceUrl.startsWith('https://'));
    assert.ok(m.width > 0 && m.height > 0);
    if (m.path.endsWith('.mp4')) {
      assert.equal(m.codec, 'h264'); assert.equal(m.pixelFormat, 'yuv420p');
      assert.ok(m.duration > 0 && m.duration <= 8);
      assert.ok(m.bytes < 1600000);
      assert.ok(b.indexOf(Buffer.from('moov')) < b.indexOf(Buffer.from('mdat')));
    }
  }
  for (const slug of ['rota-forte','motormoura','1000-pecas','queijos-serra','paulo-henrique']) {
    const p = getCasePresentation(slug);
    for (const media of p.media.filter(m => m.src.includes('/context-'))) {
      const m = manifest.find(item => item.path === media.src);
      assert.ok(m, media.src);
      assert.deepEqual([media.width, media.height], [m.width, m.height]);
      if (media.type === 'video') {
        assert.ok(manifest.some(item => item.path === media.poster));
        assert.ok(Math.abs(media.duration - m.duration) < .1);
      }
    }
  }
});

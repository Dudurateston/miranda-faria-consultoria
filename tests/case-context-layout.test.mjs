import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cases } from '../src/content/copy.js';
import { getCasePresentation } from '../src/content/casePresentation.js';

test('each case pairs its story with contextual media, without repeating assets', () => {
  for (const lang of ['pt', 'en']) for (const item of cases[lang]) {
    const p = getCasePresentation(item.slug, lang);
    assert.ok(Array.isArray(p.leadSections), item.slug);
    const sections = [...p.leadSections, ...p.chapters.flatMap(c => c.sections)];
    assert.deepEqual(sections.slice().sort(), ['decisions', 'impact', 'problem', 'process']);
    const displayed = [p.leadMedia, ...p.chapters.flatMap(c => c.media)];
    assert.deepEqual(displayed.slice().sort(), p.media.map(m => m.id).sort());
    for (const row of p.chapters) {
      assert.ok(row.sections.length && row.media.length, `${item.slug}/${row.id}: no detached story or empty media column`);
      assert.equal(row.contextual, true);
    }
    if (p.media.length === 1) assert.equal(p.leadSections.length, 4);
  }
});

test('case players prepare near the viewport and only one case player plays at a time', () => {
  const s = readFileSync(new URL('../src/components/CaseShowcase.jsx', import.meta.url), 'utf8');
  assert.match(s, /rootMargin: ['"]400px['"]/);
  assert.match(s, /saveData/);
  assert.match(s, /data-case-player/);
  assert.match(s, /other\.pause\(\)/);
  assert.doesNotMatch(s, /intersectionRatio >= \.15/);
});

test('decorative loops pause when offscreen, hidden or motion is reduced', () => {
  const s = readFileSync(new URL('../src/components/AutoVideo.jsx', import.meta.url), 'utf8');
  assert.match(s, /video\.pause\(\)/);
  assert.match(s, /visibilitychange/);
  assert.match(s, /prefers-reduced-motion/);
});

test('mobile boards keep original files and dimensions, with a bounded presentation viewport', () => {
  for (const slug of ['uaiso-travel', 'sevalho-controladoria', 'vaf-global', 'advogados-lco']) {
    const p = getCasePresentation(slug);
    const m = p.media.find(m => m.frame);
    assert.ok(m, slug);
    assert.ok(m.src.endsWith('/03.webp'));
    assert.deepEqual([m.width, m.height], [1600, 900]);
    assert.ok(m.frame.x >= 0 && m.frame.y >= 0);
    assert.ok(m.frame.x + m.frame.width <= m.width);
    assert.ok(m.frame.y + m.frame.height <= m.height);
  }
});

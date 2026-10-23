import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getCasePresentation } from '../src/content/casePresentation.js';

const fixturePath = new URL('./fixtures/case-media-baseline.json',import.meta.url);
const baseline = existsSync(fixturePath) ? JSON.parse(readFileSync(fixturePath,'utf8')) : null;
const root = process.env.CASE_ASSET_ROOT || fileURLToPath(new URL('../public',import.meta.url));
const localPublic = fileURLToPath(new URL('../public',import.meta.url));
const blobSha = data => createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');
const readAsset = path => readFileSync(join(baseline?.derived?.[path] ? localPublic : root,path));

test('all protected studio media retain the original Git blob hashes',()=>{
  assert.ok(baseline, 'recorded media baseline exists');
  assert.equal(baseline.base,'e80062d6729c019d4fc4fd87203ea8a4a0835407');
  for(const [path,sha] of Object.entries(baseline.protected)) {
    assert.equal(blobSha(readFileSync(join(root,path))),sha,path);
  }
});

test('every pilot image, poster and video has an identified source and exact hash',()=>{
  assert.ok(baseline,'recorded media baseline exists');
  for(const slug of ['rota-forte','motormoura','1000-pecas','roda-agro-marca','advogados-lco']) {
    const p=getCasePresentation(slug,'pt');
    for(const m of p.media) for(const src of [m.src,m.poster].filter(Boolean)) {
      const path=src.replace(/^\//,'');
      const sha=baseline.pilots[path] || baseline.derived?.[path]?.sha;
      assert.ok(sha,path);
      assert.equal(blobSha(readAsset(path)),sha,path);
    }
  }
});

test('archived Rota poster keeps its real frame provenance after current media is added',()=>{
  const provenance=baseline.derived?.['work/rota-forte/video-poster.webp'];
  assert.ok(provenance,'frame provenance recorded');
  assert.equal(provenance.source,'work/rota-forte/video.mp4');
  assert.equal(blobSha(readAsset(provenance.source)),provenance.sourceSha);
  assert.deepEqual([provenance.width,provenance.height,provenance.seconds],[1080,608,2.5]);
});


test('current case media uses documented real captures and edited sources, with no rejected TKA',()=>{
  const captured=JSON.parse(readFileSync(new URL('./fixtures/current-case-media.json',import.meta.url),'utf8'));
  assert.equal(captured.length,9);
  for(const m of captured){
    assert.equal(createHash('sha256').update(readFileSync(join(localPublic,m.path))).digest('hex'),m.sha256,m.path);
    assert.ok(m.source && m.sourceSha256);
    assert.doesNotMatch(m.source,/tka|full/i);
  }
  for(const slug of ['rota-forte','motormoura','1000-pecas']) {
    const p=getCasePresentation(slug,'pt');
    assert.ok(p.editorial && p.delivery && p.headings);
    assert.ok(p.media.every(m=>m.src.includes('/current-')));
    const video=p.media.find(m=>m.type==='video');
    assert.equal(video.poster,`/work/${slug}/current-home.webp`);
    assert.deepEqual([video.width,video.height],[1440,900]);
  }
});

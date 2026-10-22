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
const blobSha = data => createHash('sha1').update(`blob ${data.length}\0`).update(data).digest('hex');

test('all protected studio media retain the original Git blob hashes',()=>{
  assert.ok(baseline, 'recorded media baseline exists');
  assert.equal(baseline.base,'e80062d6729c019d4fc4fd87203ea8a4a0835407');
  for(const [path,sha] of Object.entries(baseline.protected)) {
    assert.equal(blobSha(readFileSync(join(root,path))),sha,path);
  }
});

test('every pilot image, poster and video uses an existing unchanged original',()=>{
  assert.ok(baseline,'recorded media baseline exists');
  for(const slug of ['rota-forte','roda-agro-marca','advogados-lco']) {
    const p=getCasePresentation(slug,'pt');
    for(const m of p.media) for(const src of [m.src,m.poster].filter(Boolean)) {
      const path=src.replace(/^\//,'');
      assert.ok(baseline.pilots[path],path);
      assert.equal(blobSha(readFileSync(join(root,path))),baseline.pilots[path],path);
    }
  }
});

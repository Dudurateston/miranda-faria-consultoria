import test from 'node:test';
import assert from 'node:assert/strict';
import * as config from '../src/content/casePresentation.js';
test('work dropdown uses the current media selected for the actual case',()=>{
 assert.equal(typeof config.getCasePreviewMedia,'function');
 const p=config.getCasePreviewMedia('rota-forte');assert.equal(p.src,'/work/rota-forte/context-frota.mp4');assert.equal(p.poster,'/work/rota-forte/context-frota-poster.webp');
 const m=config.getCasePreviewMedia('motormoura');assert.equal(m.src,'/work/motormoura/context-quotation.mp4');
 assert.equal(config.getCasePreviewMedia('not-a-case'),null);
});

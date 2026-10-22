import test from 'node:test';
import assert from 'node:assert/strict';
import { practices } from '../src/content/copy.js';

test('design sells identity and applications while generative media remains identified',()=>{
  for(const lang of ['pt','en']) {
    const p=practices[lang].design;
    const marketing=[p.lead,p.intro,p.gen.label,p.gen.title,p.gen.desc,...p.deliverables.flatMap(d=>[d.t,d.d])].join(' ');
    assert.ok(!/\b(IA|AI)\b/.test(marketing),`${lang} design focuses on the delivery`);
    assert.match(p.gen.capB,/\b(IA|AI)\b/);
    assert.equal(p.deliverables.length,4);
    assert.ok(!/mesma mão|same hand|one person/.test(p.proofs.join(' ')));
  }
});

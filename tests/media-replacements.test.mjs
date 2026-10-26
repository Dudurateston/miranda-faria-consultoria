import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { getCasePresentation } from '../src/content/casePresentation.js';
const source=JSON.parse(readFileSync(new URL('./fixtures/media-replacements.json',import.meta.url)));

test('MotorMoura identity uses the exact vector supplied by Eduardo beside The project',()=>{
 for(const lang of ['pt','en']) {
  const p=getCasePresentation('motormoura-marca',lang);
  const image=p.media.find(m=>m.id==='motormoura-marca-2');
  assert.equal(image.src,'/work/motormoura-marca/logo-original.svg');
  assert.deepEqual([image.width,image.height],[6611,2537.469833119385]);
  assert.ok(p.chapters.find(c=>c.sections.includes('problem')).media.includes(image.id));
  assert.deepEqual(p.media.filter(m=>m.id!==image.id).map(m=>m.src),['/work/motormoura-marca/01.webp','/work/motormoura-marca/03.webp']);
  assert.doesNotMatch(p.delivery,/bilíngue|Bilingual/);
 }
 const b=readFileSync(new URL('../public/'+source.motorMoura.file.replace(/^public\//,''),import.meta.url));
 assert.equal(createHash('sha256').update(b).digest('hex'),source.motorMoura.sha256);
 assert.doesNotMatch(b.toString(),/<script\b|<foreignObject\b|\son[a-z]+\s*=/i);
});

test('Roda uses a local original campaign post as a prominent link to the exact managed profile',()=>{
 for(const lang of ['pt','en']) {
  const p=getCasePresentation('roda-agro-marca',lang);
  assert.equal(p.social.href,'https://www.instagram.com/rodaagropiumhi/');
  assert.equal(p.social.image.src,'/work/roda-agro-marca/instagram-programacao.jpg');
  assert.deepEqual([p.social.image.width,p.social.image.height],[516,640]);
  assert.ok(p.social.image.alt && p.social.credit && p.social.label);
 }
 const b=readFileSync(new URL('../public/work/roda-agro-marca/instagram-programacao.jpg',import.meta.url));
 assert.equal(createHash('sha256').update(b).digest('hex'),source.roda.sha256);
 const jsx=readFileSync(new URL('../src/components/CaseShowcase.jsx',import.meta.url),'utf8');
 assert.match(jsx,/<a href=\{presentation\.social\.href\}[^>]+>[\s\S]*?presentation\.social\.image[\s\S]*?<img/);
 assert.match(jsx,/mf-cs__social--image/);
 assert.doesNotMatch(jsx,/<iframe[^>]*instagram/i);
});

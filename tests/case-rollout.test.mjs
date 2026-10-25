import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {cases} from '../src/content/copy.js';
import {getCasePresentation} from '../src/content/casePresentation.js';
test('all fourteen cases use the narrative gallery in both languages',()=>{
 for(const lang of ['pt','en'])for(const item of cases[lang]){
  const p=getCasePresentation(item.slug,lang);assert.ok(p,`${item.slug}/${lang}`);
  const ids=p.media.map(m=>m.id);assert.equal(ids.length,new Set(ids).size);
  assert.deepEqual([p.leadMedia,...p.chapters.flatMap(c=>c.media)].sort(),ids.slice().sort());
  assert.deepEqual(['problem',...p.chapters.flatMap(c=>c.sections)].sort(),['decisions','impact','problem','process']);
  for(const m of p.media){assert.ok(existsSync(new URL('../public'+m.src,import.meta.url)));assert.ok(m.width>0&&m.height>0);assert.ok(m.alt&&m.caption);}
 }
 assert.equal(getCasePresentation('missing'),null);
});

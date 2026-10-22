import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import * as content from '../src/content/copy.js';
const expected=JSON.parse(readFileSync(new URL('./fixtures/case-invariants.json',import.meta.url),'utf8'));
test('content strings do not use prose dashes',()=>{
  const bad=[];const seen=new Set();
  function walk(v,p){if(typeof v==='string'){if(/[—–]| - /.test(v))bad.push(p);return;}if(!v||typeof v!=='object'||seen.has(v))return;seen.add(v);for(const[k,x]of Object.entries(v))walk(x,p+'.'+k);}
  walk(content,'exports');assert.equal(bad.length,0,bad.slice(0,8).join(', '));
});
test('case authorship, stored years, media and route identifiers stay unchanged',()=>{
  const records=Object.fromEntries(Object.entries(content.cases).map(([lang,items])=>[lang,items.map(({slug,practice,year,role,media,link})=>({slug,practice,year,role,media,...(link===undefined?{}:{link})}))]));
  assert.deepEqual({CASE_SLUGS:content.CASE_SLUGS,PRACTICE_SLUGS:content.PRACTICE_SLUGS,records},expected);
});
test('company descriptions and technology labels use company voice',()=>{
  for(const text of [content.copy.en.meta.description,content.copy.en.howIWork.label,content.copy.en.contact.lead,content.copy.en.servicos.metricsLabel])assert.equal(/\b(?:I|me|my|mine)\b/.test(text),false);
});

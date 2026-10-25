import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {copy} from '../src/content/copy.js';
const read=p=>readFileSync(new URL('../src/'+p,import.meta.url),'utf8');
const mod=async p=>existsSync(new URL('../src/'+p,import.meta.url))?import('../src/'+p):{};
const line=await mod('lib/revealText.js');
const preview=await mod('lib/navPreview.js');
test('decorative punctuation is unique and preserves question/exclamation marks',()=>{
 assert.equal(typeof line.revealText,'function');
 for(const [s,expected] of [['Projeto.','Projeto'],['Projeto','Projeto'],['Onde?','Onde?'],['Já!','Já!']]){
  const r=line.revealText(s,true);assert.equal(r.text,expected);assert.equal(r.dot,!/[?!]$/.test(s));
 }
 assert.deepEqual(line.revealText('Projeto.',false),{text:'Projeto.',dot:false});
});
test('poster load cancelled by rapid selection cannot commit obsolete preview',async()=>{
 assert.equal(typeof preview.requestNavPreview,'function');
 let finish;const commits=[];const cancel=preview.requestNavPreview('old',()=>new Promise(r=>finish=r),s=>commits.push(s));
 cancel();finish();await Promise.resolve();assert.deepEqual(commits,[]);
 preview.requestNavPreview('new',()=>Promise.resolve(),s=>commits.push(s));await Promise.resolve();assert.deepEqual(commits,['new']);
});
test('failed poster keeps previous preview and reports failure without reveal',async()=>{
 assert.equal(typeof preview.requestNavPreview,'function');
 const commits=[],errors=[];preview.requestNavPreview('bad',()=>Promise.reject(new Error('404')),s=>commits.push(s),s=>errors.push(s));
 await new Promise(r=>setImmediate(r));assert.deepEqual(commits,[]);assert.deepEqual(errors,['bad']);
});
test('Home and navigation do not print creation years',()=>{
 for(const p of ['components/sections/HomeTrabalho.jsx','components/layout/SiteNav.jsx'])assert.doesNotMatch(read(p),/\{c\.year\}/);
});
test('technology and contact use company voice in both languages',()=>{
 for(const lang of ['pt','en']){
  const s=copy[lang].howIWork;assert.doesNotMatch(s.lead+s.intro+s.ai.body,/uma pessoa|one person|single person/i);
 }
 assert.doesNotMatch(copy.pt.contact.lead,/\bMe\b/);
});
test('general commercial conditions do not promise an unqualified number or week deadline',()=>{
 for(const lang of ['pt','en']){
 assert.doesNotMatch(JSON.stringify(copy[lang].servicos.metrics),/"18"|"7 (dias|days)"|100%/);
 assert.doesNotMatch(JSON.stringify(copy[lang].servicos.faq),/primeira semana|week one|first week/i);
 }
});
test('pageview emission occurs before cleanup return',()=>{
 const s=read('components/SiteAnalytics.jsx');const start=s.indexOf('pathRef.current = location.pathname;');const end=s.indexOf('}, [location.pathname]);',start);const effect=s.slice(start,end);
 assert.ok(effect.indexOf('trackPageView(location.pathname)')<effect.indexOf('return () =>'));
});
test('LineReveal forwards semantic attributes and has punctuation in effect dependencies',()=>{
 const s=read('components/LineReveal.jsx');assert.match(s,/\.\.\.rest/);assert.match(s,/\{\.\.\.rest\}/);assert.match(s,/\[text,.*dot/);
});
test('route pageview has a single GA path through the first-party mirror',()=>{
 const s=read('components/SiteAnalytics.jsx');assert.doesNotMatch(s,/gaPageView/);assert.match(s,/onConsent[\s\S]*trackPageView\(pathRef.current\)/);
});
test('closing a menu cancels a successful poster completion',async()=>{
 let resolve;const commits=[];const cancel=preview.requestNavPreview('closed',()=>new Promise(r=>resolve=r),s=>commits.push(s));cancel();resolve();await new Promise(r=>setImmediate(r));assert.deepEqual(commits,[]);
});
test('service preview does not remount the entire stage on selection and respects reduced motion',()=>{
 const s=read('components/layout/SiteNav.jsx'),v=read('components/layout/NavServicePreview.jsx');
 assert.doesNotMatch(s,/<NavServicePreview key=/);assert.match(v,/data-preview-src=\{shown/);assert.match(v,/active=\{src === shown\}/);assert.match(v,/motion.matches/);assert.match(s,/onFocus=\{\(\) => \{ setDrop\(true\); setSubIdx\(i\)/);
});

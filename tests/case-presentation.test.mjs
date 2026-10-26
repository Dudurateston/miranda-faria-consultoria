import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { getCase } from '../src/content/copy.js';

const configUrl = new URL('../src/content/casePresentation.js', import.meta.url);
const modelUrl = new URL('../src/lib/caseMediaViewer.js', import.meta.url);
const config = existsSync(configUrl) ? await import(configUrl) : {};
const model = existsSync(modelUrl) ? await import(modelUrl) : {};
const pilots = ['rota-forte', 'motormoura', '1000-pecas', 'roda-agro-marca', 'advogados-lco'];

test('five established presentations remain complete and localized', () => {
  for (const slug of pilots) for (const lang of ['pt','en']) {
    const p = config.getCasePresentation?.(slug, lang);
    assert.ok(p, `${slug}/${lang} has presentation`);
    assert.ok(p.media.length >= 3);
    const ids = new Set(p.media.map(m => m.id));
    assert.equal(ids.size, p.media.length);
    assert.ok(ids.has(p.leadMedia));
    for(const m of p.media) {
      assert.match(m.src, new RegExp(`^/work/${slug}/`));
      assert.ok(m.width > 0 && m.height > 0);
      assert.ok(m.alt && m.caption);
      assert.ok(!/[—–]/.test(m.alt + m.caption));
    }
    assert.deepEqual([...p.leadSections, ...p.chapters.flatMap(c=>c.sections || [])].sort(), ['decisions','impact','problem','process']);
    const displayed = [p.leadMedia, ...p.chapters.flatMap(c=>c.media || [])];
    assert.deepEqual(displayed.slice().sort(), [...ids].sort());
  }
  assert.ok(config.getCasePresentation?.('uaiso-travel','pt'));
  assert.equal(config.getCasePresentation?.('missing','en'), null);
});

test('portrait artworks keep true dimensions and restrained display width', () => {
  const p = config.getCasePresentation?.('roda-agro-marca','pt');
  assert.ok(p, 'brand presentation available');
  const original = p.media.find(m=>m.src.endsWith('/03.webp'));
  assert.deepEqual([original.width,original.height],[512,917]);
  assert.ok(original.displayWidth <= 512);
  assert.ok(p.chapters.some(c=>c.layout === 'portraits'));
});

test('Rota video reserves its real aspect ratio and caps display to native width',()=>{
  const video=config.getCasePresentation('rota-forte','pt').media.find(m=>m.type==='video');
  assert.deepEqual([video.width,video.height],[1280,800]);
  const s=readFileSync(new URL('../src/components/CaseShowcase.jsx',import.meta.url),'utf8');
  assert.match(s,/mf-cs__video.*data-media-id=\{item.id\}.*shot-width/);
  assert.match(s,/aspectRatio/);
});

test('LCO original filenames and dimensions remain unchanged', () => {
  const p = config.getCasePresentation?.('advogados-lco','en');
  assert.ok(p, 'LCO presentation available');
  assert.deepEqual(p.media.map(m=>[m.src,m.width,m.height]), [
    ['/work/advogados-lco/01.webp',1440,800],
    ['/work/advogados-lco/02.webp',1440,800],
    ['/work/advogados-lco/03.webp',1600,900],
  ]);
});

test('viewer navigation wraps images, excludes video, and handles single/absent items', () => {
  const a = [{id:'a',type:'image'},{id:'v',type:'video'},{id:'b',type:'image'}];
  assert.equal(model.adjacentImageId?.(a,'a',1),'b');
  assert.equal(model.adjacentImageId?.(a,'a',-1),'b');
  assert.equal(model.adjacentImageId?.(a,'b',1),'a');
  assert.equal(model.adjacentImageId?.([a[0]],'a',1),'a');
  assert.equal(model.adjacentImageId?.([],'a',1),null);
  assert.equal(model.adjacentImageId?.(a,'missing',1),'a');
});

test('showcase integrates narrative with viewer, accessible video, and original proportions', () => {
  const file = new URL('../src/components/CaseShowcase.jsx',import.meta.url);
  const s = existsSync(file) ? readFileSync(file,'utf8') : '';
  assert.match(s,/CaseMediaViewer/);
  assert.match(s,/controls/);
  assert.match(s,/IntersectionObserver/);
  assert.match(s,/visibilitychange/);
  assert.match(s,/aria-haspopup="dialog"/);
  assert.doesNotMatch(s,/autoPlay|mask-image|object-fit:\s*cover/);
});

test('viewer uses native modal, restores focus and clears scroll lock', () => {
  const file = new URL('../src/components/CaseMediaViewer.jsx',import.meta.url);
  const s = existsSync(file) ? readFileSync(file,'utf8') : '';
  assert.match(s,/showModal\(/);
  assert.match(s,/onCancel/);
  assert.match(s,/preventScroll/);
  assert.match(s,/ArrowRight/);
  assert.match(s,/overflow/);
  assert.match(s,/onError/);
  assert.match(s,/zoomed/);
});

test('case route opts in only configured pilots and resets viewer on route changes', () => {
  const s = readFileSync(new URL('../src/pages/WorkCase.jsx',import.meta.url),'utf8');
  assert.match(s,/getCasePresentation\(item.slug, lang\)/);
  assert.match(s,/CaseShowcase key=\{item.slug\}/);
  assert.match(s,/!presentation/);
  assert.match(s,/CaseMedia media=\{item.media\}/);
  assert.match(s,/item.role/);
});

test('Roda case links the exact profile supplied by Eduardo with project management credit', () => {
  for(const lang of ['pt','en']) {
    const p=config.getCasePresentation('roda-agro-marca',lang);
    assert.equal(p.social?.href,'https://www.instagram.com/rodaagropiumhi/');
    assert.ok(p.social?.label && p.social?.credit);
    assert.ok(!/\b(IA|AI)\b/.test(p.social.credit));
  }
});

test('image modal opts out of site smooth scrolling',()=>{
  const s=readFileSync(new URL('../src/components/CaseMediaViewer.jsx',import.meta.url),'utf8');
  assert.match(s,/data-lenis-prevent/);
});

test('original-size image can receive keyboard focus for native panning',()=>{
  const s=readFileSync(new URL('../src/components/CaseMediaViewer.jsx',import.meta.url),'utf8');
  assert.match(s,/tabIndex=\{zoomed \? 0 : -1\}/);
  assert.match(s,/if \(zoomed\) viewportRef.current\?\.focus/);
});

test('Roda narrative describes the actual pieces, not an unsupported exhibitor template',()=>{
  for(const lang of ['pt','en']) {
    const c=getCase(lang,'roda-agro-marca');
    assert.ok(!/kit|pontilhada|dashed area/.test(c.summary+' '+c.process+' '+c.decisions));
    assert.match(c.impact,/Instagram/);
  }
});

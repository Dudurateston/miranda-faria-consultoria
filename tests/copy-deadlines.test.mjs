import test from 'node:test';
import assert from 'node:assert/strict';
import {copy,practices} from '../src/content/copy.js';
test('contact metadata and development intros do not promise same-day delivery or replies',()=>{
 const text=copy.en.meta.pages.contact+' '+copy.pt.meta.pages.contact+' '+practices.en.desenvolvimento.intro+' '+practices.pt.desenvolvimento.intro;
 assert.doesNotMatch(text,/same.day|mesmo dia|morning ships/i);
});

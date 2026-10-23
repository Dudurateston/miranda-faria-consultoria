import test from 'node:test';
import assert from 'node:assert/strict';
import { getCase } from '../src/content/copy.js';

test('LCO is attributed explicitly to Thales, per Eduardo correction',()=>{
  assert.equal(getCase('pt','advogados-lco').role,'Projeto de Thales Machado Souza');
  assert.equal(getCase('en','advogados-lco').role,'Project by Thales Machado Souza');
});

test('Rota Forte and LCO never claim Instagram management',()=>{
  for(const lang of ['pt','en'])for(const slug of ['rota-forte','advogados-lco']) {
    const c=getCase(lang,slug);
    assert.ok(!/instagram/i.test([c.summary,c.problem,c.process,c.decisions,c.impact,c.link].join(' ')),`${slug}/${lang}`);
  }
});

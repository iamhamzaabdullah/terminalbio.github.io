const { test } = require('node:test');
const assert = require('node:assert/strict');
const review = require('../p/geno/analysis.js');

test('summarizes entries and identifies records needing review without inferring risk', () => {
  const result = review([
    { name: 'I-1', affectedStatus: 'affected', parent1: 'parent', parentageType: 'adoption' },
    { name: 'I-1', affectedStatus: 'unknown' }
  ], [], {});
  assert.match(result.summary.join(' '), /2 people recorded; 1 marked affected; 1 with unknown status/);
  assert.match(result.summary.join(' '), /risk are not inferred/);
  assert.match(result.notes.join(' '), /only one genetic parent/);
  assert.match(result.notes.join(' '), /not standardized relationship symbols/);
  assert.match(result.notes.join(' '), /used more than once/);
  assert.match(result.notes.join(' '), /No proband/);
  assert.match(result.notes.join(' '), /source is not recorded/);
});

test('reports consanguinity and recorded conditions', () => {
  const result = review([{ name:'I-1', affectedStatus:'affected', condition:'Example', proband:true }],
    [{a:'a', b:'b', consanguinity:true}], {source:'Interview'});
  assert.match(result.summary.join(' '), /Example/);
  assert.match(result.notes.join(' '), /consanguineous/);
  assert.doesNotMatch(result.notes.join(' '), /No proband|source is not recorded/);
});

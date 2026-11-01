const {test} = require('node:test');
const assert = require('node:assert/strict');
const {crossesPerson} = require('../p/geno/routing.js');
test('flags routes that cross other people, ignoring the source and target', () => {
  const people={source:{x:0,y:0},target:{x:100,y:100},obstacle:{x:50,y:50}};
  assert.equal(crossesPerson([{x:0,y:50},{x:100,y:50}],people,['source','target']),true);
  assert.equal(crossesPerson([{x:0,y:10},{x:100,y:10}],people,['source','target']),false);
  assert.equal(crossesPerson([{x:50,y:0},{x:50,y:100}],people,['obstacle']),false);
});

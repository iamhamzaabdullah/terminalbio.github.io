const {test} = require('node:test');
const assert = require('node:assert/strict');
const conditions = require('../p/geno/conditions.js');

test('lists up to three additional conditions without inferring carrier status', () => {
  const person = {name:'I-1',condition:'Condition A',affectedStatus:'affected',
    additionalCondition:'Condition B',additionalStatus:'carrier',
    condition3:'Condition C',condition3Status:'affected',
    condition4:'Condition D',condition4Status:'carrier'};
  assert.deepEqual(conditions.additional(person).map(x=>x.name),['Condition B','Condition C','Condition D']);
  assert.match(conditions.label(person),/1 Condition A; 2 Condition B \(carrier\); 3 Condition C \(affected\); 4 Condition D \(carrier\)/);
});

test('does not render incomplete or unsupported condition entries', () => {
  assert.deepEqual(conditions.additional({additionalCondition:'Example',additionalStatus:'',condition3:'Example',condition3Status:'unknown'}),[]);
});

test('wraps condition keys between words and retains long identifiers', () => {
  assert.deepEqual(conditions.wrap('first second third fourth', 12), ['first second','third fourth']);
  assert.equal(conditions.wrap('longidentifier', 5).join(''), 'longidentifier');
});

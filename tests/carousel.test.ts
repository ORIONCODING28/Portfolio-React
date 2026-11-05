import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cyclePage } from '../src/domain/carousel.ts';
test('both directions wrap across first and last pages',()=>{
  assert.equal(cyclePage(-1,7),6); assert.equal(cyclePage(7,7),0);
  assert.equal(cyclePage(-1,2),1); assert.equal(cyclePage(2,2),0);
});
test('normalises repeated cycles and one-page galleries',()=>{
  assert.equal(cyclePage(-15,7),6); assert.equal(cyclePage(22,7),1);
  assert.equal(cyclePage(1,1),0); assert.equal(cyclePage(-1,1),0);
});

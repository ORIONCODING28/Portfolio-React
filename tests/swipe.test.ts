import { test } from 'node:test';
import assert from 'node:assert/strict';
import { swipeDirection } from '../src/domain/swipe.ts';
test('horizontal touch gestures advance or return one stage',()=>{
  assert.equal(swipeDirection({x:200,y:100},{x:90,y:107}),1);
  assert.equal(swipeDirection({x:90,y:100},{x:200,y:107}),-1);
});
test('small drags, vertical scrolling and diagonal gestures do not change stage',()=>{
  assert.equal(swipeDirection({x:0,y:0},{x:30,y:0}),0);
  assert.equal(swipeDirection({x:0,y:0},{x:10,y:110}),0);
  assert.equal(swipeDirection({x:0,y:0},{x:60,y:55}),0);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heroOpeningScale, heroScrollFrame } from '../src/domain/heroScroll.ts';

test('full-screen intro scrubs in both directions without accumulating animation state', () => {
  const opening = heroScrollFrame(0, 0, 600);
  assert.deepEqual(opening, { progress: 0, remaining: 1, copy: 0 });
  const middle = heroScrollFrame(300, 0, 600);
  assert.ok(middle.remaining > 0 && middle.remaining < 1);
  assert.ok(middle.copy > 0 && middle.copy < 1);
  assert.deepEqual(heroScrollFrame(600, 0, 600), { progress: 1, remaining: 0, copy: 1 });
  assert.deepEqual(heroScrollFrame(300, 0, 600), middle);
  assert.deepEqual(heroScrollFrame(0, 0, 600), opening);
});

test('deep links, fast jumps and invalid ranges settle to a readable composition', () => {
  assert.deepEqual(heroScrollFrame(5000, 80, 600), { progress: 1, remaining: 0, copy: 1 });
  assert.deepEqual(heroScrollFrame(-50, 0, 600), { progress: 0, remaining: 1, copy: 0 });
  assert.deepEqual(heroScrollFrame(0, 0, 0), { progress: 1, remaining: 0, copy: 1 });
});

test('opening stays bounded at phone, tablet, laptop and 2560px widths', () => {
  for (const [width,height,viewportWidth,available] of [[380,421,380,772],[360,370,768,944],[480,390,1024,688],[1292,691,2560,1320]]) {
    const scale=heroOpeningScale(width,height,viewportWidth,available);
    assert.ok(scale>=1 && scale<=2.8);
    const diameter=Math.min(width*.5,height*.88);
    assert.ok(diameter*scale<=viewportWidth);
    assert.ok(diameter*scale<=available);
  }
  assert.equal(heroOpeningScale(0,0,390,700),1);
});

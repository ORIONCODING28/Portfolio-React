import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deviceScrollProgress, deviceScrollMotion } from '../src/domain/deviceScrollProgress.ts';

test('scrolling down advances the pose and scrolling back restores the exact pose', () => {
  const top = deviceScrollProgress(580, 380, 720);
  const middle = deviceScrollProgress(250, 380, 720);
  const end = deviceScrollProgress(-150, 380, 720);
  assert.ok(top < middle && middle < end);
  assert.equal(deviceScrollProgress(250, 380, 720), middle);
  assert.equal(deviceScrollProgress(580, 380, 720), top);
});

test('the pose stays bounded outside the viewport and works at phone and wide-screen sizes', () => {
  for (const [height, viewport] of [[350, 844], [580, 1440], [380, 720]]) {
    assert.equal(deviceScrollProgress(viewport + height, height, viewport), 0);
    assert.equal(deviceScrollProgress(-height * 2, height, viewport), 1);
  }
  assert.equal(deviceScrollProgress(0, 0, 0), .5);
});

test('models hold the exact front-facing pose throughout the reading zone at every viewport size', () => {
  for (const [height, viewport] of [[350, 844], [580, 1440], [380, 720], [440, 1024]]) {
    const centred = (viewport - height) / 2;
    for (const offset of [-viewport * .1, 0, viewport * .1]) {
      assert.deepEqual(deviceScrollMotion(deviceScrollProgress(centred + offset, height, viewport)), { arrival: 0, departure: 0 });
    }
  }
});

test('entry eases into the reading pose and exit remains independent and reversible', () => {
  assert.deepEqual(deviceScrollMotion(0), { arrival: 1, departure: 0 });
  assert.deepEqual(deviceScrollMotion(1), { arrival: 0, departure: 1 });
  assert.ok(deviceScrollMotion(.1).arrival > deviceScrollMotion(.25).arrival);
  assert.ok(deviceScrollMotion(.9).departure > deviceScrollMotion(.85).departure);
  assert.ok(deviceScrollMotion(.4 - .0001).arrival < .000001);
  assert.ok(deviceScrollMotion(.8 + .0001).departure < .000001);
});

test('quick motion remains animated but reaches the reading pose with less scrolling', () => {
  assert.deepEqual(deviceScrollMotion(0, true), { arrival: 1, departure: 0 });
  assert.ok(deviceScrollMotion(.1, true).arrival > 0);
  assert.ok(deviceScrollMotion(.1, true).arrival < deviceScrollMotion(.1).arrival);
  assert.equal(deviceScrollMotion(.28, true).arrival, 0);
  assert.ok(deviceScrollMotion(.28).arrival > 0);
  for (const progress of [.28, .4, .6, .8, .9]) {
    assert.deepEqual(deviceScrollMotion(progress, true), { arrival: 0, departure: 0 });
  }
  assert.ok(deviceScrollMotion(.95, true).departure > 0);
  assert.deepEqual(deviceScrollMotion(1, true), { arrival: 0, departure: 1 });
});

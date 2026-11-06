import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deviceScrollProgress } from '../src/domain/deviceScrollProgress.ts';

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

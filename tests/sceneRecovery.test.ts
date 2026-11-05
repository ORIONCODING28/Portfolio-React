import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bindSceneRecovery } from '../src/graphics/bindSceneRecovery.ts';

test('GPU loss permits restoration and page-cache return resumes the existing scene', () => {
  const canvas = new EventTarget();
  const page = new EventTarget();
  let resumes = 0;
  const release = bindSceneRecovery(canvas, () => { resumes++; }, page);
  const loss = new Event('webglcontextlost', { cancelable: true });
  canvas.dispatchEvent(loss);
  assert.equal(loss.defaultPrevented, true);
  assert.equal(resumes, 1);
  canvas.dispatchEvent(new Event('webglcontextrestored'));
  page.dispatchEvent(new Event('pageshow'));
  page.dispatchEvent(new Event('focus'));
  assert.equal(resumes, 4);
  release();
});

test('disposing a scene removes every recovery listener', () => {
  const canvas = new EventTarget();
  const page = new EventTarget();
  let resumes = 0;
  const release = bindSceneRecovery(canvas, () => { resumes++; }, page);
  release();
  release();
  canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
  canvas.dispatchEvent(new Event('webglcontextrestored'));
  page.dispatchEvent(new Event('pageshow'));
  page.dispatchEvent(new Event('focus'));
  assert.equal(resumes, 0);
});

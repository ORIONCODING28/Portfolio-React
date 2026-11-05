import { test } from 'node:test';
import assert from 'node:assert/strict';
import { withBasePath } from '../src/domain/deployment.ts';

test('assets and route links work at a root domain and under the Pages repository', () => {
  assert.equal(withBasePath('/assets/models/omen.glb'), '/assets/models/omen.glb');
  assert.equal(withBasePath('/assets/projects/parco-mobile.mp4', '/Portfolio-React/'), '/Portfolio-React/assets/projects/parco-mobile.mp4');
  assert.equal(withBasePath('/projects/parco?modal=contact#main', '/Portfolio-React/'), '/Portfolio-React/projects/parco?modal=contact#main');
  assert.equal(withBasePath('/', '/Portfolio-React/'), '/Portfolio-React/');
});

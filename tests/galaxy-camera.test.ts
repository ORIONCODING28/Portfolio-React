import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { fitGalaxyCamera, getGalaxyPointScale } from '../src/graphics/fitGalaxyCamera.ts';

test('phone, laptop and wide-screen framing preserves the same orbital perspective', () => {
  const positions: number[] = [];
  for (let i = 0; i < 256; i++) {
    const angle = i / 256 * Math.PI * 2;
    positions.push(Math.cos(angle) * 6.6, 1.1 + Math.sin(angle) * 6.6 * .18, -Math.sin(angle) * 6.6 * Math.sqrt(1 - .18 ** 2));
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial();
  const ring = new THREE.Points(geometry, material);
  ring.scale.setScalar(1.4);
  ring.updateMatrixWorld(true);
  let reference: number | undefined;
  for (const [width, height] of [[390, 420], [480, 470], [700, 510], [1200, 700]]) {
    const camera = new THREE.PerspectiveCamera(75, width / height, .1, 1000);
    camera.position.set(0, 3, 16);
    camera.lookAt(0, 0, 0);
    fitGalaxyCamera(camera, [ring]);
    assert.deepEqual(camera.position.toArray(), [0, 3, 16]);
    assert.equal(camera.fov, 75);
    const near = new THREE.Vector3(0, 1.1 + 6.6 * .18, -6.6 * Math.sqrt(1 - .18 ** 2)).multiplyScalar(1.4).project(camera);
    const far = new THREE.Vector3(0, 1.1 - 6.6 * .18, 6.6 * Math.sqrt(1 - .18 ** 2)).multiplyScalar(1.4).project(camera);
    const ratio = near.y / far.y;
    if (reference === undefined) reference = ratio;
    else assert.ok(Math.abs(ratio - reference) < 1e-10, 'near/far arc ratio must not change with viewport');
    for (let i = 0; i < 256; i += 2) {
      const point = new THREE.Vector3().fromBufferAttribute(geometry.getAttribute('position'), i).applyMatrix4(ring.matrixWorld).project(camera);
      assert.ok(Math.abs(point.x) <= .920001 && Math.abs(point.y) <= .880001);
    }
  }
  geometry.dispose(); material.dispose();
});

test('particle size follows projected galaxy size and cancels the device pixel ratio', () => {
  const camera = new THREE.PerspectiveCamera(75, 1, .1, 1000);
  camera.zoom = 1.3;
  const mobile = getGalaxyPointScale(camera, 420, 1.5);
  const desktop = getGalaxyPointScale(camera, 420, 2);
  assert.ok(Math.abs(mobile / 1.5 - desktop / 2) < 1e-10);
  assert.equal(getGalaxyPointScale(camera, 840, 2), desktop * 2);
  camera.zoom *= 2;
  assert.equal(getGalaxyPointScale(camera, 420, 2), desktop * 2);
});

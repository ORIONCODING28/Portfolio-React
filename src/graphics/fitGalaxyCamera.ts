import * as THREE from 'three';

/** Fit by zoom alone: viewport changes must not change orbital perspective. */
export function fitGalaxyCamera(camera: THREE.PerspectiveCamera, objects: readonly THREE.Points[]): void {
  camera.zoom = 1;
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);
  const point = new THREE.Vector3();
  let extentX = 0, extentY = 0;
  for (const object of objects) {
    const positions = object.geometry.getAttribute('position');
    const step = Math.max(1, Math.floor(positions.count / 128));
    for (let index = 0; index < positions.count; index += step) {
      point.fromBufferAttribute(positions, index).applyMatrix4(object.matrixWorld).project(camera);
      extentX = Math.max(extentX, Math.abs(point.x));
      extentY = Math.max(extentY, Math.abs(point.y));
    }
  }
  if (extentX > 0 && extentY > 0) camera.zoom = Math.min(.92 / extentX, .88 / extentY);
  camera.updateProjectionMatrix();
}

/** Constant particle coverage relative to the projected galaxy, on every DPR. */
export function getGalaxyPointScale(camera: THREE.PerspectiveCamera, height: number, pixelRatio: number): number {
  const projection = height * pixelRatio * camera.zoom / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
  return projection * .45;
}

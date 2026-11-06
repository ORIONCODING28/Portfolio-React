import { deviceScrollProgress, deviceScrollMotion } from '../domain/deviceScrollProgress';
import { bindSceneRecovery } from './bindSceneRecovery';
import { publicAsset } from '../domain/deployment.ts';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

import { createStudioBackdrop } from './createStudioBackdrop';
import { createDeviceScreen } from './createDeviceScreen';
export type DeviceKind = 'web' | 'mobile' | 'backend';
export interface DeviceController { attachTo(target: HTMLElement): void; setTheme(dark: boolean): void; resetView(): void; setInteractionEnabled(enabled: boolean): void; dispose(): void }

export function createDeviceModel(host: HTMLElement, kind: DeviceKind, dark: boolean, onLoaded?: () => void, onError?: () => void): DeviceController {
  const scene = new THREE.Scene();
  const backdrop = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, .1, 50);
  camera.position.set(0, 1.3, 8.6); camera.lookAt(0, 0, 0);
  const backdropCamera = camera.clone();
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0, 0); renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  host.appendChild(renderer.domElement);
  const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>(), textures = new Set<THREE.Texture>();
  const screens: ReturnType<typeof createDeviceScreen>[] = [];
  let disposed = false, visible = false, frame = 0;
  let modelReady = false;
  const root = new THREE.Group(); scene.add(root);
  const baseAngle = kind === 'web' ? -.34 : kind === 'mobile' ? -.16 : -.4;
  const readingPitch = kind === 'mobile' ? -Math.atan(.13) : kind === 'backend' ? .04 : 0;
  root.rotation.y = baseAngle;

  function material<T extends THREE.Material>(value: T): T { materials.add(value); return value; }
  const aluminum = material(new THREE.MeshPhysicalMaterial({ color: 0x63717d, metalness: .9, roughness: .25, clearcoat: .35 }));
  const graphite = material(new THREE.MeshPhysicalMaterial({ color: 0x202c39, metalness: .78, roughness: .27, clearcoat: .5 }));
  const bezel = material(new THREE.MeshStandardMaterial({ color: 0x060b10, metalness: .3, roughness: .3 }));
  const cyan = material(new THREE.MeshStandardMaterial({ color: 0x00d9f5, emissive: 0x00bddb, emissiveIntensity: 2, toneMapped: false }));
  const vents = material(new THREE.MeshStandardMaterial({ color: 0x050a10, roughness: .8 }));

  // An actual studio reflection environment gives the bevels and metal depth.
  const studio = document.createElement('canvas'); studio.width = 1024; studio.height = 512;
  const studioCtx = studio.getContext('2d');
  if (studioCtx) {
    const gradient = studioCtx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, '#19232f'); gradient.addColorStop(.46, '#52616d'); gradient.addColorStop(.55, '#111925'); gradient.addColorStop(1, '#04070c');
    studioCtx.fillStyle = gradient; studioCtx.fillRect(0, 0, 1024, 512);
    // Broad, neutral illumination avoids hard reflection panels during zoom/orbit.
  }
  const environment = new THREE.CanvasTexture(studio); environment.mapping = THREE.EquirectangularReflectionMapping;
  environment.colorSpace = THREE.SRGBColorSpace; textures.add(environment);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentTarget = pmrem.fromEquirectangular(environment); pmrem.dispose();
  scene.environment = environmentTarget.texture; scene.environmentIntensity = .45;
  scene.add(new THREE.HemisphereLight(0xd7efff, 0x152233, 1.8));
  const keyLight = new THREE.DirectionalLight(0xf0f7ff, 2.4); keyLight.position.set(-3, 5, 6); scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x00cce8, 3); rimLight.position.set(4, 1, -3); scene.add(rimLight);

  function rounded(parent: THREE.Group, w: number, h: number, d: number, radius: number, mat: THREE.Material, x = 0, y = 0, z = 0) {
    const geometry = new RoundedBoxGeometry(w, h, d, 3, radius); geometries.add(geometry);
    const mesh = new THREE.Mesh(geometry, mat); mesh.position.set(x, y, z); parent.add(mesh); return mesh;
  }
  function instanced(parent: THREE.Group, geometry: THREE.BufferGeometry, mat: THREE.Material, positions: THREE.Vector3[]) {
    geometries.add(geometry);
    const mesh = new THREE.InstancedMesh(geometry, mat, positions.length);
    const matrix = new THREE.Matrix4(); positions.forEach((position, i) => { matrix.makeTranslation(position.x, position.y, position.z); mesh.setMatrixAt(i, matrix); });
    parent.add(mesh); return mesh;
  }

  if (kind === 'web' || kind === 'mobile') {
    const url = kind === 'mobile' ? publicAsset('/assets/models/iphone-15-pro-titanium.glb')
      : publicAsset('/assets/models/omen.glb');
    new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load(url, gltf => {
      const imported = gltf.scene;
      const importedGeometries = new Set<THREE.BufferGeometry>();
      const importedMaterials = new Set<THREE.Material>();
      const importedTextures = new Set<THREE.Texture>();
      imported.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        importedGeometries.add(object.geometry);
        const list = Array.isArray(object.material) ? object.material : [object.material];
        list.forEach(mat => { importedMaterials.add(mat); Object.values(mat).forEach(value => { if (value instanceof THREE.Texture) importedTextures.add(value); }); });
      });
      if (disposed) {
        importedGeometries.forEach(geometry => geometry.dispose());
        importedMaterials.forEach(mat => mat.dispose());
        importedTextures.forEach(texture => { texture.dispose(); if (typeof ImageBitmap !== 'undefined' && texture.image instanceof ImageBitmap) texture.image.close(); });
        return;
      }
      importedGeometries.forEach(geometry => geometries.add(geometry));
      importedMaterials.forEach(mat => materials.add(mat));
      importedTextures.forEach(texture => textures.add(texture));
      if (kind === 'mobile') imported.rotation.y = Math.PI;
      imported.updateMatrixWorld(true);
      const screen = createDeviceScreen(kind === 'mobile', renderer.capabilities.getMaxAnisotropy(), render);
      screens.push(screen);
      let foundScreen = false;
      imported.traverse(object => {
        if (!(object instanceof THREE.Mesh)) return;
        const list = Array.isArray(object.material) ? object.material : [object.material];
        const isScreen = list.some(mat => mat.name === (kind === 'mobile' ? 'pIJKfZsazmcpEiU' : 'screen'));
        if (!isScreen) return;
        foundScreen = true;
        // The source assets unwrap their screens differently. Project the upright
        // screen into a shared UV layout so both show exactly the same content.
        const bounds = new THREE.Box3().setFromObject(object);
        const size = bounds.getSize(new THREE.Vector3());
        const position = object.geometry.getAttribute('position');
        const uv: number[] = [], vertex = new THREE.Vector3();
        for (let i=0;i<position.count;i++) {
          vertex.fromBufferAttribute(position,i).applyMatrix4(object.matrixWorld);
          uv.push((vertex.x-bounds.min.x)/size.x,(vertex.y-bounds.min.y)/size.y);
        }
        object.geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
        object.material = material(new THREE.MeshBasicMaterial({ map:screen.texture, side:THREE.DoubleSide, toneMapped:false }));
        // Keep the display in front of coplanar glass layers in source models.
        object.material.polygonOffset=true; object.material.polygonOffsetFactor=-1; object.material.polygonOffsetUnits=-1;
      });
      if (!foundScreen) { onError?.(); return; }
      const bounds = new THREE.Box3().setFromObject(imported);
      const size = bounds.getSize(new THREE.Vector3()), center = bounds.getCenter(new THREE.Vector3());
      const scale = kind === 'mobile' ? 2.74/size.y : 3.28/size.x;
      imported.scale.multiplyScalar(scale);
      imported.position.addScaledVector(center,-scale);
      root.add(imported); modelReady = true; compose(); resize(); render(); onLoaded?.();
    }, undefined, () => { if(!disposed) onError?.(); });
  } else {
    for (let i = 0; i < 3; i++) {
      const y = -.83 + i * .78;
      rounded(root, 2.45, .6, 1.65, .1, graphite, 0, y, 0);
      rounded(root, 2.28, .42, .04, .019, aluminum, 0, y, .832);
      rounded(root, 2.15, .33, .025, .012, bezel, 0, y, .86);
      rounded(root, 1.1, .033, .014, .006, cyan, -.4, y + .08, .88);
      rounded(root, .63, .021, .014, .006, cyan, -.63, y, .88);
      for (let j = 0; j < 3; j++) rounded(root, .075, .054, .018, .009, cyan, .65 + j * .15, y + .03, .89);
      const slots: THREE.Vector3[] = [];
      for (let row = 0; row < 3; row++) for (let j = 0; j < 14; j++) slots.push(new THREE.Vector3(-.94 + j * .1, y - .065 - row * .033, .878));
      instanced(root, new THREE.BoxGeometry(.06, .017, .01), vents, slots);
      rounded(root, 1.9, .018, 1.2, .008, aluminum, 0, y + .304, -.02);
    }
    root.rotation.x = .06;
    modelReady = true;
  }

  const studioBackdrop = createStudioBackdrop(dark);
  geometries.add(studioBackdrop.geometry); materials.add(studioBackdrop.material);
  backdrop.add(studioBackdrop);
  renderer.autoClear = false;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = false;
  controls.rotateSpeed = .65;
  controls.zoomSpeed = .8;
  controls.minPolarAngle = .12;
  controls.maxPolarAngle = Math.PI - .12;
  let interacted = false, touchInteraction = false, fitDistance = 0;
  const homePosition = new THREE.Vector3();
  renderer.domElement.tabIndex = -1;
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', kind === 'web' ? 'Laptop 3D' : kind === 'mobile' ? 'iPhone 15 Pro 3D' : 'Server 3D');
  renderer.domElement.setAttribute('aria-describedby', 'device-interaction-help');
  function render() {
    if (disposed || !visible || document.hidden || renderer.getContext().isContextLost()) return;
    renderer.clear();
    renderer.render(backdrop, backdropCamera);
    renderer.clearDepth();
    renderer.render(scene, camera);
  }
  function compose() {
    // Orbit controls belong to the modal; native scrolling only presents the objects.
    const baseY = kind === 'web' ? -.04 : 0;
    if (touchInteraction) {
      root.rotation.set(kind === 'backend' ? .06 : 0, baseAngle, 0);
      root.position.set(0, baseY, 0);
      return;
    }
    const bounds = host.getBoundingClientRect();
    const { arrival, departure } = deviceScrollMotion(deviceScrollProgress(bounds.top, bounds.height, window.innerHeight));
    const entryYaw = kind === 'web' ? .55 : kind === 'mobile' ? -.5 : .28;
    const exitYaw = kind === 'mobile' ? .1 : -.08;
    root.rotation.y = arrival * entryYaw + departure * exitYaw;
    root.rotation.x = readingPitch + arrival * .055 + departure * .02;
    root.position.set(0, baseY - arrival * .1, 0);
  }
  function startInteraction() { interacted = true; sync(); }
  function setInteractionEnabled(enabled: boolean) {
    const changed = touchInteraction !== enabled;
    touchInteraction = enabled;
    controls.enabled = enabled;
    renderer.domElement.tabIndex = enabled ? 0 : -1;
    renderer.domElement.style.touchAction = enabled ? 'none' : 'pan-y';
    if (!changed) return;
    // The inline model presents itself; only the modal owns orbit/zoom input.
    interacted = enabled;
    if (!enabled) {
      camera.position.copy(homePosition);
      controls.target.set(0, 0, 0);
      controls.update();
    }
    sync();
  }
  function resetView() {
    interacted = false;
    camera.position.copy(homePosition);
    controls.target.set(0, 0, 0);
    controls.update(); sync();
  }
  function keydown(event: KeyboardEvent) {
    if (!controls.enabled) return;
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(event.key)) return;
    event.preventDefault(); startInteraction();
    if (event.key === 'Home') { resetView(); return; }
    const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
    if (event.key === 'ArrowLeft') spherical.theta -= .15;
    if (event.key === 'ArrowRight') spherical.theta += .15;
    if (event.key === 'ArrowUp') spherical.phi -= .15;
    if (event.key === 'ArrowDown') spherical.phi += .15;
    if (event.key === '+' || event.key === '=') spherical.radius *= .85;
    if (event.key === '-') spherical.radius *= 1.15;
    spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle);
    spherical.radius = THREE.MathUtils.clamp(spherical.radius, controls.minDistance, controls.maxDistance);
    camera.position.setFromSpherical(spherical).add(controls.target);
    controls.update(); render();
  }
  controls.addEventListener('start', startInteraction);
  controls.addEventListener('change', render);
  renderer.domElement.addEventListener('keydown', keydown);
  setInteractionEnabled(false);
  function sync() {
    cancelAnimationFrame(frame); frame = 0;
    if (disposed || !visible || document.hidden || renderer.getContext().isContextLost()) return;
    compose(); render();
  }
  function scroll() {
    if (frame || touchInteraction || disposed || !visible || !modelReady || document.hidden || renderer.getContext().isContextLost()) return;
    frame = requestAnimationFrame(() => { frame = 0; compose(); render(); });
  }
  function resize() {
    if (disposed || !host.clientWidth || !host.clientHeight) return;
    camera.aspect = host.clientWidth / host.clientHeight;
    // Include the laptop's depth and perspective: fitting only its unrotated
    // width cuts off the front corners of its keyboard on narrow viewports.
    root.position.set(0, kind === 'web' ? -.04 : 0, 0);
    root.rotation.set(touchInteraction ? (kind === 'backend' ? .06 : 0) : readingPitch, touchInteraction ? baseAngle : 0, 0);
    root.updateMatrixWorld(true);
    const direction = new THREE.Vector3(0, kind === 'web' ? .22 : .13, 1).normalize();
    const up = new THREE.Vector3(0, direction.z, -direction.y);
    const tangent = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    let distance = 0;
    root.traverse(object => {
      if (!(object instanceof THREE.Mesh)) return;
      if (!object.geometry.boundingBox) object.geometry.computeBoundingBox();
      const bounds = object.geometry.boundingBox;
      if (!bounds || bounds.isEmpty()) return;
      for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
        const corner = new THREE.Vector3(x, y, z).applyMatrix4(object.matrixWorld);
        const depth = corner.dot(direction);
        distance = Math.max(distance, Math.abs(corner.x) * 1.08 / (tangent * camera.aspect) + depth, Math.abs(corner.dot(up)) * 1.08 / tangent + depth);
      }
    });
    if (!distance) distance = 6;
    homePosition.copy(direction).multiplyScalar(distance);
    // Only viewport changes affect this camera. Orbit/zoom/reset belong to the
    // device camera; studio lighting is drawn in fixed screen coordinates.
    backdropCamera.aspect = camera.aspect;
    backdropCamera.position.copy(homePosition);
    backdropCamera.lookAt(0, 0, 0);
    backdropCamera.updateProjectionMatrix();
    backdropCamera.updateMatrixWorld(true);
    let lowest = 1;
    root.traverse(object => {
      if (!(object instanceof THREE.Mesh) || !object.geometry.boundingBox) return;
      const bounds = object.geometry.boundingBox;
      for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) for (const z of [bounds.min.z, bounds.max.z]) {
        const point = new THREE.Vector3(x, y, z).applyMatrix4(object.matrixWorld).project(backdropCamera);
        lowest = Math.min(lowest, (point.y + 1) / 2);
      }
    });
    studioBackdrop.material.uniforms.floorY.value = THREE.MathUtils.clamp(lowest - .015, .08, .45);
    if (interacted && fitDistance) camera.position.multiplyScalar(distance / fitDistance);
    else camera.position.copy(homePosition);
    fitDistance = distance; controls.minDistance = distance * .48; controls.maxDistance = distance * 2.1;
    camera.updateProjectionMatrix(); controls.update();
    // Inline previews need fewer pixels; the full-screen view retains DPR 2.
    const compactPreview = !host.closest('.device-dialog') && matchMedia('(max-width: 1023px), (pointer: coarse)').matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio, compactPreview ? 1.5 : 2));
    renderer.setSize(host.clientWidth, host.clientHeight, false); sync();
  }
  function setTheme(isDark: boolean) {
    studioBackdrop.material.uniforms.dark.value = isDark ? 1 : 0;
    cyan.color.set(isDark ? 0x00d9f5 : 0x0755c9);
    cyan.emissive.set(isDark ? 0x00bddb : 0x0755c9);
    cyan.emissiveIntensity=isDark ? 2 : 1;
    rimLight.color.set(isDark ? 0x00cce8 : 0x2d6be0);
    rimLight.intensity=isDark ? .85 : .5;
    render();
  }
  function attachTo(target: HTMLElement) {
    if (disposed || target === host) return;
    resizeObserver.unobserve(host);
    observer.unobserve(host);
    host = target;
    host.appendChild(renderer.domElement);
    resizeObserver.observe(host);
    observer.observe(host);
    resize();
  }
  const resizeObserver = new ResizeObserver(resize); resizeObserver.observe(host);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= .12; sync(); }, { threshold: [0, .12] }); observer.observe(host);
  document.addEventListener('visibilitychange', sync);
  window.addEventListener('scroll', scroll, { passive: true });
  const unbindRecovery = bindSceneRecovery(renderer.domElement, sync);
  resize(); setTheme(dark); if (kind === 'backend') onLoaded?.();
  return { attachTo, setTheme, resetView, setInteractionEnabled, dispose() {
    disposed = true; cancelAnimationFrame(frame); resizeObserver.disconnect(); observer.disconnect();
    controls.removeEventListener('start', startInteraction); controls.removeEventListener('change', render);
    renderer.domElement.removeEventListener('keydown', keydown); controls.dispose();
    document.removeEventListener('visibilitychange', sync); window.removeEventListener('scroll', scroll); unbindRecovery();
    screens.forEach(screen => screen.dispose());
    geometries.forEach(geometry => geometry.dispose()); materials.forEach(mat => mat.dispose()); textures.forEach(texture => { texture.dispose(); if(typeof ImageBitmap !== 'undefined' && texture.image instanceof ImageBitmap) texture.image.close(); });
    environmentTarget.dispose(); scene.clear(); backdrop.clear(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
  } };
}




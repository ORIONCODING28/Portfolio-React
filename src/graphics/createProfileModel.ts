import { bindSceneRecovery } from './bindSceneRecovery';
import { publicAsset } from '../domain/deployment.ts';
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createStudioBackdrop } from './createStudioBackdrop';
import { createAppointmentCanvas } from './createAppointmentCanvas';
import { createProfileObject, objectNames } from './profileObjects';
import type { DeviceController } from './createDeviceModel';

export interface ProfileModelController extends DeviceController { setStage(index: number): void }
export function createProfileModel(initialHost: HTMLElement, initialStage: number, initialDark: boolean, onReady: () => void, onError: () => void, onLoading: () => void): ProfileModelController {
  let host = initialHost, dark = initialDark, disposed = false, visible = false, expanded = false, requested = 0, frame = 0, previous = 0, elapsed = 0, interacted = false, current: T.Group | null = null, entrance = 0, currentStage = initialStage;
  let preload: ReturnType<typeof setTimeout> | undefined;
  const scene = new T.Scene(), background = new T.Scene(), camera = new T.PerspectiveCamera(32, 1, .1, 80);
  const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0, 0); renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1; renderer.autoClear = false;
  renderer.domElement.tabIndex = -1; renderer.domElement.setAttribute('role', 'img');
  host.append(renderer.domElement);
  const environmentGenerator = new T.PMREMGenerator(renderer), room = new RoomEnvironment();
  const environment = environmentGenerator.fromScene(room, .04); scene.environment = environment.texture; scene.environmentIntensity = .4; room.dispose(); environmentGenerator.dispose();
  const key = new T.DirectionalLight(0xf0f7ff, 2.6); key.position.set(-3, 5, 5); scene.add(key);
  const fill = new T.HemisphereLight(0xebf5ff, 0x303843, 1.8); scene.add(fill);
  const rim = new T.DirectionalLight(0x00d9f5, 2.2); rim.position.set(4, 1, -3); scene.add(rim);
  const accent = new T.MeshStandardMaterial({ color: 0x00b9d1, metalness: .48, roughness: .3 });
  const glow = createStudioBackdrop(true); background.add(glow);
  const root = new T.Group(); scene.add(root);
  const cache = new Map<number, Promise<T.Group>>();
  const resources = new Set<T.Object3D>();
  const controls = new OrbitControls(camera, renderer.domElement); controls.enablePan = false; controls.enableDamping = false; controls.rotateSpeed = .65; controls.zoomSpeed = .8; controls.minPolarAngle = .1; controls.maxPolarAngle = Math.PI - .1;
  const home = new T.Vector3(); let distance = 8;
  function release(object: T.Object3D) {
    const geometries = new Set<T.BufferGeometry>(), materials = new Set<T.Material>(), textures = new Set<T.Texture>();
    object.traverse(value => { if (!(value instanceof T.Mesh)) return; geometries.add(value.geometry); (Array.isArray(value.material) ? value.material : [value.material]).forEach(material => { if (material === accent) return; materials.add(material); Object.values(material).forEach(property => { if (property instanceof T.Texture) textures.add(property); }); }); });
    geometries.forEach(g => g.dispose()); materials.forEach(m => m.dispose()); textures.forEach(t => { t.dispose(); if (typeof ImageBitmap !== 'undefined' && t.image instanceof ImageBitmap) t.image.close(); });
  }
  function screenTexture() {
    const canvas = createAppointmentCanvas();
    const texture = new T.CanvasTexture(canvas); texture.colorSpace = T.SRGBColorSpace; texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); return texture;
  }
  async function object(index: number) {
    let promise = cache.get(index);
    if (!promise) {
      promise = (async () => {
        let group: T.Group;
        if (index === 0) {
          const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(publicAsset('/assets/models/pipe-wrench.glb'));
          group = gltf.scene;
          if (disposed) { release(group); return group; }
          group.traverse(value => {
            if (!(value instanceof T.Mesh)) return;
            const materials = Array.isArray(value.material) ? value.material : [value.material];
            materials.forEach(material => {
              if (!(material instanceof T.MeshStandardMaterial)) return;
              // Recolour only the yellow paint. Grey steel and wear retain their maps.
              material.onBeforeCompile = shader => {
                shader.vertexShader = 'varying float vWrenchLength;\n' + shader.vertexShader;
                shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvWrenchLength = position.x;');
                shader.fragmentShader = 'varying float vWrenchLength;\n' + shader.fragmentShader;
                shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
                  float yellow = smoothstep(.025,.12,min(diffuseColor.r,diffuseColor.g)-diffuseColor.b)
                    * smoothstep(.5,.85,diffuseColor.g/max(diffuseColor.r,.001));
                  float brightness = max(diffuseColor.r,diffuseColor.g);
                  vec3 redPaint = brightness * vec3(1.,.045,.065);
                  vec3 blackPaint = brightness * vec3(.065,.073,.08);
                  vec3 paint = mix(redPaint,blackPaint,smoothstep(.48,.55,vWrenchLength));
                  diffuseColor.rgb = mix(diffuseColor.rgb,paint,yellow);`);
              };
              material.customProgramCacheKey = () => 'pipe-wrench-red-black-v1';
              material.needsUpdate = true;
            });
          });
          group.quaternion.setFromAxisAngle(new T.Vector3(1,0,0),Math.PI/2);
          group.quaternion.premultiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),Math.PI/2+.25));
        } else if (index === 6) {
          const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(publicAsset('/assets/models/macbook-pro-16.glb')); group = gltf.scene;
          if (disposed) { release(group); return group; }
          group.updateMatrixWorld(true); const texture = screenTexture(); let screenFound = false;
          group.traverse(value => {
            if (!(value instanceof T.Mesh)) return;
            const materials: T.Material[] = Array.isArray(value.material) ? value.material : [value.material];
            // The original Mac has a separate transmissive glass pane over its display.
            // Hide that pane only; the screen remains unlit and free of reflections.
            if (materials.some(material => material.name === 'Material.005')) { value.visible = false; return; }

            if (!materials.some(m => m.name === 'Material.008')) return;
            const bounds = new T.Box3().setFromObject(value), size = bounds.getSize(new T.Vector3()), positions = value.geometry.getAttribute('position'), uv: number[] = [], vertex = new T.Vector3();
            for (let i = 0; i < positions.count; i++) { vertex.fromBufferAttribute(positions, i).applyMatrix4(value.matrixWorld); uv.push((vertex.x - bounds.min.x) / size.x, (vertex.y - bounds.min.y) / size.y); }
            value.geometry.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
            materials.forEach(m => { Object.values(m).forEach(v => { if (v instanceof T.Texture) v.dispose(); }); m.dispose(); });
            value.material = new T.MeshBasicMaterial({ map: texture, side: T.DoubleSide, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }); screenFound = true;
          });
          if (!screenFound) { texture.dispose(); release(group); throw Error('MacBook display missing'); }
          group.rotation.y = -.10;
        } else group = createProfileObject(index, accent);
        group.traverse(value => { if (value instanceof T.Mesh) (Array.isArray(value.material) ? value.material : [value.material]).forEach(material => { Object.values(material).forEach(property => { if (property instanceof T.Texture) property.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy()); }); }); });
        group.updateMatrixWorld(true); const bounds = new T.Box3().setFromObject(group), size = bounds.getSize(new T.Vector3()), center = bounds.getCenter(new T.Vector3());
        const normalized = new T.Group(), scale = 3 / Math.max(size.x, size.y, size.z); normalized.add(group); normalized.scale.setScalar(scale); normalized.position.copy(center.multiplyScalar(-scale));
        const wrapper = new T.Group(); wrapper.add(normalized);
        if (disposed) release(wrapper); else resources.add(wrapper);
        return wrapper;
      })(); cache.set(index, promise); void promise.catch(() => cache.delete(index));
    }
    return promise;
  }
  async function setStage(index: number) {
    const request = ++requested; onLoading(); clearTimeout(preload);
    try {
      const next = await object(index); if (disposed || request !== requested) return;
      root.clear(); currentStage = index; current = next; root.add(next); entrance = 0; interacted = false;
      renderer.domElement.setAttribute('aria-label', `${objectNames[index]} 3D`); resize(); onReady(); sync();
      preload = setTimeout(() => { if (!disposed) void object((index + 1) % 7).catch(() => { /* Retry when this stage is selected. */ }); }, 650);
    } catch { if (!disposed && request === requested) onError(); }
  }
  function render() { if (disposed || !visible || document.hidden || renderer.getContext().isContextLost()) return; renderer.clear(); renderer.render(background, camera); renderer.clearDepth(); renderer.render(scene, camera); }
  function tick(now: number) {
    frame = 0; if (disposed || !visible || document.hidden || renderer.getContext().isContextLost()) return;
    if (now - previous > 32) { const dt = Math.min((now - previous) / 1000, .05); previous = now; elapsed += dt;
      if (current) { entrance = Math.min(1, entrance + dt / .8); const remainder = (1 - entrance) ** 3; root.position.y = -remainder * .12 + (!interacted ? Math.sin(elapsed * .7) * .025 : 0); root.rotation.y = remainder * .65; }
      render();
    }
    if (!interacted) frame = requestAnimationFrame(tick);
  }
  function sync() { if (visible && !document.hidden && !disposed && !renderer.getContext().isContextLost()) { render(); if (!frame && !interacted) { previous = performance.now(); frame = requestAnimationFrame(tick); } } else { cancelAnimationFrame(frame); frame = 0; } }
  function interaction() { interacted = true; root.rotation.y = 0; root.position.y = 0; cancelAnimationFrame(frame); frame = 0; }
  controls.addEventListener('start', interaction); controls.addEventListener('change', render);
  function resetView() { camera.position.copy(home); controls.target.set(0, 0, 0); controls.update(); render(); }
  function setInteractionEnabled(enabled: boolean) {
    const changed = expanded !== enabled;
    expanded = enabled;
    controls.enabled = enabled;
    renderer.domElement.tabIndex = enabled ? 0 : -1;
    renderer.domElement.style.touchAction = enabled ? 'none' : 'pan-y';
    if (!changed) return;
    entrance = 1;
    if (enabled) interaction();
    else { interacted = false; resetView(); sync(); }
  }
  function pointerChange() { setInteractionEnabled(expanded); }
  function keydown(event: KeyboardEvent) {
    if (!controls.enabled) return;
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation(); interaction(); if (event.key === 'Home') { resetView(); return; }
    const position = new T.Spherical().setFromVector3(camera.position.clone());
    if (event.key === 'ArrowLeft') position.theta -= .12; if (event.key === 'ArrowRight') position.theta += .12;
    if (event.key === 'ArrowUp') position.phi = Math.max(.12, position.phi - .12); if (event.key === 'ArrowDown') position.phi = Math.min(Math.PI - .12, position.phi + .12);
    if (event.key === '+' || event.key === '=') position.radius = Math.max(controls.minDistance, position.radius * .9); if (event.key === '-') position.radius = Math.min(controls.maxDistance, position.radius * 1.1);
    camera.position.setFromSpherical(position); controls.update(); render();
  }
  renderer.domElement.addEventListener('keydown', keydown);
  function resize() {
    if (!host.clientWidth || !host.clientHeight || disposed) return;
    camera.aspect = host.clientWidth / host.clientHeight;
    const vFov = T.MathUtils.degToRad(camera.fov), hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect), nextDistance = (currentStage === 6 ? 1.7 : 2) / Math.sin(Math.min(vFov, hFov) / 2);
    home.set(0, nextDistance * .16, nextDistance); if (interacted) camera.position.multiplyScalar(nextDistance / distance); else camera.position.copy(home);
    distance = nextDistance; controls.minDistance = distance * .5; controls.maxDistance = distance * 2; camera.updateProjectionMatrix(); controls.update();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, expanded ? 2 : 1.5)); renderer.setSize(host.clientWidth, host.clientHeight, false); pointerChange(); sync();
  }
  const sizeObserver = new ResizeObserver(resize), observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting && entry.intersectionRatio >= .12; sync(); }, { threshold: [0, .12] }); sizeObserver.observe(host); observer.observe(host);
  function setTheme(value: boolean) { dark = value; accent.color.set(value ? 0x00b9d1 : 0x0755c9); rim.color.set(value ? 0x00d9f5 : 0xffffff); rim.intensity = value ? .8 : .45; glow.material.uniforms.dark.value = value ? 1 : 0; renderer.toneMappingExposure = value ? 1.1 : 1.0; render(); }
  function attachTo(target: HTMLElement) { if (disposed) return; sizeObserver.unobserve(host); observer.unobserve(host); host = target; host.append(renderer.domElement); sizeObserver.observe(host); observer.observe(host); resize(); }
  const unbindRecovery = bindSceneRecovery(renderer.domElement, sync);
  document.addEventListener('visibilitychange', sync); resize(); setTheme(dark); void setStage(initialStage);
  return { setStage: index => { void setStage(index); }, setTheme, attachTo, resetView, setInteractionEnabled, dispose() {
    disposed = true; ++requested; clearTimeout(preload); cancelAnimationFrame(frame); sizeObserver.disconnect(); observer.disconnect();
    document.removeEventListener('visibilitychange', sync); unbindRecovery(); renderer.domElement.removeEventListener('keydown', keydown);
    controls.removeEventListener('start', interaction); controls.removeEventListener('change', render); controls.dispose(); resources.forEach(release); resources.clear(); cache.clear(); accent.dispose(); glow.geometry.dispose(); glow.material.dispose(); environment.dispose(); scene.clear(); background.clear(); renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
  } };
}




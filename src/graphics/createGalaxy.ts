import { createScrollPrompt } from './createScrollPrompt';
import { bindSceneRecovery } from './bindSceneRecovery';
import * as THREE from 'three';
import { fitGalaxyCamera, getGalaxyPointScale } from './fitGalaxyCamera';

export interface GalaxyPresentation { left:number; top:number; width:number; height:number; formation:number }
export interface GalaxyController {
  refreshPrompt: () => void;
  setPresentation: (presentation: GalaxyPresentation) => void;
  setPaused: (paused: boolean) => void;
  setTheme: (dark: boolean) => void;
  dispose: () => void;
}

type ParticleScene = THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;

/** Direct port of Angular's galaxy renderer. Only framework lifecycle is adapted. */
class AngularGalaxy implements GalaxyController {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private initialCameraPosition = new THREE.Vector3();
  private renderer!: THREE.WebGLRenderer;
  private coreSphere!: ParticleScene;
  private orbitRings!: THREE.Group;
  private mainGroup!: THREE.Group;
  private centerText!: THREE.Sprite;
  private currentLabelSize=0;
  private scrollPrompt!: ReturnType<typeof createScrollPrompt>;
  private presentation: GalaxyPresentation | null = null;
  private fittedAspect = 0;
  private fittedZoom = 1;
  private readonly clock = {value:0};
  private readonly pixelRatio = {value:1};
  private constellationPoints?: THREE.PointsMaterial;
  private readonly compactMedia = matchMedia('(max-width: 1100px), (pointer: coarse)');
  private lastFrameTime: number | null = null;
  private orbitTime = 0;
  private readonly formation = { value: 1 };
  private readonly particleProjection = { value: 300 };
  private readonly orbitSpeed = Math.PI * 2 / 40; // one complete revolution every 40 seconds
  private animationId: number | null = null;
  private host: HTMLElement;
  private promptLabel: string;
  private paused: boolean;
  private dark: boolean;
  private visible = true;
  private disposed = false;
  private resizeObserver: ResizeObserver;
  private intersectionObserver: IntersectionObserver;
  private unbindRecovery: () => void;

  constructor(host: HTMLElement, dark: boolean, paused: boolean, promptLabel: string) {
    this.host = host;
    this.promptLabel = promptLabel;
    this.paused = paused;
    this.dark = dark;
    this.galaxyColors = dark ? this.darkGalaxyColors : this.lightGalaxyColors;
    this.currentTextColor = dark ? this.darkTextColor : this.lightTextColor;
    this.currentTechColor = dark ? this.darkTechColor : this.lightTechColor;
    this.initGalaxy();
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(host);
    this.intersectionObserver = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      this.sync();
    }, { threshold: .05 });
    this.intersectionObserver.observe(host);
    document.addEventListener('visibilitychange', this.sync);
    this.unbindRecovery = bindSceneRecovery(this.renderer.domElement, this.sync);
    this.renderer.render(this.scene, this.camera);
    this.sync();
  }

  private projectPresentation(): void {
    const width=this.host.clientWidth,height=this.host.clientHeight;
    const box=this.presentation ?? {left:0,top:0,width,height,formation:1};
    const aspect=box.width/box.height;
    if(Math.abs(aspect-this.fittedAspect)>.0001){
      this.camera.clearViewOffset();this.camera.aspect=aspect;
      this.camera.position.copy(this.initialCameraPosition);this.camera.lookAt(0,0,0);
      this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld(true);this.mainGroup.updateMatrixWorld(true);
      fitGalaxyCamera(this.camera,[this.coreSphere,...this.orbitRings.children.filter((object):object is ParticleScene=>object instanceof THREE.Points)]);
      this.fittedZoom=this.camera.zoom;this.fittedAspect=aspect;
    }
    this.camera.zoom=this.fittedZoom;
    // Expand the camera beyond the resting art slot instead of cropping particles to a card.
    this.camera.setViewOffset(box.width,box.height,-box.left,-box.top,width,height);
    this.particleProjection.value=getGalaxyPointScale(this.camera,box.height,this.renderer.getPixelRatio());
    const textWidth=Math.min(580,width*.9);
    this.scrollPrompt.material.uniforms.promptScale.value.set(textWidth/width,textWidth*160/768/height);
    this.scrollPrompt.material.uniforms.promptCentre.value.set((box.left+box.width/2)/width*2-1,1-(box.top+box.height/2)/height*2);
  }

  private resize = (): void => {
    if(this.disposed||!this.host.clientWidth||!this.host.clientHeight)return;
    const width=this.host.clientWidth,height=this.host.clientHeight;
    const pixelRatio=Math.min(window.devicePixelRatio||1,this.compactMedia.matches?1.5:2,Math.sqrt(4000000/(width*height)));
    this.pixelRatio.value=pixelRatio;this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(width,height,false);
    this.scrollPrompt.material.uniforms.pixelRatio.value=pixelRatio;
    if(this.currentLabelSize!==this.labelSize())this.updateTextColors();
    this.projectPresentation();this.renderer.render(this.scene,this.camera);
  };

  private sync = (): void => {
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    this.animationId = null;
    this.lastFrameTime = null;
    if (!this.disposed && !this.paused && this.visible && !document.hidden && !this.renderer.getContext().isContextLost()) {
      this.animationId = requestAnimationFrame(this.animate);
    }
  };

  setPresentation(presentation: GalaxyPresentation): void {
    this.presentation=presentation;
    const value=THREE.MathUtils.clamp(presentation.formation,0,1);
    this.formation.value=value;
    this.centerText.material.opacity=THREE.MathUtils.smoothstep(value,.65,1);
    this.projectPresentation();
    if(this.visible&&!document.hidden&&!this.renderer.getContext().isContextLost())this.renderer.render(this.scene,this.camera);
  }

  refreshPrompt(): void {
    this.mainGroup.remove(this.scrollPrompt);
    this.scrollPrompt.geometry.dispose();this.scrollPrompt.material.dispose();
    this.scrollPrompt=createScrollPrompt(this.promptLabel,this.formation,this.clock,this.dark);
    this.scrollPrompt.material.uniforms.pixelRatio.value=this.pixelRatio.value;
    this.mainGroup.add(this.scrollPrompt);this.projectPresentation();
    if(this.visible&&!document.hidden&&!this.renderer.getContext().isContextLost())this.renderer.render(this.scene,this.camera);
  }

  setPaused(paused: boolean): void { this.paused = paused; this.sync(); }

  setTheme(dark: boolean): void {
    this.dark = dark;
    this.coreSphere.material.uniforms.darkMode.value = dark ? 1 : 0;
    this.coreSphere.material.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    this.galaxyColors = dark ? this.darkGalaxyColors : this.lightGalaxyColors;
    this.currentTextColor = dark ? this.darkTextColor : this.lightTextColor;
    this.currentTechColor = dark ? this.darkTechColor : this.lightTechColor;
    this.constellationPoints?.color.set(this.currentTextColor);
    this.scrollPrompt.material.uniforms.tint.value.set(dark ? 0x00d9ff : 0x0755c9).multiplyScalar(dark?2.2:1);
    this.scrollPrompt.material.blending=dark ? THREE.AdditiveBlending : THREE.NormalBlending;
    this.updateGalaxyColors();
    this.updateTextColors();
    this.renderer.render(this.scene, this.camera);
  }

  dispose(): void {
    this.disposed = true;
    if (this.animationId !== null) cancelAnimationFrame(this.animationId);
    this.resizeObserver.disconnect();
    this.intersectionObserver.disconnect();
    document.removeEventListener('visibilitychange', this.sync);
    this.unbindRecovery();
    this.scene.traverse(object => {
      if (object instanceof THREE.Points || object instanceof THREE.LineSegments) {
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach(material => material.dispose());
      } else if (object instanceof THREE.Sprite) {
        object.material.map?.dispose();
        object.material.dispose();
      }
    });
    this.scene.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();

    this.renderer.domElement.remove();
  }

  // Colori per tema scuro (brillanti)
  private darkGalaxyColors = [
    new THREE.Color(0x00b8d4).multiplyScalar(1.3),
    new THREE.Color(0x00d9ff).multiplyScalar(1.3),
    new THREE.Color(0x4dffff).multiplyScalar(1.2),
    new THREE.Color(0x0891b2).multiplyScalar(1.2),
    new THREE.Color(0x06b6d4).multiplyScalar(1.1)
  ];

  // Sapphire particles and navy rings contrast with the gray light theme.
  private lightGalaxyColors = [
    new THREE.Color(0x0755c9),
    new THREE.Color(0x0755c9),
    new THREE.Color(0x0755c9),
    new THREE.Color(0x00338d),
    new THREE.Color(0x0755c9)
  ];

  private galaxyColors = this.darkGalaxyColors;

  private darkTextColor = '#00d9ff';
  private darkTechColor = '#4dffff';
  private lightTextColor = '#0755c9';
  private lightTechColor = '#00338d';
  private currentTextColor = this.darkTextColor;
  private currentTechColor = this.darkTechColor;

  // Se true, verranno mostrati i nomi delle tecnologie sugli anelli; impostare a false per nasconderli
  private showTechNames = false;

  private technologies = ['React', 'Angular', 'Node.js', 'TypeScript', 'JavaScript', 'Java', 'Python', 'HTML5', 'CSS3', 'Sass'];

  private pointMaterialShader = {
    vertexShader: `
      attribute float size;
      attribute vec4 scatter;
      uniform float formation;
      uniform float cloudPixelRatio;
      varying float particleVisibility;
      varying vec3 vColor;
      varying float vDistance;
      uniform float time;
      uniform float particleProjection;
      void main() {
        vColor=color;
        // Finished geometry retains its approved static shape. Only uncollected dust drifts.
        vec3 pos=position+vec3(sin(position.z*.5),cos(position.x*.5),sin(position.y*.5))*.05;
        vec4 target=projectionMatrix*modelViewMatrix*vec4(pos,1.);
        vec4 viewPosition=modelViewMatrix*vec4(pos,1.);vDistance=-viewPosition.z;
        float ambient=step(scatter.w,.012);
        float gather=formation*(1.-ambient);
        vec2 drift=vec2(sin(time*.35+scatter.z*8.),cos(time*.28+scatter.z*11.))*.018;
        vec2 cloud=mod(scatter.xy+drift+1.,2.)-1.;
        gl_Position=vec4(mix(cloud,target.xy/target.w,gather),target.z/target.w,1.);
        particleVisibility=mix(step(scatter.w,.065)*.65,1.,smoothstep(.05,.8,formation));
        particleVisibility=mix(particleVisibility,.32,ambient);
        float projected=size*(particleProjection/-viewPosition.z)*(sin(length(position))*.15+1.);
        gl_PointSize=mix((1.4+scatter.w*1.6)*cloudPixelRatio,projected,gather);
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vDistance;
      uniform float time;
      uniform float darkMode;
      varying float particleVisibility;
      
      void main() {
        vec2 cxy = 2.0 * gl_PointCoord - 1.0;
        float r = dot(cxy, cxy);
        if (r > 1.0) discard;
        if (darkMode < .5) {
          gl_FragColor = vec4(vColor, (1. - smoothstep(.45, 1., r)) * .72 * particleVisibility);
          #include <colorspace_fragment>
          return;
        }
        float glow = exp(-r * 2.5);
        float outerGlow = exp(-r * 1.5) * 0.3;
        vec3 finalColor = vColor * 1.2;
        finalColor += vec3(0.2, 0.4, 0.6) * outerGlow;
        float distanceFade = 1.0 - smoothstep(0.0, 50.0, vDistance);
        float intensity = mix(0.7, 1.0, distanceFade);
        gl_FragColor = vec4(finalColor * intensity, (glow + outerGlow) * distanceFade * particleVisibility);
      }
    `
  };

  private initGalaxy(): void {
    const container = this.host;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.01);

    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true
    });
    this.renderer.setSize(width, height, false);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, this.compactMedia.matches ? 1.5 : 2));

    container.appendChild(this.renderer.domElement);

    const isMobile = width < 768;

    // Preserve the approved desktop view on every home viewport. A larger
    // container must not tilt the camera down or bring the front arc closer.
    if (this.host.closest('.home-hero')) this.camera.position.set(0, 3, 16);
    else this.camera.position.set(0, isMobile ? 3 : 5, isMobile ? 16 : 15);
    this.initialCameraPosition.copy(this.camera.position);
    this.camera.lookAt(0, 0, 0);

    const numRings = 8;
    const techsToShow = this.technologies.slice(0, numRings);

    this.coreSphere = this.createSpiralSphere(4, 25000, this.galaxyColors);
    this.orbitRings = this.createOrbitRings(5.05, numRings, 0.16, this.galaxyColors);

    this.mainGroup = new THREE.Group();
    const scaleValue = this.host.closest('.home-hero') ? 1.4 : isMobile ? 1.4 : 1.6;
    this.mainGroup.scale.set(scaleValue, scaleValue, scaleValue);
    this.mainGroup.add(this.coreSphere);
    this.mainGroup.add(this.orbitRings);

    const centerTextSize = this.labelSize();
    this.currentLabelSize=centerTextSize;
    this.centerText = this.createTextSprite('WEB & MOBILE\nDEVELOPER', centerTextSize, this.currentTextColor);
    this.centerText.position.set(0, 0, 0);
    this.mainGroup.add(this.centerText);

    const techTextSize = isMobile ? 32 : 40;
    if (this.showTechNames) {
      this.orbitRings.children.forEach((ring, index) => {
        if (index < techsToShow.length) {
          const techSprite = this.createTextSprite(techsToShow[index], techTextSize, this.currentTechColor);
          techSprite.position.set(6, 0, 0);
          ring.add(techSprite);
        }
      });
    }

    // Home uses one shared section-wide star field, including behind its copy.
    if (!this.host.closest('.home-hero')) this.mainGroup.add(this.createConstellation());
    this.scrollPrompt=createScrollPrompt(this.promptLabel,this.formation,this.clock,this.dark);
    this.mainGroup.add(this.scrollPrompt);
    this.scene.add(this.mainGroup);
  }

  private createSpiralSphere(radius: number, particleCount: number, colors: THREE.Color[]): ParticleScene {
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const scatter: number[] = [];
    const particleColors: number[] = [];
    const sizes: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / particleCount);
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      positions.push(x, y, z);
      // Stable seeds keep the exact same particle trajectories when scrolling backwards.
      const seed = (Math.sin(i * 127.1 + 311.7) * 43758.5453) % 1;
      const seed2 = (Math.sin(i * 269.5 + 183.3) * 43758.5453) % 1;
      const seed3 = (Math.sin(i * 419.2 + 73.1) * 43758.5453) % 1;
      scatter.push(seed * .98, seed2 * .98, seed3, Math.abs((Math.sin(i * 53.9 + 17.3) * 43758.5453) % 1));

      const colorPos = i / particleCount;
      const color1 = colors[Math.floor(colorPos * (colors.length - 1))];
      const color2 = colors[Math.ceil(colorPos * (colors.length - 1))];
      const mixRatio = (colorPos * (colors.length - 1)) % 1;
      const finalColor = new THREE.Color().lerpColors(color1, color2, mixRatio);
      particleColors.push(finalColor.r, finalColor.g, finalColor.b);

      sizes.push(Math.random() * 0.15 + 0.08);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('scatter', new THREE.Float32BufferAttribute(scatter, 4));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        cloudPixelRatio:this.pixelRatio, formation: this.formation, time: this.clock, darkMode: { value: this.dark ? 1 : 0 }, particleProjection: this.particleProjection
      },
      vertexShader: this.pointMaterialShader.vertexShader,
      fragmentShader: this.pointMaterialShader.fragmentShader,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: this.dark ? THREE.AdditiveBlending : THREE.NormalBlending
    });

    return new THREE.Points(geometry, material);
  }

  private createOrbitRings(radius: number, count: number, thickness: number, paletteColors: THREE.Color[]): THREE.Group {
    const group = new THREE.Group();
    for (let i = 0; i < count; i++) {
      const geometry = new THREE.BufferGeometry();
      const positions: number[] = [], colors: number[] = [], sizes: number[] = [];
      const phases: number[] = [], offsets: number[] = [];
      const particleCount = 1800;
      const ringRadius = radius + i * .22;
      const centerY = 1.1;
      // Each fixed track has one hue: blue, cyan, blue, cyan.
      // Preserve its tone attribute when switching themes.
      const tones = new Uint8Array(particleCount);
      tones.fill(i % 2 === 0 ? 1 : 0);
      for (let j = 0; j < particleCount; j++) {
        const phase = j / particleCount * Math.PI * 2;
        const radial = (Math.random() - .5) * thickness;
        const vertical = (Math.random() - .5) * thickness;
        const depth = (Math.random() - .5) * thickness;
        phases.push(phase); offsets.push(radial, vertical, depth);
        positions.push(Math.cos(phase) * (ringRadius + radial), centerY + Math.sin(phase) * ringRadius * .18 + vertical, -Math.sin(phase) * ringRadius * Math.sqrt(1 - .18 * .18) + depth);
        const color = tones[j] === 1 ? new THREE.Color(this.dark ? 0x237be0 : 0x00338d) : paletteColors[1].clone();
        if (tones[j] === 1 && this.dark) color.multiplyScalar(1.5);
        colors.push(color.r, color.g, color.b);
        sizes.push(.065 + Math.random() * .025);
      }
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
      geometry.setAttribute('tone', new THREE.Uint8BufferAttribute(tones, 1));
      geometry.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1));
      geometry.setAttribute('offset', new THREE.Float32BufferAttribute(offsets, 3));
      const material = new THREE.ShaderMaterial({
        uniforms: {
          formation: this.formation, flowTime: { value: 0 }, angularSpeed: { value: this.orbitSpeed },
          particleProjection: this.particleProjection,
          radius: { value: ringRadius }, centerY: { value: centerY }, phaseOffset: { value: i * .9 },
        },
        vertexShader: `
          attribute float size; attribute float phase; attribute vec3 offset;
          uniform float flowTime; uniform float angularSpeed;
          uniform float radius; uniform float centerY; uniform float phaseOffset;
          uniform float particleProjection;
          uniform float formation;
          varying vec3 vColor; varying float vEnergy;
          varying vec3 vViewPosition; varying vec3 vCoreCenter; varying float vCoreRadius;
          void main() {
            float angle = phase + flowTime * angularSpeed;
            vec3 point = vec3(cos(angle) * (radius + offset.x), centerY + sin(angle) * radius * .18 + offset.y, -sin(angle) * radius * sqrt(1. - .18 * .18) + offset.z);
            vec4 viewPosition = modelViewMatrix * vec4(point, 1.);
            vViewPosition = viewPosition.xyz;
            vCoreCenter = (modelViewMatrix * vec4(0., 0., 0., 1.)).xyz;
            vCoreRadius = length(modelViewMatrix[0].xyz) * 4.;
            // Bright packets belong to the particles, so they travel around
            // the ellipse rather than making the entire ring pulse in place.
            vEnergy = .8 + pow(max(0., cos(phase * 3. + phaseOffset)), 12.) * .2;
            vColor = color;
            gl_Position = projectionMatrix * viewPosition;
            gl_PointSize = size * (particleProjection / -viewPosition.z) * (1. + vEnergy * .45);
          }`,
        fragmentShader: `
          uniform float formation;
          varying vec3 vColor; varying float vEnergy;
          varying vec3 vViewPosition; varying vec3 vCoreCenter; varying float vCoreRadius;
          void main() {
            float r = length(gl_PointCoord * 2. - 1.);
            if (r > 1.) discard;
            // Occlude only the far side of the rings: the near side crosses
            // naturally in front of the spherical nucleus, like Saturn.
            vec3 ray = normalize(vViewPosition);
            float alongRay = dot(ray, vCoreCenter);
            float separation = dot(vCoreCenter, vCoreCenter) - alongRay * alongRay;
            float coreSquared = vCoreRadius * vCoreRadius;
            if (separation < coreSquared) {
              float surface = alongRay - sqrt(coreSquared - separation);
              if (length(vViewPosition) > surface + .03) discard;
            }
            // Keep each particle consistently visible, with a short soft rim.
            // Normal blending preserves its hue without adding a bright belt.
            float particleAlpha = (1. - smoothstep(.62, 1., r)) * .88;
            gl_FragColor = vec4(vColor, particleAlpha * smoothstep(.45, 1., formation));
            #include <colorspace_fragment>
          }`,
        vertexColors: true, transparent: true, depthWrite: false,
        blending: THREE.NormalBlending,
      });
      const ring = new THREE.Points(geometry, material);
      // A single inclined orbital plane keeps all eight tracks coherent.
      // The plane stays still; only the particles advance along each circle.
      ring.rotation.z = 0;
      ring.renderOrder = 2;
      group.add(ring);
    }
    return group;
  }

  private createConstellation(): THREE.Group {
    const group = new THREE.Group();
    const positions: number[] = [];
    let seed = 28;
    const random = () => {
      seed = (1664525 * seed + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    // Restore the original scattered star field, with no connecting lines.
    for (let i = 0; i < 1100; i++) {
      const angle = random() * Math.PI * 2;
      const radius = 4.7 + random() * 5.5;
      positions.push(Math.cos(angle) * radius, Math.sin(angle) * radius * .85, -4 + random() * 5);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.constellationPoints = new THREE.PointsMaterial({ color: this.currentTextColor, size: .055, transparent: true, opacity: .5, depthWrite: false });
    group.add(new THREE.Points(geometry, this.constellationPoints));
    return group;
  }

  private textTexture(text: string, size: number, color: string): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas text is unavailable');
    context.scale(2, 2);
    context.font = `700 ${size}px "Inter", sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = color;
    const lines = text.split('\n');
    lines.forEach((line, index) => {
      const y = 128 + (index - (lines.length - 1) / 2) * size * 1.3;
      // A crisp dark outline keeps the original cyan lettering readable over
      // both the luminous core and orbit particles, without a blurred halo.
      context.shadowBlur = 0;
      context.strokeStyle = this.dark ? '#031016' : '#c6cbcb';
      context.lineWidth = 1.5;
      context.lineJoin = 'round';
      context.strokeText(line, 256, y);
      context.fillText(line, 256, y);
    });
    const texture = new THREE.CanvasTexture(canvas);
    if (!this.dark) texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  private createTextSprite(text: string, size = 64, color = '#00d9ff'): THREE.Sprite {
    const material = new THREE.SpriteMaterial({ map: this.textTexture(text, size, color), transparent: true, opacity: 1, depthTest: false, depthWrite: false, toneMapped: false, fog: false });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(8, 4, 1);
    sprite.renderOrder = 10;
    return sprite;
  }

  private animate = (now: number): void => {
    if (this.disposed || this.paused || !this.visible || document.hidden) return;
    this.animationId = requestAnimationFrame(this.animate);

    // A steady 30 fps suffices for the slow orbit on compact/touch screens.
    // Advance by real elapsed time, so this does not change particle speed.
    const compact = this.compactMedia.matches;
    if (compact && this.lastFrameTime !== null && now - this.lastFrameTime < 32) return;
    const dt = this.lastFrameTime === null ? 0 : Math.min((now - this.lastFrameTime) / 1000, .05);
    this.lastFrameTime = now;
    // The ellipse meshes and all their transforms stay fixed. Only particle
    // phases advance in the vertex shader, at a constant angular speed.
    this.orbitTime += dt;
    this.clock.value += dt;
    this.orbitRings.children.forEach(ring => {
      (ring as ParticleScene).material.uniforms['flowTime'].value = this.orbitTime;
    });

    this.renderer.render(this.scene, this.camera);
  }

  private updateGalaxyColors(): void {
    // Aggiorna i colori della sfera centrale
    if (this.coreSphere) {
      const geometry = this.coreSphere.geometry;
      const colors = geometry.getAttribute('color');
      const positions = geometry.getAttribute('position');
      const particleCount = positions.count;

      for (let i = 0; i < particleCount; i++) {
        const colorPos = i / particleCount;
        const color1 = this.galaxyColors[Math.floor(colorPos * (this.galaxyColors.length - 1))];
        const color2 = this.galaxyColors[Math.ceil(colorPos * (this.galaxyColors.length - 1))];
        const mixRatio = (colorPos * (this.galaxyColors.length - 1)) % 1;
        const finalColor = new THREE.Color().lerpColors(color1, color2, mixRatio);
        colors.setXYZ(i, finalColor.r, finalColor.g, finalColor.b);
      }
      colors.needsUpdate = true;
    }

    // Aggiorna i colori degli anelli orbitali
    if (this.orbitRings) {
      this.orbitRings.children.forEach(ring => {
        const points = ring as ParticleScene;
        if (points.geometry) {
          const geometry = points.geometry;
          const colors = geometry.getAttribute('color');
          const positions = geometry.getAttribute('position');
          const particleCount = positions.count;

          for (let j = 0; j < particleCount; j++) {
            const tone = geometry.getAttribute('tone').getX(j);
            const color = tone === 1 ? new THREE.Color(this.dark ? 0x237be0 : 0x00338d) : this.galaxyColors[1].clone();
            if (tone === 1 && this.dark) color.multiplyScalar(1.5);
            colors.setXYZ(j, color.r, color.g, color.b);
          }
          colors.needsUpdate = true;
        }
      });
    }
  }

  private labelSize(): number {
    const slot=this.host.closest('.home-hero')?.querySelector<HTMLElement>('.hero-art');
    return (slot?.clientWidth ?? this.host.clientWidth)<768 ? 49 : 66;
  }

  private updateTextColors(): void {
    if (this.centerText) {
      const size = this.labelSize();
      this.currentLabelSize=size;
      this.centerText.material.map?.dispose();
      this.centerText.material.map = this.textTexture('WEB & MOBILE\nDEVELOPER', size, this.currentTextColor);
      this.centerText.material.needsUpdate = true;
    }

    // Aggiorna i testi delle tecnologie solo se abilitati
    if (this.showTechNames && this.orbitRings) {
      this.orbitRings.children.forEach((ring, index) => {
        if (ring.children.length > 0) {
          const techSprite = ring.children[0] as THREE.Sprite;
          if (techSprite && index < this.technologies.length) {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d')!;
            canvas.width = 512;
            canvas.height = 128;

            context.fillStyle = 'transparent';
            context.fillRect(0, 0, canvas.width, canvas.height);

            const size = 40;
            context.font = `bold ${size}px "Space Grotesk", sans-serif`;
            context.fillStyle = this.currentTechColor;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(this.technologies[index], canvas.width / 2, canvas.height / 2);

            context.shadowColor = this.currentTechColor;
            context.shadowBlur = 20;
            context.fillText(this.technologies[index], canvas.width / 2, canvas.height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            techSprite.material.map?.dispose();
            techSprite.material.map = texture;
            (techSprite.material as THREE.SpriteMaterial).needsUpdate = true;
          }
        }
      });
    }
  }
}

export function createGalaxy(host: HTMLElement, dark: boolean, initiallyPaused: boolean, promptLabel = 'SCORRI'): GalaxyController {
  return new AngularGalaxy(host, dark, initiallyPaused, promptLabel);
}

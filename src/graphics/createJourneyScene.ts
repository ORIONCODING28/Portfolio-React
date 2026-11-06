import { bindSceneRecovery } from './bindSceneRecovery';
import * as THREE from 'three';
import { journeyFrame, journeyNodeReveal } from './journeyTimeline';

// Keep the construction across route changes until a full page reload.
let pageElapsed=0;

/** Reconstruct the six luminous milestones and stardust path of the approved artwork. */
export interface JourneyStage { index: number; x: number; y: number; opacity: number; revealed:number }
export interface JourneyController { select(index: number | null): void; setTheme(dark: boolean): void; dispose(): void }
export function createJourneyScene(host: HTMLElement, onStage: (stage: JourneyStage | null) => void, onLayout: (points: { x: number; y: number }[]) => void, dark = true): JourneyController {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden','true');
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-10, 10, 4, -4, .1, 100);
  camera.position.z = 20;
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-8.8,-2.2,0), new THREE.Vector3(-5.6,-1.62,0),
    new THREE.Vector3(-3.72,-.96,.12), new THREE.Vector3(-1.2,.02,0),
    new THREE.Vector3(2.85,-.97,.15), new THREE.Vector3(5.2,.55,0),
    new THREE.Vector3(7.4,1.62,.1),
  ], false, 'centripetal');
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  let seed = 731;
  const random = () => { seed = (Math.imul(seed,1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const uniforms = { built:{value:0}, progress:{value:0}, projection:{value:1}, tint:{value:new THREE.Vector3(dark ? 0 : .02745,dark ? .83 : .33333,dark ? 1 : .78824)} };
  const geometry = new THREE.BufferGeometry();
  const count=5000;
  const positions=new Float32Array(count*3);
  const phases=new Float32Array(count);
  const brightness=new Float32Array(count);
  const sizes=new Float32Array(count);
  const trail=new Float32Array(count);
  for(let i=0;i<count;i++) {
    const phase=random();
    phases[i]=phase;
      const point=curve.getPointAt(phase);
      const dust=i>1050;
      trail[i]=dust ? 0 : 1;
      const spread=dust ? .35+random()*1.8 : .055;
      const offset=new THREE.Vector3((random()-.5)*spread,(random()-.5)*spread,(random()-.5)*spread);
      positions.set([point.x+offset.x,point.y+offset.y,point.z+offset.z],i*3);
      sizes[i]=dust ? .022+random()*.035 : .033+random()*.042;
      brightness[i]=(.12+.78*(1-Math.min(offset.length()*.8,1))) * Math.min(phase/.09,1,(1-phase)/.06);
  }
  geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  geometry.setAttribute('phase',new THREE.BufferAttribute(phases,1));
  geometry.setAttribute('brightness',new THREE.BufferAttribute(brightness,1));
  geometry.setAttribute('size',new THREE.BufferAttribute(sizes,1));
  geometry.setAttribute('trail',new THREE.BufferAttribute(trail,1));
  const material=new THREE.ShaderMaterial({
    uniforms, transparent:true, depthWrite:false, blending:dark ? THREE.AdditiveBlending : THREE.NormalBlending,
    vertexShader:`attribute float phase; attribute float brightness; attribute float size; attribute float trail;
      uniform float progress; uniform float built; uniform float projection;
      varying float intensity;
      void main(){
        float distance=phase-progress;
        // GLSL pow is undefined for a negative base, even with exponent 2.
        float normalizedDistance=distance/.085;
        float wave=exp(-normalizedDistance*normalizedDistance);
        intensity=step(phase,built)*brightness*(.28+wave*1.25*trail);
        gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
        gl_PointSize=max(1.,size*projection);
      }`,
    fragmentShader:`varying float intensity; uniform vec3 tint;
      void main(){float r=length(gl_PointCoord-.5)*2.; if(r>1.)discard;
        gl_FragColor=vec4(tint,intensity*(1.-smoothstep(.2,1.,r)));}`,
  });
  geometries.push(geometry); materials.push(material);
  const flow=new THREE.Points(geometry,material); flow.frustumCulled=false; scene.add(flow);
  const starCanvas=document.createElement('canvas'); starCanvas.width=128; starCanvas.height=128;
  const context=starCanvas.getContext('2d');
  if(!context){renderer.dispose();renderer.domElement.remove();throw new Error('Canvas unavailable');}
  const halo=context.createRadialGradient(64,64,0,64,64,48);
  halo.addColorStop(0,'rgba(255,255,255,.28)'); halo.addColorStop(1,'rgba(255,255,255,0)');
  context.fillStyle=halo; context.fillRect(0,0,128,128);
  context.beginPath(); context.moveTo(64,3);
  context.lineTo(70,57); context.lineTo(121,64); context.lineTo(70,71);
  context.lineTo(64,125); context.lineTo(58,71); context.lineTo(7,64); context.lineTo(58,57);
  context.closePath();
  context.fillStyle='white'; context.fill();
  const starTexture=new THREE.CanvasTexture(starCanvas); textures.push(starTexture);
  const restingColor=new THREE.Color(dark ? 0xffffff : 0xe3e7e8), litColor=new THREE.Color(dark ? 0x00d9f5 : 0x0755c9);
  const nodes: { light: THREE.SpriteMaterial; sprite:THREE.Sprite; size:number; phase: number; position: THREE.Vector3 }[]=[];
  const nodePositions=[[-5.6,-1.62,0,.13],[-3.72,-.96,.12,.25],[-1.2,.02,0,.17],[2.85,-.97,.15,.23],[5.2,.55,0,.17],[7.4,1.62,.1,.26]];
  for (const [x,y,z,radius] of nodePositions) {
    const light=new THREE.SpriteMaterial({map:starTexture,color:restingColor,transparent:true,depthWrite:false,blending:THREE.NormalBlending,opacity:.55});
    materials.push(light);
    const star=new THREE.Sprite(light); star.position.set(x,y,z); const size=.75+radius*1.8; star.scale.set(size,size*1.45,1); scene.add(star);
    let phase=0, nearest=Infinity;
    for(let i=0;i<=256;i++) {
      const distance=curve.getPointAt(i/256).distanceToSquared(star.position);
      if(distance<nearest){nearest=distance;phase=i/256;}
    }
    nodes.push({light,sprite:star,size,phase,position:star.position});
  }
  const nodePhases=nodes.map(node=>node.phase);
  let selected: number | null=null;
  let visible=false, frame=0, last=0, elapsed=pageElapsed;
  const updateSequence=()=>{
    const current=journeyFrame(elapsed,nodePhases);
    const progress=current.progress,activeIndex=current.index;
    uniforms.progress.value=progress;
    uniforms.built.value=current.builtProgress;
    nodes.forEach(({light,sprite,size},index)=>{
      const reveal=journeyNodeReveal(elapsed,index);
      const active=index===activeIndex?current.labelOpacity:0;
      const restingOpacity=dark ? .55 : 1;
      light.opacity=reveal*(restingOpacity+(1-restingOpacity)*active);
      light.color.copy(active>.12?litColor:restingColor);
      sprite.scale.set(size*reveal,size*1.45*reveal,1);
    });
    const {position}=nodes[activeIndex];
    const stage: JourneyStage={
      index:activeIndex,
      x:(position.x-camera.left)/(camera.right-camera.left)*100,
      y:(camera.top-position.y)/(camera.top-camera.bottom)*100,
      opacity:current.labelOpacity*journeyNodeReveal(elapsed,activeIndex),
      revealed:current.revealed,
    };
    onStage(visible ? stage : null);
  };
  const render=()=>renderer.render(scene,camera);
  const tick=(now:number)=>{
    frame=0;
    if(!visible || document.hidden || renderer.getContext().isContextLost() || selected!==null)return;
    if(now-last>=1000/30){
      const delta=last ? Math.min((now-last)/1000,.1) : 0; elapsed+=delta; pageElapsed=elapsed; last=now;
      updateSequence();
      render();
    }
    frame=requestAnimationFrame(tick);
  };
  const sync=()=>{
    cancelAnimationFrame(frame); frame=0; last=0;
    if(visible&&!document.hidden&&!renderer.getContext().isContextLost()&&selected===null)frame=requestAnimationFrame(tick);
    else if(visible&&!document.hidden&&!renderer.getContext().isContextLost()){updateSequence();render();}
  };
  const resize=()=>{
    const width=host.clientWidth, height=host.clientHeight;
    if(!width||!height)return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
    renderer.setSize(width,height,false);
    const aspect=width/height; camera.left=-9.4; camera.right=10.6; camera.top=10/aspect; camera.bottom=-camera.top; camera.updateProjectionMatrix();
    uniforms.projection.value=width*renderer.getPixelRatio()/20;
    onLayout(nodes.map(({position})=>({x:(position.x-camera.left)/(camera.right-camera.left)*100,y:(camera.top-position.y)/(camera.top-camera.bottom)*100})));
    updateSequence(); render();
  };
  const resizeObserver=new ResizeObserver(resize); resizeObserver.observe(host); resize();
  const observer=new IntersectionObserver(entries=>{
    const next=entries[0].isIntersecting && entries[0].intersectionRatio>=.4;
    if(next===visible)return;
    visible=next;
    if(visible)updateSequence(); else onStage(null);
    sync();
  },{threshold:[0,.4],rootMargin:'0px 0px -6% 0px'}); observer.observe(host);
  document.addEventListener('visibilitychange',sync);
  const unbindRecovery=bindSceneRecovery(renderer.domElement,sync);
  return {
    select(index) {
      if(index!==null && (!Number.isInteger(index)||index<0||index>=nodes.length))return;
      selected=index; updateSequence(); render(); sync();
    },
    setTheme(isDark) {
      dark=isDark;
      restingColor.set(isDark ? 0xffffff : 0xe3e7e8);
      litColor.set(isDark ? 0x00d9f5 : 0x0755c9);
      uniforms.tint.value.set(isDark ? 0 : .02745,isDark ? .83 : .33333,isDark ? 1 : .78824);
      material.blending=isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
      updateSequence(); render();
    },
    dispose(){
    cancelAnimationFrame(frame); resizeObserver.disconnect(); observer.disconnect();
    document.removeEventListener('visibilitychange',sync); unbindRecovery();
    geometries.forEach(value=>value.dispose()); materials.forEach(value=>value.dispose()); textures.forEach(value=>value.dispose());
    renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
    },
  };
}

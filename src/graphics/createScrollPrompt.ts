import * as THREE from 'three';

/** Sample real lettering once; every visible point is a particle, not a text image. */
export function createScrollPrompt(label:string,formation:{value:number},time:{value:number},dark:boolean) {
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=128;
  const context=canvas.getContext('2d');if(!context)throw new Error('Canvas unavailable');
  context.font='700 88px "Inter", sans-serif';context.textAlign='center';context.textBaseline='middle';
  context.fillStyle='#fff';context.fillText(label,256,64);
  const pixels=context.getImageData(0,0,512,128).data;
  const positions:number[]=[],letters:number[]=[];
  for(let y=0;y<128;y+=3)for(let x=0;x<512;x+=3){
    if(pixels[(y*512+x)*4+3]<100)continue;
    const index=positions.length/3, phi=Math.acos(-1+2*((index*.61803398875)%1)),theta=index*2.39996;
    positions.push(4*Math.sin(phi)*Math.cos(theta),4*Math.sin(phi)*Math.sin(theta),4*Math.cos(phi));
    letters.push((x-256)/256,(64-y)/64);
  }
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('letter',new THREE.Float32BufferAttribute(letters,2));
  const material=new THREE.ShaderMaterial({
    uniforms:{formation,time,tint:{value:new THREE.Color(dark?0x00d9ff:0x0755c9)},promptScale:{value:new THREE.Vector2(.24,.08)},promptCentre:{value:new THREE.Vector2()},pixelRatio:{value:1}},
    transparent:true,depthWrite:false,depthTest:false,
    vertexShader:`attribute vec2 letter; uniform float formation; uniform float pixelRatio; uniform vec2 promptScale; uniform vec2 promptCentre;
      void main(){vec4 target=projectionMatrix*modelViewMatrix*vec4(position,1.);vec2 source=letter*promptScale+promptCentre;
      gl_Position=vec4(mix(source,target.xy/target.w,formation),target.z/target.w,1.);gl_PointSize=2.1*pixelRatio;}`,
    fragmentShader:`uniform float formation;uniform float time;uniform vec3 tint;
      void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
      float opacity=(1.-smoothstep(.03,.55,formation))*(.92+.08*sin(time*1.2));
      gl_FragColor=vec4(tint,(1.-smoothstep(.6,1.,r))*opacity);#include <colorspace_fragment>}`.replace(';#include',';\n#include'),
  });
  const points=new THREE.Points(geometry,material);points.frustumCulled=false;points.renderOrder=12;
  return points;
}

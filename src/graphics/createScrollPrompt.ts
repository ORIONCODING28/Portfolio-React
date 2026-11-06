import * as THREE from 'three';

/** Particle lettering; the guide stars use clean textured quads, never sampled dots. */
export function createScrollPrompt(label:string,formation:{value:number},time:{value:number},dark:boolean) {
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=160;
  const context=canvas.getContext('2d');if(!context)throw new Error('Canvas unavailable');
  context.font='800 104px "Orbitron", sans-serif';context.textAlign='left';context.textBaseline='middle';
  const textWidth=context.measureText(label).width,left=(768-textWidth-64)/2,starX=left+textWidth+46;
  context.fillStyle='#fff';context.fillText(label,left,80);
  const pixels=context.getImageData(0,0,768,160).data;
  const positions:number[]=[],letters:number[]=[];
  for(let y=0;y<160;y+=3)for(let x=0;x<768;x+=3){
    if(pixels[(y*768+x)*4+3]<100)continue;
    const index=positions.length/3,phi=Math.acos(-1+2*((index*.61803398875)%1)),theta=index*2.39996;
    positions.push(4*Math.sin(phi)*Math.cos(theta),4*Math.sin(phi)*Math.sin(theta),4*Math.cos(phi));
    letters.push((x-384)/384,(80-y)/80);
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('letter',new THREE.Float32BufferAttribute(letters,2));
  const uniforms={formation,time,tint:{value:new THREE.Color(dark?0x00d9ff:0x0755c9).multiplyScalar(dark?2.2:1)},promptScale:{value:new THREE.Vector2(.4,.1)},promptCentre:{value:new THREE.Vector2()},pixelRatio:{value:1}};
  const material=new THREE.ShaderMaterial({
    uniforms,transparent:true,depthWrite:false,depthTest:false,blending:dark?THREE.AdditiveBlending:THREE.NormalBlending,
    vertexShader:`attribute vec2 letter;uniform float formation;uniform float pixelRatio;uniform vec2 promptScale;uniform vec2 promptCentre;
      void main(){vec4 target=projectionMatrix*modelViewMatrix*vec4(position,1.);
        gl_Position=vec4(mix(letter*promptScale+promptCentre,target.xy/target.w,formation),target.z/target.w,1.);
        gl_PointSize=6.*pixelRatio;}`,
    fragmentShader:`uniform float formation;uniform vec3 tint;
      void main(){float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
        float fade=1.-smoothstep(.03,.55,formation);
        gl_FragColor=vec4(tint,((1.-smoothstep(.08,.4,r))+exp(-r*r*3.5)*.35)*fade);
        #include <colorspace_fragment>
      }`,
  });
  const points=new THREE.Points(geometry,material);points.frustumCulled=false;points.renderOrder=12;

  const starCanvas=document.createElement('canvas');starCanvas.width=256;starCanvas.height=256;
  const starContext=starCanvas.getContext('2d');if(!starContext){geometry.dispose();material.dispose();throw new Error('Canvas unavailable');}
  starContext.beginPath();starContext.moveTo(128,8);starContext.lineTo(146,112);
  starContext.lineTo(248,128);starContext.lineTo(146,144);starContext.lineTo(128,248);
  starContext.lineTo(110,144);starContext.lineTo(8,128);starContext.lineTo(110,112);starContext.closePath();
  starContext.fillStyle='white';starContext.fill();
  const starTexture=new THREE.CanvasTexture(starCanvas);
  starTexture.minFilter=THREE.LinearFilter;starTexture.magFilter=THREE.LinearFilter;
  const starGeometry=new THREE.PlaneGeometry(1,1),starMaterials:THREE.ShaderMaterial[]=[];
  for(let slot=0;slot<3;slot++){
    const starMaterial=new THREE.ShaderMaterial({
      uniforms:{...uniforms,slot:{value:slot},starX:{value:(starX-384)/384},starTexture:{value:starTexture}},
      transparent:true,depthWrite:false,depthTest:false,blending:THREE.NormalBlending,
      vertexShader:`uniform float time;uniform float slot;uniform float starX;uniform vec2 promptScale;uniform vec2 promptCentre;
        varying vec2 starUv;varying float markerY;
        void main(){starUv=uv;
          float centreY=1.05-mod(time/3.6+slot/3.,1.)*2.1;
          markerY=centreY+position.y*48./80.;
          vec2 source=vec2(starX+position.x*34./384.,markerY)*promptScale+promptCentre;
          gl_Position=vec4(source,0.,1.);}`,
      fragmentShader:`uniform float formation;uniform vec3 tint;uniform sampler2D starTexture;
        varying vec2 starUv;varying float markerY;
        void main(){if(abs(markerY)>.75)discard;
          float alpha=texture2D(starTexture,starUv).a*(1.-smoothstep(.03,.55,formation));
          gl_FragColor=vec4(min(tint,vec3(1.)),alpha);
          #include <colorspace_fragment>
        }`,
    });
    starMaterials.push(starMaterial);
    const star=new THREE.Mesh(starGeometry,starMaterial);star.frustumCulled=false;star.renderOrder=13;points.add(star);
  }
  return Object.assign(points,{dispose(){
    geometry.dispose();material.dispose();starGeometry.dispose();starMaterials.forEach(value=>value.dispose());starTexture.dispose();points.clear();
  }});
}

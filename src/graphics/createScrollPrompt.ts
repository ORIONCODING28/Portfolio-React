import * as THREE from 'three';

/** Lettering and a continuous downward stream of cyan guide stars. */
export function createScrollPrompt(label:string,formation:{value:number},time:{value:number},dark:boolean) {
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=160;
  const context=canvas.getContext('2d');if(!context)throw new Error('Canvas unavailable');
  context.font='800 104px "Orbitron", sans-serif';context.textAlign='left';context.textBaseline='middle';
  const textWidth=context.measureText(label).width;
  const left=(768-textWidth-60)/2,starLeft=left+textWidth+28;
  context.fillStyle='#fff';context.fillText(label,left,80);
  const x=starLeft+16,y=80;
  context.beginPath();context.moveTo(x,y-22);
  context.quadraticCurveTo(x+5,y-5,x+16,y);
  context.quadraticCurveTo(x+5,y+5,x,y+22);
  context.quadraticCurveTo(x-5,y+5,x-16,y);
  context.quadraticCurveTo(x-5,y-5,x,y-22);context.closePath();context.fill();
  const pixels=context.getImageData(0,0,768,160).data;
  const positions:number[]=[],letters:number[]=[],references:number[]=[];
  for(let py=0;py<160;py+=3)for(let px=0;px<768;px+=3){
    if(pixels[(py*768+px)*4+3]<100)continue;
    const marker=px>=starLeft-1;
    for(let copy=0;copy<(marker?3:1);copy++){
      const index=positions.length/3,phi=Math.acos(-1+2*((index*.61803398875)%1)),theta=index*2.39996;
      positions.push(4*Math.sin(phi)*Math.cos(theta),4*Math.sin(phi)*Math.sin(theta),4*Math.cos(phi));
      letters.push((px-384)/384,(80-py)/80);references.push(marker?copy+1:0);
    }
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
  geometry.setAttribute('letter',new THREE.Float32BufferAttribute(letters,2));
  geometry.setAttribute('reference',new THREE.Float32BufferAttribute(references,1));
  const material=new THREE.ShaderMaterial({
    uniforms:{formation,time,tint:{value:new THREE.Color(dark?0x00d9ff:0x0755c9).multiplyScalar(dark?2.2:1)},promptScale:{value:new THREE.Vector2(.4,.1)},promptCentre:{value:new THREE.Vector2()},pixelRatio:{value:1}},
    transparent:true,depthWrite:false,depthTest:false,blending:dark?THREE.AdditiveBlending:THREE.NormalBlending,
    vertexShader:`attribute vec2 letter;attribute float reference;
      uniform float formation;uniform float time;uniform float pixelRatio;uniform vec2 promptScale;uniform vec2 promptCentre;
      varying float marker;varying float markerY;
      void main(){
        marker=step(.5,reference);
        vec4 target=projectionMatrix*modelViewMatrix*vec4(position,1.);
        vec2 glyph=letter;
        // NDC y decreases downward. Three equally spaced stars wrap without pauses.
        glyph.y+=marker*(1.05-mod(time/3.6+(reference-1.)/3.,1.)*2.1);
        markerY=glyph.y;
        vec2 source=glyph*promptScale+promptCentre;
        gl_Position=vec4(mix(source,target.xy/target.w,formation),target.z/target.w,1.);
        gl_PointSize=mix(6.,4.8,marker)*pixelRatio;
      }`,
    fragmentShader:`uniform float formation;uniform vec3 tint;varying float marker;varying float markerY;
      void main(){
        if(marker>.5&&abs(markerY)>.75)discard;
        float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
        float fade=1.-smoothstep(.03,.55,formation);
        float core=1.-smoothstep(.08,mix(.4,.7,marker),r);
        float glow=exp(-r*r*3.5)*.35;
        gl_FragColor=vec4(tint,(core+glow)*fade);
        #include <colorspace_fragment>
      }`,
  });
  const points=new THREE.Points(geometry,material);points.frustumCulled=false;points.renderOrder=12;
  return points;
}

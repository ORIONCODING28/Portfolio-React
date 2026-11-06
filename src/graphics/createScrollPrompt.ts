import * as THREE from 'three';

/** Sample lettering and its scroll marker once; the same particles dissolve into the sphere. */
export function createScrollPrompt(label:string,formation:{value:number},time:{value:number},dark:boolean) {
  const canvas=document.createElement('canvas');canvas.width=768;canvas.height=160;
  const context=canvas.getContext('2d');if(!context)throw new Error('Canvas unavailable');
  context.font='800 104px "Orbitron", sans-serif';context.textAlign='left';context.textBaseline='middle';
  const textWidth=context.measureText(label).width;
  const left=(768-textWidth-92)/2,barLeft=left+textWidth+28;
  context.fillStyle='#fff';context.fillText(label,left,80);
  // Separate mask colours identify the white frame, mouse and moving wheel.
  const rounded=(x:number,y:number,width:number,height:number,radius:number)=>{
    context.beginPath(); context.moveTo(x+radius,y);
    context.lineTo(x+width-radius,y);context.quadraticCurveTo(x+width,y,x+width,y+radius);
    context.lineTo(x+width,y+height-radius);context.quadraticCurveTo(x+width,y+height,x+width-radius,y+height);
    context.lineTo(x+radius,y+height);context.quadraticCurveTo(x,y+height,x,y+height-radius);
    context.lineTo(x,y+radius);context.quadraticCurveTo(x,y,x+radius,y);context.closePath();
  };
  context.lineWidth=3;
  context.strokeStyle='#ff0000'; rounded(barLeft,10,64,140,30); context.stroke();
  context.strokeStyle='#00ff00'; rounded(barLeft+13,48,38,62,18); context.stroke();
  context.fillStyle='#0000ff'; rounded(barLeft+29,61,6,14,3); context.fill();
  const pixels=context.getImageData(0,0,768,160).data;
  const positions:number[]=[],letters:number[]=[],references:number[]=[];
  for(let y=0;y<160;y+=3)for(let x=0;x<768;x+=3){
    if(pixels[(y*768+x)*4+3]<100)continue;
    const index=positions.length/3,phi=Math.acos(-1+2*((index*.61803398875)%1)),theta=index*2.39996;
    positions.push(4*Math.sin(phi)*Math.cos(theta),4*Math.sin(phi)*Math.sin(theta),4*Math.cos(phi));
    letters.push((x-384)/384,(80-y)/80);
    const pixel=(y*768+x)*4;
    references.push(x<barLeft-3 ? 0 : pixels[pixel+2]>100 ? 3 : pixels[pixel+1]>100 ? 2 : 1);
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
      varying float isReference;varying float markerHeight;
      void main(){
        isReference=reference;markerHeight=letter.y;
        vec4 target=projectionMatrix*modelViewMatrix*vec4(position,1.);
        vec2 glyph=letter;
        glyph.y-=step(2.5,reference)*.075*(.5-.5*cos(time*2.8));
        vec2 source=glyph*promptScale+promptCentre;
        gl_Position=vec4(mix(source,target.xy/target.w,formation),target.z/target.w,1.);
        gl_PointSize=mix(6.,4.8,step(.5,reference))*pixelRatio;
      }`,
    fragmentShader:`uniform float formation;uniform float time;uniform vec3 tint;
      varying float isReference;varying float markerHeight;
      void main(){
        float r=length(gl_PointCoord-.5)*2.;if(r>1.)discard;
        float fade=1.-smoothstep(.03,.55,formation);
        float marker=step(.5,isReference);
        float pulse=pow(.5+.5*sin(time*2.4+markerHeight*3.),5.);
        vec3 markerTint=mix(vec3(1.25),tint,.85*pulse);
        vec3 color=mix(tint,markerTint,marker);
        float core=1.-smoothstep(.08,mix(.4,.7,marker),r);
        float glow=exp(-r*r*3.5)*.35;
        gl_FragColor=vec4(color,(core+glow)*fade);
        #include <colorspace_fragment>
      }`,
  });
  const points=new THREE.Points(geometry,material);points.frustumCulled=false;points.renderOrder=12;
  return points;
}

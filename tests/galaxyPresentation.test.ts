import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';

test('a full-section camera preserves the exact resting art placement at every viewport size',()=>{
  for(const [width,height,left,top,artWidth,artHeight] of [[390,817,0,365,390,421],[1280,640,615,40,622,486],[2560,1360,1300,64,1200,691]]){
    const camera=new THREE.PerspectiveCamera(75,artWidth/artHeight,.1,1000);
    camera.position.set(0,3,16);camera.lookAt(0,0,0);camera.updateMatrixWorld(true);
    const point=new THREE.Vector3(3,2,0);
    const local=point.clone().project(camera);
    // This point starts beyond the art slot, but must remain visible in the wider canvas.
    const outside=new THREE.Vector3(-1.2,0,.5).unproject(camera);
    camera.setViewOffset(artWidth,artHeight,-left,-top,width,height);
    const full=point.clone().project(camera);
    const expectedX=((local.x+1)*.5*artWidth+left)/width*2-1;
    const expectedY=1-((1-local.y)*.5*artHeight+top)/height*2;
    assert.ok(Math.abs(full.x-expectedX)<1e-10);
    assert.ok(Math.abs(full.y-expectedY)<1e-10);
    if(left>0)assert.ok(outside.project(camera).x>-1);
  }
});

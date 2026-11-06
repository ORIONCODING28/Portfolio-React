import { test } from 'node:test';
import assert from 'node:assert/strict';
import {journeyFrame,journeyNodeReveal,JOURNEY_HOLD_SECONDS as hold,JOURNEY_STAGE_SECONDS as step,JOURNEY_TRAVEL_SECONDS as travel} from '../src/graphics/journeyTimeline.ts';
const phases=[.2,.31,.45,.7,.86,1];

test('stars are created only when the first light reaches them',()=>{
  assert.equal(journeyFrame(0,phases).builtProgress,0);
  assert.equal(journeyFrame(0,phases).revealed,0);
  phases.forEach((_,index)=>{
    assert.equal(journeyNodeReveal(index*step-.01,index),0);
    assert.ok(journeyNodeReveal(index*step+.15,index)>0);
    assert.equal(journeyNodeReveal(index*step+.35,index),1);
  });
});
test('each reached star holds its label and the light travels only its outgoing link',()=>{
  phases.forEach((phase,index)=>{
    const frame=journeyFrame(index*step+hold*.5,phases);
    assert.equal(frame.progress,phase);assert.equal(frame.index,index);assert.equal(frame.labelOpacity,1);
  });
  for(let index=0;index<phases.length-1;index++){
    const halfway=journeyFrame(index*step+hold+travel*.5,phases);
    assert.equal(halfway.index,index);assert.equal(halfway.labelOpacity,0);
    assert.ok(halfway.progress>phases[index]&&halfway.progress<phases[index+1]);
    assert.equal(journeyFrame((index+1)*step,phases).index,index+1);
  }
});
test('construction advances monotonically and never disappears when the light restarts',()=>{
  let previous=0;
  const end=(phases.length-1)*step+hold;
  for(let t=0;t<end*3;t+=.05){
    const frame=journeyFrame(t,phases);
    assert.ok(frame.builtProgress>=previous-1e-8);previous=frame.builtProgress;
    if(t>end){assert.equal(frame.builtProgress,1);assert.equal(frame.revealed,6);}
  }
  assert.equal(journeyFrame(end+.2,phases).index,0);
  for(let i=0;i<6;i++)assert.equal(journeyNodeReveal(end*3,i),1);
});
test('the final star receives reading time before only the impulse repeats',()=>{
  const last=5*step;
  assert.equal(journeyFrame(last+hold*.8,phases).index,5);
  assert.equal(journeyFrame(last+hold*.8,phases).labelOpacity,1);
  assert.equal(journeyFrame(last+hold+.1,phases).builtProgress,1);
});
test('empty and single-stage routes stay bounded',()=>{
  assert.equal(journeyFrame(20,[]).revealed,0);
  assert.equal(journeyFrame(20,[.5]).progress,.5);
  assert.equal(journeyFrame(-10,phases).index,0);
});

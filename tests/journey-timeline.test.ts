import { test } from 'node:test';
import assert from 'node:assert/strict';
import {journeyFrame,JOURNEY_HOLD_SECONDS as hold,JOURNEY_STAGE_SECONDS as step,JOURNEY_TRAVEL_SECONDS as travel} from '../src/graphics/journeyTimeline.ts';
const phases=[.2,.31,.45,.7,.86,1];

test('each star holds its illumination and label before the flow departs',()=>{
  phases.forEach((phase,index)=>{
    const frame=journeyFrame(index*step+hold*.5,phases);
    assert.equal(frame.progress,phase);assert.equal(frame.index,index);
    assert.equal(frame.travel,0);assert.equal(frame.labelOpacity,1);
  });
});
test('the flow travels one link and activates the destination only on arrival',()=>{
  for(let index=0;index<phases.length-1;index++){
    const halfway=journeyFrame(index*step+hold+travel*.5,phases);
    assert.equal(halfway.index,index);assert.ok(halfway.travel>0 && halfway.travel<1);
    assert.ok(halfway.progress>phases[index] && halfway.progress<phases[index+1]);
    assert.equal(halfway.labelOpacity,0);
    const arrived=journeyFrame((index+1)*step,phases);
    assert.equal(arrived.index,index+1);assert.equal(arrived.labelOpacity,1);
    assert.ok(Math.abs(arrived.progress-phases[index+1])<1e-10);
  }
});
test('the final star receives its reading time and fades before restarting',()=>{
  const last=(phases.length-1)*step;
  assert.equal(journeyFrame(last+hold*.8,phases).labelOpacity,1);
  const fading=journeyFrame(last+hold+.2,phases);
  assert.ok(fading.fade>0 && fading.fade<1);assert.equal(fading.progress,1);
  assert.equal(journeyFrame(last+hold+.4,phases).index,0);
});
test('the approaching star never receives the label prematurely',()=>{
  for(let destination=1;destination<phases.length;destination++){
    const approaching=journeyFrame(destination*step-.0001,phases);
    assert.equal(approaching.index,destination-1);
    assert.equal(approaching.labelOpacity,0);
    assert.ok(approaching.progress<phases[destination]);
  }
});
test('empty and single-stage paths stay bounded',()=>{
  assert.equal(journeyFrame(20,[]).labelOpacity,0);
  assert.equal(journeyFrame(20,[.5]).progress,.5);
  assert.equal(journeyFrame(-10,phases).index,0);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { journeyProgress, journeyActiveStage, JOURNEY_STAGE_SECONDS } from '../src/graphics/journeyTimeline.ts';
const phases=[.2,.31,.45,.7,.86,1];
test('the first frame begins at the first milestone',()=>{assert.equal(journeyProgress(0,phases),phases[0]);});
test('every phase receives the same reading time regardless of spatial distance',()=>{
  phases.forEach((phase,index)=>{
    assert.equal(journeyProgress(index*JOURNEY_STAGE_SECONDS,phases),phase);
    const progress=journeyProgress((index+.8)*JOURNEY_STAGE_SECONDS,phases);
    assert.ok(progress>=phase && progress<(phases[index+1] ?? 1.18));
  });
});
test('the final phase is reached before the sequence loops',()=>{
  assert.ok(journeyProgress(5*JOURNEY_STAGE_SECONDS+2,phases)>=1);
  assert.equal(journeyProgress(6*JOURNEY_STAGE_SECONDS,phases),phases[0]);
});

test('the caption switches to the approaching milestone before the flow crosses its centre',()=>{
  assert.equal(journeyActiveStage(.44,phases),2);
  assert.equal(journeyActiveStage(.69,phases),3);
});
test('each handover selects one milestone and remains stable across its centre',()=>{
  for(let i=0;i<phases.length-1;i++){
    const midpoint=(phases[i]+phases[i+1])/2;
    assert.equal(journeyActiveStage(midpoint-.0001,phases),i);
    assert.equal(journeyActiveStage(midpoint+.0001,phases),i+1);
    assert.equal(journeyActiveStage(phases[i+1],phases),i+1);
  }
  assert.equal(journeyActiveStage(1.15,phases),5);
  assert.equal(journeyActiveStage(journeyProgress(6*JOURNEY_STAGE_SECONDS,phases),phases),0);
});

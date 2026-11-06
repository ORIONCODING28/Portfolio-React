import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deviceScrollProgress,deviceScrollMotion } from '../src/domain/deviceScrollProgress.ts';

test('turning starts only after the model itself is visible', () => {
  for(const [height,viewport] of [[350,844],[580,1440],[380,720],[440,1024]]) {
    assert.equal(deviceScrollProgress(viewport-height*.1,height,viewport),0);
    assert.equal(deviceScrollProgress(viewport*.86-height/2,height,viewport),0);
    assert.ok(deviceScrollProgress(viewport*.7-height/2,height,viewport)>0);
  }
});

test('the screen is frontal in the middle, with continuous rotation on either side', () => {
  for(const [height,viewport] of [[350,844],[580,1440],[380,720],[440,1024]]) {
    const progress=deviceScrollProgress((viewport-height)/2,height,viewport);
    assert.ok(Math.abs(progress-.5)<1e-12);
    const pose=deviceScrollMotion(progress);
    assert.ok(pose.arrival+pose.departure<1e-12);
  }
  const signed=(progress:number)=>{const frame=deviceScrollMotion(progress);return frame.arrival-frame.departure;};
  let previous=Infinity;
  for(const progress of [0,.1,.25,.4,.49,.5,.51,.6,.75,.9,1]) {
    const angle=signed(progress);
    assert.ok(angle<previous);
    previous=angle;
  }
});

test('returning through the viewport reverses the same turn, without state or overshoot', () => {
  const positions=[.1,.3,.5,.7,.9];
  const forward=positions.map(deviceScrollMotion);
  const reverse=positions.toReversed().map(deviceScrollMotion).toReversed();
  assert.deepEqual(forward,reverse);
  assert.deepEqual(deviceScrollMotion(-5),{arrival:1,departure:0});
  assert.deepEqual(deviceScrollMotion(5),{arrival:0,departure:1});
  assert.equal(deviceScrollProgress(0,0,0),.5);
});

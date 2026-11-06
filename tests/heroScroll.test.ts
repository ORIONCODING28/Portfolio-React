import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HERO_INTRO_MS, heroIntroFrame, heroOpeningScale, heroGestureAction, advanceHeroIntro } from '../src/domain/heroScroll.ts';

test('every viewport follows constellation, assembled galaxy, final placement, then copy', () => {
  assert.deepEqual(heroIntroFrame(0), {progress:0,formation:0,remaining:1,copy:0});
  const gathering = heroIntroFrame(HERO_INTRO_MS * .25);
  assert.ok(gathering.formation > 0 && gathering.formation < 1);
  assert.equal(gathering.copy, 0); assert.equal(gathering.remaining, 1);
  const assembled = heroIntroFrame(HERO_INTRO_MS * .55);
  assert.equal(assembled.formation, 1); assert.equal(assembled.remaining, 1); assert.equal(assembled.copy, 0);
  const placed = heroIntroFrame(HERO_INTRO_MS * .85);
  assert.equal(placed.formation, 1); assert.equal(placed.remaining, 0); assert.equal(placed.copy, 0);
  const revealing = heroIntroFrame(HERO_INTRO_MS * .92);
  assert.equal(revealing.remaining, 0); assert.ok(revealing.copy > 0 && revealing.copy < 1);
});

test('the timed sequence is bounded and completes without an added scroll distance', () => {
  assert.deepEqual(heroIntroFrame(HERO_INTRO_MS), {progress:1,formation:1,remaining:0,copy:1});
  assert.deepEqual(heroIntroFrame(9000), heroIntroFrame(HERO_INTRO_MS));
  assert.deepEqual(heroIntroFrame(-100), heroIntroFrame(0));
  assert.ok(HERO_INTRO_MS >= 1700 && HERO_INTRO_MS <= 1900);
});

test('opening composition fits phone, tablet, laptop and 2560px screens', () => {
  for (const [width,height,vw,vh] of [[380,280,380,772],[360,370,768,944],[480,390,1024,688],[1292,691,2560,1320]]) {
    const scale = heroOpeningScale(width,height,vw,vh);
    assert.ok(scale >= .65 && scale <= 1.3);
    assert.ok(width * scale <= vw); assert.ok(height * scale <= vh);
  }
  assert.equal(heroOpeningScale(0,0,390,700),1);
});

test('reverse is available immediately at the composed hero without first scrolling away', () => {
  assert.equal(heroGestureAction('galaxy',true,-1),'reverse');
  assert.equal(heroGestureAction('galaxy',true,1),'pass');
  assert.equal(heroGestureAction('constellation',true,1),'forward');
});
test('returning from lower sections requires a fresh upward gesture', () => {
  assert.equal(heroGestureAction('galaxy',false,-1),'pass');
  assert.equal(heroGestureAction('galaxy',true,-1,true,false),'block');
  assert.equal(heroGestureAction('galaxy',true,-1,true,true),'reverse');
  assert.equal(heroGestureAction('galaxy',true,1,true,false),'pass');
});
test('gestures during playback never queue another transition', () => {
  for(const direction of [-1,1] as const) assert.equal(heroGestureAction('moving',true,direction),'block');
});
test('forward and reverse use the exact same frames in opposite directions', () => {
  let position=0;
  for(let i=0;i<6;i++)position=advanceHeroIntro(position,1,100);
  const midpoint=heroIntroFrame(position);
  for(let i=0;i<6;i++)position=advanceHeroIntro(position,1,100);
  for(let i=0;i<6;i++)position=advanceHeroIntro(position,-1,100);
  assert.deepEqual(heroIntroFrame(position),midpoint);
  assert.equal(advanceHeroIntro(HERO_INTRO_MS,-1,HERO_INTRO_MS),0);
  assert.equal(advanceHeroIntro(0,1,HERO_INTRO_MS),HERO_INTRO_MS);
  assert.equal(advanceHeroIntro(0,-1,100),0);
  assert.equal(advanceHeroIntro(HERO_INTRO_MS,1,100),HERO_INTRO_MS);
});

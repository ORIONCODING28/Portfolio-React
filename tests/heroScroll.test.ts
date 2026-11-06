import { test } from 'node:test';
import assert from 'node:assert/strict';
import { heroOpeningScale, heroScrollFrame } from '../src/domain/heroScroll.ts';

test('constellation forms centrally before travelling and revealing the home copy', () => {
  assert.deepEqual(heroScrollFrame(0,0,600),{progress:0,formation:0,remaining:1,copy:0});
  const gathering=heroScrollFrame(150,0,600);
  assert.ok(gathering.formation>0 && gathering.formation<1);
  assert.equal(gathering.remaining,1);
  assert.equal(gathering.copy,0);
  const assembled=heroScrollFrame(270,0,600);
  assert.equal(assembled.formation,1);
  assert.equal(assembled.remaining,1);
  assert.equal(assembled.copy,0);
  const travelling=heroScrollFrame(450,0,600);
  assert.equal(travelling.formation,1);
  assert.ok(travelling.remaining>0 && travelling.remaining<1);
  assert.ok(travelling.copy>0 && travelling.copy<1);
});

test('fast jumps and reverse scrolling produce exact frames without queued animations', () => {
  assert.deepEqual(heroScrollFrame(600,0,600),{progress:1,formation:1,remaining:0,copy:1});
  assert.deepEqual(heroScrollFrame(9000,0,600),heroScrollFrame(600,0,600));
  const middle=heroScrollFrame(300,0,600);
  heroScrollFrame(550,0,600);
  assert.deepEqual(heroScrollFrame(300,0,600),middle);
  assert.deepEqual(heroScrollFrame(-100,0,600),heroScrollFrame(0,0,600));
  assert.equal(heroScrollFrame(0,0,0).copy,1);
});

test('central composition stays moderate on phone, tablet, laptop and 2560px screens', () => {
  for(const [width,height,vw,vh] of [[380,421,380,772],[360,370,768,944],[480,390,1024,688],[1292,691,2560,1320]]) {
    const scale=heroOpeningScale(width,height,vw,vh);
    assert.ok(scale>=.65 && scale<=1.3);
    assert.ok(width*scale<=vw);
    assert.ok(height*scale<=vh);
  }
  assert.equal(heroOpeningScale(0,0,390,700),1);
});

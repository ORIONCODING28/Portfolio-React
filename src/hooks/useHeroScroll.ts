import { useLayoutEffect, type RefObject } from 'react';
import type { GalaxyController, GalaxyPresentation } from '../graphics/createGalaxy';
import { heroOpeningScale, heroScrollDistance, heroScrollFrame } from '../domain/heroScroll';

/** Native scroll drives one full-section canvas. Layout keeps the approved resting art slot. */
export function useHeroScroll(scope: RefObject<HTMLDivElement | null>, galaxy: RefObject<GalaxyController | null>, presentation: RefObject<GalaxyPresentation | null>) {
  useLayoutEffect(() => {
    const track = scope.current?.querySelector<HTMLElement>('.home-intro');
    const stage = track?.querySelector<HTMLElement>('.home-hero');
    const art = stage?.querySelector<HTMLElement>('.hero-art');
    const copy = stage?.querySelector<HTMLElement>('.hero-copy');
    const canvas = stage?.querySelector<HTMLElement>('.galaxy-visual');
    if (!track || !stage || !art || !copy || !canvas) return;
    const header = document.querySelector<HTMLElement>('.site-header');
    let frame = 0, start = 0, distance = 1;
    let stageHeight=1,availableHeight=1,inline=false;
    let resting = {left:0,top:0,width:1,height:1}, centred = resting;
    const draw = () => {
      frame = 0;
      if (document.hidden) return;
      const value = heroScrollFrame(window.scrollY, start, distance);
      const remaining=inline ? 0 : value.remaining;
      const interpolate = (a: number, b: number) => a + (b - a) * remaining;
      const next = {
        left:interpolate(resting.left,centred.left), top:interpolate(resting.top,centred.top),
        width:interpolate(resting.width,centred.width), height:interpolate(resting.height,centred.height),
        formation:value.formation,
      };
      presentation.current = next;
      galaxy.current?.setPresentation(next);
      const fullHeight=Math.max(stageHeight,availableHeight);
      const visibleHeight=interpolate(stageHeight,availableHeight);
      canvas.style.clipPath=`inset(0 0 ${Math.max(0,fullHeight-visibleHeight)}px 0)`;
      const copyVisibility=inline ? 1 : value.copy;
      copy.style.opacity = String(copyVisibility);
      copy.style.transform = `translateY(${12 * (1 - copyVisibility)}px)`;
      copy.style.pointerEvents = copyVisibility < .1 ? 'none' : '';
      track.dataset.introState = value.progress <= .0001 ? 'opening' : value.progress >= .9999 ? 'settled' : 'moving';
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const measure = () => {
      const top = header?.getBoundingClientRect().height ?? 80;
      const viewport = window.innerHeight, width = document.documentElement.clientWidth;
      const available = Math.max(200, viewport - top);
      distance = heroScrollDistance(width,viewport);
      inline=width<640;track.dataset.introMode=inline?'inline':'staged';
      track.dataset.introReady = 'true';
      track.style.setProperty('--intro-top',`${top}px`);
      track.style.setProperty('--intro-viewport',`${available}px`);
      stageHeight=stage.offsetHeight;availableHeight=available;
      if(inline)track.style.removeProperty('height');else track.style.height = `${distance + stageHeight}px`;
      const bounds = art.getBoundingClientRect(), stageBounds = stage.getBoundingClientRect();
      canvas.style.left = `${-stageBounds.left}px`;
      canvas.style.width = `${width}px`;
      start = track.getBoundingClientRect().top + window.scrollY - top;
      resting = {left:bounds.left,top:bounds.top-stageBounds.top,width:bounds.width,height:bounds.height};
      const scale = heroOpeningScale(bounds.width,bounds.height,width,available);
      centred = {left:(width-bounds.width*scale)/2,top:(available-bounds.height*scale)/2,width:bounds.width*scale,height:bounds.height*scale};
      track.dataset.introReady = 'true';
      draw();
    };
    const focus = () => { if(inline)return; window.scrollTo({top:start+distance,behavior:'instant'}); draw(); };
    const resize = new ResizeObserver(measure);
    resize.observe(stage); if(header)resize.observe(header);
    measure();
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',measure,{passive:true});
    window.addEventListener('pageshow',measure);
    document.addEventListener('visibilitychange',schedule);
    copy.addEventListener('focusin',focus);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect();
      window.removeEventListener('scroll',schedule); window.removeEventListener('resize',measure); window.removeEventListener('pageshow',measure);
      document.removeEventListener('visibilitychange',schedule); copy.removeEventListener('focusin',focus);
      for(const property of ['opacity','transform','pointer-events'])copy.style.removeProperty(property);
      canvas.style.removeProperty('left'); canvas.style.removeProperty('width');canvas.style.removeProperty('clip-path');
      track.style.removeProperty('height'); track.style.removeProperty('--intro-top'); track.style.removeProperty('--intro-viewport');
      delete track.dataset.introReady; delete track.dataset.introState;delete track.dataset.introMode;
    };
  },[scope,galaxy,presentation]);
}

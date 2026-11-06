import { useLayoutEffect, type RefObject } from 'react';
import type { GalaxyController, GalaxyPresentation } from '../graphics/createGalaxy';
import { HERO_INTRO_MS, advanceHeroIntro, heroGestureAction, heroIntroFrame, heroOpeningScale, type HeroDirection } from '../domain/heroScroll';

/** A gesture chooses direction; a bounded clock controls the reversible opening. */
export function useHeroScroll(scope: RefObject<HTMLDivElement | null>, galaxy: RefObject<GalaxyController | null>, presentation: RefObject<GalaxyPresentation | null>) {
  useLayoutEffect(() => {
    const track = scope.current?.querySelector<HTMLElement>('.home-intro');
    const stage = track?.querySelector<HTMLElement>('.home-hero');
    const art = stage?.querySelector<HTMLElement>('.hero-art');
    const copy = stage?.querySelector<HTMLElement>('.hero-copy');
    const canvas = stage?.querySelector<HTMLElement>('.galaxy-visual');
    if (!track || !stage || !art || !copy || !canvas) return;
    const header = document.querySelector<HTMLElement>('.site-header');
    let frame = 0, last = 0, elapsed = 0, start = 0, previousY = window.scrollY;
    let playing = false, complete = false, needsFreshGesture = false;
    let direction:HeroDirection = 1;
    let stageHeight = 1, availableHeight = 1;
    let touchY = 0, touchConsumed = false, touchStartedAtTop = false;
    let lastWheel = -Infinity, lastWheelDirection:HeroDirection = 1, finishedAt = -Infinity;
    let resting = { left: 0, top: 0, width: 1, height: 1 }, centred = resting;
    const atTop = () => window.scrollY <= start + 2;

    const draw = () => {
      const value = heroIntroFrame(elapsed);
      const interpolate = (a:number,b:number) => a + (b-a)*value.remaining;
      const next = {
        left:interpolate(resting.left,centred.left), top:interpolate(resting.top,centred.top),
        width:interpolate(resting.width,centred.width), height:interpolate(resting.height,centred.height), formation:value.formation,
      };
      presentation.current = next; galaxy.current?.setPresentation(next);
      const fullHeight = Math.max(stageHeight,availableHeight);
      canvas.style.clipPath = `inset(0 0 ${Math.max(0,fullHeight-interpolate(stageHeight,availableHeight))}px 0)`;
      copy.style.opacity = String(value.copy);
      copy.style.transform = `translateY(${10*(1-value.copy)}px)`;
      copy.style.pointerEvents = value.copy < .1 ? 'none' : '';
      track.dataset.introState = playing ? direction===1 ? 'moving' : 'reversing' : complete ? 'settled' : 'opening';
    };
    const settle = (assembled:boolean) => {
      cancelAnimationFrame(frame); frame=0; last=0;
      elapsed=assembled ? HERO_INTRO_MS : 0; playing=false; complete=assembled;
      needsFreshGesture=false; finishedAt=performance.now(); draw();
    };
    const tick = (now:number) => {
      frame=0;
      if (!playing || document.hidden) { last=0; return; }
      if (last) elapsed=advanceHeroIntro(elapsed,direction,Math.min(now-last,80));
      last=now;
      if ((direction===1 && elapsed>=HERO_INTRO_MS) || (direction===-1 && elapsed<=0)) { settle(direction===1); return; }
      draw(); frame=requestAnimationFrame(tick);
    };
    const begin = (next:HeroDirection) => {
      if (playing) return;
      // A failed WebGL load must never trap page navigation.
      if (!galaxy.current) { settle(true); return; }
      direction=next; playing=true; last=0; needsFreshGesture=false;
      window.scrollTo({top:start,behavior:'instant'}); previousY=start;
      draw(); frame=requestAnimationFrame(tick);
    };
    const excluded = (target:EventTarget|null) => target instanceof Element && !!target.closest('dialog[open], [role="dialog"], input, textarea, select, .site-header');
    const act = (next:HeroDirection,fresh:boolean) => {
      const action=heroGestureAction(playing?'moving':complete?'galaxy':'constellation',atTop(),next,needsFreshGesture,fresh);
      if (action==='forward') begin(1);
      if (action==='reverse') begin(-1);
      return action!=='pass';
    };
    const wheel = (event:WheelEvent) => {
      if (!event.deltaY || event.ctrlKey || excluded(event.target) || Math.abs(event.deltaX)>Math.abs(event.deltaY)) return;
      const now=performance.now(), next:HeroDirection=event.deltaY>0?1:-1;
      const fresh=next!==lastWheelDirection || now-lastWheel>160;
      const momentum=now-finishedAt<350 && !fresh;
      if (momentum || act(next,fresh)) { if(event.cancelable)event.preventDefault(); }
      lastWheel=now; lastWheelDirection=next;
    };
    const touchStart = (event:TouchEvent) => {
      touchY=event.touches[0]?.clientY ?? 0; touchStartedAtTop=atTop();
      touchConsumed=playing && event.touches.length===1;
    };
    const touchMove = (event:TouchEvent) => {
      if(event.touches.length!==1 || excluded(event.target))return;
      const delta=touchY-event.touches[0].clientY;
      if(Math.abs(delta)<5 && !touchConsumed)return;
      const next:HeroDirection=delta>0?1:-1;
      // A swipe that began below the hero may reach the top, but may not reverse it.
      const arriving=complete && atTop() && next===-1 && !touchStartedAtTop;
      if(touchConsumed || arriving || act(next,touchStartedAtTop)) {
        if(event.cancelable)event.preventDefault(); touchConsumed=true;
      }
    };
    const touchEnd = () => { touchConsumed=false; };
    const key = (event:KeyboardEvent) => {
      if(excluded(event.target) || event.altKey || event.ctrlKey || event.metaKey)return;
      if(event.key==='Escape' || event.key==='End') { if(playing || !complete)settle(true); return; }
      const next:HeroDirection|null=['ArrowDown','PageDown'].includes(event.key) || (event.key===' '&&!event.shiftKey) ? 1 : ['ArrowUp','PageUp'].includes(event.key) || (event.key===' '&&event.shiftKey) ? -1 : null;
      if(next!==null && act(next,!event.repeat))event.preventDefault();
    };
    const scroll = () => {
      const y=window.scrollY;
      if(playing || !complete) {
        if(Math.abs(y-start)>1)window.scrollTo({top:start,behavior:'instant'});
        previousY=start; return;
      }
      // Keep the assembled hero on return. Only the next distinct gesture reverses it.
      if(y<=start+2 && previousY>start+2)needsFreshGesture=true;
      previousY=y;
    };
    const measure = () => {
      const top=header?.getBoundingClientRect().height ?? 80, width=document.documentElement.clientWidth;
      availableHeight=Math.max(200,window.innerHeight-top);
      track.dataset.introReady='true';
      track.style.setProperty('--intro-top',`${top}px`); track.style.setProperty('--intro-viewport',`${availableHeight}px`);
      stageHeight=stage.offsetHeight;
      const bounds=art.getBoundingClientRect(), stageBounds=stage.getBoundingClientRect();
      start=Math.max(0,track.getBoundingClientRect().top+window.scrollY-top);
      canvas.style.left=`${-stageBounds.left}px`; canvas.style.width=`${width}px`;
      resting={left:bounds.left,top:bounds.top-stageBounds.top,width:bounds.width,height:bounds.height};
      const scale=heroOpeningScale(bounds.width,bounds.height,width,availableHeight);
      centred={left:(width-bounds.width*scale)/2,top:(availableHeight-bounds.height*scale)/2,width:bounds.width*scale,height:bounds.height*scale};
      draw();
    };
    const visibility = () => {
      cancelAnimationFrame(frame); frame=0; last=0;
      if(playing&&!document.hidden)frame=requestAnimationFrame(tick);
    };
    const focus = () => { if(playing || !complete)settle(true); };
    complete=!!location.hash && location.hash!=='#main-content';
    if(complete)elapsed=HERO_INTRO_MS;
    const resize=new ResizeObserver(measure); resize.observe(stage); if(header)resize.observe(header);
    measure();
    const fallback=window.setTimeout(()=>{if(!galaxy.current)settle(true);},4000);
    window.addEventListener('wheel',wheel,{passive:false});
    window.addEventListener('touchstart',touchStart,{passive:true}); window.addEventListener('touchmove',touchMove,{passive:false});
    window.addEventListener('touchend',touchEnd,{passive:true}); window.addEventListener('touchcancel',touchEnd,{passive:true});
    window.addEventListener('keydown',key); window.addEventListener('scroll',scroll,{passive:true});
    window.addEventListener('resize',measure,{passive:true}); window.addEventListener('pageshow',measure);
    document.addEventListener('visibilitychange',visibility); copy.addEventListener('focusin',focus);
    return () => {
      cancelAnimationFrame(frame); clearTimeout(fallback); resize.disconnect();
      window.removeEventListener('wheel',wheel); window.removeEventListener('touchstart',touchStart); window.removeEventListener('touchmove',touchMove);
      window.removeEventListener('touchend',touchEnd); window.removeEventListener('touchcancel',touchEnd);
      window.removeEventListener('keydown',key); window.removeEventListener('scroll',scroll);
      window.removeEventListener('resize',measure); window.removeEventListener('pageshow',measure);
      document.removeEventListener('visibilitychange',visibility); copy.removeEventListener('focusin',focus);
      for(const property of ['opacity','transform','pointer-events'])copy.style.removeProperty(property);
      for(const property of ['left','width','clip-path'])canvas.style.removeProperty(property);
      track.style.removeProperty('--intro-top'); track.style.removeProperty('--intro-viewport');
      delete track.dataset.introReady; delete track.dataset.introState;
    };
  },[scope,galaxy,presentation]);
}

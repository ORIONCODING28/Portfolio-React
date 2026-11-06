import { useLayoutEffect, type RefObject } from 'react';
import type { GalaxyController } from '../graphics/createGalaxy';
import { heroOpeningScale, heroScrollFrame } from '../domain/heroScroll';

/** One sticky composition, driven by native page scrolling. No wheel/touch interception. */
export function useHeroScroll(scope: RefObject<HTMLDivElement | null>, galaxy: RefObject<GalaxyController | null>, formation: RefObject<number>) {
  useLayoutEffect(() => {
    const root = scope.current;
    const track = root?.querySelector<HTMLElement>('.home-intro');
    const stage = track?.querySelector<HTMLElement>('.home-hero');
    const art = stage?.querySelector<HTMLElement>('.hero-art');
    const copy = stage?.querySelector<HTMLElement>('.hero-copy');
    const hint = stage?.querySelector<HTMLElement>('.hero-scroll-hint');
    if (!track || !stage || !art || !copy) return;
    const header = document.querySelector<HTMLElement>('.site-header');
    let frame = 0, start = 0, distance = 1, x = 0, y = 0, scale = 1;
    let lastState = '';
    const draw = () => {
      frame = 0;
      if (document.hidden) return;
      const value = heroScrollFrame(window.scrollY, start, distance);
      art.style.transform = `translate3d(${x * value.remaining}px,${y * value.remaining}px,0) scale(${1 + (scale - 1) * value.remaining})`;
      formation.current = value.formation;
      galaxy.current?.setFormation(value.formation);
      copy.style.opacity = String(value.copy);
      copy.style.transform = `translateY(${16 * (1 - value.copy)}px)`;
      copy.style.pointerEvents = value.copy < .1 ? 'none' : '';
      if (hint) hint.style.opacity = String(Math.max(0, 1 - value.progress * 5));
      const state = value.progress === 0 ? 'opening' : value.progress === 1 ? 'settled' : 'moving';
      if (state !== lastState) { track.dataset.introState = state; lastState = state; }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const measure = () => {
      // Measure the approved resting composition, never its animated bounding box.
      art.style.transform = 'none';
      const top = header?.getBoundingClientRect().height ?? 80;
      const viewport = window.innerHeight;
      const width = document.documentElement.clientWidth;
      const available = Math.max(200, viewport - top);
      distance = Math.min(700, viewport * .72);
      track.style.setProperty('--intro-top', `${top}px`);
      track.style.setProperty('--intro-viewport', `${available}px`);
      track.style.height = `${distance + Math.max(available, stage.offsetHeight)}px`;
      const bounds = art.getBoundingClientRect();
      start = track.getBoundingClientRect().top + window.scrollY - top;
      x = width / 2 - (bounds.left + bounds.width / 2);
      // The resting stage may be taller than the viewport on a small phone.
      const pinnedTop = stage.getBoundingClientRect().top;
      y = top + available / 2 - (bounds.top + bounds.height / 2) + (pinnedTop - top);
      scale = heroOpeningScale(bounds.width, bounds.height, width, available);
      track.dataset.introReady = 'true';
      draw();
    };
    const focus = () => {
      // Keyboard users reach visible controls immediately, without an invisible tab stop.
      window.scrollTo({ top: start + distance, behavior: 'instant' });
      draw();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(stage);
    if (header) resize.observe(header);
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('pageshow', measure);
    document.addEventListener('visibilitychange', schedule);
    copy.addEventListener('focusin', focus);
    return () => {
      cancelAnimationFrame(frame); resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pageshow', measure);
      document.removeEventListener('visibilitychange', schedule);
      copy.removeEventListener('focusin', focus);
      art.style.removeProperty('transform');
      for (const property of ['opacity', 'transform', 'pointer-events']) copy.style.removeProperty(property);
      hint?.style.removeProperty('opacity');
      track.style.removeProperty('height');
      track.style.removeProperty('--intro-top'); track.style.removeProperty('--intro-viewport');
      delete track.dataset.introReady; delete track.dataset.introState;
    };
  }, [scope, galaxy, formation]);
}

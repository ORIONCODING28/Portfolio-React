import { useEffect, type RefObject } from 'react';

/** One-time section entrances. Unenhanced and reduced-motion content stays visible. */
export function useHomeMotion(scope: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = scope.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const compact = matchMedia('(max-width: 760px), (pointer: coarse)');
    const active = new Map<Element, Animation>();
    const finish = () => { active.forEach(animation => animation.finish()); active.clear(); };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (reduced.matches || document.hidden) continue;
        const element = entry.target as HTMLElement;
        const sideways = element.dataset.homeReveal === 'path';
        const distance = compact.matches ? 7 : sideways ? 18 : 14;
        const animation = element.animate([
          { opacity: .4, transform: sideways ? `translateX(${-distance}px)` : `translateY(${distance}px)` },
          { opacity: 1, transform: 'none' },
        ], {
          duration: compact.matches ? 380 : sideways ? 700 : 560,
          delay: compact.matches ? 0 : Number(element.dataset.motionDelay ?? 0),
          easing: 'cubic-bezier(.16, 1, .3, 1)',
        });
        active.set(element, animation);
        animation.onfinish = () => active.delete(element);
      }
    }, { threshold: .12, rootMargin: '0px 0px -24px 0px' });
    root.querySelectorAll('[data-home-reveal]').forEach(element => observer.observe(element));
    const visibility = () => { if (document.hidden) finish(); };
    const focus = (event: FocusEvent) => {
      if (event.target instanceof Element) {
        const element = event.target.closest('[data-home-reveal]');
        if (element) active.get(element)?.finish();
      }
    };
    reduced.addEventListener('change', finish);
    document.addEventListener('visibilitychange', visibility);
    root.addEventListener('focusin', focus);
    return () => {
      observer.disconnect();
      active.forEach(animation => animation.cancel());
      reduced.removeEventListener('change', finish);
      document.removeEventListener('visibilitychange', visibility);
      root.removeEventListener('focusin', focus);
    };
  }, [scope]);
}

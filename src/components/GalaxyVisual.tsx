import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import type { GalaxyController } from '../graphics/createGalaxy';
export function GalaxyVisual() {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<GalaxyController | null>(null);
  const { isDark } = useTheme();
  const darkRef = useRef(isDark);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const pausedRef = useRef(paused);
  useEffect(() => {
    let cancelled = false;
    const element = host.current;
    if (!element) return;
    void Promise.all([
      import('../graphics/createGalaxy'),
      document.fonts.load('700 64px "Inter"').catch(() => []),
    ]).then(([{ createGalaxy }]) => {
      if (cancelled) return;
      controller.current = createGalaxy(element, darkRef.current, pausedRef.current);
    }).catch(() => { /* Keep the section background visible if the scene cannot load. */ });
    return () => { cancelled = true; controller.current?.dispose(); controller.current = null; };
  }, []);
  useEffect(() => { darkRef.current = isDark; controller.current?.setTheme(isDark); }, [isDark]);
  useEffect(() => { pausedRef.current = paused; controller.current?.setPaused(paused); }, [paused]);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setPaused(media.matches); };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return <div className="galaxy-visual">
    <div className="galaxy-canvas" ref={host} aria-hidden="true" />
    <span className="sr-only">Web &amp; Mobile Developer</span>
  </div>;
}

import { useEffect, useRef } from 'react';
import { useTheme } from '../hooks/useTheme';
import type { GalaxyController } from '../graphics/createGalaxy';
export function GalaxyVisual() {
  const host = useRef<HTMLDivElement>(null);
  const controller = useRef<GalaxyController | null>(null);
  const { isDark } = useTheme();
  const darkRef = useRef(isDark);
  useEffect(() => {
    let cancelled = false;
    const element = host.current;
    if (!element) return;
    void import('../graphics/createGalaxy').then(({ createGalaxy }) => {
      if (cancelled) return;
      controller.current = createGalaxy(element, darkRef.current, false);
      // Font loading must never block the scene. Refresh its texture when ready.
      void document.fonts?.load('700 64px "Inter"').then(() => {
        if (!cancelled) controller.current?.setTheme(darkRef.current);
      }).catch(() => { /* The canvas keeps its font fallback if loading fails. */ });
    }).catch(() => { /* Keep the section background visible if the scene cannot load. */ });
    return () => { cancelled = true; controller.current?.dispose(); controller.current = null; };
  }, []);
  useEffect(() => { darkRef.current = isDark; controller.current?.setTheme(isDark); }, [isDark]);
  return <div className="galaxy-visual">
    <div className="galaxy-canvas" ref={host} aria-hidden="true" />
    <span className="sr-only">Web &amp; Mobile Developer</span>
  </div>;
}

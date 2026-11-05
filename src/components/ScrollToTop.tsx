import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const previousPath = useRef(pathname);

  useEffect(() => {
    const changed = previousPath.current !== pathname;
    previousPath.current = pathname;
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (changed) document.getElementById('main-content')?.focus({ preventScroll: true });
      return;
    }
    let id: string;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const reveal = () => {
      const target = document.getElementById(id);
      if (!target) return false;
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      return true;
    };
    if (reveal()) return;
    // A lazy route can mount after this effect. Stop watching as soon as its anchor exists.
    const observer = new MutationObserver(() => { if (reveal()) observer.disconnect(); });
    observer.observe(document.getElementById('main-content') ?? document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, hash]);

  return null;
};

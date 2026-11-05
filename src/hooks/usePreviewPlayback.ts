import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { getPreviewCorrectionRate } from '../domain/previewPlayback';

/** One clock and visibility boundary for the desktop/phone pair. No render loop. */
export function usePreviewPlayback(container: RefObject<HTMLDivElement | null>, paused: boolean, mediaKey: string) {
  const [blocked, setBlocked] = useState(false);
  const retry = useRef<() => void>(() => {});
  useEffect(() => {
    const host = container.current;
    if (!host) return;
    const videos = [...host.querySelectorAll<HTMLVideoElement>('video[data-preview-source]')];
    if (!videos.length) return;
    let near = false;
    let visible = false;
    let disposed = false;
    let starting = false;
    const stop = () => { for (const video of videos) video.pause(); };
    const wanted = () => !disposed && !paused && visible && !document.hidden;
    const sync = () => {
      if (disposed) return;
      if (near && !paused && !document.hidden) {
        for (const video of videos) {
          if (!video.getAttribute('src')) {
            video.muted = true;
            video.defaultMuted = true;
            video.playsInline = true;
            video.preload = 'auto';
            video.src = video.dataset.previewSource!;
            video.load();
          }
        }
      }
      if (!wanted()) { stop(); return; }
      if (starting || videos.some(video => video.readyState < 3 || video.seeking || video.error)) return;
      starting = true;
      void Promise.all(videos.map(video => video.play())).then(() => {
        starting = false;
        if (disposed) return;
        setBlocked(false);
        if (!wanted()) stop();
      }).catch(() => { starting = false; stop(); if (!disposed) setBlocked(true); });
    };
    const restart = () => {
      stop();
      for (const video of videos) { video.playbackRate = 1; video.currentTime = 0; }
      sync();
    };
    const nearby = new IntersectionObserver(([entry]) => { near = entry.isIntersecting; sync(); }, { rootMargin: '300px' });
    const onscreen = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    nearby.observe(host); onscreen.observe(host);
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('pageshow', sync);
    retry.current = sync;
    for (const video of videos) {
      video.addEventListener('canplay', sync);
      video.addEventListener('seeked', sync);
      video.addEventListener('waiting', stop);
      video.addEventListener('ended', restart);
    }
    const clock = window.setInterval(() => {
      if (!wanted() || starting || videos.some(video => video.paused || video.seeking || video.readyState < 3)) return;
      const master = videos[0];
      for (const follower of videos.slice(1)) {
        const difference = follower.currentTime - master.currentTime;
        if (Math.abs(difference) > .3) {
          stop();
          follower.currentTime = master.currentTime;
          break;
        }
        follower.playbackRate = getPreviewCorrectionRate(master.currentTime, follower.currentTime);
      }
    }, 1000);
    return () => {
      disposed = true;
      window.clearInterval(clock);
      nearby.disconnect(); onscreen.disconnect();
      document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('pageshow', sync);
      retry.current = () => {};
      for (const video of videos) {
        video.removeEventListener('canplay', sync);
        video.removeEventListener('seeked', sync);
        video.removeEventListener('waiting', stop);
        video.removeEventListener('ended', restart);
      }
      stop();
    };
  }, [container, paused, mediaKey]);
  return { blocked, retry: () => retry.current() };
}

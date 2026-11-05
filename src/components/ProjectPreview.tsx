import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, LockKeyhole, PanelLeft, Pause, Play, Plus, RotateCw, Share, Square } from 'lucide-react';
import type { Project } from '../types';
import { usePortfolio } from '../hooks/usePortfolio';
import { usePreviewPlayback } from '../hooks/usePreviewPlayback';
import './project-preview.css';

export function ProjectPreview({ project, priority = false }: { project: Project; priority?: boolean }) {
  const { isEnglish } = usePortfolio();
  const pair = useRef<HTMLDivElement>(null);
  const [desktopFailed, setDesktopFailed] = useState(false);
  const [mobileFailed, setMobileFailed] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const changed = () => setReduced(query.matches);
    query.addEventListener('change', changed);
    return () => query.removeEventListener('change', changed);
  }, []);
  const paused = userPaused ?? reduced;
  const media = project.media;
  const desktop = media?.desktop || project.image;
  const mobile = media?.mobile;
  const hasVideo = Boolean(media?.desktopVideo || media?.mobileVideo);
  const desktopPoster = media?.desktopPoster || desktop || '';
  const mobilePoster = media?.mobilePoster || mobile || '';
  usePreviewPlayback(pair, paused, `${media?.desktopVideo || ''}:${media?.mobileVideo || ''}:${desktopFailed}:${mobileFailed}`);
  const desktopLabel = `${project.title} — ${isEnglish ? 'desktop preview' : 'anteprima desktop'}`;
  const mobileLabel = `${project.title} — ${isEnglish ? 'mobile preview' : 'anteprima mobile'}`;
  return <figure className="project-showcase">
    <div ref={pair} className={`project-preview${mobile ? ' project-preview-pair' : ''}${hasVideo ? ' project-preview-video' : ''}`}>
      <div className="preview-browser">
        <div className="preview-browser-bar" aria-hidden="true">
          <span className="preview-safari-left"><span className="preview-window-controls"><i/><i/><i/></span><PanelLeft/><ChevronLeft/><ChevronRight/></span>
          <span className="preview-address"><LockKeyhole/><span>{media?.domain || project.title}</span><RotateCw/></span>
          <span className="preview-safari-right"><Share/><Plus/><Square/></span>
        </div>
        {media?.desktopVideo && !desktopFailed ? <video data-preview-source={media.desktopVideo} poster={desktopPoster} aria-label={desktopLabel} muted playsInline preload="none" className="preview-desktop-screen" onError={() => setDesktopFailed(true)}/>
          : desktop && <img className="preview-desktop-screen" src={desktopPoster} alt={desktopLabel} width="2532" height="1384" loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async"/>}
      </div>
      {mobile && <div className="preview-phone">
        <span className="preview-phone-button" aria-hidden="true"/>
        <div className="preview-phone-display">
          <div className="preview-phone-top" aria-hidden="true"><span className="preview-phone-island"><i/></span></div>
          {media?.mobileVideo && !mobileFailed ? <video data-preview-source={media.mobileVideo} poster={mobilePoster} aria-label={mobileLabel} muted playsInline preload="none" className="preview-mobile-screen" onError={() => setMobileFailed(true)}/>
            : <img className="preview-mobile-screen" src={mobilePoster} alt={mobileLabel} width="390" height="844" loading="lazy" decoding="async"/>}
          <span className="preview-phone-bottom" aria-hidden="true"><i/></span>
        </div>
      </div>}
    </div>
    {hasVideo && <button type="button" className="preview-playback" aria-pressed={paused} onClick={() => setUserPaused(!paused)}>
      {paused ? <Play size={15} aria-hidden="true"/> : <Pause size={15} aria-hidden="true"/>}
      {paused ? (isEnglish ? 'Play previews' : 'Riproduci anteprime') : (isEnglish ? 'Pause previews' : 'Pausa anteprime')}
    </button>}
    <figcaption className="sr-only">{isEnglish ? 'Desktop and mobile previews of the published website.' : 'Anteprime desktop e mobile del sito pubblicato.'}</figcaption>
  </figure>;
}

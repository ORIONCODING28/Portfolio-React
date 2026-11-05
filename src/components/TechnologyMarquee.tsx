import { useEffect, useRef, useState } from 'react';
import { usePortfolio } from '../hooks/usePortfolio';
import { technologyRows, type Technology } from '../content/technologies';
import { JourneyStageModal } from './JourneyStageModal';
import './technology-marquee.css';

export function TechnologyMarquee() {
  const host = useRef<HTMLElement>(null);
  const keyboardNavigation = useRef(false);
  const [selected, setSelected] = useState<Technology | null>(null);
  const [copies, setCopies] = useState([2, 2]);
  const { isEnglish } = usePortfolio();
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let visible = false;
    const sync = () => { element.dataset.running = String(visible && !document.hidden); };
    const keydown = (event: KeyboardEvent) => { if (event.key === 'Tab') keyboardNavigation.current = true; };
    const pointerdown = () => {
      keyboardNavigation.current = false;
      element.querySelectorAll<HTMLElement>('.technology-row').forEach(row => { row.dataset.keyboardActive = 'false'; });
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    const fit = () => {
      const next = [...element.querySelectorAll<HTMLElement>('.technology-row')].map(row => {
        const track = row.firstElementChild, group = track?.firstElementChild;
        if (!(track instanceof HTMLElement) || !(group instanceof HTMLElement)) return 2;
        const width = group.getBoundingClientRect().width;
        track.style.setProperty('--technology-cycle', `${width}px`);
        track.style.setProperty('--technology-duration', `${width / 52}s`);
        return width ? Math.max(2, Math.ceil(row.clientWidth / width) + 1) : 2;
      });
      setCopies(previous => previous.every((count, i) => count === next[i]) ? previous : next);
    };
    const resize = new ResizeObserver(fit);
    resize.observe(element);
    element.querySelectorAll('.technology-group:first-child').forEach(group => resize.observe(group));
    fit();
    observer.observe(element);
    document.addEventListener('visibilitychange', sync);
    document.addEventListener('keydown', keydown, true);
    document.addEventListener('pointerdown', pointerdown, true);
    return () => {
      observer.disconnect(); document.removeEventListener('visibilitychange', sync);
      resize.disconnect();
      document.removeEventListener('keydown', keydown, true); document.removeEventListener('pointerdown', pointerdown, true);
    };
  }, []);
  return <section ref={host} className="technology-marquee" aria-label={isEnglish ? 'Technologies I work with' : 'Tecnologie con cui lavoro'} data-running="false" data-paused={selected !== null}>
    {technologyRows.map((technologies, row) => <div className="technology-row" key={row}
      onFocusCapture={event => {
        if (!(event.target instanceof HTMLElement) || !keyboardNavigation.current || selected) return;
        event.currentTarget.dataset.keyboardActive = 'true';
        const track = event.currentTarget.firstElementChild;
        if (!(track instanceof HTMLElement)) return;
        const target = event.target.getBoundingClientRect(), bounds = event.currentTarget.getBoundingClientRect();
        const offset = parseFloat(track.style.getPropertyValue('--keyboard-offset')) || 0;
        const adjustment = target.left < bounds.left + 8 ? bounds.left + 8 - target.left
          : target.right > bounds.right - 8 ? bounds.right - 8 - target.right : 0;
        track.style.setProperty('--keyboard-offset', `${offset + adjustment}px`);
      }}
      onBlurCapture={event => {
        if (selected || (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))) return;
        event.currentTarget.dataset.keyboardActive = 'false';
        const track = event.currentTarget.firstElementChild;
        if (track instanceof HTMLElement) track.style.removeProperty('--keyboard-offset');
      }}>
      <div className={`technology-track${row ? ' technology-track-reverse' : ''}`}>
        {Array.from({ length: copies[row] }, (_, copy) => <div className="technology-group" key={copy} aria-hidden={copy > 0 ? true : undefined}>
          {technologies.map(technology => <button type="button" key={technology.id} className={`technology-item technology-${technology.id}`} tabIndex={copy ? -1 : 0}
            aria-label={`${isEnglish ? 'Discover' : 'Scopri'} ${technology.name}`} aria-haspopup="dialog" aria-controls="technology-explanation" onClick={() => setSelected(technology)}>
            <img src={technology.icon} alt="" width="36" height="36" loading="lazy" decoding="async" />
            <span>{technology.name}</span>
          </button>)}
        </div>)}
      </div>
    </div>)}
    <JourneyStageModal id="technology-explanation" icon={selected?.icon}
      stage={selected ? { name: selected.name, description: selected.description[isEnglish ? 'en' : 'it'] } : null}
      onClose={() => {
        keyboardNavigation.current = false;
        host.current?.querySelectorAll<HTMLElement>('.technology-row').forEach(row => { row.dataset.keyboardActive = 'false'; });
        setSelected(null);
      }} />
  </section>;
}

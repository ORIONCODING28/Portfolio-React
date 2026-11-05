import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { ProjectCard } from '../components/ProjectCard';
import { getAdjacentProjectIndex } from '../domain/projects';
import './projects.css';

export function ProjectsPage() {
  const { copy, projects, isEnglish } = usePortfolio();
  const [selected, setSelected] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const index = Math.min(selected, Math.max(0, projects.length - 1));
  const move = (direction: -1 | 1) => setSelected(getAdjacentProjectIndex(index, direction, projects.length));
  const pointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' || projects.length < 2 || (event.target as Element).closest('a,button,input')) return;
    start.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const origin = start.current;
    start.current = null;
    if (!origin) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) move(dx < 0 ? 1 : -1);
  };
  return <section className="work-shell work-catalog">
    <header className="work-heading"><h1>{copy.projects}</h1><p>{isEnglish ? 'From an idea to a working website. The projects I have built, the decisions behind them and my contribution.' : 'Dall’idea a un sito funzionante. I progetti che ho realizzato, le scelte dietro al risultato e il mio contributo.'}</p></header>
    {projects.length > 0 && <section className="work-project-carousel" aria-label={copy.projects} aria-roledescription={projects.length > 1 ? (isEnglish ? 'carousel' : 'carosello') : undefined}>
      {projects.length > 1 && <div className="work-carousel-toolbar">
        <p className="work-carousel-count" role="status" aria-live="polite" aria-atomic="true"><span>{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</span><span>{projects[index].title.replace('Progetto ', '')}</span></p>
        <div className="work-carousel-controls"><button type="button" aria-label={isEnglish ? 'Previous project' : 'Progetto precedente'} onClick={() => move(-1)}><ArrowLeft aria-hidden="true"/></button><button type="button" aria-label={isEnglish ? 'Next project' : 'Progetto successivo'} onClick={() => move(1)}><ArrowRight aria-hidden="true"/></button></div>
      </div>}
      <div className="work-carousel-slide" onPointerDown={pointerDown} onPointerUp={pointerUp} onPointerCancel={() => { start.current = null; }}>
        <ProjectCard key={projects[index].slug} project={projects[index]} priority/>
      </div>
    </section>}
    {!projects.length && <p>{isEnglish ? 'New projects are on their way.' : 'I prossimi progetti arriveranno qui.'}</p>}
  </section>;
}

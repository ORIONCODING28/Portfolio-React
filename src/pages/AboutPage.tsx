import { publicAsset } from '../domain/deployment.ts';
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { profileSteps } from '../content/profile';
import { swipeDirection } from '../domain/swipe';
import { cyclePage } from '../domain/carousel';
import { ProfileObjectVisual } from '../components/ProfileObjectVisual';
import { ProfileCertifications } from '../components/ProfileCertifications';
import { ExternalLink } from '../components/ExternalLink';
import './about.css';

export function AboutPage() {
  const { settings, isEnglish } = usePortfolio();
  const steps = profileSteps[isEnglish ? 'en' : 'it'];
  const [selected, setSelected] = useState(0);
  const copyPanel = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number; id: number } | null>(null);
  const swiped = useRef(false);
  const step = steps[selected];
  const go = (index: number) => setSelected(cyclePage(index, steps.length));
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const animation = copyPanel.current?.animate([{ opacity: 0, transform: 'translateX(18px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 430, easing: 'cubic-bezier(.16,1,.3,1)' });
    return () => animation?.cancel();
  }, [selected]);
  const keys = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLCanvasElement || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    go(event.key === 'Home' ? 0 : event.key === 'End' ? steps.length - 1 : selected + (event.key === 'ArrowRight' ? 1 : -1));
  };
  const pointerStart = (event: PointerEvent<HTMLElement>) => {
    swiped.current = false;
    const compact = matchMedia('(max-width:1023px)').matches;
    const mouseDrag = compact && event.pointerType === 'mouse' && event.button === 0;
    const target = event.target instanceof Element ? event.target : null;
    if ((event.pointerType !== 'touch' && !mouseDrag) || !event.isPrimary || target?.closest('dialog') || (!compact && target?.closest('.profile-object-host'))) { touch.current=null; return; }
    touch.current = { x:event.clientX, y:event.clientY, id:event.pointerId };
  };
  const pointerMove = (event: PointerEvent<HTMLElement>) => {
    const start=touch.current; if (!start || start.id !== event.pointerId) return;
    const dx=Math.abs(event.clientX-start.x),dy=Math.abs(event.clientY-start.y);
    if (dx>10 && dx>dy*1.3 && !event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
  };
  const pointerEnd = (event: PointerEvent<HTMLElement>) => {
    const start=touch.current; touch.current=null;
    if (!start || start.id!==event.pointerId) return;
    const direction=swipeDirection(start,{x:event.clientX,y:event.clientY});
    if (direction) { swiped.current=true; go(selected+direction); }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const groups = [
    { title: 'Web', description: isEnglish ? 'Responsive interfaces, reusable components and API integration.' : 'Interfacce responsive, componenti riutilizzabili e collegamento con le API.', tools: ['React · Angular · TypeScript', 'HTML · CSS · Tailwind CSS'] },
    { title: 'Mobile', description: isEnglish ? 'Applications and interfaces designed for phones, with attention to user flows.' : 'Applicazioni e interfacce pensate per il telefono, con attenzione ai flussi di utilizzo.', tools: ['React Native · Flutter'] },
    { title: isEnglish ? 'Backend and data' : 'Backend e dati', description: isEnglish ? 'Application logic, services and information management.' : 'Logica applicativa, servizi e organizzazione delle informazioni.', tools: ['PHP · Node.js · Python · Java · C', 'MySQL · SQL'] },
    { title: isEnglish ? 'Tools' : 'Strumenti', description: isEnglish ? 'Version control, development environments and supporting tools.' : 'Versionamento del codice, ambienti di lavoro e strumenti a supporto dello sviluppo.', tools: ['Git · Docker · Vite', 'Claude · Gemini · GPT'] },
  ];
  return <div className="about-page">
    <section className="about-intro"><div className="page-container about-intro-grid"><div>
      <h1>Giuseppe Cairone</h1>
      <div className="about-identity"><p>Web &amp; Mobile Developer</p></div>
      <p className="about-bio">{isEnglish ? 'I feel at home building both interfaces and the logic that makes them work. I enjoy creating complete applications, connecting what users see to the services and data working behind the scenes.' : 'Mi trovo a mio agio sia nello sviluppo delle interfacce sia nella logica che le fa funzionare. Mi interessa costruire applicazioni complete, collegando ciò che vede l’utente ai servizi e ai dati che lavorano dietro le quinte.'}</p>
      <ExternalLink className="button about-outline about-cv-link" href={settings.cv_file}>{isEnglish ? 'View CV' : 'Visualizza il CV'}<span className="sr-only">{isEnglish ? ' (opens in a new tab)' : ' (si apre in una nuova scheda)'}</span></ExternalLink>
    </div><figure className="about-portrait"><img src={settings.author_image} alt="Giuseppe Cairone" width="704" height="986" fetchPriority="high" /><figcaption>{settings.location}</figcaption></figure></div></section>
    <section className="about-section" aria-labelledby="profile-journey-title"><div className="page-container about-journey" onPointerDown={pointerStart} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={() => { touch.current=null; }} onClickCapture={event => { if(swiped.current && event.detail!==0) { event.preventDefault(); event.stopPropagation(); swiped.current=false; } }}>
      <div className="about-journey-heading"><div><h2 id="profile-journey-title">{isEnglish ? 'My journey' : 'Il mio percorso'}</h2><p>{isEnglish ? 'Education, work experience and software development.' : 'Formazione, esperienze di lavoro e sviluppo software.'}</p></div>
        <div className="about-arrows"><button type="button" onClick={() => go(selected - 1)} aria-label={isEnglish ? 'Previous stage' : 'Tappa precedente'} aria-controls="profile-step-panel"><ChevronLeft aria-hidden="true" /></button><button type="button" onClick={() => go(selected + 1)} aria-label={isEnglish ? 'Next stage' : 'Tappa successiva'} aria-controls="profile-step-panel"><ChevronRight aria-hidden="true" /></button></div>
      </div>
      <div className="about-nearby" aria-label={isEnglish ? 'Choose a stage' : 'Scegli una tappa'}>{[-1, 0, 1].map(offset => {
        const index = cyclePage(selected + offset, steps.length);
        return <button key={index} type="button" aria-current={index === selected ? 'step' : undefined} onClick={() => go(index)}><span>{steps[index].date}</span>{steps[index].short}</button>;
      })}</div>
      <div id="profile-step-panel" className="about-stage" role="region" aria-labelledby="profile-stage-title" tabIndex={0} onKeyDown={keys}>
        <ProfileObjectVisual stage={selected} />
        <div className="about-stage-copy" ref={copyPanel}>
          <p className="about-stage-date">{step.date}</p><h3 id="profile-stage-title">{step.title}</h3><p className="about-step-subtitle">{step.sub}</p><p className="about-step-context">{step.context}</p><p className="about-step-body">{step.body}</p>
          <ul>{step.points.map(point => <li key={point}>{point}</li>)}</ul>{step.note && <p className="about-step-note">{step.note}</p>}
        </div>
      </div>
      <div className="about-journey-bottom"><span aria-live="polite" aria-atomic="true">{String(selected + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</span><p>{isEnglish ? 'Choose a stage or swipe to explore' : 'Scegli una tappa o scorri per esplorare'}</p></div>
    </div></section>
    <section className="about-section"><div className="page-container about-skills"><h2>{isEnglish ? 'Skills' : 'Competenze'}</h2><p>{isEnglish ? 'Interfaces, services and data: the different areas I enjoy working on.' : 'Interfacce, servizi e dati: le diverse parti su cui mi piace lavorare.'}</p><div className="about-skills-grid">{groups.map((group, index) => <article key={group.title}><div className="about-skill-icons" aria-hidden="true">{[['react','angular','typescript'],['react'],['python','java','mysql'],['git','docker']][index].map(icon => <img key={icon} src={publicAsset(`/assets/technology-icons/${icon}.svg`)} alt="" width="33" height="33" loading="lazy" />)}</div><h3>{group.title}</h3><p>{group.description}</p><ul>{group.tools.map(tool => <li key={tool}>{tool}</li>)}</ul></article>)}</div></div></section>
    <ProfileCertifications />
  </div>;
}

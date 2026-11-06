import { useEffect, useRef, useState } from 'react';
import { JourneyStageModal } from './JourneyStageModal';
import { usePortfolio } from '../hooks/usePortfolio';
import { useTheme } from '../hooks/useTheme';
import type { JourneyController } from '../graphics/createJourneyScene';

const journeyStages = {
  it: [
    { name:'Idea', description:'Parto dal problema da risolvere e dalle esigenze di chi userà l’applicazione. Individuo le funzioni essenziali e il risultato da raggiungere: avere una direzione chiara mi aiuta a costruire qualcosa di utile, senza aggiungere complessità inutile.' },
    { name:'Progettazione', description:'Prima di scrivere codice, organizzo le schermate, i percorsi dell’utente e la struttura dei dati. Ragiono su come le diverse parti devono comunicare, così ogni funzione trova il suo posto e l’esperienza rimane coerente dall’inizio alla fine.' },
    { name:'Interfaccia', description:'Trasformo la struttura in schermate utilizzabili, curando gerarchia dei contenuti, leggibilità e interazioni. Adatto gli spazi a desktop, tablet e mobile e considero anche la navigazione da tastiera: l’interfaccia deve rendere semplice capire dove andare e cosa fare.' },
    { name:'Logica e dati', description:'Collego ciò che si vede alle funzioni che fanno lavorare l’applicazione: API, database e regole di gestione dei dati. Mi occupo dei controlli sugli input e degli stati di caricamento, successo ed errore, per dare risposte chiare anche quando qualcosa non va.' },
    { name:'Test', description:'Verifico i percorsi principali e i casi meno immediati: campi vuoti, dati non validi, errori e contenuti più lunghi del previsto. Controllo il comportamento sui diversi schermi e correggo i problemi che possono ostacolare l’utilizzo dell’applicazione.' },
    { name:'Miglioramento', description:'Riguardo il risultato e individuo ciò che può diventare più chiaro, veloce o semplice da mantenere. Rivedo interazioni, codice e prestazioni, usando i problemi emersi durante le verifiche come punto di partenza per il passo successivo.' },
  ],
  en: [
    { name:'Idea', description:'I start with the problem and the needs of the people using the application. I identify the essential features and the intended outcome, giving the project a clear direction without adding unnecessary complexity.' },
    { name:'Planning', description:'Before writing code, I plan screens, user flows and the data structure. I consider how the different parts communicate, so each feature has a clear purpose and the experience stays consistent from start to finish.' },
    { name:'Interface', description:'I turn the structure into usable screens, taking care of content hierarchy, readability and interactions. I adapt the layout for desktop, tablet and mobile and consider keyboard navigation, helping people understand where to go and what to do.' },
    { name:'Logic & data', description:'I connect the interface to the logic behind it: APIs, databases and data handling rules. Input validation and loading, success and error states help the application provide clear feedback, including when something goes wrong.' },
    { name:'Testing', description:'I check the main user flows alongside empty fields, invalid data, errors and unexpectedly long content. I review behaviour across screen sizes and fix issues that can get in the way of using the application.' },
    { name:'Improvement', description:'I review the result to find what could be clearer, faster or easier to maintain. I refine interactions, code and performance, using issues found during testing as the starting point for the next improvement.' },
  ],
};

export function JourneyVisual() {
  const host=useRef<HTMLDivElement>(null);
  const label=useRef<HTMLSpanElement>(null);
  const buttons=useRef<(HTMLButtonElement|null)[]>([]);
  const controller=useRef<JourneyController|null>(null);
  const { isEnglish }=usePortfolio();
  const { isDark }=useTheme();
  const dark=useRef(isDark);
  useEffect(()=>{dark.current=isDark;controller.current?.setTheme(isDark);},[isDark]);
  const stages=journeyStages[isEnglish ? 'en' : 'it'];
  const stageNames=useRef(stages);
  useEffect(()=>{stageNames.current=stages;},[stages]);
  const [ready,setReady]=useState(false);
  const [selected,setSelected]=useState<number|null>(null);
  const select=(index:number|null)=>{controller.current?.select(index);setSelected(index);};
  useEffect(()=>{
    const element=host.current;
    if(!element)return;
    let cancelled=false, captionWidth=0;
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting))return;
      observer.disconnect();
      void import('../graphics/createJourneyScene').then(({createJourneyScene})=>{
        if(cancelled)return;
        try {
          controller.current=createJourneyScene(element,stage=>{
            if(stage)buttons.current.forEach((button,index)=>{if(button)button.hidden=index>=stage.revealed;});
            const caption=label.current;
            if(!caption)return;
            caption.style.opacity=String(stage?.opacity ?? 0);
            if(!stage){caption.style.removeProperty('--stage-x');caption.style.removeProperty('--stage-y');}
            if(stage){
              const name=stageNames.current[stage.index].name;
              if(caption.textContent!==name){caption.textContent=name;captionWidth=caption.getBoundingClientRect().width;}
              const edge=captionWidth/2+12;
              const x=Math.max(edge,Math.min(element.clientWidth-edge,element.clientWidth*stage.x/100));
              caption.style.setProperty('--stage-x',`${x}px`);
              caption.style.setProperty('--stage-y',`${stage.y}%`);
            }
          },points=>points.forEach((point,index)=>{
            const button=buttons.current[index];
            if(button){button.style.left=`${point.x}%`;button.style.top=`${point.y}%`;}
          }),dark.current);
          setReady(true);
        } catch {setReady(false);}
      }).catch(()=>{if(!cancelled)setReady(false);});
    },{rootMargin:'200px'});
    observer.observe(element);
    return ()=>{cancelled=true;observer.disconnect();controller.current?.dispose();controller.current=null;};
  },[]);
  return <div className="journey-visual">
    <div ref={host} className="home-journey-path" data-home-reveal="path" role="group" aria-label={isEnglish ? 'From idea to improvement' : 'Dall’idea al miglioramento'}>
      <span ref={label} className="journey-stage-label" aria-hidden="true" />
      {stages.map((stage,index)=><button key={index} ref={button=>{buttons.current[index]=button;}} className="journey-node-button" type="button" disabled={!ready} aria-label={`${isEnglish ? 'Explore phase' : 'Esplora fase'}: ${stage.name}`} aria-pressed={selected===index} aria-controls="journey-explanation" aria-haspopup="dialog" onClick={()=>select(index)} onKeyDown={event=>{if(event.key==='Escape'){select(null);}}} />)}
    </div>
    <div className="journey-interaction"><p className="journey-instruction">{isEnglish ? 'Select a star to pause and explore a phase.' : 'Seleziona una stella per fermarti e scoprire la fase.'}</p></div>
    <JourneyStageModal stage={selected===null ? null : stages[selected]} onClose={()=>select(null)} />
    <ol className="sr-only">{stages.map(stage=><li key={stage.name}>{stage.name}: {stage.description}</li>)}</ol>
  </div>;
}

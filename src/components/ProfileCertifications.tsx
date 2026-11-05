import { useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CertificateDialog } from './CertificateDialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { cyclePage } from '../domain/carousel';

export function ProfileCertifications() {
  const { certifications, isEnglish } = usePortfolio();
  const [params,setParams]=useSearchParams();
  const selected=certifications.find(cert=>String(cert.id??cert.title)===params.get('certificate'));
  const preview=(key:string|null)=>{
    const next=new URLSearchParams(params);
    if(key)next.set('certificate',key);else next.delete('certificate');
    setParams(next,{replace:!key,preventScrollReset:true});
  };
  const swiped=useRef(false);
  const viewport=useRef<HTMLDivElement>(null), track=useRef<HTMLUListElement>(null);
  const currentPage=useRef(0), drag=useRef<{ id:number; x:number; left:number } | null>(null);
  const visibleCount=()=>matchMedia('(max-width:639px)').matches?1:matchMedia('(min-width:1280px)').matches?3:2;
  const [perPage,setPerPage]=useState(visibleCount);
  const [page,setPage]=useState(0);
  const count=Math.max(1,certifications.length);
  const cyclic=count>perPage;
  const copies=cyclic?3:1;
  useEffect(()=>{
    const compact=matchMedia('(max-width:639px)'),wide=matchMedia('(min-width:1280px)');
    const sync=()=>setPerPage(compact.matches?1:wide.matches?3:2);
    compact.addEventListener('change',sync);wide.addEventListener('change',sync);
    return ()=>{compact.removeEventListener('change',sync);wide.removeEventListener('change',sync);};
  },[]);
  useEffect(()=>{
    const element=viewport.current,list=track.current;if(!element||!list)return;
    let settling:ReturnType<typeof setTimeout> | undefined;
    const stride=()=>((list.firstElementChild as HTMLElement | null)?.getBoundingClientRect().width ?? 0)+parseFloat(getComputedStyle(list).gap);
    const settle=()=>{
      if(drag.current||!cyclic)return;
      const size=stride(), index=Math.round(element.scrollLeft/size);
      if(index<count||index>=count*2) element.scrollTo({left:(count+cyclePage(index,count))*size,behavior:'instant'});
    };
    const sync=()=>{
      const size=stride();if(!size)return;
      const logical=cyclePage(Math.round(element.scrollLeft/size),count);
      currentPage.current=logical;setPage(previous=>previous===logical?previous:logical);
      clearTimeout(settling);settling=setTimeout(settle,160);
    };
    const resize=()=>{
      const logical=cyclePage(currentPage.current,count);
      element.scrollTo({left:(cyclic?count+logical:0)*stride(),behavior:'instant'});
      sync();
    };
    const observer=new ResizeObserver(resize);observer.observe(element);
    element.addEventListener('scroll',sync,{passive:true});element.addEventListener('scrollend',settle);
    resize();
    return ()=>{clearTimeout(settling);observer.disconnect();element.removeEventListener('scroll',sync);element.removeEventListener('scrollend',settle);};
  },[count,perPage,cyclic,certifications]);
  const move=(delta:number)=>{
    const element=viewport.current,list=track.current;if(!element||!list||!cyclic)return;
    const size=((list.firstElementChild as HTMLElement | null)?.getBoundingClientRect().width ?? 0)+parseFloat(getComputedStyle(list).gap);
    const logical=cyclePage(currentPage.current,count);
    const physical=Math.round(element.scrollLeft/size);
    if(physical<count||physical>=count*2)element.scrollTo({left:(count+logical)*size,behavior:'instant'});
    element.scrollTo({left:(count+logical+delta)*size,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});
  };
  const startDrag=(event:PointerEvent<HTMLDivElement>)=>{
    if(event.pointerType!=='mouse'||event.button!==0||!cyclic)return;
    swiped.current=false;
    drag.current={id:event.pointerId,x:event.clientX,left:event.currentTarget.scrollLeft};
    event.currentTarget.style.scrollSnapType='none';
  };
  const endDrag=(event:PointerEvent<HTMLDivElement>)=>{
    if(drag.current?.id!==event.pointerId)return;
    drag.current=null;event.currentTarget.style.scrollSnapType='';
    if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);
    if(!swiped.current)return;
    const list=track.current;if(!list)return;
    const size=((list.firstElementChild as HTMLElement | null)?.getBoundingClientRect().width ?? 0)+parseFloat(getComputedStyle(list).gap);
    event.currentTarget.scrollTo({left:Math.round(event.currentTarget.scrollLeft/size)*size,behavior:'smooth'});
  };
  return <section id="profile-certifications" className="about-section"><div className="page-container about-certifications">
    <div className="profile-cert-heading"><h2>{isEnglish?'Certifications':'Certificazioni'}</h2><div className="about-arrows"><button type="button" disabled={!cyclic} onClick={()=>move(-1)} aria-label={isEnglish?'Previous certificates':'Certificazioni precedenti'}><ChevronLeft aria-hidden="true"/></button><button type="button" disabled={!cyclic} onClick={()=>move(1)} aria-label={isEnglish?'Next certificates':'Certificazioni successive'}><ChevronRight aria-hidden="true"/></button></div><p>{isEnglish?'Verifiable certificates and credentials.':'Attestati e credenziali verificabili.'}</p></div>
    <div className="profile-cert-gallery"><div className="profile-cert-viewport" ref={viewport} role="region" aria-label={isEnglish?'Certifications carousel':'Carosello certificazioni'} tabIndex={0}
      onKeyDown={event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}}}
      onPointerDown={startDrag} onPointerMove={event=>{if(drag.current?.id===event.pointerId){if(Math.abs(event.clientX-drag.current.x)>6){swiped.current=true;event.currentTarget.setPointerCapture(event.pointerId);}if(swiped.current)event.currentTarget.scrollLeft=drag.current.left+drag.current.x-event.clientX;}}}
      onClickCapture={event=>{if(swiped.current&&event.detail!==0){event.preventDefault();event.stopPropagation();}}}
      onPointerUp={endDrag} onPointerCancel={endDrag} onDragStart={event=>event.preventDefault()}>
      <ul className="profile-cert-track" ref={track}>{Array.from({length:copies},(_,copy)=>certifications.map((cert,index)=><li key={`${copy}-${cert.id??index}`} aria-hidden={copies>1&&copy!==1?true:undefined}><button type="button" className="profile-cert-image" aria-haspopup="dialog" aria-label={(isEnglish?'View certificate: ':'Visualizza attestato: ')+cert.title} tabIndex={copies>1&&copy!==1?-1:0} onClick={()=>preview(String(cert.id??cert.title))}>{(cert.badge||cert.image)&&<img src={cert.badge||cert.image} alt="" width="160" height="160" loading="lazy" draggable={false}/>}</button><div><h3>{cert.title}</h3><p>{cert.issuing_organization}</p></div></li>))}</ul>
    </div><span className="sr-only" aria-live="polite">{cyclic?`${isEnglish?'Position':'Posizione'} ${page+1} / ${count}`:`${certifications.length} ${isEnglish?'certificates':'certificazioni'}`}</span></div>
  </div>{selected&&<CertificateDialog key={selected.id??selected.title} certificate={selected} onClose={()=>preview(null)}/>}</section>;
}

import { useEffect, useRef, type RefObject } from 'react';
import { useTheme } from '../hooks/useTheme';
import type { GalaxyController, GalaxyPresentation } from '../graphics/createGalaxy';

export function GalaxyVisual({controller,presentation,prompt}: {controller:RefObject<GalaxyController|null>; presentation:RefObject<GalaxyPresentation|null>; prompt:string}) {
  const host=useRef<HTMLDivElement>(null);
  const {isDark}=useTheme();
  const dark=useRef(isDark);
  useEffect(()=>{
    const element=host.current; if(!element)return;
    let cancelled=false;
    void import('../graphics/createGalaxy').then(({createGalaxy})=>{
      if(cancelled)return;
      controller.current=createGalaxy(element,dark.current,false,prompt);
      if(presentation.current)controller.current.setPresentation(presentation.current);
      void document.fonts?.load('800 104px "Orbitron"').then(()=>{
        if(!cancelled)controller.current?.refreshPrompt();
      }).catch(()=>{});
      void document.fonts?.load('700 64px "Inter"').then(()=>{
        if(!cancelled)controller.current?.setTheme(dark.current);
      }).catch(()=>{});
    }).catch(()=>{});
    return ()=>{cancelled=true;controller.current?.dispose();controller.current=null;};
  },[controller,presentation,prompt]);
  useEffect(()=>{dark.current=isDark;controller.current?.setTheme(isDark);},[isDark,controller]);
  return <div className="galaxy-visual">
    <div className="galaxy-canvas" ref={host} aria-hidden="true"/>
    <span className="sr-only">{prompt}. Web &amp; Mobile Developer</span>
  </div>;
}

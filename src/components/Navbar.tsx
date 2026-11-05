import { publicAsset } from '../domain/deployment.ts';
import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { usePortfolio } from '../hooks/usePortfolio';
import { Preferences } from './Preferences';
import { ModalLink } from './ModalLink';
import './navbar.css';

export function Navbar() {
  const { copy } = usePortfolio();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const exitAnimation = useRef<Animation|null>(null);
  const pointerStartedOutside = useRef(false);
  const [isOpen, setIsOpen] = useState(false);
  const links = [{ to:'/', label:copy.home }, { to:'/about', label:copy.profile }, { to:'/projects', label:copy.projects }];
  const close = () => {
    const modal=dialog.current;
    if(!modal?.open||exitAnimation.current)return;
    const animation=modal.animate([{transform:'translateX(0)'},{transform:'translateX(100%)'}],{duration:180,easing:'ease-in',fill:'forwards'});
    exitAnimation.current=animation;
    void animation.finished.then(()=>{if(modal.isConnected&&modal.open)modal.close();}).catch(()=>{/* Cancellation is expected during cleanup. */});
  };
  const isOutside=(event:MouseEvent<HTMLDialogElement>|PointerEvent<HTMLDialogElement>)=>{
    const rect=event.currentTarget.getBoundingClientRect();
    return event.target===event.currentTarget&&(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom);
  };
  useEffect(() => {
    if(!isOpen)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const media=window.matchMedia('(min-width:1024px)');
    const resize=()=>{if(media.matches)dialog.current?.close();};
    media.addEventListener('change',resize);
    return ()=>{
      document.body.style.overflow=previous;
      media.removeEventListener('change',resize);
      exitAnimation.current?.cancel();exitAnimation.current=null;
    };
  },[isOpen]);
  return <>
    <header className="site-header"><div className="site-header-inner">
      <Link className="brand" to="/" aria-label="Giuseppe Cairone — Home"><img src={publicAsset("/assets/brand/gc/logo-gc.svg")} width="64" height="46" alt="" className="shrink-0" /></Link>
      <nav className="desktop-navigation" aria-label={copy.navigation}>{links.map(link=><NavLink key={link.to} to={link.to} end={link.to==='/'}>{link.label}</NavLink>)}<ModalLink modal="contact">{copy.contact}</ModalLink></nav>
      <div className="desktop-preferences"><Preferences compact /></div>
      <button className="icon-button menu-trigger" ref={trigger} type="button" aria-label={copy.menuOpen} aria-haspopup="dialog" aria-expanded={isOpen} aria-controls="mobile-navigation" onClick={()=>{dialog.current?.showModal();setIsOpen(true);}}><Menu aria-hidden="true" /></button>
    </div></header>
    <dialog id="mobile-navigation" className="mobile-menu" ref={dialog} aria-label={copy.navigation}
      onPointerDown={event=>{pointerStartedOutside.current=isOutside(event);}}
      onClick={event=>{if(pointerStartedOutside.current&&isOutside(event))close();pointerStartedOutside.current=false;}}
      onKeyDown={event=>{
        if(event.key!=='Tab')return;
        const controls=event.currentTarget.querySelectorAll<HTMLElement>('a[href],button:not([disabled])');
        const first=controls[0],last=controls[controls.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }}
      onCancel={event=>{event.preventDefault();close();}}
      onClose={()=>{setIsOpen(false);trigger.current?.focus({preventScroll:true});}}>
      <div className="mobile-menu-inner">
        <div className="mobile-menu-header"><Link to="/" onClick={close} className="brand" aria-label="Giuseppe Cairone — Home"><img src={publicAsset("/assets/brand/gc/logo-gc.svg")} width="64" height="46" alt="" className="shrink-0" /></Link><button type="button" className="icon-button modal-close-button" onClick={close} aria-label={copy.menuClose} autoFocus><X aria-hidden="true" /></button></div>
        <nav className="mobile-links" aria-label={copy.navigation}>{links.map(link=><NavLink key={link.to} to={link.to} end={link.to==='/'} onClick={close}>{link.label}</NavLink>)}<ModalLink modal="contact" onClick={() => dialog.current?.close()}>{copy.contact}</ModalLink></nav>
        <div className="mobile-menu-bottom"><Preferences /></div>
      </div>
    </dialog>
  </>;
}

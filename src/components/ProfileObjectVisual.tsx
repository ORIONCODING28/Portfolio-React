import { useEffect, useRef, useState } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { usePortfolio } from '../hooks/usePortfolio';
import type { ProfileModelController } from '../graphics/createProfileModel';

const labels = {
  it: ['Chiave a pappagallo', 'Diploma IPSIA', 'Ingranaggio', 'Cazzuola', 'Libro tecnico', 'Mappa del Verismo', 'MacBook Pro'],
  en: ['Pipe wrench', 'IPSIA diploma', 'Gear', 'Trowel', 'Technical book', 'Verismo map', 'MacBook Pro'],
};
export function ProfileObjectVisual({ stage }: { stage: number }) {
  const host = useRef<HTMLDivElement>(null), dialogHost = useRef<HTMLDivElement>(null), dialog = useRef<HTMLDialogElement>(null), opener = useRef<HTMLButtonElement>(null), close = useRef<HTMLButtonElement>(null);
  const model = useRef<ProfileModelController | null>(null), latestStage = useRef(stage), outside = useRef(false);
  const { isDark } = useTheme(), { isEnglish } = usePortfolio(); const dark = useRef(isDark);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading'), [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const element = host.current; if (!element) return; let cancelled = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return; observer.disconnect();
      void import('../graphics/createProfileModel').then(({ createProfileModel }) => {
        if (cancelled) return;
        try { model.current = createProfileModel(element, latestStage.current, dark.current, () => { if (!cancelled) setState('ready'); }, () => { if (!cancelled) setState('error'); }, () => { if (!cancelled) setState('loading'); }); }
        catch { setState('error'); }
      }).catch(() => { if (!cancelled) setState('error'); });
    }, { rootMargin: '120px' }); observer.observe(element);
    return () => { cancelled = true; observer.disconnect(); model.current?.dispose(); model.current = null; };
  }, []);
  useEffect(() => { latestStage.current = stage; model.current?.setStage(stage); }, [stage]);
  useEffect(() => { dark.current = isDark; model.current?.setTheme(isDark); }, [isDark]);
  useEffect(() => {
    const modal = dialog.current, target = dialogHost.current, inline = host.current, controller = model.current;
    if (!expanded || !modal || !target || !inline || !controller) return;
    const overflow = document.body.style.overflow, scroll = window.scrollY, trigger = opener.current;
    document.body.style.overflow = 'hidden'; modal.showModal(); controller.attachTo(target); controller.setTouchInteraction(true); close.current?.focus({ preventScroll: true });
    return () => { controller.attachTo(inline); controller.setTouchInteraction(false); modal.close(); document.body.style.overflow = overflow; window.scrollTo({ top: scroll, behavior: 'instant' }); trigger?.focus({ preventScroll: true }); };
  }, [expanded]);
  const isOutside = (event: MouseEvent<HTMLDialogElement> | PointerEvent<HTMLDialogElement>) => { const r = event.currentTarget.getBoundingClientRect(); return event.target === event.currentTarget && (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom); };
  const label = labels[isEnglish ? 'en' : 'it'][stage];
  return <div className="profile-object">
    <div className="profile-object-host" ref={host} />
    {state !== 'ready' && <p className="profile-object-status" role="status">{state === 'error' ? (isEnglish ? 'Model unavailable' : 'Modello non disponibile') : (isEnglish ? 'Loading model…' : 'Caricamento modello…')}</p>}
    {state === 'ready' && <button ref={opener} type="button" className="profile-object-open" aria-label={`${isEnglish ? 'Explore 3D model' : 'Esplora modello 3D'}: ${label}`} aria-haspopup="dialog" onClick={() => setExpanded(true)} />}
    <p className="profile-object-help"><span className="profile-help-desktop">{isEnglish ? 'Drag to rotate · Scroll to zoom' : 'Trascina per ruotare · Rotella per zoomare'}</span><span className="profile-help-touch">{isEnglish ? 'Tap the object to explore it in 3D' : 'Tocca l’oggetto per esplorarlo in 3D'}</span><span className="sr-only">{isEnglish ? 'Keyboard: arrows, +, −, Home to reset.' : 'Tastiera: frecce, +, −, Home per ripristinare.'}</span></p>
    <dialog className="profile-object-dialog" ref={dialog} aria-labelledby="profile-object-title" onCancel={event => { event.preventDefault(); setExpanded(false); }} onPointerDown={event => { outside.current = isOutside(event); }} onClick={event => { if (outside.current && isOutside(event)) setExpanded(false); outside.current = false; }}>
      <header><h2 id="profile-object-title">{label}</h2><button type="button" className="icon-button modal-close-button" ref={close} aria-label={isEnglish ? 'Close 3D view' : 'Chiudi vista 3D'} onClick={() => setExpanded(false)}><X aria-hidden="true" /></button></header>
      <div className="profile-object-dialog-host" ref={dialogHost} />
      <p>{isEnglish ? 'Drag to rotate · Pinch to zoom' : 'Trascina per ruotare · Pizzica per ingrandire'}</p>
    </dialog>
  </div>;
}

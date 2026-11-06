import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { usePortfolio } from '../hooks/usePortfolio';
import type { DeviceController, DeviceKind } from '../graphics/createDeviceModel';

export function CapabilityVisual({ kind }: { kind: DeviceKind }) {
  const host = useRef<HTMLDivElement>(null);
  const model = useRef<DeviceController | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const dialogHost = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const { isDark } = useTheme();
  const { isEnglish } = usePortfolio();
  const dark = useRef(isDark);
  const [expanded, setExpanded] = useState(false);
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let cancelled = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || cancelled) return;
      observer.disconnect();
      void import('../graphics/createDeviceModel').then(({ createDeviceModel }) => {
        if (cancelled) return;
        try {
          model.current = createDeviceModel(element, kind, dark.current,
            () => { if (!cancelled) setState('ready'); },
            () => { if (!cancelled) setState('error'); });
        } catch { setState('error'); }
      }).catch(() => { if (!cancelled) setState('error'); });
    }, { rootMargin: '96px 0px' });
    observer.observe(element);
    return () => { cancelled = true; observer.disconnect(); model.current?.dispose(); model.current = null; };
  }, [kind]);
  useEffect(() => { dark.current = isDark; model.current?.setTheme(isDark); }, [isDark]);
  useEffect(() => {
    const modal = dialog.current, target = dialogHost.current, inline = host.current;
    const controller = model.current;
    if (!expanded || state !== 'ready' || !modal || !target || !inline || !controller) return;
    const originalOverflow = document.body.style.overflow;
    const originalScroll = { x: window.scrollX, y: window.scrollY };
    const trigger = opener.current;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    controller.attachTo(target);
    controller.setInteractionEnabled(true);
    closeButton.current?.focus({ preventScroll: true });
    return () => {
      controller.attachTo(inline);
      controller.setInteractionEnabled(false);
      modal.close();
      document.body.style.overflow = originalOverflow;
      window.scrollTo({ left: originalScroll.x, top: originalScroll.y, behavior: 'instant' });
      trigger?.focus({ preventScroll: true });
    };
  }, [expanded, state]);
  const label = kind === 'web' ? 'HP OMEN' : kind === 'mobile' ? 'iPhone 15 Pro' : 'Server';
  return <div className={`capability-visual device-${kind}`}>
    <div className="device-canvas" ref={host} />
    {state !== 'ready' && <div className="device-loading" role="status">{state === 'error' ? (isEnglish ? 'Model unavailable. Reload to try again.' : 'Modello non disponibile. Ricarica per riprovare.') : (isEnglish ? 'Loading model…' : 'Caricamento modello…')}</div>}
    {state === 'ready' && <button ref={opener} type="button" className="device-open" onClick={() => setExpanded(true)} aria-label={`${isEnglish ? 'Explore 3D model' : 'Esplora modello 3D'}: ${label}`} aria-haspopup="dialog" />}
    <dialog ref={dialog} className="device-dialog" aria-labelledby={`device-title-${kind}`} aria-describedby={`device-help-${kind}`} onCancel={event => { event.preventDefault(); setExpanded(false); }}>
      <div className="device-dialog-layout">
        <header className="device-dialog-header"><h2 id={`device-title-${kind}`}>{label}</h2><button ref={closeButton} className="device-dialog-close" type="button" onClick={() => setExpanded(false)} aria-label={isEnglish ? 'Close 3D view' : 'Chiudi vista 3D'}><X size={23} aria-hidden="true" /></button></header>
        <div className="device-dialog-host" ref={dialogHost} />
        <p id={`device-help-${kind}`} className="device-dialog-help">{isEnglish ? 'Drag to rotate · Scroll or pinch to zoom' : 'Trascina per ruotare · Rotella o pizzica per ingrandire'}</p>
      </div>
    </dialog>
  </div>;
}

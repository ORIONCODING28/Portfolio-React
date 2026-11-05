import { useEffect, useRef } from 'react';
import type { MouseEvent, PointerEvent, ReactNode } from 'react';
import { X } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import './site-dialog.css';
interface Props { id: string; title: string; intro: string; open: boolean; onClose: () => void; children: ReactNode }
export function SiteDialog({ id, title, intro, open, onClose, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const outside = useRef(false);
  const { isEnglish } = usePortfolio();
  useEffect(() => {
    const element = dialog.current;
    if (!open || !element) return;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    element.querySelector<HTMLButtonElement>('.modal-close-button')?.focus({ preventScroll: true });
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      if (trigger instanceof HTMLElement && trigger.isConnected && trigger.getClientRects().length) trigger.focus({ preventScroll: true });
    };
  }, [open]);
  const isOutside = (event: MouseEvent<HTMLDialogElement> | PointerEvent<HTMLDialogElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return event.target === event.currentTarget && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom);
  };
  return <dialog id={id} className="site-dialog" ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-intro`}
    onPointerDown={event => { outside.current = isOutside(event); }}
    onClick={event => { if (outside.current && isOutside(event)) onClose(); outside.current = false; }}
    onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className="site-dialog-header"><div><h2 id={`${id}-title`}>{title}</h2><p id={`${id}-intro`}>{intro}</p></div><button type="button" className="icon-button modal-close-button" onClick={onClose} aria-label={isEnglish ? 'Close dialog' : 'Chiudi finestra'}><X aria-hidden="true" /></button></header>
    <div className="site-dialog-body">{children}</div>
  </dialog>;
}

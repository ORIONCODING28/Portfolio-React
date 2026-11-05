import { useEffect, useRef } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import { X } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { TerminalWindow } from './TerminalWindow';
import './terminal-modal.css';

export function TerminalModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pointerStartedOutside = useRef(false);
  const isOutside = (event: MouseEvent<HTMLDialogElement> | PointerEvent<HTMLDialogElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return event.target === event.currentTarget && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom);
  };
  const { copy, isEnglish } = usePortfolio();
  useEffect(() => {
    const modal = dialog.current;
    if (!open || !modal) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = document.activeElement;
    document.body.style.overflow = 'hidden';
    modal.showModal();
    modal.querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
    return () => {
      modal.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open]);
  return <dialog id="portfolio-terminal" ref={dialog} className="terminal-modal" aria-labelledby="terminal-title" aria-describedby="terminal-description" onPointerDown={event => { pointerStartedOutside.current = isOutside(event); }} onClick={event => { if (pointerStartedOutside.current && isOutside(event)) onClose(); pointerStartedOutside.current = false; }} onCancel={event => { event.preventDefault(); onClose(); }}>
    {open && <><header className="terminal-modal-header"><div><h2 id="terminal-title">{copy.lab}</h2><p id="terminal-description">{copy.labIntro}</p></div><button type="button" className="icon-button modal-close-button" onClick={onClose} aria-label={isEnglish ? 'Close terminal' : 'Chiudi terminale'}><X aria-hidden="true" /></button></header><TerminalWindow /></>}
  </dialog>;
}

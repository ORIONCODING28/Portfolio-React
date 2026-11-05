import { useEffect, useRef } from 'react';
import type { MouseEvent, PointerEvent } from 'react';
import { X } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import './journey-stage-modal.css';

interface Props { stage: { name: string; description: string } | null; onClose: () => void; id?: string; icon?: string }

export function JourneyStageModal({ stage, onClose, id = 'journey-explanation', icon }: Props) {
  const dialog=useRef<HTMLDialogElement>(null);
  const pointerStartedOutside=useRef(false);
  const { isEnglish }=usePortfolio();
  const open=stage!==null;
  useEffect(()=>{
    const modal=dialog.current;
    if(!open||!modal)return;
    const previousOverflow=document.body.style.overflow;
    const trigger=document.activeElement;
    document.body.style.overflow='hidden';
    modal.showModal();
    modal.querySelector<HTMLButtonElement>('button')?.focus({preventScroll:true});
    return ()=>{
      modal.close();
      document.body.style.overflow=previousOverflow;
      if(trigger instanceof HTMLElement&&trigger.isConnected)trigger.focus({preventScroll:true});
    };
  },[open]);
  const isOutside=(event:MouseEvent<HTMLDialogElement>|PointerEvent<HTMLDialogElement>)=>{
    const bounds=event.currentTarget.getBoundingClientRect();
    return event.target===event.currentTarget&&(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom);
  };
  return <dialog ref={dialog} id={id} className="journey-stage-modal" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`}
    onPointerDown={event=>{pointerStartedOutside.current=isOutside(event);}}
    onClick={event=>{if(pointerStartedOutside.current&&isOutside(event))onClose();pointerStartedOutside.current=false;}}
    onCancel={event=>{event.preventDefault();onClose();}}>
    {stage&&<><header className="journey-stage-modal-header"><h2 id={`${id}-title`} className="journey-stage-modal-title">{icon && <img className="technology-modal-icon" src={icon} alt="" width="36" height="36" />}{stage.name}</h2><button type="button" className="icon-button modal-close-button" aria-label={isEnglish?'Close explanation':'Chiudi spiegazione'} onClick={onClose}><X aria-hidden="true" /></button></header>
      <p id={`${id}-description`}>{stage.description}</p>
    </>}
  </dialog>;
}

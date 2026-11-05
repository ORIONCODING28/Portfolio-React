import { lazy, Suspense, useState } from 'react';
import { useSiteModal } from '../hooks/useSiteModal';
import { usePortfolio } from '../hooks/usePortfolio';
import { SiteDialog } from './SiteDialog';
const ContactForm = lazy(() => import('./ContactForm').then(module => ({ default: module.ContactForm })));
const CreditsContent = lazy(() => import('./CreditsContent').then(module => ({ default: module.CreditsContent })));
export function SiteModals() {
  const { active, close } = useSiteModal();
  const { copy, isEnglish } = usePortfolio();
  const [contactVisited, setContactVisited] = useState(active === 'contact');
  if (active === 'contact' && !contactVisited) setContactVisited(true);
  const loading = <p role="status">{copy.loading}</p>;
  return <>
    <SiteDialog id="site-modal-contact" title={isEnglish ? "Let’s talk" : "Parliamone"} intro={isEnglish ? "For a project, a collaboration or a question: send me a message here." : "Per un progetto, una collaborazione o una domanda: scrivimi qui."} open={active === 'contact'} onClose={close}>
      <Suspense fallback={loading}>{(contactVisited || active === 'contact') && <ContactForm />}</Suspense>
    </SiteDialog>
    <SiteDialog id="site-modal-credits" title={isEnglish ? 'Credits' : 'Crediti'} intro={isEnglish ? 'The authors and resources behind this portfolio.' : 'Gli autori e le risorse utilizzate nel portfolio.'} open={active === 'credits'} onClose={close}>
      <Suspense fallback={loading}>{active === 'credits' && <CreditsContent />}</Suspense>
    </SiteDialog>
  </>;
}

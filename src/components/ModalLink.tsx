import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { useSiteModal } from '../hooks/useSiteModal';
import type { SiteModalName } from '../hooks/useSiteModal';
type Props = Omit<ComponentProps<typeof Link>, 'to' | 'state'> & { modal: SiteModalName };
export function ModalLink({ modal, ...props }: Props) {
  const { href, state } = useSiteModal();
  return <Link {...props} to={href(modal)} state={state} preventScrollReset aria-haspopup="dialog" aria-controls={`site-modal-${modal}`} />;
}

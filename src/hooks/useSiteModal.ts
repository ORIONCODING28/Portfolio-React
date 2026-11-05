import { useLocation, useNavigate } from 'react-router-dom';
export type SiteModalName = 'contact' | 'credits';
export function useSiteModal() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const value = params.get('modal');
  const active = value === 'contact' || value === 'credits' ? value : null;
  const href = (name: SiteModalName) => {
    const next = new URLSearchParams(location.search);
    next.set('modal', name);
    return { pathname: location.pathname, search: `?${next}`, hash: location.hash };
  };
  const close = () => {
    const origin: unknown = location.state;
    if (origin && typeof origin === 'object' && 'siteModalOrigin' in origin && typeof origin.siteModalOrigin === 'string' && origin.siteModalOrigin === `${location.pathname}${location.hash}`) {
      void navigate(-1);
    } else {
      const next = new URLSearchParams(location.search);
      next.delete('modal');
      void navigate({ pathname: location.pathname, search: next.size ? `?${next}` : '', hash: location.hash }, { replace: true, preventScrollReset: true });
    }
  };
  return { active, href, close, state: { siteModalOrigin: `${location.pathname}${location.hash}` } };
}

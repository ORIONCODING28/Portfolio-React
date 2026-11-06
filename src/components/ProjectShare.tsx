import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { publicAsset } from '../domain/deployment';
import { projectShareLinks } from '../domain/projectSharing';
import { usePortfolio } from '../hooks/usePortfolio';
import { ExternalLink } from './ExternalLink';
import { WhatsAppIcon } from './WhatsAppIcon';
import { LinkedInIcon } from './LinkedInIcon';

export function ProjectShare({ title, slug }: { title: string; slug: string }) {
  const { isEnglish } = usePortfolio();
  const [result, setResult] = useState<'idle' | 'copied' | 'failed'>('idle');
  const url = `${window.location.origin}${publicAsset(`/projects/${slug}`)}`;
  const links = projectShareLinks(title, url);
  const label = isEnglish ? 'Share project' : 'Condividi il progetto';
  const shareLabel = (platform: string) => `${isEnglish ? 'Share on' : 'Condividi su'} ${platform}`;
  const copyLabel = isEnglish ? 'Copy link' : 'Copia link';
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setResult('copied');
    } catch { setResult('failed'); }
  };
  return <div className="project-share" role="group" aria-label={label}>
    <h3>{label}</h3>
    <div className="project-share-actions">
      <ExternalLink className="project-share-action" href={links.whatsapp} aria-label={shareLabel('WhatsApp')} title={shareLabel('WhatsApp')}><WhatsAppIcon/></ExternalLink>
      <ExternalLink className="project-share-action" href={links.linkedin} aria-label={shareLabel('LinkedIn')} title={shareLabel('LinkedIn')}><LinkedInIcon/></ExternalLink>
      <ExternalLink className="project-share-action" href={links.x} aria-label={shareLabel('X')} title={shareLabel('X')}><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l8.2-9.4L.8 2h6.5l4.5 6.7L18.9 2ZM17.8 20h1.8L6.2 3.9H4.3L17.8 20Z"/></svg></ExternalLink>
      <button className="project-share-action" type="button" onClick={() => { void copy(); }} aria-label={copyLabel} title={copyLabel}>{result === 'copied' ? <Check aria-hidden="true"/> : <Copy aria-hidden="true"/>}</button>
    </div>
    <span className="project-share-status" role="status">{result === 'copied' ? (isEnglish ? 'Link copied' : 'Link copiato') : result === 'failed' ? (isEnglish ? 'Copy the link below.' : 'Copia il link qui sotto.') : ''}</span>
    {result === 'failed' && <input className="project-share-fallback" readOnly value={url} aria-label={isEnglish ? 'Project link' : 'Link del progetto'} onFocus={event => event.currentTarget.select()}/>}
  </div>;
}

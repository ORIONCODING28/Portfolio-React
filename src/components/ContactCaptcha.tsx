import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../hooks/useTheme';
import { Link } from 'react-router-dom';

type CaptchaApi = {
  ready(callback: () => void): void;
  render(host: HTMLElement, options: { sitekey: string; theme: 'dark' | 'light'; size: 'normal'; callback: (token: string) => void; 'expired-callback': () => void; 'error-callback': () => void }): number;
  reset(widget: number): void;
};
declare global { interface Window { grecaptcha?: CaptchaApi } }
let loading: Promise<CaptchaApi> | undefined;
function loadCaptcha(): Promise<CaptchaApi> {
  if (loading) return loading;
  loading = new Promise<CaptchaApi>((resolve, reject) => {
    if (window.grecaptcha) { window.grecaptcha.ready(() => resolve(window.grecaptcha!)); return; }
    const script = document.createElement('script');
    // Google's live API has no immutable CDN build; load only after explicit activation.
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'; script.async = true; script.defer = true;
    script.onload = () => {
      if (!window.grecaptcha) { script.remove(); loading = undefined; reject(new Error('CAPTCHA unavailable')); return; }
      window.grecaptcha.ready(() => resolve(window.grecaptcha!));
    };
    script.onerror = () => { script.remove(); loading = undefined; reject(new Error('CAPTCHA unavailable')); };
    document.head.append(script);
  });
  return loading;
}
export function ContactCaptcha({ siteKey, isEnglish, reset, onToken }: { siteKey: string; isEnglish: boolean; reset: number; onToken: (token: string) => void }) {
  const { isDark } = useTheme(); const host = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken);
  useEffect(() => { callback.current = onToken; }, [onToken]);
  const [active, setActive] = useState(false), [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    if (!active || !host.current) return;
    const container = host.current; let cancelled = false, api: CaptchaApi | undefined, widget: number | undefined;
    const fit = () => container.style.setProperty('--captcha-scale', String(Math.min(1, container.clientWidth / 304)));
    fit(); const sizing = new ResizeObserver(fit); sizing.observe(container);
    callback.current('');
    void loadCaptcha().then(value => {
      if (cancelled) return; api = value;
      widget = value.render(container, { sitekey: siteKey, theme: isDark ? 'dark' : 'light', size: 'normal', callback: token => { if (!cancelled) callback.current(token); }, 'expired-callback': () => { if (!cancelled) callback.current(''); }, 'error-callback': () => { if (!cancelled) { callback.current(''); setState('error'); } } });
      setState('ready');
    }).catch(() => { if (!cancelled) setState('error'); });
    return () => { cancelled = true; sizing.disconnect(); if (widget !== undefined) api?.reset(widget); container.replaceChildren(); };
  }, [active, siteKey, isDark, reset]);
  return <div className="contact-captcha">
    <label className="contact-privacy-check"><input type="checkbox" checked={active} onChange={event => { callback.current(''); setState('loading'); setActive(event.target.checked); }} /><span>{isEnglish ? 'I have read the ' : 'Ho letto l’'}<Link to="/privacy-policy">{isEnglish ? 'privacy notice' : 'informativa privacy'}</Link>.</span></label>
    <p className="contact-captcha-explanation">{isEnglish ? 'Your details are used to reply to your enquiry. Checking the box loads Google’s spam verification.' : 'I dati servono per rispondere alla tua richiesta. Spuntando la casella carichi la verifica antispam di Google.'}</p>
    {active && <div className="contact-captcha-widget" ref={host} />}
    {active && state === 'loading' && <p role="status">{isEnglish ? 'Loading verification…' : 'Caricamento verifica…'}</p>}
    {active && state === 'error' && <p role="alert">{isEnglish ? 'Verification unavailable. Try again or contact me by email.' : 'Verifica non disponibile. Riprova oppure contattami via email.'} <button type="button" onClick={() => { setState('loading'); setActive(false); }}>{isEnglish ? 'Try again' : 'Riprova'}</button></p>}
    {active && <p className="contact-captcha-legal">Google reCAPTCHA · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy</a> · <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">{isEnglish ? 'Terms' : 'Termini'}</a></p>}
  </div>;
}

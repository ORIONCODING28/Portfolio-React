import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, Mail, RotateCw, Send } from 'lucide-react';
import { LinkedInIcon } from './LinkedInIcon';
import { usePortfolio } from '../hooks/usePortfolio';
import { ExternalLink } from './ExternalLink';
import { contactLimits, validateContact } from '../domain/contact';
import type { ContactErrors, ContactField, ContactInput, ValidationIssue } from '../domain/contact';
import { sendContact } from '../services/contact';
import { ContactCaptcha } from './ContactCaptcha';
import { contactConfig } from '../config/contact';
const initial: ContactInput = { name: '', email: '', subject: '', message: '' };
export function ContactForm({ sendMessage = sendContact }: { sendMessage?: typeof sendContact }) {
  const { copy, settings, isEnglish } = usePortfolio();
  const [draft, setDraft] = useState<ContactInput>(initial);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'error' | 'success'>('idle');
  const [captchaToken, setCaptchaToken] = useState(''), [captchaReset, setCaptchaReset] = useState(0);
  const [protectionError, setProtectionError] = useState<'verification' | 'rate' | 'blocked' | null>(null);
  const captchaSiteKey = contactConfig.captchaSiteKey;
  const trap = useRef<HTMLInputElement>(null);
  const alive = useRef(true);
  const busy = useRef(false);
  const form = useRef<HTMLFormElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => { if (status === 'success') successHeading.current?.focus(); }, [status]);
  const errorCopy: Record<ValidationIssue, string> = { name: copy.nameError, email: copy.emailError, subject: copy.subjectError, message: copy.messageError, length: copy.tooLong };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy.current) return;
    setProtectionError(null);
    if (trap.current?.value.trim()) { setProtectionError('blocked'); return; }
    const validation = validateContact(draft);
    setErrors(validation);
    if (Object.keys(validation).length) {
      const first = Object.keys(validation)[0];
      const field = form.current?.elements.namedItem(first);
      if (field instanceof HTMLElement) field.focus();
      return;
    }
    if (captchaSiteKey && !captchaToken) { setProtectionError('verification'); return; }
    busy.current = true; setStatus('sending');
    try {
      await sendMessage(draft, undefined, captchaToken || undefined);
      if (alive.current) { setStatus('success'); setDraft(initial); }
    } catch (error) {
      if (alive.current) {
        if (typeof error === 'object' && error !== null && 'status' in error && error.status === 429) { setProtectionError('rate'); setStatus('idle'); }
        else setStatus('error');
      }
    } finally { busy.current = false; if (alive.current) { setCaptchaToken(''); setCaptchaReset(value => value + 1); } }
  };
  const fields: { key: ContactField; label: string; placeholder: string; type?: string; autoComplete?: string }[] = [
    { key: 'name', label: copy.name, placeholder: copy.namePlaceholder, autoComplete: 'name' },
    { key: 'email', label: copy.email, placeholder: copy.emailPlaceholder, type: 'email', autoComplete: 'email' },
    { key: 'subject', label: copy.subject, placeholder: copy.subjectPlaceholder },
    { key: 'message', label: copy.message, placeholder: copy.messagePlaceholder },
  ];
  const update = (field: ContactField, value: string) => { setDraft(previous => ({ ...previous, [field]: value })); setErrors(previous => ({ ...previous, [field]: undefined })); };
  if (status === 'success') return <section className="contact-modal-form"><div className="contact-success"><div className="success-mark"><Check size={46} aria-hidden="true" /></div><h3 tabIndex={-1} ref={successHeading}>{copy.success}</h3><p className="success-thanks">{copy.thanks}</p><p>{copy.successBody}</p><button className="button" type="button" onClick={() => setStatus('idle')}><RotateCw size={21} aria-hidden="true" />{copy.another}</button><div className="contact-alternatives"><h4>{copy.alternatives}</h4><a href={`mailto:${settings.email}`}><Mail size={28} aria-hidden="true" /><span>Email<small>{settings.email}</small></span></a><ExternalLink href={settings.social_links?.linkedin}><LinkedInIcon /><span>LinkedIn<small>{isEnglish ? 'Visit my profile' : 'Visita il mio profilo'}</small></span></ExternalLink></div></div></section>;
  return <section className="contact-modal-form">
        <form onSubmit={event => { void submit(event); }} ref={form} noValidate aria-busy={status === 'sending'}>
          <div className="contact-trap" aria-hidden="true"><label htmlFor="contact-website">Leave this field empty</label><input ref={trap} id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
          <fieldset disabled={status === 'sending'}>
            <div className="contact-fields">{fields.map(field => <div className="form-field" key={field.key}><label htmlFor={`contact-${field.key}`}>{field.label}</label>
              {field.key === 'message' ? <textarea id="contact-message" name="message" required rows={6} maxLength={contactLimits.message} value={draft.message} placeholder={field.placeholder} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'error-message' : undefined} onChange={e => update('message', e.target.value)} /> :
                <input id={`contact-${field.key}`} name={field.key} type={field.type || 'text'} autoComplete={field.autoComplete} required maxLength={contactLimits[field.key]} value={draft[field.key]} placeholder={field.placeholder} aria-invalid={!!errors[field.key]} aria-describedby={errors[field.key] ? `error-${field.key}` : undefined} onChange={e => update(field.key, e.target.value)} />}
              {errors[field.key] && <p className="field-error" id={`error-${field.key}`}>{errorCopy[errors[field.key]!]}</p>}
            </div>)}</div>
            {status === 'error' && <div className="form-error" role="alert"><AlertCircle size={23} aria-hidden="true" /><div><strong>{copy.errorTitle}</strong><p>{copy.errorBody}</p></div></div>}
            {captchaSiteKey && <ContactCaptcha siteKey={captchaSiteKey} isEnglish={isEnglish} reset={captchaReset} onToken={setCaptchaToken} />}
            {protectionError && <p className="field-error" role="alert">{protectionError === 'verification' ? (isEnglish ? 'Read the privacy notice and complete the spam verification before sending.' : 'Prendi visione dell’informativa e completa la verifica antispam prima di inviare.') : protectionError === 'rate' ? (isEnglish ? 'Please wait 30 seconds before trying again.' : 'Attendi 30 secondi prima di riprovare.') : (isEnglish ? 'Unable to submit this form. Please contact me by email.' : 'Non è possibile inviare questo modulo. Contattami via email.')}</p>}
            <button type="submit" className="button form-submit">{status === 'error' && <Send size={20} aria-hidden="true" />}{status === 'sending' ? copy.sending : status === 'error' ? copy.retry : copy.send}</button>
            {status === 'error' && <a className="button form-email" href={`mailto:${settings.email}`}><Mail size={21} aria-hidden="true" />{copy.emailAction}</a>}
          </fieldset>{!captchaSiteKey && <p className="contact-privacy-note">{isEnglish ? 'Your details are used to respond to your enquiry. ' : 'I tuoi dati vengono usati per rispondere alla richiesta. '}<Link to="/privacy-policy">Privacy Policy</Link></p>}<p className="form-alternative"><a href={`mailto:${settings.email}`}>{copy.emailAlternative}</a></p>
        </form>
  </section>;
}

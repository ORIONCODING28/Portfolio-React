import { Link } from 'react-router-dom';
import { ModalLink } from './ModalLink';
import { MapPin } from 'lucide-react';
import { GitHubIcon } from './GitHubIcon';
import { LinkedInIcon } from './LinkedInIcon';
import { usePortfolio } from '../hooks/usePortfolio';
import { ExternalLink } from './ExternalLink';
import './footer.css';

export function Footer() {
  const { copy, settings, isEnglish } = usePortfolio();
  const [emailName, emailDomain] = (settings.email ?? '').split('@');
  return <footer className="portfolio-footer"><div className="portfolio-footer-inner">
    <div className="portfolio-footer-main">
      <div className="portfolio-footer-brand">
        <Link to="/" className="portfolio-footer-name" aria-label="Giuseppe Cairone — Home">Giuseppe Cairone</Link>
        <p className="portfolio-footer-role">{isEnglish ? 'From ideas to digital experiences.' : 'Dalle idee alle esperienze digitali.'}</p>
        <div className="portfolio-footer-socials">
          <ExternalLink href={settings.social_links?.github}><GitHubIcon />GitHub</ExternalLink>
          <ExternalLink href={settings.social_links?.linkedin}><LinkedInIcon />LinkedIn</ExternalLink>
        </div>
      </div>
      <nav aria-label={isEnglish ? 'Portfolio navigation' : 'Navigazione del portfolio'}>
        <h2>{isEnglish ? 'Navigation' : 'Navigazione'}</h2>
        <Link to="/">Home</Link><Link to="/about">{copy.profile}</Link><Link to="/projects">{copy.projects}</Link><Link to="/about#profile-certifications">{copy.certifications}</Link>
      </nav>
      <div className="portfolio-footer-contacts">
        <h2>{copy.contact}</h2>
        <a className="portfolio-footer-email" href={`mailto:${settings.email}`}>{emailName}{emailDomain && <><wbr />@{emailDomain}</>}</a>
        {settings.location && <p className="portfolio-footer-location"><MapPin size={18} aria-hidden="true" />{settings.location}</p>}
      </div>
      <div className="portfolio-footer-invitation">
        <h2>{isEnglish ? 'Let’s work together' : 'Lavoriamo insieme'}</h2>
        <p>{isEnglish
          ? 'Have an idea for a website or an application? Tell me what you have in mind: we can explore how to bring it to life, from the first decisions to the final experience.'
          : 'Hai un’idea da trasformare in un sito o in un’applicazione? Raccontami cosa hai in mente: possiamo capire insieme come darle forma, dalle prime scelte fino all’esperienza finale.'}</p>
        <ModalLink className="button portfolio-footer-contact-button" modal="contact">{isEnglish ? 'Contact me' : 'Contattami'}</ModalLink>
      </div>
    </div>
    <div className="portfolio-footer-bottom">
      <ModalLink className="portfolio-footer-credits" modal="credits">{isEnglish ? 'Credits' : 'Crediti'}</ModalLink>
      <p>© {new Date().getFullYear()} Giuseppe Cairone. {isEnglish ? 'All rights reserved.' : 'Tutti i diritti riservati.'}</p>
      <Link className="portfolio-footer-privacy" to="/privacy-policy">Privacy Policy</Link>
    </div>
  </div></footer>;
}

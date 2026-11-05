import { publicAsset } from '../domain/deployment.ts';
import { usePortfolio } from '../hooks/usePortfolio';
import { ThemeToggle } from './ThemeToggle';
import './preferences.css';

export function Preferences({ compact = false }: { compact?: boolean }) {
  const { copy, language, i18n } = usePortfolio();
  return <div className={compact ? 'preferences preferences-inline' : 'preferences'}>
    <div className="preference-row"><span className="preference-label">{copy.theme}</span><ThemeToggle /></div>
    <div className="preference-row"><span className="preference-label">{copy.language}</span>
      <div className="segmented language-options" role="group" aria-label={copy.language}>
        <button type="button" lang="it" aria-label="Italiano" aria-pressed={language === 'it'} onClick={() => { void i18n.changeLanguage('it'); }}><img src={publicAsset("/assets/flags/it.png")} alt="" width="20" height="20"/>IT</button>
        <button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => { void i18n.changeLanguage('en'); }}><img src={publicAsset("/assets/flags/en.png")} alt="" width="20" height="20"/>EN</button>
      </div>
    </div>
  </div>;
}

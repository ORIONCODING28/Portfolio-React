import { Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { usePortfolio } from '../hooks/usePortfolio';
import './theme-toggle.css';

export function ThemeToggle() {
  const {isDark,toggleTheme}=useTheme();
  const {isEnglish}=usePortfolio();
  return <button className="theme-toggle" type="button" role="switch" aria-checked={isDark} aria-label={isEnglish?'Dark theme':'Tema scuro'} title={isEnglish?(isDark?'Switch to light theme':'Switch to dark theme'):(isDark?'Passa al tema chiaro':'Passa al tema scuro')} onClick={toggleTheme}>
    <span className="theme-toggle-track" aria-hidden="true">
      <span className="theme-toggle-stars">{[0,1,2,3,4].map(star=><span key={star}/>)}</span>
      <span className="theme-toggle-indicator">
        <span className="theme-toggle-moon"><span/><span/><span/></span>
        <span className="theme-toggle-sun"><Sun size={25} strokeWidth={1.5}/></span>
      </span>
      <span className="theme-toggle-clouds"><span/><span/></span>
    </span>
  </button>;
}
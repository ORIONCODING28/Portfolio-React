import { useRef } from 'react';
import { useHomeMotion } from '../hooks/useHomeMotion';
import { Link, useSearchParams } from 'react-router-dom';
import { Terminal } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { GalaxyVisual } from '../components/GalaxyVisual';
import { CapabilityVisual } from '../components/CapabilityVisual';
import { TerminalModal } from '../components/TerminalModal';
import { JourneyVisual } from '../components/JourneyVisual';
import { TechnologyMarquee } from '../components/TechnologyMarquee';
import './home.css';

const content = {
  it: {
    heroTitle: ['Dalle idee', 'a qualcosa che funziona'],
    intro: 'Sviluppo applicazioni web e mobile, curando le interfacce, la logica e i dati che le fanno funzionare. Mi piace trasformare un’idea in un’esperienza chiara e intuitiva, pensando sia a chi la utilizza sia a come viene costruita.',
    title: 'Cosa posso costruire', subtitle: 'Interfacce, applicazioni e servizi che lavorano insieme.',
    capabilities: [
      ['Web', 'Siti e applicazioni responsive, con interfacce curate, ricerca e filtri. Per lo staff di Sfizi & Delizie: gestione dei prodotti, delle disponibilità e degli ordini.'],
      ['Mobile', 'Esperienze pensate per il telefono: menu fotografico, filtri e carrello, con quantità, note e riepilogo dell’ordine per il ritiro.'],
      ['Backend', 'API e database per gestire prodotti, disponibilità e ordini, con controlli sui dati e aggiornamento degli stati.'],
    ],
    journey: ['Dalla formazione', 'alla pratica'],
    story: 'Il percorso alla Steve Jobs Academy mi ha dato le basi. Nei progetti personali le metto alla prova, affrontando problemi concreti e migliorando le soluzioni passo dopo passo.',
    about: 'Scopri il mio percorso',
  },
  en: {
    heroTitle: ['From ideas', 'to something that works'],
    intro: 'I develop web and mobile applications, taking care of the interfaces, logic and data that make them work. I enjoy turning an idea into a clear, intuitive experience, thinking both about the people who use it and how it is built.',
    title: 'What I can build', subtitle: 'Interfaces, applications and services working together.',
    capabilities: [
      ['Web', 'Responsive websites and applications with carefully designed interfaces, search and filters. For Sfizi & Delizie staff: product, availability and order management.'],
      ['Mobile', 'Experiences designed for phones: a photo menu, filters and a cart, with quantities, notes and an order summary for collection.'],
      ['Backend', 'APIs and a database to manage products, availability and orders, with data validation and order status updates.'],
    ],
    journey: ['From learning', 'to building'],
    story: 'My training at Steve Jobs Academy gave me the foundations. In my personal projects I put them to the test, tackling practical problems and improving solutions step by step.',
    about: 'Explore my journey',
  },
};

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const terminalOpen = searchParams.get('terminal') === 'open';
  const setTerminalOpen = (open: boolean) => {
    const next = new URLSearchParams(searchParams);
    if (open) next.set('terminal', 'open'); else next.delete('terminal');
    setSearchParams(next, { replace: !open, preventScrollReset: true });
  };
  const motionScope = useRef<HTMLDivElement>(null);
  useHomeMotion(motionScope);
  const { copy, isEnglish } = usePortfolio();
  const text = content[isEnglish ? 'en' : 'it'];
  return <div className="immersive-home" ref={motionScope}>
    <div className="home-constellation"><section className="home-hero page-container" aria-labelledby="home-title">
      <div className="hero-copy">
        <h1 id="home-title"><span>{text.heroTitle[0]} </span><span>{text.heroTitle[1]}</span></h1>
        <p className="hero-intro">{text.intro}</p>
        <Link className="button home-outline-button" to="/projects">{copy.explore}</Link>
        <button className="terminal-link text-link" type="button" aria-haspopup="dialog" aria-controls="portfolio-terminal" onClick={() => setTerminalOpen(true)}><Terminal size={20} aria-hidden="true" />{copy.terminal}</button>
      </div>
      <div className="hero-art"><GalaxyVisual /></div>
    </section></div>

    <section className="home-capabilities page-container" aria-labelledby="capabilities-title">
      <div data-home-reveal="heading">
      <h2 id="capabilities-title">{text.title}</h2>
      <p className="home-section-intro">{text.subtitle}</p>
      <p id="device-interaction-help" className="device-interaction-help">{isEnglish ? 'Select a model to explore it in 3D' : 'Seleziona un modello per esplorarlo in 3D'}<span className="sr-only">{isEnglish ? 'Keyboard: arrow keys to rotate, + and - to zoom, Home to reset.' : 'Tastiera: frecce per ruotare, + e - per ingrandire, Home per ripristinare.'}</span></p>
      </div>
      <div className="home-capability-stage">
        <div className="home-capability-copy">
          {text.capabilities.map(([title, description], index) => <article key={title}>
            <CapabilityVisual kind={(['web', 'mobile', 'backend'] as const)[index]} />
            <div className="capability-description" data-home-reveal="copy" data-motion-delay={index * 60}><h3>{title}</h3><p>{description}</p></div>
          </article>)}
        </div>
      </div>
      <p className="device-interaction-help">{isEnglish ? 'Two views of Sfizi & Delizie, a personal project: staff management and the customer menu.' : 'Due viste di Sfizi & Delizie, progetto personale: gestione staff e menu cliente.'}</p>
    </section>

    <TechnologyMarquee />

    <div className="home-constellation"><section className="home-journey page-container" aria-labelledby="journey-title">
      <div data-home-reveal="copy">
        <h2 id="journey-title"><span>{text.journey[0]} </span><span>{text.journey[1]}</span></h2>
        <p>{text.story}</p>
        <Link to="/about" className="button home-outline-button">{text.about}</Link>
      </div>
      <JourneyVisual />
    </section></div>

    <TerminalModal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
  </div>;
}


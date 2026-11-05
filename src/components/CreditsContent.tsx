import { ExternalLink as ExternalIcon } from 'lucide-react';
import { ExternalLink } from './ExternalLink';
import { usePortfolio } from '../hooks/usePortfolio';
import './credits-content.css';

const models = [
  { name: 'Pipe Wrench', author: 'holgcool', url: 'https://sketchfab.com/3d-models/pipe-wrench-4ed30f2b71a34027a39ed02872d0caff' },
  { name: 'Apple MacBook Pro 16 inch 2021', author: 'jc1245 (jasperchui2007)', url: 'https://sketchfab.com/3d-models/apple-macbook-pro-16-inch-2021-6a42b31bac064b00a91fbfebec07c852' },
  { name: 'HP Omen Laptop', author: 'Fadi', url: 'https://sketchfab.com/3d-models/hp-omen-laptop-cb33442e53e6404a9439f320401da1d9' },
  { name: 'iPhone 15 Pro', author: 'Sketcher', url: 'https://sketchfab.com/3d-models/iphone-15-pro-9e045e469d514fea9dda2ccd161f5fa3' },
];
export function CreditsContent() {
  const { isEnglish } = usePortfolio();
  return <section className="credits-content">
    <div className="credits-list">{models.map(model => <article key={model.name} className="credit-entry">
      <div><h3>{model.name}</h3><p className="credit-author">{isEnglish ? 'Created by' : 'Realizzato da'} <ExternalLink href={model.url}>{model.author}</ExternalLink></p></div>
      <div className="credit-detail"><p>{model.name === 'Pipe Wrench' ? (isEnglish ? 'Adapted scale and orientation, lossless compression, selective recolouring of yellow paint to red and black; steel and surface wear preserved. Interactive controls added.' : 'Scala e orientamento adattati, compressione senza perdita e sostituzione selettiva della vernice gialla con rosso e nero, conservando acciaio e usura. Aggiunti i controlli interattivi.') : isEnglish ? 'Adapted for this portfolio: scale, orientation, screen UV mapping and custom screen content. Lighting and interactive camera added.' : 'Adattato per il portfolio: scala, orientamento, mappatura dello schermo e contenuto personalizzato. Sono stati aggiunti l’illuminazione e i controlli interattivi della visuale.'}</p>
        <div className="credit-links"><ExternalLink href={model.url}>Sketchfab<ExternalIcon size={15} aria-hidden="true" /></ExternalLink><ExternalLink href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0<ExternalIcon size={15} aria-hidden="true" /></ExternalLink></div>
      </div>
    </article>)}</div>
    <section className="credits-original"><h3>{isEnglish ? 'Other 3D elements' : 'Altri elementi 3D'}</h3><p>{isEnglish ? 'The server, constellations and the other five objects in the profile journey were created for this portfolio. Model attribution does not imply endorsement of this website by their creators.' : 'Il server, le costellazioni e gli altri cinque oggetti del percorso nella pagina profilo sono realizzati per questo portfolio. La citazione degli autori non implica una loro approvazione del sito.'}</p></section>
  </section>;
}

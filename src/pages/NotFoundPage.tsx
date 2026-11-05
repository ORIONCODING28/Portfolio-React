import { Link } from 'react-router-dom';
import { usePortfolio } from '../hooks/usePortfolio';
export function NotFoundPage() {
  const { copy } = usePortfolio();
  return <section className="page-container page-content empty-page"><h1>{copy.notFound}</h1><p>{copy.notFoundBody}</p><div className="flex flex-wrap gap-3"><Link className="button button-primary" to="/">{copy.backHome}</Link><Link className="button" to="/projects">{copy.projects}</Link></div></section>;
}

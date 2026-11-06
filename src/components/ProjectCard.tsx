import { Link } from 'react-router-dom';
import type { Project } from '../types';
import { usePortfolio } from '../hooks/usePortfolio';
import { ExternalLink } from './ExternalLink';
import { getProjectPresentation } from '../content/projectPresentation';
import { ProjectPreview } from './ProjectPreview';

export function ProjectCard({ project, priority=false }: { project: Project; priority?: boolean }) {
  const { copy, isEnglish } = usePortfolio();
  const story = getProjectPresentation(project.slug, isEnglish);
  return <article className="work-project">
    <ProjectPreview project={project} priority={priority}/>
    <div className="work-project-copy">
      <h2><Link to={`/projects/${project.slug}`}>{project.title.replace('Progetto ', '')}</Link></h2>
      <p className="work-project-summary">{story?.catalogDescription || story?.detailSummary || project.short_description}</p>
      <p className="work-project-context">{project.collaboration === 'team' ? (isEnglish ? 'Team project · Published website' : 'Progetto di gruppo · Sito pubblicato') : (isEnglish ? 'Personal project · Published website' : 'Progetto personale · Sito pubblicato')}</p>
      <p>{story?.contribution}</p>
      <ul className="work-technologies" aria-label={copy.technologies}>{(story?.technologies || project.technologies).split(/\s*[·,]\s*/).filter(Boolean).map(technology=><li key={technology}>{technology}</li>)}</ul>
      <div className="work-project-actions"><Link className="button button-accent-outline" to={`/projects/${project.slug}`}>{copy.exploreProject}</Link>{project.live_url&&<ExternalLink className="work-text-link" href={project.live_url}>{copy.visit}</ExternalLink>}</div>
    </div>
  </article>;
}

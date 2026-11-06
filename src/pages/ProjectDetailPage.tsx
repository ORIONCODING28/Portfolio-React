import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { usePortfolio } from '../hooks/usePortfolio';
import { getProjectPresentation } from '../content/projectPresentation';
import { getProjectCaseStudy, type ProjectFeature } from '../content/projectCaseStudies';
import { getProjectStory } from '../content/projectStories';
import { ExternalLink } from '../components/ExternalLink';
import { NotFoundPage } from './NotFoundPage';
import { ProjectShare } from '../components/ProjectShare';
import { GitHubIcon } from '../components/GitHubIcon';
import { ProjectPreview } from '../components/ProjectPreview';
import './projects.css';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { copy, projects, isEnglish } = usePortfolio();
  const index = projects.findIndex(project => project.slug === slug);
  const project = projects[index];
  if (!project) return <NotFoundPage />;
  const presentation = getProjectPresentation(project.slug, isEnglish);
  const story = getProjectStory(project.slug, isEnglish);
  const study = getProjectCaseStudy(project.slug, isEnglish);
  const features: ProjectFeature[] = study?.features || (project.features || []).map(title=>({title,body:''}));
  const next = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined;
  const previous = projects.length > 1 ? projects[(index - 1 + projects.length) % projects.length] : undefined;
  return <article className="work-shell case-study">
    <Link className="work-back" to="/projects"><ArrowLeft size={18} aria-hidden="true"/>{isEnglish?'Back to projects':'Torna ai progetti'}</Link>
    <header className="work-heading case-heading"><h1>{project.title.replace('Progetto ', '')}</h1><p>{presentation?.detailSummary || project.short_description}</p>
      <div className="case-actions">{project.live_url&&<ExternalLink className="button button-accent-outline" href={project.live_url}>{copy.visit}</ExternalLink>}{project.github_url&&<ExternalLink className="button button-accent-outline" href={project.github_url}><GitHubIcon/>{copy.source}</ExternalLink>}</div>
    </header>
    <div className="case-demo"><ProjectPreview project={project} priority/></div>
    <section className="case-overview" aria-labelledby="case-overview-title"><div><h2 id="case-overview-title">{study?.overviewTitle || (isEnglish?'The project':'Il progetto')}</h2><p>{study?.overview || project.description}</p></div>
      <dl className="case-facts"><div><dt>{isEnglish?'Context':'Contesto'}</dt><dd>{study?.context || (project.collaboration==='team'?(isEnglish?'Team project':'Progetto di gruppo'):(isEnglish?'Personal project':'Progetto personale'))}</dd></div><div><dt>{isEnglish?'My role':'Il mio ruolo'}</dt><dd>{study?.role || presentation?.contribution}</dd></div><div><dt>{isEnglish?'Status':'Stato'}</dt><dd>{isEnglish?'Delivered and online':'Consegnato e online'}</dd></div></dl>
    </section>
    <section className="case-features" aria-labelledby="case-features-title"><h2 id="case-features-title">{isEnglish?'What you can explore':'Cosa puoi esplorare'}</h2><div className="case-feature-list">
      {features.map(feature=><div key={feature.title}><h3>{feature.title}</h3>{feature.body&&<p>{feature.body}</p>}{'href' in feature&&feature.href&&<ExternalLink className="work-text-link" href={feature.href}>{feature.label}</ExternalLink>}</div>)}
    </div></section>
    <div className="case-process">{[{title:copy.objective,body:story?.objective||project.description},{title:copy.contribution,body:story?.contribution||project.long_description},{title:copy.choices,body:story?.choices||project.technologies}].map(section=><section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}</div>
    <section className="case-stack"><div><h2>{copy.technologies}</h2><ul className="work-technologies">{(presentation?.technologies||project.technologies).split(/\s*[·,]\s*/).filter(Boolean).map(technology=><li key={technology}>{technology}</li>)}</ul></div><ProjectShare key={project.slug} title={project.title.replace('Progetto ', '')} slug={project.slug}/></section>
    {previous && next && <nav className="case-navigation" aria-label={copy.projects}><Link className="work-text-link" to={`/projects/${previous.slug}`}><ArrowLeft size={18} aria-hidden="true"/>{isEnglish ? 'Previous project' : 'Progetto precedente'}: {previous.title.replace('Progetto ', '')}</Link><Link className="work-text-link" to={`/projects/${next.slug}`}>{copy.nextProject}: {next.title.replace('Progetto ', '')}<ArrowRight size={18} aria-hidden="true"/></Link></nav>}
  </article>;
}

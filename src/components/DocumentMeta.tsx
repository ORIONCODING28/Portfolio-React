import { publicAsset } from '../domain/deployment.ts';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePortfolio } from '../hooks/usePortfolio';
export function DocumentMeta() {
  const { pathname } = useLocation();
  const { copy, language, projects } = usePortfolio();
  useEffect(() => {
    const names: Record<string, string> = { '/privacy-policy': 'Privacy Policy', '/': 'Web & Mobile Developer', '/projects': copy.projects, '/about': copy.profile, '/contact': copy.contact, '/demo': copy.lab, '/credits': language === 'en' ? 'Credits' : 'Crediti' };
    const project = pathname.startsWith('/projects/') ? projects.find(p => p.slug === pathname.split('/')[2]) : undefined;
    const title = `${project?.title || names[pathname] || copy.notFound} | Giuseppe Cairone`;
    const description = project?.short_description || copy.intro;
    const canonical = `${window.location.origin}${publicAsset(pathname)}`;
    document.documentElement.lang = language;
    document.title = title;
    const meta = (key: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!tag) { tag = document.createElement('meta'); tag.setAttribute(attr, key); document.head.append(tag); }
      tag.content = content;
    };
    meta('description', description); meta('og:title', title, true); meta('og:description', description, true); meta('og:url', canonical, true);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.append(link); }
    link.href = canonical;
  }, [pathname, copy, language, projects]);
  return null;
}

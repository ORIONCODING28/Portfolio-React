import { useTranslation } from 'react-i18next';
import { getPublishedProjects } from '../domain/projects';
import { italian, english } from '../content/siteCopy';
import { projectsIT, projectsEN, certificationsIT, certificationsEN, educationsIT, educationsEN, siteSettingsIT, siteSettingsEN } from '../data/portfolioData';
export function usePortfolio() {
  const { i18n } = useTranslation();
  const isEnglish = (i18n.resolvedLanguage || i18n.language).startsWith('en');
  return { copy: isEnglish ? english : italian, isEnglish, language: isEnglish ? 'en' : 'it', i18n,
    projects: getPublishedProjects(isEnglish ? projectsEN : projectsIT), certifications: isEnglish ? certificationsEN : certificationsIT,
    education: isEnglish ? educationsEN : educationsIT, settings: isEnglish ? siteSettingsEN : siteSettingsIT };
}

import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { DocumentMeta } from './components/DocumentMeta';
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import { HomePage } from './pages/HomePage';
import { usePortfolio } from './hooks/usePortfolio';
import { SiteModals } from './components/SiteModals';
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));
function Shell() {
  const { copy } = usePortfolio();
  const { pathname } = useLocation();
  const fallback = <section className="empty-page page-container page-content"><h1>{copy.loadError}</h1><button className="button button-primary" onClick={() => window.location.reload()}>{copy.reload}</button></section>;
  return <div className="app-shell"><a href="#main-content" className="skip-link">{copy.skip}</a><DocumentMeta /><ScrollToTop /><Navbar />
    <main id="main-content" className="app-main" tabIndex={-1}><RouteErrorBoundary key={pathname} fallback={fallback}><Suspense fallback={<div className="page-loader" role="status"><span className="loader-dot" aria-hidden="true" />{copy.loading}</div>}>
      <Routes><Route path="/" element={<HomePage />} /><Route path="/about" element={<AboutPage />} /><Route path="/projects" element={<ProjectsPage />} /><Route path="/projects/:slug" element={<ProjectDetailPage />} /><Route path="/certifications" element={<Navigate to="/about#profile-certifications" replace />} /><Route path="/contact" element={<Navigate to="/?modal=contact" replace />} /><Route path="/demo" element={<Navigate to="/?terminal=open" replace />} /><Route path="/credits" element={<Navigate to="/?modal=credits" replace />} /><Route path="/privacy-policy" element={<PrivacyPage />} /><Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} /><Route path="/cookies" element={<Navigate to="/privacy-policy" replace />} /><Route path="*" element={<NotFoundPage />} /></Routes>
    </Suspense></RouteErrorBoundary></main><Footer /><SiteModals />
  </div>;
}
export default function App() { return <BrowserRouter basename={import.meta.env.BASE_URL}><Shell /></BrowserRouter>; }

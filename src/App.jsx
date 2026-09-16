import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, useStudioTheme } from './context/ThemeContext.jsx';
import Loader from './components/Loader.jsx';
import StudioLayout from './layouts/StudioLayout.jsx';
import useSmoothScroll, { lenisInstance } from './hooks/useSmoothScroll.js';
import './index.css';

// Route-level code splitting to eliminate initial JS bundle bloat & main-thread execution time
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const WorkPage = lazy(() => import('./pages/WorkPage.jsx'));
const InsightsPage = lazy(() => import('./pages/InsightsPage.jsx'));
const InsightDetail = lazy(() => import('./pages/InsightDetail.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const DisciplineGateway = lazy(() => import('./components/DisciplineGateway.jsx'));

// Handler for root path detection & redirect based on browser language or local preference
function RootGateway() {
  const navigate = useNavigate();
  const { lang } = useStudioTheme();

  useEffect(() => {
    // Navigate based on resolved language context
    if (lang === 'fa') {
      navigate('/fa/gateway', { replace: true });
    } else {
      navigate('/gateway', { replace: true });
    }
  }, [lang, navigate]);

  return null;
}

function GlobalLayout({ children }) {
  useSmoothScroll();
  const { pathname } = useLocation();

  // Force manual scroll restoration to prevent browser scroll memory overrides
  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Reset scroll to absolute top on EVERY route transition or content click
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Native DOM resets
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // 2. Lenis smooth-scroll engine reset
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true, force: true });
    }
  }, [pathname]);

  return <>{children}</>;
}

export default function App() {
  // Synchronously initialize state to avoid client hydration re-render cycles
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('hasLoadedSession');
    }
    return false;
  });

  const handleLoaderFinish = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasLoadedSession', 'true');
    }
    setShowLoader(false);
  };

  return (
    <ThemeProvider>
      {showLoader && <Loader onFinish={handleLoaderFinish} />}

      {/* Main content remains visible in DOM so Lighthouse immediately records LCP */}
      <GlobalLayout>
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
          <Routes>
            {/* Starter Gateway Path Handlers */}
            <Route path="/" element={<RootGateway />} />
            <Route path="/gateway" element={<DisciplineGateway isPersian={false} />} />
            <Route path="/fa/gateway" element={<DisciplineGateway isPersian={true} />} />

            {/* Studio Main Routes (Wrapped with Global Ambient Layout) */}
            <Route element={<StudioLayout />}>
              <Route path="/home" element={<HomePage isPersian={false} />} />
              <Route path="/fa" element={<HomePage isPersian={true} />} />
              <Route path="/fa/home" element={<HomePage isPersian={true} />} />
              
              {/* English Discipline Pages & Dedicated Route Handlers */}
              <Route path="/logo-motion" element={<WorkPage filter="logo-motion" />} />
              <Route path="/disciplines/:id" element={<WorkPage />} />

              {/* Farsi Discipline Pages & Dedicated Route Handlers */}
              <Route path="/fa/logo-motion" element={<WorkPage filter="logo-motion" isPersian={true} />} />
              <Route path="/fa/about" element={<AboutPage isPersian={true} />} />
              <Route path="/fa/work" element={<WorkPage isPersian={true} />} />
              <Route path="/fa/work/:id" element={<ProjectDetail isPersian={true} />} />
              <Route path="/fa/insights" element={<InsightsPage isPersian={true} />} />
              <Route path="/fa/insights/:slug" element={<InsightDetail isPersian={true} />} />
              <Route path="/fa/contact" element={<ContactPage isPersian={true} />} />
              <Route path="/fa/disciplines/:id" element={<WorkPage isPersian={true} />} />

              {/* Standard Studio Routes */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/work/:id" element={<ProjectDetail />} />
              <Route path="/insights" element={<InsightsPage />} />
              <Route path="/insights/:slug" element={<InsightDetail />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Catch-all Fallback Route */}
            <Route path="*" element={<RootGateway />} />
          </Routes>
        </Suspense>
      </GlobalLayout>
    </ThemeProvider>
  );
}
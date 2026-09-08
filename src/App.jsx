import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider, useStudioTheme } from './context/ThemeContext.jsx';
import Loader from './components/Loader.jsx';
import HomePage from './pages/HomePage.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import AboutPage from './pages/AboutPage.jsx';
import WorkPage from './pages/WorkPage.jsx';
import InsightsPage from './pages/InsightsPage.jsx';
import InsightDetail from './pages/InsightDetail.jsx';
import ContactPage from './pages/ContactPage.jsx';
import DisciplineGateway from './components/DisciplineGateway.jsx';
import useSmoothScroll, { lenisInstance } from './hooks/useSmoothScroll.js';
import './index.css';

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
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    // Check session storage post-mount to guarantee reliable DOM execution
    if (typeof window !== 'undefined') {
      const hasLoaded = sessionStorage.getItem('hasLoadedSession');
      if (!hasLoaded) {
        setShowLoader(true);
      }
    }
  }, []);

  const handleLoaderFinish = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('hasLoadedSession', 'true');
    }
    setShowLoader(false);
  };

  return (
    <ThemeProvider>
      {showLoader && <Loader onFinish={handleLoaderFinish} />}

      <div
        style={{
          opacity: showLoader ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out',
          pointerEvents: showLoader ? 'none' : 'auto',
        }}
      >
        <GlobalLayout>
          <Routes>
            {/* Starter Gateway Path Handler */}
            <Route path="/" element={<RootGateway />} />
            <Route path="/gateway" element={<DisciplineGateway isPersian={false} />} />
            <Route path="/fa/gateway" element={<DisciplineGateway isPersian={true} />} />

            {/* Studio Main Routes */}
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

            {/* Catch-all Fallback Route */}
            <Route path="*" element={<RootGateway />} />
          </Routes>
        </GlobalLayout>
      </div>
    </ThemeProvider>
  );
}
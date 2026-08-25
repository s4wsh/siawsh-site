import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useStudioTheme } from './context/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import ContactForm from './components/ContactForm.jsx';
import Footer from './components/Footer.jsx';
import HeroSection from './sections/HeroSection.jsx';
import SelectedPractices from './sections/SelectedPractices.jsx';
import AboutSection from './sections/AboutSection.jsx';
import Loader from './components/Loader.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import AboutPage from './pages/AboutPage.jsx';
import useSmoothScroll from './hooks/useSmoothScroll.js';
import './index.css';

function GlobalLayout({ children }) {
  useSmoothScroll();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}

function HomePage() {
  const { isLight } = useStudioTheme();

  useEffect(() => {
    document.title = "SIAWSH — Spatial Architecture, 3D Motion & Design Studio";
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <Navbar />
      <main className="pt-0">
        <HeroSection />
        <SelectedPractices />
        <AboutSection teaser={true} />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const [showLoader, setShowLoader] = useState(() => {
    return !sessionStorage.getItem('hasLoadedSession');
  });

  const handleLoaderFinish = () => {
    sessionStorage.setItem('hasLoadedSession', 'true');
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
        <BrowserRouter>
          <GlobalLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/work/:id" element={<ProjectDetail />} />
            </Routes>
          </GlobalLayout>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}
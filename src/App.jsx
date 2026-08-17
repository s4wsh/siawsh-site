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
import useSmoothScroll from './hooks/useSmoothScroll.js';
import './index.css';

// Global Layout wrapper that initializes Lenis and manages route scroll resets
function GlobalLayout({ children }) {
  useSmoothScroll();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return <>{children}</>;
}

function HomePage() {
  const [loading, setLoading] = useState(() => !sessionStorage.getItem('hasSeenLoader'));
  const { isLight } = useStudioTheme();

  const handleLoaderFinish = () => {
    sessionStorage.setItem('hasSeenLoader', 'true');
    setLoading(false);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      {loading && <Loader onFinish={handleLoaderFinish} />}

      <div
        style={{
          opacity: loading ? 0 : 1,
          transition: 'opacity 0.8s ease-in-out',
          pointerEvents: loading ? 'none' : 'auto',
        }}
      >
        <Navbar />
        <main className="pt-0">
          <HeroSection />
          <SelectedPractices />
          <AboutSection />
          <ContactForm />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <GlobalLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/work/:id" element={<ProjectDetail />} />
          </Routes>
        </GlobalLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
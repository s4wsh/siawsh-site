import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ContactForm from '../components/ContactForm.jsx';
import HeroSection from '../sections/HeroSection.jsx';
import SelectedPractices from '../sections/SelectedPractices.jsx';
import AboutSection from '../sections/AboutSection.jsx';
import SEO from '../components/SEO.jsx';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { lenisInstance } from '../hooks/useSmoothScroll.js';

export default function HomePage() {
  const { isLight, mode } = useStudioTheme();
  const location = useLocation();
  const isSpatialHome = mode === 'spatial' && ['/', '/home', '/fa/home'].includes(location.pathname);

  useEffect(() => {
    // If arriving from the Gateway selection, scroll smoothly down to Selected Works
    if (location.state?.scrollToWork) {
      setTimeout(() => {
        const selectedWorksElement = document.getElementById('selected-practices') || document.getElementById('work');
        if (selectedWorksElement) {
          if (lenisInstance) {
            lenisInstance.scrollTo(selectedWorksElement, { duration: 1.2 });
          } else {
            selectedWorksElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }, 100);
    }
  }, [location]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isSpatialHome
        ? 'spatial-home-skylight text-black'
        : isLight
          ? 'bg-white text-black'
          : 'bg-black text-white'
    }`}>
      <SEO 
        title="SIAWSH — Spatial Architecture, 3D Motion & Design Studio"
        description="Multidisciplinary design studio specializing in spatial architecture, 3D motion graphics, kinetic branding, and luxury custom furniture."
        canonical="https://siawsh.co"
      />
      <Navbar />
      <main className="pt-0 flex flex-col gap-8 md:gap-12">
        <HeroSection />
        <div id="selected-practices">
          <SelectedPractices />
        </div>
        <AboutSection teaser={true} />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}

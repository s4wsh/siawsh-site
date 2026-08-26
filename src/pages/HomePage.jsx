import React, { useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ContactForm from '../components/ContactForm.jsx';
import HeroSection from '../sections/HeroSection.jsx';
import SelectedPractices from '../sections/SelectedPractices.jsx';
import AboutSection from '../sections/AboutSection.jsx';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function HomePage() {
  const { isLight } = useStudioTheme();

  useEffect(() => {
    document.title = "SIAWSH — Spatial Architecture, 3D Motion & Design Studio";
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <Navbar />
      <main className="pt-0 flex flex-col gap-8 md:gap-12">
        <HeroSection />
        <SelectedPractices />
        <AboutSection teaser={true} />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
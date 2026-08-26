import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import ContactForm from '../components/ContactForm.jsx';
import HeroSection from '../sections/HeroSection.jsx';
import SelectedPractices from '../sections/SelectedPractices.jsx';
import AboutSection from '../sections/AboutSection.jsx';
import SEO from '../components/SEO.jsx';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function HomePage() {
  const { isLight } = useStudioTheme();

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <SEO 
        title="SIAWSH — Spatial Architecture, 3D Motion & Design Studio"
        description="Multidisciplinary design studio specializing in spatial architecture, 3D motion graphics, kinetic branding, and luxury custom furniture."
        canonical="https://siawsh.co"
      />
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
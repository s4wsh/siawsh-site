// src/pages/Home.jsx

import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import WorkSection from '../components/sections/WorkSection';
import AboutSection from '../components/sections/AboutSection';
import ContactForm from '../components/common/ContactForm';

export default function Home() {
  return (
    <main className="home-page-wrapper">
      <HeroSection />
      <div className="app-container">
        <WorkSection />
        <AboutSection />
        <ContactForm />
      </div>
    </main>
  );
}
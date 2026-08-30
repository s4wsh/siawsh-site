import React from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { useDisciplineProjects } from '../hooks/useDisciplineProjects.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SEO from '../components/SEO.jsx';
import SmoothFloatCard from '../components/SmoothFloatCard.jsx';

export default function SpatialPage() {
  const { isLight, lang } = useStudioTheme();
  // Fetch spatial projects prioritized first with randomized order
  const projects = useDisciplineProjects('spatial', true);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <SEO 
        title="Spatial Architecture & Interventions — SIAWSH Studio"
        description="Spatial architecture, environmental art installations, mural execution, and luxury custom furniture."
        canonical="https://siawsh.co/spatial"
      />
      <Navbar />

      <main className="pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-12 md:mb-16">
          <div className="text-xs uppercase tracking-widest opacity-40 mb-2">
            {lang === 'fa' ? 'طراحی محیطی و معماری' : 'Spatial Practice'}
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
            {lang === 'fa' ? 'طراحی فضایی و دیوانگاری' : 'Spatial & Architectural Practice'}
          </h1>
          <p className={`max-w-xl text-sm md:text-base leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`}>
            {lang === 'fa'
              ? 'مجموعه پروژه‌های معماری، دیوا‌رنگاری، ساختارهای محیطی و مبلمان سفارشی.'
              : 'Architectural environments, environmental mural installations, spatial branding, and bespoke structural design.'}
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {projects.map((project, index) => (
            <SmoothFloatCard key={project.id} project={project} isLight={isLight} index={index} />
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
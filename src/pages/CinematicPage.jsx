import React from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { useDisciplineProjects } from '../hooks/useDisciplineProjects.js';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import SEO from '../components/SEO.jsx';
import SmoothFloatCard from '../components/SmoothFloatCard.jsx';

export default function CinematicPage() {
  const { isLight, lang } = useStudioTheme();
  // Fetch 3D motion/cinematic projects prioritized first with randomized order
  const projects = useDisciplineProjects('cinematic', true);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isLight ? 'bg-white text-black' : 'bg-black text-white'}`}>
      <SEO 
        title="3D Motion & Cinematic CGI — SIAWSH Studio"
        description="3D motion graphics, CGI product visualization, kinetic branding, and sound synthesis."
        canonical="https://siawsh.co/cinematic"
      />
      <Navbar />

      <main className="pt-32 md:pt-40 pb-16 md:pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        <header className="mb-12 md:mb-16">
          <div className="text-xs uppercase tracking-widest opacity-40 mb-2">
            {lang === 'fa' ? 'موشن سه‌بعدی و گرافیک حرکتی' : 'Cinematic Practice'}
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4">
            {lang === 'fa' ? 'موشن سه‌بعدی و سینماتیک' : '3D Motion & Kinetic Design'}
          </h1>
          <p className={`max-w-xl text-sm md:text-base leading-relaxed ${isLight ? 'text-black/70' : 'text-white/70'}`}>
            {lang === 'fa'
              ? 'پروژه‌های انیمیشن سه‌بعدی، رندر تجاری، و هویت دیداری پویا.'
              : 'Commercial 3D animations, hyper-realistic product CGI, title design, and kinetic visual identities.'}
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
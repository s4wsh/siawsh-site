import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import StarfieldBackground from './StarfieldBackground.jsx';

export default function DisciplineGateway({ isPersian = false }) {
  const navigate = useNavigate();
  const { setMode, lang, setLang } = useStudioTheme();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync language state with component mode on mount / prop update
  useEffect(() => {
    const targetLang = isPersian ? 'fa' : 'en';
    if (lang !== targetLang) {
      setLang(targetLang);
    }
  }, [isPersian, lang, setLang]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleSelect = (discipline) => {
    setMode(discipline);
    sessionStorage.setItem('preferredDiscipline', discipline);
    
    // Explicitly target home routes to prevent redirect loops back to gateway routes
    const basePath = isPersian ? '/fa/home' : '/home';
    const targetPath = `${basePath}?discipline=${discipline}`;
    
    navigate(targetPath, { state: { scrollToWork: true, discipline } });
  };

  const toggleLanguage = () => {
    const nextLang = isPersian ? 'en' : 'fa';
    setLang(nextLang);
    navigate(nextLang === 'fa' ? '/fa/gateway' : '/gateway');
  };

  // Determine active language for text rendering based on explicit prop or context
  const activeIsPersian = isPersian || lang === 'fa';

  const fontStyle = {
    fontFamily: activeIsPersian
      ? 'Vazirmatn, var(--font-sans), system-ui, sans-serif'
      : 'var(--font-sans), system-ui, sans-serif',
  };

  return (
    <>
      <Helmet>
        <title>
          {activeIsPersian
            ? 'انتخاب حوزه فعالیت | استودیوی سیاوش'
            : 'Select Discipline | SIAWSH Studio — Spatial Architecture & 3D Motion'}
        </title>
        <meta
          name="description"
          content={
            activeIsPersian
              ? 'استودیوی دیزاین سیاوش — متخصص در طراحی معماری، معماری داخلی، و رندرینگ ۳ بعدی و موشن گرافیک سینماتیک.'
              : 'SIAWSH Studio — Multidisciplinary design studio specializing in spatial architecture, interior environments, 3D CGI motion design, and kinetic visual identity.'
          }
        />
        <meta
          name="keywords"
          content="SIAWSH, Spatial Architecture, Interior Design, 3D Motion, CGI Rendering, Visual Identity, Tehran Design Studio"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </Helmet>

      <div 
        className={`min-h-screen bg-black text-white flex flex-col justify-between p-6 md:p-12 relative overflow-hidden select-none transition-opacity duration-1000 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={fontStyle}
        dir={activeIsPersian ? 'rtl' : 'ltr'}
      >
        {/* Gyroscope-Balanced Starfield Background */}
        <StarfieldBackground />

        {/* Dynamic Background Radial Ambient Glow */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out opacity-20 z-0 ${
            hoveredCard === 'spatial' ? 'bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-amber-900/40 via-black to-black' : ''
          } ${
            hoveredCard === 'cinematic' ? 'bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-sky-900/40 via-black to-black' : ''
          }`}
        />

        {/* Technical Header Bar */}
        <header className="relative z-10 flex justify-between items-center text-xs tracking-widest uppercase font-mono text-neutral-400 border-b border-neutral-800 pb-4" dir="ltr">
          <div className="flex items-center">
            <img 
              src="/favicon.svg" 
              alt="SIAWSH Logo" 
              className="w-5 h-5 object-contain"
            />
          </div>

          <span className="hidden sm:inline-block font-sans text-xs tracking-wider" style={fontStyle}>
            {activeIsPersian ? 'انتخاب حوزه فعالیت' : 'DISCIPLINE SELECTION'}
          </span>

          {/* Language Switcher Toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 border border-neutral-800 hover:border-neutral-500 px-3 py-1.5 rounded-sm text-xs font-mono text-neutral-300 hover:text-white transition-all cursor-pointer bg-transparent"
          >
            <span className={!activeIsPersian ? 'text-white font-bold' : 'text-neutral-500'}>EN</span>
            <span className="text-neutral-600">/</span>
            <span className={activeIsPersian ? 'text-white font-bold' : 'text-neutral-500'}>FA</span>
          </button>
        </header>

        {/* Gateway Interactive Options Grid */}
        <main className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 my-auto py-8 max-w-6xl mx-auto w-full">
          
          {/* Card 01: Spatial Architecture */}
          <div
            onClick={() => handleSelect('spatial')}
            onMouseEnter={() => setHoveredCard('spatial')}
            onMouseLeave={() => setHoveredCard(null)}
            onTouchStart={() => setHoveredCard('spatial')}
            onTouchEnd={() => setHoveredCard(null)}
            className="group relative min-h-104 border border-neutral-800 bg-neutral-950/60 rounded-sm p-6 md:p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 hover:border-white hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] overflow-hidden"
          >
            <div className="absolute -right-10 -bottom-10 w-72 h-72 border border-neutral-800 group-hover:border-neutral-400 rotate-35 skew-x-12 transition-all duration-700 ease-out group-hover:rotate-15 group-hover:scale-110 opacity-30 group-hover:opacity-60 pointer-events-none" />
            <div className="absolute -right-5 -bottom-5 w-72 h-72 border border-neutral-800 group-hover:border-neutral-500 rotate-35 skew-x-12 transition-all duration-700 ease-out group-hover:rotate-15 group-hover:scale-110 opacity-20 pointer-events-none" />

            <div className="flex justify-between items-start gap-2" dir="ltr">
              <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors">
                [ 01 ]
              </span>
              <span className="font-sans text-xs uppercase tracking-widest text-neutral-400 border border-neutral-800 group-hover:border-neutral-600 px-2.5 py-1 rounded-sm shrink-0" style={fontStyle}>
                {activeIsPersian ? 'معماری / فضای داخلی' : 'Spatial / Environment'}
              </span>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-white mb-3 wrap-break-word leading-tight" style={fontStyle}>
                {activeIsPersian ? 'طراحی معماری و معماری داخلی' : 'SPATIAL ARCHITECTURE'}
              </h2>
              <p className="text-sm font-sans text-neutral-400 max-w-sm group-hover:text-neutral-200 transition-colors leading-relaxed" style={fontStyle}>
                {activeIsPersian
                  ? 'طراحی معماری، بازسازی تخصصی، دیزاین داخلی و ساخت مبلمان سفارشی'
                  : 'Structural minimalism, interior environments, bespoke furniture, and tactile materials.'}
              </p>
              
              <div className="mt-8 inline-flex items-center gap-2.5 font-sans text-sm md:text-base font-medium text-white uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300" style={fontStyle}>
                <span>{activeIsPersian ? 'ورود به استودیوی معماری' : 'ENTER SPATIAL'}</span>
                <span>{activeIsPersian ? '←' : '→'}</span>
              </div>
            </div>
          </div>

          {/* Card 02: Cinematic & 3D Motion */}
          <div
            onClick={() => handleSelect('cinematic')}
            onMouseEnter={() => setHoveredCard('cinematic')}
            onMouseLeave={() => setHoveredCard(null)}
            onTouchStart={() => setHoveredCard('cinematic')}
            onTouchEnd={() => setHoveredCard(null)}
            className="group relative min-h-104 border border-neutral-800 bg-neutral-950/60 rounded-sm p-6 md:p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 hover:border-white hover:scale-[1.01] hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] overflow-hidden"
          >
            <div className="absolute -right-12 -bottom-12 w-64 h-64 border border-dashed border-neutral-800 group-hover:border-neutral-400 rounded-full animate-[spin_20s_linear_infinite] transition-all duration-700 opacity-40 group-hover:opacity-80 pointer-events-none" />
            <div className="absolute right-4 bottom-4 w-48 h-48 border border-neutral-800 group-hover:border-neutral-500 rotate-45 transition-all duration-700 ease-out group-hover:rotate-90 group-hover:scale-125 opacity-20 pointer-events-none" />

            <div className="flex justify-between items-start gap-2" dir="ltr">
              <span className="font-mono text-xs text-neutral-500 group-hover:text-white transition-colors">
                [ 02 ]
              </span>
              <span className="font-sans text-xs uppercase tracking-widest text-neutral-400 border border-neutral-800 group-hover:border-neutral-600 px-2.5 py-1 rounded-sm shrink-0" style={fontStyle}>
                {activeIsPersian ? 'موشن دیزاین / CGI' : 'Digital / Kinetic'}
              </span>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-white mb-3 wrap-break-word leading-tight" style={fontStyle}>
                {activeIsPersian ? 'موشن گرافیک ۳ بعدی و سینماتیک' : 'CINEMATIC & 3D MOTION'}
              </h2>
              <p className="text-sm font-sans text-neutral-400 max-w-sm group-hover:text-neutral-200 transition-colors leading-relaxed" style={fontStyle}>
                {activeIsPersian
                  ? 'رندرینگ ۳ بعدی، موشن دیزاین تبلیغاتی، CGI و هویت بصری پویا'
                  : 'High-fidelity 3D CGI rendering, kinetic branding, visual identity systems, and digital motion.'}
              </p>
              
              <div className="mt-8 inline-flex items-center gap-2.5 font-sans text-sm md:text-base font-medium text-white uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300" style={fontStyle}>
                <span>{activeIsPersian ? 'ورود به استودیوی موشن' : 'ENTER CINEMATIC'}</span>
                <span>{activeIsPersian ? '←' : '→'}</span>
              </div>
            </div>
          </div>

        </main>

        {/* Technical Footer Bar */}
        <footer className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-mono text-neutral-500 border-t border-neutral-800 pt-4" dir="ltr">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="uppercase tracking-widest font-sans text-xs" style={fontStyle}>
              {activeIsPersian ? 'استودیوی دیزاین چند‌رشته‌ای' : 'MULTIDISCIPLINARY DESIGN STUDIO'}
            </span>
          </div>
          <span className="uppercase tracking-widest text-neutral-600 font-sans text-xs" style={fontStyle}>
            {activeIsPersian ? 'تهران / بین‌المللی' : 'TEHRAN // GLOBAL'}
          </span>
          <span>SIAWSH © 2026</span>
        </footer>

      </div>
    </>
  );
}
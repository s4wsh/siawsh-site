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

  // Smooth Interpolated Pointer Positions
  const [targetMousePos, setTargetMousePos] = useState({ x: 50, y: 50 });
  const [smoothMousePos, setSmoothMousePos] = useState({ x: 50, y: 50 });
  const [activeTouchCard, setActiveTouchCard] = useState(null);

  // Sync language state with component mode on mount / prop update
  useEffect(() => {
    const targetLang = isPersian ? 'fa' : 'en';
    if (lang !== targetLang) {
      setLang(targetLang);
    }
  }, [isPersian, lang, setLang]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Gentle LERP Loop for Fluid & Slow Effect Tracking
  useEffect(() => {
    let animationFrameId;
    const lerpFactor = 0.035; // Ultra-slow easing

    const animatePointer = () => {
      setSmoothMousePos((prev) => {
        const dx = targetMousePos.x - prev.x;
        const dy = targetMousePos.y - prev.y;

        if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
          return targetMousePos;
        }

        return {
          x: prev.x + dx * lerpFactor,
          y: prev.y + dy * lerpFactor,
        };
      });

      animationFrameId = requestAnimationFrame(animatePointer);
    };

    animationFrameId = requestAnimationFrame(animatePointer);
    return () => cancelAnimationFrame(animationFrameId);
  }, [targetMousePos]);

  // Update Target Pointer Location
  const updatePointerPosition = (clientX, clientY, currentTarget) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 0), 100);
    setTargetMousePos({ x, y });
  };

  // Mouse Interaction Handlers
  const handleMouseMove = (e, cardKey) => {
    setHoveredCard(cardKey);
    updatePointerPosition(e.clientX, e.clientY, e.currentTarget);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  // Touch Interaction Handlers
  const handleTouchStart = (e, cardKey) => {
    setActiveTouchCard(cardKey);
    setHoveredCard(cardKey);
    if (e.touches && e.touches[0]) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
    }
  };

  const handleTouchMove = (e, cardKey) => {
    if (e.touches && e.touches[0]) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
    }
  };

  const handleTouchEnd = () => {
    setActiveTouchCard(null);
    setHoveredCard(null);
  };

  const handleSelect = (discipline) => {
    setMode(discipline);
    sessionStorage.setItem('preferredDiscipline', discipline);
    
    const basePath = isPersian ? '/fa/home' : '/home';
    const targetPath = `${basePath}?discipline=${discipline}`;
    
    navigate(targetPath, { state: { scrollToWork: true, discipline } });
  };

  const toggleLanguage = () => {
    const nextLang = isPersian ? 'en' : 'fa';
    setLang(nextLang);
    navigate(nextLang === 'fa' ? '/fa/gateway' : '/gateway');
  };

  const activeIsPersian = isPersian || lang === 'fa';

  const fontStyle = {
    fontFamily: activeIsPersian
      ? 'Vazirmatn, var(--font-sans), system-ui, sans-serif'
      : 'var(--font-sans), system-ui, sans-serif',
  };

  const angle = Math.atan2(smoothMousePos.y - 50, smoothMousePos.x - 50) * (180 / Math.PI) + 180;

  // Border Stroke Gradient Styling
  const getWandStrokeStyle = (cardKey) => {
    const isInteracting = hoveredCard === cardKey || activeTouchCard === cardKey;
    return {
      background: isInteracting
        ? `conic-gradient(from ${angle}deg at ${smoothMousePos.x}% ${smoothMousePos.y}%, #00f0ff 0deg, #ff5500 120deg, #00ff66 240deg, #00f0ff 360deg)`
        : `conic-gradient(from 0deg at 50% 50%, #00f0ff 0deg, #ff5500 120deg, #00ff66 240deg, #00f0ff 360deg)`,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      padding: '1.5px',
    };
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

        {/* Global Ambient Glow */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1200 ease-out opacity-20 z-0 ${
            hoveredCard === 'spatial' ? 'bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-amber-900/40 via-black to-black' : ''
          } ${
            hoveredCard === 'cinematic' ? 'bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-sky-900/40 via-black to-black' : ''
          }`}
        />

        {/* Header Bar */}
        <header className="relative z-10 flex justify-between items-center text-xs tracking-widest uppercase font-mono text-neutral-400 border-b border-neutral-800/80 pb-4" dir="ltr">
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

          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 border border-neutral-800 hover:border-neutral-500 px-3 py-1.5 rounded-sm text-xs font-mono text-neutral-300 hover:text-white transition-all duration-500 ease-out cursor-pointer bg-transparent"
          >
            <span className={!activeIsPersian ? 'text-white font-bold' : 'text-neutral-500'}>EN</span>
            <span className="text-neutral-600">/</span>
            <span className={activeIsPersian ? 'text-white font-bold' : 'text-neutral-500'}>FA</span>
          </button>
        </header>

        {/* Gateway Options Grid */}
        <main className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 my-auto py-8 max-w-6xl mx-auto w-full">
          
          {/* Card 01: Spatial Architecture (Architectural Light & Shadow Spatial Beam) */}
          <div
            onClick={() => handleSelect('spatial')}
            onMouseMove={(e) => handleMouseMove(e, 'spatial')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={(e) => handleTouchStart(e, 'spatial')}
            onTouchMove={(e) => handleTouchMove(e, 'spatial')}
            onTouchEnd={handleTouchEnd}
            className="group relative min-h-104 border border-neutral-800/80 bg-neutral-950/40 rounded-none p-6 md:p-8 flex flex-col justify-between cursor-pointer transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.008] hover:border-white/30 overflow-hidden"
          >
            {/* Soft Ambient Vignette Layer */}
            <div className="absolute inset-0 pointer-events-none backdrop-blur-[3px] bg-black/20 z-10 transition-opacity duration-1000" />

            {/* Architectural Volumetric Light Cone Beam (Spatial Light Effect) */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-45 transition-opacity duration-1200 ease-out z-0"
              style={{
                background: activeIsPersian
                  ? `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                  : `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(225deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
              }}
            />

            {/* Dynamic Magic Border Stroke Line */}
            <div 
              className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out z-30 ${
                hoveredCard === 'spatial' || activeTouchCard === 'spatial' ? 'opacity-100' : 'opacity-0'
              }`}
              style={getWandStrokeStyle('spatial')}
            />

            {/* Sparkle Trail */}
            <div 
              className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out z-20 overflow-hidden ${
                hoveredCard === 'spatial' || activeTouchCard === 'spatial' ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `
                  radial-gradient(1.5px 1.5px at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255,255,255,0.95) 100%, transparent),
                  radial-gradient(2px 2px at ${Math.min(smoothMousePos.x + 5, 100)}% ${Math.max(smoothMousePos.y - 8, 0)}%, rgba(0,240,255,0.85) 100%, transparent),
                  radial-gradient(1.5px 1.5px at ${Math.max(smoothMousePos.x - 6, 0)}% ${Math.min(smoothMousePos.y + 6, 100)}%, rgba(255,85,0,0.8) 100%, transparent),
                  radial-gradient(1px 1px at ${Math.min(smoothMousePos.x + 10, 100)}% ${Math.min(smoothMousePos.y + 10, 100)}%, rgba(0,255,102,0.75) 100%, transparent)
                `
              }}
            />

            {/* Background Internal Shapes */}
            <div 
              className={`absolute w-72 h-72 border-2 border-neutral-600 group-hover:border-amber-200/40 rotate-35 skew-x-12 transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-15 group-hover:scale-110 opacity-70 group-hover:opacity-100 pointer-events-none z-0 ${
                activeIsPersian ? '-left-10 -top-10' : '-right-10 -bottom-10'
              }`} 
            />
            <div 
              className={`absolute w-72 h-72 border border-neutral-700 group-hover:border-neutral-400 rotate-35 skew-x-12 transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-15 group-hover:scale-110 opacity-50 group-hover:opacity-80 pointer-events-none z-0 ${
                activeIsPersian ? '-left-5 -top-5' : '-right-5 -bottom-5'
              }`} 
            />

            <div className="flex justify-between items-start gap-2 relative z-40" dir="ltr">
              <span className="font-mono text-xs text-neutral-400 group-hover:text-white transition-colors duration-700">
                [ 01 ]
              </span>
              <span className="font-sans text-xs uppercase tracking-widest text-neutral-300 border border-neutral-700 group-hover:border-neutral-500 px-2.5 py-1 rounded-sm shrink-0 backdrop-blur-sm bg-black/40 transition-colors duration-700" style={fontStyle}>
                {activeIsPersian ? 'معماری / فضای داخلی' : 'Spatial / Environment'}
              </span>
            </div>

            <div className="mt-8 relative z-40">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-white mb-3 wrap-break-word leading-tight" style={fontStyle}>
                {activeIsPersian ? 'طراحی معماری و معماری داخلی' : 'SPATIAL ARCHITECTURE'}
              </h2>
              <p className="text-sm font-sans text-neutral-300 max-w-sm group-hover:text-neutral-100 transition-colors duration-700 leading-relaxed" style={fontStyle}>
                {activeIsPersian
                  ? 'طراحی معماری، بازسازی تخصصی، دیزاین داخلی و ساخت مبلمان سفارشی'
                  : 'Structural minimalism, interior environments, bespoke furniture, and tactile materials.'}
              </p>
              
              <div className="mt-8 inline-flex items-center gap-2.5 font-sans text-sm md:text-base font-medium text-white uppercase tracking-wider group-hover:translate-x-1.5 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={fontStyle}>
                <span>{activeIsPersian ? 'ورود به استودیوی معماری' : 'ENTER SPATIAL'}</span>
                <span>{activeIsPersian ? '←' : '→'}</span>
              </div>
            </div>
          </div>

          {/* Card 02: Cinematic & 3D Motion */}
          <div
            onClick={() => handleSelect('cinematic')}
            onMouseMove={(e) => handleMouseMove(e, 'cinematic')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={(e) => handleTouchStart(e, 'cinematic')}
            onTouchMove={(e) => handleTouchMove(e, 'cinematic')}
            onTouchEnd={handleTouchEnd}
            className="group relative min-h-104 border border-neutral-800/80 bg-neutral-950/40 rounded-none p-6 md:p-8 flex flex-col justify-between cursor-pointer transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.008] hover:border-white/30 overflow-hidden"
          >
            {/* Soft Ambient Vignette Layer */}
            <div className="absolute inset-0 pointer-events-none backdrop-blur-[3px] bg-black/20 z-10 transition-opacity duration-1000" />

            {/* Dynamic Magic Border Stroke Line */}
            <div 
              className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out z-30 ${
                hoveredCard === 'cinematic' || activeTouchCard === 'cinematic' ? 'opacity-100' : 'opacity-0'
              }`}
              style={getWandStrokeStyle('cinematic')}
            />

            {/* Sparkle Trail */}
            <div 
              className={`pointer-events-none absolute inset-0 transition-opacity duration-1000 ease-out z-20 overflow-hidden ${
                hoveredCard === 'cinematic' || activeTouchCard === 'cinematic' ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `
                  radial-gradient(1.5px 1.5px at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255,255,255,0.95) 100%, transparent),
                  radial-gradient(2px 2px at ${Math.min(smoothMousePos.x + 5, 100)}% ${Math.max(smoothMousePos.y - 8, 0)}%, rgba(0,240,255,0.85) 100%, transparent),
                  radial-gradient(1.5px 1.5px at ${Math.max(smoothMousePos.x - 6, 0)}% ${Math.min(smoothMousePos.y + 6, 100)}%, rgba(255,85,0,0.8) 100%, transparent),
                  radial-gradient(1px 1px at ${Math.min(smoothMousePos.x + 10, 100)}% ${Math.min(smoothMousePos.y + 10, 100)}%, rgba(0,255,102,0.75) 100%, transparent)
                `
              }}
            />

            {/* Background Internal Shapes (Dashed Circle on Top in Farsi Mode) */}
            <div 
              className={`absolute w-64 h-64 border-2 border-dashed border-neutral-600 group-hover:border-neutral-300 rounded-full animate-[spin_40s_linear_infinite] transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-70 group-hover:opacity-100 pointer-events-none z-0 ${
                activeIsPersian ? '-left-12 -top-12' : '-right-12 -bottom-12'
              }`} 
            />
            <div 
              className={`absolute w-48 h-48 border border-neutral-700 group-hover:border-neutral-400 rotate-45 transition-all duration-1200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-90 group-hover:scale-125 opacity-50 group-hover:opacity-80 pointer-events-none z-0 ${
                activeIsPersian ? 'left-4 top-4' : 'right-4 bottom-4'
              }`} 
            />

            <div className="flex justify-between items-start gap-2 relative z-40" dir="ltr">
              <span className="font-mono text-xs text-neutral-400 group-hover:text-white transition-colors duration-700">
                [ 02 ]
              </span>
              <span className="font-sans text-xs uppercase tracking-widest text-neutral-300 border border-neutral-700 group-hover:border-neutral-500 px-2.5 py-1 rounded-sm shrink-0 backdrop-blur-sm bg-black/40 transition-colors duration-700" style={fontStyle}>
                {activeIsPersian ? 'موشن دیزاین / CGI' : 'Digital / Kinetic'}
              </span>
            </div>

            <div className="mt-8 relative z-40">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-tight text-white mb-3 wrap-break-word leading-tight" style={fontStyle}>
                {activeIsPersian ? 'موشن گرافیک ۳ بعدی و سینماتیک' : 'CINEMATIC & 3D MOTION'}
              </h2>
              <p className="text-sm font-sans text-neutral-300 max-w-sm group-hover:text-neutral-100 transition-colors duration-700 leading-relaxed" style={fontStyle}>
                {activeIsPersian
                  ? 'رندرینگ ۳ بعدی، موشن دیزاین تبلیغاتی، CGI و هویت بصری پویا'
                  : 'High-fidelity 3D CGI rendering, kinetic branding, visual identity systems, and digital motion.'}
              </p>
              
              <div className="mt-8 inline-flex items-center gap-2.5 font-sans text-sm md:text-base font-medium text-white uppercase tracking-wider group-hover:translate-x-1.5 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" style={fontStyle}>
                <span>{activeIsPersian ? 'ورود به استودیوی موشن' : 'ENTER CINEMATIC'}</span>
                <span>{activeIsPersian ? '←' : '→'}</span>
              </div>
            </div>
          </div>

        </main>

        {/* Footer Bar */}
        <footer className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs font-mono text-neutral-500 border-t border-neutral-800/80 pt-4" dir="ltr">
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
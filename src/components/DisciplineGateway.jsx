import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import GatewayWebGLBackground from './GatewayWebGLBackground.jsx';

export default function DisciplineGateway({ isPersian = false }) {
  const navigate = useNavigate();
  const { setMode, lang, setLang } = useStudioTheme();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [activeTouchCard, setActiveTouchCard] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Smooth Interpolated Pointer Positions (LERP)
  const [targetMousePos, setTargetMousePos] = useState({ x: 50, y: 50 });
  const [smoothMousePos, setSmoothMousePos] = useState({ x: 50, y: 50 });

  // Sync language state on mount / prop update
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

  // LERP Loop for Fluid Magic Border & Trail Tracking
  useEffect(() => {
    let animationFrameId;
    const lerpFactor = 0.035;

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

  // Pointer Location Update Handler
  const updatePointerPosition = (clientX, clientY, currentTarget) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 0), 100);
    const y = Math.min(Math.max(((clientY - rect.top) / rect.height) * 100, 0), 100);
    setTargetMousePos({ x, y });
  };

  const handleMouseMove = (e, cardKey) => {
    setHoveredCard(cardKey);
    updatePointerPosition(e.clientX, e.clientY, e.currentTarget);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

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

  // Dynamic Conic Magic Border Stroke
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

  const currentActiveDiscipline = hoveredCard || activeTouchCard;

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

      {/* Viewport locked to 100dvh with dark background */}
      <div 
        className={`w-full min-h-screen h-dvh bg-slate-950 text-white flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden select-none transition-opacity duration-1000 ease-out ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={fontStyle}
        dir={activeIsPersian ? 'rtl' : 'ltr'}
      >
        {/* Real-Time WebGL Fluid Shader Canvas Background */}
        <GatewayWebGLBackground activeDiscipline={currentActiveDiscipline} />

        {/* Global Ambient Glow */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out z-0 ${
            hoveredCard === 'spatial' || activeTouchCard === 'spatial' 
              ? 'opacity-40 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-amber-900/30 via-transparent to-transparent' 
              : hoveredCard === 'cinematic' || activeTouchCard === 'cinematic' 
              ? 'opacity-40 bg-[radial-gradient(ellipse_at_bottom_right,var(--tw-gradient-stops))] from-cyan-950/40 via-transparent to-transparent' 
              : 'opacity-0'
          }`}
        />

        {/* Header Bar */}
        <header className="relative z-10 flex justify-between items-center text-xs tracking-widest uppercase font-mono text-slate-400 border-b border-white/10 pb-3 md:pb-4 shrink-0 max-w-6xl mx-auto w-full" dir="ltr">
          <div className="flex items-center">
            <img 
              src="/favicon.svg" 
              alt="SIAWSH Logo" 
              className="w-5 h-5 object-contain"
            />
          </div>

          <span className="hidden sm:inline-block font-sans text-xs tracking-wider bg-slate-900/40 backdrop-blur-md px-4 py-1.5 rounded-none border border-white/5" style={fontStyle}>
            {activeIsPersian ? 'انتخاب حوزه فعالیت' : 'DISCIPLINE SELECTION'}
          </span>

          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 border border-white/10 hover:border-cyan-500/40 px-3 py-1.5 rounded-none text-xs font-mono text-slate-300 hover:text-white transition-all duration-300 cursor-pointer bg-slate-900/40 backdrop-blur-md"
          >
            <span className={!activeIsPersian ? 'text-white font-bold' : 'text-slate-500'}>EN</span>
            <span className="text-slate-600">/</span>
            <span className={activeIsPersian ? 'text-white font-bold' : 'text-slate-500'}>FA</span>
          </button>
        </header>

        {/* Gateway Options Grid — Sharp Obsidian Glass Architecture */}
        <main className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 my-auto py-4 max-w-5xl lg:max-w-6xl mx-auto w-full flex-1 max-h-[calc(100dvh-120px)] 2xl:max-h-620px items-stretch">
          
          {/* Card 01: Spatial Architecture */}
          <div
            onClick={() => handleSelect('spatial')}
            onMouseMove={(e) => handleMouseMove(e, 'spatial')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={(e) => handleTouchStart(e, 'spatial')}
            onTouchMove={(e) => handleTouchMove(e, 'spatial')}
            onTouchEnd={handleTouchEnd}
            className={`group relative h-full flex-1 rounded-none p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 overflow-hidden backdrop-blur-xl bg-slate-950/35 hover:bg-slate-800/35 border ${
              hoveredCard === 'spatial' || activeTouchCard === 'spatial' 
                ? 'border-amber-500/40 shadow-[0_20px_50px_rgba(217,119,6,0.12),inset_0_0_30px_rgba(245,158,11,0.08)]' 
                : 'border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
            }`}
          >
            <div className="absolute inset-0 pointer-events-none backdrop-blur-[2px] z-10 transition-opacity duration-700" />

            {/* Dynamic Ambient Refraction */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-45 transition-opacity duration-1000 ease-out z-0"
              style={{
                background: activeIsPersian
                  ? `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
                  : `radial-gradient(ellipse 120% 80% at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255, 220, 180, 0.18) 0%, rgba(255, 170, 100, 0.05) 45%, transparent 80%), linear-gradient(225deg, rgba(255,255,255,0.06) 0%, transparent 60%)`
              }}
            />

            {/* Magic Border Stroke */}
            <div 
              className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out z-30 rounded-none ${
                hoveredCard === 'spatial' || activeTouchCard === 'spatial' ? 'opacity-100' : 'opacity-0'
              }`}
              style={getWandStrokeStyle('spatial')}
            />

            {/* Sparkle Trail */}
            <div 
              className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out z-20 overflow-hidden rounded-none ${
                hoveredCard === 'spatial' || activeTouchCard === 'spatial' ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `
                  radial-gradient(1.5px 1.5px at ${smoothMousePos.x}% ${smoothMousePos.y}%, rgba(255,255,255,0.95) 100%, transparent),
                  radial-gradient(2px 2px at ${Math.min(smoothMousePos.x + 5, 100)}% ${Math.max(smoothMousePos.y - 8, 0)}%, rgba(255,180,100,0.85) 100%, transparent),
                  radial-gradient(1.5px 1.5px at ${Math.max(smoothMousePos.x - 6, 0)}% ${Math.min(smoothMousePos.y + 6, 100)}%, rgba(255,85,0,0.8) 100%, transparent),
                  radial-gradient(1px 1px at ${Math.min(smoothMousePos.x + 10, 100)}% ${Math.min(smoothMousePos.y + 10, 100)}%, rgba(255,220,150,0.75) 100%, transparent)
                `
              }}
            />

            {/* Internal Structural Accent Shape */}
            <div 
              className={`absolute w-44 h-44 sm:w-60 sm:h-60 border border-white/10 group-hover:border-amber-400/30 rotate-35 skew-x-12 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-15 group-hover:scale-110 opacity-40 group-hover:opacity-80 pointer-events-none z-0 ${
                activeIsPersian ? '-left-8 -top-8' : '-right-8 -bottom-8'
              }`} 
            />

            <div className="flex justify-between items-start gap-2 relative z-40" dir="ltr">
              <span className="font-mono text-xs text-slate-400 group-hover:text-white transition-colors duration-500">
                [ 01 ]
              </span>
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-slate-300 border border-white/10 group-hover:border-amber-500/30 px-3 py-1 rounded-none shrink-0 backdrop-blur-md bg-white/5 transition-colors duration-500" style={fontStyle}>
                {activeIsPersian ? 'معماری / فضای داخلی' : 'Spatial / Environment'}
              </span>
            </div>

            <div className="my-auto py-2 relative z-40">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl 2xl:text-4xl font-light tracking-tight text-white mb-2 md:mb-3 leading-tight" style={fontStyle}>
                {activeIsPersian ? 'طراحی معماری و معماری داخلی' : 'SPATIAL ARCHITECTURE'}
              </h2>
              <p className="text-xs sm:text-sm font-sans text-slate-300 max-w-sm group-hover:text-slate-100 transition-colors duration-500 leading-relaxed line-clamp-2 sm:line-clamp-none" style={fontStyle}>
                {activeIsPersian
                  ? 'طراحی معماری، بازسازی تخصصی، دیزاین داخلی و ساخت مبلمان سفارشی'
                  : 'Structural minimalism, interior environments, bespoke furniture, and tactile materials.'}
              </p>
              
              <div className="mt-4 sm:mt-6 md:mt-8 inline-flex items-center gap-2 font-sans text-xs sm:text-sm font-medium text-amber-400 sm:text-white uppercase tracking-wider group-hover:translate-x-1.5 transition-transform duration-500 ease-out" style={fontStyle}>
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
            className={`group relative h-full flex-1 rounded-none p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 overflow-hidden backdrop-blur-xl bg-slate-950/35 hover:bg-black/75 border ${
              hoveredCard === 'cinematic' || activeTouchCard === 'cinematic' 
                ? 'border-cyan-500/40 shadow-[0_20px_50px_rgba(8,145,178,0.12),inset_0_0_30px_rgba(6,182,212,0.08)]' 
                : 'border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
            }`}
          >
            <div className="absolute inset-0 pointer-events-none backdrop-blur-[2px] z-10 transition-opacity duration-700" />

            {/* Magic Border Stroke */}
            <div 
              className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ease-out z-30 rounded-none ${
                hoveredCard === 'cinematic' || activeTouchCard === 'cinematic' ? 'opacity-100' : 'opacity-0'
              }`}
              style={getWandStrokeStyle('cinematic')}
            />

            {/* Sparkle Trail */}
            <div 
              className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out z-20 overflow-hidden rounded-none ${
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

            {/* Internal Structural Accent Shape */}
            <div 
              className={`absolute w-40 h-40 sm:w-56 sm:h-56 border border-dashed border-white/10 group-hover:border-cyan-400/30 rounded-none animate-[spin_40s_linear_infinite] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-40 group-hover:opacity-80 pointer-events-none z-0 ${
                activeIsPersian ? '-left-8 -top-8' : '-right-8 -bottom-8'
              }`} 
            />

            <div className="flex justify-between items-start gap-2 relative z-40" dir="ltr">
              <span className="font-mono text-xs text-slate-400 group-hover:text-white transition-colors duration-500">
                [ 02 ]
              </span>
              <span className="font-sans text-[10px] sm:text-xs uppercase tracking-widest text-slate-300 border border-white/10 group-hover:border-cyan-500/30 px-3 py-1 rounded-none shrink-0 backdrop-blur-md bg-white/5 transition-colors duration-500" style={fontStyle}>
                {activeIsPersian ? 'موشن دیزاین / CGI' : 'Digital / Kinetic'}
              </span>
            </div>

            <div className="my-auto py-2 relative z-40">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl 2xl:text-4xl font-light tracking-tight text-white mb-2 md:mb-3 leading-tight" style={fontStyle}>
                {activeIsPersian ? 'موشن گرافیک ۳ بعدی و سینماتیک' : 'CINEMATIC & 3D MOTION'}
              </h2>
              <p className="text-xs sm:text-sm font-sans text-slate-300 max-w-sm group-hover:text-slate-100 transition-colors duration-500 leading-relaxed line-clamp-2 sm:line-clamp-none" style={fontStyle}>
                {activeIsPersian
                  ? 'رندرینگ ۳ بعدی، موشن دیزاین تبلیغاتی، CGI و هویت بصری پویا'
                  : 'High-fidelity 3D CGI rendering, kinetic branding, visual identity systems, and digital motion.'}
              </p>
              
              <div className="mt-4 sm:mt-6 md:mt-8 inline-flex items-center gap-2 font-sans text-xs sm:text-sm font-medium text-cyan-400 sm:text-white uppercase tracking-wider group-hover:translate-x-1.5 transition-transform duration-500 ease-out" style={fontStyle}>
                <span>{activeIsPersian ? 'ورود به استودیوی موشن' : 'ENTER CINEMATIC'}</span>
                <span>{activeIsPersian ? '←' : '→'}</span>
              </div>
            </div>
          </div>

        </main>

        {/* Footer Bar */}
        <footer className="relative z-10 flex flex-row justify-between items-center text-[10px] sm:text-xs font-mono text-slate-400 border-t border-white/10 pt-2 sm:pt-4 shrink-0 max-w-6xl mx-auto w-full" dir="ltr">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-widest font-sans" style={fontStyle}>
              {activeIsPersian ? 'استودیوی دیزاین' : 'MULTIDISCIPLINARY STUDIO'}
            </span>
          </div>
          <span className="uppercase tracking-widest text-slate-400 font-sans hidden sm:inline-block" style={fontStyle}>
            {activeIsPersian ? 'تهران / بین‌المللی' : 'TEHRAN // GLOBAL'}
          </span>
          <span>SIAWSH © 2026</span>
        </footer>

      </div>
    </>
  );
}
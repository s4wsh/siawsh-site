import React, { useState, useEffect } from 'react';
import { useStudioTheme } from './ThemeContext';

export default function Navbar() {
  const { mode, setMode, lang, setLang, t } = useStudioTheme();
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Keep visible if drawer menu is open
      if (menuOpen) return;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, menuOpen]);

  // Lock background scroll when slide menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className={`navbar-glass ${hidden ? 'navbar-hidden' : ''}`}>
        {/* 1. Brand Logo */}
        <div className="nav-brand">
          <a href="#hero" className="logo" onClick={() => setMenuOpen(false)}>
            SIAWSH<span>.CO</span>
          </a>
        </div>

        {/* 2. Frameless Apple-Style Mode Switcher */}
        <div className="glass-switcher-wrapper">
          <div className="glass-switcher">
            <button
              type="button"
              className={`glass-switch-btn ${mode === 'spatial' ? 'active' : ''}`}
              onClick={() => setMode('spatial')}
            >
              🏢 {t.nav?.spatial || 'Spatial'}
            </button>
            <button
              type="button"
              className={`glass-switch-btn ${mode === 'cinematic' ? 'active' : ''}`}
              onClick={() => setMode('cinematic')}
            >
              🎬 {t.nav?.cinematic || 'Cinematic'}
            </button>
          </div>
        </div>

        {/* 3. Three-Line Hamburger Icon */}
        <button 
          className={`hamburger-btn ${menuOpen ? 'open' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle Menu"
          type="button"
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </nav>

      {/* Slide-out Full Glass Menu Drawer */}
      <div className={`glass-menu-overlay ${menuOpen ? 'active' : ''}`}>
        <div className="menu-content">
          {/* Section Links */}
          <ul className="menu-links">
            <li>
              <a href="#hero" onClick={toggleMenu}>
                {t.nav?.home || 'Home'}
              </a>
            </li>
            <li>
              <a href="#work" onClick={toggleMenu}>
                {t.nav?.work || 'Work'}
              </a>
            </li>
            <li>
              <a href="#about" onClick={toggleMenu}>
                {t.nav?.about || 'About'}
              </a>
            </li>
            <li>
              <a href="#contact" onClick={toggleMenu}>
                {t.nav?.contact || 'Contact'}
              </a>
            </li>
          </ul>

          <div className="menu-divider" />

          {/* Language Selection Option Buttons */}
          <div className="menu-language-section">
            <span className="menu-label">Language / زبان</span>
            <div className="lang-pills">
              <button 
                type="button"
                className={`lang-pill-btn ${lang === 'en' ? 'active' : ''}`} 
                onClick={() => { setLang('en'); toggleMenu(); }}
              >
                EN
              </button>
              <button 
                type="button"
                className={`lang-pill-btn ${lang === 'de' ? 'active' : ''}`} 
                onClick={() => { setLang('de'); toggleMenu(); }}
              >
                DE
              </button>
              <button 
                type="button"
                className={`lang-pill-btn ${lang === 'fa' ? 'active' : ''}`} 
                onClick={() => { setLang('fa'); toggleMenu(); }}
              >
                FA
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
import './Navbar.css';
import React, { useState, useEffect } from 'react';
import { useStudioTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { mode, setMode, lang, setLang, t } = useStudioTheme();
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const getSpatialLabel = () => {
    if (lang === 'fa') return 'معماری';
    return t.nav?.spatial || 'Spatial';
  };

  const getCinematicLabel = () => {
    if (lang === 'fa') return 'سینمایی';
    return t.nav?.cinematic || 'Cinematic';
  };

  return (
    <>
      <nav className={`navbar-glass ${hidden ? 'navbar-hidden' : ''}`}>
        {/* Brand SVG Logo */}
        <div className="nav-brand">
          <a href="#hero" className="logo" onClick={() => setMenuOpen(false)}>
            <img src="/favicon.svg" alt="SIAWSH.CO Logo" className="navbar-logo-img" />
          </a>
        </div>

        {/* Pure Line Switcher */}
        <div className="glass-switcher-container">
          <button
            type="button"
            className={`mode-line-btn ${mode === 'spatial' ? 'active' : ''}`}
            onClick={() => setMode('spatial')}
          >
            {getSpatialLabel()}
          </button>
          <button
            type="button"
            className={`mode-line-btn ${mode === 'cinematic' ? 'active' : ''}`}
            onClick={() => setMode('cinematic')}
          >
            {getCinematicLabel()}
          </button>
        </div>

        {/* Three-Line Menu Toggle Icon */}
        <div className="nav-right-actions">
          <button 
            className={`hamburger-btn ${menuOpen ? 'open' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle Navigation Menu"
            type="button"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </nav>

      {/* Full Glass Slide-out Menu Overlay */}
      <div className={`glass-menu-overlay ${menuOpen ? 'active' : ''}`}>
        <div className="menu-content">
          {/* Section Navigation Links */}
          <ul className="menu-links">
            <li><a href="#work" onClick={toggleMenu}>{t.nav?.work || (lang === 'fa' ? 'نمونه کارها' : 'Work')}</a></li>
            <li><a href="#about" onClick={toggleMenu}>{t.nav?.about || (lang === 'fa' ? 'درباره ما' : 'About')}</a></li>
            <li><a href="#contact" onClick={toggleMenu}>{t.nav?.contact || (lang === 'fa' ? 'تماس' : 'Contact')}</a></li>
          </ul>

          <div className="menu-divider" />

          {/* Standard Text-Only Language Switcher (EN / DE / FAR) */}
          <div className="menu-language-section">
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
                FAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
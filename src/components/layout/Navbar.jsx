// src/components/layout/Navbar.jsx

import './Navbar.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStudioTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { mode, setMode, lang, setLang, t } = useStudioTheme();
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

  // Switch mode and navigate to home if currently on a detail page
  const handleModeSwitch = (targetMode) => {
    setMode(targetMode);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  // Handle smooth section links from overlay menu across pages
  const handleSectionClick = (sectionId) => {
    setMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const elem = document.getElementById(sectionId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const elem = document.getElementById(sectionId);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
          <Link to="/" className="logo" onClick={() => setMenuOpen(false)}>
            <img src="/favicon.svg" alt="SIAWSH.CO Logo" className="navbar-logo-img" />
          </Link>
        </div>

        {/* Mode Switcher */}
        <div className="glass-switcher-container">
          <button
            type="button"
            className={`mode-line-btn ${mode === 'spatial' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('spatial')}
          >
            {getSpatialLabel()}
          </button>
          <button
            type="button"
            className={`mode-line-btn ${mode === 'cinematic' ? 'active' : ''}`}
            onClick={() => handleModeSwitch('cinematic')}
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
            <li>
              <button type="button" className="menu-link-btn" onClick={() => handleSectionClick('work')}>
                {t.nav?.work || (lang === 'fa' ? 'نمونه کارها' : 'Work')}
              </button>
            </li>
            <li>
              <button type="button" className="menu-link-btn" onClick={() => handleSectionClick('about')}>
                {t.nav?.about || (lang === 'fa' ? 'درباره ما' : 'About')}
              </button>
            </li>
            <li>
              <button type="button" className="menu-link-btn" onClick={() => handleSectionClick('contact')}>
                {t.nav?.contact || (lang === 'fa' ? 'تماس' : 'Contact')}
              </button>
            </li>
          </ul>

          <div className="menu-divider" />

          {/* Language Switcher */}
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
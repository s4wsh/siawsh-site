import './Navbar.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function Navbar() {
  const { mode, setMode, lang, setLang, t } = useStudioTheme();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Smooth scroll handler with threshold to prevent navbar jitter/jumping
  useEffect(() => {
    const SCROLL_THRESHOLD = 15;

    const handleScroll = () => {
      if (menuOpen) return;

      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (Math.abs(diff) > SCROLL_THRESHOLD) {
        if (currentScrollY > 80 && diff > 0) {
          setHidden(true);
        } else {
          setHidden(false);
        }
        lastScrollY.current = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogoClick = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    if (!isHomePage) {
      navigate('/');
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleModeSwitch = (targetMode) => {
    setMode(targetMode);
    if (!isHomePage) {
      navigate('/');
    } else {
      window.scrollTo(0, 0);
    }
  };

  const handleSectionClick = (e, target) => {
    e.preventDefault();
    if (menuOpen) toggleMenu();

    if (target === 'about') {
      navigate('/about');
      return;
    }

    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView();
        } else {
          window.scrollTo(0, 0);
        }
      }, 150);
    } else {
      const element = document.getElementById(target);
      if (element) {
        element.scrollIntoView();
      }
    }
  };

  return (
    <>
      <nav className={`navbar-glass ${hidden ? 'navbar-hidden' : ''}`}>
        <div className="mx-auto max-w-7xl px-6 md:px-12 flex w-full items-center justify-between">
          {/* Brand SVG Logo */}
          <div className="nav-brand">
            <a href="#hero" className="logo" onClick={handleLogoClick}>
              <img src="/favicon.svg" alt={t.nav.brandLogoAlt} className="navbar-logo-img" />
            </a>
          </div>

          {/* Pure Line Switcher */}
          <div className="glass-switcher-container">
            <button
              type="button"
              className={`mode-line-btn ${mode === 'spatial' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('spatial')}
            >
              {t.nav.spatial}
            </button>
            <button
              type="button"
              className={`mode-line-btn ${mode === 'cinematic' ? 'active' : ''}`}
              onClick={() => handleModeSwitch('cinematic')}
            >
              {t.nav.cinematic}
            </button>
          </div>

          {/* Three-Line Menu Toggle Icon */}
          <div className="nav-right-actions">
            <button 
              className={`hamburger-btn ${menuOpen ? 'open' : ''}`} 
              onClick={toggleMenu}
              aria-label={t.nav.menuToggle}
              type="button"
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Full Glass Slide-out Menu Overlay */}
      <div className={`glass-menu-overlay ${menuOpen ? 'active' : ''}`}>
        <div className="menu-content">
          <ul className="menu-links">
            <li>
              <a href="#work" onClick={(e) => handleSectionClick(e, 'work')}>
                {t.nav.work}
              </a>
            </li>
            <li>
              <a href="/about" onClick={(e) => handleSectionClick(e, 'about')}>
                {t.nav.about}
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleSectionClick(e, 'contact')}>
                {t.nav.contact}
              </a>
            </li>
          </ul>

          <div className="menu-divider" />

          <div className="menu-language-section">
            <div className="lang-pills">
              <button
                type="button"
                className={`lang-pill-btn ${lang === 'en' ? 'active' : ''}`} 
                onClick={() => { setLang('en'); if (menuOpen) toggleMenu(); }}
                aria-label={t.nav.languageEnglish}
              >
                EN
              </button>
              <button 
                type="button"
                className={`lang-pill-btn ${lang === 'fa' ? 'active' : ''}`} 
                onClick={() => { setLang('fa'); if (menuOpen) toggleMenu(); }}
                aria-label={t.nav.languagePersian}
              >
                فا
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
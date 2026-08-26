import './Navbar.css';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext.jsx';
import { lenisInstance } from '../hooks/useSmoothScroll.js';

export default function Navbar() {
  const { mode, setMode, lang, setLang, t } = useStudioTheme();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Helper function to force instant top scroll
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true, force: true });
    }
  };

  // Reset navbar state automatically when changing routes
  useEffect(() => {
    setHidden(false);
    setMenuOpen(false);
    lastScrollY.current = window.scrollY;
  }, [location.pathname]);

  // RequestAnimationFrame Throttle for Ultra-Smooth Hide/Show Behavior
  useEffect(() => {
    const SCROLL_THRESHOLD = 12;

    const updateNavbarVisibility = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY.current;

      if (currentScrollY <= 60) {
        setHidden(false);
      } else if (Math.abs(diff) > SCROLL_THRESHOLD) {
        if (diff > 0 && !menuOpen) {
          setHidden(true);
        } else if (diff < 0) {
          setHidden(false);
        }
        lastScrollY.current = currentScrollY;
      }

      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateNavbarVisibility);
        ticking.current = true;
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
    scrollToTop();
    if (!isHomePage) {
      navigate('/');
    }
  };

  const handleModeSwitch = (targetMode) => {
    setMode(targetMode);
    scrollToTop();
    if (!isHomePage) {
      navigate('/');
    }
  };

  const handleSectionClick = (e, target) => {
    if (menuOpen) toggleMenu();

    if (target === 'work') {
      e.preventDefault();
      scrollToTop();
      navigate('/work');
      return;
    }

    if (target === 'about') {
      e.preventDefault();
      scrollToTop();
      navigate('/about');
      return;
    }

    e.preventDefault();
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView();
        } else {
          scrollToTop();
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
              <Link to="/work" onClick={(e) => handleSectionClick(e, 'work')}>
                {t.nav.work}
              </Link>
            </li>
            <li>
              <Link to="/about" onClick={(e) => handleSectionClick(e, 'about')}>
                {t.nav.about}
              </Link>
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
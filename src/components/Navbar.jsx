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

  const isHomePage = location.pathname === '/' || 
                     location.pathname === '/home' || 
                     location.pathname === '/fa' || 
                     location.pathname === '/fa/home';

  const homePath = lang === 'fa' ? '/fa/home' : '/home';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true, force: true });
    }
  };

  useEffect(() => {
    setHidden(false);
    setMenuOpen(false);
    lastScrollY.current = window.scrollY;
  }, [location.pathname]);

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
      navigate(homePath);
    }
  };

  const handleModeSwitch = (targetMode) => {
    setMode(targetMode);
    sessionStorage.setItem('preferredDiscipline', targetMode);
    scrollToTop();
    if (!isHomePage) {
      navigate(homePath);
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

    if (target === 'insights') {
      e.preventDefault();
      scrollToTop();
      navigate('/insights');
      return;
    }

    if (target === 'contact') {
      e.preventDefault();
      scrollToTop();
      navigate('/contact');
      return;
    }

    e.preventDefault();
    if (!isHomePage) {
      navigate(homePath);
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

  const handleLangSwitch = (targetLang) => {
    setLang(targetLang);
    if (menuOpen) toggleMenu();
    if (isHomePage) {
      navigate(targetLang === 'fa' ? '/fa/home' : '/home');
    }
  };

  const isLight = mode === 'spatial';
  const isFa = lang === 'fa';

  const navbarFontStyle = {
    fontFamily: isFa ? 'Vazirmatn, sans-serif' : 'inherit',
  };

  /* Robust labels that fallback seamlessly if t object property is undefined */
  const spatialLabel = isFa ? 'معماری' : (t?.nav?.spatial || 'SPATIAL');
  const cinematicLabel = isFa ? 'سینماتیک' : (t?.nav?.cinematic || 'CINEMATIC');
  const workLabel = isFa ? (t?.nav?.work || 'پروژه‌ها') : (t?.nav?.work || 'WORK');
  const aboutLabel = isFa ? (t?.nav?.about || 'درباره استودیو') : (t?.nav?.about || 'ABOUT');
  const insightsLabel = isFa ? 'مقالات و دیدگاه‌ها' : (t?.nav?.insights || 'INSIGHTS');
  const contactLabel = isFa ? (t?.nav?.contact || 'سفارش پروژه و مشاوره') : (t?.nav?.contact || 'CONTACT');

  return (
    <>
      {/* ─── REAL PHYSICAL GLASS NAVBAR ─── */}
      <nav
        className={`navbar-glass ${hidden ? 'navbar-hidden' : ''} fixed top-0 left-0 right-0 z-50 transition-all duration-300`}
        style={{
          ...navbarFontStyle,
          /* Optical blur tuned for glass clarity + background legibility */
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          /* Transparent background allow underlying content to pass through */
          background: isLight
            ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.52) 0%, rgba(240, 240, 245, 0.38) 100%)'
            : 'linear-gradient(180deg, rgba(18, 18, 22, 0.55) 0%, rgba(8, 8, 12, 0.42) 100%)',
          borderBottom: isLight
            ? '1px solid rgba(255, 255, 255, 0.6)'
            : '1px solid rgba(255, 255, 255, 0.12)',
          /* Physical glass edge highlights & bevel reflections */
          boxShadow: isLight
            ? `inset 0 1px 0 0 rgba(255, 255, 255, 0.8),
               inset 0 -1px 0 0 rgba(0, 0, 0, 0.04),
               0 8px 32px 0 rgba(0, 0, 0, 0.06)`
            : `inset 0 1px 0 0 rgba(255, 255, 255, 0.22),
               inset 0 -1px 0 0 rgba(0, 0, 0, 0.6),
               0 12px 40px 0 rgba(0, 0, 0, 0.5)`,
        }}
        dir={isFa ? 'rtl' : 'ltr'}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 flex w-full items-center justify-between h-14 sm:h-16">

          {/* Brand Logo */}
          <div className="nav-brand flex items-center shrink-0">
            <a href="#hero" className="logo flex items-center" onClick={handleLogoClick}>
              <img
                src="/favicon.svg"
                alt={t?.nav?.brandLogoAlt || 'Studio Logo'}
                className="navbar-logo-img h-7 sm:h-8 w-auto object-contain transition-all duration-300"
                style={{
                  filter: isLight
                    ? 'drop-shadow(0 1px 2px rgba(255,255,255,0.9))'
                    : 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))',
                }}
              />
            </a>
          </div>

          {/* ─── FRAMELESS MODE SWITCHER ─── */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Spatial */}
            <button
              type="button"
              onClick={() => handleModeSwitch('spatial')}
              className={`relative bg-transparent border-none cursor-pointer transition-all duration-200 ${
                isFa
                  ? 'text-[13.5px] sm:text-[15px] font-bold tracking-normal'
                  : 'text-[11px] sm:text-[12px] font-extrabold tracking-[0.08em] uppercase'
              }`}
              style={{
                ...navbarFontStyle,
                color: mode === 'spatial'
                  ? (isLight ? '#000' : '#fff')
                  : (isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'),
                padding: '2px 2px',
                textShadow: isLight 
                  ? '0 1px 2px rgba(255,255,255,0.8)' 
                  : '0 1px 3px rgba(0,0,0,0.8)',
              }}
            >
              {spatialLabel}
              {mode === 'spatial' && (
                <span
                  className="absolute left-0 right-0 h-0.5 transition-all duration-200"
                  style={{
                    bottom: isFa ? '-3px' : '-2px',
                    background: isLight ? '#000' : '#fff',
                    boxShadow: isLight
                      ? '0 0 4px rgba(0,0,0,0.3)'
                      : '0 0 6px rgba(255,255,255,0.6)',
                  }}
                />
              )}
            </button>

            {/* Divider */}
            <span
              className="select-none font-normal"
              style={{
                fontSize: isFa ? '13px' : '11px',
                color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.35)',
              }}
            >
              /
            </span>

            {/* Cinematic */}
            <button
              type="button"
              onClick={() => handleModeSwitch('cinematic')}
              className={`relative bg-transparent border-none cursor-pointer transition-all duration-200 ${
                isFa
                  ? 'text-[13.5px] sm:text-[15px] font-bold tracking-normal'
                  : 'text-[11px] sm:text-[12px] font-extrabold tracking-[0.08em] uppercase'
              }`}
              style={{
                ...navbarFontStyle,
                color: mode === 'cinematic'
                  ? (isLight ? '#000' : '#fff')
                  : (isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'),
                padding: '2px 2px',
                textShadow: isLight 
                  ? '0 1px 2px rgba(255,255,255,0.8)' 
                  : '0 1px 3px rgba(0,0,0,0.8)',
              }}
            >
              {cinematicLabel}
              {mode === 'cinematic' && (
                <span
                  className="absolute left-0 right-0 h-0.5 transition-all duration-200"
                  style={{
                    bottom: isFa ? '-3px' : '-2px',
                    background: isLight ? '#000' : '#fff',
                    boxShadow: isLight
                      ? '0 0 4px rgba(0,0,0,0.3)'
                      : '0 0 6px rgba(255,255,255,0.6)',
                  }}
                />
              )}
            </button>
          </div>

          {/* Hamburger Icon */}
          <div className="nav-right-actions flex items-center shrink-0">
            <button
              className={`hamburger-btn flex flex-col justify-center items-end gap-[4.5px] p-1.5 bg-transparent border-none cursor-pointer ${menuOpen ? 'open' : ''}`}
              onClick={toggleMenu}
              aria-label={t?.nav?.menuToggle || 'Toggle Menu'}
              type="button"
            >
              <span
                className="bar w-5 h-[1.5px] transition-all duration-300"
                style={{ background: isLight ? '#000' : '#fff' }}
              />
              <span
                className="bar w-5 h-[1.5px] transition-all duration-300"
                style={{ background: isLight ? '#000' : '#fff' }}
              />
              <span
                className="bar w-5 h-[1.5px] transition-all duration-300"
                style={{ background: isLight ? '#000' : '#fff' }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── REAL GLASS MENU OVERLAY ─── */}
      <div
        className={`glass-menu-overlay ${menuOpen ? 'active' : ''} transition-all duration-300`}
        style={{
          ...navbarFontStyle,
          backdropFilter: 'blur(28px) saturate(190%)',
          WebkitBackdropFilter: 'blur(28px) saturate(190%)',
          background: isLight
            ? 'rgba(255, 255, 255, 0.78)'
            : 'rgba(12, 12, 16, 0.82)',
          boxShadow: isLight
            ? 'inset 0 1px 0 0 rgba(255, 255, 255, 0.9)'
            : 'inset 0 1px 0 0 rgba(255, 255, 255, 0.18)',
        }}
        dir={isFa ? 'rtl' : 'ltr'}
      >
        <div className="menu-content">
          <ul className="menu-links">
            <li>
              <Link
                to="/work"
                onClick={(e) => handleSectionClick(e, 'work')}
                className="text-2xl sm:text-3xl font-extrabold transition-colors duration-200"
                style={{
                  ...navbarFontStyle,
                  color: isLight ? '#000' : '#fff',
                }}
              >
                {workLabel}
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={(e) => handleSectionClick(e, 'about')}
                className="text-2xl sm:text-3xl font-extrabold transition-colors duration-200"
                style={{
                  ...navbarFontStyle,
                  color: isLight ? '#000' : '#fff',
                }}
              >
                {aboutLabel}
              </Link>
            </li>
            <li>
              <Link
                to="/insights"
                onClick={(e) => handleSectionClick(e, 'insights')}
                className="text-2xl sm:text-3xl font-extrabold transition-colors duration-200"
                style={{
                  ...navbarFontStyle,
                  color: isLight ? '#000' : '#fff',
                }}
              >
                {insightsLabel}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                onClick={(e) => handleSectionClick(e, 'contact')}
                className="text-2xl sm:text-3xl font-extrabold transition-colors duration-200"
                style={{
                  ...navbarFontStyle,
                  color: isLight ? '#000' : '#fff',
                }}
              >
                {contactLabel}
              </Link>
            </li>
          </ul>

          <div
            className="menu-divider my-6 border-b"
            style={{
              borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)',
            }}
          />

          <div className="menu-language-section">
            <div className="lang-pills flex items-center justify-center gap-5">
              <button
                type="button"
                className="lang-pill-btn bg-transparent border-none text-base font-extrabold transition-all duration-200"
                style={{
                  ...navbarFontStyle,
                  color: lang === 'en'
                    ? (isLight ? '#000' : '#fff')
                    : (isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)'),
                }}
                onClick={() => handleLangSwitch('en')}
                aria-label={t?.nav?.languageEnglish || 'English'}
              >
                EN
              </button>
              <span
                className="text-sm font-light"
                style={{ color: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)' }}
              >
                /
              </span>
              <button
                type="button"
                className="lang-pill-btn bg-transparent border-none text-base font-extrabold transition-all duration-200"
                style={{
                  ...navbarFontStyle,
                  color: lang === 'fa'
                    ? (isLight ? '#000' : '#fff')
                    : (isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)'),
                }}
                onClick={() => handleLangSwitch('fa')}
                aria-label={t?.nav?.languagePersian || 'Persian'}
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
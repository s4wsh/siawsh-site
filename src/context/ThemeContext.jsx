import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { translations } from '../data/translations';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // 1. Persistent mode state initialized from localStorage
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('app_mode') || 'spatial';
  });

  // 2. Persistent language state: 
  // Priority: 1. localStorage choice -> 2. Browser navigator preference -> 3. Fallback to English
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem('app_lang');
    if (savedLang) {
      return savedLang;
    }

    if (typeof window !== 'undefined' && navigator) {
      const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      if (browserLang.startsWith('fa')) {
        return 'fa';
      }
    }

    return 'en';
  });

  // Safe fallback translation object
  const t = translations[lang] || translations.en;

  // 3. DOM attribute updates & storage sync
  useEffect(() => {
    const direction = t.dir || (lang === 'fa' ? 'rtl' : 'ltr');

    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', direction);

    // Save preferences across sessions
    localStorage.setItem('app_mode', mode);
    localStorage.setItem('app_lang', lang);
  }, [mode, lang, t]);

  // 4. Memoized context value
  const value = useMemo(() => {
    const isLight = mode === 'spatial';
    return {
      mode,
      setMode,
      activePractice: mode,
      setActivePractice: setMode,
      isLight,
      lang,
      setLang,
      t,
    };
  }, [mode, lang, t]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useStudioTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useStudioTheme must be used within a ThemeProvider');
  }
  return context;
}
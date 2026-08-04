import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { translations } from '../data/translations';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // 1. Persistent state initialized from localStorage
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('app_mode') || 'spatial';
  });

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_lang') || 'en';
  });

  // Safe fallback translation object
  const t = translations[lang] || translations.en;

  // 2. DOM attribute updates & storage sync
  useEffect(() => {
    const direction = t.dir || (lang === 'fa' ? 'rtl' : 'ltr');

    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', direction);

    // Save preferences across sessions
    localStorage.setItem('app_mode', mode);
    localStorage.setItem('app_lang', lang);
  }, [mode, lang, t]);

  // 3. Memoized context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    mode,
    setMode,
    lang,
    setLang,
    t,
  }), [mode, lang, t]);

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
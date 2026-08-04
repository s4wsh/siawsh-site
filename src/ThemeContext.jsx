import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('spatial');
  const [lang, setLang] = useState('en');

  const t = translations[lang] || translations.en;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', t.dir || 'ltr');
    document.body.style.fontFamily = t.fontFamily || "-apple-system, sans-serif";
  }, [mode, lang, t]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, lang, setLang, t }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useStudioTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      mode: 'spatial',
      setMode: () => {},
      lang: 'en',
      setLang: () => {},
      t: translations.en
    };
  }
  return context;
}
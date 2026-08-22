import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  // Automatically update the document direction and font on language change
  useEffect(() => {
    const currentTranslation = translations[lang] || translations.en;
    document.documentElement.dir = currentTranslation.dir;
    document.documentElement.lang = lang;
    
    // Apply font family dynamically to body
    document.body.style.fontFamily = currentTranslation.fontFamily;
  }, [lang]);

  const value = {
    lang,
    setLang,
    t: translations[lang] || translations.en
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
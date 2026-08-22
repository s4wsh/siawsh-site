// src/components/LanguageToggle.js
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded transition-colors ${
          lang === 'en' ? 'bg-white text-black font-bold' : 'opacity-50 hover:opacity-100'
        }`}
      >
        EN
      </button>
      <span className="opacity-30">/</span>
      <button
        onClick={() => setLang('fa')}
        className={`px-2 py-1 rounded transition-colors ${
          lang === 'fa' ? 'bg-white text-black font-bold' : 'opacity-50 hover:opacity-100'
        }`}
      >
        فا
      </button>
    </div>
  );
}
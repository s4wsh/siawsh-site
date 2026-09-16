import React, { useState } from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function Footer() {
  const { mode, t, isLight, lang } = useStudioTheme();
  const isFa = lang === 'fa';
  const [copied, setCopied] = useState(false);

  const studioEmail = 'info@siavashstudio.ir';

  const handleCopyEmail = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(studioEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const instagramUrl = mode === 'spatial' 
    ? 'https://www.instagram.com/siawsh/' 
    : 'https://www.instagram.com/siafsari/';

  // Enforce Vazirmatn for Farsi & strictly reset letter-spacing to prevent broken characters
  const farsiFontStyle = isFa ? {
    fontFamily: "'Vazirmatn', system-ui, -apple-system, sans-serif",
    letterSpacing: 'normal'
  } : {};

  return (
    <footer 
      className={`site-footer w-full border-t transition-colors duration-300 ${
        isLight 
          ? 'bg-transparent border-black/10 text-black/90' 
          : 'bg-transparent border-white/10 text-white/90'
      }`} 
      style={farsiFontStyle}
      dir={isFa ? 'rtl' : 'ltr'}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 w-full py-12 md:py-16">
        
        {/* Main Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 pb-12 border-b border-black/10 dark:border-white/10 items-start">
          
          {/* Brand & Live Status Section */}
          <div className="md:col-span-5 space-y-4">
            <a 
              href="#hero" 
              className="inline-block text-xl md:text-2xl font-bold tracking-normal transition-opacity hover:opacity-80"
              style={{ letterSpacing: 'normal' }}
            >
              {t?.footer?.brandName || (isFa ? 'استودیوی سیاوش' : 'SIAWSH.CO')}
            </a>
            <p className="text-xs md:text-sm opacity-80 leading-relaxed max-w-sm flex items-start gap-2.5">
              <span className="h-2 w-2 rounded-full bg-[#00f0ff] animate-pulse flex-shrink-0 mt-1.5" />
              <span>{t?.footer?.status || (isFa ? 'پذیرای پروژه‌های منتخب در بخش‌های طراحی معماری، دکوراسیون داخلی و موشن گرافیک.' : 'Available for select projects in architecture, spatial design & motion graphics.')}</span>
            </p>
          </div>

          {/* Nav Links & Contact Columns */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12">
            
            {/* Contact Column */}
            <div className="space-y-3">
              <h4 className="text-xs md:text-sm font-semibold opacity-60">
                {t?.footer?.connect || (isFa ? 'ارتباط با ما' : 'Connect')}
              </h4>

              <div className="space-y-2.5 text-xs md:text-sm">
                
                {/* Email with Clean SVG Copy Button */}
                <div className="flex items-center gap-2 group">
                  <a 
                    href={`mailto:${studioEmail}`}
                    dir="ltr"
                    className={`font-mono text-xs md:text-sm transition-colors hover:text-[#00f0ff] ${
                      isLight ? 'text-black/90' : 'text-white/90'
                    }`}
                    title={isFa ? "ارسال ایمیل مستقیم" : "Send direct email"}
                  >
                    {studioEmail}
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className={`p-1.2 rounded transition-all duration-200 border cursor-pointer ${
                      copied 
                        ? 'border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]' 
                        : isLight
                          ? 'border-black/15 text-black/60 hover:border-black hover:text-black'
                          : 'border-white/15 text-white/60 hover:border-white hover:text-white'
                    }`}
                    title={copied ? (isFa ? 'کپی شد!' : 'Copied!') : (isFa ? 'کپی آدرس ایمیل' : 'Copy email address')}
                    aria-label="Copy Email"
                  >
                    {copied ? (
                      <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125V11.25c0-.621.504-1.125 1.125-1.125h3.375m0 0.75V4.875c0-.621.504-1.125 1.125-1.125h8.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-8.25c-.621 0-1.125-.504-1.125-1.125z" />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Social Links Stack */}
                <div className="space-y-1.5 pt-1">
                  <a href={instagramUrl} target="_blank" rel="noreferrer" className="block opacity-75 hover:opacity-100 hover:text-[#00f0ff] transition-all">Instagram</a>
                  <a href="https://www.behance.net/siawsh" target="_blank" rel="noreferrer" className="block opacity-75 hover:opacity-100 hover:text-[#00f0ff] transition-all">Behance</a>
                  <a href="https://www.linkedin.com/in/siavash-afsari/" target="_blank" rel="noreferrer" className="block opacity-75 hover:opacity-100 hover:text-[#00f0ff] transition-all">LinkedIn</a>
                  <a href="https://vimeo.com/siawsh" target="_blank" rel="noreferrer" className="block opacity-75 hover:opacity-100 hover:text-[#00f0ff] transition-all">Vimeo</a>
                </div>

              </div>
            </div>

            {/* Disciplines Column */}
            <div className="space-y-3">
              <h4 className="text-xs md:text-sm font-semibold opacity-60">
                {t?.footer?.discipline || (isFa ? 'حوزه‌های فعالیت' : 'Disciplines')}
              </h4>
              <div className="space-y-2 text-xs md:text-sm opacity-80 leading-relaxed">
                <p>{mode === 'spatial' ? (t?.footer?.arch || 'معماری و طراحی داخلی') : (t?.footer?.motion || 'مووشن گرافیک و جلوه‌های سه‌بعدی')}</p>
                <p>{mode === 'spatial' ? (t?.footer?.furniture || 'طراحی شیء و مبلمان') : (t?.footer?.branding || 'هویت بصری پویا')}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-xs opacity-70">
          <p dir="ltr">
            {t?.footer?.copyright 
              ? t.footer.copyright.replace('{year}', new Date().getFullYear().toString())
              : `© ${new Date().getFullYear()} Siavash Studio. All rights reserved.`}
          </p>
          <button 
            type="button" 
            onClick={scrollToTop} 
            className="hover:opacity-100 transition-opacity flex items-center gap-1.5 cursor-pointer"
          >
            <span>{isFa ? 'بازگشت به بالا' : 'Back to Top'}</span>
            <span>↑</span>
          </button>
        </div>

      </div>
    </footer>
  );
}
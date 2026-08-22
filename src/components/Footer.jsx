import React from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function Footer() {
  const { mode, t } = useStudioTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const instagramUrl = mode === 'spatial' 
    ? 'https://www.instagram.com/siawsh/' 
    : 'https://www.instagram.com/siafsari/';

  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-7xl px-6 md:px-12 w-full footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#hero" className="logo">
              SIAWSH<span>.CO</span>
            </a>
            <p className="footer-status">
              <span className="status-dot"></span>
              {t.footer.status}
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>{t.footer.connect}</h4>
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="footer-link"
              >
                Instagram
              </a>
              <a 
                href="https://www.behance.net/siawsh" 
                target="_blank" 
                rel="noreferrer" 
                className="footer-link"
              >
                Behance
              </a>
              <a 
                href="https://www.linkedin.com/in/siavash-afsari/" 
                target="_blank" 
                rel="noreferrer" 
                className="footer-link"
              >
                LinkedIn
              </a>
              <a 
                href="https://vimeo.com/siawsh" 
                target="_blank" 
                rel="noreferrer" 
                className="footer-link"
              >
                Vimeo
              </a>
            </div>

            <div className="footer-col">
              <h4>{t.footer.discipline}</h4>
              <span>{mode === 'spatial' ? t.footer.arch : t.footer.motion}</span>
              <span>{mode === 'spatial' ? t.footer.furniture : t.footer.branding}</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t.footer.copyright.replace('{year}', new Date().getFullYear())}</p>
          <button type="button" onClick={scrollToTop} className="back-to-top-btn">
            ↑ {t.footer.backToTop}
          </button>
        </div>
      </div>
    </footer>
  );
}

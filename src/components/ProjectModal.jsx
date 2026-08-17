import React, { useEffect } from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function ProjectModal({ project, onClose }) {
  const { isLight } = useStudioTheme();

  // Handle ESC key press and body lock
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const {
    title,
    subtitle,
    tagline,
    heroImage,
    heroVideo,
    contextParagraph,
    contextImage,
    mainParagraph,
    mainImage,
    recognition,
    theySaidTitle,
    theySaidParagraph,
    theySaidImages
  } = project;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 md:p-8 backdrop-blur-md">
      {/* Background click listener */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Scroll Container */}
      <div 
        data-lenis-prevent="true"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        className={`relative z-10 my-auto flex h-full max-h-[85vh] w-full max-w-5xl flex-col overflow-y-auto rounded-none border shadow-2xl overscroll-contain transition-all duration-300 ${
          isLight ? 'border-black/20 bg-white text-black' : 'border-white/20 bg-[#111] text-white'
        }`}
      >
        {/* Sticky Header */}
        <div className={`sticky top-0 z-30 flex items-center justify-between border-b px-6 py-4 backdrop-blur-md ${
          isLight ? 'border-black/10 bg-white/95' : 'border-white/10 bg-[#111]/95'
        }`}>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">{tagline}</span>
            <h2 className="text-xl font-medium tracking-tight">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            className={`flex h-8 w-8 items-center justify-center rounded-none border text-xs font-mono transition-colors ${
              isLight ? 'border-black/20 hover:bg-black hover:text-white' : 'border-white/20 hover:bg-white hover:text-black'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 md:p-10 space-y-10">
          <div className="w-full overflow-hidden bg-neutral-900" style={{ aspectRatio: '16 / 9' }}>
            {heroVideo ? (
              <video src={heroVideo} autoPlay loop muted playsInline className="h-full w-full object-cover" />
            ) : (
              <img src={heroImage} alt={title} className="h-full w-full object-cover" />
            )}
          </div>

          {subtitle && <p className="text-xl md:text-2xl font-light leading-relaxed">{subtitle}</p>}

          {contextParagraph && (
            <div className={`border-l-2 pl-6 py-2 text-sm md:text-base leading-relaxed ${
              isLight ? 'border-black/20 text-neutral-700' : 'border-white/20 text-neutral-300'
            }`}>
              {contextParagraph}
            </div>
          )}

          {contextImage && <img src={contextImage} alt="Context" className="w-full object-cover" />}

          {mainParagraph && <p className="text-sm md:text-base leading-relaxed text-neutral-400">{mainParagraph}</p>}

          {mainImage && <img src={mainImage} alt="Main detail" className="w-full object-cover" />}

          {recognition && (
            <div className={`border-t border-b py-4 text-xs font-semibold uppercase tracking-widest ${
              isLight ? 'border-black/10 text-neutral-600' : 'border-white/10 text-neutral-400'
            }`}>
              Recognition: {recognition}
            </div>
          )}

          {theySaidParagraph && (
            <div className={`p-6 border space-y-2 ${
              isLight ? 'border-black/10 bg-neutral-50' : 'border-white/10 bg-neutral-900/50'
            }`}>
              {theySaidTitle && <h4 className="text-xs uppercase tracking-widest text-neutral-400">{theySaidTitle}</h4>}
              <p className="text-sm italic">{theySaidParagraph}</p>
            </div>
          )}

          {theySaidImages && theySaidImages.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {theySaidImages.map((img, idx) => (
                <img key={idx} src={img} alt="Detail" className="w-full object-cover" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
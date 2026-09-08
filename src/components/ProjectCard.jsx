import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function ProjectCard({ project }) {
  const { isLight, t, language } = useStudioTheme();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  if (!project) return null;

  const { id, title, tagline, heroImage, heroVideo, aspectRatio } = project;

  // Determine active language and safely pull translated string or fallback to raw JS value
  const activeTitle = language === 'fa' && t?.projects?.[id]?.title 
    ? t.projects[id].title 
    : title;

  const activeTagline = language === 'fa' && t?.projects?.[id]?.tagline 
    ? t.projects[id].tagline 
    : tagline;

  let computedRatio = '16 / 10';
  if (aspectRatio === 'square') computedRatio = '1 / 1';
  if (aspectRatio === 'portrait') computedRatio = '3 / 4';

  const playPreview = () => {
    videoRef.current?.play().catch(() => {});
  };

  const pausePreview = () => {
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <div 
      onClick={() => navigate(`/work/${id}`)}
      dir={language === 'fa' ? 'rtl' : 'ltr'}
      className="group relative cursor-pointer overflow-hidden rounded-none transition-all duration-500 hover:-translate-y-2"
      style={{
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        background: isLight
          ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.52) 0%, rgba(240, 240, 245, 0.38) 100%)'
          : 'linear-gradient(180deg, rgba(18, 18, 22, 0.55) 0%, rgba(8, 8, 12, 0.42) 100%)',
        border: isLight
          ? '1px solid rgba(255, 255, 255, 0.6)'
          : '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: isLight
          ? `inset 0 1px 0 0 rgba(255, 255, 255, 0.8),
             inset 0 -1px 0 0 rgba(0, 0, 0, 0.04),
             0 8px 32px 0 rgba(0, 0, 0, 0.06)`
          : `inset 0 1px 0 0 rgba(255, 255, 255, 0.22),
             inset 0 -1px 0 0 rgba(0, 0, 0, 0.6),
             0 12px 40px 0 rgba(0, 0, 0, 0.5)`,
      }}
    >
      {/* Background Neon Glow Effect (Light Theme) */}
      {isLight && (
        <div 
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-32 w-3/4 -translate-x-1/2 rounded-full opacity-60 transition-all duration-700 blur-2xl group-hover:scale-110 group-hover:opacity-90"
          style={{
            background: 'radial-gradient(circle, rgba(140, 160, 255, 0.35) 0%, rgba(180, 200, 255, 0.15) 60%, rgba(255, 255, 255, 0) 100%)',
          }}
        />
      )}

      <div 
        style={{ aspectRatio: computedRatio }} 
        className={`w-full overflow-hidden rounded-none ${isLight ? 'bg-neutral-200/50' : 'bg-neutral-900/50'}`}
      >
        {heroVideo ? (
          <video
            ref={videoRef}
            src={heroVideo}
            loop
            muted
            playsInline
            preload="none"
            poster={heroImage}
            onMouseEnter={playPreview}
            onMouseLeave={pausePreview}
            className="h-full w-full object-cover rounded-none transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <img 
            src={heroImage} 
            alt={activeTitle || t?.projectCard?.previewAlt || 'Project Preview'}
            loading="lazy"
            className="h-full w-full object-cover rounded-none transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
      </div>

      <div 
        className="flex items-center justify-between border-t p-4 rounded-none transition-colors"
        style={{
          borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)',
        }}
      >
        <h3 
          className={`text-base font-medium tracking-tight ${isLight ? 'text-neutral-900' : 'text-white/90'}`}
          style={{
            textShadow: isLight 
              ? '0 1px 2px rgba(255,255,255,0.8)' 
              : '0 1px 3px rgba(0,0,0,0.8)',
          }}
        >
          {activeTitle}
        </h3>
        {activeTagline && (
          <span 
            className={`text-[10px] font-semibold uppercase tracking-widest ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}
            style={{
              textShadow: isLight 
                ? '0 1px 2px rgba(255,255,255,0.8)' 
                : '0 1px 3px rgba(0,0,0,0.8)',
            }}
          >
            {activeTagline}
          </span>
        )}
      </div>
    </div>
  );
}
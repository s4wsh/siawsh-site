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
      className={`group relative cursor-pointer overflow-hidden border rounded-none transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
        isLight 
          ? 'border-black/10 bg-neutral-100 hover:border-black/30' 
          : 'border-white/10 bg-[#111] hover:border-white/20'
      }`}
    >
      <div 
        style={{ aspectRatio: computedRatio }} 
        className={`w-full overflow-hidden rounded-none ${isLight ? 'bg-neutral-200' : 'bg-neutral-900'}`}
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

      <div className={`flex items-center justify-between border-t p-4 rounded-none transition-colors ${
        isLight ? 'border-black/5 text-black' : 'border-white/5 text-white'
      }`}>
        <h3 className={`text-base font-medium tracking-tight ${isLight ? 'text-neutral-900' : 'text-white/90'}`}>
          {activeTitle}
        </h3>
        {activeTagline && (
          <span className={`text-[10px] font-semibold uppercase tracking-widest ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
            {activeTagline}
          </span>
        )}
      </div>
    </div>
  );
}
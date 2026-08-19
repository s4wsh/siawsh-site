import React from 'react';
import { useStudioTheme } from "../context/ThemeContext.jsx";

export default function HeroSection() {
  const { mode, t, isLight } = useStudioTheme();

  return (
    <header className="relative flex min-h-[85vh] w-full flex-col justify-end pb-16 pt-40" id="hero">
      {/* Background Media with full visibility and subtle contrast overlay */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        {mode === 'spatial' ? (
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80"
            alt="Spatial Practice Banner"
            className="h-full w-full object-cover"
          />
        ) : (
          <img
            src="/images/hero_cinematic.webp"
            alt="Cinematic Practice Banner"
            className="h-full w-full object-cover"
          />
        )}
        
        {/* Dynamic gradient overlay updated for Tailwind CSS v4 syntax */}
        <div className={`absolute inset-0 transition-colors duration-500 ${
          isLight 
            ? 'bg-linear-to-t from-white via-white/60 to-transparent' 
            : 'bg-linear-to-t from-black via-black/70 to-transparent'
        }`} />
      </div>

      {/* Hero Content Container aligned with page margin */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 w-full space-y-8">
        
        {/* Badge / Practice Category */}
        <div>
          <span className={`text-xs font-semibold uppercase tracking-widest ${
            isLight ? 'text-black/70' : 'text-white/70'
          }`}>
            {mode === 'spatial' ? t.hero?.badgeSpatial || 'Spatial Practice' : t.hero?.badgeCinematic || 'Cinematic Practice'}
          </span>
        </div>

        {/* Main Title Statement */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight tracking-tight max-w-4xl">
          {mode === 'spatial' 
            ? t.hero?.titleSpatial || 'Architectural precision and structural minimalism for physical environments.' 
            : t.hero?.titleCinematic || 'Motion design, 3D visual direction, and kinetic identity systems.'
          }
        </h1>

        {/* Meta Details Strip */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6 ${
          isLight ? 'border-black/20 text-black' : 'border-white/20 text-white'
        }`}>
          <div>
            <div className={`text-[10px] font-semibold uppercase tracking-widest ${isLight ? 'text-black/50' : 'text-white/50'}`}>
              Location
            </div>
            <div className="text-sm font-medium mt-1">Tehran & Remote</div>
          </div>
          <div>
            <div className={`text-[10px] font-semibold uppercase tracking-widest ${isLight ? 'text-black/50' : 'text-white/50'}`}>
              Status
            </div>
            <div className="text-sm font-medium mt-1">Available for Commissions</div>
          </div>
          <div>
            <div className={`text-[10px] font-semibold uppercase tracking-widest ${isLight ? 'text-black/50' : 'text-white/50'}`}>
              Disciplines
            </div>
            <div className="text-sm font-medium mt-1">Spatial, Motion & Identity</div>
          </div>
        </div>

      </div>
    </header>
  );
}
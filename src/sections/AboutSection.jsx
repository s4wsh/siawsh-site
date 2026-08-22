import React from 'react';
import { useStudioTheme } from '../context/ThemeContext.jsx';

export default function AboutSection() {
  const { t, mode } = useStudioTheme();

  const capabilities = t.about.capabilities;

  // Dynamically select the cinematic or spatial paragraph based on active mode
  const dynamicParagraph =
    mode === 'cinematic'
      ? t.about.paragraphCinematic
      : t.about.paragraphSpatial || t.about.paragraphTwo;

  return (
    <section className="about-section py-20" id="about">
      {/* Standardized alignment wrapper */}
      <div className="mx-auto max-w-7xl px-6 md:px-12 w-full space-y-16">
        
        {/* Main Narrative & Header */}
        <div className="about-grid grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="about-container lg:col-span-5 space-y-3">
            <h2 className="text-3xl md:text-5xl font-light tracking-tight">
              {t.about.title}
            </h2>
            <p className="text-xl md:text-2xl font-normal leading-snug opacity-90">
              {t.about.lead}
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6 text-base md:text-lg leading-relaxed opacity-80">
            <p>
              {t.about.paragraphOne}
            </p>
            <p>
              {dynamicParagraph}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 gap-8 border-y border-white/10 py-8">
          <div className="stat-card">
            <span className="stat-number block text-4xl md:text-5xl font-light mb-1">{t.about.yearsValue}</span>
            <span className="stat-label text-xs md:text-sm uppercase tracking-widest opacity-70">{t.about.yearsLabel}</span>
          </div>
          <div className="stat-card">
            <span className="stat-number block text-4xl md:text-5xl font-light mb-1">{t.about.projectsValue}</span>
            <span className="stat-label text-xs md:text-sm uppercase tracking-widest opacity-70">{t.about.projectsLabel}</span>
          </div>
        </div>

        {/* Core Capabilities */}
        <div className="capabilities-block space-y-8">
          <h3 className="text-lg md:text-xl font-semibold tracking-wide text-white/90">
            {t.about.capabilitiesTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => (
              <div key={cap.number} className="capability-card p-6 border border-white/10 rounded-lg space-y-3">
                <span className="text-sm md:text-base font-mono opacity-70 block">{cap.number}</span>
                <h4 className="text-lg md:text-xl font-medium">{cap.title}</h4>
                <p className="text-sm md:text-base opacity-85 leading-relaxed">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* The Process */}
        <div className="process-block p-8 border border-white/10 rounded-xl space-y-3">
          <h3 className="text-lg md:text-xl font-semibold tracking-wide text-white/90">
            {t.about.processTitle}
          </h3>
          <p className="text-base md:text-lg leading-relaxed opacity-90">
            {t.about.processDescription}
          </p>
        </div>

      </div>
    </section>
  );
}